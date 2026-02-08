/**
 * The Cordova Purchase Plugin for Amazon AppStore.
 *
 * The plugin has methods for:
 *
 * - initializing the Amazon IAP SDK,
 * - querying product details
 * - making purchases
 * - fulfilling consumable purchases.
 * - handling purchase updates and errors.
 */

package cc.fovea;

import android.util.Log;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.amazon.device.iap.PurchasingService;
import com.amazon.device.iap.PurchasingListener;
import com.amazon.device.iap.model.FulfillmentResult;
import com.amazon.device.iap.model.Product;
import com.amazon.device.iap.model.ProductDataResponse;
import com.amazon.device.iap.model.ProductType;
import com.amazon.device.iap.model.PurchaseResponse;
import com.amazon.device.iap.model.PurchaseUpdatesResponse;
import com.amazon.device.iap.model.Receipt;
import com.amazon.device.iap.model.UserData;
import com.amazon.device.iap.model.UserDataResponse;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Plugin implementation for Amazon AppStore.
 */
public final class AmazonPurchasePlugin
        extends CordovaPlugin
        implements PurchasingListener {

    /** Tag used for log messages. */
    private final String mTag = "CdvPurchase/Amazon";

    /** Context for the last plugin call. */
    private CallbackContext mCallbackContext;

    /** Callback context for the listener. */
    private CallbackContext mListenerContext;

    /** Callback context for getProductData calls. */
    private CallbackContext mGetProductDataCallback;

    /** Callback context for purchase calls. */
    private CallbackContext mPurchaseCallback;

    /** Callback context for getPurchaseUpdates calls. */
    private CallbackContext mGetPurchaseUpdatesCallback;

    /** Current user data. */
    private UserData mUserData;

    /** Whether the plugin is initialized. */
    private boolean mInitialized = false;

    @Override
    public void initialize(final CordovaInterface cordova, final CordovaWebView webView) {
        super.initialize(cordova, webView);
        Log.d(mTag, "initialize()");
    }

    @Override
    public boolean execute(final String action, final JSONArray args,
                           final CallbackContext callbackContext) throws JSONException {
        Log.d(mTag, "execute(" + action + ")");

        if ("setListener".equals(action)) {
            mListenerContext = callbackContext;
            sendNoResult(callbackContext);
            return true;
        }

        if ("init".equals(action)) {
            mCallbackContext = callbackContext;
            initAmazonIAP();
            return true;
        }

        if ("getProductData".equals(action)) {
            mGetProductDataCallback = callbackContext;
            JSONArray skusArray = args.getJSONArray(0);
            Set<String> skus = new HashSet<>();
            for (int i = 0; i < skusArray.length(); i++) {
                skus.add(skusArray.getString(i));
            }
            PurchasingService.getProductData(skus);
            return true;
        }

        if ("purchase".equals(action)) {
            mPurchaseCallback = callbackContext;
            String productId = args.getString(0);
            PurchasingService.purchase(productId);
            return true;
        }

        if ("notifyFulfillment".equals(action)) {
            String receiptId = args.getString(0);
            PurchasingService.notifyFulfillment(receiptId, FulfillmentResult.FULFILLED);
            callbackContext.success();
            return true;
        }

        if ("getPurchaseUpdates".equals(action)) {
            mGetPurchaseUpdatesCallback = callbackContext;
            PurchasingService.getPurchaseUpdates(false);
            return true;
        }

        return false;
    }

    /**
     * Initialize the Amazon IAP SDK.
     */
    private void initAmazonIAP() {
        Log.d(mTag, "initAmazonIAP()");
        try {
            PurchasingService.registerListener(cordova.getActivity().getApplicationContext(), this);
            PurchasingService.getUserData();
            mInitialized = true;
        } catch (Exception e) {
            Log.e(mTag, "Failed to initialize Amazon IAP: " + e.getMessage());
            if (mCallbackContext != null) {
                mCallbackContext.error("Failed to initialize Amazon IAP: " + e.getMessage());
                mCallbackContext = null;
            }
        }
    }

    // ---- PurchasingListener implementation ----

    @Override
    public void onUserDataResponse(final UserDataResponse response) {
        Log.d(mTag, "onUserDataResponse: " + response.getRequestStatus());

        switch (response.getRequestStatus()) {
            case SUCCESSFUL:
                mUserData = response.getUserData();
                Log.d(mTag, "User ID: " + mUserData.getUserId() + ", Marketplace: " + mUserData.getMarketplace());
                if (mCallbackContext != null) {
                    mCallbackContext.success();
                    mCallbackContext = null;
                }
                // Get initial purchase updates
                PurchasingService.getPurchaseUpdates(false);
                break;
            case FAILED:
            case NOT_SUPPORTED:
                Log.e(mTag, "onUserDataResponse failed: " + response.getRequestStatus());
                if (mCallbackContext != null) {
                    mCallbackContext.error("Failed to get user data: " + response.getRequestStatus());
                    mCallbackContext = null;
                }
                break;
        }
    }

    @Override
    public void onProductDataResponse(final ProductDataResponse response) {
        Log.d(mTag, "onProductDataResponse: " + response.getRequestStatus());

        if (mGetProductDataCallback == null) return;

        switch (response.getRequestStatus()) {
            case SUCCESSFUL:
                try {
                    JSONObject result = new JSONObject();
                    JSONArray productsArray = new JSONArray();

                    Map<String, Product> products = response.getProductData();
                    for (Map.Entry<String, Product> entry : products.entrySet()) {
                        Product product = entry.getValue();
                        JSONObject productJson = new JSONObject();
                        productJson.put("productId", product.getSku());
                        productJson.put("title", product.getTitle());
                        productJson.put("description", product.getDescription());
                        productJson.put("price", product.getPrice());
                        productJson.put("productType", product.getProductType().toString());
                        productsArray.put(productJson);
                    }
                    result.put("products", productsArray);

                    JSONArray unavailableArray = new JSONArray();
                    Set<String> unavailable = response.getUnavailableSkus();
                    for (String sku : unavailable) {
                        unavailableArray.put(sku);
                    }
                    result.put("unavailableSkus", unavailableArray);

                    mGetProductDataCallback.success(result);
                } catch (JSONException e) {
                    mGetProductDataCallback.error("Error parsing product data: " + e.getMessage());
                }
                mGetProductDataCallback = null;
                break;
            case FAILED:
            case NOT_SUPPORTED:
                mGetProductDataCallback.error("getProductData failed: " + response.getRequestStatus());
                mGetProductDataCallback = null;
                break;
        }
    }

    @Override
    public void onPurchaseResponse(final PurchaseResponse response) {
        Log.d(mTag, "onPurchaseResponse: " + response.getRequestStatus());

        switch (response.getRequestStatus()) {
            case SUCCESSFUL:
                Receipt receipt = response.getReceipt();
                try {
                    JSONObject purchaseJson = receiptToJson(receipt);
                    // Notify listener about the purchase
                    sendPurchasesUpdated(new JSONArray().put(purchaseJson));
                } catch (JSONException e) {
                    Log.e(mTag, "Error creating purchase JSON: " + e.getMessage());
                }
                if (mPurchaseCallback != null) {
                    mPurchaseCallback.success();
                    mPurchaseCallback = null;
                }
                break;
            case FAILED:
                if (mPurchaseCallback != null) {
                    mPurchaseCallback.error("Purchase failed");
                    mPurchaseCallback = null;
                }
                break;
            case INVALID_SKU:
                if (mPurchaseCallback != null) {
                    mPurchaseCallback.error("Invalid SKU");
                    mPurchaseCallback = null;
                }
                break;
            case ALREADY_PURCHASED:
                if (mPurchaseCallback != null) {
                    mPurchaseCallback.error("Already purchased");
                    mPurchaseCallback = null;
                }
                break;
            case NOT_SUPPORTED:
                if (mPurchaseCallback != null) {
                    mPurchaseCallback.error("Not supported");
                    mPurchaseCallback = null;
                }
                break;
        }
    }

    @Override
    public void onPurchaseUpdatesResponse(final PurchaseUpdatesResponse response) {
        Log.d(mTag, "onPurchaseUpdatesResponse: " + response.getRequestStatus());

        switch (response.getRequestStatus()) {
            case SUCCESSFUL:
                try {
                    JSONArray purchasesArray = new JSONArray();
                    List<Receipt> receipts = response.getReceipts();
                    for (Receipt receipt : receipts) {
                        if (!receipt.isCanceled()) {
                            purchasesArray.put(receiptToJson(receipt));
                        }
                    }

                    // If this is during init, send as setPurchases
                    if (mListenerContext != null) {
                        sendSetPurchases(purchasesArray);
                    }

                    // If there are more pages, get them
                    if (response.hasMore()) {
                        PurchasingService.getPurchaseUpdates(false);
                    }

                    if (mGetPurchaseUpdatesCallback != null) {
                        mGetPurchaseUpdatesCallback.success();
                        mGetPurchaseUpdatesCallback = null;
                    }
                } catch (JSONException e) {
                    Log.e(mTag, "Error parsing purchase updates: " + e.getMessage());
                    if (mGetPurchaseUpdatesCallback != null) {
                        mGetPurchaseUpdatesCallback.error("Error parsing purchase updates: " + e.getMessage());
                        mGetPurchaseUpdatesCallback = null;
                    }
                }
                break;
            case FAILED:
            case NOT_SUPPORTED:
                Log.e(mTag, "onPurchaseUpdatesResponse failed: " + response.getRequestStatus());
                if (mGetPurchaseUpdatesCallback != null) {
                    mGetPurchaseUpdatesCallback.error("getPurchaseUpdates failed: " + response.getRequestStatus());
                    mGetPurchaseUpdatesCallback = null;
                }
                break;
        }
    }

    // ---- Helper methods ----

    /**
     * Convert an Amazon Receipt to a JSON object.
     */
    private JSONObject receiptToJson(final Receipt receipt) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("receiptId", receipt.getReceiptId());
        json.put("productId", receipt.getSku());
        json.put("productType", receipt.getProductType().toString());
        json.put("purchaseDate", receipt.getPurchaseDate() != null ? receipt.getPurchaseDate().getTime() : 0);
        json.put("canceled", receipt.isCanceled());
        if (mUserData != null) {
            json.put("userId", mUserData.getUserId());
            json.put("marketplace", mUserData.getMarketplace());
        }
        return json;
    }

    /**
     * Send setPurchases message to the listener.
     */
    private void sendSetPurchases(final JSONArray purchases) {
        if (mListenerContext == null) return;
        try {
            JSONObject msg = new JSONObject();
            msg.put("type", "setPurchases");
            JSONObject data = new JSONObject();
            data.put("purchases", purchases);
            msg.put("data", data);
            sendToListener(msg);
        } catch (JSONException e) {
            Log.e(mTag, "Error sending setPurchases: " + e.getMessage());
        }
    }

    /**
     * Send purchasesUpdated message to the listener.
     */
    private void sendPurchasesUpdated(final JSONArray purchases) {
        if (mListenerContext == null) return;
        try {
            JSONObject msg = new JSONObject();
            msg.put("type", "purchasesUpdated");
            JSONObject data = new JSONObject();
            data.put("purchases", purchases);
            msg.put("data", data);
            sendToListener(msg);
        } catch (JSONException e) {
            Log.e(mTag, "Error sending purchasesUpdated: " + e.getMessage());
        }
    }

    /**
     * Send a message to the JavaScript listener.
     */
    private void sendToListener(final JSONObject msg) {
        if (mListenerContext != null) {
            PluginResult result = new PluginResult(PluginResult.Status.OK, msg);
            result.setKeepCallback(true);
            mListenerContext.sendPluginResult(result);
        }
    }

    /**
     * Send a no-result response that keeps the callback active.
     */
    private void sendNoResult(final CallbackContext callbackContext) {
        PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        result.setKeepCallback(true);
        callbackContext.sendPluginResult(result);
    }
}
