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

#ifndef __CORDOVA_4_0_0
    #import <Cordova/NSData+Base64.h>
#endif

#import "SKProduct+LocalizedPrice.h"
#import "FileUtility.h"

@interface InAppPurchase : CDVPlugin <SKPaymentTransactionObserver> {
    NSMutableDictionary *list;
    NSMutableDictionary *retainer;
    NSMutableDictionary *unfinishedTransactions;
    NSMutableDictionary *currentDownloads;
}
@property (nonatomic,retain) NSMutableDictionary *list;
@property (nonatomic,retain) NSMutableDictionary *retainer;
@property (nonatomic, retain) NSMutableDictionary *currentDownloads;
//keep a reference to the transaction observer, to make sure we have only 1 call
@property (nonatomic,assign) id <SKPaymentTransactionObserver> observer;

- (void) canMakePayments: (CDVInvokedUrlCommand*)command;

- (void) setup: (CDVInvokedUrlCommand*)command;
- (void) load: (CDVInvokedUrlCommand*)command;
- (void) purchase: (CDVInvokedUrlCommand*)command;
- (void) appStoreReceipt: (CDVInvokedUrlCommand*)command;
- (void) appStoreRefreshReceipt: (CDVInvokedUrlCommand*)command;

- (void) pause: (CDVInvokedUrlCommand*)command;
- (void) resume: (CDVInvokedUrlCommand*)command;
- (void) cancel: (CDVInvokedUrlCommand*)command;

- (void) paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions;
- (void) paymentQueue:(SKPaymentQueue *)queue restoreCompletedTransactionsFailedWithError:(NSError *)error;
- (void) paymentQueueRestoreCompletedTransactionsFinished:(SKPaymentQueue *)queue;
- (void) paymentQueue:(SKPaymentQueue *)queue updatedDownloads:(NSArray *)downloads;

- (void) debug: (CDVInvokedUrlCommand*)command;
- (void) noAutoFinish: (CDVInvokedUrlCommand*)command;
- (void) finishTransaction: (CDVInvokedUrlCommand*)command;

@end

@interface BatchProductsRequestDelegate : NSObject <SKProductsRequestDelegate> {
	InAppPurchase*        plugin;
    CDVInvokedUrlCommand* command;
}

@property (nonatomic,retain) InAppPurchase* plugin;
@property (nonatomic,retain) CDVInvokedUrlCommand* command;
@end;

@interface RefreshReceiptDelegate : NSObject <SKRequestDelegate> {
    InAppPurchase*        plugin;
    CDVInvokedUrlCommand* command;
}

@property (nonatomic,retain) InAppPurchase* plugin;
@property (nonatomic,retain) CDVInvokedUrlCommand* command;
@end
