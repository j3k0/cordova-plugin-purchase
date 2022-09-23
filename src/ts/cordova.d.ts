declare var cordova: {
    platformId: string;
    plugin: { http?: any; }
    exec: (listener: (msg?: any) => void, errorCallback: (err: string) => void, context: string, fnName: string, args: any[]) => void;
}

declare interface Window {
    store: CDVPurchase2.Store;
}
