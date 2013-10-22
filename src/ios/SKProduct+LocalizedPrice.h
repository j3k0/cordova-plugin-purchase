#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>

// arc / no-arc portability code
#ifndef __has_feature
# define __has_feature(x) 0
#endif

#if __has_feature(objc_arc)
# error PhoneGap-InAppPurchase-iOS is not ARC compliant yet. Please add -fno-objc-arc flag to Target > Build Phases > Compile Sources > InAppPurchase.m and SKProduct+LocalizedPrice.m
# define ARC_ENABLED 1
#else
# error Arc Disabled
# define ARC_DISABLED 1
#endif

/*
#if !defined(__clang__) || __clang_major__ < 3
# ifndef __bridge
#  define __bridge
# endif
# ifndef __bridge_retained
#  define __bridge_retained
# endif
# ifndef __bridge_transfer
#  define __bridge_transfer
# endif
# ifndef __autoreleasing
#  define __autoreleasing
# endif
# ifndef __strong
#  define __strong
# endif
# ifndef __weak
#  define __weak
# endif
# ifndef __unsafe_unretained
#  define __unsafe_unretained
# endif
#endif // __clang_major__ < 3
*/


@interface SKProduct (LocalizedPrice)

@property (nonatomic, readonly) NSString *localizedPrice;

@end
