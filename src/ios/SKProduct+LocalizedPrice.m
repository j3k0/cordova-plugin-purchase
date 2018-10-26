#import "SKProduct+LocalizedPrice.h"

@implementation SKProduct (LocalizedPrice)

- (NSString *)localizedPrice
{
    NSNumberFormatter *numberFormatter = [[NSNumberFormatter alloc] init];
    [numberFormatter setFormatterBehavior:NSNumberFormatterBehavior10_4];
    [numberFormatter setNumberStyle:NSNumberFormatterCurrencyStyle];
    [numberFormatter setLocale:self.priceLocale];
    NSString *formattedString = [numberFormatter stringFromNumber:self.price];
#if ARC_DISABLED
    [numberFormatter release];
#endif
    return formattedString;
}

- (NSString *)localizedIntroPrice
{
    // Introductory price are supported from iOS 11.2
    // We need compile-time check (making sure the XCode version supports it)
    // And a runtime check (making sure the device supports it)
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_11_2
    if ([[[UIDevice currentDevice] systemVersion] compare:@"11.2.0" options:NSNumericSearch] != NSOrderedAscending) {
        // Running on iOS 11.2.0 or higher
        SKProductDiscount *intro = self.introductoryPrice;
        if (intro != nil) {
            NSNumberFormatter *numberFormatter = [[NSNumberFormatter alloc] init];
            [numberFormatter setFormatterBehavior:NSNumberFormatterBehavior10_4];
            [numberFormatter setNumberStyle:NSNumberFormatterCurrencyStyle];
            [numberFormatter setLocale:intro.priceLocale];
            NSString *formattedString = [numberFormatter stringFromNumber:intro.price];
#if ARC_DISABLED
            [numberFormatter release];
#endif
            return formattedString;
        }
    }
#endif  // __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_11_2
    return nil;
}

@end
