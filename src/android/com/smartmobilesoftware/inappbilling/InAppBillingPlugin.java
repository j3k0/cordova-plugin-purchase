/**
 * In App Billing Plugin
 * @author Guillaume Charhon - Smart Mobile Software
 * @modifications Brian Thurlow 10/16/13
 *
 */
package com.smartmobilesoftware.inappbilling;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import java.util.List;
import java.util.ArrayList;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;

import com.smartmobilesoftware.util.Purchase;
import com.smartmobilesoftware.util.IabHelper;
import com.smartmobilesoftware.util.IabResult;
import com.smartmobilesoftware.util.Inventory;
import com.smartmobilesoftware.util.SkuDetails;

import android.content.Intent;
import android.util.Log;

public class InAppBillingPlugin extends CordovaPlugin {
	private final Boolean ENABLE_DEBUG_LOGGING = true;
	private final String TAG = "CordovaPurchase";


    // (arbitrary) request code for the purchase flow
    static final int RC_REQUEST = 10001;

    // The helper object
    IabHelper mHelper;

    // A quite up to date inventory of available items and purchase items
    Inventory myInventory;

    CallbackContext callbackContext;

	@Override
	/**
	 * Called by each javascript plugin function
	 */
	public boolean execute(String action, JSONArray data, final CallbackContext callbackContext) {
		this.callbackContext = callbackContext;
		// Check if the action has a handler
		Boolean isValidAction = true;

		try {
			// Action selector
			if ("init".equals(action)) {
				final List<String> sku = new ArrayList<String>();
				if(data.length() > 0){
					JSONArray jsonSkuList = new JSONArray(data.getString(0));
					int len = jsonSkuList.length();
					Log.d(TAG, "Num SKUs Found: "+len);
	   			 for (int i=0;i<len;i++){
	    				sku.add(jsonSkuList.get(i).toString());
						Log.d(TAG, "Product SKU Added: "+jsonSkuList.get(i).toString());
	   			 }
				}
				// Initialize
				init(sku);
			} else if ("getPurchases".equals(action)) {
				// Get the list of purchases
				JSONArray jsonSkuList = new JSONArray();
				jsonSkuList = getPurchases();
	            // Call the javascript back
	            callbackContext.success(jsonSkuList);
			} else if ("buy".equals(action)) {
				// Buy an item
				// Get Product Id
				final String sku = data.getString(0);
				buy(sku);
			} else if ("subscribe".equals(action)) {
				// Subscribe to an item
				// Get Product Id
				final String sku = data.getString(0);
				subscribe(sku);
			} else if ("consumePurchase".equals(action)) {
				consumePurchase(data);
			} else if ("getAvailableProducts".equals(action)) {
				// Get the list of purchases
				JSONArray jsonSkuList = new JSONArray();
				jsonSkuList = getAvailableProducts();
	            // Call the javascript back
	            callbackContext.success(jsonSkuList);
			} else if ("getProductDetails".equals(action)) {
				JSONArray jsonSkuList = new JSONArray(data.getString(0));
				final List<String> sku = new ArrayList<String>();
				int len = jsonSkuList.length();
				Log.d(TAG, "Num SKUs Found: "+len);
   			 for (int i=0;i<len;i++){
    				sku.add(jsonSkuList.get(i).toString());
					Log.d(TAG, "Product SKU Added: "+jsonSkuList.get(i).toString());
   			 }
				getProductDetails(sku);
			} else {
				// No handler for the action
				isValidAction = false;
			}
		} catch (IllegalStateException e){
			callbackContext.error(IabHelper.ERR_UNKNOWN + "|" + e.getMessage());
		} catch (JSONException e){
			callbackContext.error(IabHelper.ERR_UNKNOWN + "|" + e.getMessage());
		}

		// Method not found
		return isValidAction;
	}

    private String getPublicKey() {
        int billingKeyFromParam = cordova.getActivity().getResources().getIdentifier("billing_key_param", "string", cordova.getActivity().getPackageName());
        String ret = "";

        if (billingKeyFromParam > 0) {
            ret = cordova.getActivity().getString(billingKeyFromParam);
            if (ret.length() > 0) {
                return ret;
            }
        }

        int billingKey = cordova.getActivity().getResources().getIdentifier("billing_key", "string", cordova.getActivity().getPackageName());
        return cordova.getActivity().getString(billingKey);
    }

	// Initialize the plugin
	private void init(final List<String> skus){
		Log.d(TAG, "init start");
		// Some sanity checks to see if the developer (that's you!) really followed the
        // instructions to run this plugin
        String base64EncodedPublicKey = getPublicKey();

	 	if (base64EncodedPublicKey.contains("CONSTRUCT_YOUR"))
	 		throw new RuntimeException("Please configure your app's public key.");

	 	// Create the helper, passing it our context and the public key to verify signatures with
        Log.d(TAG, "Creating IAB helper.");
        mHelper = new IabHelper(cordova.getActivity().getApplicationContext(), base64EncodedPublicKey);

        // enable debug logging (for a production application, you should set this to false).
        mHelper.enableDebugLogging(ENABLE_DEBUG_LOGGING);

        // Start setup. This is asynchronous and the specified listener
        // will be called once setup completes.
        Log.d(TAG, "Starting setup.");

        mHelper.startSetup(new IabHelper.OnIabSetupFinishedListener() {
            public void onIabSetupFinished(IabResult result) {
                Log.d(TAG, "Setup finished.");

                if (!result.isSuccess()) {
                    // Oh no, there was a problem.
                    callbackContext.error(IabHelper.ERR_SETUP + "|Problem setting up in-app billing: " + result);
                    return;
                }

                // Have we been disposed of in the meantime? If so, quit.
                if (mHelper == null) {
                	callbackContext.error(IabHelper.ERR_SETUP + "|The billing helper has been disposed");
                }

                // Hooray, IAB is fully set up. Now, let's get an inventory of stuff we own.
                if(skus.size() <= 0){
					Log.d(TAG, "Setup successful. Querying inventory.");
                	mHelper.queryInventoryAsync(mGotInventoryListener);
				}else{
					Log.d(TAG, "Setup successful. Querying inventory w/ SKUs.");
                    try{
                        mHelper.queryInventoryAsync(true, skus, mGotInventoryListener);
                    }catch(IllegalStateException ex){
                        Log.d("Catch IllegalStateException", ex.getMessage());
                    }
				}
            }
        });
    }

	// Buy an item
	private void buy(final String sku){
		/* TODO: for security, generate your payload here for verification. See the comments on
         *        verifyDeveloperPayload() for more info. Since this is a sample, we just use
         *        an empty string, but on a production app you should generate this. */
		final String payload = "";

		if (mHelper == null){
			callbackContext.error(IabHelper.ERR_PURCHASE + "|Billing plugin was not initialized");
			return;
		}

		this.cordova.setActivityResultCallback(this);

		mHelper.launchPurchaseFlow(cordova.getActivity(), sku, RC_REQUEST,
                mPurchaseFinishedListener, payload);

	}

	// Buy an item
	private void subscribe(final String sku){
		if (mHelper == null){
			callbackContext.error(IabHelper.ERR_PURCHASE + "|Billing plugin was not initialized");
			return;
		}
		if (!mHelper.subscriptionsSupported()) {
            callbackContext.error(IabHelper.ERR_SUBSCRIPTIONS_NOT_AVAILABLE + "|Subscriptions not supported on your device yet. Sorry!");
            return;
        }

		/* TODO: for security, generate your payload here for verification. See the comments on
         *        verifyDeveloperPayload() for more info. Since this is a sample, we just use
         *        an empty string, but on a production app you should generate this. */
		final String payload = "";



		this.cordova.setActivityResultCallback(this);
        Log.d(TAG, "Launching purchase flow for subscription.");

		mHelper.launchPurchaseFlow(cordova.getActivity(), sku, IabHelper.ITEM_TYPE_SUBS, RC_REQUEST, mPurchaseFinishedListener, payload);
	}


	// Get the list of purchases
	private JSONArray getPurchases() throws JSONException {
		// Get the list of owned items
		if(myInventory == null){
			callbackContext.error(IabHelper.ERR_REFRESH + "|Billing plugin was not initialized");
			return new JSONArray();
		}
        List<Purchase>purchaseList = myInventory.getAllPurchases();

        // Convert the java list to json
        JSONArray jsonPurchaseList = new JSONArray();
        for (Purchase p : purchaseList) {
	        // jsonPurchaseList.put(new JSONObject(p.getOriginalJson()));
            JSONObject purchaseJsonObject = new JSONObject(p.getOriginalJson());
            purchaseJsonObject.put("signature", p.getSignature());
            purchaseJsonObject.put("receipt", p.getOriginalJson().toString());
	        jsonPurchaseList.put(purchaseJsonObject);
        }

        return jsonPurchaseList;

	}

	// Get the list of available products
	private JSONArray getAvailableProducts(){
		// Get the list of owned items
		if(myInventory == null){
			callbackContext.error(IabHelper.ERR_LOAD + "|Billing plugin was not initialized");
			return new JSONArray();
		}
        List<SkuDetails>skuList = myInventory.getAllProducts();

		// Convert the java list to json
	    JSONArray jsonSkuList = new JSONArray();
		try{
	        for (SkuDetails sku : skuList) {
				Log.d(TAG, "SKUDetails: Title: "+sku.getTitle());
	        	jsonSkuList.put(sku.toJson());
	        }
		}catch (JSONException e){
			callbackContext.error(IabHelper.ERR_LOAD + "|" + e.getMessage());
		}
		return jsonSkuList;
	}

	//Get SkuDetails for skus
	private void getProductDetails(final List<String> skus){
		if (mHelper == null){
			callbackContext.error(IabHelper.ERR_LOAD + "|Billing plugin was not initialized");
			return;
		}

		Log.d(TAG, "Beginning Sku(s) Query!");
		mHelper.queryInventoryAsync(true, skus, mGotDetailsListener);
	}

	// Consume a purchase
	private void consumePurchase(JSONArray data) throws JSONException{

		if (mHelper == null){
			callbackContext.error(IabHelper.ERR_FINISH + "|Did you forget to initialize the plugin?");
			return;
		}

		String sku = data.getString(0);

		// Get the purchase from the inventory
		Purchase purchase = myInventory.getPurchase(sku);
		if (purchase != null)
			// Consume it
			mHelper.consumeAsync(purchase, mConsumeFinishedListener);
		else
			callbackContext.error(IabHelper.ERR_FINISH + "|" + sku + " is not owned so it cannot be consumed");
	}

	// Listener that's called when we finish querying the items and subscriptions we own
    IabHelper.QueryInventoryFinishedListener mGotInventoryListener = new IabHelper.QueryInventoryFinishedListener() {
        public void onQueryInventoryFinished(IabResult result, Inventory inventory) {
        	Log.d(TAG, "Inside mGotInventoryListener");
        	if (hasErrorsAndUpdateInventory(result, inventory)) return;

            Log.d(TAG, "Query inventory was successful.");
            callbackContext.success();

        }
    };
    // Listener that's called when we finish querying the details
    IabHelper.QueryInventoryFinishedListener mGotDetailsListener = new IabHelper.QueryInventoryFinishedListener() {
        public void onQueryInventoryFinished(IabResult result, Inventory inventory) {
            Log.d(TAG, "Inside mGotDetailsListener");
            if (hasErrorsAndUpdateInventory(result, inventory)) return;

            Log.d(TAG, "Query details was successful.");

            List<SkuDetails>skuList = inventory.getAllProducts();

            // Convert the java list to json
            JSONArray jsonSkuList = new JSONArray();
            try {
                for (SkuDetails sku : skuList) {
                    Log.d(TAG, "SKUDetails: Title: "+sku.getTitle());
                    jsonSkuList.put(sku.toJson());
                }
            } catch (JSONException e) {
                callbackContext.error(IabHelper.ERR_LOAD + "|" + e.getMessage());
            }
            callbackContext.success(jsonSkuList);
        }
    };

    // Check if there is any errors in the iabResult and update the inventory
    private Boolean hasErrorsAndUpdateInventory(IabResult result, Inventory inventory){
    	if (result.isFailure()) {
        	callbackContext.error(result.getResponse() + "|Failed to query inventory: " + result);
        	return true;
        }

        // Have we been disposed of in the meantime? If so, quit.
        if (mHelper == null) {
        	callbackContext.error(IabHelper.ERR_LOAD + "|The billing helper has been disposed");
        	return true;
        }

        // Update the inventory
        myInventory = inventory;

        return false;
    }

    // Callback for when a purchase is finished
    IabHelper.OnIabPurchaseFinishedListener mPurchaseFinishedListener = new IabHelper.OnIabPurchaseFinishedListener() {
        public void onIabPurchaseFinished(IabResult result, Purchase purchase) {
            Log.d(TAG, "Purchase finished: " + result + ", purchase: " + purchase);

            // Have we been disposed of in the meantime? If so, quit.
            if (mHelper == null) {
            	callbackContext.error(IabHelper.ERR_PURCHASE + "|The billing helper has been disposed");
            }

            if (result.isFailure()) {
            	callbackContext.error(result.getResponse() + "|Error purchasing: " + result);
                return;
            }

            if (!verifyDeveloperPayload(purchase)) {
            	callbackContext.error(IabHelper.ERR_PURCHASE + "|Error purchasing. Authenticity verification failed.");
                return;
            }

            Log.d(TAG, "Purchase successful.");

            // add the purchase to the inventory
            myInventory.addPurchase(purchase);

            // append the purchase signature & receipt to the json
            try {
                JSONObject purchaseJsonObject = new JSONObject(purchase.getOriginalJson());
                purchaseJsonObject.put("signature", purchase.getSignature());
                purchaseJsonObject.put("receipt", purchase.getOriginalJson().toString());
                callbackContext.success(purchaseJsonObject);
            } catch (JSONException e) {
                callbackContext.error(IabHelper.ERR_PURCHASE + "|Could not create JSON object from purchase object");
            }

        }
    };

    // Called when consumption is complete
    IabHelper.OnConsumeFinishedListener mConsumeFinishedListener = new IabHelper.OnConsumeFinishedListener() {
        public void onConsumeFinished(Purchase purchase, IabResult result) {
            Log.d(TAG, "Consumption finished. Purchase: " + purchase + ", result: " + result);

            // We know this is the "gas" sku because it's the only one we consume,
            // so we don't check which sku was consumed. If you have more than one
            // sku, you probably should check...
            if (result.isSuccess()) {
                // successfully consumed, so we apply the effects of the item in our
                // game world's logic

                // remove the item from the inventory
            	myInventory.erasePurchase(purchase.getSku());
                Log.d(TAG, "Consumption successful. .");

                callbackContext.success(purchase.getOriginalJson());

            }
            else {
                callbackContext.error(result.getResponse() + "|Error while consuming: " + result);
            }

        }
    };

    @Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d(TAG, "onActivityResult(" + requestCode + "," + resultCode + "," + data);

        // Pass on the activity result to the helper for handling
        if (!mHelper.handleActivityResult(requestCode, resultCode, data)) {
            // not handled, so handle it ourselves (here's where you'd
            // perform any handling of activity results not related to in-app
            // billing...
            super.onActivityResult(requestCode, resultCode, data);
        }
        else {
            Log.d(TAG, "onActivityResult handled by IABUtil.");
        }
    }

    /** Verifies the developer payload of a purchase. */
    boolean verifyDeveloperPayload(Purchase p) {
        @SuppressWarnings("unused")
		String payload = p.getDeveloperPayload();

        /*
         * TODO: verify that the developer payload of the purchase is correct. It will be
         * the same one that you sent when initiating the purchase.
         *
         * WARNING: Locally generating a random string when starting a purchase and
         * verifying it here might seem like a good approach, but this will fail in the
         * case where the user purchases an item on one device and then uses your app on
         * a different device, because on the other device you will not have access to the
         * random string you originally generated.
         *
         * So a good developer payload has these characteristics:
         *
         * 1. If two different users purchase an item, the payload is different between them,
         *    so that one user's purchase can't be replayed to another user.
         *
         * 2. The payload must be such that you can verify it even when the app wasn't the
         *    one who initiated the purchase flow (so that items purchased by the user on
         *    one device work on other devices owned by the user).
         *
         * Using your own server to store and verify developer payloads across app
         * installations is recommended.
         */

        return true;
    }

    // We're being destroyed. It's important to dispose of the helper here!
    @Override
    public void onDestroy() {
    	super.onDestroy();

    	// very important:
    	Log.d(TAG, "Destroying helper.");
    	if (mHelper != null) {
    		mHelper.dispose();
    		mHelper = null;
    	}
    }

}
