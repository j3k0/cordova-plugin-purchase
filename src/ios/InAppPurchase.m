//
//  InAppPurchase.m
//
//  Created by Matt Kane on 20/02/2011.
//  Copyright (c) Matt Kane 2011. All rights reserved.
//  Copyright (c) Jean-Christophe Hoelt 2013
//

#import "InAppPurchase.h"

// Help create NSNull objects for nil items (since neither NSArray nor NSDictionary can store nil values).
#define NILABLE(obj) ((obj) != nil ? (NSObject *)(obj) : (NSObject *)[NSNull null])

static BOOL g_debugEnabled = NO;
#define DLog(fmt, ...) { \
    if (g_debugEnabled) \
        NSLog((@"InAppPurchase[objc]: " fmt), ##__VA_ARGS__); \
}

// To avoid compilation warning, declare JSONKit and SBJson's
// category methods without including their header files.
@interface NSArray (StubsForSerializers)
- (NSString *)JSONString;
- (NSString *)JSONRepresentation;
@end

// Helper category method to choose which JSON serializer to use.
@interface NSArray (JSONSerialize)
- (NSString *)JSONSerialize;
@end

@implementation NSArray (JSONSerialize)
- (NSString *)JSONSerialize {
    return [self respondsToSelector:@selector(JSONString)] ? [self JSONString] : [self JSONRepresentation];
}
@end

@implementation InAppPurchase
@synthesize list;
@synthesize retainer;

-(void) debug: (CDVInvokedUrlCommand*)command {
    g_debugEnabled = YES;
}

-(void) setup: (CDVInvokedUrlCommand*)command {
    CDVPluginResult* pluginResult = nil;
    self.list = [[NSMutableDictionary alloc] init];
    self.retainer = [[NSMutableDictionary alloc] init];
    [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"InAppPurchase initialized"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

/**
 * Request product data for the given productIds.
 * See js for further documentation.
 */
- (void) load: (CDVInvokedUrlCommand*)command
{
	DLog(@"Getting products data");

    NSArray *inArray = [command.arguments objectAtIndex:0];

    // [self.commandDelegate runInBackground:^{
        if ((unsigned long)[inArray count] == 0) {
            DLog(@"Empty array");
            NSArray *callbackArgs = [NSArray arrayWithObjects: nil, nil, nil];
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:callbackArgs];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            return;
        }

        if (![[inArray objectAtIndex:0] isKindOfClass:[NSString class]]) {
            DLog(@"Not an array of NSString");
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Invalid arguments"];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            return;
        }
        
        NSSet *productIdentifiers = [NSSet setWithArray:inArray];
        DLog(@"Set has %li elements", (unsigned long)[productIdentifiers count]);
        for (NSString *item in productIdentifiers) {
            DLog(@" - %@", item);
        }
        SKProductsRequest *productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:productIdentifiers];

        BatchProductsRequestDelegate* delegate = [[BatchProductsRequestDelegate alloc] init];
        productsRequest.delegate = delegate;
        delegate.plugin  = self;
        delegate.command = command;

#if ARC_ENABLED
        self.retainer[@"productsRequest"] = productsRequest;
        self.retainer[@"productsRequestDelegate"] = delegate;
#else
        [delegate retain];
#endif

        DLog(@"Starting product request...");
        [productsRequest start];
        DLog(@"Product request started");
    // }];
}

- (void) purchase: (CDVInvokedUrlCommand*)command
{
	DLog(@"About to do IAP");
    id identifier = [command.arguments objectAtIndex:0];
    id quantity =   [command.arguments objectAtIndex:1];

    SKMutablePayment *payment = [SKMutablePayment paymentWithProduct:[self.list objectForKey:identifier]];
    if ([quantity respondsToSelector:@selector(integerValue)]) {
        payment.quantity = [quantity integerValue];
    }
	[[SKPaymentQueue defaultQueue] addPayment:payment];
}

- (void) restoreCompletedTransactions: (CDVInvokedUrlCommand*)command
{
    [[SKPaymentQueue defaultQueue] restoreCompletedTransactions];
}

// SKPaymentTransactionObserver methods
// called when the transaction status is updated
//
- (void)paymentQueue:(SKPaymentQueue*)queue updatedTransactions:(NSArray*)transactions
{
	NSString *state, *error, *transactionIdentifier, *transactionReceipt, *productId;
	NSInteger errorCode;

    for (SKPaymentTransaction *transaction in transactions)
    {
		error = state = transactionIdentifier = transactionReceipt = productId = @"";
		errorCode = 0;
        DLog(@"Payment transaction updated:");

        switch (transaction.transactionState)
        {
			case SKPaymentTransactionStatePurchasing:
				DLog(@"Purchasing...");
				continue;

            case SKPaymentTransactionStatePurchased:
				state = @"PaymentTransactionStatePurchased";
				transactionIdentifier = transaction.transactionIdentifier;
				// transactionReceipt = [[transaction transactionReceipt] base64EncodedString];
				productId = transaction.payment.productIdentifier;
                break;

			case SKPaymentTransactionStateFailed:
				state = @"PaymentTransactionStateFailed";
				error = transaction.error.localizedDescription;
				errorCode = transaction.error.code;
				DLog(@"Error %d %@", errorCode, error);
                break;

			case SKPaymentTransactionStateRestored:
				state = @"PaymentTransactionStateRestored";
				transactionIdentifier = transaction.originalTransaction.transactionIdentifier;
				// transactionReceipt = [[transaction transactionReceipt] base64EncodedString];
				productId = transaction.originalTransaction.payment.productIdentifier;
                break;

            default:
				DLog(@"Invalid state");
                continue;
        }
		DLog(@"State: %@", state);
        NSArray *callbackArgs = [NSArray arrayWithObjects:
                                 NILABLE(state),
                                 [NSNumber numberWithInt:errorCode],
                                 NILABLE(error),
                                 NILABLE(transactionIdentifier),
                                 NILABLE(productId),
                                 nil, // NILABLE(transactionReceipt),
                                 nil];
		NSString *js = [NSString
            stringWithFormat:@"window.storekit.updatedTransactionCallback.apply(window.storekit, %@)",
            [callbackArgs JSONSerialize]];
		DLog(@"js: %@", js);
        [self.commandDelegate evalJs:js];
		[[SKPaymentQueue defaultQueue] finishTransaction:transaction];
    }
}

- (void)paymentQueue:(SKPaymentQueue *)queue restoreCompletedTransactionsFailedWithError:(NSError *)error
{
	NSString *js = [NSString stringWithFormat:
      @"window.storekit.restoreCompletedTransactionsFailed(%d)", error.code];
    [self.commandDelegate evalJs: js];
}

- (void)paymentQueueRestoreCompletedTransactionsFinished:(SKPaymentQueue *)queue
{
    NSString *js = @"window.storekit.restoreCompletedTransactionsFinished.apply(window.storekit)";
    [self.commandDelegate evalJs: js];
}

@end

/**
 * Receives product data for multiple productIds and passes arrays of
 * js objects containing these data to a single callback method.
 */
@implementation BatchProductsRequestDelegate

@synthesize plugin, command;

- (void)productsRequest:(SKProductsRequest*)request didReceiveResponse:(SKProductsResponse*)response {

    DLog(@"productsRequest: didReceiveResponse:");
    NSMutableArray *validProducts = [NSMutableArray array];
    DLog(@"Has %li validProducts", (unsigned long)[response.products count]);
	for (SKProduct *product in response.products) {
        DLog(@" - %@: %@", product.productIdentifier, product.localizedTitle);
        [validProducts addObject:
         [NSDictionary dictionaryWithObjectsAndKeys:
          NILABLE(product.productIdentifier),    @"id",
          NILABLE(product.localizedTitle),       @"title",
          NILABLE(product.localizedDescription), @"description",
          NILABLE(product.localizedPrice),       @"price",
          nil]];
        [self.plugin.list setObject:product forKey:[NSString stringWithFormat:@"%@", product.productIdentifier]];
    }

    NSArray *callbackArgs = [NSArray arrayWithObjects:
                             NILABLE(validProducts),
                             NILABLE(response.invalidProductIdentifiers),
                             nil];

    CDVPluginResult* pluginResult =
      [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:callbackArgs];
    DLog(@"productsRequest: didReceiveResponse: sendPluginResult: %@", callbackArgs);
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
    DLog(@"In-App Store unavailable (ERROR %i)", error.code);
    DLog(@"%@", [error localizedDescription]);
}

#if ARC_DISABLED
- (void) dealloc {
	[plugin  release];
	[command release];
	[super   dealloc];
}
#endif

@end
