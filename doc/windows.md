# Windows (Store/Phone 8.1) Configuration

## Test setup
To enable the IAP simulator you will need to call the testmode function on the plugin and add the store simulator xml file with your items.
Doing this will route purchases through the simulator which will allow the user to select the outcome of the purchase (selecting success or failure types).

```
//call this before store.refresh
store.sandbox = true; //Don't call this in production
```

####Sample simulator xml file.
Put this inside the `www` folder in your cordova app or in `merges\windows` for only windows platform.
```
<?xml version="1.0" encoding="utf-16" ?>
<CurrentApp>
  <ListingInformation>
    <App>
      <AppId>988b90e4-5d4d-4dea-99d0-e423e414ffbc</AppId>
      <LinkUri>http://apps.microsoft.com/webpdp/app/988b90e4-5d4d-4dea-99d0-e423e414ffbc</LinkUri>
      <CurrentMarket>en-us</CurrentMarket>
      <AgeRating>3</AgeRating>
      <MarketData xml:lang="en-us">
        <Name>CordovaApp</Name>
        <Description>CordovaApp</Description>
        <Price>0.99</Price>
        <CurrencySymbol>$</CurrencySymbol>
        <CurrencyCode>USD</CurrencyCode>
      </MarketData>
    </App>
    <Product ProductId="iap_1" ProductType="Consumable">
      <MarketData xml:lang="en-us">
        <Name>IAP product1</Name>
        <Price>0.99</Price>
        <CurrencySymbol>$</CurrencySymbol>
        <CurrencyCode>USD</CurrencyCode>
      </MarketData>
    </Product>
    <Product ProductId="durable1" ProductType="Durable">
      <MarketData xml:lang="en-us">
        <Name>Durable test (purchased)</Name>
        <Price>9.99</Price>
        <CurrencySymbol>$</CurrencySymbol>
        <CurrencyCode>USD</CurrencyCode>
      </MarketData>
    </Product>
    <Product ProductId="durable2" ProductType="Durable">
      <MarketData xml:lang="en-us">
        <Name>Durable test (not purchased)</Name>
        <Price>9.99</Price>
        <CurrencySymbol>$</CurrencySymbol>
        <CurrencyCode>USD</CurrencyCode>
      </MarketData>
    </Product>
  </ListingInformation>
  <LicenseInformation>
    <App>
      <IsActive>true</IsActive>
      <IsTrial>false</IsTrial>
    </App>
    <!-- Setting a prepurchased durable -->
    <Product ProductId="durable1">
      <IsActive>true</IsActive>
    </Product>
  </LicenseInformation>
</CurrentApp>
```

## Building source on Windows

I could not get the `make build` script working on windows but to build the `store-*.js` files use the following commands
```
npm install
node_modules\.bin\preprocess src\js\store-windows.js src\js > www\store-windows.js
node_modules\.bin\uglifyjs www\store-windows.js -b -o www\store-windows.js

node_modules\.bin\preprocess src\js\store-android.js src\js > www\store-android.js
node_modules\.bin\uglifyjs www\store-android.js -b -o www\store-android.js
```


## Using the plugin with Visual Studio tools for Cordova

After adding the plugin to the config.xml in Visual Studio. If you receive an error about a missing `BILLING_KEY` parameter.
Add the following into your config.xml

```
<vs:plugin name="cc.fovea.cordova.purchase" version="4.0.0" src="https://github.com/j3k0/cordova-plugin-purchase.git">
  <param name="BILLING_KEY" value="YOUR GOOGLE BILLING KEY HERE TO TARGET ANDROID" />
</vs:plugin>
``` 