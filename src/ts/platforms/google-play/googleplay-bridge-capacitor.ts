namespace CdvPurchase {
    export namespace GooglePlay {
        export namespace Bridge {

            let log = function log(msg: string) {
                console.log("InAppBilling[capacitor]: " + msg);
            }

            /**
             * Capacitor implementation of the Google Play bridge.
             * Uses Capacitor.Plugins.PurchasePlugin instead of cordova.exec().
             */
            export class CapacitorBridge implements BridgeInterface {

                options: Options = {};

                /** Check if the Capacitor purchase plugin is available */
                static isAvailable(): boolean {
                    const marker = window.CdvPurchaseCapacitor;
                    return !!(marker && marker.installed);
                }

                private get plugin(): any {
                    return window.Capacitor?.Plugins?.PurchasePlugin;
                }

                init(success: () => void, fail: ErrorCallback, options: Options) {
                    if (!options) options = {};
                    if (options.log) log = options.log;

                    this.options = {
                        showLog: options.showLog !== false,
                        onPurchaseConsumed: options.onPurchaseConsumed,
                        onPurchasesUpdated: options.onPurchasesUpdated,
                        onSetPurchases: options.onSetPurchases,
                        onPriceChangeConfirmationResult: options.onPriceChangeConfirmationResult,
                    };

                    if (this.options.showLog) {
                        log('init');
                    }

                    // Register event listeners
                    const plugin = this.plugin;
                    if (!plugin) {
                        fail('Capacitor PurchasePlugin not available');
                        return;
                    }

                    plugin.addListener('setPurchases', (data: any) => {
                        if (this.options.onSetPurchases) {
                            this.options.onSetPurchases(data.purchases);
                        }
                    });

                    plugin.addListener('purchasesUpdated', (data: any) => {
                        if (this.options.onPurchasesUpdated) {
                            this.options.onPurchasesUpdated(data.purchases);
                        }
                    });

                    plugin.addListener('purchaseConsumed', (data: any) => {
                        if (this.options.onPurchaseConsumed) {
                            this.options.onPurchaseConsumed(data.purchase);
                        }
                    });

                    plugin.addListener('priceChangeConfirmationResult', (data: any) => {
                        if (this.options.onPriceChangeConfirmationResult) {
                            this.options.onPriceChangeConfirmationResult(data.result);
                        }
                    });

                    // Initialize the native billing client
                    plugin.init()
                        .then(() => success())
                        .catch((err: any) => fail(err?.message || 'init failed', err?.code));
                }

                load(success: () => void, fail: ErrorCallback,
                     skus: string[], inAppSkus: string[], subsSkus: string[]) {
                    if (this.options.showLog) {
                        log('load ' + JSON.stringify(skus));
                    }
                    // Note: The adapter never calls load() directly — it uses
                    // getAvailableProducts(). This implementation is for interface
                    // completeness and passes all parameters through.
                    this.plugin.getAvailableProducts({ inAppSkus, subsSkus })
                        .then(() => success())
                        .catch((err: any) => fail(err?.message || 'load failed', err?.code));
                }

                getPurchases(success: () => void, fail: ErrorCallback) {
                    if (this.options.showLog) {
                        log('getPurchases()');
                    }
                    this.plugin.getPurchases()
                        .then(() => success())
                        .catch((err: any) => fail(err?.message || 'getPurchases failed', err?.code));
                }

                buy(success: () => void, fail: ErrorCallback,
                    productId: string, additionalData: CdvPurchase.AdditionalData) {
                    if (this.options.showLog) {
                        log('buy()');
                    }
                    this.plugin.buy({
                        productId,
                        additionalData: extendAdditionalData(additionalData),
                    })
                        .then(() => success())
                        .catch((err: any) => fail(err?.message || 'buy failed', err?.code));
                }

                subscribe(success: () => void, fail: ErrorCallback,
                          productId: string, additionalData: CdvPurchase.AdditionalData) {
                    if (this.options.showLog) {
                        log('subscribe()');
                    }
                    this.plugin.subscribe({
                        productId,
                        additionalData: extendAdditionalData(additionalData),
                    })
                        .then(() => success())
                        .catch((err: any) => fail(err?.message || 'subscribe failed', err?.code));
                }

                consumePurchase(success: () => void, fail: ErrorCallback,
                                purchaseToken: string) {
                    if (this.options.showLog) {
                        log('consumePurchase()');
                    }
                    this.plugin.consumePurchase({ purchaseToken })
                        .then(() => success())
                        .catch((err: any) => fail(err?.message || 'consumePurchase failed', err?.code));
                }

                acknowledgePurchase(success: () => void, fail: ErrorCallback,
                                    purchaseToken: string) {
                    if (this.options.showLog) {
                        log('acknowledgePurchase()');
                    }
                    this.plugin.acknowledgePurchase({ purchaseToken })
                        .then(() => success())
                        .catch((err: any) => fail(err?.message || 'acknowledgePurchase failed', err?.code));
                }

                getAvailableProducts(inAppSkus: string[], subsSkus: string[],
                                     success: (validProducts: (InAppProduct | Subscription)[]) => void,
                                     fail: ErrorCallback) {
                    if (this.options.showLog) {
                        log('getAvailableProducts()');
                    }
                    this.plugin.getAvailableProducts({ inAppSkus, subsSkus })
                        .then((result: any) => success(result.products))
                        .catch((err: any) => fail(err?.message || 'getAvailableProducts failed', err?.code));
                }

                manageSubscriptions() {
                    this.plugin.manageSubscriptions();
                }

                manageBilling() {
                    this.plugin.manageBilling();
                }

                launchPriceChangeConfirmationFlow(productId: string) {
                    this.plugin.launchPriceChangeConfirmationFlow({ productId });
                }
            }

            function ensureObject<T extends Object>(obj: any): T {
                return !!obj && obj.constructor === Object ? obj : {} as T;
            }

            function extendAdditionalData(ad?: CdvPurchase.AdditionalData): AdditionalData {
                const additionalData: AdditionalData = ensureObject(ad?.googlePlay);
                if (!additionalData.accountId && ad?.applicationUsername) {
                    additionalData.accountId = Utils.md5(ad.applicationUsername);
                }
                return additionalData;
            }
        }
    }
}
