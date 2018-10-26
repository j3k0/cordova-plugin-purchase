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
    if (@available(iOS 11.2, *)) {
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
    return nil;
}

@end
