/**
 * Native plugin interface for Capacitor.
 * Defines the methods exposed by the Android and iOS native plugins.
 */
export interface PurchasePluginPlugin {

  // ===== Google Play + iOS shared =====

  /** Initialize the billing client */
  init(options?: Record<string, unknown>): Promise<void>;

  /** Query available products */
  getAvailableProducts(options: {
    inAppSkus: string[];
    subsSkus: string[];
  }): Promise<{ products: unknown[] }>;

  /** Query existing purchases */
  getPurchases(): Promise<{ purchases: unknown[] }>;

  /** Initiate a purchase flow */
  buy(options: {
    productId: string;
    additionalData?: Record<string, unknown>;
  }): Promise<void>;

  /** Initiate a subscription flow (Android) or purchase (iOS) */
  subscribe(options: {
    productId: string;
    additionalData?: Record<string, unknown>;
  }): Promise<void>;

  /** Finish/acknowledge a transaction */
  finish(options: { transactionId: string }): Promise<void>;

  /** Open subscription management UI */
  manageSubscriptions(): Promise<void>;

  /** Open billing management UI */
  manageBilling(): Promise<void>;

  // ===== Android-specific =====

  /** Consume a purchase (Android) */
  consumePurchase(options: { purchaseToken: string }): Promise<void>;

  /** Acknowledge a purchase (Android) */
  acknowledgePurchase(options: { purchaseToken: string }): Promise<void>;

  /** Launch price change confirmation flow (Android) */
  launchPriceChangeConfirmationFlow(options: {
    productId: string;
  }): Promise<void>;

  // ===== iOS-specific =====

  /** Load product details (iOS) */
  load(options: { productIds: string[] }): Promise<{
    validProducts: unknown[];
    invalidProductIds: string[];
  }>;

  /** Purchase a product (iOS) */
  purchase(options: {
    productId: string;
    quantity?: number;
    applicationUsername?: string;
    discount?: Record<string, unknown>;
  }): Promise<void>;

  /** Check if the device can make payments (iOS) */
  canMakePayments(): Promise<{ canMakePayments: boolean }>;

  /** Restore completed transactions (iOS) */
  restore(): Promise<void>;

  /** Present the code redemption sheet (iOS) */
  presentCodeRedemptionSheet(): Promise<void>;

  /** Refresh App Store receipts (iOS) */
  refreshReceipts(): Promise<{ receipt: unknown }>;

  /** Load App Store receipts (iOS) */
  loadReceipts(): Promise<{ receipt: unknown }>;

  // ===== Event listeners =====

  addListener(
    eventName: string,
    listenerFunc: (data: any) => void
  ): Promise<{ remove: () => Promise<void> }>;
}
