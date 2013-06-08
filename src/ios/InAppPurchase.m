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

-(void) setup: (CDVInvokedUrlCommand*)command {
    CDVPluginResult* pluginResult = nil;
    [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"InAppPurchase initialized"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

/**
 * Request product data for the productIds given in the option with
 * key "productIds". See js for further documentation.
 */
- (void) load: (CDVInvokedUrlCommand*)command
{
    NSSet *productIdentifiers = [command.arguments objectAtIndex:0];

	NSLog(@"Getting products data");
	SKProductsRequest *productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:productIdentifiers];

	BatchProductsRequestDelegate* delegate = [[[BatchProductsRequestDelegate alloc] init] retain];
	delegate.command = self;
	delegate.invoke = command;

	productsRequest.delegate = delegate;
	[productsRequest start];
}

- (void) purchase: (CDVInvokedUrlCommand*)command
{
	NSLog(@"About to do IAP");
    id identifier = [command.arguments objectAtIndex:0];
    id quantity =   [command.arguments objectAtIndex:1];

    SKMutablePayment *payment =
      [SKMutablePayment paymentWithProductIdentifier:identifier];

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

        switch (transaction.transactionState)
        {
			case SKPaymentTransactionStatePurchasing:
				continue;

            case SKPaymentTransactionStatePurchased:
				state = @"PaymentTransactionStatePurchased";
				transactionIdentifier = transaction.transactionIdentifier;
				transactionReceipt = [[transaction transactionReceipt] base64EncodedString];
				productId = transaction.payment.productIdentifier;
                break;

			case SKPaymentTransactionStateFailed:
				state = @"PaymentTransactionStateFailed";
				error = transaction.error.localizedDescription;
				errorCode = transaction.error.code;
				NSLog(@"error %d %@", errorCode, error);
                break;

			case SKPaymentTransactionStateRestored:
				state = @"PaymentTransactionStateRestored";
				transactionIdentifier = transaction.originalTransaction.transactionIdentifier;
				transactionReceipt = [[transaction transactionReceipt] base64EncodedString];
				productId = transaction.originalTransaction.payment.productIdentifier;
                break;

            default:
				NSLog(@"Invalid state");
                continue;
        }
		NSLog(@"state: %@", state);
        NSArray *callbackArgs = [NSArray arrayWithObjects:
                                 NILABLE(state),
                                 [NSNumber numberWithInt:errorCode],
                                 NILABLE(error),
                                 NILABLE(transactionIdentifier),
                                 NILABLE(productId),
                                 NILABLE(transactionReceipt),
                                 nil];
        CDVPluginResult* pluginResult = nil;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray: callbackArgs];
		NSString *js = [NSString
            stringWithFormat:@"window.storekit.updatedTransactionCallback.apply(window.storekit, %@)",
            [callbackArgs JSONSerialize]];
		NSLog(@"js: %@", js);
        [self.commandDelegate evalJs:js];
		[[SKPaymentQueue defaultQueue] finishTransaction:transaction];
    }
}

- (void)paymentQueue:(SKPaymentQueue *)queue restoreCompletedTransactionsFailedWithError:(NSError *)error
{
	/* NSString *js = [NSString stringWithFormat:
      @"window.storekit.onRestoreCompletedTransactionsFailed(%d)", error.code];
	[self writeJavascript: js]; */
}

- (void)paymentQueueRestoreCompletedTransactionsFinished:(SKPaymentQueue *)queue
{
	/* NSString *js = @"window.storekit.onRestoreCompletedTransactionsFinished()";
	[self writeJavascript: js]; */
}

@end

/**
 * Receives product data for multiple productIds and passes arrays of
 * js objects containing these data to a single callback method.
 */
@implementation BatchProductsRequestDelegate

@synthesize invoke, command;

- (void)productsRequest:(SKProductsRequest*)request didReceiveResponse:(SKProductsResponse*)response {

    NSMutableArray *validProducts = [NSMutableArray array];
	for (SKProduct *product in response.products) {
        [validProducts addObject:
         [NSDictionary dictionaryWithObjectsAndKeys:
          NILABLE(product.productIdentifier),    @"id",
          NILABLE(product.localizedTitle),       @"title",
          NILABLE(product.localizedDescription), @"description",
          NILABLE(product.localizedPrice),       @"price",
          nil]];
    }

    NSArray *callbackArgs = [NSArray arrayWithObjects:
                             NILABLE(validProducts),
                             NILABLE(response.invalidProductIdentifiers),
                             nil];

    CDVPluginResult* pluginResult =
      [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:callbackArgs];
    [command.commandDelegate sendPluginResult:pluginResult callbackId:invoke.callbackId];

	[request release];
	[self    release];
}

- (void) dealloc {
	[invoke  release];
	[command release];
	[super   dealloc];
}

@end
