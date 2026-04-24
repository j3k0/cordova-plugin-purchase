namespace CdvPurchase {

  /**
   * Apple AppStore adapter using StoreKit version 1
   */
  export namespace AppleAppStore {

    export type DiscountType = "Introductory" | "Subscription";

    export interface DiscountEligibilityRequest {
        productId: string;
        discountType: DiscountType;
        discountId: string;
    }

    /** @internal */
    export namespace Internal {

      export interface IDiscountEligibilities {
        isEligible(productId: string, discountType: DiscountType, discountId: string): boolean;
      }

      export class DiscountEligibilities implements IDiscountEligibilities {
        request: DiscountEligibilityRequest[];
        response: boolean[];
        constructor(request: DiscountEligibilityRequest[], response: boolean[]) {
          this.request = request;
          this.response = response;
        }
        isEligible(productId: string, discountType: DiscountType, discountId: string): boolean {
          for (let i = 0; i < this.request.length; ++i) {
            const req = this.request[i];
            if (req.productId === productId && req.discountId === discountId && req.discountType === discountType) {
              return this.response[i] ?? false;
            }
          }
          // No request for this product, let's say it's eligible.
          return true;
        }
      }

      /**
       * Build the pair of (requests, native-provided answers) for every valid product.
       *
       * The two arrays are parallel: for each request, the matching `nativeAnswers` entry
       * is either the native eligibility (from StoreKit 2's `isEligibleForIntroOffer`)
       * or `undefined` if native did not provide one (SK1 / older native plugin).
       *
       * Only Introductory requests can carry a native answer — SK2 does not answer
       * promotional offer eligibility at the adapter level.
       */
      export function collectEligibilityRequests(validProducts: Bridge.ValidProduct[]): {
        requests: DiscountEligibilityRequest[];
        nativeAnswers: (boolean | undefined)[];
      } {
        const requests: DiscountEligibilityRequest[] = [];
        const nativeAnswers: (boolean | undefined)[] = [];
        validProducts.forEach(valid => {
          valid.discounts?.forEach(discount => {
            requests.push({
              productId: valid.id,
              discountId: discount.id,
              discountType: discount.type,
            });
            nativeAnswers.push(
              discount.type === 'Introductory' ? valid.introPriceEligible : undefined
            );
          });
          if ((valid.discounts?.length ?? 0) === 0 && valid.introPrice) {
            requests.push({
              productId: valid.id,
              discountId: 'intro',
              discountType: 'Introductory',
            });
            nativeAnswers.push(valid.introPriceEligible);
          }
        });
        return { requests, nativeAnswers };
      }

      /**
       * Overlay native-provided eligibility answers on top of a determiner response.
       *
       * Native wins on conflict — it's the authoritative source for StoreKit 2.
       * Determiner response is used where native did not provide an answer (SK1
       * or older native builds).
       */
      export function mergeNativeEligibility(
        determinerResponse: boolean[],
        nativeAnswers: (boolean | undefined)[],
      ): boolean[] {
        return determinerResponse.map((r, i) =>
          nativeAnswers[i] !== undefined ? (nativeAnswers[i] as boolean) : r);
      }
    }

  }

}
