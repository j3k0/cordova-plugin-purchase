//
//  RMAppReceipt.h
//
//  Stub: mocks out public properties and methods

#import <Foundation/Foundation.h>

/** Represents the app receipt.
 */
@interface RMAppReceipt : NSObject

/** The app’s bundle identifier. 
 
 This corresponds to the value of CFBundleIdentifier in the Info.plist file.
 */
@property (nonatomic, strong, readonly) NSString *bundleIdentifier;

/** The bundle identifier as data, as contained in the receipt. Used to verifiy the receipt's hash.
 @see verifyReceiptHash
 */
@property (nonatomic, strong, readonly) NSData *bundleIdentifierData;

/** The app’s version number. This corresponds to the value of CFBundleVersion (in iOS) or CFBundleShortVersionString (in OS X) in the Info.plist.
 */
@property (nonatomic, strong, readonly) NSString *appVersion;

/** An opaque value used as part of the SHA-1 hash.
 */
@property (nonatomic, strong, readonly) NSData *opaqueValue;

/** A SHA-1 hash, used to validate the receipt.
 */
@property (nonatomic, strong, readonly) NSData *receiptHash;

/** Array of in-app purchases contained in the receipt.
 @see RMAppReceiptIAP
 */
@property (nonatomic, strong, readonly) NSArray *inAppPurchases;

/** The version of the app that was originally purchased. This corresponds to the value of CFBundleVersion (in iOS) or CFBundleShortVersionString (in OS X) in the Info.plist file when the purchase was originally made. In the sandbox environment, the value of this field is always “1.0”.
 */
@property (nonatomic, strong, readonly) NSString *originalAppVersion;

/** The date that the app receipt expires. Only for apps purchased through the Volume Purchase Program. If nil, the receipt does not expire. When validating a receipt, compare this date to the current date to determine whether the receipt is expired. Do not try to use this date to calculate any other information, such as the time remaining before expiration.
 */
@property (nonatomic, strong, readonly) NSDate *expirationDate;


- (instancetype)init NS_UNAVAILABLE;


/**
 Returns the app receipt contained in the bundle, if any and valid. Extracts the receipt in ASN1 from the PKCS #7 container, and then parses the ASN1 data into a RMAppReceipt instance. If an Apple Root certificate is available, it will also verify that the signature of the receipt is valid.
 @return The app receipt contained in the bundle, or nil if there is no receipt or if it is invalid.
 @see refreshReceipt
 @see setAppleRootCertificateURL:
 */
+ (RMAppReceipt*)bundleReceipt;

@end

/** Represents an in-app purchase in the app receipt.
 */
@interface RMAppReceiptIAP : NSObject

/** The number of items purchased. This value corresponds to the quantity property of the SKPayment object stored in the transaction’s payment property.
 */
@property (nonatomic, readonly) NSInteger quantity;

/** The product identifier of the item that was purchased. This value corresponds to the productIdentifier property of the SKPayment object stored in the transaction’s payment property. 
 */
@property (nonatomic, strong, readonly) NSString *productIdentifier;

/**
 The transaction identifier of the item that was purchased. This value corresponds to the transaction’s transactionIdentifier property.
 */
@property (nonatomic, strong, readonly) NSString *transactionIdentifier;

/** For a transaction that restores a previous transaction, the transaction identifier of the original transaction. Otherwise, identical to the transaction identifier. 
 
 This value corresponds to the original transaction’s transactionIdentifier property. 
 
 All receipts in a chain of renewals for an auto-renewable subscription have the same value for this field.
 */
@property (nonatomic, strong, readonly) NSString *originalTransactionIdentifier;

/** The date and time that the item was purchased. This value corresponds to the transaction’s transactionDate property. 
 
 For a transaction that restores a previous transaction, the purchase date is the date of the restoration. Use `originalPurchaseDate` to get the date of the original transaction.
 
 In an auto-renewable subscription receipt, this is always the date when the subscription was purchased or renewed, regardles of whether the transaction has been restored
 */
@property (nonatomic, strong, readonly) NSDate *purchaseDate;

/** For a transaction that restores a previous transaction, the date of the original transaction.

 This value corresponds to the original transaction’s transactionDate property.
 
 In an auto-renewable subscription receipt, this indicates the beginning of the subscription period, even if the subscription has been renewed.
 */
@property (nonatomic, strong, readonly) NSDate *originalPurchaseDate;

/**
 The expiration date for the subscription. 
 
 Only present for auto-renewable subscription receipts.
 */
@property (nonatomic, strong, readonly) NSDate *subscriptionExpirationDate;

/** For a transaction that was canceled by Apple customer support, the date of the cancellation.
 */
@property (nonatomic, strong, readonly) NSDate *cancellationDate;

/** The primary key for identifying subscription purchases.
 */
@property (nonatomic, readonly) NSInteger webOrderLineItemID;

/** Returns an initialized in-app purchase from the given data.
 @param asn1Data ASN1 data
 @return An initialized in-app purchase from the given data.
 */
- (instancetype)init NS_UNAVAILABLE;


@end
