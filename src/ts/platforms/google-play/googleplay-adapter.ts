/// <reference path="../../receipt.ts" />
/// <reference path="../../transaction.ts" />

namespace CdvPurchase {

    export namespace GooglePlay {

        export class Transaction extends CdvPurchase.Transaction {

            public nativePurchase: Bridge.Purchase;

            constructor(purchase: Bridge.Purchase, parentReceipt: Receipt, decorator: Internal.TransactionDecorator) {
                super(Platform.GOOGLE_PLAY, parentReceipt, decorator);
                this.nativePurchase = purchase;
                this.refresh(purchase, true);
            }

            static toState(fromConstructor: boolean, state: Bridge.PurchaseState, isAcknowledged: boolean, isConsumed: boolean): TransactionState {
                switch(state) {
                    case Bridge.PurchaseState.PENDING:
                        return TransactionState.INITIATED;
                    case Bridge.PurchaseState.PURCHASED:
                        // Note: we still want to validate acknowledged non-consumables and subscriptions,
                        //       so we don't return APPROVED
                        if (isConsumed)
                            return TransactionState.FINISHED;
                        else if (isAcknowledged)
                            return TransactionState.APPROVED;
                        else if (fromConstructor)
                            return TransactionState.INITIATED;
                        else
                            return TransactionState.APPROVED;
                    case Bridge.PurchaseState.UNSPECIFIED_STATE:
                        return TransactionState.UNKNOWN_STATE;
                }
            }

            /**
             * Refresh the value in the transaction based on the native purchase update
             */
            refresh(purchase: Bridge.Purchase, fromConstructor?: boolean) {
                this.nativePurchase = purchase;
                this.transactionId = `${purchase.orderId || purchase.purchaseToken}`;
                this.purchaseId = `${purchase.purchaseToken}`;
                this.products = purchase.productIds.map(productId => ({ id: productId }));
                if (purchase.purchaseTime) this.purchaseDate = new Date(purchase.purchaseTime);
                this.isPending = (purchase.getPurchaseState === Bridge.PurchaseState.PENDING)
                if (typeof purchase.acknowledged !== 'undefined') this.isAcknowledged = purchase.acknowledged;
                if (typeof purchase.consumed !== 'undefined') this.isConsumed = purchase.consumed;
                if (typeof purchase.autoRenewing !== 'undefined') this.renewalIntent = purchase.autoRenewing ? RenewalIntent.RENEW : RenewalIntent.LAPSE;
                if (typeof purchase.quantity !== 'undefined') this.quantity = purchase.quantity;
                
                // Handle expiryTimeMillis for subscriptions
                if (purchase.expiryTimeMillis) {
                    const expiryTime = parseInt(purchase.expiryTimeMillis, 10);
                    if (!isNaN(expiryTime)) {
                        this.expirationDate = new Date(expiryTime);
                    }
                }
                
                this.state = Transaction.toState(fromConstructor ?? false, purchase.getPurchaseState, this.isAcknowledged ?? false, this.isConsumed ?? false);
            }

            removed() {
                if (this.renewalIntent) {
                    this.expirationDate = new Date(Date.now() - Internal.ExpiryMonitor.GRACE_PERIOD_MS[Platform.GOOGLE_PLAY]);
                }
                else {
                    this.isConsumed = true;
                }
                this.state = TransactionState.CANCELLED;
            }
        }

        export class Receipt extends CdvPurchase.Receipt {

            /** Token that uniquely identifies a purchase for a given item and user pair. */
            public purchaseToken: string;

            /** Unique order identifier for the transaction.  (like GPA.XXXX-XXXX-XXXX-XXXXX) */
            public orderId?: string;

            /** @internal */
            constructor(purchase: Bridge.Purchase, decorator: Internal.TransactionDecorator & Internal.ReceiptDecorator) {
                super(Platform.GOOGLE_PLAY, decorator);
                this.transactions = [new Transaction(purchase, this, decorator)];
                this.purchaseToken = purchase.purchaseToken;
                this.orderId = purchase.orderId;
            }

            /** Refresh the content of the purchase based on the native BridgePurchase */
            refreshPurchase(purchase: Bridge.Purchase) {
                (this.transactions[0] as Transaction)?.refresh(purchase);
                this.orderId = purchase.orderId;
            }

            removed() {
                this.transactions.forEach(t => (t as Transaction)?.removed());
            }
        }

        export class Adapter implements CdvPurchase.Adapter {

            /** Adapter identifier */
            id = Platform.GOOGLE_PLAY;

            /** Adapter name */
            name = 'GooglePlay';

            /** Has the adapter been successfully initialized */
            ready = false;

            supportsParallelLoading = false;

            canSkipFinish = true;

            /** List of products managed by the GooglePlay adapter */
            get products(): GProduct[] { return this._products.products; }
            private _products: Products;

            get receipts(): Receipt[] { return this._receipts; }
            private _receipts: Receipt[] = [];

            /** The GooglePlay bridge */
            bridge = new Bridge.Bridge();

            /** Prevent double initialization */
            initialized = false;

            /** Used to retry failed commands */
            retry = new Internal.Retry();

            private context: Internal.AdapterContext;
            private log: Logger;

            public autoRefreshIntervalMillis: number = 0;
            static trimProductTitles: boolean = true;

            static _instance: Adapter;
            constructor(context: Internal.AdapterContext, autoRefreshIntervalMillis: number = 1000 * 3600 * 24) {
                if (Adapter._instance) throw new Error('GooglePlay adapter already initialized');
                this._products = new Products(context.apiDecorators);
                this.autoRefreshIntervalMillis = autoRefreshIntervalMillis;
                this.context = context;
                this.log = context.log.child('GooglePlay');
                Adapter._instance = this;
            }

            private initializationPromise?: Promise<undefined | IError>;

            /** Returns true on Android, the only platform supported by this adapter */
            get isSupported(): boolean {
                return Utils.platformId() === 'android';
            }

            async initialize(): Promise<undefined | IError> {

                this.log.info("Initialize");

                if (this.initializationPromise) return this.initializationPromise;

                return this.initializationPromise = new Promise((resolve) => {

                    const bridgeLogger = this.log.child('Bridge');

                    const iabOptions = {
                        onSetPurchases: this.onSetPurchases.bind(this),
                        onPurchasesUpdated: this.onPurchasesUpdated.bind(this),
                        onPurchaseConsumed: this.onPurchaseConsumed.bind(this),
                        showLog: this.context.verbosity >= LogLevel.DEBUG ? true : false,
                        log: (msg: string) => bridgeLogger.info(msg),
                    }

                    const iabReady = () => {
                        this.log.debug("Ready");

                        // Auto-refresh every 24 hours (or autoRefreshIntervalMillis)
                        if (this.autoRefreshIntervalMillis > 0) {
                            window.setInterval(() => this.getPurchases(), this.autoRefreshIntervalMillis);
                        }

                        resolve(undefined);
                    }

                    const iabError = (err: string) => {
                        this.initialized = false;
                        this.context.error(playStoreError(ErrorCode.SETUP, "Init failed - " + err, null));
                        this.retry.retry(() => this.initialize());
                    }

                    this.bridge.init(iabReady, iabError, iabOptions);
                });
            }

            /** Prepare the list of SKUs sorted by type */
            getSkusOf(products: IRegisterProduct[]): {inAppSkus: string[], subsSkus: string[]} {
                const inAppSkus: string[] = [];
                const subsSkus: string[] = [];
                for (const product of products) {
                    if (product.type === ProductType.PAID_SUBSCRIPTION)
                        subsSkus.push(product.id);
                    else
                        inAppSkus.push(product.id);
                }
                return {inAppSkus, subsSkus};
            }

            /** @inheritdoc */
            loadReceipts(): Promise<CdvPurchase.Receipt[]> {
                return new Promise((resolve) => {
                    // let's also refresh purchases
                    this.getPurchases()
                    .then(err => {
                        resolve(this._receipts);
                    });
                });
            }

            /** @inheritDoc */
            loadProducts(products: IRegisterProduct[]): Promise<(GProduct | IError)[]> {

                return new Promise((resolve) => {

                    this.log.debug("Load: " + JSON.stringify(products));

                    /** Called when a list of product definitions have been loaded */
                    const iabLoaded = (validProducts: (Bridge.InAppProduct | Bridge.Subscription)[]) => {

                        this.log.debug("Loaded: " + JSON.stringify(validProducts));

                        // Add type check to handle invalid responses
                        if (!Array.isArray(validProducts)) {
                            const message = `Invalid product list received: ${JSON.stringify(validProducts)}, retrying later...`;
                            this.log.warn(message);
                            this.retry.retry(go);
                            this.context.error(playStoreError(ErrorCode.LOAD, message, null));
                            return;
                        }

                        const ret = products.map(registeredProduct => {
                            const validProduct = validProducts.find(vp => vp.productId === registeredProduct.id);
                            if (validProduct && validProduct.productId) {
                                return this._products.addProduct(registeredProduct, validProduct);
                            }
                            else {
                                return playStoreError(ErrorCode.INVALID_PRODUCT_ID, `Product with id ${registeredProduct.id} not found.`, registeredProduct.id);
                            }
                        });
                        resolve(ret);
                    }

                    /** Start loading products */
                    const go = () => {
                        const { inAppSkus, subsSkus } = this.getSkusOf(products);
                        this.log.debug("getAvailableProducts: " + JSON.stringify(inAppSkus) + " | " + JSON.stringify(subsSkus));
                        this.bridge.getAvailableProducts(inAppSkus, subsSkus, iabLoaded, (err: string) => {
                            // failed to load products, retry later.
                            this.retry.retry(go);
                            this.context.error(playStoreError(ErrorCode.LOAD, 'Loading product info failed - ' + err + ' - retrying later...', null))
                        });
                    }

                    go();
                });
            }

            /** @inheritDoc */
            finish(transaction: CdvPurchase.Transaction): Promise<IError | undefined> {
                return new Promise(resolve => {

                    const onSuccess = () => {
                        if (transaction.state !== TransactionState.FINISHED) {
                            transaction.state = TransactionState.FINISHED;
                            this.context.listener.receiptsUpdated(Platform.GOOGLE_PLAY, [transaction.parentReceipt]);
                        }
                        resolve(undefined);
                    };
                    const firstProduct = transaction.products[0];

                    if (!firstProduct)
                        return resolve(playStoreError(ErrorCode.FINISH, 'Cannot finish a transaction with no product', null));

                    const product = this._products.getProduct(firstProduct.id);
                    if (!product)
                        return resolve(playStoreError(ErrorCode.FINISH, 'Cannot finish transaction, unknown product ' + firstProduct.id, firstProduct.id));

                    const receipt = this._receipts.find(r => r.hasTransaction(transaction));
                    if (!receipt)
                        return resolve(playStoreError(ErrorCode.FINISH, 'Cannot finish transaction, linked receipt not found.', product.id));

                    if (!receipt.purchaseToken)
                        return resolve(playStoreError(ErrorCode.FINISH, 'Cannot finish transaction, linked receipt contains no purchaseToken.', product.id));

                    const onFailure = (message: string, code?: ErrorCode) => resolve(playStoreError(code || ErrorCode.UNKNOWN, message, product.id));

                    if (product.type === ProductType.NON_RENEWING_SUBSCRIPTION || product.type === ProductType.CONSUMABLE) {
                        if (!transaction.isConsumed)
                            return this.bridge.consumePurchase(onSuccess, onFailure, receipt.purchaseToken);
                    }
                    else { // subscription and non-consumable
                        if (!transaction.isAcknowledged)
                            return this.bridge.acknowledgePurchase(onSuccess, onFailure, receipt.purchaseToken);
                    }
                    // nothing to do
                    resolve(undefined);
                });
            }

            /** Called by the bridge when a purchase has been consumed */
            onPurchaseConsumed(purchase: Bridge.Purchase): void {
                this.log.debug("onPurchaseConsumed: " + purchase.orderId);
                purchase.acknowledged = true; // consumed is the equivalent of acknowledged for consumables
                purchase.consumed = true;
                this.onPurchasesUpdated([purchase]);
            }

            /** Schedule to refresh purchases for subscriptions that don't have expiration dates */
            private refreshSchedule: {
                [purchaseToken: string]: {
                    timeoutId: number;
                    refreshTime: number;
                }[];
            } = {};
            
            /** Refresh intervals (in milliseconds) */
            private static REFRESH_INTERVALS = {
                SANDBOX: 6 * 60 * 1000, // 6 minutes for sandbox
                PRODUCTION: 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000, // 7 days + 10 minutes for production
            };

            /**
             * Schedule a purchase refresh for a subscription without expiration date
             */
            private scheduleRefreshForSubscription(purchase: Bridge.Purchase): void {
                if (!purchase.purchaseToken) return;

                const schedule = this.refreshSchedule[purchase.purchaseToken] || [];
                if (schedule.length === 0) {
                    this.refreshSchedule[purchase.purchaseToken] = schedule;
                }

                // Determine refresh interval based on sandbox status and auto-renewing flag
                let refreshIntervals = [Adapter.REFRESH_INTERVALS.SANDBOX, Adapter.REFRESH_INTERVALS.PRODUCTION];
                refreshIntervals.forEach(refreshInterval => {
                    const refreshTime = purchase.purchaseTime + refreshInterval;
                    if (schedule.find(s => s.refreshTime === refreshTime) || refreshTime < Date.now()) {
                        return;
                    }
                    this.log.debug(`Scheduling refresh for purchase token ${purchase.purchaseToken} at ${new Date(refreshTime).toISOString()}`);
                    
                    // Schedule the refresh
                    const timeoutId = window.setTimeout(() => {
                        this.log.debug(`Executing scheduled refresh for purchase token ${purchase.purchaseToken}`);
                        delete this.refreshSchedule[purchase.purchaseToken];
                        this.getPurchases().catch(err => {
                            this.log.warn(`Failed scheduled refresh: ${err}`);
                        });
                    }, refreshTime - Date.now());
                
                    // Store the scheduled refresh
                    schedule.push({
                        timeoutId: timeoutId as unknown as number,
                        refreshTime
                    });
                });
            }
            
            /**
             * Detect subscriptions that need scheduled refreshes
             */
            private scheduleRefreshesForSubscriptions(purchases: Bridge.Purchase[]): void {
                for (const purchase of purchases) {
                    // Skip if not auto-renewing
                    if (purchase.autoRenewing !== false) continue;
                    const productId = purchase.productIds[0];
                    const product = productId ? this._products.getProduct(productId) : undefined;
                    if (!product || product.type !== ProductType.PAID_SUBSCRIPTION) continue;
                    if (!purchase.expiryTimeMillis) {
                        this.scheduleRefreshForSubscription(purchase);
                    }
                }
            }

            /**
             * Called when the platform reports some purchases
             */
            onSetPurchases(purchases: Bridge.Purchase[]): void {
                this.log.debug("onSetPurchases: " + JSON.stringify(purchases));
                this.onPurchasesUpdated(purchases);
                this.context.listener.receiptsReady(Platform.GOOGLE_PLAY);
                
                // Schedule refreshes for subscriptions without expiration dates
                this.scheduleRefreshesForSubscriptions(purchases);
            }

            /**
             * Called when the platform reports updates for some purchases
             * 
             * Notice that purchases can be removed from the array, we should handle that so they stop
             * being "owned" by the user.
             */
            onPurchasesUpdated(purchases: Bridge.Purchase[]): void {
                this.log.debug("onPurchaseUpdated: " + purchases.map(p => p.orderId).join(', '));
                // GooglePlay generates one receipt for each purchase

                const removedReceipts = this.receipts.filter(r => !purchases.find(p => p.purchaseToken === r.purchaseToken));
                if (removedReceipts.length > 0) {
                    this.log.debug("Removed purchases: " + removedReceipts.map(r => r.purchaseToken).join(', '));
                    removedReceipts.forEach(receipt => receipt.removed());
                }

                purchases.forEach(purchase => {
                    const existingReceipt = this.receipts.find(r => r.purchaseToken === purchase.purchaseToken);
                    if (existingReceipt) {
                        // Before refreshing, check if this is a subscription and update expirationDate
                        // based on autoRenewing status - this ensures proper "owned" flag status
                        const firstTransaction = existingReceipt.transactions[0] as Transaction;
                        if (firstTransaction) {
                            const firstProductId = firstTransaction.products[0]?.id;
                            if (firstProductId) {
                                const product = this._products.getProduct(firstProductId);
                                if (product && product.type === ProductType.PAID_SUBSCRIPTION) {
                                    // Always update the expirationDate if expiryTimeMillis is available
                                    // regardless of autoRenewing status
                                    if (purchase.getPurchaseState === Bridge.PurchaseState.PURCHASED && 
                                        purchase.expiryTimeMillis) {
                                        const expiryTime = parseInt(purchase.expiryTimeMillis, 10);
                                        if (!isNaN(expiryTime)) {
                                            // Set the transaction's expirationDate using the expiryTimeMillis from Google Play
                                            firstTransaction.expirationDate = new Date(expiryTime);
                                            
                                            // Log the expiration update for debugging
                                            this.log.debug(`Updated expirationDate for ${firstProductId} to ${firstTransaction.expirationDate} (autoRenewing: ${purchase.autoRenewing})`);
                                        }
                                    }
                                }
                            }
                        }
                        
                        existingReceipt.refreshPurchase(purchase);
                        this.context.listener.receiptsUpdated(Platform.GOOGLE_PLAY, [existingReceipt]);
                    }
                    else {
                        const newReceipt = new Receipt(purchase, this.context.apiDecorators);
                        this.receipts.push(newReceipt);
                        this.context.listener.receiptsUpdated(Platform.GOOGLE_PLAY, [newReceipt]);
                        if (newReceipt.transactions[0].state === TransactionState.INITIATED && !newReceipt.transactions[0].isPending) {
                            // For compatibility, we set the state of "new" purchases to initiated from the constructor,
                            // they'll got to "approved" when refreshed.
                            // this way, users receive the "initiated" event, then "approved"
                            newReceipt.refreshPurchase(purchase);
                            this.context.listener.receiptsUpdated(Platform.GOOGLE_PLAY, [newReceipt]);
                        }
                    }
                });
            }

            onPriceChangeConfirmationResult(result: "OK" | "UserCanceled" | "UnknownProduct"): void {
            }

            /** Refresh purchases from GooglePlay */
            getPurchases(): Promise<IError | undefined> {
                return new Promise(resolve => {
                    this.log.debug('getPurchases');
                    const success = () => {
                        this.log.debug('getPurchases success');
                        setTimeout(() => resolve(undefined), 0);
                    }
                    const failure = (message: string, code?: number) => {
                        this.log.warn('getPurchases failed: ' + message + ' (' + code + ')');
                        setTimeout(() => resolve(playStoreError(code || ErrorCode.UNKNOWN, message, null)), 0);
                    }
                    this.bridge.getPurchases(success, failure);
                });
            }

            /** @inheritDoc */
            async order(offer: GOffer, additionalData: CdvPurchase.AdditionalData): Promise<IError | undefined> {
                return new Promise(resolve => {
                    this.log.info("Order - " + JSON.stringify(offer));
                    const buySuccess = () => resolve(undefined);
                    const buyFailed = (message: string, code?: ErrorCode): void => {
                        this.log.warn('Order failed: ' + JSON.stringify({message, code}));
                        resolve(playStoreError(code ?? ErrorCode.UNKNOWN, message, offer.productId));
                    };
                    if (offer.productType === ProductType.PAID_SUBSCRIPTION) {
                        const idAndToken = 'token' in offer ? offer.productId + '@' + offer.token : offer.productId;
                        // find if the user already owns a product in the same group
                        const oldPurchaseToken = this.findOldPurchaseToken(offer.productId, offer.productGroup);
                        if (oldPurchaseToken) {
                            if (!additionalData.googlePlay)
                                additionalData.googlePlay = { oldPurchaseToken };
                            else if (!additionalData.googlePlay.oldPurchaseToken) {
                                additionalData.googlePlay.oldPurchaseToken = oldPurchaseToken;
                            }
                        }
                        this.bridge.subscribe(buySuccess, buyFailed, idAndToken, additionalData);
                    }
                    else {
                        this.bridge.buy(buySuccess, buyFailed, offer.productId, additionalData);
                    }
                });
            }

            /**
             * Find a purchaseToken for an owned product in the same group as the requested one.
             *
             * @param productId - The product identifier to request matching purchaseToken for.
             * @param productGroup - The group of the product to request matching purchaseToken for.
             *
             * @return A purchaseToken, undefined if none have been found.
             */
            findOldPurchaseToken(productId: string, productGroup?: string): string | undefined {
                if (!productGroup) return undefined;
                const oldReceipt = this._receipts.find(r => {
                    return !!r.transactions.find(t => {
                        return !!t.products.find(p => {
                            const product = this._products.getProduct(p.id);
                            if (!product) return false;
                            if (!Internal.LocalReceipts.isOwned([r], product)) return false;
                            return (p.id === productId) || (productGroup && product.group === productGroup);
                        });
                    });
                });
                return oldReceipt?.purchaseToken;
            }

            /**
             * Prepare for receipt validation
             */
            async receiptValidationBody(receipt: Receipt): Promise<Validator.Request.Body | undefined> {
                const transaction = receipt.transactions[0] as GooglePlay.Transaction;
                if (!transaction) return;
                const productId = transaction.products[0]?.id;
                if (!productId) return;
                const product = this._products.getProduct(productId);
                if (!product) return;
                const purchase = transaction.nativePurchase;
                return {
                    id: productId,
                    type: product.type,
                    offers: product.offers,
                    products: this._products.products,
                    transaction: {
                        type: Platform.GOOGLE_PLAY,
                        id: receipt.transactions[0].transactionId,
                        purchaseToken: purchase.purchaseToken,
                        signature: purchase.signature,
                        receipt: purchase.receipt,
                    }
                }
            }

            async handleReceiptValidationResponse(receipt: CdvPurchase.Receipt, response: Validator.Response.Payload): Promise<void> {
                if (response?.ok) {
                    const transaction = response?.data?.transaction;
                    if (transaction?.type !== Platform.GOOGLE_PLAY) return;
                    switch (transaction.kind) {
                        case 'androidpublisher#productPurchase':
                            break;
                        case 'androidpublisher#subscriptionPurchase':
                            break;
                        case 'androidpublisher#subscriptionPurchaseV2':
                            transaction;
                            break;
                        case 'fovea#subscriptionGone':
                            // the transaction doesn't exist anymore
                            break;
                    }
                }
                return; // Nothing specific to do on GooglePlay
            }

            async requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined> {
                return playStoreError(ErrorCode.UNKNOWN, 'requestPayment not supported', null);
            }

            async manageSubscriptions(): Promise<IError | undefined> {
                this.bridge.manageSubscriptions();
                return;
            }

            async manageBilling(): Promise<IError | undefined> {
                this.bridge.manageBilling();
                return;
            }

            checkSupport(functionality: PlatformFunctionality): boolean {
                const supported: PlatformFunctionality[] = [
                    'order', 'manageBilling', 'manageSubscriptions'
                ];
                return supported.indexOf(functionality) >= 0;
            }

            restorePurchases(): Promise<IError | undefined> {
                return new Promise(resolve => {
                    this.bridge.getPurchases(() => resolve(undefined), (message, code) => {
                        this.log.warn('getPurchases() failed: ' + (code ?? 'ERROR') + ': ' + message);
                        resolve(playStoreError(code ?? ErrorCode.UNKNOWN, message, null));
                    });
                });
            }
        }

        function playStoreError(code: ErrorCode, message: string, productId: string | null) {
            return storeError(code, message, Platform.GOOGLE_PLAY, productId);
        }
    }
}

