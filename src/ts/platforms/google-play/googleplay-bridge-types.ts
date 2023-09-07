namespace CdvPurchase {
    export namespace GooglePlay {

        export namespace Bridge {

            /* export namespace V11 {
                export interface Subscription {
                    product_format: "v11.0";
                    productId: string;
                    title: string;
                    name: string;
                    billing_period: string;
                    billing_period_unit: string;
                    description: string;
                    price: string;
                    price_amount_micros: string;
                    price_currency_code: string;
                    trial_period: string;
                    trial_period_unit: string;
                    formatted_price: string;
                    freeTrialPeriod: string;
                    introductoryPrice: string;
                    introductoryPriceAmountMicros: string;
                    introductoryPriceCycles: string;
                    introductoryPricePeriod: string;
                    subscriptionPeriod: string;
                }
            } */

            export interface Subscription {
                product_format: "v12.0";
                product_type: "subs";
                productId: string;
                name: string;
                title: string;
                description: string;
                offers: SubscriptionOffer[]
            }

            export interface SubscriptionOffer {
                /** Base plan id associated with the subscription product (since billing library v6). */
                base_plan_id: string | null;
                /** Offer id associated with the subscription product (since billing library v6). */
                offer_id: string | null;
                /** Token required to pass in launchBillingFlow to purchase the subscription product with these pricing phases. */
                token: string;
                /** Tags associated with this Subscription Offer. */
                tags: string[];
                /** Pricing phases for the subscription product. */
                pricing_phases: PricingPhase[];
            }

            export enum RecurrenceMode {
                FINITE_RECURRING = "FINITE_RECURRING",
                INFINITE_RECURRING = "INFINITE_RECURRING",
                NON_RECURRING = "NON_RECURRING",
            }

            export interface PricingPhase {
                recurrence_mode: RecurrenceMode;
                billing_period: string;
                billing_cycle_count: number;
                formatted_price: string;
                price_amount_micros: number;
                price_currency_code: string;
            }

            export interface InAppProduct {
                product_format: "v12.0" | "v11.0";
                product_type: "inapp";
                productId: string;
                name?: string;
                title?: string;
                description?: string;
                price_currency_code?: string;
                formatted_price?: string;
                price?: string;
                price_amount_micros?: number;
            }
        }
    }
}
