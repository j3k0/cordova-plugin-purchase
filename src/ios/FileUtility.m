#import <sys/utsname.h>
#import "FileUtility.h"

@implementation FileUtility

/****************************************************************************************************************
 * File and folder utilities
 ****************************************************************************************************************/
#pragma mark Files & Paths

+(NSArray *) listFiles:(NSString *)path extension:(NSString *)extension
{
    NSMutableArray *files = [[NSMutableArray alloc] init];

    for (NSString *file in [[NSFileManager defaultManager] contentsOfDirectoryAtPath:path error:nil])
    {
        if (extension == nil || [[file pathExtension] isEqualToString:extension])
        {
            [files addObject:file];
        }
    }

    return files;
}

+(NSArray *) listDocs:(NSString *)extension
{
    return [FileUtility listFiles:[FileUtility getDocumentPath] extension:extension];
}

+(NSString *) getAppendDocPath:(NSString *)file
{
    return [[FileUtility getDocumentPath] stringByAppendingPathComponent:file];
}

+(NSString *) getDocumentPath
{
    return [NSHomeDirectory() stringByAppendingPathComponent:@"Documents"];
}


+(BOOL) isDocumentExist:(NSString *)file
{
    return [FileUtility isFileExist:[[FileUtility getDocumentPath] stringByAppendingPathComponent:file]];
}

+(BOOL) isFileExist:(NSString *)path
{
    return [[NSFileManager defaultManager] fileExistsAtPath:path];
}

+(BOOL) isFolderExist:(NSString *)path
{
    BOOL isDir;
    BOOL exists = [[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&isDir];
    return exists && isDir;
}

+(BOOL) copyFile:(NSString *)src dst:(NSString *)dst
{
    NSFileManager *fmanager = [NSFileManager defaultManager];
    
    //NSLog(@"Source file path: %@", src);
    //NSLog([fmanager fileExistsAtPath:src] ? @"Source file exists": @"Source file doesn't exist");
    //NSLog(@"Dest file path: %@", dst);
    
    NSAssert([fmanager fileExistsAtPath:src], @"Source file does not exist: %@", src);

    if ([fmanager fileExistsAtPath:dst] == YES)
    {
        [fmanager removeItemAtPath:dst error:nil];
    }

    return [fmanager copyItemAtPath:src toPath:dst error:nil];
}

+(BOOL) copyToDocuments:(NSString *)file
{
    return [FileUtility copyFile:file dst:[[FileUtility getDocumentPath] stringByAppendingPathComponent:[file lastPathComponent]]];
}

+(BOOL) createFolder:(NSString *)folder{
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSAssert(![fileManager fileExistsAtPath:folder], @"Cannot create folder as file/folder of the same name already exists: %@", folder);    
    return [fileManager createDirectoryAtPath:folder withIntermediateDirectories:YES attributes:nil error:nil];
}

#pragma end


@end
