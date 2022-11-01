namespace CdvPurchase
{
    export type PlatformWithOptions =
        | { platform: Platform.BRAINTREE; options: Braintree.AdapterOptions; }
        | { platform: Platform.GOOGLE_PLAY; }
        | { platform: Platform.APPLE_APPSTORE; }
        | { platform: Platform.TEST; }
        | { platform: Platform.WINDOWS_STORE; }
        ;

    export namespace Internal {

        /** Adapter execution context */
        export interface AdapterContext {
            /** Logger */
            log: Logger;

            /** Verbosity level */
            verbosity: LogLevel;

            /** Error reporting */
            error: (error: IError) => void;

            /** List of registered products */
            registeredProducts: Internal.RegisteredProducts;

            /** The events listener */
            listener: AdapterListener;

            /** Retrieves the application username */
            getApplicationUsername: () => string | undefined;
        }


        /**
         * The list of active platform adapters
         */
        export class Adapters {

            public list: Adapter[] = [];

            add(log: Logger, adapters: (PlatformWithOptions)[], context: AdapterContext) {
                adapters.forEach(po => {
                    log.info("")
                    if (this.find(po.platform)) return;
                    switch (po.platform) {
                        case Platform.APPLE_APPSTORE:
                            return this.list.push(new AppleAppStore.Adapter(context));
                        case Platform.GOOGLE_PLAY:
                            return this.list.push(new GooglePlay.Adapter(context));
                        case Platform.BRAINTREE:
                            if (!po.options) {
                                log.error('Options missing for Braintree initialization. Use {platform: Platform.BRAINTREE, options: {...}} in your call to store.initialize');
                            }
                            return this.list.push(new Braintree.Adapter(context, po.options));
                        case Platform.TEST:
                        default:
                            return this.list.push(new Test.Adapter());
                    }
                });
            }

            /**
             * Initialize some platform adapters.
             */
            async initialize(platforms: (Platform | PlatformWithOptions)[] = [Store.defaultPlatform()], context: AdapterContext): Promise<IError[]> {
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
                    const initResult = await adapter.initialize();
                    log.info(`${adapter.name} initialized. ${initResult && JSON.stringify(initResult)}`);
                    if (initResult?.code) return initResult;
                    log.info(`${adapter.name} products: ${JSON.stringify(platformProducts)}`);
                    if (platformProducts.length === 0) return;
                    const loadResult = await adapter.load(platformProducts);
                    log.info(`${adapter.name} loaded: ${JSON.stringify(loadResult)}`);
                    const loadedProducts = loadResult.filter(p => p instanceof Product) as Product[];
                    context.listener.productsUpdated(platformToInit.platform, loadedProducts);
                    return loadResult.filter(lr => 'code' in lr && 'message' in lr)[0] as (IError | undefined);
                }));
                return result.filter(err => err) as IError[];
            }

            /**
             * Retrieve a platform adapter.
             */
            find(platform: Platform): Adapter | undefined {
                return this.list.filter(a => a.id === platform)[0];
            }
        }
    }
}
