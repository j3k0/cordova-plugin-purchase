namespace CDVPurchase2 {

    export const PLUGIN_VERSION = '13.0.0';

    interface StoreAdapterDelegate {
        updatedCallbacks: Callbacks<Product>;
    }

    class StoreAdapterListener implements AdapterListener {

        delegate: StoreAdapterDelegate;
        constructor(delegate: StoreAdapterDelegate) { this.delegate = delegate; }

        productsUpdated(platform: Platform, products: Product[]): void {
            products.forEach(product => this.delegate.updatedCallbacks.trigger(product));
        }
    }

    export class Store {

        /** Payment platform adapters */
        public adapters = new Internal.Adapters();

        /** List of registered products */
        public registeredProducts = new Internal.RegisteredProducts();

        /** Logger */
        public log = new Internal.Log(this);

        /** Verbosity level for log */
        public verbosity: LogLevel = LogLevel.ERROR;

        /** Return the identifier of the user for your application */
        public applicationUsername?: string | (() => string);

        /** Get the application username as a string by either calling or returning Store.applicationUsername */
        getApplicationUsername(): string | undefined {
            if (this.applicationUsername instanceof Function) return this.applicationUsername();
            return this.applicationUsername;
        }

        /** URL or implementation of the receipt validator */
        public validator: string | ValidatorFunction | ValidatorTarget | undefined;

        private _validator: Internal.Validator = new Internal.Validator(this);

        /** When adding information to receipt validation requests, those can serve different functions:
         *
         *  - handling support requests
         *  - fraud detection
         *  - analytics
         *  - tracking
         */
        public validator_privacy_policy?: PrivacyPolicyItem | PrivacyPolicyItem[];

        /** List of callbacks for the "ready" events */
        private _readyCallbacks = new ReadyCallbacks();

        /** Listens to adapters */
        listener: StoreAdapterListener;

        constructor() {
            this.listener = new StoreAdapterListener({
                updatedCallbacks: this.updatedCallbacks,
            });
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
        async initialize(platforms: Platform[] = [Store.defaultPlatform()]): Promise<IError[]> {
            const ret = this.adapters.initialize(platforms, this);
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

        when() {
            const ret: When = {
                updated: (cb: Callback<Product>) => (this.updatedCallbacks.push(cb), ret),
                owned: (cb: Callback<Product>) => (this.ownedCallbacks.push(cb), ret),
                approved: (cb: Callback<Transaction>) => (this.approvedCallbacks.push(cb), ret),
                finished: (cb: Callback<Transaction>) => (this.finishedCallbacks.push(cb), ret),
                verified: (cb: Callback<Receipt>) => (this.verifiedCallbacks.push(cb), ret),
            };
            return ret;
        }

        /** Callbacks when a product definition was updated */
        private updatedCallbacks = new Callbacks<Product>();

        /** Callbacks when a product is owned */
        private ownedCallbacks = new Callbacks<Product>();

        /** Callbacks when a transaction has been approved */
        private approvedCallbacks = new Callbacks<Transaction>();

        /** Callbacks when a transaction has been finished */
        private finishedCallbacks = new Callbacks<Transaction>();

        /** Callbacks when a receipt has been validated */
        private verifiedCallbacks = new Callbacks<Receipt>();

        /** List of all active products */
        get products(): Product[] {
            // concatenate products all all active platforms
            return ([] as Product[]).concat(...this.adapters.list.map(a => a.products));
        }

        /** Find a product from its id and platform */
        get(productId: string, platform: Platform = Store.defaultPlatform()): Product | undefined {
            return this.adapters.find(platform)?.products.find(p => p.id === productId);
        }

        /** List of all receipts */
        get receipts(): Receipt[] {
            // concatenate products all all active platforms
            return ([] as Receipt[]).concat(...this.adapters.list.map(a => a.receipts));
        }

        async order(offer: Offer, additionalData: AdditionalData): Promise<IError | Transaction> {
            const adapter = this.adapters.find(offer.product.platform);
            if (!adapter) return {
                code: ErrorCode.PAYMENT_NOT_ALLOWED,
                message: 'Adapter not found for this platform (' + offer.product.platform + ')',
            } as IError;
            return adapter.order(offer, additionalData);
        }

        async verify(receiptOrTransaction: Transaction | Receipt) {
            this._validator.add(receiptOrTransaction);
            // Run validation after 50ms, so if the same receipt is to be validated multiple times it will just create one call.
            setTimeout(() => this._validator.run((receipt: Receipt) => {
                this.verifiedCallbacks.trigger(receipt);
            }), 50);
        }

        async finish(value: Transaction | Receipt) {
        }

        async restorePurchases() {
        }

        /**
         * The default payment platform to use depending on the OS.
         *
         * - on iOS: `APPLE_APPSTORE`
         * - on Android: `GOOGLE_PLAY`
         */
        static defaultPlatform(): Platform {
            switch (cordova.platformId) {
                case 'android': return Platform.GOOGLE_PLAY;
                case 'ios': return Platform.APPLE_APPSTORE;
                default: return Platform.TEST;
            }
        }

        errorCallbacks = new Callbacks<IError>;
        error(error: IError | Callback<IError>): void {
            if (error instanceof Function)
                this.errorCallbacks.push(error);
            else
                this.errorCallbacks.trigger(error);
        }

        public version = PLUGIN_VERSION;
    }


    export namespace WindowsStore {
        export class Adapter implements Adapter {
            id = Platform.WINDOWS_STORE;
            products: Product[] = [];
            receipts: Receipt[] = [];
            async initialize(): Promise<IError | undefined> { return; }
            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> { return products.map(p => ({ code: ErrorCode.PRODUCT_NOT_AVAILABLE, message: 'TODO' } as IError)); }
        }
    }

    export namespace Braintree {
        export class Adapter implements Adapter {
            id = Platform.BRAINTREE;
            products: Product[] = [];
            receipts: Receipt[] = [];
            async initialize(): Promise<IError | undefined> { return; }
            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> { return products.map(p => ({ code: ErrorCode.PRODUCT_NOT_AVAILABLE, message: 'TODO' } as IError)); }
            async order(offer: Offer): Promise<Transaction | IError> {
                return {
                    code: ErrorCode.UNKNOWN,
                    message: 'TODO: Not implemented'
                } as IError;
            }
        }
    }

    export namespace Test {
        export class Adapter implements Adapter {
            id = Platform.TEST;
            products: Product[] = [];
            receipts: Receipt[] = [];
            async initialize(): Promise<IError | undefined> { return; }
            async load(products: IRegisterProduct[]): Promise<(Product | IError)[]> { return products.map(p => ({ code: ErrorCode.PRODUCT_NOT_AVAILABLE, message: 'TODO' } as IError)); }
            async order(offer: Offer): Promise<Transaction | IError> {
                return {
                    code: ErrorCode.UNKNOWN,
                    message: 'TODO: Not implemented'
                } as IError;
            }
        }
    }
}

(window as any).Iaptic = CDVPurchase2;
setTimeout(() => {
    window.CDVPurchase2 = (window as any).Iaptic;
    window.store = new CDVPurchase2.Store();
    Object.assign(window.store, CDVPurchase2.LogLevel, CDVPurchase2.ProductType, CDVPurchase2.ErrorCode);
}, 0);

/** window.store - the global store object */
// declare var store: CDVPurchase2.Store;
// window.store = new CDVPurchase2.Store();
