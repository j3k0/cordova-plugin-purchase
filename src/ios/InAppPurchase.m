//
//  Created by Matt Kane on 20/02/2011.
//  Copyright (c) Matt Kane 2011. All rights reserved.
//  Copyright (c) Jean-Christophe Hoelt 2013
//

#import "InAppPurchase.h"
#import "RMAppReceipt.h"
#include <stdio.h>
#include <stdlib.h>

/*
 * Plugin state variables
 */
static BOOL g_initialized = NO;
static BOOL g_debugEnabled = NO;
static BOOL g_autoFinishEnabled = NO;

/*
 * Helpers
 */

// Help create NSNull objects for nil items (since neither NSArray nor NSDictionary can store nil values).
#define NILABLE(obj) ((obj) != nil ? (NSObject *)(obj) : (NSObject *)[NSNull null])

// Log messages to NSLog if g_debugEnabled is set
#define DLog(fmt, ...) { \
    if (g_debugEnabled) \
        NSLog((@"[CdvPurchase.AppleAppStore.objc] " fmt), ##__VA_ARGS__); \
    else if (!g_initialized) \
        NSLog((@"[CdvPurchase.AppleAppStore.objc] (before init): " fmt), ##__VA_ARGS__); \
}

#define ERROR_CODES_BASE 6777000
#define ERR_SETUP                             (ERROR_CODES_BASE + 1)
#define ERR_LOAD                              (ERROR_CODES_BASE + 2)
#define ERR_PURCHASE                          (ERROR_CODES_BASE + 3)
#define ERR_LOAD_RECEIPTS                     (ERROR_CODES_BASE + 4)

#define ERR_CLIENT_INVALID                    (ERROR_CODES_BASE + 5)
#define ERR_PAYMENT_CANCELLED                 (ERROR_CODES_BASE + 6)
#define ERR_PAYMENT_INVALID                   (ERROR_CODES_BASE + 7)
#define ERR_PAYMENT_NOT_ALLOWED               (ERROR_CODES_BASE + 8)
#define ERR_UNKNOWN                           (ERROR_CODES_BASE + 10)
#define ERR_REFRESH_RECEIPTS                  (ERROR_CODES_BASE + 11)

#define ERR_INVALID_PRODUCT_ID                (ERROR_CODES_BASE + 12)
#define ERR_FINISH                            (ERROR_CODES_BASE + 13)
#define ERR_COMMUNICATION                     (ERROR_CODES_BASE + 14) // Error while communicating with the server.
#define ERR_SUBSCRIPTIONS_NOT_AVAILABLE       (ERROR_CODES_BASE + 15) // Subscriptions are not available.
#define ERR_MISSING_TOKEN                     (ERROR_CODES_BASE + 16) // Purchase information is missing token.
#define ERR_VERIFICATION_FAILED               (ERROR_CODES_BASE + 17) // Verification of store data failed.
#define ERR_BAD_RESPONSE                      (ERROR_CODES_BASE + 18) // Verification of store data failed.
#define ERR_REFRESH                           (ERROR_CODES_BASE + 19) // Failed to refresh the store.
#define ERR_PAYMENT_EXPIRED                   (ERROR_CODES_BASE + 20)
#define ERR_DOWNLOAD                          (ERROR_CODES_BASE + 21)
#define ERR_SUBSCRIPTION_UPDATE_NOT_AVAILABLE (ERROR_CODES_BASE + 22)

#define ERR_PRODUCT_NOT_AVAILABLE             (ERROR_CODES_BASE + 23)
#define ERR_CLOUD_SERVICE_PERMISSION_DENIED   (ERROR_CODES_BASE + 24)
#define ERR_CLOUD_SERVICE_NETWORK_CONNECTION_FAILED (ERROR_CODES_BASE + 25)
#define ERR_CLOUD_SERVICE_REVOKED             (ERROR_CODES_BASE + 26)
#define ERR_PRIVACY_ACKNOWLEDGEMENT_REQUIRED  (ERROR_CODES_BASE + 27)
#define ERR_UNAUTHORIZED_REQUEST_DATA         (ERROR_CODES_BASE + 28)
#define ERR_INVALID_OFFER_IDENTIFIER          (ERROR_CODES_BASE + 29)
#define ERR_INVALID_OFFER_PRICE               (ERROR_CODES_BASE + 30)
#define ERR_INVALID_SIGNATURE                 (ERROR_CODES_BASE + 31)
#define ERR_MISSING_OFFER_PARAMS              (ERROR_CODES_BASE + 32)

static NSInteger jsErrorCode(NSInteger storeKitErrorCode) {
    switch (storeKitErrorCode) {
        case SKErrorUnknown:
            return ERR_UNKNOWN;
        case SKErrorClientInvalid:
            return ERR_CLIENT_INVALID;
        case SKErrorPaymentCancelled:
            return ERR_PAYMENT_CANCELLED;
        case SKErrorPaymentInvalid:
            return ERR_PAYMENT_INVALID;
        case SKErrorPaymentNotAllowed:
            return ERR_PAYMENT_NOT_ALLOWED;
    }
    if (@available(iOS 12.2, macOS 10.14.4, *)) {
        if (storeKitErrorCode == SKErrorPrivacyAcknowledgementRequired)
            return ERR_PRIVACY_ACKNOWLEDGEMENT_REQUIRED;
        if (storeKitErrorCode == SKErrorUnauthorizedRequestData)
            return ERR_UNAUTHORIZED_REQUEST_DATA;
        if (storeKitErrorCode == SKErrorInvalidOfferIdentifier)
            return ERR_INVALID_OFFER_IDENTIFIER;
        if (storeKitErrorCode == SKErrorInvalidOfferPrice)
            return ERR_INVALID_OFFER_PRICE;
        if (storeKitErrorCode == SKErrorInvalidSignature)
            return ERR_INVALID_SIGNATURE;
        if (storeKitErrorCode == SKErrorMissingOfferParams)
            return ERR_MISSING_OFFER_PARAMS;
    }
#if TARGET_OS_IPHONE
    if (@available(iOS 9.3, *)) {
        if (storeKitErrorCode == SKErrorCloudServicePermissionDenied)
            return ERR_CLOUD_SERVICE_PERMISSION_DENIED;
        if (storeKitErrorCode == SKErrorCloudServiceNetworkConnectionFailed)
            return ERR_CLOUD_SERVICE_NETWORK_CONNECTION_FAILED;
        if (storeKitErrorCode == SKErrorCloudServiceRevoked)
            return ERR_CLOUD_SERVICE_REVOKED;
    }
    if (@available(iOS 3.0, macOS 10.15, *)) {
        if (storeKitErrorCode == SKErrorStoreProductNotAvailable)
            return ERR_PRODUCT_NOT_AVAILABLE;
    }
#endif
    return ERR_UNKNOWN;
}

static NSString *jsErrorCodeAsString(NSInteger code) {
    switch (code) {
        case ERR_SETUP: return @"ERR_SETUP";
        case ERR_LOAD: return @"ERR_LOAD";
        case ERR_PURCHASE: return @"ERR_PURCHASE";
        case ERR_LOAD_RECEIPTS: return @"ERR_LOAD_RECEIPTS";
        case ERR_REFRESH_RECEIPTS: return @"ERR_REFRESH_RECEIPTS";
        case ERR_CLIENT_INVALID: return @"ERR_CLIENT_INVALID";
        case ERR_PAYMENT_CANCELLED: return @"ERR_PAYMENT_CANCELLED";
        case ERR_PAYMENT_INVALID: return @"ERR_PAYMENT_INVALID";
        case ERR_PAYMENT_NOT_ALLOWED: return @"ERR_PAYMENT_NOT_ALLOWED";
        case ERR_UNKNOWN: return @"ERR_UNKNOWN";
    }
    if (@available(iOS 12.2, macOS 10.14.4, *)) {
        if (code == ERR_PRIVACY_ACKNOWLEDGEMENT_REQUIRED) return @"ERR_PRIVACY_ACKNOWLEDGEMENT_REQUIRED";
        if (code == ERR_UNAUTHORIZED_REQUEST_DATA) return @"ERR_UNAUTHORIZED_REQUEST_DATA";
        if (code == ERR_INVALID_OFFER_IDENTIFIER) return @"ERR_INVALID_OFFER_IDENTIFIER";
        if (code == ERR_INVALID_OFFER_PRICE) return @"ERR_INVALID_OFFER_PRICE";
        if (code == ERR_INVALID_SIGNATURE) return @"ERR_INVALID_SIGNATURE";
        if (code == ERR_MISSING_OFFER_PARAMS) return @"ERR_MISSING_OFFER_PARAMS";
    }
#if TARGET_OS_IPHONE
    if (@available(iOS 9.3, *)) {
        if (code == ERR_CLOUD_SERVICE_PERMISSION_DENIED) return @"ERR_CLOUD_SERVICE_PERMISSION_DENIED";
        if (code == ERR_CLOUD_SERVICE_NETWORK_CONNECTION_FAILED) return @"ERR_CLOUD_SERVICE_NETWORK_CONNECTION_FAILED";
        if (code == ERR_CLOUD_SERVICE_REVOKED) return @"ERR_CLOUD_SERVICE_REVOKED";
    }
    if (@available(iOS 3.0, macOS 10.15, *)) {
        if (ERR_PRODUCT_NOT_AVAILABLE == code) return @"ERR_PRODUCT_NOT_AVAILABLE";
    }
#endif
    return @"ERR_NONE";
}

static NSString *productDiscountTypeToString(NSUInteger type) {
    if (@available(iOS 12.2, macOS 10.14.4, *)) {
        switch (type) {
            case SKProductDiscountTypeIntroductory: return @"Introductory";
            case SKProductDiscountTypeSubscription: return @"Subscription";
        }
    }
    return nil;
}

// https://developer.apple.com/documentation/storekit/skproductdiscountpaymentmode?language=objc
static NSString *productDiscountPaymentModeToString(NSUInteger mode) {
    if (@available(iOS 11.2, macOS 10.13.2, *)) {
        switch (mode) {
            case SKProductDiscountPaymentModePayAsYouGo: return @"PayAsYouGo";
            case SKProductDiscountPaymentModePayUpFront: return @"UpFront";
            case SKProductDiscountPaymentModeFreeTrial:  return @"FreeTrial";
        }
    }
    return nil;
}

static NSString *productDiscountUnitToString(NSUInteger unit) {
    if (@available(iOS 11.2, macOS 10.13.2, *)) {
        switch (unit) {
            case SKProductPeriodUnitDay:   return @"Day";
            case SKProductPeriodUnitMonth: return @"Month";
            case SKProductPeriodUnitWeek:  return @"Week";
            case SKProductPeriodUnitYear:  return @"Year";
        }
    }
    return nil;
}

// Get the currency code from the NSLocale object
static NSString *priceLocaleCurrencyCode(NSLocale *priceLocale) {
    NSNumberFormatter *numberFormatter = [[NSNumberFormatter alloc] init];
    // [numberFormatter setFormatterBehavior:NSNumberFormatterBehavior10_4];
    // [numberFormatter setNumberStyle:NSNumberFormatterCurrencyStyle];
    [numberFormatter setLocale:priceLocale];
    return [numberFormatter currencyCode];
}

static NSString *toTimestamp(NSDate *date) {
    return [NSString stringWithFormat:@"%f", [date timeIntervalSince1970] * 1000];
}

static NSString *dateToString(NSDate* date) {
    return [NSISO8601DateFormatter stringFromDate:date timeZone:[NSTimeZone systemTimeZone] formatOptions:NSISO8601DateFormatWithInternetDateTime];
}

@implementation NSArray (JSONSerialize)
- (NSString *)JSONSerialize {
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:self options:0 error:nil];
    return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}
@end

@interface NSData (Base64)
- (NSString*)convertToBase64;
@end

@implementation NSData (Base64)
- (NSString*)convertToBase64 {
    const uint8_t* input = (const uint8_t*)[self bytes];
    NSInteger length = [self length];

    static char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    NSMutableData* data = [NSMutableData dataWithLength:((length + 2) / 3) * 4];
    uint8_t* output = (uint8_t*)data.mutableBytes;

    NSInteger i;
    for (i=0; i < length; i += 3) {
        NSInteger value = 0;
        NSInteger j;
        for (j = i; j < (i + 3); j++) {
            value <<= 8;

            if (j < length) {
                value |= (0xFF & input[j]);
            }
        }

        NSInteger theIndex = (i / 3) * 4;
        output[theIndex + 0] =                    table[(value >> 18) & 0x3F];
        output[theIndex + 1] =                    table[(value >> 12) & 0x3F];
        output[theIndex + 2] = (i + 1) < length ? table[(value >> 6)  & 0x3F] : '=';
        output[theIndex + 3] = (i + 2) < length ? table[(value >> 0)  & 0x3F] : '=';
    }

    NSString *ret = [[NSString alloc] initWithData:data encoding:NSASCIIStringEncoding];
#if ARC_DISABLED
    [ret autorelease];
#endif
    return ret;
}
@end

@implementation InAppPurchase

@synthesize products;
@synthesize retainer;
@synthesize unfinishedTransactions;
@synthesize pendingTransactionUpdates;
@synthesize verifier;

// Initialize the plugin state
-(void) pluginInitialize {
    self.retainer = [[NSMutableDictionary alloc] init];
    self.products = [[NSMutableDictionary alloc] init];
    self.pendingTransactionUpdates = [[NSMutableArray alloc] init];
    self.unfinishedTransactions = [[NSMutableDictionary alloc] init];
    self.verifier = [[RMStoreAppReceiptVerifier alloc] init];
    
    [self.verifier setBundleIdentifier:[[NSBundle mainBundle].infoDictionary objectForKey:@"CFBundleIdentifier"]];
    [self.verifier setBundleVersion:[[NSBundle mainBundle].infoDictionary objectForKey:@"CFBundleShortVersionString"]];
    
    if ([SKPaymentQueue canMakePayments]) {
        [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
        NSLog(@"[CdvPurchase.AppleAppStore.objc] Initialized.");
    }
    else {
        NSLog(@"[CdvPurchase.AppleAppStore.objc] Initialization failed: payments are disabled.");
    }
}

// Reset the plugin state
-(void) onReset {
  DLog(@"WARNING: Your app should be single page to use in-app-purchases. onReset is not supported.");
}

-(void) debug: (CDVInvokedUrlCommand*)command {
    g_debugEnabled = YES;
}

-(void) autoFinish: (CDVInvokedUrlCommand*)command {
    g_autoFinishEnabled = YES;
}

-(void) setup: (CDVInvokedUrlCommand*)command {
    CDVPluginResult* pluginResult = nil;
    g_initialized = YES;

    if (![SKPaymentQueue canMakePayments]) {
        DLog(@"setup: Cant make payments, plugin disabled.");
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Can't make payments"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    else {
        DLog(@"setup: OK");
    }

    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"InAppPurchase initialized"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void) processPendingTransactions: (CDVInvokedUrlCommand*)command {
    [self processPendingTransactionUpdates];
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"processPendingTransactions"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void) manageBilling: (CDVInvokedUrlCommand*)command {
    NSURL *URL = [NSURL URLWithString:@"https://apps.apple.com/account/billing"];

#if TARGET_OS_IPHONE
    [[UIApplication sharedApplication] openURL:URL options:@{} completionHandler:nil];
#else
    [[NSWorkspace sharedWorkspace] openURL:URL];
#endif

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"manageBilling"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void) manageSubscriptions: (CDVInvokedUrlCommand*)command {
    NSURL *URL = [NSURL URLWithString:@"https://apps.apple.com/account/subscriptions"];

#if TARGET_OS_IPHONE
    [[UIApplication sharedApplication] openURL:URL options:@{} completionHandler:nil];
#else
    [[NSWorkspace sharedWorkspace] openURL:URL];
#endif

    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"manageSubscriptions"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void) presentCodeRedemptionSheet: (CDVInvokedUrlCommand*)command {
#if TARGET_OS_IPHONE
    if (@available(iOS 14.0, *)) {
        [[SKPaymentQueue defaultQueue] presentCodeRedemptionSheet];
    }
#endif
    CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"presentCodeRedemptionSheet"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

/**
 * Request product data for the given productIds.
 * See js for further documentation.
 */
- (void) load: (CDVInvokedUrlCommand*)command {

    DLog(@"load: Getting products data");
    NSArray *inArray = [command.arguments objectAtIndex:0];

    if ((unsigned long)[inArray count] == 0) {
        DLog(@"load: Empty array");
        NSArray *callbackArgs = [NSArray arrayWithObjects: [NSNull null], [NSNull null], nil];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:callbackArgs];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }

    if (![[inArray objectAtIndex:0] isKindOfClass:[NSString class]]) {
        DLog(@"load: Not an array of NSString");
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid arguments"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }

    NSSet *productIdentifiers = [NSSet setWithArray:inArray];
    DLog(@"load: Set has %li elements", (unsigned long)[productIdentifiers count]);
    for (NSString *item in productIdentifiers) {
      DLog(@"load:  - %@", item);
    }
    SKProductsRequest *productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:productIdentifiers];

    BatchProductsRequestDelegate* delegate = [[BatchProductsRequestDelegate alloc] init];
    productsRequest.delegate = delegate;
    delegate.plugin  = self;
    delegate.command = command;

#if ARC_ENABLED
    self.retainer[[NSString stringWithFormat:@"productsRequest%@", productIdentifiers]] = productsRequest;
    self.retainer[[NSString stringWithFormat:@"productsRequestDelegate%@", productIdentifiers]] = delegate;
#else
    [delegate retain];
#endif

    DLog(@"load: Starting product request...");
    [productsRequest start];
    DLog(@"load: Product request started");
}

- (NSString *) stringArgument: (id)value {
    if (value != nil && value != NSNull.null && [value isKindOfClass:[NSString class]]) {
        return value;
    }
    else {
        return nil;
    }
}

- (void) purchase: (CDVInvokedUrlCommand*)command {

    DLog(@"purchase: About to do IAP");
    id identifier = [command.arguments objectAtIndex:0];
    id quantity =   [command.arguments objectAtIndex:1];
    NSString *applicationUsername = [self stringArgument: [command.arguments objectAtIndex:2]];
    id discountArg = [command.arguments objectAtIndex:3];

    SKProduct *product = [self.products objectForKey:identifier];
    if (product == nil) {
        DLog(@"Product (%@) does not exist or is not sucessfully initialized.", identifier);
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Product does not exist."];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    SKMutablePayment *payment = [SKMutablePayment paymentWithProduct:product];
    if ([quantity respondsToSelector:@selector(integerValue)]) {
        payment.quantity = [quantity integerValue];
    }
    if (applicationUsername != nil && applicationUsername.length > 0) {
        DLog(@"purchase applicationUsername (%@).", applicationUsername);
        payment.applicationUsername = applicationUsername;
    }
    if ([discountArg isKindOfClass:[NSDictionary class]]) {
        NSDictionary *discount = (NSDictionary*)discountArg;
        if (discount[@"id"] != nil) {
            DLog(@"purchase with discount (%@, %@, %@, %@, %@).", discount[@"id"], discount[@"key"], discount[@"nonce"], discount[@"signature"], discount[@"timestamp"]);
            if (@available(iOS 12.2, macOS 10.14.4, *)) {
                DLog(@" + discounts API available");
                payment.paymentDiscount = [[SKPaymentDiscount alloc]
                initWithIdentifier: discount[@"id"]
                    keyIdentifier: discount[@"key"]
                            nonce: [[NSUUID alloc] initWithUUIDString:discount[@"nonce"]]
                        signature: discount[@"signature"]
                        timestamp: discount[@"timestamp"]];
            }
        }
    }
    [[SKPaymentQueue defaultQueue] addPayment:payment];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Payment added to queue"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

//Check if user/device is allowed to make in-app purchases
- (void) canMakePayments: (CDVInvokedUrlCommand*)command {

  CDVPluginResult* pluginResult = nil;

  if (![SKPaymentQueue canMakePayments]) {
      DLog(@"canMakePayments: Device can't make payments.");
      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Can't make payments"];
  }
  else {
      DLog(@"canMakePayments: Device can make payments.");
      pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Can make payments"];
  }

  [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) restoreCompletedTransactions: (CDVInvokedUrlCommand*)command {
    [[SKPaymentQueue defaultQueue] restoreCompletedTransactions];
}

// SKPaymentTransactionObserver methods
// called when the transaction status is updated
//
- (void) paymentQueue:(SKPaymentQueue*)queue updatedTransactions:(NSArray*)transactions {

    NSString *state, *error, *transactionIdentifier, *originalTransactionIdentifier, *transactionReceipt, *productId, *transactionDate, *discountId;
    NSInteger errorCode;

    for (SKPaymentTransaction *transaction in transactions) {

        error = state = transactionIdentifier = originalTransactionIdentifier = transactionReceipt = productId = transactionDate = discountId = @"";
        errorCode = 0;
        DLog(@"paymentQueue:updatedTransactions: %@", transaction.payment.productIdentifier);

        switch (transaction.transactionState) {

            case SKPaymentTransactionStatePurchasing:
                DLog(@"paymentQueue:updatedTransactions: Purchasing...");
                state = @"PaymentTransactionStatePurchasing";
                productId = transaction.payment.productIdentifier;
                break;

            case SKPaymentTransactionStatePurchased:
                state = @"PaymentTransactionStatePurchased";
                transactionIdentifier = transaction.transactionIdentifier;
                // Transaction receipts are deprecated since iOS 7.0, time to remove it
                // #if TARGET_OS_IPHONE
                // transactionReceipt = [[transaction transactionReceipt] base64EncodedStringWithOptions:0];
                // #endif
                productId = transaction.payment.productIdentifier;
                transactionDate = toTimestamp(transaction.transactionDate);

                if (@available(iOS 12.2, *)) {
                    if (transaction.payment.paymentDiscount != nil) {
                        discountId = transaction.payment.paymentDiscount.identifier;
                    }
                }
                if(transaction.originalTransaction != nil){
                    originalTransactionIdentifier = transaction.originalTransaction.transactionIdentifier;
                }
                break;

            case SKPaymentTransactionStateDeferred:
                DLog(@"paymentQueue:updatedTransactions: Deferred...");
                state = @"PaymentTransactionStateDeferred";
                productId = transaction.payment.productIdentifier;
                break;

            case SKPaymentTransactionStateFailed:
                state = @"PaymentTransactionStateFailed";
                error = transaction.error.localizedDescription;
                errorCode = jsErrorCode(transaction.error.code);
                productId = transaction.payment.productIdentifier;
                DLog(@"paymentQueue:updatedTransactions: Error %@ - %@", jsErrorCodeAsString(errorCode), error);

                // Finish failed transactions, when autoFinish is off
                if (!g_autoFinishEnabled) {
                    [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
                    // [self transactionFinished:transaction];
                }
                break;

            case SKPaymentTransactionStateRestored:
                state = @"PaymentTransactionStateRestored";
                transactionIdentifier = transaction.transactionIdentifier;
                if (!transactionIdentifier)
                    transactionIdentifier = transaction.originalTransaction.transactionIdentifier;
                // Transaction receipts are deprecated since iOS 7.0, time to remove it
                // #if TARGET_OS_IPHONE
                // transactionReceipt = [[transaction transactionReceipt] base64EncodedStringWithOptions:0];
                // #endif

                // TH 08/03/2016: default to transaction.payment.productIdentifier and use transaction.originalTransaction.payment.productIdentifier as a fallback.
                // Previously only used transaction.originalTransaction.payment.productIdentifier.
                // When restoring transactions when there are unfinished transactions, I encountered transactions for which originalTransaction is nil, leading to a nil productId.
                productId = transaction.payment.productIdentifier;
                if (!productId)
                    productId = transaction.originalTransaction.payment.productIdentifier;
                break;

            default:
                DLog(@"paymentQueue:updatedTransactions: Invalid state");
                continue;
        }

        DLog(@"paymentQueue:updatedTransactions: State: %@", state);
#define PT_INDEX_STATE 0
#define PT_INDEX_ERROR_CODE 1
#define PT_INDEX_ERROR 2
#define PT_INDEX_TRANSACTION_IDENTIFIER 3
#define PT_INDEX_PRODUCT_IDENTIFIER 4
#define PT_INDEX_TRANSACTION_RECEIPT 5
#define PT_INDEX_ORIGINAL_TRANSACTION_IDENTIFIER 6
#define PT_INDEX_TRANSACTION_DATE 7
#define PT_INDEX_DISCOUNT_ID 8
        NSArray *callbackArgs = [NSArray arrayWithObjects:
            NILABLE(state),
            [NSNumber numberWithInteger:errorCode],
            NILABLE(error),
            NILABLE(transactionIdentifier),
            NILABLE(productId),
            NILABLE(transactionReceipt),
            NILABLE(originalTransactionIdentifier),
            NILABLE(transactionDate),
            NILABLE(discountId),
            nil];

        if (g_initialized) {
            [self processTransactionUpdate:transaction withArgs:callbackArgs];
        }
        else {
            [pendingTransactionUpdates addObject:@[transaction,callbackArgs]];
        }
    }
}

- (void) processPendingTransactionUpdates {

    DLog(@"processPendingTransactionUpdates");
    for (NSArray *ta in pendingTransactionUpdates) {
        [self processTransactionUpdate:ta[0] withArgs:ta[1]];
    }
    [pendingTransactionUpdates removeAllObjects];

    [self.commandDelegate evalJs:@"window.storekit.lastTransactionUpdated()"];
}

- (void) processTransactionUpdate:(SKPaymentTransaction*)transaction withArgs:(NSArray*)callbackArgs {

    DLog(@"processTransactionUpdate:withArgs: transactionIdentifier=%@", callbackArgs[PT_INDEX_TRANSACTION_IDENTIFIER]);
    NSString *js = [NSString
        stringWithFormat:@"window.storekit.transactionUpdated.apply(window.storekit, %@)",
        [callbackArgs JSONSerialize]];
    [self.commandDelegate evalJs:js];

    SKPaymentTransactionState state = transaction.transactionState;
    BOOL canFinish = state == SKPaymentTransactionStateRestored
        || state == SKPaymentTransactionStateFailed
        || state == SKPaymentTransactionStatePurchased;

    if (g_autoFinishEnabled && canFinish) {
        [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
        [self transactionFinished:transaction];
    }
    else {
        [self.unfinishedTransactions setObject:transaction forKey:callbackArgs[PT_INDEX_TRANSACTION_IDENTIFIER]];
    }
}

- (void) transactionFinished: (SKPaymentTransaction*) transaction {
    DLog(@"transactionFinished: %@", transaction.transactionIdentifier);

    NSArray *callbackArgs = [NSArray arrayWithObjects:
        NILABLE(@"PaymentTransactionStateFinished"),
        [NSNumber numberWithInt:0], // Fixed to send object. The 0 was stopping the array.
        NILABLE(nil),
        NILABLE(transaction.transactionIdentifier),
        NILABLE(transaction.payment.productIdentifier),
        NILABLE(nil),
        nil];
    NSString *js = [NSString
        stringWithFormat:@"window.storekit.transactionUpdated.apply(window.storekit, %@)",
        [callbackArgs JSONSerialize]];
    [self.commandDelegate evalJs:js];
}

- (void) finishTransaction: (CDVInvokedUrlCommand*)command {

    NSString *identifier = (NSString*)[command.arguments objectAtIndex:0];
    // DLog(@"finishTransaction: %@", identifier);
    SKPaymentTransaction *transaction = nil;

    if (identifier) {
        transaction = (SKPaymentTransaction*)[self.unfinishedTransactions objectForKey:identifier];
    }

    CDVPluginResult* pluginResult;
    if (transaction) {
        DLog(@"finishTransaction: Transaction %@ finished.", identifier);
        [[SKPaymentQueue defaultQueue] finishTransaction:transaction];
        [self.unfinishedTransactions removeObjectForKey:identifier];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self transactionFinished:transaction];
    }
    else {
        // DLog(@"finishTransaction: Cannot finish transaction %@.", identifier);
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Cannot finish transaction [#CdvPurchase:100]"];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) paymentQueue:(SKPaymentQueue *)queue restoreCompletedTransactionsFailedWithError:(NSError *)error {
    DLog(@"paymentQueue:restoreCompletedTransactionsFailedWithError:");
    NSString *js = [NSString stringWithFormat:
        @"window.storekit.restoreCompletedTransactionsFailed(%li)", (unsigned long)jsErrorCode(error.code)];
    [self.commandDelegate evalJs: js];
}

- (void) paymentQueueRestoreCompletedTransactionsFinished:(SKPaymentQueue *)queue {

    DLog(@"paymentQueueRestoreCompletedTransactionsFinished:");
    NSString *js = @"window.storekit.restoreCompletedTransactionsFinished.apply(window.storekit)";
    [self.commandDelegate evalJs: js];
}

- (NSData *)appStoreReceipt {
    NSURL *receiptURL = nil;
    NSBundle *bundle = [NSBundle mainBundle];
    if ([bundle respondsToSelector:@selector(appStoreReceiptURL)]) {
#if TARGET_OS_IPHONE
        // The general best practice of weak linking using the respondsToSelector: method
        // cannot be used here. Prior to iOS 7, the method was implemented as private SPI,
        // but that implementation called the doesNotRecognizeSelector: method.
        if (floor(NSFoundationVersionNumber) > NSFoundationVersionNumber_iOS_6_1) {
            receiptURL = [bundle performSelector:@selector(appStoreReceiptURL)];
        }
#else
        receiptURL = [bundle appStoreReceiptURL];
#endif
    }

    if (receiptURL != nil) {
        NSData *receiptData = [NSData dataWithContentsOfURL:receiptURL];
#if ARC_DISABLED
        [receiptData autorelease];
#endif
        return receiptData;
    }
    else {
        return nil;
    }
}

- (void) appStoreReceipt: (CDVInvokedUrlCommand*)command {

    DLog(@"appStoreReceipt:");
    NSArray *callbackArgs = [self parseAppReceipt];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                      messageAsArray:callbackArgs];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void) appStoreRefreshReceipt: (CDVInvokedUrlCommand*)command {

    DLog(@"appStoreRefreshReceipt: Request to refresh app receipt");
    RefreshReceiptDelegate* refreshReceiptDelegate = [[RefreshReceiptDelegate alloc] init];
    SKReceiptRefreshRequest* receiptRefreshRequest = [[SKReceiptRefreshRequest alloc] init];
    receiptRefreshRequest.delegate = refreshReceiptDelegate;
    refreshReceiptDelegate.plugin  = self;
    refreshReceiptDelegate.command = command;

#if ARC_ENABLED
    self.retainer[@"receiptRefreshRequest"] = receiptRefreshRequest;
    self.retainer[@"receiptRefreshRequestDelegate"] = refreshReceiptDelegate;
#else
    [refreshReceiptDelegate retain];
#endif

    DLog(@"appStoreRefreshReceipt: Starting receipt refresh request...");
    [receiptRefreshRequest start];
    DLog(@"appStoreRefreshReceipt: Receipt refresh request started");
}

- (void) setBundleDetails: (CDVInvokedUrlCommand*)command {
    DLog(@"setBundleDetails: Setting bundle details for local app store receipt verification");
    
    NSString *bundleIdentifier = [command.arguments objectAtIndex:0];
    NSString *bundleVersion = [command.arguments objectAtIndex:1];
    
    if (![bundleIdentifier isKindOfClass:[NSString class]] || bundleIdentifier == nil || [bundleIdentifier isEqualToString:@""]
        || ![bundleVersion isKindOfClass:[NSString class]] || bundleVersion == nil || [bundleVersion isEqualToString:@""]
    ) {
        DLog(@"setBundleDetails: Not an non-empty NSString");
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid arguments"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    
    [self.verifier setBundleIdentifier:bundleIdentifier];
    [self.verifier setBundleVersion:bundleVersion];
    
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
}

- (NSArray*) parseAppReceipt {
    NSString *base64 = nil;
    NSData *receiptData = [self appStoreReceipt];
    NSDictionary* receiptPayload = nil;
    if (receiptData != nil) {
        base64 = [receiptData convertToBase64];
        RMAppReceipt* receipt = [RMAppReceipt bundleReceipt];
        if(receipt != nil){
            NSArray* _inAppPurchases = [receipt valueForKey:@"inAppPurchases"];
            NSMutableArray* inAppPurchases = [NSMutableArray new];
            for (RMAppReceiptIAP* _iap in _inAppPurchases) {
                [inAppPurchases addObject:[NSDictionary dictionaryWithObjectsAndKeys:
                   NILABLE([NSNumber numberWithInteger:_iap.quantity]), @"quantity",
                   NILABLE(_iap.productIdentifier), @"productIdentifier",
                   NILABLE(_iap.transactionIdentifier), @"transactionIdentifier",
                   NILABLE(_iap.originalTransactionIdentifier), @"originalTransactionIdentifier",
                   NILABLE(dateToString(_iap.purchaseDate)), @"purchaseDate",
                   NILABLE(dateToString(_iap.originalPurchaseDate)), @"originalPurchaseDate",
                   NILABLE(dateToString(_iap.subscriptionExpirationDate)), @"subscriptionExpirationDate",
                   NILABLE(dateToString(_iap.cancellationDate)), @"cancellationDate",
                   NILABLE([NSNumber numberWithInteger:_iap.webOrderLineItemID]), @"webOrderLineItemID",
                nil]];
            }
            
            receiptPayload = [NSDictionary dictionaryWithObjectsAndKeys:
              NILABLE(receipt.bundleIdentifier), @"bundleIdentifier",
              NILABLE(receipt.appVersion), @"appVersion",
              NILABLE(receipt.originalAppVersion), @"originalAppVersion",
              NILABLE(dateToString(receipt.expirationDate)), @"expirationDate",
              NILABLE(inAppPurchases), @"inAppPurchases",
              @([self.verifier verifyAppReceipt]), @"verified",
            nil];
        }
    }
    NSBundle *bundle = [NSBundle mainBundle];
    NSArray *callbackArgs = [NSArray arrayWithObjects:
        NILABLE(base64),
        NILABLE([bundle.infoDictionary objectForKey:@"CFBundleIdentifier"]),
        NILABLE([bundle.infoDictionary objectForKey:@"CFBundleShortVersionString"]),
        NILABLE([bundle.infoDictionary objectForKey:@"CFBundleNumericVersion"]),
        NILABLE([bundle.infoDictionary objectForKey:@"CFBundleSignature"]),
        NILABLE(receiptPayload),
        nil];
    return callbackArgs;
}
- (void) dispose {
    g_initialized = NO;
    g_debugEnabled = NO;
    g_autoFinishEnabled = NO;
    self.products = nil;
    self.unfinishedTransactions = nil;
    self.pendingTransactionUpdates = nil;
    [[SKPaymentQueue defaultQueue] removeTransactionObserver:self];
    self.retainer = nil;
    [super dispose];
}

//
// paymentQueue:shouldAddStorePayment:forProduct:
// ----------------------------------------------
// Tells the observer that a user initiated an in-app purchase from the App Store.
//
// Return true to continue the transaction in your app.
// Return false to defer or cancel the transaction.
//        If you return false, you can continue the transaction later by manually adding the SKPayment
//        payment to the SKPaymentQueue queue.
//
// Discussion:
// -----------
// This delegate method is called when the user starts an in-app purchase in the App Store, and the
// transaction continues in your app. Specifically, if your app is already installed, the method is
// called automatically.
// If your app is not yet installed when the user starts the in-app purchase in the App Store, the
// user gets a notification when the app installation is complete. This method is called when the
// user taps the notification. Otherwise, if the user opens the app manually, this method is called
// only if the app is opened soon after the purchase was started.
//
- (BOOL)paymentQueue:(SKPaymentQueue *)queue shouldAddStorePayment:(SKPayment *)payment forProduct:(SKProduct *)product {

    // Here, I though I have to check for the existance of the product in the list of known products
    // and only do the processing if it is known.
    // The problem is: this call will most likely always happen before products have been loaded.
    // Since the "fix/ios-early-observer" change, transaction update events are queued for processing
    // till JS is ready to process them, so initiating the payment in all cases shouldn't be an issue.
    //
    // Only thing is: the developper needs to be sure to handle all types of IAP defines on the AppStore.
    // Which should be OK...
    //

    // Let's check if we already loaded this product informations.
    // Since it's provided to us generously, let's store them here.
    NSString *productId = payment.productIdentifier;
    if (self.products && product && ![self.products objectForKey:productId]) {
        [self.products setObject:product forKey:[NSString stringWithFormat:@"%@", productId]];
    }

    return YES;
}

@end
/**
 * Receive refreshed app receipt
 */
@implementation RefreshReceiptDelegate

@synthesize plugin, command;

- (void) requestDidFinish:(SKRequest *)request {

    DLog(@"RefreshReceiptDelegate.requestDidFinish: Got refreshed receipt");
    NSArray *callbackArgs = [self.plugin parseAppReceipt];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                                                      messageAsArray:callbackArgs];
    DLog(@"RefreshReceiptDelegate.requestDidFinish: Send new receipt data");
    [self.plugin.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

#if ARC_ENABLED
    [self.plugin.retainer removeObjectForKey:@"receiptRefreshRequest"];
    [self.plugin.retainer removeObjectForKey:@"receiptRefreshRequestDelegate"];
#else
    [request release];
    [self    release];
#endif
}

- (NSString *)errorCodeStack:(NSError *)error {
    NSString *message = [NSString stringWithFormat:@"%@ [#%@:%ld]", [error localizedDescription], error.domain, (long)error.code];
    if (@available(iOS 14.5, *)) {
        for (NSError *underlyingError in error.underlyingErrors) {
            message = [NSString stringWithFormat:@"%@, (%@)", message, [self errorCodeStack:underlyingError]];
        }
    }
    return message;
}

- (void)request:(SKRequest *)request didFailWithError:(NSError *)error {
    DLog(@"RefreshReceiptDelegate.request didFailWithError: In-App Store unavailable (ERROR %li)", (unsigned long)error.code);
    NSString *message = [self errorCodeStack:error];
    DLog(@"RefreshReceiptDelegate.request didFailWithError: %@", message);
    CDVPluginResult* pluginResult =
    [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:message];
    [self.plugin.commandDelegate sendPluginResult:pluginResult callbackId:self.command.callbackId];
#if ARC_ENABLED
    [self.plugin.retainer removeObjectForKey:@"receiptRefreshRequest"];
    [self.plugin.retainer removeObjectForKey:@"receiptRefreshRequestDelegate"];
#else
    [request release];
    [self    release];
#endif
}

#if ARC_DISABLED
- (void) dealloc {
    [plugin  release];
    [command release];
    [super   dealloc];
}
#endif

@end

/**
 * Receives product data for multiple productIds and passes arrays of
 * js objects containing these data to a single callback method.
 */
@implementation BatchProductsRequestDelegate

@synthesize plugin, command;

- (void)productsRequest:(SKProductsRequest*)request didReceiveResponse:(SKProductsResponse*)response {

    DLog(@"BatchProductsRequestDelegate.productsRequest:didReceiveResponse:");
    NSMutableArray *validProducts = [NSMutableArray array];
    DLog(@"BatchProductsRequestDelegate.productsRequest:didReceiveResponse: Has %li validProducts", (unsigned long)[response.products count]);
    for (SKProduct *product in response.products) {
        NSString *currencyCode = priceLocaleCurrencyCode(product.priceLocale);
        NSString *countryCode = [product.priceLocale objectForKey: NSLocaleCountryCode];
        NSDecimalNumber *priceMicros = [product.price decimalNumberByMultiplyingByPowerOf10:6];

        // Introductory price fields
        NSDecimalNumber *introPriceMicros = nil;
        NSString *introPricePaymentMode = nil;
        NSNumber *introPriceNumberOfPeriods = nil;
        NSString *introPriceSubscriptionPeriod  = nil;

        // Introductory price are supported since iOS 11.2 and macOS 10.13.2
        if (@available(iOS 11.2, macOS 10.13.2, *)) {
            SKProductDiscount *introPrice = product.introductoryPrice;
            if (introPrice != nil) {
                introPriceMicros = [introPrice.price  decimalNumberByMultiplyingByPowerOf10:6];
                introPricePaymentMode = productDiscountPaymentModeToString(introPrice.paymentMode);
                introPriceNumberOfPeriods = [NSNumber numberWithUnsignedLong:
                  introPrice.numberOfPeriods * introPrice.subscriptionPeriod.numberOfUnits];
                introPriceSubscriptionPeriod = productDiscountUnitToString(introPrice.subscriptionPeriod.unit);
            }
        }

        NSMutableArray *discounts = [NSMutableArray array];
        // Subscription discounts are supported since iOS 12.2 and macOS 10.14.4
        if (@available(iOS 12.2, macOS 10.14.4, *)) {
            for (SKProductDiscount *discount in product.discounts) {
                NSNumber *numberOfPeriods = [NSNumber numberWithUnsignedLong:
                  discount.numberOfPeriods * discount.subscriptionPeriod.numberOfUnits];
                NSDecimalNumber *dPriceMicros = [discount.price decimalNumberByMultiplyingByPowerOf10:6];
                [discounts addObject:
                    [NSDictionary dictionaryWithObjectsAndKeys:
                        NILABLE(discount.identifier),                        @"id",
                        NILABLE(productDiscountTypeToString(discount.type)), @"type",
                        NILABLE(discount.localizedPrice),                    @"price",
                        NILABLE(dPriceMicros),                               @"priceMicros",
                        numberOfPeriods,                                     @"period",
                        NILABLE(productDiscountUnitToString(discount.subscriptionPeriod.unit)), @"periodUnit",
                        NILABLE(productDiscountPaymentModeToString(discount.paymentMode)),      @"paymentMode",
                        nil]];
            }
        }

        NSString *group = nil;
        if (@available(iOS 12.0, macOS 10.14, *)) {
            group = product.subscriptionGroupIdentifier;
        }

        NSNumber *billingPeriod = nil;
        NSString *billingPeriodUnit = nil;
        if (@available(iOS 11.2, macOS 10.13.2, *)) {
            billingPeriod = [NSNumber numberWithUnsignedLong:product.subscriptionPeriod.numberOfUnits];
            billingPeriodUnit = productDiscountUnitToString(product.subscriptionPeriod.unit);
        }

        DLog(@"BatchProductsRequestDelegate.productsRequest:didReceiveResponse:  - %@: %@", product.productIdentifier, product.localizedTitle);
        [validProducts addObject:
            [NSDictionary dictionaryWithObjectsAndKeys:
                NILABLE(product.productIdentifier),    @"id",
                NILABLE(product.localizedTitle),       @"title",
                NILABLE(product.localizedDescription), @"description",
                NILABLE(product.localizedPrice),       @"price",
                NILABLE(priceMicros),                  @"priceMicros",
                NILABLE(currencyCode),                 @"currency",
                NILABLE(countryCode),                  @"countryCode",
                NILABLE(product.localizedIntroPrice),  @"introPrice",
                NILABLE(introPriceMicros),             @"introPriceMicros",
                NILABLE(introPriceNumberOfPeriods),    @"introPricePeriod",
                NILABLE(introPriceSubscriptionPeriod), @"introPricePeriodUnit",
                NILABLE(introPricePaymentMode),        @"introPricePaymentMode",
                NILABLE(discounts),                    @"discounts",
                NILABLE(group),                        @"group",
                NILABLE(billingPeriod),                @"billingPeriod",
                NILABLE(billingPeriodUnit),            @"billingPeriodUnit",
                nil]];
        [self.plugin.products setObject:product forKey:[NSString stringWithFormat:@"%@", product.productIdentifier]];
    }

    NSArray *callbackArgs = [NSArray arrayWithObjects:
        NILABLE(validProducts),
        NILABLE(response.invalidProductIdentifiers),
        nil];

    CDVPluginResult* pluginResult =
        [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:callbackArgs];
    DLog(@"BatchProductsRequestDelegate.productsRequest:didReceiveResponse: sendPluginResult: %@", callbackArgs);
    [self.plugin.commandDelegate sendPluginResult:pluginResult callbackId:self.command.callbackId];

#if ARC_ENABLED
    // For some reason, the system needs to send more messages to the productsRequestDelegate after this.
    // However, it doesn't retain it which causes a crash!
    // That's why we need keep references to the productsRequest[Delegate] objects...
    // It's no big thing anyway, and it's a one time thing.
    // [self.plugin.retainer removeObjectForKey:@"productsRequest"];
    // [self.plugin.retainer removeObjectForKey:@"productsRequestDelegate"];
#else
    [request release];
    [self    release];
#endif
}

- (void)request:(SKRequest *)request didFailWithError:(NSError *)error
{
    DLog(@"BatchProductsRequestDelegate.request:didFailWithError: AppStore unavailable (ERROR %li)", (unsigned long)error.code);

    NSString *localizedDescription = [error localizedDescription];
    if (!localizedDescription)
        localizedDescription = @"AppStore unavailable";
    else
        DLog(@"BatchProductsRequestDelegate.request:didFailWithError: %@", localizedDescription);
    CDVPluginResult* pluginResult =
        [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:localizedDescription];
    [self.plugin.commandDelegate sendPluginResult:pluginResult callbackId:self.command.callbackId];
}

#if ARC_DISABLED
- (void) dealloc {
    [plugin  release];
    [command release];
    [super   dealloc];
}
#endif

@end

