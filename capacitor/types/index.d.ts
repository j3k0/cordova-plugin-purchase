/// <reference path="../www/store.d.ts" />

// Native bridge
import type { PurchasePluginPlugin } from '../dist/esm/definitions';
export declare const PurchasePlugin: PurchasePluginPlugin;
export type { PurchasePluginPlugin };

// Full namespace
export declare const CdvPurchase: typeof globalThis.CdvPurchase;

// Convenience value exports
export declare const store: CdvPurchase.Store;
export declare const Store: typeof CdvPurchase.Store;
export declare const ProductType: typeof CdvPurchase.ProductType;
export declare const Platform: typeof CdvPurchase.Platform;
export declare const LogLevel: typeof CdvPurchase.LogLevel;
export declare const ErrorCode: typeof CdvPurchase.ErrorCode;
export declare const Logger: typeof CdvPurchase.Logger;
export declare const Iaptic: typeof CdvPurchase.Iaptic;

// Convenience type re-exports
export type IError = CdvPurchase.IError;
export type Product = CdvPurchase.Product;
export type Offer = CdvPurchase.Offer;
export type Transaction = CdvPurchase.Transaction;
export type Receipt = CdvPurchase.Receipt;
export type VerifiedReceipt = CdvPurchase.VerifiedReceipt;
