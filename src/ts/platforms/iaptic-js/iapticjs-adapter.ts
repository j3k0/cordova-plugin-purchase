/// <reference path="./iaptic-js-types.d.ts" />
/// <reference path="../../types.ts" />
/// <reference path="../../product.ts" />
/// <reference path="../../receipt.ts" />
/// <reference path="../../offer.ts" />
/// <reference path="../../transaction.ts" />
/// <reference path="../../validator/validator.ts" />
/// <reference path="../../error-codes.ts" />
/// <reference path="../../internal/adapters.ts" />
/// <reference path="../../utils/md5.ts" />

namespace CdvPurchase {
    export namespace IapticJS {

        export type AdapterOptions = ModuleIapticJS.Config;

        export class Receipt extends CdvPurchase.Receipt {
            public purchases: ModuleIapticJS.Purchase[]; // Store the array of purchases fetched
            public accessToken: string;    // The KEY for verification/refreshing

            // Keep a reference to the context for decorators
            private context: Internal.AdapterContext;

            constructor(purchases: ModuleIapticJS.Purchase[], accessToken: string, context: Internal.AdapterContext) {
                super(Platform.IAPTIC_JS, context.apiDecorators);
                this.context = context;
                this.purchases = purchases;
                this.accessToken = accessToken;
                // Create transactions based on the purchases array
                this.transactions = purchases.map(p => new Transaction(this, p, context.apiDecorators));
            }

            // Add a refresh method if needed to update based on new purchase data
            refresh(purchases: ModuleIapticJS.Purchase[]) {
                this.purchases = purchases;
                // Re-create transactions or update existing ones
                this.transactions = purchases.map(p => {
                    const existing = this.transactions.find(t => (t as Transaction).purchase.purchaseId === p.purchaseId) as Transaction | undefined;
                    if (existing) {
                        existing.refresh(p);
                        return existing;
                    }
                    // Pass context's apiDecorators when creating new Transaction
                    return new Transaction(this, p, this.context.apiDecorators);
                });
            }
        }

        export class Transaction extends CdvPurchase.Transaction {
            public purchase: ModuleIapticJS.Purchase; // Store the specific purchase info

            constructor(receipt: Receipt, purchase: ModuleIapticJS.Purchase, decorator: Internal.TransactionDecorator) {
                super(Platform.IAPTIC_JS, receipt, decorator);
                this.purchase = purchase;
                this.refresh(purchase); // Initial population
            }

            refresh(purchase: ModuleIapticJS.Purchase) {
                this.purchase = purchase;
                // Prefix product ID based on the assumption that iaptic-js might return prefixed or non-prefixed IDs
                const platformPrefix = purchase.platform ? `${purchase.platform}:` : 'stripe:'; // Default to stripe if platform missing
                const productId = purchase.productId.startsWith(platformPrefix) ? purchase.productId : `${platformPrefix}${purchase.productId}`;

                this.products = [{ id: productId }];
                this.transactionId = purchase.transactionId;
                this.purchaseId = purchase.purchaseId;
                this.purchaseDate = new Date(purchase.purchaseDate);
                this.expirationDate = purchase.expirationDate ? new Date(purchase.expirationDate) : undefined;
                this.lastRenewalDate = purchase.lastRenewalDate ? new Date(purchase.lastRenewalDate) : undefined;
                this.renewalIntent = purchase.renewalIntent === 'Renew' ? RenewalIntent.RENEW : RenewalIntent.LAPSE;
                // this.isTrialPeriod = purchase.isTrialPeriod;
                this.state = TransactionState.APPROVED; // Assuming getPurchases only returns valid purchases
                this.isAcknowledged = true; // Stripe manages this server-side
                this.amountMicros = purchase.amountMicros;
                this.currency = purchase.currency;
            }
        }

        export class Adapter implements CdvPurchase.Adapter {

            id = Platform.IAPTIC_JS;
            name = 'IapticJS';
            ready = false;
            products: CdvPurchase.Product[] = [];
            _receipts: Receipt[] = [];
            get receipts(): Receipt[] { return this._receipts; }

            private context: Internal.AdapterContext;
            private log: Logger;
            private options: AdapterOptions;
            private iapticAdapterInstance!: ModuleIapticJS.IapticStripe; // Use definite assignment assertion
            private backendAdapterType: string; // To store 'stripe' or potentially others

            private upsertProduct(product: CdvPurchase.Product) {
                this.log.debug(`upsertProduct(${product.id})`);
                const existingIndex = this.products.findIndex(p => p.id === product.id);
                if (existingIndex >= 0) {
                    this.products[existingIndex] = product;
                } else {
                    this.products.push(product);
                }
            }

            constructor(context: Internal.AdapterContext, options: AdapterOptions) {
                this.context = context;
                this.log = context.log.child("IapticJS");
                this.options = options;
                this.backendAdapterType = options.type;
            }

            get isSupported(): boolean {
                // Check for the global IapticJS object
                return typeof window.IapticJS !== 'undefined' && typeof window.IapticJS.createAdapter === 'function';
            }

            // Let's load products and receipts sequentially for simplicity first.
            // If iaptic-js supports parallel, we can change this later.
            supportsParallelLoading = false;

            async initialize(): Promise<IError | undefined> {
                this.log.info('initialize()');
                if (!this.isSupported) {
                    const msg = 'iaptic-js SDK is not available. Please ensure it is loaded.';
                    this.log.warn(msg);
                    return iapticJsError(ErrorCode.SETUP, msg, null);
                }
                try {
                    this.log.info(`Creating iaptic-js adapter with options: ${JSON.stringify(this.options)}`);
                    // Use the globally available IapticJS object
                    this.iapticAdapterInstance = window.IapticJS.createAdapter(this.options);
                    this.ready = true;
                    // Initial load attempt after initialization - receipts first to get token
                    await this.loadReceipts();
                    this.log.info('IapticJS Adapter Initialized');
                    // Products might be loaded on demand or after receipts
                    // Let's not block initialization for products
                    this.context.listener.receiptsReady(Platform.IAPTIC_JS); // Indicate readiness even if no receipts initially
                    return undefined;
                } catch (err: any) {
                    this.ready = false; // Ensure ready is false on error
                    const message = err?.message || 'Failed to initialize IapticJS adapter';
                    this.log.error('Initialization failed: ' + message);
                    return iapticJsError(ErrorCode.SETUP, message, null);
                }
            }

            async loadProducts(products: IRegisterProduct[]): Promise<(CdvPurchase.Product | IError)[]> {
                this.log.info(`loadProducts() for ${products.length} registered products`);
                 if (!this.ready || !this.iapticAdapterInstance) {
                     return products.map(p => iapticJsError(ErrorCode.SETUP, 'Adapter not initialized', p.id));
                 }
                try {
                    // Fetch products from iaptic-js
                    const iapticProducts = await this.iapticAdapterInstance.getProducts();
                    this.log.debug('Fetched products from iaptic-js: ' + JSON.stringify(iapticProducts.map(p => p.id)));

                    // Filter and map to CdvPurchase.Product
                    const results = products.map(registeredProduct => {
                        const iapticProduct = iapticProducts.find(p => {
                            // Compare ignoring the platform prefix if present in iapticProduct.id
                            const iapticIdWithoutPrefix = p.id.includes(':') ? p.id.split(':', 2)[1] : p.id;
                            // Compare ignoring the platform prefix if present in registeredProduct.id
                            const registeredIdWithoutPrefix = registeredProduct.id.includes(':') ? registeredProduct.id.split(':', 2)[1] : registeredProduct.id;
                            return iapticIdWithoutPrefix === registeredIdWithoutPrefix;
                        });

                        if (!iapticProduct) {
                            this.log.warn(`Registered product ID "${registeredProduct.id}" not found in fetched iaptic-js products.`);
                            return iapticJsError(ErrorCode.PRODUCT_NOT_AVAILABLE, `Product ${registeredProduct.id} not found via iaptic-js`, registeredProduct.id);
                        }

                        // Create or update CdvPurchase.Product
                        const platformProductId = `${Platform.IAPTIC_JS}:${iapticProduct.id.split(':').pop()}`; // Ensure correct prefix
                        let product = this.products.find(p => p.id === platformProductId);
                        if (!product) {
                            product = new CdvPurchase.Product({ ...registeredProduct, platform: Platform.IAPTIC_JS, id: platformProductId }, this.context.apiDecorators);
                            this.upsertProduct(product);
                        }

                        product.title = iapticProduct.title;
                        product.description = iapticProduct.description ?? '';
                        product.offers = []; // Clear existing offers before adding new ones

                        iapticProduct.offers.forEach(o => {
                             // Ensure offer ID is correctly prefixed
                             const offerPlatformPrefix = o.platform ? `${o.platform}:` : 'stripe:'; // Default if missing
                             const offerIdWithoutPrefix = o.id.includes(':') ? o.id.split(':', 2)[1] : o.id;
                             const fullOfferId = `${offerPlatformPrefix}${offerIdWithoutPrefix}`;

                            const offer = new CdvPurchase.Offer({
                                id: fullOfferId,
                                product: product!,
                                pricingPhases: o.pricingPhases.map((pp: ModuleIapticJS.PricingPhase) => ({
                                    priceMicros: pp.priceMicros,
                                    currency: pp.currency,
                                    billingPeriod: pp.billingPeriod,
                                    paymentMode: pp.paymentMode as PaymentMode, // Cast might be needed if types differ slightly
                                    recurrenceMode: pp.recurrenceMode as RecurrenceMode,
                                    price: window.IapticJS.Utils.formatCurrency(pp.priceMicros, pp.currency) // Use Utils for formatting
                                })),
                            }, this.context.apiDecorators);
                            product!.addOffer(offer);
                        });
                        this.log.debug(`Processed product ${product.id} with ${product.offers.length} offers.`);
                        return product;
                    });
                    // Notify listener about all products (new and updated)
                    this.context.listener.productsUpdated(Platform.IAPTIC_JS, this.products);
                    return results;
                } catch (err: any) {
                    this.log.error('Failed to load products: ' + err.message);
                    return products.map(p => iapticJsError(ErrorCode.LOAD, err.message || 'Failed to load products', p.id));
                }
            }

            async loadReceipts(): Promise<Receipt[]> {
                this.log.info('loadReceipts()');
                 if (!this.ready || !this.iapticAdapterInstance) {
                     this.log.warn('Adapter not ready, skipping loadReceipts.');
                     return this._receipts;
                 }
                try {
                    const accessToken = this.iapticAdapterInstance.getAccessToken();
                    if (!accessToken) {
                        this.log.info('No stored access token found.');
                        // Clear existing receipts if token is gone
                        if (this._receipts.length > 0) {
                            this._receipts = [];
                            this.context.listener.receiptsUpdated(Platform.IAPTIC_JS, []);
                        }
                        return this._receipts;
                    }

                    this.log.info('Fetching purchases with stored access token.');
                    const purchases = await this.iapticAdapterInstance.getPurchases(accessToken); // Fetches AND potentially updates token
                    const currentToken = this.iapticAdapterInstance.getAccessToken() ?? accessToken; // Use potentially refreshed token

                    if (purchases.length > 0) {
                        let receipt = this._receipts.find(r => r.accessToken === currentToken);

                        if (!receipt) {
                            this.log.info(`Creating new receipt for token hash ${currentToken.substring(0, 10)}...`);
                            receipt = new Receipt(purchases, currentToken, this.context);
                            this._receipts = [receipt]; // Replace old receipts if token changed or was missing
                        } else {
                            this.log.info(`Refreshing existing receipt for token hash ${currentToken.substring(0, 10)}...`);
                            receipt.refresh(purchases);
                        }
                        this.context.listener.receiptsUpdated(Platform.IAPTIC_JS, [receipt]);
                    } else {
                        // No purchases found for this token. Clear receipts.
                        if (this._receipts.length > 0) {
                             this.log.info('No purchases found for token, clearing local receipts.');
                             this._receipts = [];
                             this.context.listener.receiptsUpdated(Platform.IAPTIC_JS, []);
                        }
                    }

                    // Let the store know receipts are loaded (even if empty)
                    // This might have been called during initialize, but it's safe to call again.
                    this.context.listener.receiptsReady(Platform.IAPTIC_JS);
                    return this._receipts;
                } catch (err: any) {
                    this.log.warn('Failed to load receipts: ' + err.message);
                    // If fetching purchases fails due to invalid token, clear local data
                    if (err.message?.includes('Invalid access token')) { // Adjust based on actual error message
                         this.log.warn('Invalid access token detected, clearing stored data.');
                         this.iapticAdapterInstance.clearStoredData();
                         this._receipts = [];
                         this.context.listener.receiptsUpdated(Platform.IAPTIC_JS, []);
                    }
                    this.context.listener.receiptsReady(Platform.IAPTIC_JS); // Still ready, just failed to load
                    return [];
                }
            }

            async order(offer: CdvPurchase.Offer, additionalData: CdvPurchase.AdditionalData): Promise<undefined | IError> {
                this.log.info(`order() - Offer ID: ${offer.id}`);
                 if (!this.ready || !this.iapticAdapterInstance) {
                     return iapticJsError(ErrorCode.SETUP, 'Adapter not initialized', offer.productId);
                 }
                try {
                    await this.iapticAdapterInstance.order({
                        offerId: offer.id,
                        applicationUsername: additionalData?.applicationUsername || this.context.getApplicationUsername() || '', // Pass username
                        successUrl: window.location.href, // Use current URL as default
                        cancelUrl: window.location.href,
                        accessToken: this.iapticAdapterInstance.getAccessToken(), // Pass existing token
                    });
                    // Redirection happens, so success here means initiation.
                    // We might want to trigger an INITIATED state locally, but it's complex
                    // as we don't get a transaction object immediately.
                    this.log.info(`Order initiated for offer ${offer.id}. User will be redirected.`);
                    return undefined;
                } catch (err: any) {
                    this.log.error('Order failed: ' + err.message);
                    return iapticJsError(ErrorCode.PURCHASE, err.message || 'Failed to initiate order', offer.productId);
                }
            }

            async finish(transaction: Transaction): Promise<undefined | IError> {
                this.log.info(`finish(${transaction.transactionId}) - No-op for IapticJS/Stripe`);
                // Stripe/Iaptic manages entitlement server-side. Mark as finished locally.
                transaction.state = TransactionState.FINISHED;
                // Notify the store listener that the transaction state might have changed
                // Find the parent receipt and notify
                const parentReceipt = this._receipts.find(r => r.transactions.indexOf(transaction) >= 0);
                if (parentReceipt) {
                    this.context.listener.receiptsUpdated(Platform.IAPTIC_JS, [parentReceipt]);
                }
                return undefined;
            }

            async receiptValidationBody(receipt: Receipt): Promise<Validator.Request.Body | undefined> {
                if (receipt.platform !== Platform.IAPTIC_JS) return undefined;
                this.log.info(`receiptValidationBody for IapticJS - AccessToken: ${receipt.accessToken ? 'present' : 'missing'}`);

                if (!receipt.accessToken) {
                    this.log.warn('Cannot prepare validation body: IapticJS receipt is missing accessToken.');
                    return undefined;
                }

                // Find a representative product ID from the purchases in the receipt, if any
                const firstPurchase = receipt.purchases[0];
                const product = firstPurchase ? this.context.registeredProducts.find(Platform.IAPTIC_JS, firstPurchase.productId) : undefined;
                const productIdForBody = product?.id ?? firstPurchase?.productId ?? 'unknown-product';
                const productTypeForBody = product?.type ?? (firstPurchase ? ProductType.PAID_SUBSCRIPTION : ProductType.CONSUMABLE); // Guess type

                return {
                    id: productIdForBody,
                    type: productTypeForBody,
                    products: this.products.map(p => ({ // Map to the expected structure for validator
                        id: p.id,
                        type: p.type,
                        offers: p.offers.map(o => ({ id: o.id, pricingPhases: o.pricingPhases }))
                    })),
                    transaction: {
                        type: 'iaptic', // Use 'iaptic' as the generic type
                        adapter: this.backendAdapterType, // Specify the backend ('stripe')
                        accessToken: receipt.accessToken,
                    } as Validator.Request.ApiValidatorBodyTransactionIaptic
                };
            }

            async handleReceiptValidationResponse(receipt: Receipt, response: Validator.Response.Payload): Promise<void> {
                this.log.info('handleReceiptValidationResponse for IapticJS');
                if (response.ok) {
                    const validatedData = response.data.transaction;
                    const collection = response.data.collection;

                    // Update receipt based on validated collection
                    if (collection) {
                        const purchases: ModuleIapticJS.Purchase[] = collection.map((vp: VerifiedPurchase) => ({
                            purchaseId: vp.purchaseId!,
                            transactionId: vp.transactionId!,
                            productId: vp.id!,
                            platform: 'stripe', // Assuming Stripe for now
                            purchaseDate: vp.purchaseDate ? new Date(vp.purchaseDate).toISOString() : '',
                            lastRenewalDate: vp.lastRenewalDate ? new Date(vp.lastRenewalDate).toISOString() : '',
                            expirationDate: vp.expiryDate ? new Date(vp.expiryDate).toISOString() : '',
                            renewalIntent: vp.renewalIntent === RenewalIntent.RENEW ? 'Renew' : 'Cancel',
                            isTrialPeriod: vp.isTrialPeriod ?? false,
                            amountMicros: 0, // Not typically in VerifiedPurchase, focus is entitlement
                            currency: '', // Not typically in VerifiedPurchase
                        }));
                        receipt.refresh(purchases);
                    } else {
                        // If collection is empty or missing, maybe clear local purchases?
                        receipt.refresh([]);
                    }
                     this.context.listener.receiptsUpdated(Platform.IAPTIC_JS, [receipt]);

                } else {
                    this.log.warn(`Receipt validation failed: ${response.message} (Code: ${response.code})`);
                    // Handle specific error codes if needed, e.g., invalidate token
                    if (response.code === ErrorCode.COMMUNICATION) {
                         this.log.info('Clearing potentially invalid access token due to validation failure.');
                         this.iapticAdapterInstance.clearStoredData();
                         this._receipts = this._receipts.filter(r => r !== receipt);
                         this.context.listener.receiptsUpdated(Platform.IAPTIC_JS, []);
                    }
                }
            }

            async requestPayment(payment: PaymentRequest, additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined> {
                // Payment Requests are typically handled via `order` with Stripe Checkout
                this.log.warn('requestPayment is not directly supported for IapticJS/Stripe. Use order().');
                return iapticJsError(ErrorCode.UNKNOWN, 'requestPayment not supported, use order() instead', null);
            }

            async manageSubscriptions(): Promise<IError | undefined> {
                 if (!this.ready || !this.iapticAdapterInstance) {
                     return iapticJsError(ErrorCode.SETUP, 'Adapter not initialized', null);
                 }
                try {
                    await this.iapticAdapterInstance.redirectToCustomerPortal({
                        returnUrl: window.location.href,
                    });
                    // Redirection happens, no direct return value indicates success
                    return undefined;
                } catch (err: any) {
                    this.log.error('Failed to redirect to customer portal: ' + err.message);
                    return iapticJsError(ErrorCode.UNKNOWN, err.message || 'Failed to open subscription management', null);
                }
            }

            async manageBilling(): Promise<IError | undefined> {
                // For Stripe, billing and subscription management are usually the same portal
                return this.manageSubscriptions();
            }

            checkSupport(functionality: PlatformFunctionality): boolean {
                const supported: PlatformFunctionality[] = ['order', 'manageSubscriptions', 'manageBilling'];
                return supported.indexOf(functionality) !== -1;
            }

            async restorePurchases(): Promise<IError | undefined> {
                this.log.info('restorePurchases() - calling loadReceipts()');
                 if (!this.ready || !this.iapticAdapterInstance) {
                     return iapticJsError(ErrorCode.SETUP, 'Adapter not initialized', null);
                 }
                try {
                    await this.loadReceipts(); // Fetches latest purchases based on stored token
                    return undefined;
                } catch (err: any) {
                    this.log.error('Restore purchases failed during loadReceipts: ' + err.message);
                    return iapticJsError(ErrorCode.REFRESH, err.message || 'Failed to restore purchases', null);
                }
            }
        }

        function iapticJsError(code: ErrorCode, message: string, productId: string | null): IError {
            return storeError(code, message, Platform.IAPTIC_JS, productId);
        }
    }
}