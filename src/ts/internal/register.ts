namespace CdvPurchase {

    /**
     * Data provided to store.register()
     */
    export interface IRegisterProduct {

        /** Identifier of the product on the store */
        id: string;

        /**
         * List of payment platforms the product is available on
         *
         * If you do not specify anything, the product is assumed to be available only on the
         * default payment platform. (Apple AppStore on iOS, Google Play on Android)
         */
        platform: Platform;

        /** Product type, should be one of the defined product types */
        type: ProductType;

        /**
         * Name of the group your subscription product is a member of (default to "default").
         *
         * If you don't set anything, all subscription will be members of the same group.
         */
        group?: string;
    }

    export namespace Internal {

        export class RegisteredProducts {

            public list: IRegisterProduct[] = [];

            find(platform: Platform, id: string): IRegisterProduct | undefined {
                return this.list.find(rp => rp.platform === platform && rp.id === id);
            }

            add(product: IRegisterProduct | IRegisterProduct[]) {
                const products = Array.isArray(product) ? product : [product];
                const newProducts = products.filter(p => !this.find(p.platform, p.id));
                for (const p of newProducts) this.list.push(p);
            }

            byPlatform(): { platform: Platform; products: IRegisterProduct[]; }[] {
                const byPlatform: { [platform: string]: IRegisterProduct[]; } = {};
                this.list.forEach(p => {
                    byPlatform[p.platform] = (byPlatform[p.platform] || []).concat(p);
                });
                return Object.keys(byPlatform).map(platform => ({
                    platform: platform as Platform,
                    products: byPlatform[platform]
                }));
            }
        }

    }
}
