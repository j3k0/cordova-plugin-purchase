/// ### Philosophy
///
/// The `store` API is mostly events based. As a user of this plugin,
/// you will have to register listeners to changes happening to the product
/// you defined.
///
/// The core of the listening mechanism is the `when` method. It allows you to
/// be notified of changes to one or a group of products using a query mechanism:
///
///     store.when("product").updated(refreshScreen);
///     store.when("full version").purchased(unlockApp);
///     store.when("subscription").updated(serverCheck);
///     etc.
///
/// The `updated` event is fired whenever one of the fields of a product is
/// changed (its `owned` status for instance).
/// This event provides a generic way to track the statuses of your purchases,
/// to unlock features when needed and to refresh your views accordingly.
/// 
/// ### Defining products
///
/// The store needs to know the type and identifiers of your products before you
/// can use them in your code.
/// 
/// Use [`store.registerProducts()`](#registerProducts) before your first call to
/// [`store.refresh()`](#refresh).
///
/// ### Displaying products
///
/// Right after you registered your products, nothing much is known about them
/// except their `id`, `type` and an optional `alias`.
///
/// When you perform the initial [refresh](#refresh), the store's server will
/// be contacted to retrieve informations about the registered products: human
/// readable `title` and `description`, `price`, `currency`, etc.
///
/// This isn't an optional step as some despotic store owners (like Apple) require you
/// to display information about a product as retrieved from their server: no 
/// hard-coding of price and title allowed! This is also convenient for you
/// as you can change the price of your items knowing that it'll be reflected instantly
/// on your clients' devices.
///
/// However, the information may not be available when the first view that needs
/// them appears on screen. For you, the best option is to have your view monitor
/// changes made to the product.
///
/// #### monitor your products
///
/// Let's demonstrate this with an example:
///
///     function show() {
///         render();
///         store.when("cc.fovea.test1").updated(render);
///     }
///     
///     function render() {
///         
///         // Get the product from the pool.
///         var product = store.get("cc.fovea.test1");
///
///         if (!product) {
///             $el.html("");
///         }
///         else if (product.state === store.REGISTERED) {
///             $el.html("<div class=\"loading\" />");
///         }
///         else if (product.state === store.INVALID) {
///             $el.html("");
///         }
///         else {
///             // Good! Product loaded and valid.
///             $el.html(
///                   "<div class=\"title\">"       + product.title       + "</div>"
///                 + "<div class=\"description\">" + product.description + "</div>"
///                 + "<div class=\"price\">"       + product.price       + "</div>"
///             );
///             
///             // Is this product owned? Give him a special class.
///             if (product.state === store.OWNED)
///                 $el.addClass("owned");
///             else
///                 $el.removeClass("owned");
///             
///             // Is an order for this product in progress? Can't be ordered right now?
///             if (product.canPurchase)
///                 $el.addClass("can-purchase");
///             else
///                 $el.removeClass("can-purchase");
///         }
///     }
///     
///     function hide() {
///         // stop monitoring the product
///         store.off(render);
///     }
///
/// In this example, `render` assumes nothing and redraw the whole view whatever
/// happens to the product. When the view is hidden, we stop listening to changes
/// (`store.off(render)`).
///
// #### *ask* the store for information
//
//     function show() {
//         // Fill in some HTML
//         $el.html("<div class=\"loading\" />");
//         // Update the view with loaded information.
//         store.ask("cc.fovea.test1")
//             .then(render)
//             .error(render);
//     }
//     
//     function render(product) {
//         $el.html(
//             "<div class=\"title\">" + product.title + "</div>"
//             + "<div class=\"description\">" + product.description + "</div>"
//             + "<div class=\"price\">" + product.price + "</div>"
//         );
//         if (product.owned)
//             $el.addClass("owned");
//     }
//     
//     function hide() {
//         // unregister the callback in case it didn't fire before the view is closed
//         store.off(render);
//     }
//
// `show` is called to add a purchase button on screen.
// It'll show a loading indicator till more information is available,
// then replace the loading indicator with the loaded data.
//
// `hide` does the cleanup.
//
//
/// ### Security
/// 
/// You will initiate a purchase with `store.order("product.id")`.
/// 
/// 99% of the times, the purchase will be approved immediately by billing system.
///
/// However, connection can be lost between you sending a purchase request
/// and the server answering to you. In that case, the purchase shouldn't
/// be lost (because the user paid for it), that's why the store will notify
/// you of an approved purchase during the next application startup.
/// 
/// The same can also happen if the user bought a product from another device, using his
/// same account.
/// 
/// For that reason, you should register all your features-unlocking listeners at 
/// startup, before the first call to `store.refresh()`
///

/// 
/// # <a name="store"></a>*store* object ##
/// 
/// `store` is the global object exported by the purchase plugin.
///
/// As with any other plugin, this object shouldn't be used before
/// the "deviceready" event is fired. Check cordova's documentation
/// for more details if needed.
///
var store = {};

/// ## <a name="verbosity"></a>*store.verbosity*
///
/// The `verbosity` property defines how much you want `store.js` to write on the console. Set to:
/// 
///  - `store.QUIET` or `0` to disable all logging (default)
///  - `store.ERROR` or `1` to show only error messages
///  - `store.WARNING` or `2` to show warnings and errors
///  - `store.INFO` or `3` to also show information messages
///  - `store.DEBUG` or `4` to enable internal debugging messages.
///
/// See [logging levels](#logging levels) for all possible values.
store.verbosity = 0;

// #include "constants.js"
// #include "product.js"
// #include "error.js"

// #include "registerProducts.js"
// #include "get.js"
// #include "when.js"
// #include "order.js"
// #include "ask.js"
// #include "ready.js"
// #include "off.js"

/// ## <a name="refresh"></a>*store.refresh()*
store.refresh = function() {
    store.trigger("refreshed");
};

/// ## <a name="restore"></a>*store.restore()*
/// TODO write the doc
store.restore = null;

// #include "log.js"

///
/// # internal APIs
/// USE AT YOUR OWN RISKS

// #include "products.js"
// #include "product-internal.js"
// #include "queries.js"
// #include "trigger.js"
// #include "error-callbacks.js"

