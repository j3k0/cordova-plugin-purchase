(function() {
    "use strict";

    store.setApplicationUsername = function(username) {
        window.storekit.applicationUsername = username;
    };

    store.getApplicationUsername = function() {
        return window.storekit.applicationUsername;
    };

})();
