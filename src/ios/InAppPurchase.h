//
//  InAppPurchase.h
//  beetight
//
//  Created by Matt Kane on 20/02/2011.
//  Copyright 2011 Matt Kane. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>

#import <Cordova/CDVPlugin.h>
#import <Cordova/NSData+Base64.h>

#import "SKProduct+LocalizedPrice.h"

@interface InAppPurchase : CDVPlugin <SKPaymentTransactionObserver> {

}

- (void) setup: (CDVInvokedUrlCommand*)command;
- (void) makePurchase: (CDVInvokedUrlCommand*)command;
- (void) requestProductData: (CDVInvokedUrlCommand*)command;
- (void) requestProductsData: (CDVInvokedUrlCommand*)command;

- (void) paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions;
- (void) paymentQueue:(SKPaymentQueue *)queue restoreCompletedTransactionsFailedWithError:(NSError *)error;
- (void) paymentQueueRestoreCompletedTransactionsFinished:(SKPaymentQueue *)queue;

@end

@interface ProductsRequestDelegate : NSObject <SKProductsRequestDelegate>{
	NSString* successCallback;
	NSString* failCallback;

	InAppPurchase* command;
}

@property (nonatomic, copy) NSString* successCallback;
@property (nonatomic, copy) NSString* failCallback;
@property (nonatomic, retain) InAppPurchase* command;

@end;

@interface BatchProductsRequestDelegate : NSObject <SKProductsRequestDelegate> {
	NSString* callback;
	InAppPurchase* command;
}

@property (nonatomic, copy) NSString* callback;
@property (nonatomic, retain) InAppPurchase* command;

@end;
