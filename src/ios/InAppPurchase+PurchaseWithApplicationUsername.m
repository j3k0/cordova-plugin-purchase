//
//  InAppPurchase+PurchaseWithApplicationUsername.m
//  Politicks
//
//  Created by WC-Donn on 1/10/16.
//
//

#import "InAppPurchase+PurchaseWithApplicationUsername.h"

#include <stdio.h>
#include <stdlib.h>

static BOOL g_debugEnabled = NO;

#define DLog(fmt, ...) { \
if (g_debugEnabled) \
    NSLog((@"InAppPurchase[objc]: " fmt), ##__VA_ARGS__); \
}

@implementation InAppPurchase (PurchaseWithApplicationUsername)


- (void) purchase2: (CDVInvokedUrlCommand*)command
{
    DLog(@"About to do IAP 2 (Extension)");
    id identifier = [command.arguments objectAtIndex:0];
    id quantity =   [command.arguments objectAtIndex:1];
    id userName =   [command.arguments objectAtIndex:2];
    
    SKMutablePayment *payment = [SKMutablePayment paymentWithProduct:[self.list objectForKey:identifier]];
    if ([quantity respondsToSelector:@selector(integerValue)]) {
        payment.quantity = [quantity integerValue];
    }
    payment.applicationUsername = userName;
    DLog(@"Application User Name set to %@", payment.applicationUsername );
    
    [[SKPaymentQueue defaultQueue] addPayment:payment];
}

@end
