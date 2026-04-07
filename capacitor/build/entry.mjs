// Capacitor bridge — sets CdvPurchaseCapacitor marker and registers native plugin
export { PurchasePlugin } from '../dist/esm/index.js';

// Store runtime — executes the IIFE, creates window.CdvPurchase
import { CdvPurchase } from 'virtual:store-js';

// Re-export the full namespace
export { CdvPurchase };

// Convenience named exports
export const store = CdvPurchase.store;
export const Store = CdvPurchase.Store;
export const ProductType = CdvPurchase.ProductType;
export const Platform = CdvPurchase.Platform;
export const LogLevel = CdvPurchase.LogLevel;
export const ErrorCode = CdvPurchase.ErrorCode;
export const Logger = CdvPurchase.Logger;
export const Iaptic = CdvPurchase.Iaptic;
