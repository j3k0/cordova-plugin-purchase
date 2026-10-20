import Foundation
import Capacitor
import StoreKit

@available(iOS 15.0, *)
private class SK2State {
    var products: [String: Product] = [:]
    /// Transactions emitted to JS and not yet finished. Access must be
    /// serialized on the main thread (same as processedTransactionIds below):
    /// the detached Transaction.updates observer, emitTransactionUpdate(),
    /// finish(), and clearExpiredUnfinishedTransactions() all read or
    /// mutate it from concurrent async contexts.
    var unfinishedTransactions: [String: Transaction] = [:]
    var transactionObserverTask: Task<Void, Never>?
    /// Transaction IDs already emitted to JS. Prevents duplicate delivery when
    /// both init() (via currentEntitlements) and Transaction.updates deliver
    /// the same transaction. Access must be serialized on the main thread.
    var processedTransactionIds: Set<UInt64> = []
}

@objc(PurchasePlugin)
public class PurchasePlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "PurchasePlugin"
    public let jsName = "PurchasePlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "init", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "load", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "finish", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "canMakePayments", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "manageSubscriptions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "manageBilling", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "presentCodeRedemptionSheet", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "refreshReceipts", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "loadReceipts", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getStorefront", returnType: CAPPluginReturnPromise),
    ]

    private var _sk2State: AnyObject?
    private var debugEnabled = false

    @available(iOS 15.0, *)
    private var sk2: SK2State {
        if let s = _sk2State as? SK2State { return s }
        let s = SK2State()
        _sk2State = s
        return s
    }

    // MARK: - Lifecycle

    deinit {
        if #available(iOS 15.0, *) {
            sk2.transactionObserverTask?.cancel()
        }
    }

    /// Start listening to Transaction.updates. Called at the end of init(),
    /// NOT at plugin load: Transaction.updates delivers unfinished
    /// transactions as soon as iteration begins, and before JS called init()
    /// no listener is attached — the events would be lost while their ids
    /// still land in processedTransactionIds, hiding unfinished purchases
    /// for the rest of the session.
    @available(iOS 15.0, *)
    private func startTransactionObserver() {
        guard sk2.transactionObserverTask == nil else { return }
        sk2.transactionObserverTask = Task.detached { [weak self] in
            for await result in Transaction.updates {
                guard let self = self else { return }
                await self.handleTransactionUpdate(result)
            }
        }
    }

    @available(iOS 15.0, *)
    private func handleTransactionUpdate(_ result: VerificationResult<Transaction>) async {
        let jwsRepresentation = result.jwsRepresentation
        switch result {
        case .verified(let transaction):
            guard await markEmittedToJs(transaction.id) else {
                debugLog("Transaction.updates: skipping duplicate id=\(transaction.id)")
                return
            }
            await emitTransactionUpdate(transaction, state: "PaymentTransactionStatePurchased",
                                        jwsRepresentation: jwsRepresentation)
        case .unverified(let transaction, _):
            // Emit as Purchased — let JS layer handle verification.
            // Deliberately NOT deduped via markEmittedToJs: marking an
            // unverified id would suppress the transaction for the rest of
            // the session even if a later delivery verifies. A double-emit of
            // the same JWS is harmless — JS re-validates it.
            await emitTransactionUpdate(transaction, state: "PaymentTransactionStatePurchased",
                                        jwsRepresentation: jwsRepresentation)
        }
    }

    // MARK: - Plugin Methods

    @objc func `init`(_ call: CAPPluginCall) {
        guard #available(iOS 15.0, *) else {
            call.reject("In-app purchases require iOS 15.0 or later")
            return
        }
        debugEnabled = call.getBool("debug", false)
        debugLog("init")

        // Load current entitlements and unfinished transactions, and emit them
        // to JS so existing purchases are visible immediately on app launch
        // (without requiring a manual restore).
        Task {
            let (entitlements, unfinishedIds) = await self.entitlementsWithUnfinishedIds()
            for result in entitlements {
                switch result {
                case .verified(let transaction):
                    if transaction.isUpgraded {
                        debugLog("init: skipping upgraded entitlement id=\(transaction.id) product=\(transaction.productID)")
                        continue
                    }
                    guard await self.markEmittedToJs(transaction.id) else {
                        debugLog("init: skipping already-emitted entitlement id=\(transaction.id)")
                        continue
                    }
                    await self.emitTransactionUpdate(transaction,
                        state: "PaymentTransactionStateRestored",
                        jwsRepresentation: result.jwsRepresentation,
                        isFinished: !unfinishedIds.contains(transaction.id))
                case .unverified(let transaction, let error):
                    debugLog("init: unverified entitlement id=\(transaction.id) product=\(transaction.productID) error=\(error)")
                }
            }
            // Emit every transaction the app hasn't finished yet. This is the
            // only reliable source for unfinished consumables: they never
            // appear in currentEntitlements, so without this pass an
            // unfinished consumable would hang in limbo for the session.
            for await result in Transaction.unfinished {
                switch result {
                case .verified(let transaction):
                    if transaction.isUpgraded {
                        debugLog("init: skipping upgraded unfinished transaction id=\(transaction.id) product=\(transaction.productID)")
                        continue
                    }
                    guard await self.markEmittedToJs(transaction.id) else { continue }
                    debugLog("init: emitting unfinished transaction id=\(transaction.id) product=\(transaction.productID)")
                    await self.emitTransactionUpdate(transaction,
                        state: "PaymentTransactionStateRestored",
                        jwsRepresentation: result.jwsRepresentation,
                        isFinished: false)
                case .unverified(let transaction, let error):
                    debugLog("init: unverified unfinished transaction id=\(transaction.id) product=\(transaction.productID) error=\(error)")
                }
            }
            // Only now start observing Transaction.updates — see the comment
            // on startTransactionObserver() for why starting earlier loses
            // unfinished transactions.
            self.startTransactionObserver()
            call.resolve()
        }
    }

    @objc func load(_ call: CAPPluginCall) {
        guard #available(iOS 15.0, *) else {
            call.reject("In-app purchases require iOS 15.0 or later")
            return
        }
        guard let productIds = call.getArray("productIds") as? [String] else {
            call.reject("productIds is required")
            return
        }
        debugLog("load: \(productIds)")

        Task {
            do {
                let storeProducts = try await Product.products(for: Set(productIds))
                var validProducts: [[String: Any]] = []
                var validIds = Set<String>()

                for product in storeProducts {
                    sk2.products[product.id] = product
                    validProducts.append(await productToDict(product))
                    validIds.insert(product.id)
                }

                let invalidIds = productIds.filter { !validIds.contains($0) }

                call.resolve([
                    "validProducts": validProducts,
                    "invalidProductIds": invalidIds
                ])
            } catch {
                call.reject("Failed to load products: \(error.localizedDescription)")
            }
        }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        guard #available(iOS 15.0, *) else {
            call.reject("In-app purchases require iOS 15.0 or later")
            return
        }
        guard let productId = call.getString("productId") else {
            call.reject("productId is required")
            return
        }
        let quantity = call.getInt("quantity") ?? 1
        debugLog("purchase: \(productId) quantity:\(quantity)")

        guard let product = sk2.products[productId] else {
            call.reject("Product not loaded: \(productId)")
            return
        }

        Task {
            do {
                var options: Set<Product.PurchaseOption> = []
                if let username = call.getString("applicationUsername"), !username.isEmpty {
                    if let uuid = UUID(uuidString: username) {
                        options.insert(.appAccountToken(uuid))
                    } else {
                        debugLog("applicationUsername is not a valid UUID, appAccountToken will not be set: \(username)")
                    }
                }
                if quantity > 1 {
                    options.insert(.quantity(quantity))
                }

                // Clear expired unfinished transactions that could block the purchase
                await clearExpiredUnfinishedTransactions()

                let result = try await product.purchase(options: options)
                switch result {
                case .success(let verification):
                    let jwsRepresentation = verification.jwsRepresentation
                    switch verification {
                    case .verified(let transaction):
                        _ = await markEmittedToJs(transaction.id)
                        await emitTransactionUpdate(transaction,
                                                    state: "PaymentTransactionStatePurchased",
                                                    jwsRepresentation: jwsRepresentation)
                    case .unverified(let transaction, _):
                        // Emit as Purchased — let JS handle verification.
                        // Deliberately not deduped — see handleTransactionUpdate.
                        await emitTransactionUpdate(transaction,
                                                    state: "PaymentTransactionStatePurchased",
                                                    jwsRepresentation: jwsRepresentation)
                    }
                    call.resolve()
                case .userCancelled:
                    notifyListeners("transactionUpdated", data: [
                        "state": "PaymentTransactionStateFailed",
                        "errorCode": 6777006,
                        "errorText": "Payment cancelled",
                        "productId": productId,
                        "transactionIdentifier": "",
                    ])
                    call.resolve()
                case .pending:
                    notifyListeners("transactionUpdated", data: [
                        "state": "PaymentTransactionStateDeferred",
                        "productId": productId,
                        "transactionIdentifier": "",
                    ])
                    call.resolve()
                @unknown default:
                    call.reject("Unknown purchase result")
                }
            } catch {
                call.reject("Purchase failed: \(error.localizedDescription)")
            }
        }
    }

    @objc func finish(_ call: CAPPluginCall) {
        guard #available(iOS 15.0, *) else {
            call.reject("In-app purchases require iOS 15.0 or later")
            return
        }
        guard let transactionId = call.getString("transactionId") else {
            call.reject("transactionId is required")
            return
        }
        debugLog("finish: \(transactionId)")

        Task {
            // Atomically claim the transaction on the main thread: read and
            // removal must be one step, or two concurrent finish() calls for
            // the same id could both proceed. Serialized because the detached
            // Transaction.updates observer also mutates the dictionary.
            let transaction: Transaction? = await MainActor.run {
                guard let t = sk2.unfinishedTransactions[transactionId] else { return nil }
                _ = sk2.unfinishedTransactions.removeValue(forKey: transactionId)
                return t
            }
            if let transaction = transaction {
                await transaction.finish()
                // Note: do NOT remove from processedTransactionIds here.
                // Once a transaction ID has been emitted to JS, it must stay in the set
                // for the lifetime of the session to prevent Transaction.updates from
                // re-delivering it.
                notifyListeners("transactionUpdated", data: [
                    "state": "PaymentTransactionStateFinished",
                    "transactionIdentifier": transactionId,
                    "productId": transaction.productID,
                    "quantity": transaction.purchasedQuantity,
                ])
            }
            call.resolve()
        }
    }

    @objc func canMakePayments(_ call: CAPPluginCall) {
        guard #available(iOS 15.0, *) else {
            call.resolve(["canMakePayments": false])
            return
        }
        call.resolve(["canMakePayments": AppStore.canMakePayments])
    }

    @objc func restore(_ call: CAPPluginCall) {
        guard #available(iOS 15.0, *) else {
            call.reject("In-app purchases require iOS 15.0 or later")
            return
        }
        debugLog("restore")
        Task {
            do {
                try await AppStore.sync()
                let (entitlements, unfinishedIds) = await entitlementsWithUnfinishedIds()
                for result in entitlements {
                    switch result {
                    case .verified(let transaction):
                        if transaction.isUpgraded {
                            debugLog("restore: skipping upgraded entitlement id=\(transaction.id) product=\(transaction.productID)")
                            continue
                        }
                        // Restore deliberately re-emits transactions already
                        // delivered this session — mark, but ignore the result.
                        _ = await markEmittedToJs(transaction.id)
                        await emitTransactionUpdate(transaction,
                                                    state: "PaymentTransactionStateRestored",
                                                    jwsRepresentation: result.jwsRepresentation,
                                                    isFinished: !unfinishedIds.contains(transaction.id))
                    case .unverified(let transaction, let error):
                        debugLog("restore: unverified entitlement id=\(transaction.id) product=\(transaction.productID) error=\(error)")
                    }
                }
                notifyListeners("restoreCompleted", data: [:])
                call.resolve()
            } catch {
                notifyListeners("restoreFailed", data: ["errorCode": 0])
                call.reject("Restore failed: \(error.localizedDescription)")
            }
        }
    }

    @objc func manageSubscriptions(_ call: CAPPluginCall) {
        guard #available(iOS 15.0, *) else {
            call.reject("Managing subscriptions requires iOS 15.0 or later")
            return
        }
        Task { @MainActor in
            if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
                try? await AppStore.showManageSubscriptions(in: scene)
            }
            call.resolve()
        }
    }

    @objc func manageBilling(_ call: CAPPluginCall) {
        // No direct equivalent in SK2; resolve silently
        call.resolve()
    }

    @objc func presentCodeRedemptionSheet(_ call: CAPPluginCall) {
        Task { @MainActor in
            if #available(iOS 16.0, *) {
                if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
                    try? await AppStore.presentOfferCodeRedeemSheet(in: scene)
                }
            }
            call.resolve()
        }
    }

    @objc func refreshReceipts(_ call: CAPPluginCall) {
        guard #available(iOS 16.0, *) else {
            call.reject("refreshReceipts requires iOS 16.0 or later")
            return
        }
        Task {
            do {
                let appTransaction = try await AppTransaction.shared
                switch appTransaction {
                case .verified(let transaction):
                    call.resolve(["receipt": [
                        "bundleIdentifier": transaction.bundleID,
                        "appVersion": transaction.appVersion,
                    ]])
                case .unverified(_, _):
                    call.reject("App transaction verification failed")
                }
            } catch {
                call.reject("Failed to refresh receipts: \(error.localizedDescription)")
            }
        }
    }

    @objc func loadReceipts(_ call: CAPPluginCall) {
        // Same as refreshReceipts for SK2
        refreshReceipts(call)
    }

    @objc func getStorefront(_ call: CAPPluginCall) {
        // Try StoreKit 1 first (available from iOS 13).
        if let storefront = SKPaymentQueue.default().storefront {
            debugLog("getStorefront: \(storefront.countryCode)")
            call.resolve(["countryCode": storefront.countryCode])
            return
        }
        // Fallback to StoreKit 2's Storefront.current (available iOS 15+).
        // This works on Mac Catalyst where SK1's storefront is nil.
        if #available(iOS 15.0, macOS 12.0, *) {
            Task {
                if let storefront = await Storefront.current {
                    debugLog("getStorefront (SK2 fallback): \(storefront.countryCode)")
                    call.resolve(["countryCode": storefront.countryCode])
                } else {
                    debugLog("getStorefront: storefront not available")
                    call.reject("Storefront not available")
                }
            }
            return
        }
        debugLog("getStorefront: storefront not available")
        call.reject("Storefront not available")
    }

    // MARK: - Helpers

    /// Finish any unfinished transactions whose subscription has already expired.
    /// Stale unfinished transactions can block product.purchase() from initiating
    /// a new purchase flow (confirmed on Apple Developer Forums).
    @available(iOS 15.0, *)
    private func clearExpiredUnfinishedTransactions() async {
        for await result in Transaction.unfinished {
            guard case .verified(let transaction) = result else { continue }
            if let expirationDate = transaction.expirationDate, expirationDate < Date() {
                debugLog("clearExpired: finishing expired transaction id=\(transaction.id) product=\(transaction.productID) expired=\(expirationDate)")
                await transaction.finish()
                await MainActor.run {
                    _ = sk2.unfinishedTransactions.removeValue(forKey: String(transaction.id))
                }
                // Note: do NOT remove from processedTransactionIds.
                // The set must grow monotonically to prevent re-delivery via Transaction.updates.
            }
        }
    }

    /// Current entitlements, plus the ids of every transaction the app has
    /// not finished yet. Used to tell finished entitlements apart from
    /// unfinished ones: finished non-consumables and non-renewing
    /// subscriptions stay in Transaction.currentEntitlements and are
    /// re-emitted at every launch.
    ///
    /// The unfinished snapshot is taken AFTER listing entitlements, so an
    /// entitlement is never wrongly reported as finished: anything listed
    /// that is still unfinished is in the snapshot. The only possible error
    /// is the safe one (finished in between, reported as unfinished).
    @available(iOS 15.0, *)
    private func entitlementsWithUnfinishedIds() async -> ([VerificationResult<Transaction>], Set<UInt64>) {
        var entitlements: [VerificationResult<Transaction>] = []
        for await result in Transaction.currentEntitlements {
            entitlements.append(result)
        }
        var ids = Set<UInt64>()
        for await result in Transaction.unfinished {
            ids.insert(result.unsafePayloadValue.id)
        }
        return (entitlements, ids)
    }

    /// Atomically check-and-mark a transaction id as emitted to the JS layer.
    /// Returns false when it was already emitted this session. "Emitted" is
    /// unrelated to Apple's finished state — it only prevents duplicate
    /// delivery of the same transaction within one app session. Serialized on
    /// the main thread because the Transaction.updates observer runs in a
    /// detached Task while init()/restore()/purchase() run in their own Tasks.
    @available(iOS 15.0, *)
    private func markEmittedToJs(_ id: UInt64) async -> Bool {
        return await MainActor.run {
            if sk2.processedTransactionIds.contains(id) { return false }
            sk2.processedTransactionIds.insert(id)
            return true
        }
    }

    @available(iOS 15.0, *)
    private func emitTransactionUpdate(_ transaction: Transaction, state: String,
                                       errorCode: Int? = nil, errorText: String? = nil,
                                       jwsRepresentation: String? = nil,
                                       isFinished: Bool? = nil) async {
        let transactionId = String(transaction.id)
        // Serialized on the main thread — see SK2State.unfinishedTransactions.
        await MainActor.run {
            sk2.unfinishedTransactions[transactionId] = transaction
        }

        var data: [String: Any] = [
            "state": state,
            "transactionIdentifier": transactionId,
            "productId": transaction.productID,
            "quantity": transaction.purchasedQuantity,
        ]

        if let errorCode = errorCode { data["errorCode"] = errorCode }
        if let errorText = errorText { data["errorText"] = errorText }
        // Only set originalTransactionIdentifier when it differs from the current ID
        if transaction.originalID != transaction.id {
            data["originalTransactionIdentifier"] = String(transaction.originalID)
        }
        // Use milliseconds-since-epoch to match SK2 bridge expectations
        data["transactionDate"] = String(Int(transaction.purchaseDate.timeIntervalSince1970 * 1000))

        if let expirationDate = transaction.expirationDate {
            data["expirationDate"] = String(Int(expirationDate.timeIntervalSince1970 * 1000))
        }
        if let jws = jwsRepresentation {
            data["jwsRepresentation"] = jws
        }
        // Whether the app already called finish() on this transaction. Only
        // set when known (Restored emissions), so JS can skip re-delivery.
        if let isFinished = isFinished {
            data["isFinished"] = isFinished
        }

        notifyListeners("transactionUpdated", data: data)
    }

    @available(iOS 15.0, *)
    private func productToDict(_ product: Product) async -> [String: Any] {
        var dict: [String: Any] = [
            "id": product.id,
            "title": product.displayName,
            "description": product.description,
            "price": product.displayPrice,
            "priceMicros": NSDecimalNumber(decimal: product.price)
                .multiplying(by: 1000000).int64Value,
            "currency": product.priceFormatStyle.currencyCode,
            "countryCode": {
                if #available(iOS 16.0, *) {
                    return product.priceFormatStyle.locale.region?.identifier ?? ""
                } else {
                    return Locale.current.regionCode ?? ""
                }
            }(),
        ]

        if let subscription = product.subscription {
            let unit = subscription.subscriptionPeriod.unit
            let value = subscription.subscriptionPeriod.value
            dict["billingPeriod"] = value
            dict["billingPeriodUnit"] = periodUnitToString(unit)
            dict["group"] = subscription.subscriptionGroupID

            // Introductory offer
            if let intro = subscription.introductoryOffer {
                dict["introPrice"] = intro.displayPrice
                dict["introPriceMicros"] = NSDecimalNumber(decimal: intro.price)
                    .multiplying(by: 1000000).int64Value
                dict["introPricePeriod"] = intro.period.value
                dict["introPricePeriodUnit"] = periodUnitToString(intro.period.unit)
                dict["introPricePaymentMode"] = paymentModeToString(intro.paymentMode)
                // StoreKit 2 eligibility — honors the user's prior subscription/trial history.
                // Only meaningful when an intro offer exists; omitted otherwise so older TS
                // builds that don't know about this field keep their SK1-era behavior.
                dict["introPriceEligible"] = await subscription.isEligibleForIntroOffer
            }

            // Promotional offers (discounts)
            var discounts: [[String: Any]] = []
            for offer in subscription.promotionalOffers {
                discounts.append([
                    "id": offer.id ?? "",
                    "type": "Subscription",
                    "price": offer.displayPrice,
                    "priceMicros": NSDecimalNumber(decimal: offer.price)
                        .multiplying(by: 1000000).int64Value,
                    "period": offer.period.value,
                    "periodUnit": periodUnitToString(offer.period.unit),
                    "paymentMode": paymentModeToString(offer.paymentMode),
                ])
            }
            if !discounts.isEmpty {
                dict["discounts"] = discounts
            }
        }

        return dict
    }

    @available(iOS 15.0, *)
    private func periodUnitToString(_ unit: Product.SubscriptionPeriod.Unit) -> String {
        switch unit {
        case .day: return "Day"
        case .week: return "Week"
        case .month: return "Month"
        case .year: return "Year"
        @unknown default: return "Day"
        }
    }

    @available(iOS 15.0, *)
    private func paymentModeToString(_ mode: Product.SubscriptionOffer.PaymentMode) -> String {
        switch mode {
        case .payAsYouGo: return "PayAsYouGo"
        case .payUpFront: return "UpFront"
        case .freeTrial: return "FreeTrial"
        default: return "PayAsYouGo"
        }
    }

    private func debugLog(_ msg: String) {
        if debugEnabled {
            print("PurchasePlugin[debug]: \(msg)")
        }
    }
}
