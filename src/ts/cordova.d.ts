declare interface Window {
    cordova: {
        /** Possible values: ios, android, etc. */
        platformId: string;
        plugin: { http?: any; }
        exec: (listener: ((msg?: any) => void) | undefined | null, errorCallback: ((err: string) => void) | undefined | null, context: string, fnName: string, args: any[]) => void;
    }
    // store: CdvPurchase.Store; // cordova-plugin-purchase
    // Iaptic: CdvPurchase;
    CdvPurchase: CdvPurchase;
}
