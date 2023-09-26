/// <reference path="../../offer.ts" />
namespace CdvPurchase {

    export namespace GooglePlay {

        export class GProduct extends CdvPurchase.Product {
        }

        export class InAppOffer extends CdvPurchase.Offer {
            type = 'inapp';
        }

        export class SubscriptionOffer extends CdvPurchase.Offer {
            type = 'subs';
            tags: string[];
            token: string;
            constructor(options: { id: string, product: GProduct, pricingPhases: PricingPhase[], tags: string[], token: string }, decorator: Internal.OfferDecorator) {
                super(options, decorator);
                this.tags = options.tags;
                this.token = options.token;
            }
        }

        export type GOffer = InAppOffer | SubscriptionOffer;

        export class Products {

            /** Decorate products API  */
            private decorator: Internal.ProductDecorator & Internal.OfferDecorator;

            constructor(decorator: Internal.ProductDecorator & Internal.OfferDecorator) {
                this.decorator = decorator;
            }

            /** List of products managed by the GooglePlay adapter */
            products: GProduct[] = [];
            getProduct(id: string): GProduct | undefined {
                return this.products.find(p => p.id === id);
            }

            /** List of offers managed by the GooglePlay adapter */
            offers: GOffer[] = [];
            getOffer(id: string): GOffer | undefined {
                return this.offers.find(p => p.id === id);
            }

            /**  */
            addProduct(registeredProduct: IRegisterProduct, vp: Bridge.InAppProduct /* | SubscriptionV11 */ | Bridge.Subscription): GProduct {
                const existingProduct = this.getProduct(registeredProduct.id);
                const p = existingProduct ?? new GProduct(registeredProduct, this.decorator);
                p.title = vp.title || vp.name || p.title;
                if (Adapter.trimProductTitles)
                    p.title = p.title.replace(/ \(.*\)$/, '');
                p.description = vp.description || p.description;
                // Process the product depending on the format
                if ('product_format' in vp && vp.product_format === "v12.0") {
                    if (vp.product_type === "subs")
                        this.onSubsV12Loaded(p, vp);
                    else
                        this.onInAppLoaded(p, vp);
                }
                // else if ('billing_period_unit' in vp) {
                //     return this.iabSubsV11Loaded(p, vp);
                // }
                else {
                    this.onInAppLoaded(p, vp);
                }
                if (!existingProduct) {
                    this.products.push(p);
                }
                return p;
            }

            private onSubsV12Loaded(product: GProduct, vp: Bridge.Subscription): GProduct {
                // console.log('iabSubsV12Loaded: ' + JSON.stringify(vp));
                vp.offers.forEach((productOffer) => {

                    // Add the base plan's pricing phase to offers that do not end-up as infinite recurring.
                    const lastPhase = productOffer.pricing_phases.slice(-1)[0];
                    if (lastPhase?.recurrence_mode === RecurrenceMode.FINITE_RECURRING) {
                        const baseOffer = findBasePlan(productOffer.base_plan_id);
                        if (baseOffer && (baseOffer !== productOffer)) {
                            productOffer.pricing_phases.push(...baseOffer.pricing_phases);
                        }
                    }

                    // Convert the offer to the generic representation
                    const offer = this.iabSubsOfferV12Loaded(product, vp, productOffer);
                    product.addOffer(offer);
                });


                function findBasePlan(basePlanId: string | null): Bridge.SubscriptionOffer | null {
                    if (!basePlanId) return null;
                    for (const offer of vp.offers) {
                        if (offer.base_plan_id === basePlanId && !offer.offer_id) {
                            return offer;
                        }
                    }
                    return null;
                }
                /*
                var firstOffer = vp.offers[0];
                if (firstOffer && firstOffer.pricing_phases.length > 0) {
                    const attributes = {
                        state: store.VALID,
                        title: vp.name,
                        description: vp.description,
                        offers: vp.offers.map(function (offer) {
                            return vp.productId + '@' + offer.token;
                        }),
                    };
                    this.iabSubsAddV12Attributes(attributes, firstOffer);
                    const p = this.getProduct(vp.productId);
                    p.set(attributes);
                    p.trigger("loaded");
                }
                */
                return product;
            }

            private makeOfferId(productId: string, productOffer: Bridge.SubscriptionOffer): string {
                let id = productId;
                if (productOffer.base_plan_id) {
                    if (productOffer.offer_id) {
                        return productId + '@' + productOffer.base_plan_id + '@' + productOffer.offer_id;
                    }
                    return productId + '@' + productOffer.base_plan_id;
                }
                return productId + '@' + productOffer.token;
            }

            private iabSubsOfferV12Loaded(product: GProduct, vp: Bridge.Subscription, productOffer: Bridge.SubscriptionOffer): GOffer {

                const offerId = this.makeOfferId(vp.productId, productOffer);
                const existingOffer = this.getOffer(offerId);
                const pricingPhases: PricingPhase[] = productOffer.pricing_phases.map(p => this.toPricingPhase(p));
                if (existingOffer) {
                    existingOffer.pricingPhases = pricingPhases;
                    return existingOffer;
                }
                else {
                    const offer = new SubscriptionOffer({ id: offerId, product, pricingPhases, token: productOffer.token, tags: productOffer.tags }, this.decorator);
                    this.offers.push(offer);
                    return offer;
                }
                /*
                // Backward compatibility (might be incomplete if user have complex pricing models, but might as well be complete...)
                if (productOffer.pricing_phases.length > 0) {
                    iabSubsAddV12Attributes(offerAttributes, productOffer);
                }
                var offerP = store.get(offerAttributes.id);
                if (!offerP) {
                    store.register(offerAttributes);
                    offerP = store.get(offerAttributes.id);
                }
                offerP.set(offerAttributes);
                offerP.trigger("loaded");
                */
            }

            /*
            private iabSubsV11Loaded(p: Product, vp: SubscriptionV11): Product {
                // console.log('iabSubsV11Loaded: ' + JSON.stringify(vp));
                var p = store.products.byId[vp.productId];
                var attributes = {
                    state: store.VALID,
                    title: vp.name || trimTitle(vp.title),
                    description: vp.description,
                };
                var currency = vp.price_currency_code || "";
                var price = vp.formatted_price || vp.price;
                var priceMicros = vp.price_amount_micros;
                var subscriptionPeriod = vp.subscriptionPeriod ? vp.subscriptionPeriod : "";
                var introPriceSubscriptionPeriod = vp.introductoryPricePeriod ? vp.introductoryPricePeriod : "";
                var introPriceNumberOfPeriods = vp.introductoryPriceCycles ? vp.introductoryPriceCycles : 0;
                var introPricePeriodUnit = normalizeISOPeriodUnit(introPriceSubscriptionPeriod);
                var introPricePeriodCount = normalizeISOPeriodCount(introPriceSubscriptionPeriod);
                var introPricePeriod = (introPriceNumberOfPeriods || 1) * (introPricePeriodCount || 1);
                var introPriceMicros = vp.introductoryPriceAmountMicros ? vp.introductoryPriceAmountMicros : "";
                var introPrice = vp.introductoryPrice ? vp.introductoryPrice : "";
                var introPricePaymentMode;

                if (vp.freeTrialPeriod) {
                    introPricePaymentMode = 'FreeTrial';
                    try {
                        introPricePeriodUnit = normalizeISOPeriodUnit(vp.freeTrialPeriod);
                        introPricePeriodCount = normalizeISOPeriodCount(vp.freeTrialPeriod);
                        introPricePeriod = introPricePeriodCount;
                    }
                    catch (e) {
                        store.log.warn('Failed to parse free trial period: ' + vp.freeTrialPeriod);
                    }
                }
                else if (vp.introductoryPrice) {
                    if (vp.introductoryPrice < vp.price && subscriptionPeriod === introPriceSubscriptionPeriod) {
                        introPricePaymentMode = 'PayAsYouGo';
                    }
                    else if (introPriceNumberOfPeriods === 1) {
                        introPricePaymentMode = 'UpFront';
                    }
                }

                if (!introPricePaymentMode) {
                    introPricePeriod = null;
                    introPricePeriodUnit = null;
                }

                var parsedSubscriptionPeriod = {};
                if (subscriptionPeriod) {
                    parsedSubscriptionPeriod.unit = normalizeISOPeriodUnit(subscriptionPeriod);
                    parsedSubscriptionPeriod.count = normalizeISOPeriodCount(subscriptionPeriod);
                }

                var trialPeriod = vp.trial_period || null;
                var trialPeriodUnit = vp.trial_period_unit || null;
                var billingPeriod = parsedSubscriptionPeriod.count || vp.billing_period || null;
                var billingPeriodUnit = parsedSubscriptionPeriod.unit || vp.billing_period_unit || null;

                var pricingPhases = [];
                if (trialPeriod) {
                    pricingPhases.push({
                        paymentMode: 'FreeTrial',
                        recurrenceMode: store.FINITE_RECURRING,
                        period: vp.freeTrialPeriod || toISO8601Duration(trialPeriodUnit, trialPeriod),
                        cycles: 1,
                        price: null,
                        priceMicros: 0,
                        currency: currency,
                    });
                }
                else if (introPricePeriod) {
                    pricingPhases.push({
                        paymentMode: 'PayAsYouGo',
                        recurrenceMode: store.FINITE_RECURRING,
                        period: vp.introPriceSubscriptionPeriod || toISO8601Duration(introPricePeriodUnit, introPricePeriodCount),
                        cycles: vp.introductoryPriceCycles || 1,
                        price: null, // formatted price not available
                        priceMicros: introPriceMicros,
                        currency: currency,
                    });
                }

                pricingPhases.push({
                    paymentMode: 'PayAsYouGo',
                    recurrenceMode: store.INFINITE_RECURRING,
                    period: vp.subscriptionPeriod || toISO8601Duration(billingPeriodUnit, billingPeriod), // ISO8601 duration
                    cycles: 0,
                    price: price,
                    priceMicros: priceMicros,
                    currency: currency,
                });
                attributes.pricingPhases = pricingPhases;

                if (store.compatibility > 0 && store.compatibility < 11.999) {
                    Object.assign(attributes, {
                        price: price,
                        priceMicros: priceMicros,
                        currency: currency,
                        trialPeriod: trialPeriod,
                        trialPeriodUnit: trialPeriodUnit,
                        billingPeriod: billingPeriod,
                        billingPeriodUnit: billingPeriodUnit,
                        introPrice: introPrice,
                        introPriceMicros: introPriceMicros,
                        introPricePeriod: introPricePeriod,
                        introPricePeriodUnit: introPricePeriodUnit,
                        introPricePaymentMode: introPricePaymentMode,
                    });
                }

                if (store.compatibility > 0 && store.compatibility < 9.999) {
                    Object.assign(attributes, {
                        introPriceNumberOfPeriods: introPricePeriod,
                        introPriceSubscriptionPeriod: introPricePeriodUnit,
                    });
                }

                p.set(attributes);
                p.trigger("loaded");
            }
            */

            private onInAppLoaded(p: GProduct, vp: Bridge.InAppProduct): GProduct {
                // console.log('iabInAppLoaded: ' + JSON.stringify(vp));
                const existingOffer = this.getOffer(vp.productId);
                const pricingPhases = [{
                    price: vp.formatted_price ?? vp.price ?? `${(vp.price_amount_micros ?? 0) / 1000000} ${vp.price_currency_code}`,
                    priceMicros: vp.price_amount_micros ?? 0,
                    currency: vp.price_currency_code,
                    recurrenceMode: RecurrenceMode.NON_RECURRING,
                }];
                if (existingOffer) {
                    // state: store.VALID,
                    // title: vp.name || trimTitle(vp.title),
                    // description: vp.description,
                    // currency: vp.price_currency_code || "",
                    // price: vp.formatted_price || vp.price,
                    // priceMicros: vp.price_amount_micros,
                    existingOffer.pricingPhases = pricingPhases;
                    p.offers = [existingOffer];
                }
                else {
                    const newOffer = new InAppOffer({ id: vp.productId, product: p, pricingPhases }, this.decorator);
                    this.offers.push(newOffer);
                    p.offers = [newOffer];
                }
                // p.set({
                //     state: store.VALID,
                //     title: vp.name || trimTitle(vp.title),
                //     description: vp.description,
                //     currency: vp.price_currency_code || "",
                //     price: vp.formatted_price || vp.price,
                //     priceMicros: vp.price_amount_micros,
                // });
                // p.trigger("loaded");
                return p;
            }

            private toPaymentMode(phase: Bridge.PricingPhase): PaymentMode {
                return phase.price_amount_micros === 0
                    ? PaymentMode.FREE_TRIAL
                    : phase.recurrence_mode === Bridge.RecurrenceMode.NON_RECURRING
                        ? PaymentMode.UP_FRONT
                        : PaymentMode.PAY_AS_YOU_GO;
            }

            private toRecurrenceMode(mode: Bridge.RecurrenceMode): RecurrenceMode {
                switch (mode) {
                    case Bridge.RecurrenceMode.FINITE_RECURRING: return RecurrenceMode.FINITE_RECURRING;
                    case Bridge.RecurrenceMode.INFINITE_RECURRING: return RecurrenceMode.INFINITE_RECURRING;
                    case Bridge.RecurrenceMode.NON_RECURRING: return RecurrenceMode.NON_RECURRING;
                }
            }

            private toPricingPhase(phase: Bridge.PricingPhase): PricingPhase {
                return {
                    price: phase.formatted_price,
                    priceMicros: phase.price_amount_micros,
                    currency: phase.price_currency_code,
                    billingPeriod: phase.billing_period,
                    billingCycles: phase.billing_cycle_count,
                    recurrenceMode: this.toRecurrenceMode(phase.recurrence_mode),
                    paymentMode: this.toPaymentMode(phase),
                };
            }
        }
    }
}
