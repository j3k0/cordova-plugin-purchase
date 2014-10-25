# iOS Configuration

## Configure the App

Member center: https://developer.apple.com/membercenter/index.action

 - Create an Identifier
 - Create a Development Provisioning Profile

iTunes Connect: http://itunesconnect.apple.com

 - Create a new app (using the Identifier)
 - Create a purchase (type consumable)
 - (Add a dummy screenshot)
 - Create a test user

Device

 - Logout from iTunes from the settings
 - cordova build ios
 - open with XCode and run

### Test users and subscriptions

1 month subscriptions auto-renew every 5 minutes. So far so good.
They auto-renew 5 times and then they stop,
so after 25 minutes you will get the 21006 error.
However even when repurchasing the same subscription it will NOT auto-renew
again on the same test account since it has already auto-renewed 5 times.
So if you want to test renewal and you have been messing with these
subscriptions for a while you need to create a new itunes connect test user.
