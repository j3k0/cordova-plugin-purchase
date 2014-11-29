//! # iOS Implementation
//!
//! The implementation of the unified API is a small layer
//! built on top of the legacy "PhoneGap-InAppPurchase-iOS" plugin.
//!
//! This was first decided as a temporary "get-things-done" solution.
//! However, I found this ended-up providing a nice separation of concerns:
//!
//!  - the `platforms/ios-bridge.js` file exposes an API called `storekit` that matches the
//!    iOS way of dealing with in-app purchases.
//!    - It is where the dialog with the Obj-C part happens.
//!    - It turns that into a javascript friendly API, close to the StoreKit API.
//!    - There are some specifities to it, so if eventually some users want
//!      to go for a platform specific implementation on iOS, they can!
//!  - the `platforms/ios-adapter.js` connects the iOS `storekit` API with the
//!    unified `store` API.
//!    - It makes sure products are loaded from apple servers
//!    - It reacts to product's changes of state, so that a product get's purchased
//!      when `REQUESTED`, or finished when `FINISHED` for instance.
//!

// #include "copyright.js"
// #include "store.js"
// #include "platforms/ios-bridge.js"
// #include "platforms/ios-adapter.js"

module.exports = store;
