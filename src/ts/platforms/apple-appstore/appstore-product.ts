namespace CdvPurchase {

  /**
   * Apple AppStore adapter using StoreKit version 1
   */
  export namespace AppleAppStore {

    export const DEFAULT_OFFER_ID = '$';

    export type SKOfferType = DiscountType | 'Default';

    export class SKOffer extends Offer {
      offerType: SKOfferType;

      constructor(options: { id: string, product: Product, pricingPhases: PricingPhase[], offerType: SKOfferType }, decorator: CdvPurchase.Internal.OfferDecorator) {
        super(options, decorator);
        this.offerType = options.offerType;
      }
    }

    export class SKProduct extends Product {

      /** Raw data returned by native side */
      raw: Bridge.ValidProduct;

      /** AppStore country this product has been fetched for */
      countryCode?: string;

      constructor(validProduct: Bridge.ValidProduct, p: IRegisterProduct, decorator: CdvPurchase.Internal.ProductDecorator & CdvPurchase.Internal.OfferDecorator, eligibilities: Internal.IDiscountEligibilities) {
        super(p, decorator);
        this.raw = validProduct;
        this.refresh(validProduct, decorator, eligibilities);
      }

      removeIneligibleDiscounts(eligibilities: Internal.IDiscountEligibilities) {
        this.offers = this.offers.filter(offer => {
          const skOffer = offer as SKOffer;
          if (skOffer.offerType === 'Default') return true;
          return eligibilities.isEligible(this.id, skOffer.offerType, offer.id);
        });
      }

      refresh(valid: Bridge.ValidProduct, decorator: CdvPurchase.Internal.ProductDecorator & CdvPurchase.Internal.OfferDecorator, eligibilities: Internal.IDiscountEligibilities) {
        this.raw = valid;
        this.title = valid.title;
        this.description = valid.description;
        this.countryCode = valid.countryCode;
        if (valid.group) this.group = valid.group;

        this.removeIneligibleDiscounts(eligibilities);

        // default offer
        const finalPhase: PricingPhase = {
          price: valid.price,
          priceMicros: valid.priceMicros,
          currency: valid.currency,
          billingPeriod: formatBillingPeriod(valid.billingPeriod, valid.billingPeriodUnit),
          paymentMode: this.type === ProductType.PAID_SUBSCRIPTION ? PaymentMode.PAY_AS_YOU_GO : PaymentMode.UP_FRONT,
          recurrenceMode: this.type === ProductType.PAID_SUBSCRIPTION ? RecurrenceMode.INFINITE_RECURRING : RecurrenceMode.NON_RECURRING,
        }

        // discounts
        valid.discounts?.forEach(discount => {
          if (eligibilities.isEligible(valid.id, discount.type, discount.id)) {
            const pricingPhases: PricingPhase[] = [];
            const numCycles = discount.paymentMode === PaymentMode.PAY_AS_YOU_GO ? discount.period : 1;
            const numPeriods = discount.paymentMode === PaymentMode.PAY_AS_YOU_GO ? 1 : discount.period;
            const discountPhase: PricingPhase = {
              price: discount.price,
              priceMicros: discount.priceMicros,
              currency: valid.currency,
              billingPeriod: formatBillingPeriod(numPeriods, discount.periodUnit),
              billingCycles: numCycles,
              paymentMode: discount.paymentMode,
              recurrenceMode: RecurrenceMode.FINITE_RECURRING,
            }
            pricingPhases.push(discountPhase);
            pricingPhases.push(finalPhase);
            this.addOffer(new SKOffer({ id: discount.id, product: this, pricingPhases, offerType: discount.type }, decorator));
          }
        });

        if (!hasIntroductoryOffer(this)) {

          const defaultPhases: PricingPhase[] = [];

          // According to specs, intro price should be in the discounts array, but it turns out
          // it's not always the case (when there are no discount offers maybe?)...
          if (valid.introPrice && valid.introPriceMicros !== undefined && eligibilities.isEligible(valid.id, 'Introductory', 'intro')) {
              const introPrice: PricingPhase = {
                  price: valid.introPrice,
                  priceMicros: valid.introPriceMicros,
                  currency: valid.currency,
                  billingPeriod: formatBillingPeriod(valid.introPricePeriod, valid.introPricePeriodUnit),
                  paymentMode: valid.introPricePaymentMode,
                  recurrenceMode: RecurrenceMode.FINITE_RECURRING,
                  billingCycles: 1,
              }
              defaultPhases.push(introPrice);
          }

          defaultPhases.push(finalPhase);

          this.addOffer(new SKOffer({
            id: DEFAULT_OFFER_ID,
            product: this,
            pricingPhases: defaultPhases,
            offerType: 'Default',
          }, decorator));
        }

        function hasIntroductoryOffer(product: SKProduct) {
          return product.offers.filter(offer => {
            const skOffer = offer as SKOffer;
            return (skOffer.offerType === 'Introductory') || (skOffer.offerType === 'Default' && skOffer.pricingPhases.length > 1);
            // return (offer as SKOffer).offerType === 'Introductory';
          }).length > 0;
        }

        /**
         * Return ISO form of an IPeriodUnit + number of periods
         */
        function formatBillingPeriod(numPeriods?: number, period?: IPeriodUnit): string | undefined {
          if (numPeriods && period)
            return `P${numPeriods}${period[0]}`;
          else
            return undefined;
        }
      }
    }
  }
}
