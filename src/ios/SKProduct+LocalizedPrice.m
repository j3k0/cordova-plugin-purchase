#import "SKProduct+LocalizedPrice.h"
#import "SKProductDiscount+LocalizedPrice.h"

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
#if (__IPHONE_OS_VERSION_MIN_REQUIRED >= 110200 || TARGET_OS_OSX)
    // Introductory price are supported from iOS 11.2 and macOS 10.13.2
    if (@available(iOS 11.2, macOS 10.13.2, *)) {
        if (self.introductoryPrice != nil) {
            return self.introductoryPrice.localizedPrice;
        }
    }
#endif
    return nil;
}

@end
