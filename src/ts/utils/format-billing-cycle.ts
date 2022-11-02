namespace CdvPurchase {
  export namespace Utils {

    export function formatBillingCycleEN(pricingPhase: PricingPhase): string {
      const duration = formatDurationEN(pricingPhase.billingPeriod);
      // format the number of cycles
      switch (pricingPhase.recurrenceMode) {
        case 'FINITE_RECURRING':
          if ((pricingPhase.billingCycles ?? 0) > 1)
            return `${pricingPhase.billingCycles}x ${formatDurationEN(pricingPhase.billingPeriod)}`;
          else
            return duration;
        case 'NON_RECURRING':
          return 'for ' + formatDurationEN(pricingPhase.billingPeriod);
        default:// INFINITE_RECURRING
          return 'every ' + formatDurationEN(pricingPhase.billingPeriod, { omitOne: true });
      }
    }
  }
}
