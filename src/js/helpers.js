(function(){
"use strict";

store.helpers = {
    handleCallbackError: function(query, err) {
        store.log.warn("queries -> a callback for \'" + query + "\' failed with an exception.");
        if (typeof err === 'string')
            store.log.warn("           " + err);
        else if (err) {
            if (err.fileName)
                store.log.warn("           " + err.fileName + ":" + err.lineNumber);
            if (err.message)
                store.log.warn("           " + err.message);
            if (err.stack)
                store.log.warn("           " + err.stack);
        }
    }
};

}).call(this);
