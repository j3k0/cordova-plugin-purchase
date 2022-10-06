namespace CdvPurchase {

    export type ValidatorCallback = (payload: Validator.Response.Payload) => void;

    export interface ValidatorFunction {
        (receipt: Receipt, callback: ValidatorCallback): void;
    }

    export interface ValidatorTarget {
        url: string;
        headers?: { [token: string]: string };
    }

    export namespace Internal {

        export interface ReceiptResponse {
            receipt: Receipt;
            payload: Validator.Response.Payload;
        }

        /** Queue of receipts to validate */
        export class ReceiptsToValidate {
            private array: Receipt[] = [];

            get(): Receipt[] {
                return this.array.concat();
            }

            add(receipt: Receipt) {
                if (!this.has(receipt))
                    this.array.push(receipt);
            }

            clear() {
                while (this.array.length !== 0)
                    this.array.pop();
            }

            has(receipt: Receipt): boolean {
                return !!this.array.find(el => el === receipt);
            }
        }

        export interface ValidatorController {
            get validator(): string | ValidatorFunction | ValidatorTarget | undefined;
            get localReceipts(): Receipt[];
            get adapters(): Adapters;
            get validator_privacy_policy(): PrivacyPolicyItem | PrivacyPolicyItem[] | undefined;
            getApplicationUsername(): string | undefined;
            get verifiedCallbacks(): Callbacks<VerifiedReceipt>;
        }

        /** Handles communication with the remote receipt validation service */
        export class Validator {

            /** List of receipts waiting for validation */
            private receiptsToValidate: ReceiptsToValidate = new ReceiptsToValidate();

            /**  */
            private controller: ValidatorController;

            /** Logger */
            private log: Logger;

            /** List of verified receipts */
            public verifiedReceipts: VerifiedReceipt[] = [];

            constructor(controller: ValidatorController, log: Logger) {
                this.controller = controller;
                this.log = log.child('Validator');
            }

            /** Add/update a verified receipt from the server response */
            private addVerifiedReceipt(receipt: Receipt, data: Validator.Response.SuccessPayload['data']): VerifiedReceipt {
                for (const vr of this.verifiedReceipts) {
                    if (vr.platform === receipt.platform && vr.id === data.id) {
                        // update existing receipt
                        vr.set(receipt, data);
                        return vr;
                    }
                }
                const newVR = new VerifiedReceipt(receipt, data);
                this.verifiedReceipts.push(newVR);
                return newVR;
            }

            /** Add a receipt to the validation queue. It'll get validated after a few milliseconds. */
            add(receiptOrTransaction: Receipt | Transaction) {
                const receipt: Receipt | undefined =
                    (receiptOrTransaction instanceof Transaction)
                        ? this.controller.localReceipts.filter(r => r.hasTransaction(receiptOrTransaction)).slice(-1)[0]
                        : receiptOrTransaction;
                if (receipt) {
                    this.receiptsToValidate.add(receipt);
                }
            }

            /** Run validation for all receipts in the queue */
            run() {
                // pseudo implementation
                const receipts = this.receiptsToValidate.get();
                this.receiptsToValidate.clear();

                const onResponse = async (r: ReceiptResponse) => {
                    const { receipt, payload } = r;
                    const adapter = this.controller.adapters.find(receipt.platform);
                    await adapter?.handleReceiptValidationResponse(receipt, payload);
                    if (payload.ok) {
                        const vr = this.addVerifiedReceipt(receipt, payload.data);
                        this.controller.verifiedCallbacks.trigger(vr);
                        // this.verifiedCallbacks.trigger(data.receipt);
                    }
                    // else {
                    // }
                    // TODO: update transactions
                };
                receipts.forEach(receipt => this.runOnReceipt(receipt, onResponse));
            }

            private runOnReceipt(receipt: Receipt, callback: Callback<ReceiptResponse>) {

                if (!this.controller.validator) return;
                if (typeof this.controller.validator === 'function')
                    return this.runValidatorFunction(this.controller.validator, receipt, callback);

                const target: ValidatorTarget = typeof this.controller.validator === 'string'
                    ? { url: this.controller.validator }
                    : this.controller.validator;
                const body = this.buildRequestBody(receipt);
                if (!body) return;
                return this.runValidatorRequest(target, receipt, body, callback);
            }

            private runValidatorFunction(validator: ValidatorFunction, receipt: Receipt, callback: Callback<ReceiptResponse>) {
                try {
                    validator(receipt, (payload: Validator.Response.Payload) => callback({ receipt, payload }));
                }
                catch (error) {
                    this.log.warn("user provided validator function failed with error: " + (error as Error)?.stack);
                }
            }

            private buildRequestBody(receipt: Receipt): Validator.Request.Body | undefined {

                // Let the adapter generate the initial content
                const adapter = this.controller.adapters.find(receipt.platform);
                const body = adapter?.receiptValidationBody(receipt);
                if (!body) return;

                // Add the applicationUsername
                body.additionalData = {
                    ...body.additionalData ?? {},
                    applicationUsername: this.controller.getApplicationUsername(),
                }
                if (!body.additionalData.applicationUsername) delete body.additionalData.applicationUsername;

                // Add device information
                body.device = {
                    ...body.device ?? {},
                    ...CdvPurchase.Validator.Internal.getDeviceInfo(this.controller),
                }

                // Add legacy pricing information
                if (body.offers?.length === 1) {
                    const offer = body.offers[0];
                    if (offer.pricingPhases.length === 1) {
                        const pricing = offer.pricingPhases[0];
                        body.currency = pricing.currency;
                        body.priceMicros = pricing.priceMicros;
                    }
                    else if (offer.pricingPhases.length === 2) {
                        const pricing = offer.pricingPhases[1];
                        body.currency = pricing.currency;
                        body.priceMicros = pricing.priceMicros;
                        const intro = offer.pricingPhases[0];
                        body.introPriceMicros = intro.priceMicros;
                    }
                }

                return body;
            }

            private runValidatorRequest(target: ValidatorTarget, receipt: Receipt, body: Validator.Request.Body, callback: Callback<ReceiptResponse>) {

                CdvPurchase.Utils.ajax<Validator.Response.Payload>(this.log.child("Ajax"), {
                    url: target.url,
                    method: 'POST',
                    customHeaders: target.headers,
                    data: body,
                    success: (response) => {
                        this.log.debug("validator success, response: " + JSON.stringify(response));
                        if (!isValidatorResponsePayload(response))
                            return callback({
                                receipt,
                                payload: {
                                    ok: false,
                                    code: ErrorCode.BAD_RESPONSE,
                                    message: 'Validator responded with invalid data',
                                    data: { latest_receipt: (response as any)?.data?.latest_receipt },
                                } as Validator.Response.ErrorPayload
                            });
                        callback({ receipt, payload: response });
                    },
                    error: (status, message, data) => {
                        var fullMessage = "Error " + status + ": " + message;
                        this.log.debug("validator failed, response: " + JSON.stringify(fullMessage));
                        this.log.debug("body => " + JSON.stringify(data));
                        callback({
                            receipt,
                            payload: {
                                ok: false,
                                message: fullMessage,
                                data: {},
                            }
                        });
                    }
                });
            }
        }

        /**
         * Check if a payload looks like a valid validator response.
         */
        function isValidatorResponsePayload(payload: unknown): payload is Validator.Response.Payload {
            // TODO: could be made more robust.
            return (!!payload)
                && (typeof payload === 'object')
                && ('ok' in payload)
                && (typeof (payload as any).ok === 'boolean');
        }
    }
}
