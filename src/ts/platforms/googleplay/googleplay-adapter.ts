namespace CDVPurchase2 {

    export namespace GooglePlay {

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

            /** Loads product metadata from the store */
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

            onPurchaseConsumed(purchase: BridgePurchase): void {

            }

            onPurchasesUpdated(purchases: BridgePurchases): void {

            }

            onSetPurchases(purchases: BridgePurchases): void {

            }

            onPriceChangeConfirmationResult(result: "OK" | "UserCanceled" | "UnknownProduct"): void {
            }

            getPurchases(callback?: () => void): void {
                if (callback) {
                    setTimeout(callback, 0);
                }
            }

            async order(offer: Offer, additionalData: CDVPurchase2.AdditionalData): Promise<IError | Transaction> {
                return new Promise(resolve => {
                    this.log.info("Order - " + JSON.stringify(offer));
                    const transaction = new Transaction();
                    transaction.productId = offer.product.id;
                    transaction.offerId = offer.id;
                    transaction.state = TransactionState.REQUESTED;
                    const buySuccess = () => {
                        resolve(transaction);
                    };
                    const buyFailed = (message: string, code?: ErrorCode): void => {
                        this.log.warn('Order failed: ' + JSON.stringify({message, code}));
                        resolve({ code: code ?? ErrorCode.UNKNOWN, message });
                    };
                    this.bridge.buy(buySuccess, buyFailed, offer.product.id + '@' + offer.id, additionalData);
                });
            }
        }



    }
}

