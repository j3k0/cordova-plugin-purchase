(function() {

///
/// ## `store.developerPayload`
///
/// An optional developer-specified string to attach to new orders, to
/// provide supplemental information if required.
///
/// When it's a string, it contains the direct value to use. Example:
/// ```js
/// store.developerPayload = "some-value";
/// ```
///
/// When it's a function, the payload will be the returned value. The
/// function takes a product as argument and returns a string.
///
/// Example:
/// ```js
/// store.developerPayload = function(product) {
///   return getInternalId(product.id);
/// };
/// ```

store.developerPayload = "";

///
/// ## `store.applicationUsername`
///
/// An optional string that is uniquely associated with the
/// user's account in your app.
///
/// This value can be used for payment risk evaluation, or to link
/// a purchase with a user on a backend server.
///
/// When it's a string, it contains the direct value to use. Example:
/// ```js
/// store.applicationUsername = "user_id_1234567";
/// ```
///
/// When it's a function, the `applicationUsername` will be the returned value.
///
/// Example:
/// ```js
/// store.applicationUsername = function() {
///   return state.get(["session", "user_id"]);
/// };
/// ```
///
store.applicationUsername = "";

///
/// ## `store.getApplicationUsername()`
///
/// Evaluate and return the value from `store.applicationUsername`.
///
/// When its a string, the value is returned right away.
///
/// When its a function, the return value of the function is returned.
///
/// Example:
/// ```js
/// store.getApplicationUsername()
/// ```
///
store.getApplicationUsername = stringOrFunction('applicationUsername');

///
/// ## `store.developerName`
///
/// An optional string of developer profile name. This value can be
/// used for payment risk evaluation.
///
/// _Do not use the user account ID for this field._
///
/// Example:
/// ```js
/// store.developerName = "billing.fovea.cc";
/// ```
///
store.developerName = "";

// For internal use.
store._evaluateDeveloperPayload = stringOrFunction('developerPayload');

function stringOrFunction(key) {
    return function (product) {
        if (typeof store[key] === 'function')
            return store[key](product);
        return store[key] || "";
    };
}

})();
