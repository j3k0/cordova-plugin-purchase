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
                token: string;
                tags: string[];
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
