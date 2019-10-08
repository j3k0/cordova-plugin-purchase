(function(){


///
/// ## Constants
///

///
/// ### product types
///
/*///*/     store.FREE_SUBSCRIPTION         = "free subscription";
/*///*/     store.PAID_SUBSCRIPTION         = "paid subscription";
/*///*/     store.NON_RENEWING_SUBSCRIPTION = "non renewing subscription";
/*///*/     store.CONSUMABLE                = "consumable";
/*///*/     store.NON_CONSUMABLE            = "non consumable";

///
/// ### error codes
///

// KEEP SYNCHRONIZED with git_modules/android_iap/v3/src/android/com/smartmobilesoftware/util/IabHelper.java
// KEEP SYNCHRONIZED with src/ios/InAppPurchase.m

var ERROR_CODES_BASE = 6777000;
/*///*/     store.ERR_SETUP               = ERROR_CODES_BASE + 1; //
/*///*/     store.ERR_LOAD                = ERROR_CODES_BASE + 2; //
/*///*/     store.ERR_PURCHASE            = ERROR_CODES_BASE + 3; //
/*///*/     store.ERR_LOAD_RECEIPTS       = ERROR_CODES_BASE + 4;
/*///*/     store.ERR_CLIENT_INVALID      = ERROR_CODES_BASE + 5;
/*///*/     store.ERR_PAYMENT_CANCELLED   = ERROR_CODES_BASE + 6; // Purchase has been cancelled by user.
/*///*/     store.ERR_PAYMENT_INVALID     = ERROR_CODES_BASE + 7; // Something suspicious about a purchase.
/*///*/     store.ERR_PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8;
/*///*/     store.ERR_UNKNOWN             = ERROR_CODES_BASE + 10; //
/*///*/     store.ERR_REFRESH_RECEIPTS    = ERROR_CODES_BASE + 11;
/*///*/     store.ERR_INVALID_PRODUCT_ID  = ERROR_CODES_BASE + 12; //
/*///*/     store.ERR_FINISH              = ERROR_CODES_BASE + 13;
/*///*/     store.ERR_COMMUNICATION       = ERROR_CODES_BASE + 14; // Error while communicating with the server.
/*///*/     store.ERR_SUBSCRIPTIONS_NOT_AVAILABLE = ERROR_CODES_BASE + 15; // Subscriptions are not available.
/*///*/     store.ERR_MISSING_TOKEN       = ERROR_CODES_BASE + 16; // Purchase information is missing token.
/*///*/     store.ERR_VERIFICATION_FAILED = ERROR_CODES_BASE + 17; // Verification of store data failed.
/*///*/     store.ERR_BAD_RESPONSE        = ERROR_CODES_BASE + 18; // Verification of store data failed.
/*///*/     store.ERR_REFRESH             = ERROR_CODES_BASE + 19; // Failed to refresh the store.
/*///*/     store.ERR_PAYMENT_EXPIRED     = ERROR_CODES_BASE + 20;
/*///*/     store.ERR_DOWNLOAD            = ERROR_CODES_BASE + 21;
/*///*/     store.ERR_SUBSCRIPTION_UPDATE_NOT_AVAILABLE = ERROR_CODES_BASE + 22;
/*///*/     store.ERR_PRODUCT_NOT_AVAILABLE = ERROR_CODES_BASE + 23; // Error code indicating that the requested product is not available in the store.
/*///*/     store.ERR_CLOUD_SERVICE_PERMISSION_DENIED = ERROR_CODES_BASE + 24; // Error code indicating that the user has not allowed access to Cloud service information.
/*///*/     store.ERR_CLOUD_SERVICE_NETWORK_CONNECTION_FAILED = ERROR_CODES_BASE + 25; // Error code indicating that the device could not connect to the network.
/*///*/     store.ERR_CLOUD_SERVICE_REVOKED = ERROR_CODES_BASE + 26; // Error code indicating that the user has revoked permission to use this cloud service.
/*///*/     store.ERR_PRIVACY_ACKNOWLEDGEMENT_REQUIRED = ERROR_CODES_BASE + 27; // Error code indicating that the user has not yet acknowledged Apple’s privacy policy for Apple Music.
/*///*/     store.ERR_UNAUTHORIZED_REQUEST_DATA = ERROR_CODES_BASE + 28; // Error code indicating that the app is attempting to use a property for which it does not have the required entitlement.
/*///*/     store.ERR_INVALID_OFFER_IDENTIFIER = ERROR_CODES_BASE + 29; // Error code indicating that the offer identifier is invalid.
/*///*/     store.ERR_INVALID_OFFER_PRICE = ERROR_CODES_BASE + 30; // Error code indicating that the price you specified in App Store Connect is no longer valid.
/*///*/     store.ERR_INVALID_SIGNATURE = ERROR_CODES_BASE + 31; // Error code indicating that the signature in a payment discount is not valid.
/*///*/     store.ERR_MISSING_OFFER_PARAMS = ERROR_CODES_BASE + 32; // Error code indicating that parameters are missing in a payment discount.

///
/// ### product states
///
/*///*/     store.REGISTERED = 'registered';
/*///*/     store.INVALID    = 'invalid';
/*///*/     store.VALID      = 'valid';
/*///*/     store.REQUESTED  = 'requested';
/*///*/     store.INITIATED  = 'initiated';
/*///*/     store.APPROVED   = 'approved';
/*///*/     store.FINISHED   = 'finished';
/*///*/     store.OWNED      = 'owned';
/*///*/     store.DOWNLOADING = 'downloading';
/*///*/     store.DOWNLOADED = 'downloaded';

///
/// ### logging levels
///
/*///*/     store.QUIET   = 0;
/*///*/     store.ERROR   = 1;
/*///*/     store.WARNING = 2;
/*///*/     store.INFO    = 3;
/*///*/     store.DEBUG   = 4;

///
/// ### validation error codes
///
/*///*/     store.INVALID_PAYLOAD   = 6778001;
/*///*/     store.CONNECTION_FAILED = 6778002;
/*///*/     store.PURCHASE_EXPIRED  = 6778003;
/*///*/     store.PURCHASE_CONSUMED = 6778004;
/*///*/     store.INTERNAL_ERROR    = 6778005;
/*///*/     store.NEED_MORE_DATA    = 6778006;

///
/// ### special purpose
///
/*///*/     store.APPLICATION = "application";

})();
