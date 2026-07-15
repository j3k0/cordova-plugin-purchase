import '../www/store';

/**
 * Unit tests for CdvPurchase.OfflineEntitlements (Phase 1 — unsigned cache).
 *
 * Uses a mock in-memory OfflineStorageAdapter. No real localStorage.
 */

const Platform = CdvPurchase.Platform;
const RenewalIntent = CdvPurchase.RenewalIntent;

/** In-memory mock storage adapter implementing OfflineStorageAdapter. */
function mockStorage(): CdvPurchase.OfflineStorageAdapter {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => Promise.resolve(store[key] ?? null),
    setItem: (key: string, value: string) => { store[key] = value; return Promise.resolve(); },
    removeItem: (key: string) => { delete store[key]; return Promise.resolve(); },
  };
}

/** Collect OfflineEntitlementEvents into an array. */
function collectEvents(oe: CdvPurchase.OfflineEntitlements): CdvPurchase.OfflineEntitlementEvent[] {
  const events: CdvPurchase.OfflineEntitlementEvent[] = [];
  oe.onEvent(e => events.push(e));
  return events;
}

/** Flush pending setTimeout(0) callbacks from Utils.safeCall. */
function flushTimers(): Promise<void> {
  return new Promise(r => setTimeout(r, 0));
}

/** Build a mock VerifiedReceipt with a single purchase. */
function makeVerifiedReceipt(
  platform: CdvPurchase.Platform,
  purchase: Partial<CdvPurchase.VerifiedPurchase> & { id: string },
): CdvPurchase.VerifiedReceipt {
  return {
    className: 'VerifiedReceipt',
    validationDate: new Date(),
    platform,
    id: purchase.id,
    collection: [purchase as CdvPurchase.VerifiedPurchase],
    sourceReceipt: {} as CdvPurchase.Receipt,
    latestReceipt: true,
    nativeTransactions: [],
    set: () => {},
    finish: () => Promise.resolve(),
    raw: {} as CdvPurchase.Validator.Response.SuccessPayload['data'],
  } as unknown as CdvPurchase.VerifiedReceipt;
}

describe('OfflineEntitlements', () => {

  describe('isOwned — before ready()', () => {
    test('returns false for all products before ready() resolves', () => {
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage: mockStorage() });
      expect(oe.isOwned('any-product')).toBe(false);
    });
  });

  describe('isOwned — subscription', () => {
    const productId = 'premium_monthly';

    test('valid subscription (expiryDate in future) → true', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      // Simulate a verified receipt with a subscription expiring in 30 days
      const receipt = makeVerifiedReceipt(Platform.APPLE_APPSTORE, {
        id: productId,
        platform: Platform.APPLE_APPSTORE,
        expiryDate: now + 30 * 24 * 60 * 60 * 1000,
        renewalIntent: RenewalIntent.RENEW,
        isExpired: false,
        purchaseDate: now - 30 * 24 * 60 * 60 * 1000,
      });

      // Trigger the verified callback
      // @ts-ignore - accessing private property for testing
      CdvPurchase.store.verifiedCallbacks.trigger(receipt, 'test');
      await flushTimers();
      await new Promise(r => setTimeout(r, 10));

      expect(oe.isOwned(productId)).toBe(true);
    });

    test('expired subscription, Renew intent, within grace → true + grace event', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const graceMs = 30 * 24 * 60 * 60 * 1000; // 30 days
      const expiryDate = now - 5 * 24 * 60 * 60 * 1000; // expired 5 days ago

      // Pre-populate storage directly
      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':' + productId]: {
            id: productId,
            platform: Platform.APPLE_APPSTORE,
            expiryDate,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
            purchaseDate: expiryDate - 30 * 24 * 60 * 60 * 1000,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage, gracePeriodMs: graceMs });
      const events = collectEvents(oe);
      await oe.ready();

      expect(oe.isOwned(productId)).toBe(true);
      await flushTimers();
      expect(events.some(e => e.type === 'grace' && e.productId === productId)).toBe(true);
    });

    test('expired subscription, Renew intent, grace elapsed, onExpiredOffline readonly → true + readonly event', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const graceMs = 7 * 24 * 60 * 60 * 1000; // 7 days
      const expiryDate = now - 20 * 24 * 60 * 60 * 1000; // expired 20 days ago (grace is 7 days)

      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':' + productId]: {
            id: productId,
            platform: Platform.APPLE_APPSTORE,
            expiryDate,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
            purchaseDate: expiryDate - 30 * 24 * 60 * 60 * 1000,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, {
        storage, gracePeriodMs: graceMs, onExpiredOffline: 'readonly',
      });
      const events = collectEvents(oe);
      await oe.ready();

      expect(oe.isOwned(productId)).toBe(true);
      await flushTimers();
      expect(events.some(e => e.type === 'readonly' && e.productId === productId)).toBe(true);
    });

    test('expired subscription, Renew intent, grace elapsed, onExpiredOffline deny → false', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const graceMs = 7 * 24 * 60 * 60 * 1000;
      const expiryDate = now - 20 * 24 * 60 * 60 * 1000;

      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':' + productId]: {
            id: productId,
            platform: Platform.APPLE_APPSTORE,
            expiryDate,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
            purchaseDate: expiryDate - 30 * 24 * 60 * 60 * 1000,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, {
        storage, gracePeriodMs: graceMs, onExpiredOffline: 'deny',
      });
      const events = collectEvents(oe);
      await oe.ready();

      expect(oe.isOwned(productId)).toBe(false);
      // Should not fire readonly since we deny
      expect(events.some(e => e.type === 'readonly')).toBe(false);
    });

    test('expired subscription, Lapse intent → false', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const expiryDate = now - 1 * 24 * 60 * 60 * 1000; // expired 1 day ago

      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':' + productId]: {
            id: productId,
            platform: Platform.APPLE_APPSTORE,
            expiryDate,
            isExpired: false,
            renewalIntent: RenewalIntent.LAPSE,
            purchaseDate: expiryDate - 30 * 24 * 60 * 60 * 1000,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      expect(oe.isOwned(productId)).toBe(false);
    });

    test('isExpired: true → false', async () => {
      const storage = mockStorage();
      const now = Date.now();

      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':' + productId]: {
            id: productId,
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000, // still in the future
            isExpired: true,
            renewalIntent: RenewalIntent.RENEW,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      const events = collectEvents(oe);
      await oe.ready();

      expect(oe.isOwned(productId)).toBe(false);
      await flushTimers();
      expect(events.some(e => e.type === 'expired' && e.productId === productId)).toBe(true);
    });
  });

  describe('isOwned — non-consumable', () => {
    const productId = 'pro_unlock';

    test('persisted non-consumable → true (never expires)', async () => {
      const storage = mockStorage();
      const now = Date.now();

      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':' + productId]: {
            id: productId,
            platform: Platform.APPLE_APPSTORE,
            // no expiryDate → non-consumable
            purchaseDate: now - 365 * 24 * 60 * 60 * 1000,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      expect(oe.isOwned(productId)).toBe(true);
    });
  });

  describe('isOwned — no persisted entitlement', () => {
    test('returns false + entitlement_missing event', async () => {
      const storage = mockStorage();
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      const events = collectEvents(oe);
      await oe.ready();

      expect(oe.isOwned('unknown-product')).toBe(false);
      await flushTimers();
      expect(events.some(e => e.type === 'entitlement_missing' && e.productId === 'unknown-product')).toBe(true);
    });
  });

  describe('isOwned — clock rollback', () => {
    test('detectClockRollback true, lastSeenTimestamp in future → false + clock_rollback event', async () => {
      const storage = mockStorage();
      const now = Date.now();

      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':premium']: {
            id: 'premium',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
          },
        },
        // lastSeenTimestamp is 1 year in the future → clock went backwards
        lastSeenTimestamp: now + 365 * 24 * 60 * 60 * 1000,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, {
        storage, detectClockRollback: true,
      });
      const events = collectEvents(oe);
      await oe.ready();

      expect(oe.isOwned('premium')).toBe(false);
      await flushTimers();
      expect(events.some(e => e.type === 'clock_rollback' && e.productId === 'premium')).toBe(true);
    });

    test('detectClockRollback false → does not fire clock_rollback', async () => {
      const storage = mockStorage();
      const now = Date.now();

      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':premium']: {
            id: 'premium',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
          },
        },
        lastSeenTimestamp: now + 365 * 24 * 60 * 60 * 1000,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, {
        storage, detectClockRollback: false,
      });
      const events = collectEvents(oe);
      await oe.ready();

      // Without rollback detection, the valid subscription should be owned
      expect(oe.isOwned('premium')).toBe(true);
      expect(events.some(e => e.type === 'clock_rollback')).toBe(false);
    });
  });

  describe('isOwned — verifiedReceipts priority', () => {
    test('store.verifiedReceipts has valid entry → true (takes priority over persisted)', async () => {
      const storage = mockStorage();
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      // Inject a valid verified receipt directly into the store's validator
      const now = Date.now();
      const receipt = makeVerifiedReceipt(Platform.APPLE_APPSTORE, {
        id: 'premium_online',
        platform: Platform.APPLE_APPSTORE,
        expiryDate: now + 30 * 24 * 60 * 60 * 1000,
        isExpired: false,
        renewalIntent: RenewalIntent.RENEW,
      });
      // @ts-ignore - accessing private property for testing
      CdvPurchase.store._validator.verifiedReceipts.push(receipt);

      expect(oe.isOwned('premium_online')).toBe(true);

      // Cleanup
      // @ts-ignore
      CdvPurchase.store._validator.verifiedReceipts.pop();
    });
  });

  describe('persistence', () => {
    test('verified event persists VerifiedPurchase subset to storage', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      const receipt = makeVerifiedReceipt(Platform.APPLE_APPSTORE, {
        id: 'persisted_sub',
        platform: Platform.APPLE_APPSTORE,
        expiryDate: now + 30 * 24 * 60 * 60 * 1000,
        isExpired: false,
        renewalIntent: RenewalIntent.RENEW,
        purchaseDate: now - 1000,
      });

      // @ts-ignore - accessing private property for testing
      CdvPurchase.store.verifiedCallbacks.trigger(receipt, 'test');
      await flushTimers();
      // Allow async saveToStorage to complete
      await new Promise(r => setTimeout(r, 10));

      const raw = await storage.getItem('cdvpurchase.offline_entitlements');
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      const key = Platform.APPLE_APPSTORE + ':persisted_sub';
      expect(parsed.receipts[key]).toBeDefined();
      expect(parsed.receipts[key].id).toBe('persisted_sub');
      expect(parsed.receipts[key].expiryDate).toBe(now + 30 * 24 * 60 * 60 * 1000);
      expect(parsed.schemaVersion).toBe(1);
    });

    test('clear() removes all persisted data', async () => {
      const storage = mockStorage();
      const now = Date.now();

      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':clearable']: {
            id: 'clearable',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();
      expect(oe.isOwned('clearable')).toBe(true);

      await oe.clear();
      // After clear, isOwned returns false because not ready
      expect(oe.isOwned('clearable')).toBe(false);

      const raw = await storage.getItem('cdvpurchase.offline_entitlements');
      expect(raw).toBeNull();
    });

    test('refresh() reloads from storage', async () => {
      const storage = mockStorage();
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      // Initially no entitlement
      expect(oe.isOwned('refreshed')).toBe(false);

      // Write new data to storage directly
      const now = Date.now();
      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':refreshed']: {
            id: 'refreshed',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      // refresh() now returns a promise — await it directly
      await oe.refresh();

      expect(oe.isOwned('refreshed')).toBe(true);
    });
  });

  describe('persistence — consumable skip', () => {
    test('verified receipt with isConsumed purchase does not persist it', async () => {
      const storage = mockStorage();
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      const receipt = makeVerifiedReceipt(Platform.APPLE_APPSTORE, {
        id: 'coins_pack',
        platform: Platform.APPLE_APPSTORE,
        isConsumed: true,
      });

      // @ts-ignore - accessing private property for testing
      CdvPurchase.store.verifiedCallbacks.trigger(receipt, 'test');
      await flushTimers();
      await new Promise(r => setTimeout(r, 10));

      const raw = await storage.getItem('cdvpurchase.offline_entitlements');
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        expect(parsed.receipts[Platform.APPLE_APPSTORE + ':coins_pack']).toBeUndefined();
      }
      // Consumable should not be owned offline
      expect(oe.isOwned('coins_pack')).toBe(false);
    });
  });

  describe('clear() does not break subsequent verified events', () => {
    test('after clear() + ready(), verified events still persist', async () => {
      const storage = mockStorage();
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      // Clear data (e.g., user logout)
      await oe.clear();

      // Re-ready
      await oe.ready();

      // Simulate a verified receipt for the new user
      const now = Date.now();
      const receipt = makeVerifiedReceipt(Platform.APPLE_APPSTORE, {
        id: 'new_user_sub',
        platform: Platform.APPLE_APPSTORE,
        expiryDate: now + 30 * 24 * 60 * 60 * 1000,
        isExpired: false,
        renewalIntent: RenewalIntent.RENEW,
        purchaseDate: now - 1000,
      });

      // @ts-ignore - accessing private property for testing
      CdvPurchase.store.verifiedCallbacks.trigger(receipt, 'test');
      await flushTimers();
      await new Promise(r => setTimeout(r, 10));

      expect(oe.isOwned('new_user_sub')).toBe(true);
    });
  });

  describe('event deduplication', () => {
    test('same event type for same product fires only once', async () => {
      const storage = mockStorage();
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      const events = collectEvents(oe);
      await oe.ready();

      // No entitlement → entitlement_missing on every call, but deduped
      oe.isOwned('dedup_product');
      await flushTimers();
      oe.isOwned('dedup_product');
      await flushTimers();
      oe.isOwned('dedup_product');
      await flushTimers();

      const missing = events.filter(e => e.type === 'entitlement_missing' && e.productId === 'dedup_product');
      expect(missing.length).toBe(1);
    });

    test('different event types for same product both fire', async () => {
      const storage = mockStorage();
      const now = Date.now();

      // First: a valid subscription → no event, returns true
      const payloadValid = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':dedup2']: {
            id: 'dedup2',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payloadValid));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      const events = collectEvents(oe);
      await oe.ready();

      expect(oe.isOwned('dedup2')).toBe(true);
      await flushTimers();

      // Now overwrite with an expired subscription → grace event
      const payloadGrace = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':dedup2']: {
            id: 'dedup2',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now - 5 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payloadGrace));
      await oe.refresh();

      expect(oe.isOwned('dedup2')).toBe(true);
      await flushTimers();

      const grace = events.filter(e => e.type === 'grace' && e.productId === 'dedup2');
      expect(grace.length).toBe(1);
    });
  });

  describe('ready() idempotency', () => {
    test('second ready() call is a no-op', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':idem']: {
            id: 'idem',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();
      // Second call should resolve immediately
      await oe.ready();

      expect(oe.isOwned('idem')).toBe(true);
    });
  });

  describe('loadFromStorage error handling', () => {
    test('corrupted JSON in storage → graceful fallback to empty cache', async () => {
      const storage = mockStorage();
      await storage.setItem('cdvpurchase.offline_entitlements', '{not valid json');

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      // Should not throw, should return false
      expect(oe.isOwned('any-product')).toBe(false);
    });

    test('schema version mismatch → ignores cached data', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':mismatch']: {
            id: 'mismatch',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 999,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      // Data should be ignored — no entitlement
      expect(oe.isOwned('mismatch')).toBe(false);
    });
  });
  describe('find() — retrieve persisted entitlement', () => {
    test('returns undefined before ready()', () => {
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage: mockStorage() });
      expect(oe.find('any-product')).toBeUndefined();
    });

    test('returns undefined for product with no persisted entitlement', async () => {
      const storage = mockStorage();
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();
      expect(oe.find('nonexistent')).toBeUndefined();
    });

    test('returns PersistedPurchase with expected fields for a subscription', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const expiry = now + 30 * 24 * 60 * 60 * 1000;
      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':sub_find']: {
            id: 'sub_find',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: expiry,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
            lastRenewalDate: now - 7 * 24 * 60 * 60 * 1000,
            purchaseDate: now - 30 * 24 * 60 * 60 * 1000,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      const entitlement = oe.find('sub_find');
      expect(entitlement).toBeDefined();
      expect(entitlement!.id).toBe('sub_find');
      expect(entitlement!.platform).toBe(Platform.APPLE_APPSTORE);
      expect(entitlement!.expiryDate).toBe(expiry);
      expect(entitlement!.isExpired).toBe(false);
      expect(entitlement!.renewalIntent).toBe(RenewalIntent.RENEW);
      expect(entitlement!.lastRenewalDate).toBe(now - 7 * 24 * 60 * 60 * 1000);
      expect(entitlement!.purchaseDate).toBe(now - 30 * 24 * 60 * 60 * 1000);
    });

    test('returns PersistedPurchase for a non-consumable (no expiryDate)', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const payload = {
        receipts: {
          [Platform.GOOGLE_PLAY + ':nc_find']: {
            id: 'nc_find',
            platform: Platform.GOOGLE_PLAY,
            purchaseDate: now - 365 * 24 * 60 * 60 * 1000,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      const entitlement = oe.find('nc_find');
      expect(entitlement).toBeDefined();
      expect(entitlement!.id).toBe('nc_find');
      expect(entitlement!.platform).toBe(Platform.GOOGLE_PLAY);
      expect(entitlement!.expiryDate).toBeUndefined();
    });

    test('returns the most recent entry when same productId spans platforms', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const olderRenewal = now - 30 * 24 * 60 * 60 * 1000;
      const newerRenewal = now - 1 * 24 * 60 * 60 * 1000;
      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':multi']: {
            id: 'multi',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
            lastRenewalDate: olderRenewal,
          },
          [Platform.GOOGLE_PLAY + ':multi']: {
            id: 'multi',
            platform: Platform.GOOGLE_PLAY,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
            lastRenewalDate: newerRenewal,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();

      const entitlement = oe.find('multi');
      expect(entitlement).toBeDefined();
      // findPersisted picks the entry with the more recent lastRenewalDate
      expect(entitlement!.lastRenewalDate).toBe(newerRenewal);
    });

    test('returns undefined after clear()', async () => {
      const storage = mockStorage();
      const now = Date.now();
      const payload = {
        receipts: {
          [Platform.APPLE_APPSTORE + ':clear_find']: {
            id: 'clear_find',
            platform: Platform.APPLE_APPSTORE,
            expiryDate: now + 30 * 24 * 60 * 60 * 1000,
            isExpired: false,
            renewalIntent: RenewalIntent.RENEW,
          },
        },
        lastSeenTimestamp: now,
        schemaVersion: 1,
      };
      await storage.setItem('cdvpurchase.offline_entitlements', JSON.stringify(payload));

      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      await oe.ready();
      expect(oe.find('clear_find')).toBeDefined();

      await oe.clear();
      expect(oe.find('clear_find')).toBeUndefined();
    });
  });
});