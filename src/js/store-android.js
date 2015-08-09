// #include "copyright.js"
// #include "store.js"
// #include "platforms/plugin-bridge.js"
// #include "platforms/plugin-adapter.js"
// #include "platforms/android-productdata.js"

// For some reasons, module exports failed on android...
if (window) {
    window.store = store;
    store.android = store.inappbilling;
}

module.exports = store;
