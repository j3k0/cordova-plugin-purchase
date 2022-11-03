/// <reference path="validator/validator.ts" />
/// <reference path="internal/adapters.ts" />
/// <reference path="log.ts" />
/// <reference path="callbacks.ts" />
/// <reference path="ready.ts" />

namespace CdvPurchase {

    export const PLUGIN_VERSION = '13.0.0';

    /** Singleton */
    let globalStore: Store;

    /**
     * Entry class of the plugin.
     */
    export class Store {

        /** The singleton store object */
        static get instance(): Store {
            if (globalStore) {
                return globalStore;
            }
            else {
                globalStore = new Store();
                Object.assign(globalStore, CdvPurchase.LogLevel, CdvPurchase.ProductType, CdvPurchase.ErrorCode); // for backward compatibility
                return globalStore;
            }
        }

        /** Payment platform adapters */
        public adapters = new Internal.Adapters();

        /** List of registered products */
        private registeredProducts = new Internal.RegisteredProducts();

        /** Logger */
        public log = new Logger(this);

        /** Verbosity level for log */
        public verbosity: LogLevel = LogLevel.ERROR;

        /** Return the identifier of the user for your application */
        public applicationUsername?: string | (() => string);

        /** Get the application username as a string by either calling or returning Store.applicationUsername */
        getApplicationUsername(): string | undefined {
            if (this.applicationUsername instanceof Function) return this.applicationUsername();
            return this.applicationUsername;
        }

        /** URL or implementation of the receipt validation service */
        public validator: string | Validator.Function | Validator.Target | undefined;

        /** When adding information to receipt validation requests, those can serve different functions:
         *
         *  - handling support requests
         *  - fraud detection
         *  - analytics
         *  - tracking
         */
        public validator_privacy_policy: PrivacyPolicyItem | PrivacyPolicyItem[] | undefined;

        /** List of callbacks for the "ready" events */
        private _readyCallbacks = new ReadyCallbacks();

        /** Listens to adapters */
        private listener: Internal.StoreAdapterListener;

        /** Callbacks when a product definition was updated */
        private updatedCallbacks = new Callbacks<Product>();

        /** Callback when a receipt was updated */
        private updatedReceiptsCallbacks = new Callbacks<Receipt>();

        /** Callbacks when a product is owned */
        // private ownedCallbacks = new Callbacks<Product>();

        /** Callbacks when a transaction has been approved */
        private approvedCallbacks = new Callbacks<Transaction>();

        /** Callbacks when a transaction has been finished */
        private finishedCallbacks = new Callbacks<Transaction>();

        /** Callbacks when a receipt has been validated */
        private verifiedCallbacks = new Callbacks<VerifiedReceipt>();

        /** Callbacks for errors */
        private errorCallbacks = new Callbacks<IError>;

        /** Internal implementation of the receipt validation service integration */
        private _validator: Internal.Validator;

        constructor() {
            this.listener = new Internal.StoreAdapterListener({
                updatedCallbacks: this.updatedCallbacks,
                updatedReceiptCallbacks: this.updatedReceiptsCallbacks,
                approvedCallbacks: this.approvedCallbacks,
                finishedCallbacks: this.finishedCallbacks,
            });

            const store = this;
            this._validator = new Internal.Validator({
                adapters: this.adapters,
                getApplicationUsername: this.getApplicationUsername.bind(this),
                get localReceipts() { return store.localReceipts; },
                get validator() { return store.validator; },
                get validator_privacy_policy() { return store.validator_privacy_policy; },
                verifiedCallbacks: this.verifiedCallbacks,
            }, this.log);
        }

        /** Register a product */
        register(product: IRegisterProduct | IRegisterProduct[]) {
            this.registeredProducts.add(product);
        }

        /**
         * Call to initialize the in-app purchase plugin.
         *
         * @param platforms - List of payment platforms to initialize, default to Store.defaultPlatform().
         */
        async initialize(platforms: (Platform | PlatformWithOptions)[] = [Store.defaultPlatform()]): Promise<IError[]> {
            const store = this;
            const ret = this.adapters.initialize(platforms, {
                error: this.error.bind(this),
                get verbosity() { return store.verbosity; },
                getApplicationUsername() { return store.getApplicationUsername() },
                listener: this.listener,
                log: this.log,
                registeredProducts: this.registeredProducts,
            });
            ret.then(() => this._readyCallbacks.trigger());
            return ret;
        }

        /**
         * @deprecated - use store.initialize(), store.update() or store.restorePurchases()
         */
        refresh() {
            throw new Error("use store.initialize() or store.update()");
        }

        /**
         * Call to refresh the price of products and status of purchases.
         */
        async update() {
            // Load products metadata
            for (const registration of this.registeredProducts.byPlatform()) {
                const products = await this.adapters.find(registration.platform)?.load(registration.products);
                products?.forEach(p => {
                    if (p instanceof Product) this.updatedCallbacks.trigger(p);
                });
            }
        }

        /** Register a callback to be called when the plugin is ready. */
        ready(cb: Callback<void>): void { this._readyCallbacks.add(cb); }

        /** Setup events listener.
         *
         * @example
         * store.when()
         *      .productUpdated(product => updateUI(product))
         *      .approved(transaction => store.finish(transaction));
         */
        when() {
            const ret: When = {
                productUpdated: (cb: Callback<Product>) => (this.updatedCallbacks.push(cb), ret),
                receiptUpdated: (cb: Callback<Receipt>) => (this.updatedReceiptsCallbacks.push(cb), ret),
                updated: (cb: Callback<Product | Receipt>) => (this.updatedCallbacks.push(cb), this.updatedReceiptsCallbacks.push(cb), ret),
                // owned: (cb: Callback<Product>) => (this.ownedCallbacks.push(cb), ret),
                approved: (cb: Callback<Transaction>) => (this.approvedCallbacks.push(cb), ret),
                finished: (cb: Callback<Transaction>) => (this.finishedCallbacks.push(cb), ret),
                verified: (cb: Callback<VerifiedReceipt>) => (this.verifiedCallbacks.push(cb), ret),
            };
            return ret;
        }


        /** List of all active products */
        get products(): Product[] {
            // concatenate products all all active platforms
            return ([] as Product[]).concat(...this.adapters.list.map(a => a.products));
        }

        /** Find a product from its id and platform */
        get(productId: string, platform: Platform = Store.defaultPlatform()): Product | undefined {
            return this.adapters.find(platform)?.products.find(p => p.id === productId);
        }

        /**
         * List of all receipts as present on the device.
         */
        get localReceipts(): Receipt[] {
            // concatenate products all all active platforms
            return ([] as Receipt[]).concat(...this.adapters.list.map(a => a.receipts));
        }

        /** List of all transaction from the local receipts. */
        get localTransactions(): Transaction[] {
            const ret: Transaction[] = [];
            for (const receipt of this.localReceipts) {
                ret.push(...receipt.transactions);
            }
            return ret;
        }

        /** List of receipts verified with the receipt validation service.
         *
         * Those receipt contains more information and are generally more up-to-date than the local ones. */
        get verifiedReceipts(): VerifiedReceipt[] {
            return this._validator.verifiedReceipts;
        }

        /** List of all purchases from the verified receipts. */
        get verifiedPurchases(): VerifiedPurchase[] {
            const ret: VerifiedPurchase[] = [];
            for (const receipt of this.verifiedReceipts) {
                ret.push(...receipt.collection.map(p => ({
                    platform: receipt.platform,
                    ...p,
                })));
            }
            return ret;
        }

        /**
         * Find the last verified purchase for a given product, from those verified by the receipt validator.
         */
        findInVerifiedReceipts(product: Product): VerifiedPurchase | undefined {
            let found: VerifiedPurchase | undefined;
            for (const receipt of this.verifiedReceipts) {
                if (receipt.platform !== product.platform) continue;
                for (const purchase of receipt.collection) {
                    if (purchase.id === product.id) {
                        if ((found?.purchaseDate ?? 0) < (purchase.purchaseDate ?? 1))
                            found = purchase;
                    }
                }
            }
            return found;
        }

        /**
         * Find the latest transaction for a givne product, from those reported by the device.
         */
        findInLocalReceipts(product: Product): Transaction | undefined {
            let found: Transaction | undefined;
            for (const receipt of this.localReceipts) {
                if (receipt.platform !== product.platform) continue;
                for (const transaction of receipt.transactions) {
                    for (const trProducts of transaction.products) {
                        if (trProducts.productId === product.id) {
                            if ((transaction.purchaseDate ?? 0) < (found?.purchaseDate ?? 1))
                                found = transaction;
                        }
                    }
                }
            }
            return found;
        }

        /** Place an order for a given offer */
        async order(offer: Offer, additionalData?: AdditionalData): Promise<IError | undefined> {
            const adapter = this.adapters.find(offer.platform);
            if (!adapter) return storeError(ErrorCode.PAYMENT_NOT_ALLOWED, 'Adapter not found for this platform (' + offer.platform + ')');
            const ret = await adapter.order(offer, additionalData || {});
            if (ret && 'isError' in ret) store.error(ret);
            return ret;
        }

        /** Request a payment */
        async requestPayment(paymentRequest: PaymentRequest, additionalData?: AdditionalData): Promise<IError | undefined> {
            const adapter = this.adapters.find(paymentRequest.platform);
            if (!adapter) return;
            return adapter.requestPayment(paymentRequest, additionalData);
        }

        /** Verify a receipt or transacting with the receipt validation service. */
        async verify(receiptOrTransaction: Transaction | Receipt) {
            this._validator.add(receiptOrTransaction);

            // Run validation after 50ms, so if the same receipt is to be validated multiple times it will just create one call.
            setTimeout(() => this._validator.run());

        }

        /** Finalize a transaction */
        async finish(receipt: Transaction | Receipt | VerifiedReceipt) {
            const transactions =
                receipt instanceof VerifiedReceipt
                    ? receipt.sourceReceipt.transactions
                    : receipt instanceof Receipt
                        ? receipt.transactions
                        : [receipt];
            transactions.forEach(transaction => {
                const adapter = this.adapters.find(transaction.platform)?.finish(transaction);
            });
        }

        async restorePurchases() {
            // TODO
        }

        async manageSubscriptions(platform?: Platform): Promise<IError | undefined> {
            const adapter = this.adapters.findReady(platform);
            if (!adapter) return storeError(ErrorCode.SETUP, "Found no adapter ready to handle 'manageSubscription'");
            return adapter.manageSubscriptions();
        }

        /**
         * The default payment platform to use depending on the OS.
         *
         * - on iOS: `APPLE_APPSTORE`
         * - on Android: `GOOGLE_PLAY`
         */
        static defaultPlatform(): Platform {
            switch (window.cordova.platformId) {
                case 'android': return Platform.GOOGLE_PLAY;
                case 'ios': return Platform.APPLE_APPSTORE;
                default: return Platform.TEST;
            }
        }

        error(error: IError | Callback<IError>): void {
            if (error instanceof Function)
                this.errorCallbacks.push(error);
            else
                this.errorCallbacks.trigger(error);
        }

        public version = PLUGIN_VERSION;
    }

    export let store: Store;

    /**
     * @internal
     *
     * This namespace contains things never meant for being used directly by the user of the plugin.
     */
    export namespace Internal {
    }
}

setTimeout(() => {
    window.CdvPurchase = CdvPurchase;
    window.CdvPurchase.store = CdvPurchase.Store.instance;
}, 0);

/// <reference path="utils/format-billing-cycle.ts" />
