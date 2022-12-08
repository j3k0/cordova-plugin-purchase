namespace CdvPurchase {
  export namespace Utils {

    /**
     * Generate a plain english version of the billing cycle in a pricing phase.
     *
     * Example outputs:
     *
     * - "3x 1 month": for `FINITE_RECURRING`, 3 cycles, period "P1M"
     * - "for 1 year": for `NON_RECURRING`, period "P1Y"
     * - "every week": for `INFINITE_RECURRING, period "P1W"
     *
     * @example
     * Utils.formatBillingCycleEN(offer.pricingPhases[0])
     */
    export function formatBillingCycleEN(pricingPhase: PricingPhase): string {
      switch (fixedRecurrenceMode(pricingPhase)) {
        case RecurrenceMode.FINITE_RECURRING:
          return `${pricingPhase.billingCycles}x ${formatDurationEN(pricingPhase.billingPeriod)}`;
        case RecurrenceMode.NON_RECURRING:
          return 'for ' + formatDurationEN(pricingPhase.billingPeriod);
        default:// INFINITE_RECURRING
          return 'every ' + formatDurationEN(pricingPhase.billingPeriod, { omitOne: true });
      }
    }

    /**
     * FINITE_RECURRING with billingCycles=1 is like NON_RECURRING
     * FINITE_RECURRING with billingCycles=0 is like INFINITE_RECURRING
     */
    function fixedRecurrenceMode(pricingPhase: PricingPhase): RecurrenceMode | undefined {
      const cycles = pricingPhase.billingCycles ?? 0;
      if (pricingPhase.recurrenceMode === RecurrenceMode.FINITE_RECURRING) {
        if (cycles == 1) return RecurrenceMode.NON_RECURRING;
        if (cycles <= 0) return RecurrenceMode.INFINITE_RECURRING;
      }
      return pricingPhase.recurrenceMode;
    }
  }
}
