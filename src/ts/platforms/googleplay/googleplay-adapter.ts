namespace CDVPurchase2 {

    export namespace GooglePlay {

        export class Transaction extends CDVPurchase2.Transaction {

            public nativePurchase: BridgePurchase;

            constructor(purchase: BridgePurchase) {
                super(Platform.GOOGLE_PLAY);
                this.nativePurchase = purchase;
                this.refresh(purchase);
            }

            static toState(state: BridgePurchaseState, isAcknowledged: boolean): TransactionState {
                switch(state) {
                    case BridgePurchaseState.PENDING:
                        return TransactionState.INITIATED;
                    case BridgePurchaseState.PURCHASED:
                        if (isAcknowledged)
                            return TransactionState.FINISHED;
                        else
                            return TransactionState.APPROVED;
                    case BridgePurchaseState.UNSPECIFIED_STATE:
                        return TransactionState.UNKNOWN_STATE;
                }
            }

            /**
             * Refresh the value in the transaction based on the native purchase update
             */
            refresh(purchase: BridgePurchase) {
                this.nativePurchase = purchase;
                this.transactionId = `google:${purchase.orderId || purchase.purchaseToken}`;
                this.purchaseId = `google:${purchase.purchaseToken}`;
                this.products = purchase.productIds.map(productId => ({ productId }));
                if (purchase.purchaseTime) this.purchaseDate = new Date(purchase.purchaseTime);
                this.isPending = (purchase.getPurchaseState === BridgePurchaseState.PENDING);
                if (typeof purchase.acknowledged !== 'undefined') this.isAcknowledged = purchase.acknowledged;
                if (typeof purchase.autoRenewing !== 'undefined') this.renewalIntent = purchase.autoRenewing ? RenewalIntent.RENEW : RenewalIntent.LAPSE;
                this.state = Transaction.toState(purchase.getPurchaseState, purchase.acknowledged);
            }
        }

        export class Receipt extends CDVPurchase2.Receipt {

            /** Token that uniquely identifies a purchase for a given item and user pair. */
            public purchaseToken: string;

            /** Unique order identifier for the transaction.  (like GPA.XXXX-XXXX-XXXX-XXXXX) */
            public orderId?: string;

            constructor(purchase: BridgePurchase) {
                super({
                    platform: Platform.GOOGLE_PLAY,
                    transactions: [new Transaction(purchase)],
                });
                this.purchaseToken = purchase.purchaseToken;
                this.orderId = purchase.orderId;
            }

            /** Refresh the content of the purchase based on the native BridgePurchase */
            refresh(purchase: BridgePurchase) {
                (this.transactions[0] as Transaction)?.refresh(purchase);
                this.orderId = purchase.orderId;
            }
        }

        export class Adapter implements CDVPurchase2.Adapter {

            /** Adapter identifier */
            id = Platform.GOOGLE_PLAY;

            /** List of products managed by the GooglePlay adapter */
            get products(): Product[] { return this._products.products; }
            private _products: Products = new Products();

            get receipts(): Receipt[] { return this._receipts; }
            private _receipts: Receipt[] = [];

            /** The GooglePlay bridge */
            bridge = new Bridge();

            /** Prevent double initialization */
            initialized = false;

            /** Used to retry failed commands */
            retry = new Retry();

            private context: Internal.AdapterContext;
            private log: Internal.Log;

            public autoRefreshIntervalMillis: number = 0;

            static _instance: Adapter;
            constructor(context: Internal.AdapterContext, autoRefreshIntervalMillis: number = 1000 * 3600 * 24) {
                if (Adapter._instance) throw new Error('GooglePlay adapter already initialized');
                this.autoRefreshIntervalMillis = autoRefreshIntervalMillis;
                this.context = context;
                this.log = context.log.child('GooglePlay');
                Adapter._instance = this;
            }

            private initializationPromise?: Promise<undefined | IError>;

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
                        this.context.error({
                            code: ErrorCode.SETUP,
                            message: "Init failed - " + err
                        });
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
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]> {

                return new Promise((resolve) => {

                    this.log.debug("Load: " + JSON.stringify(products));

                    /** Called when a list of product definitions have been loaded */
                    const iabLoaded = (validProducts: (BridgeInAppProduct | BridgeSubscriptionV12)[]) => {

                        this.log.debug("Loaded: " + JSON.stringify(validProducts));
                        const ret = products.map(registeredProduct => {
                            const validProduct = validProducts.find(vp => vp.productId === registeredProduct.id);
                            if (validProduct && validProduct.productId) {
                                return this._products.addProduct(registeredProduct, validProduct);
                            }
                            else {
                                return {
                                    code: ErrorCode.INVALID_PRODUCT_ID,
                                    message: `Product with id ${registeredProduct.id} not found.`,
                                } as IError;
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
                            this.context.error({
                                code: ErrorCode.LOAD,
                                message: 'Loading product info failed - ' + err + ' - retrying later...'
                            });
                        });
                    }

                    go();
                });
            }

            /** @inheritdoc */
            finish(transaction: CDVPurchase2.Transaction): Promise<IError | undefined> {
                return new Promise(resolve => {

                    const onSuccess = () => resolve(undefined);
                    const onFailure = (message: string, code?: ErrorCode) => resolve({ message, code } as IError);

                    const firstProduct = transaction.products[0];
                    if (!firstProduct)
                        return resolve({ code: ErrorCode.FINISH, message: 'Cannot finish a transaction with no product' });

                    const product = this._products.getProduct(firstProduct.productId);
                    if (!product)
                        return resolve({ code: ErrorCode.FINISH, message: 'Cannot finish transaction, unknown product ' + firstProduct.productId });

                    const receipt = this._receipts.find(r => r.hasTransaction(transaction));
                    if (!receipt)
                        return resolve({ code: ErrorCode.FINISH, message: 'Cannot finish transaction, linked receipt not found.' });

                    if (!receipt.purchaseToken)
                        return resolve({ code: ErrorCode.FINISH, message: 'Cannot finish transaction, linked receipt contains no purchaseToken.' });

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

            onPurchaseConsumed(purchase: BridgePurchase): void {
                this.log.debug("onPurchaseConsumed: " + purchase.orderId);
            }

            onPurchasesUpdated(purchases: BridgePurchase[]): void {
                this.log.debug("onPurchaseUpdated: " + purchases.map(p => p.orderId).join(', '));
                // GooglePlay generates one receipt for each purchase
                purchases.forEach(purchase => {
                    const existingReceipt = this.receipts.find(r => r.purchaseToken === purchase.purchaseToken);
                    if (existingReceipt) {
                        existingReceipt.refresh(purchase);
                        this.context.listener.receiptsUpdated(Platform.GOOGLE_PLAY, [existingReceipt]);
                    }
                    else {
                        const newReceipt = new Receipt(purchase);
                        this.receipts.push(newReceipt);
                        this.context.listener.receiptsUpdated(Platform.GOOGLE_PLAY, [newReceipt]);
                    }
                });
            }

            onSetPurchases(purchases: BridgePurchase[]): void {
                this.log.debug("onSetPurchases: " + JSON.stringify(purchases));
            }

            onPriceChangeConfirmationResult(result: "OK" | "UserCanceled" | "UnknownProduct"): void {
            }

            getPurchases(callback?: () => void): void {
                if (callback) {
                    setTimeout(callback, 0);
                }
            }

            /** @inheritdoc */
            async order(offer: Offer, additionalData: CDVPurchase2.AdditionalData): Promise<IError | undefined> {
                return new Promise(resolve => {
                    this.log.info("Order - " + JSON.stringify(offer));
                    const buySuccess = () => {
                        resolve(undefined);
                    };
                    const buyFailed = (message: string, code?: ErrorCode): void => {
                        this.log.warn('Order failed: ' + JSON.stringify({message, code}));
                        resolve({ code: code ?? ErrorCode.UNKNOWN, message });
                    };
                    const idAndToken = offer.product.type === ProductType.PAID_SUBSCRIPTION ? offer.product.id + '@' + offer.id : offer.product.id;
                    this.bridge.buy(buySuccess, buyFailed, idAndToken, additionalData);
                });
            }
        }



    }
}

