declare namespace ModuleIapticJS {
    /**
     * Type of product that can be purchased
     */
    export type ProductType = 'subscription' | 'consumable' | 'non_consumable' | 'paid subscription';

    /**
     * Represents a pricing phase for an offer
     */
    export interface PricingPhase {
        /** Price in micros (1/1,000,000 of the currency unit). For example, $1.99 = 1990000 micros */
        priceMicros: number;
        /** ISO 4217 currency code (e.g., 'USD', 'EUR', 'JPY') */
        currency: string;
        /**
         * ISO 8601 duration string representing the billing period
         * Examples: 'P1M' = 1 month, 'P1Y' = 1 year, 'P7D' = 7 days
         */
        billingPeriod: string;
        /**
         * Defines how the subscription recurs
         */
        recurrenceMode: 'INFINITE_RECURRING' | 'NON_RECURRING' | 'FINITE_RECURRING';
        /**
         * Defines when payment is collected
         */
        paymentMode: 'PayAsYouGo' | 'PayUpFront';
    }

    /**
     * Represents a purchase offer for a product
     */
    export interface Offer {
        /** Unique identifier for the offer in the format 'platform:id' */
        id: string;
        /** Payment platform identifier (e.g., 'stripe', 'google', 'apple') */
        platform: string;
        /** Type of the offer */
        offerType: 'Subscription' | 'Default';
        /** Array of pricing phases that make up this offer's payment schedule */
        pricingPhases: PricingPhase[];
    }

    /**
     * Represents a product that can be purchased
     */
    export interface Product {
        /** Type of the product (subscription, consumable, etc.) */
        type: ProductType;
        /** Unique identifier for the product */
        id: string;
        /** Display name of the product shown to customers */
        title: string;
        /** Optional detailed description of the product */
        description?: string;
        /** Available purchase offers for this product */
        offers: Offer[];
        /**
         * Optional additional data associated with the product
         */
        metadata?: Record<string, any>;
        /** Optional platform identifier (e.g., 'stripe') */
        platform?: string;
    }

    /**
     * Represents a purchased product
     */
    export interface Purchase {
        /** Unique identifier for the purchase */
        purchaseId: string;
        /** Unique identifier for the transaction */
        transactionId: string;
        /** Unique identifier for the product */
        productId: string;
        /** Platform identifier (e.g., 'stripe') */
        platform: 'stripe';
        /** Date of the purchase */
        purchaseDate: string;
        /** Date of the last renewal */
        lastRenewalDate: string;
        /** Date of the expiration */
        expirationDate: string;
        /** Intent of the renewal */
        renewalIntent: 'Renew' | 'Cancel';
        /** Whether the purchase is a trial period */
        isTrialPeriod: boolean;
        /** Price in micros (1/1,000,000 of the currency unit) */
        amountMicros: number;
        /** Currency code (e.g., 'USD', 'EUR') */
        currency: string;
    }

    /**
     * Represents an order for a product
     */
    export interface Order {
        /** Unique identifier for the offer */
        offerId: string;
        /** Username in the application */
        applicationUsername: string;
        /** URL to redirect to on success */
        successUrl: string;
        /** URL to redirect to on cancel */
        cancelUrl: string;
        /** Optional access token for the user */
        accessToken?: string;
    }

    /** Plan change request */
    export interface PlanChange {
        /** Unique identifier for the purchase to replace (optional) */
        purchaseId: string;
        /** New offer to subscribe to */
        offerId: string;
        /** Optional access token for the user */
        accessToken?: string;
    }

    /**
     * Configuration options for creating an Iaptic adapter
     */
    export interface Config {
        /** Adapter type (currently only 'stripe' is supported) */
        type: 'stripe';
        /** Stripe publishable key */
        stripePublicKey: string;
        /** Your application name as configured on iaptic.com */
        appName: string;
        /** Your Iaptic public API key */
        apiKey: string;
        /** Optional custom Iaptic URL for private deployments */
        customIapticUrl?: string;
    }

    /**
     * Response from Iaptic's /stripe/products API
     */
    export interface GetProductsResponse {
        /** Whether the request was successful */
        ok: boolean;
        /** Array of available products */
        products: Product[];
    }

    /**
     * Response from Iaptic's /stripe/checkout API
     */
    export interface PostCheckoutSessionResponse {
        /** Whether the request was successful */
        ok: boolean;
        /** Stripe Checkout URL where the customer will be redirected */
        url: string;
        /** Access token for the customer */
        accessToken: string;
    }

    /**
     * Response from Iaptic's /stripe/purchases API
     */
    export interface GetPurchasesResponse {
        /** Whether the request was successful */
        ok: boolean;
        /** Array of customer's purchases */
        purchases: Purchase[];
        /** Optional new access token */
        newAccessToken?: string;
    }

    /**
     * Response from Iaptic's /stripe/change-plan API
     */
    export interface ChangePlanResponse {
        /** Whether the request was successful */
        ok: boolean;
        /** Updated purchase details */
        purchase: Purchase;
        /** Optional new access token */
        newAccessToken?: string;
    }

    /**
     * Represents a scheduled refresh for a subscription
     */
    export interface ScheduledRefresh {
        /** Unique identifier for the scheduled refresh */
        id: string;
        /** Unique identifier for the subscription */
        subscriptionId: string;
        /** Date and time of the scheduled refresh */
        scheduledAt: number;
        /** Whether the refresh has been completed */
        completed: boolean;
        /** Whether the refresh is currently in progress */
        inProgress: boolean;
        /** Reason for the scheduled refresh */
        reason: string;
    }

    /**
     * RefreshScheduler class for managing subscription refreshes
     */
    export class RefreshScheduler {
        schedules: ScheduledRefresh[];
        constructor(iapticStripe: IapticStripe);
        scheduleRefresh(subscriptionId: string, date: Date, reason: string): void;
        schedulePurchaseRefreshes(purchase: Purchase): void;
        clearSchedules(): void;
    }

    /**
     * Main class for interacting with Iaptic's Stripe integration
     */
    export class IapticStripe {
        /**
         * Creates a new IapticStripe instance
         * @param config - Configuration options for the Stripe integration
         */
        constructor(config: Config);

        /**
         * Gets a list of available products and their pricing
         * @returns Promise resolving to an array of products
         */
        getProducts(): Promise<Product[]>;

        /**
         * Forces a refresh of the products list from the server
         * @returns Promise resolving to an array of products
         */
        refreshProducts(): Promise<Product[]>;

        /**
         * Gets the current access token if one exists
         * @returns The current access token or undefined if none exists
         */
        getAccessToken(): string | undefined;

        /**
         * Creates a new order and redirects to Stripe Checkout
         * @param params - Order parameters including product and URLs
         */
        order(params: Order): Promise<void>;

        /**
         * Gets the customer's purchase history
         * @param accessToken - Optional access token (uses stored token if not provided)
         * @returns Promise resolving to an array of purchases
         */
        getPurchases(accessToken?: string): Promise<Purchase[]>;

        /**
         * Redirects to Stripe Customer Portal for subscription management
         * @param params - Portal parameters including return URL
         */
        redirectToCustomerPortal(params: {
            returnUrl?: string;
            accessToken?: string;
        }): Promise<void>;

        /**
         * Changes a subscription plan
         * @param planChange - Plan change parameters
         * @returns Promise resolving to the updated purchase details
         */
        changePlan(planChange: PlanChange): Promise<Purchase>;

        /**
         * Clears all stored data including access tokens and cached products
         */
        clearStoredData(): void;
    }

    /**
     * Utility functions for the Iaptic library
     */
    export class Utils {
        /**
         * Format a currency amount from micros with proper localization
         * @param amountMicros - Amount in micros (1/1,000,000 of currency unit)
         * @param currency - ISO 4217 currency code (e.g., 'USD', 'EUR')
         * @returns Formatted currency string
         */
        static formatCurrency(amountMicros: number, currency: string): string;

        /**
         * Format an ISO 8601 period string into human-readable English
         * @param period - ISO 8601 duration string
         * @returns Human-readable period string
         */
        static formatBillingPeriodEN(period: string): string;

        /**
         * Base64 encode a string with fallbacks for different environments
         */
        static base64Encode(str: string): string;

        /**
         * Build a URL with query parameters
         */
        static buildUrl(baseUrl: string, params: Record<string, string>): string;
    }

    /**
     * Creates an Iaptic adapter for the specified payment platform
     * @param config - Configuration options for the adapter
     * @returns An initialized adapter instance
     */
    export function createAdapter(config: Config): IapticStripe;
}

/**
 * Global IapticJS object available in browser environments
 */
interface Window {
    IapticJS: {
        /** Current version of the IapticJS library */
        version: string;
        /** Function to create a new Iaptic adapter */
        createAdapter: typeof ModuleIapticJS.createAdapter;
        /** Stripe adapter class */
        IapticStripe: typeof ModuleIapticJS.IapticStripe;
        /** Utility functions */
        Utils: typeof ModuleIapticJS.Utils;
    };
}
