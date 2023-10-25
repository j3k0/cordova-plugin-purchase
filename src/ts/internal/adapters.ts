namespace CdvPurchase
{
    export namespace PlatformOptions {
        export interface Braintree {
            platform: Platform.BRAINTREE;
            options: Braintree.AdapterOptions;
        }

        export interface GooglePlay {
            platform: Platform.GOOGLE_PLAY;
        }

        export interface AppleAppStore {
            platform: Platform.APPLE_APPSTORE;
            options?: AppleAppStore.AdapterOptions;
        }

        export interface Test { platform: Platform.TEST; }
        export interface WindowsStore { platform: Platform.WINDOWS_STORE; }
    }

    /**
     * Used to initialize a platform with some options
     *
     * @see {@link Store.initialize}
     */
    export type PlatformWithOptions =
        | PlatformOptions.Braintree
        | PlatformOptions.AppleAppStore
        | PlatformOptions.GooglePlay
        | PlatformOptions.Test
        | PlatformOptions.WindowsStore
        ;

    /** @internal */
    export namespace Internal {

        export interface AdapterListener {
            productsUpdated(platform: Platform, products: Product[]): void;
            receiptsUpdated(platform: Platform, receipts: Receipt[]): void;
            receiptsReady(platform: Platform): void;
        }

        /** Adapter execution context */
        export interface AdapterContext {
            /** Logger */
            log: Logger;

            /** Verbosity level */
            verbosity: LogLevel;

            /** Report an Error */
            error: (error: IError) => void;

            /** List of registered products */
            registeredProducts: Internal.RegisteredProducts;

            /** The events listener */
            listener: AdapterListener;

            /** Retrieves the application username */
            getApplicationUsername: () => string | undefined;

            /** Functions used to decorate the API */
            apiDecorators: ProductDecorator & TransactionDecorator & OfferDecorator & ReceiptDecorator;
        }


        /**
         * The list of active platform adapters
         */
        export class Adapters {

            /**
             * List of instantiated adapters.
             *
             * They are added to this list by "initialize()".
             */
            public list: Adapter[] = [];

            add(log: Logger, adapters: (PlatformWithOptions)[], context: AdapterContext) {
                adapters.forEach(po => {
                    log.info("")
                    if (this.find(po.platform)) return;
                    switch (po.platform) {
                        case Platform.APPLE_APPSTORE:
                            return this.list.push(new AppleAppStore.Adapter(context, po.options || {}));
                        case Platform.GOOGLE_PLAY:
                            return this.list.push(new GooglePlay.Adapter(context));
                        case Platform.BRAINTREE:
                            if (!po.options) {
                                log.error('Options missing for Braintree initialization. Use {platform: Platform.BRAINTREE, options: {...}} in your call to store.initialize');
                            }
                            return this.list.push(new Braintree.Adapter(context, po.options));
                        case Platform.TEST:
                            return this.list.push(new Test.Adapter(context));
                        default:
                            return;
                    }
                });
            }

            /**
             * Initialize some platform adapters.
             */
            async initialize(platforms: (Platform | PlatformWithOptions)[], context: AdapterContext): Promise<IError[]> {
                const newPlatforms = platforms.map(p => typeof p === 'string' ? { platform: p } : p).filter(p => !this.find(p.platform)) as PlatformWithOptions[];
                const log = context.log.child('Adapters');
                log.info("Adding platforms: " + JSON.stringify(newPlatforms));
                this.add(log, newPlatforms, context);
                const products = context.registeredProducts.byPlatform();
                const result = await Promise.all(newPlatforms.map(async (platformToInit) => {
                    const platformProducts = products.filter(p => p.platform === platformToInit.platform)?.[0]?.products ?? [];
                    const adapter = this.find(platformToInit.platform);
                    if (!adapter) return;
                    log.info(`${adapter.name} initializing...`);
                    if (!adapter.isSupported) {
                        log.info(`${adapter.name} is not supported.`);
                        return; // skip unsupported adapters
                    }
                    const initResult = await adapter.initialize();
                    adapter.ready = true;
                    log.info(`${adapter.name} initialized. ${initResult ? JSON.stringify(initResult) : ''}`);
                    if (initResult?.code) return initResult;
                    log.info(`${adapter.name} products: ${JSON.stringify(platformProducts)}`);
                    if (platformProducts.length === 0) return;
                    let loadProductsResult: (IError|Product)[] = [];
                    let loadReceiptsResult: Receipt[] = [];
                    if (adapter.supportsParallelLoading) {
                        [loadProductsResult, loadReceiptsResult] = await Promise.all([
                            adapter.loadProducts(platformProducts),
                            adapter.loadReceipts()
                        ]);
                    }
                    else {
                        loadProductsResult = await adapter.loadProducts(platformProducts);
                        loadReceiptsResult = await adapter.loadReceipts();
                    }
                    // const loadProductsResult = await adapter.loadProducts(platformProducts);
                    log.info(`${adapter.name} products loaded: ${JSON.stringify(loadProductsResult)}`);
                    const loadedProducts = loadProductsResult.filter(p => p instanceof Product) as Product[];
                    context.listener.productsUpdated(platformToInit.platform, loadedProducts);
                    // const loadReceiptsResult = await adapter.loadReceipts();
                    log.info(`${adapter.name} receipts loaded: ${JSON.stringify(loadReceiptsResult)}`);
                    return loadProductsResult.filter(lr => 'code' in lr && 'message' in lr)[0] as (IError | undefined);
                }));
                return result.filter(err => err) as IError[];
            }

            /**
             * Retrieve a platform adapter.
             */
            find(platform: Platform): Adapter | undefined {
                return this.list.filter(a => a.id === platform)[0];
            }

            /**
             * Retrieve the first platform adapter in the ready state, if any.
             *
             * You can optionally force the platform adapter you are looking for.
             *
             * Useful for methods that accept an optional "platform" argument, so they either act
             * on the only active adapter or on the one selected by the user, if it's ready.
             */
            findReady(platform?: Platform): Adapter | undefined {
                return this.list.filter(adapter => (!platform || adapter.id === platform) && adapter.ready)[0];
            }
        }
    }
}
