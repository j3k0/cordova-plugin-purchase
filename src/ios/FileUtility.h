#import <UIKit/UIKit.h>


@interface Utility : NSObject
{
    // Static Class
}



#pragma mark Files & Paths

+(BOOL) copyToDocuments:(NSString *)file;

+(NSArray *) listDocs:(NSString *)extension;
+(NSArray *) listFiles:(NSString *)path extension:(NSString *)extension;

+(NSString *) getDocumentPath;
+(BOOL) isDocumentExist:(NSString *)file;
+(BOOL) isFileExist:(NSString *)path;
+(BOOL) isFolderExist:(NSString *)path;
+(NSString *) getAppendDocPath:(NSString *)file;
+(BOOL) createFolder:(NSString *)folder;
+(BOOL) copyFile:(NSString *)src dst:(NSString *)dst;

#pragma end



#pragma mark UIAlertView

+(UIAlertView *) showAlert:(NSString *)title
                   message:(NSString *)message
                    button:(NSString *)button;

+(UIAlertView *) showAlert:(NSString *)title
                   message:(NSString *)message
               cancelTitle:(NSString *)cancelTitle
                otherTitle:(NSString *)otherTitle
                  delegate:(id)delegate;

+(UIAlertView *) showAlert:(NSString *)title
                   message:(NSString *)message
               cancelTitle:(NSString *)cancelTitle
                otherTitle:(NSString *)otherTitle
                  delegate:(id)delegate
                       tag:(NSUInteger)tag;

#pragma end

@end
