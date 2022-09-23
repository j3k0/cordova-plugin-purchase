    namespace CDVPurchase2
    {
        export type Callback<T> = (t: T) => void;

        /** An error triggered by the In-App Purchase plugin */
        export interface IError {

            /** See store.ERR_* for the available codes.
             *
             * https://github.com/j3k0/cordova-plugin-purchase/blob/master/doc/api.md#error-codes */
            code: ErrorCode;

            /** Human readable message, in plain english */
            message: string;
        }

        export type IErrorCallback = (err?: IError) => void;

        /** Types of In-App-Products */
        export enum ProductType {
            /** Type: An consumable product, that can be purchased multiple time */
            CONSUMABLE = 'consumable',
            /** Type: A non-consumable product, that can purchased only once and the user keeps forever */
            NON_CONSUMABLE = 'non consumable',
            /** @deprecated use PAID_SUBSCRIPTION */
            FREE_SUBSCRIPTION = 'free subscription',
            /** Type: An auto-renewable subscription */
            PAID_SUBSCRIPTION = 'paid subscription',
            /** Type: An non-renewing subscription */
            NON_RENEWING_SUBSCRIPTION = 'non renewing subscription',
            /** Type: The application bundle */
            APPLICATION = 'application',
        }

        export class Product {

            platform: Platform;
            type: ProductType;
            id: string;
            valid?: boolean;
            offers: Offer[];

            /**
             * Product title from the store.
             */
            title: string = '';

            /**
             * Product full description from the store.
             */
            description: string = '';

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
             * Find and return an offer for this product from its id
             *
             * If id isn't specified, returns the first offer.
             *
             * @param id - Identifier of the offer to return
             */
            addOffer(offer: Offer) {
                if (this.getOffer(offer.id)) return;
                this.offers.push(offer);
            }
        }


        export type IPeriodUnit = "Minute" | "Hour" | "Day" | "Week" | "Month" | "Year";

        /**
         * Type of recurring payment
         *
         * - FINITE_RECURRING: Payment recurs for a fixed number of billing period set in `paymentPhase.cycles`.
         * - INFINITE_RECURRING: Payment recurs for infinite billing periods unless cancelled.
         * - NON_RECURRING: A one time charge that does not repeat.
         */
        export enum RecurrenceMode {
            NON_RECURRING = "NON_RECURRING",
            FINITE_RECURRING = "FINITE_RECURRING",
            INFINITE_RECURRING = "INFINITE_RECURRING"
        }

        /**
         * Description of a phase for the pricing of a purchase.
         *
         * @see Product.pricingPhases
         */
        export interface PricingPhase {
            /** Price formatted for humans */
            price: string;
            /** Price in micro-units (divide by 1000000 to get numeric price) */
            priceMicros: number;
            /** Currency code */
            currency?: string;
            /** ISO 8601 duration of the period (https://en.wikipedia.org/wiki/ISO_8601#Durations) */
            billingPeriod?: string;
            /** Number of recurrence cycles (if recurrenceMode is FINITE_RECURRING) */
            billingCycles?: number;
            /** Type of recurring payment */
            recurrenceMode?: RecurrenceMode;
            /** Payment mode for the pricing phase ("PayAsYouGo", "UpFront", or "FreeTrial") */
            paymentMode?: PaymentMode;
        }

        export enum PaymentMode {
            PAY_AS_YOU_GO = "PayAsYouGo",
            UP_FRONT = "UpFront",
            FREE_TRIAL = "FreeTrial"
        }

        export interface AdapterListener {
            productsUpdated(platform: Platform, products: Product[]): void;
        }

        export interface Adapter {

            /**
             * Platform identifier
             */
            id: Platform;

            /**
             * List of products managed by the adapter.
             */
            get products(): Product[];

            /**
             * List of purchase receipts.
             */
            get receipts(): Receipt[];

            /**
             * Initializes a platform adapter.
             *
             * Will resolve when initialization is complete.
             *
             * Will fail with an `IError` in case of an unrecoverable error.
             *
             * In other case of a potentially recoverable error, the adapter will keep retrying to initialize forever.
             */
            initialize(): Promise<undefined | IError>;

            /**
             * Load product definitions from the platform.
             */
            load(products: IRegisterProduct[]): Promise<(Product | IError)[]>;

            /**
             * Initializes an order.
             */
            order(offer: Offer, additionalData: AdditionalData): Promise<Transaction | IError>;
        }

        export interface AdditionalData {

            /** The application's user identifier, will be obfuscated with md5 to fill `accountId` if necessary */
            applicationUsername?: string;

            /** GooglePlay specific additional data */
            googlePlay?: GooglePlay.AdditionalData;
        }

        export enum Platform {

            /** Apple AppStore */
            APPLE_APPSTORE = 'ios-appstore',

            /** Google Play */
            GOOGLE_PLAY = 'android-playstore',

            /** Windows Store */
            WINDOWS_STORE = 'windows-store-transaction',

            /** Braintree */
            BRAINTREE = 'braintree',

            // /** Stripe */
            // STRIPE = 'stripe',

            /** Test platform */
            TEST = 'dummy-store',
        }

    /** Possible states of a product */
    export enum TransactionState {
        REQUESTED = 'requested',
        INITIATED = 'initiated',
        APPROVED = 'approved',
        CANCELLED = 'cancelled',
        FINISHED = 'finished',
        OWNED = 'owned',
        EXPIRED = 'expired',
    }

    export type PrivacyPolicyItem = 'fraud' | 'support' | 'analytics' | 'tracking';

    export interface When {
        updated(cb: Callback<Product>): When;
        owned(cb: Callback<Product>): When;
        approved(cb: Callback<Transaction>): When;
        finished(cb: Callback<Transaction>): When;
        verified(cb: Callback<Receipt>): When;
    }
}
