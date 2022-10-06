/// <reference path="utils/non-enumerable.ts" />
namespace CdvPurchase
{
    export class Offer {

        /** Offer identifier */
        id: string;

        /** Parent product */
        @Utils.nonEnumerable
        product: Product;

        // tags: string[];

        /** Pricing phases */
        pricingPhases: PricingPhase[];

        constructor(options: { id: string, product: Product, pricingPhases: PricingPhase[] }) {
            this.id = options.id;
            this.product = options.product;
            this.pricingPhases = options.pricingPhases;
            Object.defineProperty(this, 'productId', { enumerable: true, get: () => this.product.id });
            Object.defineProperty(this, 'platform', { enumerable: true, get: () => this.product.platform });
        }

    }
}
