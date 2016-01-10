(function() {
    "use strict";

    store.setApplicationUsername = function(username) {
        store.log.info("application username - " + username);
        window.storekit.applicationUsername = username;
    };

    store.getApplicationUsername = function() {
        return window.storekit.applicationUsername;
    };

})();
