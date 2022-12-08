namespace CdvPurchase {
  export namespace Utils {

    /**
     * Format a simple ISO 8601 duration to plain English.
     *
     * This works for non-composite durations, i.e. that have a single unit with associated amount. For example: "P1Y" or "P3W".
     *
     * See https://en.wikipedia.org/wiki/ISO_8601#Durations
     *
     * This method is provided as a utility for getting simple things done quickly. In your application, you'll probably
     * need some other method that supports multiple locales.
     *
     * @param iso - Duration formatted in IS0 8601
     * @return The duration in plain english. Example: "1 year" or "3 weeks".
     */
    export function formatDurationEN(iso?: string, options?: {omitOne?: boolean}): string {
      if (!iso) return '';
      const l = iso.length;
      const n = iso.slice(1, l - 1);
      if (n === '1') {
        if (options?.omitOne) {
          return ({ 'D': 'day', 'W': 'week', 'M': 'month', 'Y': 'year', }[iso[l - 1]]) || iso[l - 1];
        }
        else {
          return ({ 'D': '1 day', 'W': '1 week', 'M': '1 month', 'Y': '1 year', }[iso[l - 1]]) || iso[l - 1];
        }
      }
      else {
        const u = ({ 'D': 'days', 'W': 'weeks', 'M': 'months', 'Y': 'years', }[iso[l - 1]]) || iso[l - 1];
        return `${n} ${u}`;
      }
    }
  }

}
