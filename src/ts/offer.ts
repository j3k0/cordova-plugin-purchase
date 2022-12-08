/// <reference path="utils/non-enumerable.ts" />
/// <reference path="product.ts" />
/// <reference path="types.ts" />

namespace CdvPurchase
{
    /** @internal */
    export namespace Internal {
        export interface OfferDecorator {

            /**
             * Initiate a purchase for the provided offer.
             */
            order(offer: Offer, additionalData?: AdditionalData): Promise<IError | undefined>;

            /**
             * Returns true if the offer can be purchased.
             */
            canPurchase(offer: Offer): boolean;
        }
    }

    /**
     * One of the available offers to purchase a given product
     */
    export class Offer {

        /** className, used to make sure we're passing an actual instance of the "Offer" class. */
        private className: 'Offer' = 'Offer';

        /** Offer identifier */
        id: string;

        /** Identifier of the product related to this offer */
        get productId(): string { return ''; }

        /** Type of the product related to this offer */
        get productType(): ProductType { return ProductType.APPLICATION; }

        /** Group the product related to this offer is member of */
        get productGroup(): string | undefined { return undefined; }

        /** Platform this offer is available from */
        get platform() { return Platform.TEST; }

        // tags: string[];

        /** Pricing phases */
        pricingPhases: PricingPhase[];

        /**
         * Initiate a purchase of this offer.
         *
         * @example
         * store.get("my-product").getOffer().order();
         */
        async order(additionalData?: AdditionalData): Promise<IError | undefined> {
            // Pseudo implementation to make typescript happy.
            // see Object.defineProperty in the constructor for the actual implementation.
            return;
        }

        /**
         * true if the offer can be purchased.
         */
        get canPurchase(): boolean {
            // Pseudo implementation to make typescript happy.
            // see Object.defineProperty in the constructor for the actual implementation.
            return false;
        }

        /** @internal */
        constructor(options: { id: string, product: Product, pricingPhases: PricingPhase[] }, decorator: Internal.OfferDecorator) {
            this.id = options.id;
            this.pricingPhases = options.pricingPhases;
            // Object.defineProperty(this, 'product', { enumerable: false, get: () => options.product });
            Object.defineProperty(this, 'productId', { enumerable: true, get: () => options.product.id });
            Object.defineProperty(this, 'productType', { enumerable: true, get: () => options.product.type });
            Object.defineProperty(this, 'productGroup', { enumerable: true, get: () => options.product.group });
            Object.defineProperty(this, 'platform', { enumerable: true, get: () => options.product.platform });
            Object.defineProperty(this, 'order', { enumerable: false, get: () => (additionalData?: AdditionalData) => decorator.order(this, additionalData) });
            Object.defineProperty(this, 'canPurchase', { enumerable: false, get: () => decorator.canPurchase(this) });
        }
    }
}
