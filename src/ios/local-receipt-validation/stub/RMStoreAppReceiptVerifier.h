//
//  RMStoreAppReceiptVerifier.h
//
//  Stub: mocks out public properties and methods
//

#import <Foundation/Foundation.h>

/**
 Reference implementation of an app receipt verifier. If security is a concern you might want to avoid using a verifier whose code is open source.
 */
@interface RMStoreAppReceiptVerifier : NSObject

/**
 The value that will be used to validate the bundle identifier included in the app receipt. Given that it is possible to modify the app bundle in jailbroken devices, setting this value from a hardcoded string might provide better protection.
 @return The given value, or the app's bundle identifier by defult.
 */
@property (nonatomic, strong) NSString *bundleIdentifier;

/**
 The value that will be used to validate the bundle version included in the app receipt. Given that it is possible to modify the app bundle in jailbroken devices, setting this value from a hardcoded string might provide better protection.
 @return The given value, or the app's bundle version by defult.
 */
@property (nonatomic, strong) NSString *bundleVersion;

/**
 Verifies the app receipt by checking the integrity of the receipt, comparing its bundle identifier and bundle version to the values returned by the corresponding properties and verifying the receipt hash.
 @return YES if the receipt is verified, NO otherwise.
 @discussion If validation fails in iOS, Apple recommends to refresh the receipt and try again.
 */
- (BOOL)verifyAppReceipt;

@end
