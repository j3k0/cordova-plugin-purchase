(function() {

var dateFields = ['expiryDate', 'purchaseDate', 'lastRenewalDate', 'renewalIntentChangeDate'];

store.Product.prototype.set = function(key, value) {
    if (typeof key === 'string') {
        if (dateFields.indexOf(key) >= 0 && !(value instanceof Date)) {
            value = new Date(value);
        }
        if (key === 'isExpired' && value === true && this.owned) {
            this.set('owned', false);
            this.set('state', store.VALID);
            this.set('expired', true);
            this.trigger('expired');
        }
        if (key === 'isExpired' && value === false && !this.owned) {
            this.set('expired', false);
            if (this.state !== store.APPROVED) {
                // user have to "finish()" to own an approved transaction
                // in other cases, we can safely set the OWNED state.
                this.set('state', store.OWNED);
            }
        }
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

var attributesStack = {};

store.Product.prototype.push = function(key, value) {
    // save attributes
    var stack = attributesStack[this.id];
    if (!stack) {
        stack = attributesStack[this.id] = [];
    }
    stack.push(JSON.stringify(this));
    // update attributes
    this.set(key, value);
};

store.Product.prototype.pop = function() {
    // restore attributes
    var stack = attributesStack[this.id];
    if (!stack) {
        return;
    }
    var json = stack.pop();
    if (!json) {
        return;
    }
    var attributes = JSON.parse(json);
    for (var key in attributes) {
        this.set(key, attributes[key]);
    }
};

store.Product.prototype.stateChanged = function() {

    // update some properties useful to the user
    // to make sense of the product state without writing
    // complex conditions.

    this.canPurchase = this.state === store.VALID;
    store.getGroup(this.group).forEach(function(otherProduct) {
        if (otherProduct.state === store.INITIATED)
            this.canPurchase = false;
    }.bind(this));
    this.loaded      = this.state && this.state !== store.REGISTERED;
    this.owned       = this.owned || this.state === store.OWNED;
    this.downloading = this.downloading || this.state === store.DOWNLOADING;
    this.downloaded  = this.downloaded || this.state === store.DOWNLOADED;
    this.deferred    = this.deferred && this.state === store.INITIATED;

    // update validity
    this.valid       = this.state !== store.INVALID;
    if (!this.state || this.state === store.REGISTERED)
        delete this.valid;

    store.log.debug("state: " + this.id + " -> " + this.state);

    if (this.state)
        this.trigger(this.state);
};

/// ### aliases to `store` methods, added for convenience.
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
