import { registerPlugin } from '@capacitor/core';
import type { PurchasePluginPlugin } from './definitions';

// Set the marker so the shared store.js knows Capacitor native bridges are available
if (typeof window !== 'undefined') {
  (window as any).CdvPurchaseCapacitor = { installed: true };
}

const PurchasePlugin = registerPlugin<PurchasePluginPlugin>('PurchasePlugin');

export { PurchasePlugin };
export type { PurchasePluginPlugin };
