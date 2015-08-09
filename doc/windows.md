# Windows (Store/Phone 8.1) Configuration

## Test setup
To enable the IAP similator you will need to call the testmode function on the plugin and add the store simulator xml file with your items.
Doing this will route purchases through the simulator which will allow the user to select the outcome of the purchase (selecting success or failure types).

```
store.inappbilling.setTestMode(true); //Don't call this in production
```

Sample simmilator xml file (put this inside the `www` folder in your cordova app)
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
  </ListingInformation>
  <LicenseInformation>
    <App>
      <IsActive>true</IsActive>
      <IsTrial>false</IsTrial>
    </App>
  </LicenseInformation>
</CurrentApp>
```

## Building source on Windows

I could not get the `make build` script working on windows but to build the `store-*.js` files use the following commands
```
npm install
node_modules\.bin\preprocess src\js\store-windows.js src\js > www\store-windows.js
node_modules\.bin\preprocess src\js\store-android.js src\js > www\store-android.js
```
