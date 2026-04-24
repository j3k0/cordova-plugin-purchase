import '../www/store';

type ValidProduct = CdvPurchase.AppleAppStore.Bridge.ValidProduct;

const {
    collectEligibilityRequests,
    mergeNativeEligibility,
    DiscountEligibilities,
} = CdvPurchase.AppleAppStore.Internal;

/**
 * These tests exercise the pure helpers used by the Apple AppStore adapter's
 * `loadEligibility`. They cover the fix for #1694 — under StoreKit 2 the app
 * store receipt is always empty, so the adapter previously returned a blanket
 * "eligible" answer for every Introductory request. The native plugin now
 * surfaces `isEligibleForIntroOffer` on each product, and the adapter seeds
 * those into the eligibility response.
 */
describe('AppleAppStore eligibility (#1694)', () => {

    function product(over: Partial<ValidProduct> = {}): ValidProduct {
        return {
            id: 'sub.monthly',
            title: 'Monthly subscription',
            description: 'A monthly subscription',
            price: '$4.99',
            priceMicros: 4990000,
            currency: 'USD',
            countryCode: 'US',
            billingPeriod: 1,
            billingPeriodUnit: 'Month' as CdvPurchase.IPeriodUnit,
            introPrice: '$0.00',
            introPriceMicros: 0,
            introPricePeriod: 1,
            introPricePeriodUnit: 'Week' as CdvPurchase.IPeriodUnit,
            introPricePaymentMode: 'FreeTrial' as CdvPurchase.PaymentMode,
            ...over,
        };
    }

    describe('collectEligibilityRequests', () => {

        test('adds the synthetic "intro" request when discounts is empty and introPrice is set', () => {
            const { requests, nativeAnswers } = collectEligibilityRequests([product()]);
            expect(requests).toEqual([{
                productId: 'sub.monthly',
                discountId: 'intro',
                discountType: 'Introductory',
            }]);
            expect(nativeAnswers).toEqual([undefined]);
        });

        test('passes native introPriceEligible=false through as the native answer', () => {
            const { nativeAnswers } = collectEligibilityRequests([product({ introPriceEligible: false })]);
            expect(nativeAnswers).toEqual([false]);
        });

        test('passes native introPriceEligible=true through as the native answer', () => {
            const { nativeAnswers } = collectEligibilityRequests([product({ introPriceEligible: true })]);
            expect(nativeAnswers).toEqual([true]);
        });

        test('only surfaces native answers for Introductory entries, never Subscription', () => {
            const p = product({
                introPriceEligible: false,
                discounts: [
                    { id: 'promo1', type: 'Subscription',
                      price: '$2.99', priceMicros: 2990000,
                      period: 1, periodUnit: 'Month' as CdvPurchase.IPeriodUnit,
                      paymentMode: 'PayAsYouGo' as CdvPurchase.PaymentMode },
                ],
            });
            const { requests, nativeAnswers } = collectEligibilityRequests([p]);
            expect(requests.length).toBe(1);
            expect(requests[0].discountType).toBe('Subscription');
            // Subscription offers must NOT inherit the intro-offer answer.
            expect(nativeAnswers).toEqual([undefined]);
        });

        test('produces no requests for a product without introPrice and without discounts', () => {
            const p = product({ introPrice: undefined, introPriceMicros: undefined });
            const { requests, nativeAnswers } = collectEligibilityRequests([p]);
            expect(requests).toEqual([]);
            expect(nativeAnswers).toEqual([]);
        });
    });

    describe('mergeNativeEligibility', () => {

        test('native answer overrides determiner response', () => {
            const merged = mergeNativeEligibility([true, true], [false, undefined]);
            expect(merged).toEqual([false, true]);
        });

        test('all native = full override', () => {
            const merged = mergeNativeEligibility([true, true], [false, false]);
            expect(merged).toEqual([false, false]);
        });

        test('no native = determiner response passes through unchanged', () => {
            const merged = mergeNativeEligibility([true, false], [undefined, undefined]);
            expect(merged).toEqual([true, false]);
        });
    });

    describe('DiscountEligibilities — end-to-end shape', () => {

        test('SK2 + introPriceEligible=false → isEligible returns false', () => {
            const { requests, nativeAnswers } = collectEligibilityRequests([
                product({ introPriceEligible: false }),
            ]);
            // All answers are native → fast path: hand nativeAnswers straight to the class.
            const elig = new DiscountEligibilities(requests, nativeAnswers as boolean[]);
            expect(elig.isEligible('sub.monthly', 'Introductory', 'intro')).toBe(false);
        });

        test('SK2 + introPriceEligible=true → isEligible returns true', () => {
            const { requests, nativeAnswers } = collectEligibilityRequests([
                product({ introPriceEligible: true }),
            ]);
            const elig = new DiscountEligibilities(requests, nativeAnswers as boolean[]);
            expect(elig.isEligible('sub.monthly', 'Introductory', 'intro')).toBe(true);
        });

        test('Old native (no introPriceEligible field) → falls back to determiner=true', () => {
            const { requests, nativeAnswers } = collectEligibilityRequests([product()]);
            // Determiner would default to true for Introductory in the "no receipt" branch.
            const determinerDefault = requests.map(r => r.discountType === 'Introductory');
            const merged = mergeNativeEligibility(determinerDefault, nativeAnswers);
            const elig = new DiscountEligibilities(requests, merged);
            expect(elig.isEligible('sub.monthly', 'Introductory', 'intro')).toBe(true);
        });

        test('SK1 regression: determiner says [false] and no native answer → false', () => {
            const { requests, nativeAnswers } = collectEligibilityRequests([product()]);
            const determinerResponse = [false];
            const merged = mergeNativeEligibility(determinerResponse, nativeAnswers);
            const elig = new DiscountEligibilities(requests, merged);
            expect(elig.isEligible('sub.monthly', 'Introductory', 'intro')).toBe(false);
        });

        test('Native wins when native and determiner disagree (SK2 authoritative)', () => {
            // Determiner returns true (wrongly) because receipt is empty under SK2.
            // Native correctly says the user already redeemed the intro → ineligible.
            const { requests, nativeAnswers } = collectEligibilityRequests([
                product({ introPriceEligible: false }),
            ]);
            const determinerResponse = [true]; // incorrect SK2 receipt-based default
            const merged = mergeNativeEligibility(determinerResponse, nativeAnswers);
            const elig = new DiscountEligibilities(requests, merged);
            expect(elig.isEligible('sub.monthly', 'Introductory', 'intro')).toBe(false);
        });
    });
});
