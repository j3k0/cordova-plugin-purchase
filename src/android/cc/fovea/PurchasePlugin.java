/**
 * Purchase Plugin.
 * @author Jean-Christophe Hoelt - Fovea.cc
 */

package cc.fovea;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.AcknowledgePurchaseResponseListener;
import com.android.billingclient.api.BillingClient.BillingResponseCode;
import com.android.billingclient.api.BillingClient.FeatureType;
import com.android.billingclient.api.BillingClient.SkuType;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.ConsumeResponseListener;
import com.android.billingclient.api.Purchase.PurchasesResult;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.SkuDetails;
import com.android.billingclient.api.SkuDetailsParams;
import com.android.billingclient.api.SkuDetailsResponseListener;
import java.io.IOException;
import java.util.ArrayList;
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

public class PurchasePlugin
  extends CordovaPlugin
  implements PurchasesUpdatedListener,
             ConsumeResponseListener,
             AcknowledgePurchaseResponseListener {

  /** Tag used for log messages. */
  private final String mTag = "CordovaPurchase";

  /**
   * Context for the last plugin call.
   *
   * See execute(), callSuccess() and callError().
   */
  private CallbackContext mCallbackContext;

  /** A reference to BillingClient. */
  private BillingClient mBillingClient;

  private List<String> mInAppSkus;
  private List<String> mSubsSkus;
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
  /** Last response code from the billing client. */
  private int getLastResponseCode() {
    return mBillingClientResult.getResponseCode();
  }
  /** Reset last result to the given code. */
  private void resetLastResult(final int responseCode) {
    mBillingClientResult = BillingResult
      .newBuilder()
      .setResponseCode(responseCode)
      .setDebugMessage("")
      .build();
  }

  private final HashMap<String, SkuDetails> mSkuDetails =
    new HashMap<String, SkuDetails>();

  /** List of purchase tokens being consumed. */
  private Set<String> mTokensToBeConsumed = new HashSet<>();

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);
    // your init code here
  }

  private CallbackContext mListenerContext = null;
  private void sendToListener(String type, JSONObject data) {
    try {
      Log.d(mTag, "sendToListener() -> " + type);
      Log.d(mTag, "            data -> " + data.toString());
      if (mListenerContext == null) {
        return;
      }
      final JSONObject message = new JSONObject()
        .put("type", type);
      if (data != null)
        message.put("data", data);
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
        final List<String> inAppSkus = parseStringArrayAtIndex(data, 1);
        final List<String> subsSkus = parseStringArrayAtIndex(data, 2);
        init(inAppSkus, subsSkus);
      } else if ("getAvailableProducts".equals(action)) {
        getAvailableProducts();
      } else if ("getPurchases".equals(action)) {
        getPurchases();
      } else if ("consumePurchase".equals(action)) {
        final String sku = data.getString(0);
        final String developerPayload = data.getString(2);
        consumePurchase(sku, developerPayload);
      } else if ("acknowledgePurchase".equals(action)) {
        final String sku = data.getString(0);
        final String developerPayload = data.getString(2);
        acknowledgePurchase(sku, developerPayload);
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
  private void init(
      final List<String> inAppSkus,
      final List<String> subsSkus) {

    Log.d(mTag, "init()");
    mInAppSkus = inAppSkus;
    mSubsSkus = subsSkus;

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

  private void onQueryPurchasesFinished(PurchasesResult result) {
    try {
      if (result.getResponseCode() == BillingResponseCode.OK) {
        for (Purchase p : result.getPurchasesList()) {
          mPurchases.add(0, p);
        }
        sendToListener("setPurchases", new JSONObject()
            .put("purchases", toJSON(result.getPurchasesList())));
        callSuccess(toJSON(result.getPurchasesList()));
      }
      else {
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
      .put("orderId", p.getOrderId())
      .put("getPurchaseState", p.getPurchaseState())
      .put("acknowledged", p.isAcknowledged())
      .put("autoRenewing", p.isAutoRenewing())
      .put("signature", p.getSignature())
      .put("receipt", p.getOriginalJson().toString());
  }

  /**
   * Query purchases across various use cases and deliver the result in a
   * formalized way through a listener.
   */
  public void queryPurchases() {
    Log.d(mTag, "queryPurchases()");
    executeServiceRequest(() -> {
      long time = System.currentTimeMillis();
      PurchasesResult purchasesResult =
        mBillingClient.queryPurchases(SkuType.INAPP);
      List<Purchase> purchases = new ArrayList<Purchase>();
      BillingResult result = purchasesResult.getBillingResult();
      if (result.getResponseCode() == BillingResponseCode.OK) {
          purchases.addAll(purchasesResult.getPurchasesList());
      }
      Log.i(mTag, "queryPurchases() -> Elapsed time: "
          + (System.currentTimeMillis() - time) + "ms");
      // If there are subscriptions supported, we add subscription rows as well
      if (areSubscriptionsSupported()) {
        PurchasesResult subscriptionResult =
          mBillingClient.queryPurchases(SkuType.SUBS);
        Log.i(mTag, "queryPurchases() -> Subscriptions elapsed time: "
            + (System.currentTimeMillis() - time) + "ms");
        int purchasesListSize = -1;
        if (subscriptionResult.getPurchasesList() != null) {
            purchasesListSize = subscriptionResult.getPurchasesList().size();
        }
        Log.i(mTag, "queryPurchases() -> Subscriptions result code: "
            + subscriptionResult.getResponseCode()
            + " res: " + purchasesListSize);

        if (subscriptionResult.getResponseCode() == BillingResponseCode.OK
                && subscriptionResult.getPurchasesList() != null) {
          // if purchases failed but subs succeed, better return a success anyway.
          // (so the app has something to show)
          result = subscriptionResult.getBillingResult();
          purchases.addAll(subscriptionResult.getPurchasesList());
        } else {
          Log.e(mTag, "queryPurchases() -> "
              + "Error trying to query subscription purchases.");
        }
      } else if (purchasesResult.getResponseCode() == BillingResponseCode.OK) {
        Log.i(mTag, "queryPurchases() -> "
            + "Subscriptions are not supported, skipped.");
      } else {
        Log.w(mTag, "queryPurchases() -> Error response code: "
            + purchasesResult.getResponseCode());
      }
      onQueryPurchasesFinished(new PurchasesResult(result, purchases));
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

  private void getAvailableProducts() {
    Log.d(mTag, "getAvailableProducts()");
    queryAllSkuDetails(new SkuDetailsResponseListener() {
      @Override
        public void onSkuDetailsResponse(
            final BillingResult result,
            final List<SkuDetails> skuDetailsList) {
          if (result.getResponseCode() != BillingResponseCode.OK) {
            Log.d(mTag, "getAvailableProducts() -> Failed: " + format(result));
            callError(Constants.ERR_LOAD, "Failed to load SKUs, code: "
                + result.getResponseCode());
            return;
          }
          JSONArray jsonSkuList = new JSONArray();
          try {
            for (SkuDetails sku : skuDetailsList) {
              jsonSkuList.put(new JSONObject(sku.getOriginalJson()));
            }
            Log.d(mTag, "getAvailableProducts() -> Success");
            callSuccess(jsonSkuList);
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

  private Purchase findPurchaseBySku(final String sku) {
    for (Purchase p : mPurchases) {
      if (p.getSku().equals(sku))
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
      if (code == BillingResponseCode.OK) {
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
    final String skuId = data.getString(0);
    final JSONObject additionalData = data.getJSONObject(1);

    // NOTE: developerPayload isn't supported anymore.
    // Specify the SKU that the user is upgrading or downgrading from.
    String oldSku = null;
    if (additionalData.has("oldPurchasedSkus")) {
      final JSONArray list = new JSONArray(
          additionalData.getString("oldPurchasedSkus"));
      int len = list.length();
      if (len > 0)
        oldSku = list.get(0).toString();
    }
    else if (additionalData.has("oldSku")) {
      oldSku = additionalData.getString("oldSku");
    }

    // Specify an optional obfuscated string of developer profile name.  If
    // you pass this value, Google Play can use it for payment risk
    // evaluation. Do not use the account ID or the user's Google ID for this
    // field.
    final String developerId = additionalData.has("developerId")
      ? additionalData.getString("developerId")
      : null;

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

    BillingFlowParams.Builder params = BillingFlowParams.newBuilder();
    final SkuDetails skuDetails = mSkuDetails.get(skuId);
    if (skuDetails == null) {
      Log.d(mTag, "buy() -> Failed: Product not registered: " + skuId);
      callError(Constants.ERR_PURCHASE, "Product not registered: " + skuId);
      return null;
    }
    Log.d(mTag, "buy() -> setSkuDetails");
    params.setSkuDetails(skuDetails);
    if (oldSku != null) {
      Log.d(mTag, "buy() -> setOldSku");
      params.setOldSku(oldSku);
    }
    if (accountId != null) {
      Log.d(mTag, "buy() -> setAccountId");
      params.setAccountId(accountId);
    }
    if (developerId != null) {
      Log.d(mTag, "buy() -> setDeveloperId");
      params.setDeveloperId(developerId);
    }
    // (I did not find enough documentation to support this parameter)
    // if (replaceSkusProrationMode) { // int
    //   params.setReplaceSkusProrationMode(replaceSkusProrationMode)
    // }
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
      Log.d(mTag, "initiatePurchaseFlow() -> launchBillingFlow."
          + " Replace old SKU? " + (params.getOldSku() != null));
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
  private void consumePurchase(final String sku, final String developerPayload) throws JSONException {
    Log.d(mTag, "consumePurchase(" + sku + ")");
    // Find the purchaseToken from sku
    final Purchase purchase = findPurchaseBySku(sku);
    if (purchase == null) {
      Log.w(mTag, "consumePurchase() -> No such purchase");
      callError(Constants.ERR_PURCHASE, "ITEM_NOT_OWNED");
      return;
    }
    final String purchaseToken = purchase.getPurchaseToken();

    if (mTokensToBeConsumed.contains(purchaseToken)) {
      Log.i(mTag, "consumePurchase() -> Consume already in progress.");
      callError(Constants.ERR_PURCHASE, "ITEM_ALREADY_CONSUMED");
      return;
    }
    mTokensToBeConsumed.add(purchaseToken);
    executeServiceRequest(() -> {
      final ConsumeParams params = ConsumeParams.newBuilder()
        .setPurchaseToken(purchaseToken)
        .setDeveloperPayload(developerPayload)
        .build();
      mBillingClient.consumeAsync(params, this);
    });
  }

  // Acknowledge a purchase
  private void acknowledgePurchase(final String sku, final String developerPayload) throws JSONException {
    Log.d(mTag, "acknowledgePurchase(" + sku + ")");
    // Find the purchaseToken from sku
    final Purchase purchase = findPurchaseBySku(sku);
    if (purchase == null) {
      Log.w(mTag, "acknowledgePurchase() -> No such purchase");
      callError(Constants.ERR_PURCHASE, "ITEM_NOT_OWNED");
      return;
    }
    final String purchaseToken = purchase.getPurchaseToken();
    executeServiceRequest(() -> {
      final AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
        .setPurchaseToken(purchaseToken)
        .setDeveloperPayload(developerPayload)
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

  // Called when the activity is becoming visible to the user.
  @Override
  public void onStart() {
    Log.d(mTag, "onStart()");
    if (mBillingClient != null) {
        queryPurchases();
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
      }
    } catch (JSONException e) {
      Log.d(mTag, "onConsumeResponse() -> Failed: " + e.getMessage());
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

  private int nSkuDetailsQuerySuccessful = 0;
  /**
   * Load in-app products information.
   *
   * @param listener Code to run once data has been loaded
   */
  private void queryAllSkuDetails(final SkuDetailsResponseListener listener) {
    Log.d(mTag, "queryAllSkuDetails()");
    ArrayList<SkuDetails> allSkus = new ArrayList<SkuDetails>();
    final int nRequests =
      (mSubsSkus.size() > 0 ? 1 : 0)
      + (mInAppSkus.size() > 0 ? 1 : 0);
    nSkuDetailsQuerySuccessful = 0;
    final SkuDetailsResponseListener queryListener =
      new SkuDetailsResponseListener() {
        @Override
        public void onSkuDetailsResponse(
            final BillingResult result,
            final List<SkuDetails> skuDetailsList) {
          mBillingClientResult = result;
          if (result.getResponseCode() != BillingResponseCode.OK) {
            Log.w(mTag, "queryAllSkuDetails() -> Failed: Unsuccessful query. "
                + format(result));
            callError(Constants.ERR_LOAD, "Error. " + format(result));
          } else {
            if (skuDetailsList != null && skuDetailsList.size() > 0) {
              // Then fill all the other rows
              for (SkuDetails sku : skuDetailsList) {
                Log.d(mTag, "queryAllSkuDetails() -> SKUDetails: Title: "
                    + sku.getTitle());
                mSkuDetails.put(sku.getSku(), sku);
                allSkus.add(sku);
              }
            } else {
              Log.w(mTag, "queryAllSkuDetails() -> Query returned nothing.");
            }
            nSkuDetailsQuerySuccessful++;
            if (nSkuDetailsQuerySuccessful == nRequests && listener != null) {
              Log.d(mTag, "queryAllSkuDetails() -> Calling listener.");
              listener.onSkuDetailsResponse(result, allSkus);
            }
          }
        }
      };
    if (mInAppSkus.size() > 0) {
      Log.d(mTag, "queryAllSkuDetails() -> Query INAPP.");
      querySkuDetailsAsync(SkuType.INAPP, mInAppSkus, queryListener);
    }
    if (mSubsSkus.size() > 0) {
      Log.d(mTag, "queryAllSkuDetails() -> Query SUBS.");
      querySkuDetailsAsync(SkuType.SUBS, mSubsSkus, queryListener);
    }
    if (nRequests == 0 && listener != null) {
      Log.d(mTag, "queryAllSkuDetails() -> Calling listener (0 requests).");
      listener.onSkuDetailsResponse(getLastResult(), allSkus);
    }
  }

  public void querySkuDetailsAsync(
      @SkuType final String itemType,
      final List<String> skuList,
      final SkuDetailsResponseListener listener) {
    Log.d(mTag, "querySkuDetailsAsync()");
    executeServiceRequest(() -> {
      if (getLastResponseCode() != BillingResponseCode.OK) {
        Log.d(mTag, "querySkuDetailsAsync() -> Failed: "
            + format(getLastResult()));
        listener.onSkuDetailsResponse(getLastResult(), null);
      } else {
        Log.d(mTag, "querySkuDetailsAsync() -> Success");
        SkuDetailsParams.Builder params = SkuDetailsParams.newBuilder();
        params.setSkusList(skuList).setType(itemType);
        mBillingClient.querySkuDetailsAsync(params.build(), listener);
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
