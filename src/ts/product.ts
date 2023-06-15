namespace CdvPurchase {

    /** @internal */
    export namespace Internal {
        /**
         * Set of function used to decorate Product objects with useful function.
         */
        export interface ProductDecorator {
            /**
             * Returns true if the product is owned.
             */
            owned(product: Product): boolean;

            /**
             * Returns true if the product can be purchased.
             */
            canPurchase(product: Product): boolean;
        }
    }

    /** Product definition from a store */
    export class Product {

        /** @internal */
        className: 'Product' = 'Product';

        /** Platform this product is available from */
        platform: Platform;

        /** Type of product (subscription, consumable, etc.) */
        type: ProductType;

        /** Product identifier on the store (unique per platform) */
        id: string;

        /** List of offers available for this product */
        offers: Offer[];

        /** Product title from the store. */
        title: string = '';

        /** Product full description from the store. */
        description: string = '';

        /**
         * Group the product is member of.
         *
         * Only 1 product of a given group can be owned. This is generally used
         * to provide different levels for subscriptions, for example: silver
         * and gold.
         *
         * Purchasing a different level will replace the previously owned one.
         */
        group?: string;

        /**
         * Shortcut to offers[0].pricingPhases[0]
         *
         * Useful when you know products have a single offer and a single pricing phase.
         */
        get pricing(): PricingPhase | undefined {
            // see Object.defineProperty in the constructor for the actual implementation.
            return this.offers[0]?.pricingPhases[0];
        }

        /**
         * Returns true if the product can be purchased.
         */
        get canPurchase(): boolean {
            // Pseudo implementation to make typescript happy.
            // see Object.defineProperty in the constructor for the actual implementation.
            return false;
        }

        /**
         * Returns true if the product is owned.
         */
        get owned(): boolean {
            // Pseudo implementation to make typescript happy.
            // see Object.defineProperty in the constructor for the actual implementation.
            return false;
        }

        /** @internal */
        constructor(p: IRegisterProduct, decorator: Internal.ProductDecorator) {
            this.platform = p.platform;
            this.type = p.type;
            this.id = p.id;
            this.group = p.group;
            this.offers = [];
            Object.defineProperty(this, 'pricing', { enumerable: false, get: () => this.offers[0]?.pricingPhases[0] });
            Object.defineProperty(this, 'canPurchase', { enumerable: false, get: () => decorator.canPurchase(this) });
            Object.defineProperty(this, 'owned', { enumerable: false, get: () => decorator.owned(this) });
        }

        /**
         * Find and return an offer for this product from its id
         *
         * If id isn't specified, returns the first offer.
         *
         * @param id - Identifier of the offer to return
         * @return An Offer or undefined if no match is found
         */
        getOffer(id: string = ''): Offer | undefined {
            if (!id) return this.offers[0];
            return this.offers.find(o => o.id === id);
        }

        /**
         * Add an offer to this product.
         *
         * @internal
         */
        addOffer(offer: Offer) {
            if (this.getOffer(offer.id)) return this;
            this.offers.push(offer);
            return this;
        }
    }

}
