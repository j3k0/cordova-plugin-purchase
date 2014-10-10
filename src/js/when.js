var when = store.when = function(query, once) {
    return {
        loaded: function(cb) {
            callbacks.add(query, "loaded", cb, once);
            return this;
        },
        approved: function(cb) {
            callbacks.add(query, "approved", cb, once);
            return this;
        },
        rejected: function(cb) {
            callbacks.add(query, "rejected", cb, once);
            return this;
        },
        updated: function(cb) {
            callbacks.add(query, "updated", cb, once);
            return this;
        },
        cancelled: function(cb) {
            callbacks.add(query, "cancelled", cb, once);
            return this;
        }
    };
};

var once = store.once = function(query) {
    return store.when(query, true);
};
