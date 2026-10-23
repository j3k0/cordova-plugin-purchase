declare namespace ModuleIapticJS {
    /**
     * Type of product that can be purchased:
     *
     * - subscription: A recurring subscription product
     * - consumable: A product that can be purchased multiple times
     * - non consumable: A product that can only be purchased once
     * - paid subscription: An auto-renewing subscription
     * - non renewing subscription: A subscription that does not auto-renew
     * - application: The application itself
     * - product: A generic product
     *
     * `'non_consumable'` is deprecated: the server never sends it. It is kept so existing
     * code compiles, and will be removed in the next major version. Use `'non consumable'`.
     */
    export type ProductType = 'subscription' | 'consumable' | 'non consumable' | 'paid subscription' | 'non renewing subscription' | 'application' | 'product' | 'non_consumable';
    /**
     * Represents a pricing phase for an offer
     * @remarks
     * A pricing phase defines how much and when a customer will be charged.
     * For example, a subscription might have an initial trial phase followed by a recurring payment phase.
     */
    export interface PricingPhase {
        /** Price in micros (1/1,000,000 of the currency unit). For example, $1.99 = 1990000 micros */
        priceMicros: number;
        /** ISO 4217 currency code (e.g., 'USD', 'EUR', 'JPY') */
        currency: string;
        /**
         * ISO 8601 duration string representing the billing period
         * @example
         * - 'P1M' = 1 month
         * - 'P1Y' = 1 year
         * - 'P7D' = 7 days
         *
         * Absent for one-time purchases.
         */
        billingPeriod: string;
        /**
         * Defines how the subscription recurs
         * @remarks
         * - INFINITE_RECURRING: Subscription continues until explicitly cancelled
         * - NON_RECURRING: One-time purchase that does not auto-renew
         * - FINITE_RECURRING: Subscription that renews a fixed number of times
         */
        recurrenceMode: 'INFINITE_RECURRING' | 'NON_RECURRING' | 'FINITE_RECURRING';
        /**
         * Defines when payment is collected
         * @remarks
         * - PayAsYouGo: Payment collected at the start of each billing period
         * - UpFront: Full payment collected at time of purchase
         * - FreeTrial: No payment during this phase
         *
         * `'PayUpFront'` is deprecated: the server never sends it. It is kept so existing
         * code compiles, and will be removed in the next major version. Use `'UpFront'`.
         */
        paymentMode: 'PayAsYouGo' | 'UpFront' | 'FreeTrial' | 'PayUpFront';
    }
    /**
     * Represents a purchase offer for a product
     * @remarks
     * An offer defines how a product can be purchased, including pricing and billing details
     */
    export interface Offer {
        /** Unique identifier for the offer in the format 'platform:id' */
        id: string;
        /** Payment platform identifier (e.g., 'stripe', 'google', 'apple') */
        platform: string;
        /** Type of the offer */
        offerType: 'Subscription' | 'Default' | 'Introductory';
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
         * @remarks
         * This can be used to store custom data needed by your application
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
        /** Date of the purchase (ISO 8601). Can be absent, check before use. */
        purchaseDate: string;
        /** Date of the last renewal (ISO 8601). Can be absent, check before use. */
        lastRenewalDate: string;
        /** Date of the expiration (ISO 8601). Absent for one-time purchases. */
        expirationDate: string;
        /**
         * Intent of the renewal: 'Lapse' to let the subscription expire, 'Renew' to keep it
         *
         * `'Cancel'` is deprecated: the server never sends it. It is kept so existing
         * code compiles, and will be removed in the next major version. Use `'Lapse'`.
         */
        renewalIntent: 'Lapse' | 'Renew' | 'Cancel';
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
        /** Unique identifier for the purchase to replace */
        purchaseId: string;
        /** New offer to subscribe to */
        offerId: string;
        /** Optional access token for the user */
        accessToken?: string;
    }
    /**
     * Configuration options for creating an Iaptic adapter
     * @remarks
     * Currently only supports Stripe integration, but may support other platforms in the future
     */
    export interface Config {
        /**
         * Adapter type (currently only 'stripe' is supported)
         * @remarks
         * This field determines which payment platform will be used
         */
        type: 'stripe';
        /**
         * Your application name as configured on iaptic.com
         * @remarks
         * This must match exactly what you set up in the Iaptic dashboard
         */
        appName: string;
        /**
         * Your Iaptic public API key
         * @remarks
         * Can be found in your Iaptic dashboard under API settings
         */
        apiKey: string;
        /**
         * Stripe publishable key
         */
        stripePublicKey: string;
        /**
         * Optional custom Iaptic URL for private deployments
         * @remarks
         * Only needed if you're using a self-hosted version of Iaptic
         */
        customIapticUrl?: string;
    }
    
    
    /**
     * Response from Iaptic's /stripe/products API
     * @internal
     */
    export interface GetProductsResponse {
        /** Whether the request was successful */
        ok: boolean;
        /** Array of available products */
        products: Product[];
    }
    /**
     * Response from Iaptic's /stripe/checkout API
     * @internal
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
     * @internal
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
     * @internal
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
     * Main class for interacting with Iaptic's Stripe integration
     * @remarks
     * This class handles all Stripe-related operations including product listing,
     * checkout sessions, and subscription management.
     */
    export class IapticStripe {
        /**
         * Creates a new IapticStripe instance
         * @param config - Configuration options for the Stripe integration
         * @throws Error if required configuration is missing
         */
        constructor(config: Config);
        /**
         * Gets a list of available products and their pricing
         * @returns Promise resolving to an array of products
         * @remarks
         * Results are cached locally. Use refreshProducts() to force a fresh fetch.
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
         * @throws Error if the checkout session creation fails
         * @remarks
         * This method will redirect the user to Stripe's checkout page on success
         */
        order(params: Order): Promise<void>;
        /**
         * Gets the customer's purchase history
         * @param accessToken - Optional access token (uses stored token if not provided)
         * @returns Promise resolving to an array of purchases
         * @remarks
         * This method will automatically schedule refresh operations for active subscriptions
         */
        getPurchases(accessToken?: string): Promise<Purchase[]>;
        /**
         * Redirects to Stripe Customer Portal for subscription management
         * @param params - Portal parameters including return URL
         * @throws Error if portal session creation fails
         * @remarks
         * This method will redirect the user to Stripe's customer portal on success
         */
        redirectToCustomerPortal(params: {
            returnUrl?: string;
            accessToken?: string;
        }): Promise<void>;
        /**
         * Changes a subscription plan
         * @param planChange - Plan change parameters
         * @returns Promise resolving to the updated purchase details
         * @remarks
         * This method handles immediate plan changes without requiring customer portal access
         */
        changePlan(planChange: PlanChange): Promise<Purchase>;
        /**
         * Clears all stored data including access tokens and cached products
         */
        clearStoredData(): void;
        onAccessTokenChange(callback: (accessToken: string) => void): void;
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
    export class RefreshScheduler {
        schedules: ScheduledRefresh[];
        constructor(iapticStripe: IapticStripe);
        scheduleRefresh(subscriptionId: string, date: Date, reason: string): void;
        schedulePurchaseRefreshes(purchase: Purchase): void;
        clearSchedules(): void;
    }
    
    /**
     * Utility functions for the Iaptic library
     */
    export class Utils {
        /**
         * Base64 encode a string with fallbacks for different environments
         * @param str - String to encode
         * @returns Base64 encoded string
         * @remarks
         * Handles non-ASCII characters and provides fallbacks for older browsers
         * and Node.js environments
         */
        static base64Encode(str: string): string;
        /**
         * Get and parse a JSON item from localStorage
         * @param key - Storage key
         * @returns Parsed value or null if not found/invalid
         * @internal
         */
        static storageGetJson<T>(key: string): T | null;
        /**
         * Get a string item from localStorage
         * @param key - Storage key
         * @returns String value or null if not found
         * @internal
         */
        static storageGetString(key: string): string | null;
        /**
         * Store a JSON-serializable value in localStorage
         * @param key - Storage key
         * @param value - Value to store
         * @returns true if successful, false if storage failed
         * @internal
         */
        static storageSetJson(key: string, value: any): boolean;
        /**
         * Store a string value in localStorage
         * @param key - Storage key
         * @param value - String to store
         * @returns true if successful, false if storage failed
         * @internal
         */
        static storageSetString(key: string, value: string): boolean;
        /**
         * Remove an item from localStorage
         * @param key - Storage key
         * @returns true if successful, false if removal failed
         * @internal
         */
        static storageRemove(key: string): boolean;
        /**
         * Build a URL with query parameters
         * @param baseUrl - Base URL without query parameters
         * @param params - Object containing query parameters
         * @returns Complete URL with encoded query parameters
         * @remarks
         * Handles URL encoding and removes undefined/null parameters
         * @internal
         */
        static buildUrl(baseUrl: string, params: Record<string, string>): string;
        /**
         * Format a currency amount from micros with proper localization
         * @param amountMicros - Amount in micros (1/1,000,000 of currency unit)
         * @param currency - ISO 4217 currency code (e.g., 'USD', 'EUR')
         * @returns Formatted currency string
         * @example
         * ```ts
         * Utils.formatCurrency(1990000, 'USD') // Returns "$1.99"
         * Utils.formatCurrency(1000000, 'EUR') // Returns "€1"
         * ```
         */
        static formatCurrency(amountMicros: number, currency: string): string;
        /**
         * Format an ISO 8601 period string into human-readable English
         * @param period - ISO 8601 duration string
         * @returns Human-readable period string
         * @example
         * ```ts
         * Utils.formatBillingPeriodEN('P1M') // Returns "Monthly"
         * Utils.formatBillingPeriodEN('P3M') // Returns "Every 3 months"
         * Utils.formatBillingPeriodEN('P1Y') // Returns "Yearly"
         * ```
         */
        static formatBillingPeriodEN(period: string): string;
    }
    
    /**
     * Creates an Iaptic adapter for the specified payment platform
     * @param config - Configuration options for the adapter
     * @returns An initialized adapter instance
     * @throws Error if the specified adapter type is not supported
     * @example
     * ```ts
     * const iaptic = createAdapter({
     *   type: 'stripe',
     *   appName: 'my-app',
     *   apiKey: '1234567890'
     * });
     * ```
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
