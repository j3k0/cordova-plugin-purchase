namespace CdvPurchase {
  export namespace Utils {
    /** Returns human format name for a given platform */
    export function platformName(platform: Platform): string {
      switch (platform) {
        case Platform.APPLE_APPSTORE:
          return "App Store";
        case Platform.GOOGLE_PLAY:
          return "Google Play";
        case Platform.WINDOWS_STORE:
          return "Windows Store";
        case Platform.BRAINTREE:
          return "Braintree";
        case Platform.TEST:
          return "Test";
        default: return platform;
      }
    }
  }
}
