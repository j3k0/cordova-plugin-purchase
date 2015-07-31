(function() {
"use strict";

store.Product.prototype.set = function(key, value) {
    if (typeof key === 'string') {
        this[key] = value;
        if (key === 'state')
            this.stateChanged();
    }
    else {
        var options = key;
        for (key in options) {
            value = options[key];
            this.set(key, value);
        }
    }
};

store.Product.prototype.stateChanged = function() {

    // update some properties useful to the user
    // to make sense of the product state without writing
    // complex conditions.

    this.canPurchase = this.state === store.VALID;
    this.loaded      = this.state && this.state !== store.REGISTERED;
    this.owned       = this.owned || this.state === store.OWNED;
    this.downloading = this.downloading || this.state === store.DOWNLOADING;
    this.downloaded  = this.downloaded || this.state === store.DOWNLOADED;

    // update validity
    this.valid       = this.state !== store.INVALID;
    if (!this.state || this.state === store.REGISTERED)
        delete this.valid;

    if (this.state)
        this.trigger(this.state);
};

/// ### aliases to `store` methods, added for conveniance.
store.Product.prototype.on = function(event, cb) {
    store.when(this.id, event, cb);
};
store.Product.prototype.once = function(event, cb) {
    store.once(this.id, event, cb);
};
store.Product.prototype.off = function(cb) {
    store.when.unregister(cb);
};
store.Product.prototype.trigger = function(action, args) {
    store.trigger(this, action, args);
};

})();
