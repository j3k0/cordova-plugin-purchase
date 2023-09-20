namespace CdvPurchase {

    /**
     * Data provided to store.register()
     */
    export interface IRegisterProduct {

        /** Identifier of the product on the store */
        id: string;

        /**
         * The payment platform the product is available on.
         */
        platform: Platform;

        /** Product type, should be one of the defined product types */
        type: ProductType;

        /**
         * Name of the group your subscription product is a member of.
         *
         * If you don't set anything, all subscription will be members of the same group.
         */
        group?: string;
    }

    export namespace Internal {

        function isValidRegisteredProduct(product: any): product is IRegisterProduct{
            if (typeof product !== 'object') return false;
            return product.hasOwnProperty('platform')
                && product.hasOwnProperty('id')
                && product.hasOwnProperty('type');
        }

        export class RegisteredProducts {

            public list: IRegisterProduct[] = [];

            find(platform: Platform, id: string): IRegisterProduct | undefined {
                return this.list.find(rp => rp.platform === platform && rp.id === id);
            }

            add(product: IRegisterProduct | IRegisterProduct[]): IError[] {
                const errors: IError[] = [];
                const products = Array.isArray(product) ? product : [product];
                const newProducts = products.filter(p => !this.find(p.platform, p.id));
                for (const p of newProducts) {
                    if (isValidRegisteredProduct(p))
                        this.list.push(p);
                    else
                        errors.push(storeError(ErrorCode.LOAD,
                            'Invalid parameter to "register", expected "id", "type" and "platform". '
                            + 'Got: ' + JSON.stringify(p), null, null));
                }
                return errors;
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
