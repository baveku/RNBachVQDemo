/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNCPushNotificationIOS.h>
#import <UserNotifications/UserNotifications.h>
#import <RNFirebaseLinks.h>
#import <RNFirebaseNotifications.h>
#import <React/RCTLinkingManager.h>
#import <RNFirebaseMessaging.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

#import <asl.h>
#import <React/RCTLog.h>

@import Firebase;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Tasky"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [FIRApp configure];
  [FIROptions defaultOptions].deepLinkURLScheme = @"com.tasky.xc";
  [RNFirebaseNotifications configure];
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;
  
  //LOGING
  [Fabric with:@[[Crashlytics class]]];
  //Add the following lines
  RCTSetLogThreshold(RCTLogLevelInfo);
  RCTSetLogFunction(CrashlyticsReactLogFunction);
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
  
  // Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
  {
    [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
    [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
  }
  // Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
  {
    [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  }
  // Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
  {
    [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
    [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  }
  // Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
  {
    [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
  }
  // Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
  {
    [RNCPushNotificationIOS didReceiveLocalNotification:notification];
    [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
  }
  
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<NSString *, id> *)options {
  [RCTLinkingManager application:application openURL:url options:options];
  return [[RNFirebaseLinks instance] application:application openURL:url options:options];
}
  
- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray *))restorationHandler {
  [RCTLinkingManager application:application
  continueUserActivity:userActivity
    restorationHandler:restorationHandler];
  return [[RNFirebaseLinks instance] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

RCTLogFunction CrashlyticsReactLogFunction = ^(
                                         RCTLogLevel level,
                                         __unused RCTLogSource source,
                                         NSString *fileName,
                                         NSNumber *lineNumber,
                                         NSString *message
                                         )
{
    NSString *log = RCTFormatLog([NSDate date], level, fileName, lineNumber, message);
    
    #ifdef DEBUG
        fprintf(stderr, "%s\n", log.UTF8String);
        fflush(stderr);
    #else
        CLS_LOG(@"REACT LOG: %s", log.UTF8String);
    #endif
    
    int aslLevel;
    switch(level) {
        case RCTLogLevelTrace:
            aslLevel = ASL_LEVEL_DEBUG;
            break;
        case RCTLogLevelInfo:
            aslLevel = ASL_LEVEL_NOTICE;
            break;
        case RCTLogLevelWarning:
            aslLevel = ASL_LEVEL_WARNING;
            break;
        case RCTLogLevelError:
            aslLevel = ASL_LEVEL_ERR;
            break;
        case RCTLogLevelFatal:
            aslLevel = ASL_LEVEL_CRIT;
            break;
    }
    asl_log(NULL, NULL, aslLevel, "%s", message.UTF8String);
};
  
@end
