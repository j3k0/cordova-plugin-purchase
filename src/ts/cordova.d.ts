declare interface Window {
    cordova: {
        platformId: string;
        plugin: { http?: any; }
        exec: (listener: (msg?: any) => void, errorCallback: (err: string) => void, context: string, fnName: string, args: any[]) => void;
    }
    // store: CDVPurchase2.Store; // cordova-plugin-purchase
    // Iaptic: CDVPurchase2;
    CDVPurchase2: CDVPurchase2;
}
