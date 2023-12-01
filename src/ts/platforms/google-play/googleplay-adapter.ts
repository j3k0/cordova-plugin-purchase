/// <reference path="../../receipt.ts" />
/// <reference path="../../transaction.ts" />

namespace CdvPurchase {

    export namespace GooglePlay {

        export class Transaction extends CdvPurchase.Transaction {

            public nativePurchase: Bridge.Purchase;

            constructor(purchase: Bridge.Purchase, parentReceipt: Receipt, decorator: Internal.TransactionDecorator) {
                super(Platform.GOOGLE_PLAY, parentReceipt, decorator);
                this.nativePurchase = purchase;
                this.refresh(purchase);
            }

            static toState(state: Bridge.PurchaseState, isAcknowledged: boolean, isConsumed: boolean): TransactionState {
                switch(state) {
                    case Bridge.PurchaseState.PENDING:
                        return TransactionState.INITIATED;
                    case Bridge.PurchaseState.PURCHASED:
                        // Note: we still want to validate acknowledged non-consumables and subscriptions,
                        //       so we don't return APPROVED
                        if (isConsumed)
                            return TransactionState.FINISHED;
                        else
                            return TransactionState.APPROVED;
                    case Bridge.PurchaseState.UNSPECIFIED_STATE:
                        return TransactionState.UNKNOWN_STATE;
                }
            }

            /**
             * Refresh the value in the transaction based on the native purchase update
             */
            refresh(purchase: Bridge.Purchase) {
                this.nativePurchase = purchase;
                this.transactionId = `${purchase.orderId || purchase.purchaseToken}`;
                this.purchaseId = `${purchase.purchaseToken}`;
                this.products = purchase.productIds.map(productId => ({ id: productId }));
                if (purchase.purchaseTime) this.purchaseDate = new Date(purchase.purchaseTime);
                this.isPending = (purchase.getPurchaseState === Bridge.PurchaseState.PENDING)
                if (typeof purchase.acknowledged !== 'undefined') this.isAcknowledged = purchase.acknowledged;
                if (typeof purchase.consumed !== 'undefined') this.isConsumed = purchase.consumed;
                if (typeof purchase.autoRenewing !== 'undefined') this.renewalIntent = purchase.autoRenewing ? RenewalIntent.RENEW : RenewalIntent.LAPSE;
                this.state = Transaction.toState(purchase.getPurchaseState, this.isAcknowledged ?? false, this.isConsumed ?? false);
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
        }

        export class Adapter implements CdvPurchase.Adapter {

            /** Adapter identifier */
            id = Platform.GOOGLE_PLAY;

            /** Adapter name */
            name = 'GooglePlay';

            /** Has the adapter been successfully initialized */
            ready = false;

            supportsParallelLoading = false;

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
                return window.cordova.platformId === 'android';
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

            /** Called when the platform reports update for some purchases */
            onPurchasesUpdated(purchases: Bridge.Purchase[]): void {
                this.log.debug("onPurchaseUpdated: " + purchases.map(p => p.orderId).join(', '));
                // GooglePlay generates one receipt for each purchase
                purchases.forEach(purchase => {
                    const existingReceipt = this.receipts.find(r => r.purchaseToken === purchase.purchaseToken);
                    if (existingReceipt) {
                        existingReceipt.refreshPurchase(purchase);
                        this.context.listener.receiptsUpdated(Platform.GOOGLE_PLAY, [existingReceipt]);
                    }
                    else {
                        const newReceipt = new Receipt(purchase, this.context.apiDecorators);
                        this.receipts.push(newReceipt);
                        this.context.listener.receiptsUpdated(Platform.GOOGLE_PLAY, [newReceipt]);
                    }
                });
            }

            /** Called when the platform reports some purchases */
            onSetPurchases(purchases: Bridge.Purchase[]): void {
                this.log.debug("onSetPurchases: " + JSON.stringify(purchases));
                this.onPurchasesUpdated(purchases);
                this.context.listener.receiptsReady(Platform.GOOGLE_PLAY);
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

