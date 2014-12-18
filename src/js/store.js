/// ### Philosophy
///
/// The `store` API is mostly events based. As a user of this plugin,
/// you will have to register listeners to changes happening to the products
/// you register.
///
/// The core of the listening mechanism is the [`when()`](#when) method. It allows you to
/// be notified of changes to one or a set of products using a [`query`](#queries) mechanism:
/// ```js
///     store.when("product").updated(refreshScreen);
///     store.when("full version").owned(unlockApp);
///     store.when("subscription").approved(serverCheck);
///     etc.
/// ```
///
/// The `updated` event is fired whenever one of the fields of a product is
/// changed (its `owned` status for instance).
///
/// This event provides a generic way to track the statuses of your purchases,
/// to unlock features when needed and to refresh your views accordingly.
///
/// ### Registering products
///
/// The store needs to know the type and identifiers of your products before you
/// can use them in your code.
///
/// Use [`store.register()`](#register) before your first call to
/// [`store.refresh()`](#refresh).
///
/// Once registered, you can use [`store.get()`](#get) to retrieve
/// the [`product object`](#product) from the store.
///
/// ```js
///     store.register({
///       id: "cc.fovea.purchase.consumable1",
///       alias: "100 coins",
///       type: store.CONSUMABLE
///     });
///     ...
///     var p = store.get("100 coins");
///     // or
///     var p = store.get("cc.fovea.purchase.consumable1");
/// ```
///
/// The product `id` and `type` have to match products defined in your
/// Apple and Google developer consoles.
///
/// Learn how to do that in [HOWTO: Create New Products](https://github.com/j3k0/cordova-plugin-purchase/wiki/HOWTO#create-new-products).
///
/// ### Displaying products
///
/// Right after you registered your products, nothing much is known about them
/// except their `id`, `type` and an optional `alias`.
///
/// When you perform the initial [`refresh()`](#refresh) call, the store's server will
/// be contacted to load informations about the registered products: human
/// readable `title` and `description`, `price`, etc.
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
/// #### monitor changes
///
/// Let's demonstrate this with an example:
///
/// ```js
///     // method called when the screen showing your purchase is made visible
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
///             if (product.owned)
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
///     // method called when the view is hidden
///     function hide() {
///         // stop monitoring the product
///         store.off(render);
///     }
/// ```
///
/// In this example, `render` redraw the purchase element whatever
/// happens to the product. When the view is hidden, we stop listening to changes
/// (`store.off(render)`).
///

/// ### <a name="purchasing"></a> Purchasing
///
/// #### initiate a purchase
///
/// Purchases are initiated using the [`store.order()`](#order) method.
///
/// The store will manage the internal purchase flow that'll end:
///
///  - with an `approved` [event](#events). The product enters the `APPROVED` state.
///  - with a `cancelled` [event](#events). The product gets back to the `VALID` state.
///  - with an `error` [event](#events). The product gets back to the `VALID` state.
///
/// See [product life-cycle](#life-cycle) for details about product states.
///
/// #### finish a purchase
///
/// Once the transaction is approved, the product still isn't owned: the store needs
/// confirmation that the purchase was delivered before closing the transaction.
///
/// To confirm delivery, you'll use the [`product.finish()`](#finish) method.
///
/// #### example usage
///
/// During initialization:
/// ```js
/// store.when("extra chapter").approved(function(product) {
///     // download the feature
///     app.downloadExtraChapter().then(function() {
///         product.finish();
///     });
/// });
/// ```
///
/// When the purchase button is clicked:
/// ```js
/// store.order("full version");
/// ```
///
/// #### un-finished purchases
///
/// If your app wasn't able to deliver the content, `product.finish()` won't be called.
///
/// Don't worry: the `approved` event will be re-triggered the next time you
/// call [`store.refresh()`](#refresh), which can very well be the next time
/// the application starts. Pending transactions are persistant.
///
/// #### simple case
///
/// In the most simple case, where:
///
///  - delivery of purchases is only local ;
///  - you don't want to implement receipt validation ;
///
/// you may just want to finish all purchases automatically. You can do it this way:
/// ```js
/// store.when("product").approved(function(p) {
///     p.finish();
/// });
/// ```
///
/// NOTE: the "product" query will match any purchases (see [here](#queries) to learn more details about queries).
///
/// ### Receipt validation
///
/// Some unthoughtful users will try to use fake "purchases" to access features
/// they should normally pay for. If that's a concern, you should implement
/// receipt validation, ideally server side validation.
///
/// When a purchase has been approved by the store, it's enriched with
/// [transaction](#transactions) information (`product.transaction` attribute).
///
/// To verfify a purchase you'll have to do three things:
///
///  - configure the [validator](#validator).
///  - call [`product.verify()`](#verify) from the `approved` event,
///    before finishing the transaction.
///  - finish the transaction when transaction is `verified`.
///
/// #### example using a validation URL
///
/// ```js
/// store.validator = "http://192.168.0.7:1980/check-purchase";
///
/// store.when("my stuff").approved(function(product) {
///     product.verify();
/// });
///
/// store.when("my stuff").verified(function(product) {
///     product.finish();
/// });
/// ```
///
/// For an example using a validation callback instead, see the documentation of [the validator method](#validator).
///
/// ### Subscriptions
///
/// For subscription, you MUST implement remote [receipt validation](#receipt-validation).
///
/// If the validator returns a `store.PURCHASE_EXPIRED` error code, the subscription will
/// automatically loose its `owned` status.
///
/// Typically, you'll enable and disable access to your content this way.
/// ```js
/// store.when("cc.fovea.subcription").updated(function(product) {
///     if (product.owned)
///         app.subscriberMode();
///     else
///         app.guestMode();
/// });
/// ```

// ### Security
//
// You will initiate a purchase with `store.order("product.id")`.
//
// 99% of the times, the purchase will be approved immediately by billing system.
//
// However, connection can be lost between you sending a purchase request
// and the server answering to you. In that case, the purchase shouldn't
// be lost (because the user paid for it), that's why the store will notify
// you of an approved purchase during the next application startup.
//
// The same can also happen if the user bought a product from another device, using his
// same account.
//
// For that reason, you should register all your features-unlocking listeners at
// startup, before the first call to `store.refresh()`
//

///
/// # <a name="store"></a>*store* object ##
///
/// `store` is the global object exported by the purchase plugin.
///
/// As with any other plugin, this object shouldn't be used before
/// the "deviceready" event is fired. Check cordova's documentation
/// for more details if needed.
///
/// Find below all public attributes and methods you can use.
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
/// See the [logging levels](#logging-levels) constants.
store.verbosity = 0;

// #include "constants.js"
// #include "product.js"
// #include "error.js"

// #include "register.js"
// #include "get.js"
// #include "when.js"
// #include "once.js"
// #include "order.js"
// #include "ready.js"
// #include "off.js"
// #include "validator.js"
// #include "refresh.js"

// #include "log.js"

///
/// # internal APIs
/// USE AT YOUR OWN RISKS

// #include "products.js"
// #include "product-internal.js"
// #include "queries.js"
// #include "trigger.js"
// #include "error-callbacks.js"
// #include "utils.js"
