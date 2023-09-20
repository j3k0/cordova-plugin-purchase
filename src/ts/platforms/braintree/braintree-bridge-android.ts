namespace CdvPurchase {

    export namespace Braintree {

        /**
         * Cordova plugin ID for the braintree plugin.
         */
        const PLUGIN_ID = 'BraintreePlugin';

        export namespace AndroidBridge {

            /**
             * Message received by the native plugin.
             */
            export type Message =
                | { type: "ready"; }
                | { type: "getClientToken"; }
                ;

            export type ClientTokenProvider = (callback: Callback<string | IError>) => void;

            /**
             * Bridge to access native functions.
             *
             * This tries to export pretty raw functions from the underlying native SDKs.
             */
            export class Bridge {

                private log: Logger;
                private clientTokenProvider?: ClientTokenProvider;

                constructor(log: Logger) {
                    this.log = log.child("AndroidBridge");
                }

                /** Receive asynchronous messages from the native side */
                private listener(msg: Message) {
                    // Handle changes to purchase that are being notified
                    // through the PurchasesUpdatedListener on the native side (android)
                    this.log.debug('listener: ' + JSON.stringify(msg));
                    if (!msg || !msg.type) {
                        return;
                    }

                    if (msg.type === "getClientToken") {
                        this.getClientToken();
                    }
                    else if (msg.type === "ready") {
                    }
                }

                // Braintree reported an error
                // private onError(message: string) {
                //     this.log.warn("Braintree reported an error: " + message);
                //     // TODO - bubble that up to the client
                // }

                /*
                 * Initialize the braintree client.
                 *
                 * @param clientTokenProvider Provide clientTokens to the SDK when it needs them.
                 */
                initialize(clientTokenProvider: ClientTokenProvider | string, callback: Callback<IError | undefined>) {
                    try {
                        // Set a listener (see "listener()" function above)
                        if (typeof clientTokenProvider === 'string') {
                            const token = clientTokenProvider;
                            this.clientTokenProvider = (callback) => { callback(token); }
                        }
                        else {
                            this.clientTokenProvider = clientTokenProvider;
                        }
                        this.log.info("exec.setListener()");
                        const listener = this.listener.bind(this);
                        window.cordova.exec(listener, null, PLUGIN_ID, "setListener", []);
                        callback(undefined);
                    }
                    catch (err) {
                        this.log.warn("initialization failed: " + (err as Error)?.message);
                        callback(braintreeError(ErrorCode.SETUP, 'Failed to initialize Braintree Android Bridge: ' + (err as Error)?.message));
                    }
                }

                /**
                 * Fetches a client token and sends it to the SDK.
                 *
                 * This method is called by the native side when the SDK requests a Client Token.
                 */
                private getClientToken() {
                    this.log.info("getClientToken()");
                    if (this.clientTokenProvider) {
                        this.log.debug("clientTokenProvider set, calling.");
                        this.clientTokenProvider((value: string | IError) => {
                            if (typeof value === 'string') {
                                window.cordova.exec(null, null, PLUGIN_ID, "onClientTokenSuccess", [value]);
                            }
                            else {
                                window.cordova.exec(null, null, PLUGIN_ID, "onClientTokenFailure", [value.code, value.message]);
                            }
                        });
                    }
                    else {
                        this.log.debug("clientTokenProvider not set, retrying later...");
                        setTimeout(() => this.getClientToken(), 1000); // retry after 1s (over and over)
                    }
                }

                /** Returns true on Android, the only platform supported by this Braintree bridge */
                static isSupported() {
                    return window.cordova.platformId === 'android';
                }

                async isApplePaySupported(): Promise<boolean> {
                    return false;
                }

                launchDropIn(dropInRequest: DropIn.Request): Promise<DropIn.Result | IError> {
                    return new Promise(resolve => {
                        window.cordova.exec(
                            (result: DropIn.Result) => { // dropInSuccess
                                this.log.info("dropInSuccess: " + JSON.stringify(result));
                                resolve(result);
                            },
                            (err: string) => { // dropInFailure
                                this.log.info("dropInFailure: " + err);
                                const errCode = err.split("|")[0];
                                const errMessage = err.split("|").slice(1).join('');
                                if (errCode === "UserCanceledException") {
                                    resolve(braintreeError(ErrorCode.PAYMENT_CANCELLED, errMessage));
                                }
                                else if (errCode === "AuthorizationException") {
                                    resolve(braintreeError(ErrorCode.UNAUTHORIZED_REQUEST_DATA, errMessage));
                                }
                                else {
                                    resolve(braintreeError(ErrorCode.UNKNOWN, err));
                                }
                            },
                            PLUGIN_ID, "launchDropIn", [dropInRequest]);
                    });
                }

                /**
                 * Used to initialize the Braintree client.
                 *
                 * @param clientToken The client token key to use with the Braintree client.
                 * @param successCallback The success callback for this asynchronous function.
                 * @param failureCallback The failure callback for this asynchronous function; receives an error string.
                 *
                setClientToken(clientToken: string, successCallback?: () => void, failureCallback?: Callback<string>): void {

                    if (!clientToken || typeof (clientToken) !== 'string') {
                        if (failureCallback) failureCallback('A non-null, non-empty string must be provided for the token parameter.');
                        return;
                    }

                    window.cordova.exec(successCallback, failureCallback, PLUGIN_ID, 'setClientToken', [clientToken]);
                }

                /**
                 * Used to initialize the Braintree client.
                 *
                 * @param tokenizationKey The tokenization key to use with the Braintree client.
                 * @param successCallback The success callback for this asynchronous function.
                 * @param failureCallback The failure callback for this asynchronous function; receives an error string.
                 *
                setTokenizationKey(tokenizationKey: string, successCallback?: () => void, failureCallback?: Callback<string>): void {

                    if (!tokenizationKey || typeof (tokenizationKey) !== 'string') {
                        if (failureCallback) failureCallback('A non-null, non-empty string must be provided for the tokenization key parameter.');
                        return;
                    }

                    window.cordova.exec(successCallback, failureCallback, PLUGIN_ID, 'setTokenizationKey', [tokenizationKey]);
                }


                /**
                 * iOS only.
                 *
                 * @see https://developer.apple.com/documentation/passkit/pkpaymentauthorizationviewcontroller/1616192-canmakepayments
                 *
                passKitCanMakePayments(callback: (value: boolean) => void, onFailure: Callback<string>) {
                    switch (window.cordova.platformId) {
                        case 'android':
                            return callback(true); // assuming we can always make payments on Android
                        case 'ios':
                            return window.cordova.exec(callback, onFailure, PLUGIN_ID, 'pkCanMakePayments', []);
                        default:
                            return callback(false); // on all other platforms, no payment possible.
                    }
                }

                /**
                 * Used to configure Apple Pay on iOS.
                 *
                 * @param options Apple Pay options.
                 * @param successCallback The success callback for this asynchronous function;
                 * @param failureCallback The failure callback for this asynchronous function; receives an error string.
                 *
                passKitSetOptions(options: ApplePayOptions, successCallback: () => void, failureCallback: Callback<string>): void {

                    if (!options) {
                        return failureCallback('Apple Pay Merchant ID must be provided');
                    }

                    if (typeof (options.merchantId) !== 'string') {
                        return failureCallback('Apple Pay Merchant ID must be provided');
                    }

                    if (typeof (options.currency) !== 'string') {
                        return failureCallback('Apple Pay currency must be provided');
                    }

                    if (typeof (options.country) !== 'string') {
                        return failureCallback('Apple Pay country must be provided');
                    }

                    if (!Array.isArray(options.cardTypes)) {
                        return failureCallback('Apple Pay supported card types must be provided');
                    }

                    const functionArguments = [
                        options.merchantId,
                        options.currency,
                        options.country,
                        options.cardTypes
                    ];

                    window.cordova.exec(successCallback, failureCallback, PLUGIN_ID, 'pkSetOptions', functionArguments);
                }

                /**
                 * Shows Braintree's drop-in payment UI.
                 *
                 * @param options drop-in UI options.
                 * @param successCallback The success callback for this asynchronous function; receives a result object.
                 * @param failureCallback The failure callback for this asynchronous function; receives an error string.
                 *
                presentDropInPaymentUI(options: PaymentUIOptions, successCallback: (result: PaymentUIResult) => void, failureCallback: (error: string) => void): void {

                    if (!options) return;

                    // Ensure amount is formatted as XXXX.XX
                    const strAmount = ('' + options.amount) ?? '0.00';
                    const amount = (!isNaN(parseFloat(strAmount))) ? parseFloat(strAmount).toFixed(2) : '0.00';

                    const functionArguments = [
                        amount,
                        options.primaryDescription ?? '',
                        options.requiredShippingContactFields ?? []
                    ];
                    window.cordova.exec(successCallback, failureCallback, PLUGIN_ID, 'presentDropInPaymentUI', functionArguments);
                }


                /**
                 * Shows Braintree's drop-in payment UI.
                 *
                 * @param options drop-in UI options.
                 * @param successCallback The success callback for this asynchronous function; receives a result object.
                 * @param failureCallback The failure callback for this asynchronous function; receives an error string.
                 *
                passKitPresentDropInPaymentUI(options: PaymentUIOptions, successCallback: (result: PaymentUIResult) => void, failureCallback: (error: string) => void): void {

                    if (!options) return;

                    // Ensure amount is formatted as XXXX.XX
                    const strAmount = ('' + options.amount) ?? '0.00';
                    const amount = (!isNaN(parseFloat(strAmount))) ? parseFloat(strAmount).toFixed(2) : '0.00';

                    const functionArguments = [
                        amount,
                        options.primaryDescription ?? '',
                        options.requiredShippingContactFields ?? []
                    ];
                    window.cordova.exec(successCallback, failureCallback, PLUGIN_ID, 'pkPresentDropInPaymentUI', functionArguments);
                }

                /**
                 * Start 3DS2 payment flow.
                 *
                 * iOS only.
                 *
                 * See https://docs-prod-us-east-2.production.braintree-api.com/guides/3d-secure/client-side/ios/v5
                 *
                startPaymentFlow(options: ThreeDSecureRequest, successCallback: () => void, failureCallback: Callback<string>) {
                    // var pluginOptions = [
                    //     options.amount,
                    //     options.nonce,
                    //     options.email,
                    //     options.billingAddress?.givenName,
                    //     options.billingAddress?.surname,
                    //     options.billingAddress?.phoneNumber,
                    //     options.billingAddress?.countryCodeAlpha2,
                    // ];
                    window.cordova.exec(successCallback, failureCallback, PLUGIN_ID, 'startPaymentFlow', [options]);
                }

                /**
                 * Android only
                 *
                paypalProcess(amount, currency, env, successCallback, failureCallback) {
                    window.cordova.exec(successCallback, failureCallback, PLUGIN_ID, 'paypalProcess', [amount, currency, env]);
                }

                /**
                 * Android only
                 *
                paypalProcessVaulted(env, successCallback, failureCallback) {
                    window.cordova.exec(successCallback, failureCallback, PLUGIN_ID, 'paypalProcessVaulted', [env]);
                }

                */
            }


            // /**
            //  * Options for the setupApplePay method.
            //  */
            // interface ApplePayOptions {
            //     /**
            //      * Apple Merchant ID can be obtained from Apple.
            //      */
            //     merchantId: string;

            //     /**
            //      * 3 letter currency code ISO 4217
            //      */
            //     currency: string;

            //     /**
            //      * 2 letter country code ISO 3166-1
            //      */
            //     country: string;

            //     cardTypes: string[];
            // }

            /**
             * Options for the presentDropInPaymentUI method.
             */
            interface PaymentUIOptions {

                /**
                 * The amount of the transaction to show in the drop-in UI on the
                 * summary row as well as the call to action button.
                 * Defaults to empty string.
                 */
                amount?: string;

                /**
                 * The description of the transaction to show in the drop-in UI on the
                 * summary row.
                 * Defaults to empty string.
                 */
                primaryDescription?: string;

                // threeDSecure: {
                //     amount: string,
                //     email: string
                // };

                // googlePay?: {
                //     currency: string,
                //     merchantId?: string
                // };

                requiredShippingContactFields: string[];
            }

            // /**
            //  * Successful callback result for the presentDropInPaymentUI method.
            //  */
            // interface PaymentUIResult {

            //     /**
            //      * Indicates if the user used the cancel button to close the dialog without
            //      * completing the payment.
            //      */
            //     userCancelled: boolean;

            //     /**
            //      * The nonce for the payment transaction (if a payment was completed).
            //      */
            //     nonce: string;

            //     /**
            //      * The payment type (if a payment was completed).
            //      */
            //     type: string;

            //     /**
            //      * A description of the payment method (if a payment was completed).
            //      */
            //     localizedDescription: string;

            //     /**
            //      * Information about the credit card used to complete a payment (if a credit card was used).
            //      */
            //     card: {

            //         /**
            //          * The last two digits of the credit card used.
            //          */
            //         lastTwo: string;

            //         /**
            //          * An enumerated value used to indicate the type of credit card used.
            //          *
            //          * Can be one of the following values:
            //          *
            //          * BTCardNetworkUnknown
            //          * BTCardNetworkAMEX
            //          * BTCardNetworkDinersClub
            //          * BTCardNetworkDiscover
            //          * BTCardNetworkMasterCard
            //          * BTCardNetworkVisa
            //          * BTCardNetworkJCB
            //          * BTCardNetworkLaser
            //          * BTCardNetworkMaestro
            //          * BTCardNetworkUnionPay
            //          * BTCardNetworkSolo
            //          * BTCardNetworkSwitch
            //          * BTCardNetworkUKMaestro
            //          */
            //         network: string;
            //     };

            //     /**
            //      * Information about the PayPal account used to complete a payment (if a PayPal account was used).
            //      */
            //     payPalAccount: {
            //         email: string;
            //         firstName: string;
            //         lastName: string;
            //         phone: string;
            //         billingAddress: string;
            //         shippingAddress: string;
            //         clientMetadataId: string;
            //         payerId: string;
            //     };

            //     /**
            //      * Information about the Apple Pay card used to complete a payment (if Apple Pay was used).
            //      */
            //     applePaycard: {
            //     };

            //     /**
            //      * Information about 3D Secure card used to complete a payment (if 3D Secure was used).
            //      */
            //     threeDSecureInfo: {
            //         liabilityShifted: boolean;
            //         liabilityShiftPossible: boolean;
            //     };

            //     /**
            //      * Information about Venmo account used to complete a payment (if a Venmo account was used).
            //      */
            //     venmoAccount: {
            //         username: string;
            //     };
            // }

        }
    }
}
