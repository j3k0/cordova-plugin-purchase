/**
 * The Capacitor Purchase Plugin for Google Play.
 *
 * Wraps Google Play BillingClient 8.3.0 and communicates with the TypeScript
 * CapacitorBridge via Capacitor's plugin API.
 *
 * JSON formats for purchases and products match the existing Cordova plugin
 * format so the same TypeScript adapter code can parse them.
 *
 * @author Jean-Christophe Hoelt - Fovea.cc
 */

package cc.fovea.iap;

import android.app.Activity;
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
import com.android.billingclient.api.PendingPurchasesParams;
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
import com.android.billingclient.api.QueryProductDetailsResult;
import com.android.billingclient.api.QueryPurchasesParams;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CapacitorPlugin(name = "PurchasePlugin")
public class PurchasePlugin extends Plugin implements
        PurchasesUpdatedListener {

    private static final String TAG = "CdvPurchase";

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    /** A reference to BillingClient. */
    private BillingClient mBillingClient;

    /** List of registered IN_APP product identifiers. */
    private final List<String> mInAppProductIds = new ArrayList<>();

    /** List of registered SUBS product identifiers. */
    private final List<String> mSubsProductIds = new ArrayList<>();

    /** List of purchases reported by the Billing library. */
    private final List<Purchase> mPurchases = new ArrayList<>();

    /** True if billing service is connected now. */
    private boolean mIsServiceConnected;

    /** Value for mBillingClientResult until BillingClient is connected. */
    private static final int BILLING_CLIENT_NOT_CONNECTED = -1;

    /** Last response from the billing client. */
    private BillingResult mBillingClientResult = BillingResult.newBuilder()
            .setResponseCode(BILLING_CLIENT_NOT_CONNECTED).build();

    /** Product details loaded from GooglePlay, indexed by product identifier. */
    private final HashMap<String, ProductDetails> mProductDetails = new HashMap<>();

    /** List of purchase tokens being consumed. */
    private final Set<String> mTokensToBeConsumed = new HashSet<>();

    /** Purchases indexed by token, for lookup when consuming. (CRITICAL 5) */
    private final HashMap<String, Purchase> mPurchasesByToken = new HashMap<>();

    /** Pending call for buy/subscribe (resolved in onPurchasesUpdated). */
    private PluginCall mPendingBuyCall;

    /** Pending call for consumePurchase (async callback, CRITICAL 6). */
    private PluginCall mPendingConsumeCall;

    /** Pending call for acknowledgePurchase (async callback, CRITICAL 6). */
    private PluginCall mPendingAcknowledgeCall;

    /** Last time onStart refreshed purchases. */
    private long mLastQueryOnStart = 0;

    /** Intermediate results for parallel purchase queries. */
    private BillingResult mInAppResult;
    private BillingResult mSubsResult;
    private int nProductDetailsQuerySuccessful = 0;

    // -------------------------------------------------------------------------
    // Internal callback interface for product details queries
    // -------------------------------------------------------------------------

    private interface InternalProductDetailsResponseListener {
        void onProductDetailsResponse(BillingResult result,
                                      List<ProductDetails> productDetailsList);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private BillingResult getLastResult() {
        return mBillingClientResult;
    }

    private int getLastResponseCode() {
        return mBillingClientResult.getResponseCode();
    }

    private void resetLastResult(final int responseCode) {
        mBillingClientResult = BillingResult.newBuilder()
                .setResponseCode(responseCode)
                .setDebugMessage("")
                .build();
    }

    private void addInAppProductIds(final List<String> list) {
        for (int i = 0; i < list.size(); ++i) {
            if (!mInAppProductIds.contains(list.get(i))) {
                mInAppProductIds.add(list.get(i));
            }
        }
    }

    private void addSubsProductIds(final List<String> list) {
        for (int i = 0; i < list.size(); ++i) {
            if (!mSubsProductIds.contains(list.get(i))) {
                mSubsProductIds.add(list.get(i));
            }
        }
    }

    /** Store a purchase in the lookup maps. */
    private void storePurchase(Purchase p) {
        mPurchases.add(0, p);
        mPurchasesByToken.put(p.getPurchaseToken(), p);
    }

    private Purchase findPurchaseByToken(final String purchaseToken) {
        Purchase p = mPurchasesByToken.get(purchaseToken);
        if (p != null) return p;
        // Fallback: linear scan
        for (Purchase purchase : mPurchases) {
            if (purchase.getPurchaseToken().equals(purchaseToken))
                return purchase;
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // JSON conversion — MUST match Cordova plugin format
    // -------------------------------------------------------------------------

    /**
     * Convert a Purchase to JSON.
     * CRITICAL 1: starts from getOriginalJson() and overlays fields.
     */
    private JSONObject purchaseToJson(final Purchase p) throws JSONException {
        return new JSONObject(p.getOriginalJson())
                .put("productIds", new JSONArray(p.getProducts()))
                .put("orderId", p.getOrderId())
                .put("getPurchaseState", p.getPurchaseState())
                .put("developerPayload", p.getDeveloperPayload())
                .put("acknowledged", p.isAcknowledged())
                .put("autoRenewing", p.isAutoRenewing())
                .put("accountId", p.getAccountIdentifiers() != null
                        ? p.getAccountIdentifiers().getObfuscatedAccountId() : null)
                .put("profileId", p.getAccountIdentifiers() != null
                        ? p.getAccountIdentifiers().getObfuscatedProfileId() : null)
                .put("signature", p.getSignature())
                .put("receipt", p.getOriginalJson().toString())
                .put("quantity", p.getQuantity());
    }

    /** Convert a list of purchases to a JSONArray. */
    private JSONArray purchasesToJson(final List<Purchase> purchaseList)
            throws JSONException {
        JSONArray arr = new JSONArray();
        for (Purchase p : purchaseList) {
            arr.put(purchaseToJson(p));
        }
        return arr;
    }

    /**
     * Convert ProductDetails to JSON.
     * CRITICAL 3: handles BillingClient 8.x multi-offer INAPP format.
     * CRITICAL 4: recurrence_mode is a string enum.
     */
    private JSONObject productDetailsToJson(ProductDetails product)
            throws JSONException {
        JSONObject ret = new JSONObject()
                .put("productId", product.getProductId())
                .put("title", product.getTitle())
                .put("name", product.getName())
                .put("description", product.getDescription());

        if (product.getProductType().equals(ProductType.INAPP)) {
            // Check for multiple offers (new in Billing Library 8.0.0)
            List<OneTimePurchaseOfferDetails> offerList =
                    product.getOneTimePurchaseOfferDetailsList();

            if (offerList != null && offerList.size() > 1) {
                // Multiple offers — v12.0 format with offers array
                ret.put("product_format", "v12.0")
                   .put("product_type", "inapp");
                JSONArray offers = new JSONArray();
                for (OneTimePurchaseOfferDetails offer : offerList) {
                    JSONObject offerJson = new JSONObject()
                            .put("offer_id", offer.getOfferId())
                            .put("offer_token", offer.getOfferToken())
                            .put("formatted_price", offer.getFormattedPrice())
                            .put("price_amount_micros", offer.getPriceAmountMicros())
                            .put("price_currency_code", offer.getPriceCurrencyCode());
                    offers.put(offerJson);
                }
                ret.put("offers", offers);
            } else {
                // Single offer — legacy v11.0 format
                final OneTimePurchaseOfferDetails details =
                        product.getOneTimePurchaseOfferDetails();
                ret.put("product_type", "inapp")
                   .put("product_format", "v11.0")
                   .put("formatted_price", details.getFormattedPrice())
                   .put("price_amount_micros", details.getPriceAmountMicros())
                   .put("price_currency_code", details.getPriceCurrencyCode());
            }
        } else if (product.getProductType().equals(ProductType.SUBS)) {
            // Subscriptions — v12.0 format
            ret.put("product_format", "v12.0")
               .put("product_type", "subs");
            JSONArray offers = new JSONArray();
            List<SubscriptionOfferDetails> subscriptionOfferDetailsList =
                    product.getSubscriptionOfferDetails();
            for (SubscriptionOfferDetails details : subscriptionOfferDetailsList) {
                JSONObject offer = new JSONObject()
                        .put("base_plan_id", details.getBasePlanId())
                        .put("offer_id", details.getOfferId())
                        .put("token", details.getOfferToken())
                        .put("tags", new JSONArray(details.getOfferTags()));
                JSONArray pricingPhases = new JSONArray();
                if (details.getPricingPhases() != null) {
                    for (PricingPhase pricing :
                            details.getPricingPhases().getPricingPhaseList()) {
                        JSONObject pricingPhase = new JSONObject()
                                .put("billing_cycle_count",
                                        pricing.getBillingCycleCount())
                                .put("billing_period",
                                        pricing.getBillingPeriod())
                                .put("formatted_price",
                                        pricing.getFormattedPrice())
                                .put("price_amount_micros",
                                        pricing.getPriceAmountMicros())
                                .put("price_currency_code",
                                        pricing.getPriceCurrencyCode());
                        // CRITICAL 4: string enum, not integer
                        if (pricing.getRecurrenceMode()
                                == ProductDetails.RecurrenceMode.FINITE_RECURRING) {
                            pricingPhase.put("recurrence_mode",
                                    "FINITE_RECURRING");
                        } else if (pricing.getRecurrenceMode()
                                == ProductDetails.RecurrenceMode.INFINITE_RECURRING) {
                            pricingPhase.put("recurrence_mode",
                                    "INFINITE_RECURRING");
                        } else if (pricing.getRecurrenceMode()
                                == ProductDetails.RecurrenceMode.NON_RECURRING) {
                            pricingPhase.put("recurrence_mode",
                                    "NON_RECURRING");
                        }
                        pricingPhases.put(pricingPhase);
                    }
                } else {
                    ret.put("product_format", "unknown");
                }
                offer.put("pricing_phases", pricingPhases);
                offers.put(offer);
            }
            ret.put("offers", offers);
        }
        return ret;
    }

    // -------------------------------------------------------------------------
    // Billing response code helpers (from Cordova plugin)
    // -------------------------------------------------------------------------

    private String codeToString(int code) {
        switch (code) {
            case BillingResponseCode.BILLING_UNAVAILABLE:
                return "BILLING_UNAVAILABLE";
            case BillingResponseCode.DEVELOPER_ERROR:
                return "DEVELOPER_ERROR";
            case BillingResponseCode.ERROR:
                return "ERROR";
            case BillingResponseCode.FEATURE_NOT_SUPPORTED:
                return "FEATURE_NOT_SUPPORTED";
            case BillingResponseCode.ITEM_ALREADY_OWNED:
                return "ITEM_ALREADY_OWNED";
            case BillingResponseCode.ITEM_NOT_OWNED:
                return "ITEM_NOT_OWNED";
            case BillingResponseCode.ITEM_UNAVAILABLE:
                return "ITEM_UNAVAILABLE";
            case BillingResponseCode.OK:
                return "OK";
            case BillingResponseCode.SERVICE_DISCONNECTED:
                return "SERVICE_DISCONNECTED";
            case BillingResponseCode.SERVICE_TIMEOUT:
                return "SERVICE_TIMEOUT";
            case BillingResponseCode.SERVICE_UNAVAILABLE:
                return "SERVICE_UNAVAILABLE";
            case BillingResponseCode.USER_CANCELED:
                return "USER_CANCELED";
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

    private String format(final BillingResult result) {
        final int code = result.getResponseCode();
        final String message =
                !result.getDebugMessage().isEmpty()
                        ? result.getDebugMessage()
                        : codeToMessage(code);
        return codeToString(code) + ": " + message;
    }

    // -------------------------------------------------------------------------
    // BillingClient connection management
    // -------------------------------------------------------------------------

    private void startServiceConnection(final Runnable executeOnSuccess,
                                        final Runnable executeOnFailure) {
        Log.d(TAG, "startServiceConnection()");
        mBillingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(final BillingResult result) {
                mBillingClientResult = result;
                if (result.getResponseCode() == BillingResponseCode.OK) {
                    Log.d(TAG, "startServiceConnection() -> Success");
                    mIsServiceConnected = true;
                    if (executeOnSuccess != null) {
                        executeOnSuccess.run();
                    }
                } else {
                    Log.d(TAG, "startServiceConnection() -> Failed: "
                            + format(getLastResult()));
                    mIsServiceConnected = false;
                    if (executeOnFailure != null) {
                        executeOnFailure.run();
                    }
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                Log.d(TAG, "startServiceConnection() -> Disconnected");
                mIsServiceConnected = false;
            }
        });
    }

    private void executeServiceRequest(final Runnable runnable) {
        if (mIsServiceConnected) {
            Log.d(TAG, "executeServiceRequest() -> OK");
            resetLastResult(BillingResponseCode.OK);
            runnable.run();
        } else {
            Log.d(TAG, "executeServiceRequest() -> Failed (try again).");
            startServiceConnection(runnable, () -> {
                Log.d(TAG, "executeServiceRequest() -> "
                        + "Failed to reconnect to billing server...");
            });
        }
    }

    public boolean areSubscriptionsSupported() {
        BillingResult result =
                mBillingClient.isFeatureSupported(FeatureType.SUBSCRIPTIONS);
        if (result.getResponseCode() != BillingResponseCode.OK) {
            Log.w(TAG, "areSubscriptionsSupported() -> Failed: "
                    + format(result));
            return false;
        }
        return true;
    }

    // -------------------------------------------------------------------------
    // Capacitor lifecycle
    // -------------------------------------------------------------------------

    @Override
    public void load() {
        super.load();
    }

    @Override
    protected void handleOnStart() {
        super.handleOnStart();
        Log.d(TAG, "handleOnStart()");
        if (mBillingClient != null) {
            long now = Calendar.getInstance().getTimeInMillis();
            if (now - mLastQueryOnStart > 24 * 60 * 60 * 1000) {
                mLastQueryOnStart = Calendar.getInstance().getTimeInMillis();
                queryPurchases();
            }
        }
    }

    @Override
    protected void handleOnDestroy() {
        if (mBillingClient != null && mBillingClient.isReady()) {
            mBillingClient.endConnection();
        }
        super.handleOnDestroy();
    }

    // -------------------------------------------------------------------------
    // Plugin methods — called from TypeScript via Capacitor
    // -------------------------------------------------------------------------

    /**
     * Initialize the Google Play BillingClient.
     * CRITICAL 2: enablePendingPurchases with new API.
     */
    @PluginMethod
    public void init(PluginCall call) {
        Log.d(TAG, "init()");

        mBillingClient = BillingClient
                .newBuilder(getContext())
                .enablePendingPurchases(
                        PendingPurchasesParams.newBuilder()
                                .enableOneTimeProducts()
                                .enablePrepaidPlans()
                                .build())
                .setListener(this)
                .build();

        resetLastResult(BILLING_CLIENT_NOT_CONNECTED);
        startServiceConnection(() -> {
            if (getLastResponseCode() == BillingResponseCode.OK) {
                Log.d(TAG, "init() -> Success");
                call.resolve();
            } else {
                Log.d(TAG, "init() -> Failed: " + format(getLastResult()));
                call.reject("Setup failed. " + format(getLastResult()));
            }
        }, () -> {
            Log.d(TAG, "init() -> Failure: " + format(getLastResult()));
            call.reject("Setup failure. " + format(getLastResult()));
        });
    }

    /**
     * Query available products (INAPP + SUBS).
     * Returns { products: [...] } matching the CapacitorBridge expectation.
     */
    @PluginMethod
    public void getAvailableProducts(PluginCall call) {
        Log.d(TAG, "getAvailableProducts()");
        try {
            final JSObject args = call.getData();
            final JSONArray inAppArr = args.getJSONArray("inAppSkus");
            final JSONArray subsArr = args.getJSONArray("subsSkus");
            List<String> inAppSkus = jsonArrayToStringList(inAppArr);
            List<String> subsSkus = jsonArrayToStringList(subsArr);
            addInAppProductIds(inAppSkus);
            addSubsProductIds(subsSkus);

            queryAllProductDetails(mInAppProductIds, mSubsProductIds,
                    (result, productDetailsList) -> {
                if (result.getResponseCode() != BillingResponseCode.OK) {
                    Log.d(TAG, "getAvailableProducts() -> Failed: "
                            + format(result));
                    call.reject("Failed to load Products, code: "
                            + result.getResponseCode());
                    return;
                }
                try {
                    JSONArray jsonProductList = new JSONArray();
                    for (ProductDetails product : productDetailsList) {
                        Log.d(TAG, "getAvailableProducts() -> productDetails: "
                                + product.toString());
                        jsonProductList.put(productDetailsToJson(product));
                    }
                    Log.d(TAG, "getAvailableProducts() -> Success");
                    JSObject ret = new JSObject();
                    ret.put("products", jsonProductList);
                    call.resolve(ret);
                } catch (JSONException e) {
                    Log.d(TAG, "getAvailableProducts() -> Failed: "
                            + e.getMessage());
                    call.reject(e.getMessage());
                }
            });
        } catch (JSONException e) {
            call.reject("Invalid parameters: " + e.getMessage());
        }
    }

    /**
     * Query existing purchases. Results arrive via the "setPurchases" event.
     */
    @PluginMethod
    public void getPurchases(PluginCall call) {
        Log.d(TAG, "getPurchases()");
        queryPurchases();
        call.resolve();
    }

    /**
     * Initiate a purchase flow (INAPP).
     */
    @PluginMethod
    public void buy(PluginCall call) {
        Log.d(TAG, "buy()");
        try {
            final String productId = call.getString("productId");
            final JSONObject additionalData = call.getData().has("additionalData")
                    ? new JSONObject(call.getObject("additionalData").toString())
                    : new JSONObject();
            BillingFlowParams params =
                    parseBillingFlowParams(productId, additionalData, call);
            if (params != null) {
                initiatePurchaseFlow(params, call);
            }
            // If params == null, parseBillingFlowParams already called
            // call.reject().
        } catch (JSONException e) {
            call.reject(e.getMessage());
        }
    }

    /**
     * Initiate a subscription flow.
     */
    @PluginMethod
    public void subscribe(PluginCall call) {
        Log.d(TAG, "subscribe()");
        if (!areSubscriptionsSupported()) {
            call.reject("FEATURE_NOT_SUPPORTED");
            return;
        }
        try {
            final String productId = call.getString("productId");
            final JSONObject additionalData = call.getData().has("additionalData")
                    ? new JSONObject(call.getObject("additionalData").toString())
                    : new JSONObject();
            BillingFlowParams params =
                    parseBillingFlowParams(productId, additionalData, call);
            if (params != null) {
                initiatePurchaseFlow(params, call);
            }
        } catch (JSONException e) {
            call.reject(e.getMessage());
        }
    }

    /**
     * Consume a purchase.
     * CRITICAL 6: store PluginCall and resolve in async callback.
     */
    @PluginMethod
    public void consumePurchase(PluginCall call) {
        final String purchaseToken = call.getString("purchaseToken");
        Log.d(TAG, "consumePurchase(" + purchaseToken + ")");

        if (mTokensToBeConsumed.contains(purchaseToken)) {
            Log.i(TAG, "consumePurchase() -> Consume already in progress.");
            call.reject("ITEM_ALREADY_CONSUMED");
            return;
        }
        mTokensToBeConsumed.add(purchaseToken);
        mPendingConsumeCall = call;

        executeServiceRequest(() -> {
            final ConsumeParams params = ConsumeParams.newBuilder()
                    .setPurchaseToken(purchaseToken)
                    .build();
            mBillingClient.consumeAsync(params, (result, token) -> {
                onConsumeResponse(result, token);
            });
        });
    }

    /**
     * Acknowledge a purchase.
     * CRITICAL 6: store PluginCall and resolve in async callback.
     */
    @PluginMethod
    public void acknowledgePurchase(PluginCall call) {
        final String purchaseToken = call.getString("purchaseToken");
        Log.d(TAG, "acknowledgePurchase(" + purchaseToken + ")");

        mPendingAcknowledgeCall = call;

        executeServiceRequest(() -> {
            final AcknowledgePurchaseParams params =
                    AcknowledgePurchaseParams.newBuilder()
                            .setPurchaseToken(purchaseToken)
                            .build();
            mBillingClient.acknowledgePurchase(params, result -> {
                onAcknowledgePurchaseResponse(result);
            });
        });
    }

    /**
     * Finish/acknowledge a transaction (generic form used by the bridge).
     * For Android this is an alias for acknowledgePurchase using
     * transactionId as the purchase token.
     */
    @PluginMethod
    public void finish(PluginCall call) {
        final String transactionId = call.getString("transactionId");
        Log.d(TAG, "finish(" + transactionId + ")");

        mPendingAcknowledgeCall = call;

        executeServiceRequest(() -> {
            final AcknowledgePurchaseParams params =
                    AcknowledgePurchaseParams.newBuilder()
                            .setPurchaseToken(transactionId)
                            .build();
            mBillingClient.acknowledgePurchase(params, result -> {
                onAcknowledgePurchaseResponse(result);
            });
        });
    }

    /**
     * CRITICAL 7: open subscription management via Intent deep link.
     */
    @PluginMethod
    public void manageSubscriptions(PluginCall call) {
        Intent browserIntent = new Intent(Intent.ACTION_VIEW,
                Uri.parse("http://play.google.com/store/account/subscriptions"));
        getActivity().startActivity(browserIntent);
        call.resolve();
    }

    /**
     * CRITICAL 7: open billing management via Intent deep link.
     */
    @PluginMethod
    public void manageBilling(PluginCall call) {
        Intent browserIntent = new Intent(Intent.ACTION_VIEW,
                Uri.parse("http://play.google.com/store/paymentmethods"));
        getActivity().startActivity(browserIntent);
        call.resolve();
    }

    /**
     * CRITICAL 7: launch price change confirmation flow via deep link.
     */
    @PluginMethod
    public void launchPriceChangeConfirmationFlow(PluginCall call) {
        final String sku = call.getString("productId");
        Log.d(TAG, "launchPriceChangeConfirmationFlow(" + sku + ")");
        Intent browserIntent = new Intent(Intent.ACTION_VIEW,
                Uri.parse("http://play.google.com/store/account/subscriptions"));
        getActivity().startActivity(browserIntent);
        call.resolve();
    }

    // -------------------------------------------------------------------------
    // PurchasesUpdatedListener — called by BillingClient after purchase flow
    // -------------------------------------------------------------------------

    @Override
    public void onPurchasesUpdated(final BillingResult result,
                                   final List<Purchase> purchases) {
        try {
            final int code = result.getResponseCode();
            if (code == BillingResponseCode.OK
                    && purchases != null && purchases.size() > 0) {
                Log.d(TAG, "onPurchasesUpdated() -> Success");
                for (Purchase p : purchases) {
                    storePurchase(p);
                }
                JSObject data = new JSObject();
                data.put("purchases", purchasesToJson(purchases));
                notifyListeners("purchasesUpdated", data);
                if (mPendingBuyCall != null) {
                    mPendingBuyCall.resolve();
                    mPendingBuyCall = null;
                }
            } else if (code == BillingResponseCode.USER_CANCELED) {
                Log.w(TAG, "onPurchasesUpdated() -> Cancelled: "
                        + format(result));
                if (mPendingBuyCall != null) {
                    mPendingBuyCall.reject("USER_CANCELED", String.valueOf(code));
                    mPendingBuyCall = null;
                }
            } else {
                Log.w(TAG, "onPurchasesUpdated() -> Failed: "
                        + format(result));
                if (mPendingBuyCall != null) {
                    mPendingBuyCall.reject(format(result), String.valueOf(code));
                    mPendingBuyCall = null;
                }
            }
        } catch (JSONException e) {
            Log.w(TAG, "onPurchasesUpdated() -> JSONException "
                    + e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // ConsumeResponseListener — CRITICAL 5
    // -------------------------------------------------------------------------

    private void onConsumeResponse(BillingResult result,
                                   String purchaseToken) {
        try {
            Log.d(TAG, "onConsumeResponse()");
            if (result.getResponseCode() == BillingResponseCode.OK) {
                mTokensToBeConsumed.remove(purchaseToken);
                final Purchase purchase = findPurchaseByToken(purchaseToken);
                Log.d(TAG, "onConsumeResponse() -> Success");
                // CRITICAL 5: send full Purchase JSON under "purchase" key
                if (purchase != null) {
                    JSObject eventData = new JSObject();
                    eventData.put("purchase", purchaseToJson(purchase));
                    notifyListeners("purchaseConsumed", eventData);
                }
                // Resolve the pending call
                if (mPendingConsumeCall != null) {
                    mPendingConsumeCall.resolve();
                    mPendingConsumeCall = null;
                }
            } else {
                Log.d(TAG, "onConsumeResponse() -> Failed: "
                        + result.getDebugMessage());
                if (mPendingConsumeCall != null) {
                    mPendingConsumeCall.reject(result.getDebugMessage());
                    mPendingConsumeCall = null;
                }
            }
        } catch (JSONException e) {
            Log.d(TAG, "onConsumeResponse() -> Failed: " + e.getMessage());
            if (mPendingConsumeCall != null) {
                mPendingConsumeCall.reject(e.getMessage());
                mPendingConsumeCall = null;
            }
        }
    }

    // -------------------------------------------------------------------------
    // AcknowledgePurchaseResponseListener
    // -------------------------------------------------------------------------

    private void onAcknowledgePurchaseResponse(BillingResult result) {
        if (result.getResponseCode() == BillingResponseCode.OK) {
            Log.d(TAG, "onAcknowledgePurchaseResponse() -> Success");
            if (mPendingAcknowledgeCall != null) {
                mPendingAcknowledgeCall.resolve();
                mPendingAcknowledgeCall = null;
            }
        } else {
            Log.d(TAG, "onAcknowledgePurchaseResponse() -> Failed: "
                    + format(result));
            if (mPendingAcknowledgeCall != null) {
                mPendingAcknowledgeCall.reject(format(result));
                mPendingAcknowledgeCall = null;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Purchase queries
    // -------------------------------------------------------------------------

    private void queryPurchases() {
        Log.d(TAG, "queryPurchases()");
        executeServiceRequest(() -> {
            long time = System.currentTimeMillis();

            final List<Purchase> allPurchases = new ArrayList<>();
            mInAppResult = null;
            mSubsResult = null;

            mBillingClient.queryPurchasesAsync(
                    QueryPurchasesParams.newBuilder()
                            .setProductType(ProductType.INAPP).build(),
                    (billingResult, purchases) -> {
                        mInAppResult = billingResult;
                        Log.i(TAG, "queryPurchases(INAPP) -> Elapsed time: "
                                + (System.currentTimeMillis() - time) + "ms");
                        if (billingResult.getResponseCode()
                                == BillingResponseCode.OK) {
                            allPurchases.addAll(purchases);
                        }
                        if (mInAppResult != null
                                && (mSubsResult != null
                                || !areSubscriptionsSupported())) {
                            BillingResult best =
                                    mInAppResult.getResponseCode()
                                            == BillingResponseCode.OK
                                            ? mInAppResult : mSubsResult;
                            onQueryPurchasesFinished(best, allPurchases);
                        }
                    });

            if (areSubscriptionsSupported()) {
                mBillingClient.queryPurchasesAsync(
                        QueryPurchasesParams.newBuilder()
                                .setProductType(ProductType.SUBS).build(),
                        (billingResult, purchases) -> {
                            mSubsResult = billingResult;
                            Log.i(TAG,
                                    "queryPurchases(SUBS) -> Elapsed time: "
                                            + (System.currentTimeMillis()
                                            - time) + "ms");
                            if (billingResult.getResponseCode()
                                    == BillingResponseCode.OK) {
                                allPurchases.addAll(purchases);
                            }
                            if (mInAppResult != null
                                    && (mSubsResult != null
                                    || !areSubscriptionsSupported())) {
                                BillingResult best =
                                        mInAppResult.getResponseCode()
                                                == BillingResponseCode.OK
                                                ? mInAppResult : mSubsResult;
                                onQueryPurchasesFinished(best, allPurchases);
                            }
                        });
            } else {
                Log.i(TAG, "queryPurchases() -> "
                        + "Subscriptions are not supported, skipped.");
            }
        });
    }

    private void onQueryPurchasesFinished(final BillingResult result,
                                          final List<Purchase> purchases) {
        try {
            if (result.getResponseCode() == BillingResponseCode.OK) {
                for (Purchase p : purchases) {
                    storePurchase(p);
                }
                JSObject data = new JSObject();
                data.put("purchases", purchasesToJson(purchases));
                notifyListeners("setPurchases", data);
            } else {
                Log.d(TAG, result.getDebugMessage());
            }
        } catch (Exception e) {
            Log.e(TAG, "onQueryPurchasesFinished() -> Failed: "
                    + e.getMessage());
        }
    }

    // -------------------------------------------------------------------------
    // Product details queries
    // -------------------------------------------------------------------------

    private void queryAllProductDetails(
            List<String> inAppProductIds,
            List<String> subsProductIds,
            final InternalProductDetailsResponseListener listener) {
        Log.d(TAG, "queryAllProductDetails()");
        final ArrayList<ProductDetails> allProducts = new ArrayList<>();

        final int nRequests =
                (subsProductIds.size() > 0 ? 1 : 0)
                        + (inAppProductIds.size() > 0 ? 1 : 0);
        nProductDetailsQuerySuccessful = 0;

        final InternalProductDetailsResponseListener queryListener =
                (result, productDetailsList) -> {
            mBillingClientResult = result;
            if (result.getResponseCode() != BillingResponseCode.OK) {
                Log.w(TAG, "queryAllProductDetails() -> Failed: "
                        + "Unsuccessful query. " + format(result));
                // Don't call listener on failure — let the other query finish
            } else {
                if (productDetailsList != null
                        && productDetailsList.size() > 0) {
                    for (ProductDetails product : productDetailsList) {
                        Log.d(TAG,
                                "queryAllProductDetails() -> ProductDetails: "
                                        + "Title: " + product.getTitle());
                        mProductDetails.put(product.getProductId(), product);
                        allProducts.add(product);
                    }
                } else {
                    Log.w(TAG,
                            "queryAllProductDetails() -> Query returned nothing.");
                }
                nProductDetailsQuerySuccessful++;
                if (nProductDetailsQuerySuccessful == nRequests
                        && listener != null) {
                    Log.d(TAG,
                            "queryAllProductDetails() -> Calling listener.");
                    listener.onProductDetailsResponse(result, allProducts);
                }
            }
        };

        List<Product> subsList = new ArrayList<>();
        for (int i = 0; i < subsProductIds.size(); ++i) {
            subsList.add(Product.newBuilder()
                    .setProductId(subsProductIds.get(i))
                    .setProductType(ProductType.SUBS)
                    .build());
        }

        List<Product> inAppList = new ArrayList<>();
        for (int i = 0; i < inAppProductIds.size(); ++i) {
            inAppList.add(Product.newBuilder()
                    .setProductId(inAppProductIds.get(i))
                    .setProductType(ProductType.INAPP)
                    .build());
        }

        if (subsList.size() > 0) {
            Log.d(TAG, "queryAllProductDetails() -> Query SUBS.");
            queryProductDetailsAsync(subsList, queryListener);
        }

        if (inAppList.size() > 0) {
            Log.d(TAG, "queryAllProductDetails() -> Query INAPP.");
            queryProductDetailsAsync(inAppList, queryListener);
        }

        if (inAppList.size() == 0 && subsList.size() == 0) {
            Log.d(TAG,
                    "queryAllProductDetails() -> Calling listener (0 requests).");
            if (listener != null) {
                listener.onProductDetailsResponse(getLastResult(), allProducts);
            }
        }
    }

    private void queryProductDetailsAsync(
            final List<Product> productList,
            final InternalProductDetailsResponseListener listener) {
        Log.d(TAG, "queryProductDetailsAsync()");
        executeServiceRequest(() -> {
            if (getLastResponseCode() != BillingResponseCode.OK) {
                Log.d(TAG, "queryProductDetailsAsync() -> Failed: "
                        + format(getLastResult()));
                listener.onProductDetailsResponse(getLastResult(), null);
            } else {
                Log.d(TAG, "queryProductDetailsAsync() -> Success");
                QueryProductDetailsParams.Builder params =
                        QueryProductDetailsParams.newBuilder();
                params.setProductList(productList);
                mBillingClient.queryProductDetailsAsync(params.build(),
                        (billingResult, queryResult) -> {
                    List<ProductDetails> productDetailsList =
                            queryResult != null
                                    ? queryResult.getProductDetailsList()
                                    : null;
                    listener.onProductDetailsResponse(
                            billingResult, productDetailsList);
                });
            }
        });
    }

    // -------------------------------------------------------------------------
    // Purchase flow
    // -------------------------------------------------------------------------

    private BillingFlowParams parseBillingFlowParams(
            String productId,
            JSONObject additionalData,
            PluginCall call) throws JSONException {

        // Handle "productId@offerToken" syntax
        final String[] parts = productId.split("@", 2);
        String offerToken = null;
        if (parts.length == 2) {
            productId = parts[0];
            offerToken = parts[1];
        }

        if (offerToken == null && additionalData.has("offerToken")) {
            offerToken = additionalData.getString("offerToken");
        }

        String oldPurchaseToken = null;
        if (additionalData.has("oldPurchaseToken")) {
            oldPurchaseToken = additionalData.getString("oldPurchaseToken");
        }

        final String accountId = additionalData.has("accountId")
                ? additionalData.getString("accountId") : null;

        final String profileId = additionalData.has("profileId")
                ? additionalData.getString("profileId") : null;

        final ProductDetails productDetails = mProductDetails.get(productId);
        if (productDetails == null) {
            Log.d(TAG, "buy() -> Failed: Product not registered: "
                    + productId);
            call.reject("Product not registered: " + productId);
            return null;
        }

        BillingFlowParams.Builder params = BillingFlowParams.newBuilder();

        // If not passed in additionalData, use the offer token based on the
        // selected offer index.
        final List<SubscriptionOfferDetails> subscriptionOfferDetails =
                productDetails.getSubscriptionOfferDetails();
        if (offerToken == null && subscriptionOfferDetails != null) {
            offerToken = subscriptionOfferDetails.get(0).getOfferToken();
        }

        List<ProductDetailsParams> productDetailsParamsList = new ArrayList<>();
        if (offerToken != null) {
            productDetailsParamsList.add(ProductDetailsParams.newBuilder()
                    .setProductDetails(productDetails)
                    .setOfferToken(offerToken)
                    .build());
        } else {
            productDetailsParamsList.add(ProductDetailsParams.newBuilder()
                    .setProductDetails(productDetails)
                    .build());
        }

        BillingFlowParams.SubscriptionUpdateParams.Builder
                subscriptionUpdateParams =
                BillingFlowParams.SubscriptionUpdateParams.newBuilder();
        boolean hasSubscriptionUpdateParams = false;

        params.setProductDetailsParamsList(productDetailsParamsList);

        if (oldPurchaseToken != null) {
            Log.d(TAG, "buy() -> setOldSkuPurchaseToken");
            subscriptionUpdateParams.setOldPurchaseToken(oldPurchaseToken);
            hasSubscriptionUpdateParams = true;
        }

        if (accountId != null) {
            Log.d(TAG, "buy() -> setObfuscatedAccountId");
            params.setObfuscatedAccountId(accountId);
        }

        if (profileId != null) {
            Log.d(TAG, "buy() -> setObfuscatedProfileId");
            params.setObfuscatedProfileId(profileId);
        }

        // Subscription replacement mode
        final String replacementMode = additionalData.has("prorationMode")
                ? additionalData.getString("prorationMode")
                : additionalData.has("replacementMode")
                ? additionalData.getString("replacementMode")
                : null;
        if (replacementMode != null) {
            if ("IMMEDIATE_WITH_TIME_PRORATION".equals(replacementMode))
                subscriptionUpdateParams.setSubscriptionReplacementMode(
                        BillingFlowParams.SubscriptionUpdateParams
                                .ReplacementMode.WITH_TIME_PRORATION);
            else if ("IMMEDIATE_AND_CHARGE_PRORATED_PRICE".equals(
                    replacementMode))
                subscriptionUpdateParams.setSubscriptionReplacementMode(
                        BillingFlowParams.SubscriptionUpdateParams
                                .ReplacementMode.CHARGE_PRORATED_PRICE);
            else if ("IMMEDIATE_WITHOUT_PRORATION".equals(replacementMode))
                subscriptionUpdateParams.setSubscriptionReplacementMode(
                        BillingFlowParams.SubscriptionUpdateParams
                                .ReplacementMode.WITHOUT_PRORATION);
            else if ("DEFERRED".equals(replacementMode))
                subscriptionUpdateParams.setSubscriptionReplacementMode(
                        BillingFlowParams.SubscriptionUpdateParams
                                .ReplacementMode.DEFERRED);
            else if ("IMMEDIATE_AND_CHARGE_FULL_PRICE".equals(replacementMode))
                subscriptionUpdateParams.setSubscriptionReplacementMode(
                        BillingFlowParams.SubscriptionUpdateParams
                                .ReplacementMode.CHARGE_FULL_PRICE);
        }

        if (hasSubscriptionUpdateParams) {
            params.setSubscriptionUpdateParams(
                    subscriptionUpdateParams.build());
        }

        return params.build();
    }

    private void initiatePurchaseFlow(final BillingFlowParams params,
                                      final PluginCall call) {
        Log.d(TAG, "initiatePurchaseFlow()");
        if (params == null) {
            return;
        }
        final Activity activity = getActivity();
        if (activity == null || activity.isFinishing()) {
            Log.e(TAG, "Activity is null or finishing, "
                    + "cannot launch billing flow.");
            call.reject("Activity not available to launch billing flow.");
            return;
        }
        executeServiceRequest(() -> {
            if (getLastResponseCode() != BillingResponseCode.OK) {
                Log.d(TAG, "initiatePurchaseFlow() -> Failed: "
                        + "Failed to execute service request. "
                        + format(getLastResult()));
                call.reject("Failed to execute service request. "
                        + format(getLastResult()));
                return;
            }
            Log.d(TAG, "Attempting to launch billing flow on UI thread.");
            activity.runOnUiThread(() -> {
                Log.d(TAG, "launchBillingFlow happening now.");
                BillingResult billingResult =
                        mBillingClient.launchBillingFlow(activity, params);
                Log.d(TAG, "launchBillingFlow immediate result: "
                        + format(billingResult));
                if (billingResult.getResponseCode() == BillingResponseCode.OK) {
                    mPendingBuyCall = call;
                } else {
                    Log.e(TAG,
                            "launchBillingFlow failed immediately with code: "
                                    + format(billingResult));
                    call.reject("launchBillingFlow failed: "
                            + format(billingResult));
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // Utility
    // -------------------------------------------------------------------------

    private List<String> jsonArrayToStringList(JSONArray arr)
            throws JSONException {
        List<String> list = new ArrayList<>();
        if (arr != null) {
            for (int i = 0; i < arr.length(); i++) {
                list.add(arr.getString(i));
            }
        }
        return list;
    }
}
