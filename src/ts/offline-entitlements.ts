namespace CdvPurchase {

    /** Storage adapter for persisting offline entitlements. */
    export interface OfflineStorageAdapter {
        getItem(key: string): Promise<string | null>;
        setItem(key: string, value: string): Promise<void>;
        removeItem(key: string): Promise<void>;
    }

    /** Options for {@link OfflineEntitlements}. */
    export interface OfflineEntitlementsOptions {
        /** Storage adapter. Defaults to a `localStorage` wrapper. */
        storage?: OfflineStorageAdapter;
        /** Grace period in milliseconds after a subscription's expiryDate during which it's still considered owned. Defaults to 30 days. */
        gracePeriodMs?: number;
        /** Behavior when the grace period has elapsed and the device is still offline. `'readonly'` keeps granting access; `'deny'` revokes it. Defaults to `'readonly'`. */
        onExpiredOffline?: 'deny' | 'readonly';
        /** If true, detect clock rollback (persisted lastSeenTimestamp is in the future relative to now) and deny access. */
        detectClockRollback?: boolean;
    }

    /** Event emitted by {@link OfflineEntitlements} when evaluating ownership offline. */
    export interface OfflineEntitlementEvent {
        type: 'grace' | 'readonly' | 'clock_rollback' | 'entitlement_missing' | 'expired';
        productId: string;
        message: string;
    }

    /**
     * Persist a subset of {@link VerifiedPurchase} to device storage so that
     * `offline.isOwned()` can answer "is this product owned?" when the device
     * is offline or has just restarted without connectivity.
     *
     * Phase 1 — unsigned cache. No JWT, no crypto, no server changes.
     *
     * @example
     * ```typescript
     * const offline = new CdvPurchase.OfflineEntitlements(store, {
     *     gracePeriodMs: 30 * 24 * 60 * 60 * 1000, // 30 days
     *     onExpiredOffline: 'readonly',
     *     detectClockRollback: true,
     * });
     *
     * await offline.ready();
     *
     * function isUserPremium(): boolean {
     *     return store.owned('premium') || offline.isOwned('premium');
     * }
     * ```
     *
     * **Durability warning:** for long-offline deployments (weeks without
     * connectivity), pass a file-based or secure-storage adapter. `localStorage`
     * (the default) can be evicted by the WebView under storage pressure, which
     * would silently lose the cached entitlements.
     */
    export class OfflineEntitlements {

        /** Storage key used in the storage adapter. */
        private static STORAGE_KEY = 'cdvpurchase.offline_entitlements';

        /** Schema version for the persisted payload. */
        private static SCHEMA_VERSION = 1;

        /** Default grace period: 30 days. */
        private static DEFAULT_GRACE_PERIOD_MS = 30 * 24 * 60 * 60 * 1000;

        private store: Store;
        private storage: OfflineStorageAdapter;
        private gracePeriodMs: number;
        private onExpiredOffline: 'deny' | 'readonly';
        private detectClockRollback: boolean;

        /** In-memory cache of persisted entitlements, keyed by `platform:productId`. */
        private cache: { [key: string]: PersistedPurchase } = {};

        /** Last seen timestamp persisted with the data, used for clock rollback detection. */
        private lastSeenTimestamp: number = 0;

        /** True once `ready()` has resolved. */
        private isReady: boolean = false;

        /** Event callbacks. */
        private eventCallbacks: Internal.Callbacks<OfflineEntitlementEvent>;

        /** Last event fired per productId, to deduplicate events on repeated isOwned() calls. */
        private lastEventPerProduct: { [productId: string]: OfflineEntitlementEvent['type'] } = {};

        constructor(store: Store, options: OfflineEntitlementsOptions = {}) {
            this.store = store;
            this.storage = options.storage ?? OfflineEntitlements.createLocalStorageAdapter();
            this.gracePeriodMs = options.gracePeriodMs ?? OfflineEntitlements.DEFAULT_GRACE_PERIOD_MS;
            this.onExpiredOffline = options.onExpiredOffline ?? 'readonly';
            this.detectClockRollback = options.detectClockRollback ?? false;
            this.eventCallbacks = new Internal.Callbacks<OfflineEntitlementEvent>(store.log, 'OfflineEntitlements');
            this.store.when().verified((receipt: VerifiedReceipt) => { void this.onVerified(receipt); });
        }

        /** Wrap the global `localStorage` as an async `OfflineStorageAdapter`. */
        private static createLocalStorageAdapter(): OfflineStorageAdapter {
            return {
                getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
                setItem: (key: string, value: string) => { localStorage.setItem(key, value); return Promise.resolve(); },
                removeItem: (key: string) => { localStorage.removeItem(key); return Promise.resolve(); },
            };
        }

        /** Load persisted entitlements from storage into the in-memory cache. Idempotent. */
        async ready(): Promise<void> {
            if (this.isReady) return;
            await this.loadFromStorage();
            this.isReady = true;
        }

        /** Reload from storage and re-evaluate. Resolves when the reload is complete. Call after reconnecting or manually. */
        refresh(): Promise<void> {
            return this.loadFromStorage();
        }

        /** Register a callback for {@link OfflineEntitlementEvent}s. */
        onEvent(callback: Callback<OfflineEntitlementEvent>): void {
            this.eventCallbacks.push(callback);
        }

        /** Remove all persisted entitlements from storage and clear the in-memory cache. For user logout. */
        async clear(): Promise<void> {
            this.cache = {};
            this.lastSeenTimestamp = 0;
            this.isReady = false;
            this.lastEventPerProduct = {};
            await this.storage.removeItem(OfflineEntitlements.STORAGE_KEY);
        }

        /**
         * Return `true` if the product is owned, using the persisted cache when
         * the in-memory `verifiedReceipts` don't grant ownership.
         *
         * Returns `false` for all products until `ready()` has resolved.
         */
        isOwned(productId: string): boolean {
            if (!this.isReady) {
                this.store.log.warn('OfflineEntitlements.isOwned("' + productId + '") called before ready() — returning false. Call await offline.ready() at startup.');
                return false;
            }

            // 1. If store.verifiedReceipts has a valid (non-expired) entry, return true.
            const online = Internal.VerifiedReceipts.isOwned(this.store.verifiedReceipts, { id: productId });
            if (online) return true;

            const now = +new Date();

            // 2. Find persisted purchase for this productId across all platforms.
            const persisted = this.findPersisted(productId);
            if (!persisted) {
                // No persisted entitlement.
                this.fireEvent('entitlement_missing', productId, 'No persisted entitlement for this product.');
                return false;
            }

            // 3. Branch by product type.
            // Subscriptions have an expiryDate; non-consumables don't.
            if (persisted.expiryDate !== undefined && persisted.expiryDate !== null) {
                // Subscription
                // Clock rollback detection — scoped to subscriptions (non-consumables have no time component).
                if (this.detectClockRollback && this.lastSeenTimestamp > now) {
                    this.fireEvent('clock_rollback', persisted.id, 'Clock appears to have rolled back; denying offline entitlement.');
                    return false;
                }
                if (persisted.isExpired) {
                    this.fireEvent('expired', persisted.id, 'Subscription is marked as expired.');
                    return false;
                }
                if (now < persisted.expiryDate) {
                    return true;
                }
                const renewalIntent = persisted.renewalIntent;
                if (renewalIntent === RenewalIntent.RENEW && now < persisted.expiryDate + this.gracePeriodMs) {
                    this.fireEvent('grace', persisted.id, 'Subscription expired but within grace period.');
                    return true;
                }
                if (renewalIntent === RenewalIntent.LAPSE) {
                    // Lapsed subscriptions deny at expiryDate.
                    return false;
                }
                // Unknown/undefined renewalIntent: fall through to onExpiredOffline.
                if (this.onExpiredOffline === 'readonly') {
                    this.fireEvent('readonly', persisted.id, 'Subscription expired and grace period elapsed; granting readonly access.');
                    return true;
                }
                return false;
            }
            else {
                // Non-consumable: never hard-expires, no clock rollback check.
                return true;
            }
        }
        /**
         * Retrieve the persisted entitlement for a product, analogous to
         * `store.findInVerifiedReceipts()`.
         *
         * Returns the {@link PersistedPurchase} (with `expiryDate`,
         * `renewalIntent`, `lastRenewalDate`, etc.) if one has been cached,
         * or `undefined` if no offline entitlement exists for this product.
         *
         * Returns `undefined` for all products until `ready()` has resolved.
         *
         * @example
         * ```typescript
         * const entitlement = offline.find('premium');
         * if (entitlement?.expiryDate) {
         *     const daysLeft = Math.ceil((entitlement.expiryDate - Date.now()) / 86400000);
         *     showRenewalBanner(daysLeft);
         * }
         * ```
         */
        find(productId: string): PersistedPurchase | undefined {
            if (!this.isReady) return undefined;
            return this.findPersisted(productId);
        }

        /** Persist all `VerifiedPurchase`s in a verified receipt to storage. */
        private async onVerified(receipt: VerifiedReceipt): Promise<void> {
            for (const purchase of receipt.collection) {
                // Skip consumables — they don't need offline entitlement.
                if (purchase.isConsumed) continue;
                const platform = purchase.platform ?? receipt.platform;
                const product = this.store.get(purchase.id, platform);
                if (product && product.type === ProductType.CONSUMABLE) continue;

                const key = platform + ':' + purchase.id;
                this.cache[key] = {
                    id: purchase.id,
                    platform,
                    expiryDate: purchase.expiryDate,
                    isExpired: purchase.isExpired,
                    renewalIntent: purchase.renewalIntent,
                    lastRenewalDate: purchase.lastRenewalDate,
                    purchaseDate: purchase.purchaseDate,
                    cancelationReason: purchase.cancelationReason,
                    isBillingRetryPeriod: purchase.isBillingRetryPeriod,
                };
            }
            this.lastSeenTimestamp = +new Date();
            await this.saveToStorage();
        }

        /** Find the persisted purchase for a productId across all platforms. */
        private findPersisted(productId: string): PersistedPurchase | undefined {
            let found: PersistedPurchase | undefined;
            for (const key of Object.keys(this.cache)) {
                const entry = this.cache[key];
                if (entry.id === productId) {
                    if (!found || (found.lastRenewalDate ?? found.purchaseDate ?? 0) < (entry.lastRenewalDate ?? entry.purchaseDate ?? 0)) {
                        found = entry;
                    }
                }
            }
            return found;
        }

        /** Load the persisted payload from storage into the in-memory cache. */
        private async loadFromStorage(): Promise<void> {
            try {
                const raw = await this.storage.getItem(OfflineEntitlements.STORAGE_KEY);
                if (!raw) {
                    this.cache = {};
                    this.lastSeenTimestamp = 0;
                    return;
                }
                const parsed = JSON.parse(raw) as PersistedPayload;
                if (parsed.schemaVersion !== OfflineEntitlements.SCHEMA_VERSION) {
                    this.store.log.warn('OfflineEntitlements: schema version mismatch, ignoring cached data.');
                    this.cache = {};
                    this.lastSeenTimestamp = 0;
                    return;
                }
                this.cache = parsed.receipts ?? {};
                this.lastSeenTimestamp = parsed.lastSeenTimestamp ?? 0;
            }
            catch (err) {
                this.store.log.warn('OfflineEntitlements: failed to load from storage: ' + (err as Error).message);
                this.cache = {};
                this.lastSeenTimestamp = 0;
            }
        }

        /** Serialize the in-memory cache to storage. */
        private async saveToStorage(): Promise<void> {
            const payload: PersistedPayload = {
                receipts: this.cache,
                lastSeenTimestamp: this.lastSeenTimestamp,
                schemaVersion: OfflineEntitlements.SCHEMA_VERSION,
            };
            try {
                await this.storage.setItem(OfflineEntitlements.STORAGE_KEY, JSON.stringify(payload));
            }
            catch (err) {
                this.store.log.warn('OfflineEntitlements: failed to save to storage: ' + (err as Error).message);
            }
        }

        /** Fire an event to all registered callbacks, deduplicating per productId. */
        private fireEvent(type: OfflineEntitlementEvent['type'], productId: string, message: string): void {
            if (this.lastEventPerProduct[productId] === type) return;
            this.lastEventPerProduct[productId] = type;
            this.eventCallbacks.trigger({ type, productId, message }, 'offline_entitlements');
        }
    }

    /** Persisted subset of {@link VerifiedPurchase}, stored by the offline entitlements layer. */
    export interface PersistedPurchase {
        id: string;
        platform: Platform;
        expiryDate?: number;
        isExpired?: boolean;
        renewalIntent?: string;
        lastRenewalDate?: number;
        purchaseDate?: number;
        cancelationReason?: CancelationReason;
        isBillingRetryPeriod?: boolean;
    }

    /** Shape of the persisted payload in storage. */
    interface PersistedPayload {
        receipts: { [key: string]: PersistedPurchase };
        lastSeenTimestamp: number;
        schemaVersion: number;
    }
}