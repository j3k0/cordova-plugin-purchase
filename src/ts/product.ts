namespace CdvPurchase {

    /** Product definition from a store */
    export class Product {

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
         * Shortcut to offers[0].pricingPhases[0]
         *
         * Useful when you know products have a single offer and a single pricing phase.
         */
        get pricing(): PricingPhase | undefined { return this.offers[0]?.pricingPhases[0]; }

        constructor(p: IRegisterProduct) {
            this.platform = p.platform;
            this.type = p.type;
            this.id = p.id;
            this.offers = [];
            Object.defineProperty(this, 'pricing', { enumerable: false });
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
