// #include "copyright.js"
// #include "store.js"
// #include "platforms/android-bridge.js"
// #include "platforms/android-adapter.js"

// For some reasons, module exports failed on android...
if (window) {
    window.store = store;
}

module.exports = store;
