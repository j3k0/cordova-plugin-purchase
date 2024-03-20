//
//  RMStoreAppReceiptVerifier.m
//
//  Stub: mocks out public properties and methods
//

#import "RMStoreAppReceiptVerifier.h"
#import "RMAppReceipt.h"

@implementation RMStoreAppReceiptVerifier


- (BOOL)verifyAppReceipt
{
    return YES;
}

#pragma mark - Properties

- (NSString*)bundleIdentifier
{
    if (!_bundleIdentifier)
    {
        return [NSBundle mainBundle].bundleIdentifier;
    }
    return _bundleIdentifier;
}

- (NSString*)bundleVersion
{
    if (!_bundleVersion)
    {
#if TARGET_OS_IPHONE
        return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleVersion"];
#else
        return [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleShortVersionString"];
#endif
    }
    return _bundleVersion;
}



@end
