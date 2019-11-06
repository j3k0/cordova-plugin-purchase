#import "SKProductDiscount+LocalizedPrice.h"

@implementation SKProductDiscount (LocalizedPrice)

- (NSString *)localizedPrice
{
    // Introductory price are supported from iOS 11.2 and macOS 10.13.2
    if (@available(iOS 11.2, macOS 10.13.2, *)) {
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
    return nil;
}

@end
