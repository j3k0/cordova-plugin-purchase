import Foundation
import Capacitor
import StoreKit

@available(iOS 15.0, *)
private class SK2State {
    var products: [String: Product] = [:]
    var unfinishedTransactions: [String: Transaction] = [:]
    var transactionObserverTask: Task<Void, Never>?
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

    override public func load() {
        if #available(iOS 15.0, *) {
            startTransactionObserver()
        }
    }

    deinit {
        if #available(iOS 15.0, *) {
            sk2.transactionObserverTask?.cancel()
        }
    }

    @available(iOS 15.0, *)
    private func startTransactionObserver() {
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
            await emitTransactionUpdate(transaction, state: "PaymentTransactionStatePurchased",
                                        jwsRepresentation: jwsRepresentation)
        case .unverified(let transaction, _):
            // Emit as Purchased — let JS layer handle verification
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

        // Process any pending transactions
        Task {
            for await result in Transaction.currentEntitlements {
                if case .verified(let transaction) = result {
                    self.sk2.unfinishedTransactions[String(transaction.id)] = transaction
                }
            }
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
                    validProducts.append(productToDict(product))
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
                if let username = call.getString("applicationUsername") {
                    options.insert(.appAccountToken(
                        UUID(uuidString: username) ?? UUID()))
                }
                if quantity > 1 {
                    options.insert(.quantity(quantity))
                }

                let result = try await product.purchase(options: options)
                switch result {
                case .success(let verification):
                    let jwsRepresentation = verification.jwsRepresentation
                    switch verification {
                    case .verified(let transaction):
                        await emitTransactionUpdate(transaction,
                                                    state: "PaymentTransactionStatePurchased",
                                                    jwsRepresentation: jwsRepresentation)
                    case .unverified(let transaction, _):
                        // Emit as Purchased — let JS handle verification
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
            if let transaction = sk2.unfinishedTransactions[transactionId] {
                await transaction.finish()
                sk2.unfinishedTransactions.removeValue(forKey: transactionId)
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
                for await result in Transaction.currentEntitlements {
                    if case .verified(let transaction) = result {
                        await emitTransactionUpdate(transaction,
                                                    state: "PaymentTransactionStateRestored",
                                                    jwsRepresentation: result.jwsRepresentation)
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
        // SKPaymentQueue.storefront is a StoreKit 1 API available from iOS 13,
        // which matches the plugin's minimum deployment target.
        if let storefront = SKPaymentQueue.default().storefront {
            debugLog("getStorefront: \(storefront.countryCode)")
            call.resolve(["countryCode": storefront.countryCode])
        } else {
            debugLog("getStorefront: storefront not available")
            call.reject("Storefront not available")
        }
    }

    // MARK: - Helpers

    @available(iOS 15.0, *)
    private func emitTransactionUpdate(_ transaction: Transaction, state: String,
                                       errorCode: Int? = nil, errorText: String? = nil,
                                       jwsRepresentation: String? = nil) async {
        let transactionId = String(transaction.id)
        sk2.unfinishedTransactions[transactionId] = transaction

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

        notifyListeners("transactionUpdated", data: data)
    }

    @available(iOS 15.0, *)
    private func productToDict(_ product: Product) -> [String: Any] {
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
        case .payUpFront: return "PayUpFront"
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
