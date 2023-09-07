/**
 * The Cordova Purchase Plugin for Google Play.
 *
 * The plugin has methods for:
 *
 * - initializing the Google Play BillingClient,
 * - querying product details
 * - making purchases
 * - consuming purchases.
 * - handling purchase updates and errors.
 *
 * @author Jean-Christophe Hoelt - Fovea.cc
 */

package cc.fovea;

// import com.android.billingclient.api.PriceChangeConfirmationListener;
// import com.android.billingclient.api.PriceChangeFlowParams;
// import com.android.billingclient.api.ProductDetails.PricingPhases;
// import java.io.IOException;
// import java.lang.reflect.Array;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.AcknowledgePurchaseResponseListener;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClient.BillingResponseCode;
import com.android.billingclient.api.BillingClient.FeatureType;
import com.android.billingclient.api.BillingClient.ProductType;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingFlowParams.ProductDetailsParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.ConsumeResponseListener;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.ProductDetails.OneTimePurchaseOfferDetails;
import com.android.billingclient.api.ProductDetails.PricingPhase;
import com.android.billingclient.api.ProductDetails.SubscriptionOfferDetails;
import com.android.billingclient.api.ProductDetailsResponseListener;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesResponseListener;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryProductDetailsParams.Product;
import com.android.billingclient.api.QueryPurchasesParams;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Plugin implementation for Google Play.
 */
public final class PurchasePlugin
        extends CordovaPlugin
        implements PurchasesUpdatedListener,
        ConsumeResponseListener,
        AcknowledgePurchaseResponseListener {

  /** Tag used for log messages. */
  private final String mTag = "CdvPurchase";

  /**
   * Context for the last plugin call.
   *
   * <p>See execute(), callSuccess() and callError().</p>
   */
  private CallbackContext mCallbackContext;

  /** A reference to BillingClient. */
  private BillingClient mBillingClient;

  /** List of registered IN_APP product identifiers. */
  private List<String> mInAppProductIds = new ArrayList<String>();

  /**
   * Register additional IN_APP product identifiers.
   *
   * @param list - List of product identifiers to register.
   */
  private void addInAppProductIds(final List<String> list) {
    for (int i = 0; i < list.size(); ++i) {
      if (!mInAppProductIds.contains(list.get(i))) {
        mInAppProductIds.add(list.get(i));
      }
    }
  }

  /**
   * List of registered SUBS product identifiers.
   */
  private List<String> mSubsProductIds = new ArrayList<String>();

  /**
   * Register additional SUBS product identifiers.
   *
   * @param list - List of product identifiers to register.
   */
  private void addSubsProductIds(final List<String> list) {
    for (int i = 0; i < list.size(); ++i) {
        if (!mSubsProductIds.contains(list.get(i))) {
            mSubsProductIds.add(list.get(i));
        }
    }
  }

  /** List of purchases reported by the Billing library. */
  private final List<Purchase> mPurchases = new ArrayList<>();

  /** True if billing service is connected now. */
  private boolean mIsServiceConnected;

  /** Value for mBillingClientResult until BillingClient is connected. */
  public static final int BILLING_CLIENT_NOT_CONNECTED  = -1;
  /** Last response from the billing client. */
  private BillingResult mBillingClientResult = BillingResult.newBuilder()
    .setResponseCode(BILLING_CLIENT_NOT_CONNECTED).build();

  /** Last result from the billing client.
   * @return the latest BillingResult */
  private BillingResult getLastResult() {
    return mBillingClientResult;
  }

  /**
   * Last response code from the billing client.
   *
   * @return The last response code from the billing client.
   */
  private int getLastResponseCode() {
    return mBillingClientResult.getResponseCode();
  }

  /**
   * Set last result to the given code.
   *
   * @param responseCode The response code to set.
   */
  private void resetLastResult(final int responseCode) {
    mBillingClientResult = BillingResult
      .newBuilder()
      .setResponseCode(responseCode)
      .setDebugMessage("")
      .build();
  }

  /** Product details loaded from GooglePlay, indexed by product identifier. */
  private final HashMap<String, ProductDetails> mProductDetails =
    new HashMap<String, ProductDetails>();

  /** List of purchase tokens being consumed. */
  private Set<String> mTokensToBeConsumed = new HashSet<>();

  @Override
  public void initialize(
          final CordovaInterface cordova,
          final CordovaWebView webView) {
      super.initialize(cordova, webView);
      // your init code here
  }

  /**
   * Context used to send messages to the javascript side.
   *
   * @see GooglePlay.Bridge
   */
  private CallbackContext mListenerContext = null;

  /**
   * Send a message to the javascript bridge (GooglePlay.Bridge).
   *
   * @param type Message type / identifer.
   * @param data Message arguments.
   */
  private void sendToListener(final String type, final JSONObject data) {
    try {
      Log.d(mTag, "sendToListener() -> " + type);
      Log.d(mTag, "            data -> " + data.toString());
      if (mListenerContext == null) {
        return;
      }
      final JSONObject message = new JSONObject()
        .put("type", type);
      if (data != null) {
        message.put("data", data);
      }
      final PluginResult result =
        new PluginResult(PluginResult.Status.OK, message);
      result.setKeepCallback(true);
      mListenerContext.sendPluginResult(result);
    } catch (JSONException e) {
      Log.d(mTag, "sendToListener() -> Failed: " + e.getMessage());
    }
  }

  @Override
  public boolean execute(final String action,
      final JSONArray data,
      final CallbackContext callbackContext) {

    if ("setListener".equals(action)) {
      mListenerContext = callbackContext;
      sendToListener("ready", new JSONObject());
      return true;
    }

    this.mCallbackContext = callbackContext;
    // Check if the action has a handler
    Boolean isValidAction = true;

    try {
      // Action selector
      if ("init".equals(action)) {
        init();
      } else if ("getAvailableProducts".equals(action)) {
        final List<String> inAppSkus = parseStringArrayAtIndex(data, 0);
        final List<String> subsSkus = parseStringArrayAtIndex(data, 1);
        this.addInAppProductIds(inAppSkus);
        this.addSubsProductIds(subsSkus);
        getAvailableProducts(mInAppProductIds, mSubsProductIds);
      } else if ("getPurchases".equals(action)) {
        getPurchases();
      } else if ("consumePurchase".equals(action)) {
        final String purchaseToken = data.getString(0);
        consumePurchase(purchaseToken);
      } else if ("acknowledgePurchase".equals(action)) {
        final String purchaseToken = data.getString(0);
        acknowledgePurchase(purchaseToken);
      } else if ("buy".equals(action)) {
        buy(data);
      } else if ("subscribe".equals(action)) {
        subscribe(data);
      } else if ("manageSubscriptions".equals(action)) {
        Intent browserIntent = new Intent(Intent.ACTION_VIEW,
            Uri.parse("http://play.google.com/store/account/subscriptions"));
        cordova.getActivity().startActivity(browserIntent);
      } else if ("manageBilling".equals(action)) {
        Intent browserIntent = new Intent(Intent.ACTION_VIEW,
            Uri.parse("http://play.google.com/store/paymentmethods"));
        cordova.getActivity().startActivity(browserIntent);
      } else if ("launchPriceChangeConfirmationFlow".equals(action)) {
        // final String sku = data.getString(0);
        // launchPriceChangeConfirmationFlow(sku);
        Intent browserIntent = new Intent(Intent.ACTION_VIEW,
            Uri.parse("http://play.google.com/store/account/subscriptions"));
        cordova.getActivity().startActivity(browserIntent);
      } else {
        // No handler for the action
        isValidAction = false;
      }
    } catch (IllegalStateException e) {
      callError(Constants.ERR_UNKNOWN, e.getMessage());
    } catch (JSONException e) {
      callError(Constants.ERR_UNKNOWN, e.getMessage());
    }

    // Method not found
    return isValidAction;
  }

  private String getPublicKey() {
    int billingKeyFromParam =
      cordova.getActivity().getResources().getIdentifier(
          "billing_key_param",
          "string",
          cordova.getActivity().getPackageName());
    if (billingKeyFromParam > 0) {
      final String ret = cordova.getActivity().getString(billingKeyFromParam);
      if (ret.length() > 0) {
        return ret;
      }
    }

    int billingKeyIdentifier =
      cordova.getActivity().getResources().getIdentifier(
          "billing_key",
          "string",
          cordova.getActivity().getPackageName());
    return cordova.getActivity().getString(billingKeyIdentifier);
  }

  // Initialize the plugin
  private void init() {

    Log.d(mTag, "init()");


    mBillingClient = BillingClient
      .newBuilder(cordova.getActivity())
      .enablePendingPurchases()
      .setListener(this)
      .build();

    resetLastResult(BILLING_CLIENT_NOT_CONNECTED);
    startServiceConnection(() -> {
      if (getLastResponseCode() == BillingResponseCode.OK) {
        Log.d(mTag, "init() -> Success");
        callSuccess();
      } else {
        Log.d(mTag, "init() -> Failed: " + format(getLastResult()));
        callError(Constants.ERR_SETUP,
            "Setup failed. " + format(getLastResult()));
      }
    });
  }

  private void getPurchases() {
    Log.d(mTag, "getPurchases()");
    queryPurchases();
  }

  private void onQueryPurchasesFinished(
          final BillingResult result,
          final List<Purchase> purchases) {
    try {
      if (result.getResponseCode() == BillingResponseCode.OK) {
        for (Purchase p : purchases) {
          mPurchases.add(0, p);
        }
        sendToListener("setPurchases", new JSONObject()
            .put("purchases", toJSON(purchases)));
        callSuccess(toJSON(purchases));
      } else {
        callError(Constants.ERR_LOAD, "Failed to query purchases: "
            + result.getResponseCode());
      }
    } catch (Exception e) {
      Log.e(mTag, "onQueryPurchasesFinished() -> Failed: " + e.getMessage());
      callError(Constants.ERR_LOAD,
          "Failed to query purchases: " + e.getMessage());
    }
  }

  // Convert list of purchases to JSON
  private JSONArray toJSON(final List<Purchase> purchaseList) throws JSONException {
    // Convert the java list to json
    JSONArray jsonPurchaseList = new JSONArray();
    for (Purchase p : purchaseList) {
      jsonPurchaseList.put(toJSON(p));
    }
    return jsonPurchaseList;
  }

  private JSONObject toJSON(final Purchase p) throws JSONException {
    return new JSONObject(p.getOriginalJson())
      .put("productIds", new JSONArray(p.getProducts()))
      .put("orderId", p.getOrderId())
      .put("getPurchaseState", p.getPurchaseState())
      .put("developerPayload", p.getDeveloperPayload())
      .put("acknowledged", p.isAcknowledged())
      .put("autoRenewing", p.isAutoRenewing())
      .put("accountId", p.getAccountIdentifiers().getObfuscatedAccountId())
      .put("profileId", p.getAccountIdentifiers().getObfuscatedProfileId())
      .put("signature", p.getSignature())
      .put("receipt", p.getOriginalJson().toString());
  }

  BillingResult mInAppResult;
  BillingResult mSubsResult;

  /**
   * Query purchases across various use cases and deliver the result in a
   * formalized way through a listener.
   */
  public void queryPurchases() {
    Log.d(mTag, "queryPurchases()");
    executeServiceRequest(() -> {
      long time = System.currentTimeMillis();

      List<Purchase> allPurchases = new ArrayList<Purchase>();
      mInAppResult = null;
      mSubsResult = null;

      mBillingClient.queryPurchasesAsync(
        QueryPurchasesParams.newBuilder().setProductType(ProductType.INAPP).build(),
        new PurchasesResponseListener() {
          public void onQueryPurchasesResponse(BillingResult billingResult, List<Purchase> purchases) {
            mInAppResult = billingResult;
            Log.i(mTag, "queryPurchases(INAPP) -> Elapsed time: " + (System.currentTimeMillis() - time) + "ms");
            if (billingResult.getResponseCode() == BillingResponseCode.OK)
              allPurchases.addAll(purchases);
            if (mInAppResult != null && (mSubsResult != null || !areSubscriptionsSupported()))
              onQueryPurchasesFinished(mInAppResult.getResponseCode() == BillingResponseCode.OK ? mInAppResult : mSubsResult, allPurchases);
          }
        }
      );

      if (areSubscriptionsSupported()) {
        mBillingClient.queryPurchasesAsync(
          QueryPurchasesParams.newBuilder().setProductType(ProductType.SUBS).build(),
          new PurchasesResponseListener() {
            public void onQueryPurchasesResponse(BillingResult billingResult, List<Purchase> purchases) {
              mSubsResult = billingResult;
              Log.i(mTag, "queryPurchases(SUBS) -> Elapsed time: " + (System.currentTimeMillis() - time) + "ms");
              if (billingResult.getResponseCode() == BillingResponseCode.OK)
                allPurchases.addAll(purchases);
              if (mInAppResult != null && (mSubsResult != null || !areSubscriptionsSupported()))
                onQueryPurchasesFinished(mInAppResult.getResponseCode() == BillingResponseCode.OK ? mInAppResult : mSubsResult, allPurchases);
            }
          }
        );
      }
      else {
        Log.i(mTag, "queryPurchases() -> "
          + "Subscriptions are not supported, skipped.");
      }

      // Log.i(mTag, "queryPurchases() -> Elapsed time: "
          // + (System.currentTimeMillis() - time) + "ms");
      // If there are subscriptions supported, we add subscription rows as well
      // if (areSubscriptionsSupported()) {
      // PurchasesResult subscriptionResult =
      //   mBillingClient.queryPurchases(ProductType.SUBS);
      // Log.i(mTag, "queryPurchases() -> Subscriptions elapsed time: "
          // + (System.currentTimeMillis() - time) + "ms");
      // int purchasesListSize = -1;
      // if (subscriptionResult.getPurchasesList() != null) {
          // purchasesListSize = subscriptionResult.getPurchasesList().size();
      // }
      // Log.i(mTag, "queryPurchases() -> Subscriptions result code: "
          // + subscriptionResult.getResponseCode()
          // + " res: " + purchasesListSize);
      // if (subscriptionResult.getResponseCode() == BillingResponseCode.OK && subscriptionResult.getPurchasesList() != null) {
        // if purchases failed but subs succeed, better return a success anyway.
        // (so the app has something to show)
      //   result = subscriptionResult.getBillingResult();
      //   allPurchases.addAll(subscriptionResult.getPurchasesList());
      // } else {
      //   Log.e(mTag, "queryPurchases() -> "
          //   + "Error trying to query subscription purchases.");
      // }
      //   } else if (purchasesResult.getResponseCode() == BillingResponseCode.OK) {
      //     Log.i(mTag, "queryPurchases() -> "
      //         + "Subscriptions are not supported, skipped.");
      //   } else {
      //     Log.w(mTag, "queryPurchases() -> Error response code: "
      //         + purchasesResult.getResponseCode());
      //   }
      // onQueryPurchasesFinished(result, allPurchases);
    });
  }

  /**
   * Checks if subscriptions are supported for current client
   * <p>Note: This method does not automatically retry for RESULT_SERVICE_DISCONNECTED.
   * It is only used in unit tests and after queryPurchases execution, which already has
   * a retry-mechanism implemented.
   * </p>
   */
  public boolean areSubscriptionsSupported() {
    BillingResult result =
      mBillingClient.isFeatureSupported(FeatureType.SUBSCRIPTIONS);
    if (result.getResponseCode() != BillingResponseCode.OK) {
      Log.w(mTag, "areSubscriptionsSupported() -> Failed: "
          + format(result));
      return false;
    }
    return true;
  }

  private JSONObject productDetailsToJson(ProductDetails product) throws JSONException {
    JSONObject ret = new JSONObject()
      .put("productId", product.getProductId())
      .put("title", product.getTitle())
      .put("name", product.getName())
      .put("description", product.getDescription());
    if (product.getProductType().equals(ProductType.INAPP)) {
      final OneTimePurchaseOfferDetails details = product.getOneTimePurchaseOfferDetails();
      ret
        .put("product_type", "inapp")
        .put("product_format", "v11.0")
        .put("formatted_price", details.getFormattedPrice())
        .put("price_amount_micros", details.getPriceAmountMicros())
        .put("price_currency_code", details.getPriceCurrencyCode());
    }
    else if (product.getProductType().equals(ProductType.SUBS)) {
      // Subscription are now described in v12.0 product format.
      ret
        .put("product_format", "v12.0")
        .put("product_type", "subs");
      JSONArray offers = new JSONArray();
      // let's add in the array of offers.
      List<SubscriptionOfferDetails> subscriptionOfferDetailsList = product.getSubscriptionOfferDetails();
      for (SubscriptionOfferDetails details: subscriptionOfferDetailsList) {
        JSONObject offer = new JSONObject()
          .put("base_plan_id", details.getBasePlanId())
          .put("offer_id", details.getOfferId())
          .put("token", details.getOfferToken())
          .put("tags", new JSONArray(details.getOfferTags()));
        JSONArray pricingPhases = new JSONArray();
        if (details.getPricingPhases() != null) {
          for (PricingPhase pricing: details.getPricingPhases().getPricingPhaseList()) {
            JSONObject pricingPhase = new JSONObject()
              .put("billing_cycle_count", pricing.getBillingCycleCount())
              .put("billing_period", pricing.getBillingPeriod())
              .put("formatted_price", pricing.getFormattedPrice())
              .put("price_amount_micros", pricing.getPriceAmountMicros())
              .put("price_currency_code", pricing.getPriceCurrencyCode());
            if (pricing.getRecurrenceMode() == ProductDetails.RecurrenceMode.FINITE_RECURRING) {
              // The billing plan payment recurs for a fixed number of billing period set in billingCycleCount.
              pricingPhase.put("recurrence_mode", "FINITE_RECURRING");
            }
            else if (pricing.getRecurrenceMode() == ProductDetails.RecurrenceMode.INFINITE_RECURRING) {
              // The billing plan payment recurs for infinite billing periods unless cancelled.
              pricingPhase.put("recurrence_mode", "INFINITE_RECURRING");
            }
            else if (pricing.getRecurrenceMode() == ProductDetails.RecurrenceMode.NON_RECURRING) {
              // The billing plan payment is a one time charge that does not repeat.
              pricingPhase.put("recurrence_mode", "NON_RECURRING");
            }
            pricingPhases.put(pricingPhase);
          }
        }
        else {
            ret.put("product_format", "unknown");
        }
        offer.put("pricing_phases", pricingPhases);
        offers.put(offer);
      }
      ret.put("offers", offers);
    }

    // productId: string;
    // title: string;
    // name: string;
    // * billing_period: string;
    // * billing_period_unit: string;
    // description: string;
    // * formatted_price: string;
    // * price_amount_micros: string;
    // * price_currency_code: string;
    // * trial_period: string;
    // * trial_period_unit: string;
    // * freeTrialPeriod: string;
    // * introductoryPrice: string;
    // * introductoryPriceAmountMicros: string;
    // * introductoryPriceCycles: string;
    // * introductoryPricePeriod: string;
    // * subscriptionPeriod: string;
    return ret;
  }

  private void getAvailableProducts(List<String> inAppProductIds, List<String> subsProductIds) {
    Log.d(mTag, "getAvailableProducts()");
    queryAllProductDetails(inAppProductIds, subsProductIds, new ProductDetailsResponseListener() {
      @Override
        public void onProductDetailsResponse(
            final BillingResult result,
            final List<ProductDetails> productDetailsList) {
          if (result.getResponseCode() != BillingResponseCode.OK) {
            Log.d(mTag, "getAvailableProducts() -> Failed: " + format(result));
            callError(Constants.ERR_LOAD, "Failed to load Products, code: "
                + result.getResponseCode());
            return;
          }
          JSONArray jsonProductList = new JSONArray();
          try {
            for (ProductDetails product : productDetailsList) {
              Log.d(mTag, "getAvailableProducts() -> productDetails: " + product.toString());
              jsonProductList.put(productDetailsToJson(product));
            }
            Log.d(mTag, "getAvailableProducts() -> Success");
            callSuccess(jsonProductList);
          } catch (JSONException e) {
            Log.d(mTag, "getAvailableProducts() -> Failed: " + e.getMessage());
            callError(Constants.ERR_LOAD, e.getMessage());
          }
        }
    });
  }

  private Purchase findPurchaseByToken(final String purchaseToken) {
    for (Purchase p : mPurchases) {
      if (p.getPurchaseToken().equals(purchaseToken))
        return p;
    }
    return null;
  }

  private Purchase findPurchaseByProductId(final String productId) {
    for (Purchase p : mPurchases) {
      if (p.getSkus().contains(productId))
        return p;
    }
    return null;
  }

  /** Implements PurchasesUpdatedListener.
   *
   * @param result Purchase result
   * @param purchases Array of purchases
   */
  @Override
  public void onPurchasesUpdated(
      final BillingResult result,
      final List<Purchase> purchases) {
    try {
      final int code = result.getResponseCode();
      if (code == BillingResponseCode.OK && purchases != null && purchases.size() > 0) {
        Log.d(mTag, "onPurchasesUpdated() -> Success");
        for (Purchase p : purchases) {
          mPurchases.add(0, p);
        }
        callSuccess();
        sendToListener("purchasesUpdated", new JSONObject()
            .put("purchases", toJSON(purchases)));
      }
      else if (code == BillingResponseCode.USER_CANCELED) {
        Log.w(mTag, "onPurchasesUpdated() -> "
            + "Cancelled: " + format(result));
        callError(Constants.ERR_CANCELLED, codeToString(code));
      }
      else {
        Log.w(mTag, "onPurchasesUpdated() -> "
            + "Failed: " + format(result));
        callError(Constants.ERR_PURCHASE, codeToString(code));
      }
    } catch (JSONException e) {
      Log.w(mTag, "onPurchasesUpdated() -> JSONException "
          + e.getMessage());
      callError(Constants.ERR_PURCHASE, e.getMessage());
    }
  }

  private String codeToString(int code) {
    switch (code) {
      case BillingResponseCode.BILLING_UNAVAILABLE:
        return "BILLING_UNAVAILABLE"; // Billing API version is not supported for the type requested
      case BillingResponseCode.DEVELOPER_ERROR:
        return "DEVELOPER_ERROR"; // Invalid arguments provided to the API.
      case BillingResponseCode.ERROR:
        return "ERROR"; // Fatal error during the API action
      case BillingResponseCode.FEATURE_NOT_SUPPORTED:
        return "FEATURE_NOT_SUPPORTED"; // Requested feature is not supported by Play Store on the current device.
      case BillingResponseCode.ITEM_ALREADY_OWNED:
        return "ITEM_ALREADY_OWNED"; // Failure to purchase since item is already owned
      case BillingResponseCode.ITEM_NOT_OWNED:
        return "ITEM_NOT_OWNED"; // Failure to consume since item is not owned
      case BillingResponseCode.ITEM_UNAVAILABLE:
        return "ITEM_UNAVAILABLE"; // Requested product is not available for purchase
      case BillingResponseCode.OK:
        return "OK"; // Success
      case BillingResponseCode.SERVICE_DISCONNECTED:
        return "SERVICE_DISCONNECTED"; // Play Store service is not connected now - potentially transient state.
      case BillingResponseCode.SERVICE_TIMEOUT:
        return "SERVICE_TIMEOUT"; // The request has reached the maximum timeout before Google Play responds.
      case BillingResponseCode.SERVICE_UNAVAILABLE:
        return "SERVICE_UNAVAILABLE"; // Network connection is down
      case BillingResponseCode.USER_CANCELED:
        return "USER_CANCELED"; // User pressed back or canceled a dialog
      default:
        return "CODE_" + code;
    }
  }

  private String codeToMessage(int code) {
    switch (code) {
      case BillingResponseCode.BILLING_UNAVAILABLE:
        return "Billing API version is not supported for the type requested";
      case BillingResponseCode.DEVELOPER_ERROR:
        return "Invalid arguments provided to the API";
      case BillingResponseCode.ERROR:
        return "Fatal error during the API action";
      case BillingResponseCode.FEATURE_NOT_SUPPORTED:
        return "Requested feature is not supported by Play Store on the current device";
      case BillingResponseCode.ITEM_ALREADY_OWNED:
        return "Failure to purchase since item is already owned";
      case BillingResponseCode.ITEM_NOT_OWNED:
        return "Failure to consume since item is not owned";
      case BillingResponseCode.ITEM_UNAVAILABLE:
        return "Requested product is not available for purchase";
      case BillingResponseCode.OK:
        return "Success";
      case BillingResponseCode.SERVICE_DISCONNECTED:
        return "Play Store service is not connected now - potentially transient state";
      case BillingResponseCode.SERVICE_TIMEOUT:
        return "The request has reached the maximum timeout before Google Play responds";
      case BillingResponseCode.SERVICE_UNAVAILABLE:
        return "Network connection is down";
      case BillingResponseCode.USER_CANCELED:
        return "User pressed back or canceled a dialog";
      default:
        return "Unknown error code";
    }
  }

  private BillingFlowParams parseBillingFlowParams(JSONArray data) throws JSONException {
    final String productIdAndOfferIndex = data.getString(0);
    final JSONObject additionalData = data.getJSONObject(1);

    final String[] productIdAndOfferIndexArray = productIdAndOfferIndex.split("@", 2);
    String productId = null;
    String offerToken = null;
    // first option to pass-in the selected offer index is to use the "productId@offerIndex" syntax.
    if (productIdAndOfferIndexArray.length == 2) {
      productId = productIdAndOfferIndexArray[0];
      offerToken = productIdAndOfferIndexArray[1];
    }
    else {
      productId = productIdAndOfferIndex;
    }

    if (offerToken == null && additionalData.has("offerToken")) {
      offerToken = additionalData.getString("offerToken");
    }

    // NOTE: developerPayload isn't supported anymore.
    // https://developer.android.com/google/play/billing/developer-payload

    // NOTE: oldSku and oldPurchasedSkus have been removed in billing library v4
    // Specify the SKU that the user is upgrading or downgrading from.
    // String oldSku = null;
    // if (additionalData.has("oldPurchasedSkus")) {
    //   final JSONArray list = new JSONArray(
    //       additionalData.getString("oldPurchasedSkus"));
    //   int len = list.length();
    //   if (len > 0)
    //     oldSku = list.get(0).toString();
    // }
    // else if (additionalData.has("oldSku")) {
    //   oldSku = additionalData.getString("oldSku");
    // }

    String oldPurchaseToken = null;
    if (additionalData.has("oldPurchaseToken")) {
      oldPurchaseToken = additionalData.getString("oldPurchaseToken");
    }

    // Specify an optional obfuscated string of developer profile name.  If
    // you pass this value, Google Play can use it for payment risk
    // evaluation. Do not use the account ID or the user's Google ID for this
    // field.
    // (removed from Google Play Billing library v3)
    // final String developerId = additionalData.has("developerId")
    //   ? additionalData.getString("developerId")
    //   : null;

    // Specify an optional obfuscated string that is uniquely associated with
    // the user's account in your app.
    //
    // If you pass this value, Google Play can use it to detect irregular
    // activity, such as many devices making purchases on the same account in
    // a short period of time. Do not use the developer ID or the user's
    // Google ID for this field. In addition, this field should not contain
    // the user's ID in cleartext. We recommend that you use a one-way hash
    // to generate a string from the user's ID and store the hashed string in
    // this field.
    final String accountId = additionalData.has("accountId")
      ? additionalData.getString("accountId")
      : null;

    final String profileId = additionalData.has("profileId")
      ? additionalData.getString("profileId")
      : null;

    final ProductDetails productDetails = mProductDetails.get(productId);
    if (productDetails == null) {
      Log.d(mTag, "buy() -> Failed: Product not registered: " + productId);
      callError(Constants.ERR_PURCHASE, "Product not registered: " + productId);
      return null;
    }

    BillingFlowParams.Builder params = BillingFlowParams.newBuilder();

    // If not passed in additionalData, use the offer token based on the selected offer index.
    final List<SubscriptionOfferDetails> subscriptionOfferDetails = productDetails.getSubscriptionOfferDetails();
    if (offerToken == null && subscriptionOfferDetails != null) {
      offerToken = subscriptionOfferDetails.get(0).getOfferToken();
    }
    List<ProductDetailsParams> productDetailsParamsList = new ArrayList<ProductDetailsParams>();

    if (offerToken != null) {
      productDetailsParamsList.add(ProductDetailsParams.newBuilder()
        .setProductDetails(productDetails)
        .setOfferToken(offerToken)
        .build());
        Log.d(mTag, "Product details id@token: " + productIdAndOfferIndexArray + " === " + productId + "@" + offerToken + " ... " + productDetails.toString());
    }
    else {
      productDetailsParamsList.add(ProductDetailsParams.newBuilder()
        .setProductDetails(productDetails)
        .build());
    }

    BillingFlowParams.SubscriptionUpdateParams.Builder subscriptionUpdateParams =
      BillingFlowParams.SubscriptionUpdateParams.newBuilder();
    Boolean hasSubscriptionUpdateParams = false;

    Log.d(mTag, "buy() -> setProductDetailsParamsList");
    params.setProductDetailsParamsList(productDetailsParamsList);
    // params.setProductDetails(productDetails);
    // NOTE: This has been removed in billing library v4, use oldPurchaseToken now.
    // if (oldSku != null && oldPurchaseToken != null) {
    //   Log.d(mTag, "buy() -> setOldSku");
    //   params.setOldSku(oldSku, oldPurchaseToken);
    // }

    if (oldPurchaseToken != null) {
      Log.d(mTag, "buy() -> setOldSkuPurchaseToken");
      subscriptionUpdateParams.setOldSkuPurchaseToken(oldPurchaseToken);
      hasSubscriptionUpdateParams = true;
    }

    // accountId and profileId are used to detect fraud.
    // see https://developer.android.com/google/play/billing/security#fraud
    if (accountId != null) {
      Log.d(mTag, "buy() -> setObfuscatedAccountId");
      // Google renamed setAccountId to setObfuscatedAccountId.
      // the plugin was already obfuscating the accountId
      // as md5(applicationUsername) => we can keep the same parameter.
      params.setObfuscatedAccountId(accountId);
    }

    // Some applications allow users to have multiple profiles within a single
    // account. Use this method to send the user's profile identifier to
    // Google.
    if (profileId != null) {
      Log.d(mTag, "buy() -> setObfuscatedProfileId");
      params.setObfuscatedProfileId(profileId);
    }

    // Google removed setDeveloperId
    // if (developerId != null) {
    //   Log.d(mTag, "buy() -> setDeveloperId");
    //   params.setDeveloperId(developerId);
    // }

    // See https://developer.android.com/google/play/billing/subs#change
    final String prorationMode = additionalData.has("prorationMode")
      ? additionalData.getString("prorationMode")
      : null;
    if (prorationMode != null) {
      if ("IMMEDIATE_WITH_TIME_PRORATION".equals(prorationMode))
        subscriptionUpdateParams.setReplaceSkusProrationMode(BillingFlowParams.ProrationMode.IMMEDIATE_WITH_TIME_PRORATION);
      else if ("IMMEDIATE_AND_CHARGE_PRORATED_PRICE".equals(prorationMode))
        subscriptionUpdateParams.setReplaceSkusProrationMode(BillingFlowParams.ProrationMode.IMMEDIATE_AND_CHARGE_PRORATED_PRICE);
      else if ("IMMEDIATE_WITHOUT_PRORATION".equals(prorationMode))
        subscriptionUpdateParams.setReplaceSkusProrationMode(BillingFlowParams.ProrationMode.IMMEDIATE_WITHOUT_PRORATION);
      else if ("DEFERRED".equals(prorationMode))
        subscriptionUpdateParams.setReplaceSkusProrationMode(BillingFlowParams.ProrationMode.DEFERRED);
      else if ("IMMEDIATE_AND_CHARGE_FULL_PRICE".equals(prorationMode))
        subscriptionUpdateParams.setReplaceSkusProrationMode(BillingFlowParams.ProrationMode.IMMEDIATE_AND_CHARGE_FULL_PRICE);
    }

    if (hasSubscriptionUpdateParams) {
      params.setSubscriptionUpdateParams(subscriptionUpdateParams.build());
    }

    return params.build();
  }

  /** Subscribe to an item. */
  private void subscribe(JSONArray data) throws JSONException {
    Log.d(mTag, "subscribe()");
    if (!areSubscriptionsSupported()) {
      callError(Constants.ERR_PURCHASE, "FEATURE_NOT_SUPPORTED");
      return;
    }
    initiatePurchaseFlow(parseBillingFlowParams(data));
  }

  /** Buy an item. */
  private void buy(JSONArray data) throws JSONException {
    Log.d(mTag, "buy()");
    initiatePurchaseFlow(parseBillingFlowParams(data));
  }

  /** Start a purchase or subscription replace flow. */
  public void initiatePurchaseFlow(final BillingFlowParams params) {
    Log.d(mTag, "initiatePurchaseFlow()");
    if (params == null) {
      return;
    }
    executeServiceRequest(() -> {
      if (getLastResponseCode() != BillingResponseCode.OK) {
        Log.d(mTag, "initiatePurchaseFlow() -> Failed: "
            + "Failed to execute service request. " + format(getLastResult()));
        callError(Constants.ERR_COMMUNICATION,
            "Failed to execute service request. " + format(getLastResult()));
        return;
      }
      Log.d(mTag, "initiatePurchaseFlow() -> launchBillingFlow.");
      cordova.setActivityResultCallback(this);
      mBillingClient.launchBillingFlow(cordova.getActivity(), params);
    });
  }

  /** Return point after the native purchase flow. */
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    try{
      Log.d(mTag, "onActivityResult("
          + requestCode + ","
          + resultCode + ","
          + data + ")");

      // Pass on the activity result to the helper for handling
      // if (!mHelper.handleActivityResult(requestCode, resultCode, data)) {
        // not handled, so handle it ourselves (here's where you'd
        // perform any handling of activity results not related to in-app
        // billing...
      Log.d(mTag, "onActivityResult() -> super.onActivityResult()");
        super.onActivityResult(requestCode, resultCode, data);
      // }
      // else {
      //  Log.d(mTag, "onActivityResult handled by IABUtil.");
      // }
    } catch (Exception e) {
      Log.e(mTag, "onActivityResult() -> Failed: " + e.getMessage());
      callError(Constants.ERR_UNKNOWN, e.getMessage());
    }
  }

  // Consume a purchase
  private void consumePurchase(final String purchaseToken) throws JSONException {
    Log.d(mTag, "consumePurchase(" + purchaseToken + ")");
    // Find the purchaseToken from sku
    // final Purchase purchase = findPurchaseByProductId(productId);
    // if (purchase == null) {
    //   Log.w(mTag, "consumePurchase() -> No such purchase");
    //   callError(Constants.ERR_PURCHASE, "ITEM_NOT_OWNED");
    //   return;
    // }
    // final String purchaseToken = purchase.getPurchaseToken();

    if (mTokensToBeConsumed.contains(purchaseToken)) {
      Log.i(mTag, "consumePurchase() -> Consume already in progress.");
      callError(Constants.ERR_PURCHASE, "ITEM_ALREADY_CONSUMED");
      return;
    }
    mTokensToBeConsumed.add(purchaseToken);
    executeServiceRequest(() -> {
      final ConsumeParams params = ConsumeParams.newBuilder()
        .setPurchaseToken(purchaseToken)
        .build();
      mBillingClient.consumeAsync(params, this);
    });
  }

  // Acknowledge a purchase
  private void acknowledgePurchase(final String purchaseToken) throws JSONException {
    Log.d(mTag, "acknowledgePurchase(" + purchaseToken + ")");
    // Find the purchaseToken from sku
    // final Purchase purchase = findPurchaseByProductId(sku);
    // if (purchase == null) {
    //   Log.w(mTag, "acknowledgePurchase() -> No such purchase");
    //   callError(Constants.ERR_PURCHASE, "ITEM_NOT_OWNED");
    //   return;
    // }
    // final String purchaseToken = purchase.getPurchaseToken();
    executeServiceRequest(() -> {
      final AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
        .setPurchaseToken(purchaseToken)
        // .setDeveloperPayload(developerPayload) (removed in v3)
        .build();
      mBillingClient.acknowledgePurchase(params, this);
    });
  }

  // Implements AcknowledgePurchaseResponseListener
  @Override
  public void onAcknowledgePurchaseResponse(BillingResult result) {
    if (result.getResponseCode() == BillingResponseCode.OK) {
      Log.d(mTag, "onAcknowledgePurchaseResponse() -> Success");
      callSuccess();
    }
    else {
      Log.d(mTag, "onAcknowledgePurchaseResponse() -> Failed: "
          + format(result));
      callError(Constants.ERR_FINISH, format(result));
    }
  }

  /*
  Deprecated by Google (and not supported when using ProductDetails instead of SkuDetails)
  We should use the "manageSubscription" deep-link instead. See
  https://developer.android.com/reference/com/android/billingclient/api/PriceChangeFlowParams.Builder

  public void launchPriceChangeConfirmationFlow(String skuId) {
    Log.d(mTag, "launchPriceChangeConfirmationFlow(" + skuId + ")");
    final ProductDetails productDetails = mProductDetails.get(skuId);
    if (productDetails == null) {
      Log.d(mTag, "launchPriceChangeConfirmationFlow() -> Failed: Product not registered: " + skuId);
      sendToListener("onPriceChangeConfirmationResultUnknownSku", new JSONObject());
      return;
    }
    PriceChangeFlowParams priceChangeFlowParams = PriceChangeFlowParams.newBuilder()
      .setProductDetails(productDetails)
      .build();
    mBillingClient.launchPriceChangeConfirmationFlow(cordova.getActivity(),
      priceChangeFlowParams,
      new PriceChangeConfirmationListener() {
        @Override
        public void onPriceChangeConfirmationResult(BillingResult result) {
          final int responseCode = result.getResponseCode();
          if (responseCode == BillingResponseCode.OK) {
            // User has confirmed the price change.
            sendToListener("onPriceChangeConfirmationResultOK", new JSONObject());
          } else if (responseCode == BillingResponseCode.USER_CANCELED) {
            // User hasn't confirmed the price change and should retain
            // access until the end of the current billing cycle.
            sendToListener("onPriceChangeConfirmationResultUserCanceled", new JSONObject());
          }
        }
      });
  }
  */

  // Called when the activity receives a new intent.
  @Override
  public void onNewIntent(Intent intent) {
    Log.d(mTag, "onNewIntent()");
  }

  // Called when the activity is no longer visible to the user.
  @Override
  public void onStop() {
    Log.d(mTag, "onStop()");
  }

  // Last time the app queried for purchases when onStart was triggered.
  // We make sure to refresh every 24h (but not more).
  private long mLastQueryOnStart = 0;

  // Called when the activity is becoming visible to the user.
  @Override
  public void onStart() {
    Log.d(mTag, "onStart()");
    if (mBillingClient != null) {
        long now = Calendar.getInstance().getTimeInMillis();
        if (now - mLastQueryOnStart > 24 * 60 * 60 * 1000) {
            mLastQueryOnStart = Calendar.getInstance().getTimeInMillis();
            queryPurchases();
        }
    }
  }

  // Implements ConsumeResponseListener
  @Override
  public void onConsumeResponse(BillingResult result, String purchaseToken) {
    try {
      Log.d(mTag, "onConsumeResponse()");
      if (result.getResponseCode() == BillingResponseCode.OK) {
        mTokensToBeConsumed.remove(purchaseToken);
        final Purchase purchase = findPurchaseByToken(purchaseToken);
        Log.d(mTag, "onConsumeResponse() -> Success");
        sendToListener("purchaseConsumed", new JSONObject()
            .put("purchase", toJSON(purchase)));
        callSuccess();
      } else {
        Log.d(mTag, result.getDebugMessage());
        callError(Constants.ERR_FINISH, result.getDebugMessage());
      }
    } catch (JSONException e) {
      Log.d(mTag, "onConsumeResponse() -> Failed: " + e.getMessage());
      callError(Constants.ERR_UNKNOWN, e.getMessage());
    }
  }

  // We're being destroyed.
  @Override
  public void onDestroy() {
    if (mBillingClient != null && mBillingClient.isReady()) {
      mBillingClient.endConnection();
    }
    super.onDestroy();
  }

  private int nProductDetailsQuerySuccessful = 0;
  /**
   * Load in-app products information.
   *
   * @param listener Code to run once data has been loaded
   */
  private void queryAllProductDetails(List<String> inAppProductIds, List<String> subsProductIds, final ProductDetailsResponseListener listener) {
    Log.d(mTag, "queryAllProductDetails()");
    ArrayList<ProductDetails> allProducts = new ArrayList<ProductDetails>();

    final int nRequests =
      (subsProductIds.size() > 0 ? 1 : 0)
      + (inAppProductIds.size() > 0 ? 1 : 0);
    nProductDetailsQuerySuccessful = 0;

    final ProductDetailsResponseListener queryListener =
      new ProductDetailsResponseListener() {
        @Override
        public void onProductDetailsResponse(
            final BillingResult result,
            final List<ProductDetails> productDetailsList) {
          mBillingClientResult = result;
          if (result.getResponseCode() != BillingResponseCode.OK) {
            Log.w(mTag, "queryAllProductDetails() -> Failed: Unsuccessful query. "
                + format(result));
            callError(Constants.ERR_LOAD, "Error. " + format(result));
          } else {
            if (productDetailsList != null && productDetailsList.size() > 0) {
              // Then fill all the other rows
              for (ProductDetails product : productDetailsList) {
                Log.d(mTag, "queryAllProductDetails() -> ProductDetails: Title: "
                    + product.getTitle());
                mProductDetails.put(product.getProductId(), product);
                allProducts.add(product);
              }
            } else {
              Log.w(mTag, "queryAllProductDetails() -> Query returned nothing.");
            }
            nProductDetailsQuerySuccessful++;
            if (nProductDetailsQuerySuccessful == nRequests && listener != null) {
              Log.d(mTag, "queryAllProductDetails() -> Calling listener.");
              listener.onProductDetailsResponse(result, allProducts);
            }
          }
        }
      };

    List<Product> subsList = new ArrayList<Product>();
    for (int i = 0; i < subsProductIds.size(); ++i) {
      subsList.add(Product.newBuilder()
        .setProductId(subsProductIds.get(i))
        .setProductType(ProductType.SUBS)
        .build());
    }

    List<Product> inAppList = new ArrayList<Product>();
    for (int i = 0; i < inAppProductIds.size(); ++i) {
      inAppList.add(Product.newBuilder()
        .setProductId(inAppProductIds.get(i))
        .setProductType(ProductType.INAPP)
        .build());
    }

    if (subsList.size() > 0) {
      Log.d(mTag, "queryAllProductDetails() -> Query SUBS.");
      queryProductDetailsAsync(subsList, queryListener);
    }

    if (inAppList.size() > 0) {
      Log.d(mTag, "queryAllProductDetails() -> Query INAPP.");
      queryProductDetailsAsync(inAppList, queryListener);
    }

    if (inAppList.size() == 0 && subsList.size() == 0) {
      Log.d(mTag, "queryAllProductDetails() -> Calling listener (0 requests).");
      if (listener != null) {
        listener.onProductDetailsResponse(getLastResult(), allProducts);
      }
    }
  }

  public void queryProductDetailsAsync(
      // @ProductType final String itemType,
      final List<Product> productList,
      final ProductDetailsResponseListener listener) {
    Log.d(mTag, "queryProductDetailsAsync()");
    executeServiceRequest(() -> {
      if (getLastResponseCode() != BillingResponseCode.OK) {
        Log.d(mTag, "queryProductDetailsAsync() -> Failed: "
            + format(getLastResult()));
        listener.onProductDetailsResponse(getLastResult(), null);
      } else {
        Log.d(mTag, "queryProductDetailsAsync() -> Success");
        QueryProductDetailsParams.Builder params = QueryProductDetailsParams.newBuilder();
        params.setProductList(productList)/* .setType(itemType) */;
        mBillingClient.queryProductDetailsAsync(params.build(), listener);
      }
    });
  }

  private void callSuccess() {
    if (mCallbackContext == null) {
      return;
    }
    final CallbackContext callbackContext = mCallbackContext;
    mCallbackContext = null;
    callbackContext.success();
  }

  private void callSuccess(final JSONArray array) {
    if (mCallbackContext == null) {
      return;
    }
    final CallbackContext callbackContext = mCallbackContext;
    mCallbackContext = null;
    callbackContext.success(array);
  }

  private void callError(final int code, final String msg) {
    Log.d(mTag, "callError({code:" + code + ", msg:\"" + msg + "\")");
    if (mCallbackContext == null) {
      return;
    }
    final CallbackContext callbackContext = mCallbackContext;
    mCallbackContext = null;
    callbackContext.error(code + "|" + msg);
  }

  /** Connect to the Billing server.
   *
   * @param executeOnSuccess Some code to run once connected. */
  public void startServiceConnection(final Runnable executeOnSuccess) {
    Log.d(mTag, "startServiceConnection()");
    mBillingClient.startConnection(new BillingClientStateListener() {
      @Override
      public void onBillingSetupFinished(final BillingResult result) {
        mBillingClientResult = result;
        if (result.getResponseCode() == BillingResponseCode.OK) {
          Log.d(mTag, "startServiceConnection() -> Success");
          mIsServiceConnected = true;
        }
        else {
          Log.d(mTag, "startServiceConnection() -> Failed: "
              + format(getLastResult()));
        }
        if (executeOnSuccess != null) {
          executeOnSuccess.run();
        }
      }

      @Override
      public void onBillingServiceDisconnected() {
        Log.d(mTag, "startServiceConnection() -> Disconnected");
        mIsServiceConnected = false;
      }
    });
  }

  private void executeServiceRequest(final Runnable runnable) {
    if (mIsServiceConnected) {
      Log.d(mTag, "executeServiceRequest() -> OK");
      resetLastResult(BillingResponseCode.OK);
      runnable.run();
    } else {
      // If billing service was disconnected, we try to reconnect 1 time.
      // (feel free to introduce your retry policy here).
      Log.d(mTag, "executeServiceRequest() -> Failed (try again).");
      startServiceConnection(runnable);
    }
  }

  private List<String> parseStringArrayAtIndex(
      final JSONArray data,
      final int index) throws JSONException {
    final List<String> ret = new ArrayList<String>();
    if (data.length() > index) {
      JSONArray jsonList = new JSONArray(data.getString(index));
      final int len = jsonList.length();
      for (int i = 0; i < len; i++) {
        ret.add(jsonList.get(i).toString());
      }
    }
    return ret;
  }

  private String format(final BillingResult result) {
    final int code = result.getResponseCode();
    final String message =
      result.getDebugMessage() != ""
      ? result.getDebugMessage()
      : codeToMessage(code);
    return codeToString(code) + ": " + message;
  }
}
