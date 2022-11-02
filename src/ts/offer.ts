/// <reference path="utils/non-enumerable.ts" />
/// <reference path="product.ts" />
/// <reference path="types.ts" />

namespace CdvPurchase
{
    export class Offer {

        private className: 'Offer' = 'Offer';

        /** Offer identifier */
        id: string;

        get productId(): string { return ''; }
        get productType(): ProductType { return ProductType.APPLICATION; }
        get platform() { return Platform.TEST; }

        // tags: string[];

        /** Pricing phases */
        pricingPhases: PricingPhase[];

        constructor(options: { id: string, product: Product, pricingPhases: PricingPhase[] }) {
            this.id = options.id;
            this.pricingPhases = options.pricingPhases;
            // Object.defineProperty(this, 'product', { enumerable: false, get: () => options.product });
            Object.defineProperty(this, 'productId', { enumerable: true, get: () => options.product.id });
            Object.defineProperty(this, 'productType', { enumerable: true, get: () => options.product.type });
            Object.defineProperty(this, 'platform', { enumerable: true, get: () => options.product.platform });
        }
    }
}
