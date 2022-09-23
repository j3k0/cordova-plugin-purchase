namespace CDVPurchase2
{

    export namespace Internal {

        /** Adapter execution context */
        export interface AdapterContext {
            /** Logger */
            log: Log;

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

        export class Adapters {

            public list: Adapter[] = [];

            add(adapters: Platform[], context: AdapterContext) {
                adapters.forEach(platform => {
                    if (this.find(platform)) return;
                    switch (platform) {
                        case Platform.APPLE_APPSTORE:
                            this.list.push(new AppleStore.Adapter(context));
                        case Platform.GOOGLE_PLAY:
                            this.list.push(new GooglePlay.Adapter(context));
                        case Platform.BRAINTREE:
                            this.list.push(new Braintree.Adapter());
                        case Platform.TEST:
                        default:
                            this.list.push(new Test.Adapter());
                    }
                });
            }

            async initialize(platforms: Platform[] = [Store.defaultPlatform()], context: AdapterContext): Promise<IError[]> {
                const newPlatforms = platforms.filter(p => !this.find(p));
                this.add(newPlatforms, context);
                const products = context.registeredProducts.byPlatform();
                const result = await Promise.all(newPlatforms.map(async (platform) => {
                    const platformProducts = products.filter(p => p.platform === platform)?.[0]?.products ?? [];
                    const adapter = this.find(platform);
                    if (!adapter) return;
                    const initResult = await adapter.initialize();
                    context.log.info(`Adapter ${platform}. Initialized: ${JSON.stringify(initResult)}`);
                    if (initResult?.code) return initResult;
                    context.log.info(`Adapter ${platform}. Products: ${JSON.stringify(platformProducts)}`);
                    if (platformProducts.length === 0) return;
                    const loadResult = await adapter.load(platformProducts);
                    context.log.info(`Adapter ${platform}. Products loaded: ${JSON.stringify(loadResult)}`);
                    const loadedProducts = loadResult.filter(p => p instanceof Product) as Product[];
                    context.listener.productsUpdated(platform, loadedProducts);
                    return loadResult.filter(lr => 'code' in lr && 'message' in lr)[0] as (IError | undefined);
                }));
                return result.filter(err => err) as IError[];
            }

            find(platform: Platform): Adapter | undefined {
                return this.list.filter(a => a.id === platform)[0];
            }
        }
    }
}
