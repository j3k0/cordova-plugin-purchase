namespace CdvPurchase {

  export namespace Utils {

      export type PlatformID = 'ios' | 'android' | 'web';
      /** Returns an UUID v4. Uses `window.crypto` internally to generate random values. */
      export function platformId(): PlatformID {
          if (window.cordova?.platformId)
              return window.cordova?.platformId as PlatformID;
          if (window.Capacitor?.getPlatform)
              return window.Capacitor.getPlatform();
          return 'web';
      }
    }
  }
