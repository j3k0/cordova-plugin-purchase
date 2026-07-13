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
      expect(events.some(e => e.type === 'token_expired' && e.productId === productId)).toBe(true);
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
    test('returns false + token_invalid event', async () => {
      const storage = mockStorage();
      const oe = new CdvPurchase.OfflineEntitlements(CdvPurchase.store, { storage });
      const events = collectEvents(oe);
      await oe.ready();

      expect(oe.isOwned('unknown-product')).toBe(false);
      await flushTimers();
      expect(events.some(e => e.type === 'token_invalid' && e.productId === 'unknown-product')).toBe(true);
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

      // refresh() triggers a reload (async), wait for it to settle
      oe.refresh();
      await new Promise(r => setTimeout(r, 10));

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
});