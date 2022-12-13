/// <reference path="validator/validator.ts" />
/// <reference path="log.ts" />
/// <reference path="internal/adapters.ts" />
/// <reference path="internal/callbacks.ts" />
/// <reference path="internal/ready.ts" />

/**
 * Namespace for the cordova-plugin-purchase plugin.
 *
 * All classes, enumerations and variables defined by the plugin are in this namespace.
 *
 * Throughout the documentation, in order to keep examples readable, we omit the `CdvPurchase` prefix.
 *
 * When you see, for example `ProductType.PAID_SUBSCRIPTION`, it refers to `CdvPurchase.ProductType.PAID_SUBSCRIPTION`.
 *
 * In the files that interact with the plugin, I recommend creating those shortcuts (and more if needed):
 *
 * ```ts
 * const {store, ProductType, Platform, LogLevel} = CdvPurchase;
 * ```
 */
namespace CdvPurchase {

    /**
     * Current release number of the plugin.
     */
    export const PLUGIN_VERSION = '13.0.2';

    /**
     * Entry class of the plugin.
     */
    export class Store {

        /**
         * Payment platform adapters.
         */
        private adapters = new Internal.Adapters();

        /**
         * Retrieve a platform adapter.
         *
         * The platform adapter has to have been initialized before.
         *
         * @see {@link initialize}
         */
        getAdapter(platform: Platform) {
            return this.adapters.find(platform);
        }

        /**
         * List of registered products.
         *
         * Products are added to this list of products by {@link Store.register}, an internal job will defer loading to the platform adapters.
         */
        private registeredProducts = new Internal.RegisteredProducts();

        /** Logger */
        public log = new Logger(this);

        /**
         * Verbosity level used by the plugin logger
         *
         * Set to:
         *
         *  - LogLevel.QUIET or 0 to disable all logging (default)
         *  - LogLevel.ERROR or 1 to show only error messages
         *  - LogLevel.WARNING or 2 to show warnings and errors
         *  - LogLevel.INFO or 3 to also show information messages
         *  - LogLevel.DEBUG or 4 to enable internal debugging messages.
         *
         * @see {@link LogLevel}
         */
        public verbosity: LogLevel = LogLevel.ERROR;

        /** Return the identifier of the user for your application */
        public applicationUsername?: string | (() => string);

        /**
         * Get the application username as a string by either calling or returning {@link Store.applicationUsername}
        */
        getApplicationUsername(): string | undefined {
            if (this.applicationUsername instanceof Function) return this.applicationUsername();
            return this.applicationUsername;
        }

        /**
         * URL or implementation of the receipt validation service
         *
         * @example
         * Define the validator as a string
         * ```ts
         * CdvPurchase.store.validator = "https://validator.iaptic.com/v1/validate?appName=test"
         * ```
         *
         * @example
         * Define the validator as a function
         * ```ts
         * CdvPurchase.store.validator = (receipt, callback) => {
         *   callback({
         *     ok: true,
         *     data: {
         *       // see CdvPurchase.Validator.Response.Payload for details
         *     }
         *   })
         * }
         * ```
         *
         * @see {@link CdvPurchase.Validator.Response.Payload}
         */
        public validator: string | Validator.Function | Validator.Target | undefined;

        /**
         * When adding information to receipt validation requests, those can serve different functions:
         *
         *  - handling support requests
         *  - fraud detection
         *  - analytics
         *  - tracking
         *
         * Make sure the value your select is in line with your application's privacy policy and your users' tracking preference.
         *
         * @example
         * CdvPurchase.store.validator_privacy_policy = [
         *   'fraud', 'support', 'analytics', 'tracking'
         * ]
         */
        public validator_privacy_policy: PrivacyPolicyItem | PrivacyPolicyItem[] | undefined;

        /** List of callbacks for the "ready" events */
        private _readyCallbacks = new Internal.ReadyCallbacks(this.log);

        /** Listens to adapters */
        private listener: Internal.StoreAdapterListener;

        /** Callbacks when a product definition was updated */
        private updatedCallbacks = new Internal.Callbacks<Product>(this.log, 'productUpdated()');

        /** Callback when a receipt was updated */
        private updatedReceiptsCallbacks = new Internal.Callbacks<Receipt>(this.log, 'receiptUpdated()');

        /** Callbacks when a product is owned */
        // private ownedCallbacks = new Callbacks<Product>();

        /** Callbacks when a transaction has been approved */
        private approvedCallbacks = new Internal.Callbacks<Transaction>(this.log, 'approved()');

        /** Callbacks when a transaction has been finished */
        private finishedCallbacks = new Internal.Callbacks<Transaction>(this.log, 'finished()');

        /** Callbacks when a receipt has been validated */
        private verifiedCallbacks = new Internal.Callbacks<VerifiedReceipt>(this.log, 'verified()');

        /** Callbacks for errors */
        private errorCallbacks = new Internal.Callbacks<IError>(this.log, 'error()');

        /** Internal implementation of the receipt validation service integration */
        private _validator: Internal.Validator;

        /** Monitor state changes for transactions */
        private transactionStateMonitors: Internal.TransactionStateMonitors;

        constructor() {
            this.listener = new Internal.StoreAdapterListener({
                updatedCallbacks: this.updatedCallbacks,
                updatedReceiptCallbacks: this.updatedReceiptsCallbacks,
                approvedCallbacks: this.approvedCallbacks,
                finishedCallbacks: this.finishedCallbacks,
            });
            this.transactionStateMonitors = new Internal.TransactionStateMonitors(this.when());

            const store = this;
            this._validator = new Internal.Validator({
                adapters: this.adapters,
                getApplicationUsername: this.getApplicationUsername.bind(this),
                get localReceipts() { return store.localReceipts; },
                get validator() { return store.validator; },
                get validator_privacy_policy() { return store.validator_privacy_policy; },
                verifiedCallbacks: this.verifiedCallbacks,
                finish: (receipt: VerifiedReceipt) => this.finish(receipt),
            }, this.log);
        }

        /**
         * Register a product.
         *
         * @example
         * store.register([{
         *       id: 'subscription1',
         *       type: ProductType.PAID_SUBSCRIPTION,
         *       platform: Platform.APPLE_APPSTORE,
         *   }, {
         *       id: 'subscription1',
         *       type: ProductType.PAID_SUBSCRIPTION,
         *       platform: Platform.GOOGLE_PLAY,
         *   }, {
         *       id: 'consumable1',
         *       type: ProductType.CONSUMABLE,
         *       platform: Platform.BRAINTREE,
         *   }]);
         */
        register(product: IRegisterProduct | IRegisterProduct[]) {
            this.registeredProducts.add(product);
        }

        /**
         * Call to initialize the in-app purchase plugin.
         *
         * @param platforms - List of payment platforms to initialize, default to Store.defaultPlatform().
         */
        async initialize(platforms: (Platform | PlatformWithOptions)[] = [this.defaultPlatform()]): Promise<IError[]> {
            this.log.info('initialize()');
            const store = this;
            const ret = this.adapters.initialize(platforms, {
                error: this.triggerError.bind(this),
                get verbosity() { return store.verbosity; },
                getApplicationUsername() { return store.getApplicationUsername() },
                get listener() { return store.listener; },
                get log() { return store.log; },
                get registeredProducts() { return store.registeredProducts; },
                apiDecorators: {
                    canPurchase: this.canPurchase.bind(this),
                    owned: this.owned.bind(this),
                    finish: this.finish.bind(this),
                    order: this.order.bind(this),
                    verify: this.verify.bind(this),
                },
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
            this.log.info('update()');
            // Load products metadata
            for (const registration of this.registeredProducts.byPlatform()) {
                const products = await this.adapters.findReady(registration.platform)?.load(registration.products);
                products?.forEach(p => {
                    if (p instanceof Product) this.updatedCallbacks.trigger(p);
                });
            }
        }

        /** Register a callback to be called when the plugin is ready. */
        ready(cb: Callback<void>): void { this._readyCallbacks.add(cb); }

        /**
         * Setup events listener.
         *
         * @example
         * store.when()
         *      .productUpdated(product => updateUI(product))
         *      .approved(transaction => transaction.verify())
         *      .verified(receipt => receipt.finish());
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

        /**
         * Remove a callback from any listener it might have been added to.
         */
        off<T>(callback: Callback<T>) {
            this.updatedCallbacks.remove(callback as any);
            this.updatedReceiptsCallbacks.remove(callback as any);
            this.approvedCallbacks.remove(callback as any);
            this.finishedCallbacks.remove(callback as any);
            this.verifiedCallbacks.remove(callback as any);
            this.errorCallbacks.remove(callback as any);
            this._readyCallbacks.remove(callback as any);
        }

        /**
         * Setup a function to be notified of changes to a transaction state.
         *
         * @param transaction The transaction to monitor.
         * @param onChange Function to be called when the transaction status changes.
         * @return A monitor which can be stopped with `monitor.stop()`
         *
         * @example
         * const monitor = store.monitor(transaction, state => {
         *   console.log('new state: ' + state);
         *   if (state === TransactionState.FINISHED)
         *     monitor.stop();
         * });
         */
        monitor(transaction: Transaction, onChange: Callback<TransactionState>): TransactionMonitor {
            return this.transactionStateMonitors.start(
                transaction,
                Utils.safeCallback(this.log, 'monitor()', onChange));
        }

        /**
         * List of all active products.
         *
         * Products are active if their details have been successfully loaded from the store.
         */
        get products(): Product[] {
            // concatenate products all all active platforms
            return ([] as Product[]).concat(...this.adapters.list.map(a => a.products));
        }

        /**
         * Find a product from its id and platform
         *
         * @param productId Product identifier on the platform.
         * @param platform The product the product exists in. Can be omitted if you're only using a single payment platform.
         */
        get(productId: string, platform?: Platform): Product | undefined {
            return this.adapters.findReady(platform)?.products.find(p => p.id === productId);
        }

        /**
         * List of all receipts present on the device.
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

        /**
         * List of receipts verified with the receipt validation service.
         *
         * Those receipt contains more information and are generally more up-to-date than the local ones.
         */
        get verifiedReceipts(): VerifiedReceipt[] {
            return this._validator.verifiedReceipts;
        }

        /**
         * List of all purchases from the verified receipts.
         */
        get verifiedPurchases(): VerifiedPurchase[] {
            return Internal.VerifiedReceipts.getVerifiedPurchases(this.verifiedReceipts);
        }

        /**
         * Find the last verified purchase for a given product, from those verified by the receipt validator.
         */
        findInVerifiedReceipts(product: Product): VerifiedPurchase | undefined {
            return Internal.VerifiedReceipts.find(this.verifiedReceipts, product);
        }

        /**
         * Find the latest transaction for a given product, from those reported by the device.
         */
        findInLocalReceipts(product: Product): Transaction | undefined {
            return Internal.LocalReceipts.find(this.localReceipts, product);
        }

        /** Return true if a product or offer can be purchased */
        private canPurchase(offer: Offer | Product) {
            const product = (offer instanceof Offer) ? this.get(offer.productId, offer.platform) : offer;
            return Internal.LocalReceipts.canPurchase(this.localReceipts, product);
        }

        /**
         * Return true if a product is owned
         *
         * @param product - The product object or identifier of the product.
         */
        owned(product: { id: string; platform?: Platform } | string) {
            return Internal.owned({
                product: typeof product === 'string' ? { id: product } : product,
                verifiedReceipts: this.validator ? this.verifiedReceipts : undefined,
                localReceipts: this.localReceipts,
            });
        }

        /**
         * Place an order for a given offer.
         */
        async order(offer: Offer, additionalData?: AdditionalData): Promise<IError | undefined> {
            this.log.info(`order(${offer.productId})`);
            const adapter = this.adapters.findReady(offer.platform);
            if (!adapter) return storeError(ErrorCode.PAYMENT_NOT_ALLOWED, 'Adapter not found or not ready (' + offer.platform + ')');
            const ret = await adapter.order(offer, additionalData || {});
            if (ret && 'isError' in ret) store.triggerError(ret);
            return ret;
        }

        /**
         * Request a payment.
         *
         * A payment is a custom amount to charge the user. Make sure the selected payment platform
         * supports Payment Requests.
         *
         * @param paymentRequest Parameters of the payment request
         * @param additionalData Additional parameters
         */
        requestPayment(paymentRequest: PaymentRequest, additionalData?: AdditionalData): PaymentRequestPromise {
            const adapter = this.adapters.findReady(paymentRequest.platform);
            if (!adapter)
                return PaymentRequestPromise.failed(ErrorCode.PAYMENT_NOT_ALLOWED, 'Adapter not found or not ready (' + paymentRequest.platform + ')');
            const promise = new PaymentRequestPromise();
            adapter.requestPayment(paymentRequest, additionalData).then(result => {
                promise.trigger(result);
                if (result instanceof Transaction) {
                    const onStateChange = (state: TransactionState) => {
                        promise.trigger(result);
                        if (result.state === TransactionState.FINISHED)
                            monitor.stop();
                    }
                    const monitor = this.monitor(result, onStateChange);
                }
            });
            return promise;
        }

        /**
         * Returns true if a platform supports the requested functionality.
         *
         * @example
         * store.checkSupport(Platform.APPLE_APPSTORE, 'requestPayment');
         * // => false
         */
        checkSupport(platform: Platform, functionality: PlatformFunctionality): boolean {
            const adapter = this.adapters.find(platform);
            if (!adapter) return false; // the selected adapter hasn't been initialized
            return adapter.checkSupport(functionality);
        }

        /**
         * Verify a receipt or transacting with the receipt validation service.
         *
         * This will be called from the Receipt or Transaction objects using the API decorators.
         */
        private async verify(receiptOrTransaction: Receipt | Transaction) {
            this.log.info(`verify(${receiptOrTransaction.className})`);
            this._validator.add(receiptOrTransaction);

            // Run validation after 200ms, so if the same receipt is to be validated multiple times it will just create one call.
            setTimeout(() => this._validator.run(), 200);
        }

        /**
         * Finalize a transaction.
         *
         * This will be called from the Receipt, Transaction or VerifiedReceipt objects using the API decorators.
         */
        private async finish(receipt: Transaction | Receipt | VerifiedReceipt) {
            this.log.info(`finish(${receipt.className})`);
            const transactions =
                receipt instanceof VerifiedReceipt
                    ? receipt.sourceReceipt.transactions
                    : receipt instanceof Receipt
                        ? receipt.transactions
                        : [receipt];
            transactions.forEach(transaction => {
                const adapter = this.adapters.findReady(transaction.platform)?.finish(transaction);
            });
        }

        /**
         * Replay the users transactions.
         *
         * This method exists to cover an Apple AppStore requirement.
         */
        async restorePurchases() {
            for (const adapter of this.adapters.list) {
                if (adapter.ready) await adapter.restorePurchases();
            }
            // store.triggerError(storeError(ErrorCode.UNKNOWN, 'restorePurchases() is not implemented yet'));
        }

        /**
         * Open the subscription management interface for the selected platform.
         *
         * If platform is not specified, the first available platform will be used.
         *
         * @example
         * const activeSubscription: Purchase = // ...
         * store.manageSubscriptions(activeSubscription.platform);
         */
        async manageSubscriptions(platform?: Platform): Promise<IError | undefined> {
            this.log.info('manageSubscriptions()');
            const adapter = this.adapters.findReady(platform);
            if (!adapter) return storeError(ErrorCode.SETUP, "Found no adapter ready to handle 'manageSubscription'");
            return adapter.manageSubscriptions();
        }

        /**
         * Opens the billing methods page on AppStore, Play, Microsoft, ...
         *
         * From this page, the user can update their payment methods.
         *
         * If platform is not specified, the first available platform will be used.
         *
         * @example
         * if (purchase.isBillingRetryPeriod)
         *     store.manageBilling(purchase.platform);
         */
        async manageBilling(platform?: Platform): Promise<IError | undefined> {
            this.log.info('manageBilling()');
            const adapter = this.adapters.findReady(platform);
            if (!adapter) return storeError(ErrorCode.SETUP, "Found no adapter ready to handle 'manageBilling'");
            return adapter.manageBilling();
        }

        /**
         * The default payment platform to use depending on the OS.
         *
         * - on iOS: `APPLE_APPSTORE`
         * - on Android: `GOOGLE_PLAY`
         */
        defaultPlatform(): Platform {
            switch (window.cordova.platformId) {
                case 'android': return Platform.GOOGLE_PLAY;
                case 'ios': return Platform.APPLE_APPSTORE;
                default: return Platform.TEST;
            }
        }

        /**
         * Register an error handler.
         *
         * @param error An error callback that takes the error as an argument
         *
         * @example
         * store.error(function(error) {
         *   console.error('CdvPurchase ERROR: ' + error.message);
         * });
         */
        error(error: Callback<IError>): void {
            this.errorCallbacks.push(error);
        }

        /**
         * Trigger an error event.
         *
         * @internal
         */
        triggerError(error: IError) {
            this.errorCallbacks.trigger(error);
        }

        /**
         * Version of the plugin currently installed.
         */
        public version = PLUGIN_VERSION;
    }

    /**
     * The global store object.
     */
    export let store: Store;

    //
    // Documentation for sub-namespaces
    //

    /**
     * @internal
     *
     * This namespace contains things never meant for being used directly by the user of the plugin.
     */
    export namespace Internal {}
}

// Create the CdvPurchase.store object at startup.
setTimeout(() => {
    window.CdvPurchase = CdvPurchase;
    window.CdvPurchase.store = new CdvPurchase.Store();
    // Let's maximize backward compatibility
    Object.assign(window.CdvPurchase.store, CdvPurchase.LogLevel, CdvPurchase.ProductType, CdvPurchase.ErrorCode, CdvPurchase.Platform);
}, 0);

// Ensure utility are included when compiling typescript.
/// <reference path="utils/format-billing-cycle.ts" />
