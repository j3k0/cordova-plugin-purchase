/// <reference path="../../receipt.ts" />
/// <reference path="../../transaction.ts" />

namespace CdvPurchase {

    export namespace AmazonAppStore {

        export class Transaction extends CdvPurchase.Transaction {

            public nativePurchase: Bridge.AmazonPurchase;

            constructor(purchase: Bridge.AmazonPurchase, parentReceipt: Receipt, decorator: Internal.TransactionDecorator) {
                super(Platform.AMAZON_APPSTORE, parentReceipt, decorator);
                this.nativePurchase = purchase;
                this.refresh(purchase, true);
            }

            static toState(purchase: Bridge.AmazonPurchase, fromConstructor: boolean): TransactionState {
                if (purchase.canceled)
                    return TransactionState.CANCELLED;
                if (fromConstructor)
                    return TransactionState.INITIATED;
                return TransactionState.APPROVED;
            }

            /**
             * Refresh the transaction based on the native purchase update
             */
            refresh(purchase: Bridge.AmazonPurchase, fromConstructor?: boolean) {
                this.nativePurchase = purchase;
                this.transactionId = purchase.receiptId;
                this.purchaseId = purchase.receiptId;
                this.products = [{ id: purchase.productId }];
                if (purchase.purchaseDate) this.purchaseDate = new Date(purchase.purchaseDate);
                this.state = Transaction.toState(purchase, fromConstructor ?? false);
            }
        }

        export class Receipt extends CdvPurchase.Receipt {

            /** Amazon receipt ID */
            public receiptId: string;

            /** @internal */
            constructor(purchase: Bridge.AmazonPurchase, decorator: Internal.TransactionDecorator & Internal.ReceiptDecorator) {
                super(Platform.AMAZON_APPSTORE, decorator);
                this.transactions = [new Transaction(purchase, this, decorator)];
                this.receiptId = purchase.receiptId;
            }

            /** Refresh the content of the receipt based on the native purchase */
            refreshPurchase(purchase: Bridge.AmazonPurchase) {
                (this.transactions[0] as Transaction)?.refresh(purchase);
            }
        }

        export class Adapter implements CdvPurchase.Adapter {

            /** Adapter identifier */
            id = Platform.AMAZON_APPSTORE;

            /** Adapter name */
            name = 'AmazonAppStore';

            /** Has the adapter been successfully initialized */
            ready = false;

            supportsParallelLoading = false;

            /** List of products managed by the adapter */
            get products(): Product[] { return this._products; }
            private _products: Product[] = [];

            get receipts(): Receipt[] { return this._receipts; }
            private _receipts: Receipt[] = [];

            /** The Amazon bridge */
            bridge = new Bridge.Bridge();

            /** Prevent double initialization */
            initialized = false;

            /** Used to retry failed commands */
            retry = new Internal.Retry();

            private context: Internal.AdapterContext;
            private log: Logger;

            static _instance: Adapter;
            constructor(context: Internal.AdapterContext) {
                if (Adapter._instance) throw new Error('AmazonAppStore adapter already initialized');
                this.context = context;
                this.log = context.log.child('AmazonAppStore');
                Adapter._instance = this;
            }

            private initializationPromise?: Promise<undefined | IError>;

            /** Returns true on Android, the platform supported by this adapter */
            get isSupported(): boolean {
                return Utils.platformId() === 'android';
            }

            async initialize(): Promise<undefined | IError> {

                this.log.info("Initialize");

                if (this.initializationPromise) return this.initializationPromise;

                return this.initializationPromise = new Promise((resolve) => {

                    const bridgeLogger = this.log.child('Bridge');

                    const options = {
                        onSetPurchases: this.onSetPurchases.bind(this),
                        onPurchasesUpdated: this.onPurchasesUpdated.bind(this),
                        onPurchaseFulfilled: this.onPurchaseFulfilled.bind(this),
                        showLog: this.context.verbosity >= LogLevel.DEBUG ? true : false,
                        log: (msg: string) => bridgeLogger.info(msg),
                    }

                    const iabReady = () => {
                        this.log.debug("Ready");
                        resolve(undefined);
                    }

                    const iabError = (err: string) => {
                        this.initialized = false;
                        this.context.error(amazonError(ErrorCode.SETUP, "Init failed - " + err, null));
                        this.retry.retry(() => this.initialize());
                    }

                    this.bridge.init(iabReady, iabError, options);
                });
            }

            /** @inheritdoc */
            loadReceipts(): Promise<CdvPurchase.Receipt[]> {
                return new Promise((resolve) => {
                    this.getPurchaseUpdates()
                    .then(() => {
                        resolve(this._receipts);
                    });
                });
            }

            /** @inheritDoc */
            loadProducts(products: IRegisterProduct[]): Promise<(Product | IError)[]> {

                return new Promise((resolve) => {

                    this.log.debug("Load: " + JSON.stringify(products));

                    const skus = products.map(p => p.id);

                    const go = () => {
                        this.bridge.getProductData(skus, (response: Bridge.ProductDataResponse) => {

                            this.log.debug("Loaded: " + JSON.stringify(response));

                            if (!response || !Array.isArray(response.products)) {
                                const message = `Invalid product data received: ${JSON.stringify(response)}, retrying later...`;
                                this.log.warn(message);
                                this.retry.retry(go);
                                this.context.error(amazonError(ErrorCode.LOAD, message, null));
                                return;
                            }

                            const ret = products.map(registeredProduct => {
                                const amazonProduct = response.products.find(ap => ap.productId === registeredProduct.id);
                                if (amazonProduct) {
                                    return this.addProduct(registeredProduct, amazonProduct);
                                }
                                else {
                                    return amazonError(ErrorCode.INVALID_PRODUCT_ID, `Product with id ${registeredProduct.id} not found.`, registeredProduct.id);
                                }
                            });
                            resolve(ret);
                        }, (err: string) => {
                            this.retry.retry(go);
                            this.context.error(amazonError(ErrorCode.LOAD, 'Loading product info failed - ' + err + ' - retrying later...', null));
                        });
                    }

                    go();
                });
            }

            private addProduct(registeredProduct: IRegisterProduct, amazonProduct: Bridge.AmazonProduct): Product {
                const existingProduct = this._products.find(p => p.id === registeredProduct.id);
                const p = existingProduct ?? new Product(registeredProduct, this.context.apiDecorators);
                p.title = amazonProduct.title || p.title;
                p.description = amazonProduct.description || p.description;

                const pricingPhases: PricingPhase[] = [{
                    price: amazonProduct.price ?? '',
                    priceMicros: amazonProduct.priceMicros ?? 0,
                    currency: amazonProduct.currency,
                    recurrenceMode: RecurrenceMode.NON_RECURRING,
                }];

                const offer = new Offer({ id: amazonProduct.productId, product: p, pricingPhases }, this.context.apiDecorators);
                p.offers = [offer];

                if (!existingProduct) {
                    this._products.push(p);
                }
                return p;
            }

            /** @inheritDoc */
            finish(transaction: CdvPurchase.Transaction): Promise<IError | undefined> {
                return new Promise(resolve => {

                    const onSuccess = () => {
                        if (transaction.state !== TransactionState.FINISHED) {
                            transaction.state = TransactionState.FINISHED;
                            this.context.listener.receiptsUpdated(Platform.AMAZON_APPSTORE, [transaction.parentReceipt]);
                        }
                        resolve(undefined);
                    };

                    const amazonTransaction = transaction as Transaction;
                    const receiptId = amazonTransaction.nativePurchase?.receiptId;

                    if (!receiptId)
                        return resolve(amazonError(ErrorCode.FINISH, 'Cannot finish transaction, no receiptId found.', null));

                    const onFailure = (message: string, code?: ErrorCode) => resolve(amazonError(code || ErrorCode.UNKNOWN, message, null));

                    // Amazon IAP uses notifyFulfillment for all product types
                    this.bridge.notifyFulfillment(receiptId, onSuccess, onFailure);
                });
            }

            /** Called by the bridge when a purchase has been fulfilled */
            onPurchaseFulfilled(purchase: Bridge.AmazonPurchase): void {
                this.log.debug("onPurchaseFulfilled: " + purchase.receiptId);
                this.onPurchasesUpdated([purchase]);
            }

            /**
             * Called when the platform reports initial purchases
             */
            onSetPurchases(purchases: Bridge.AmazonPurchase[]): void {
                this.log.debug("onSetPurchases: " + JSON.stringify(purchases));
                this.onPurchasesUpdated(purchases);
                this.context.listener.receiptsReady(Platform.AMAZON_APPSTORE);
            }

            /**
             * Called when the platform reports updates for some purchases
             */
            onPurchasesUpdated(purchases: Bridge.AmazonPurchase[]): void {
                this.log.debug("onPurchasesUpdated: " + purchases.map(p => p.receiptId).join(', '));

                purchases.forEach(purchase => {
                    if (purchase.canceled) return; // skip canceled purchases

                    const existingReceipt = this._receipts.find(r => r.receiptId === purchase.receiptId);
                    if (existingReceipt) {
                        existingReceipt.refreshPurchase(purchase);
                        this.context.listener.receiptsUpdated(Platform.AMAZON_APPSTORE, [existingReceipt]);
                    }
                    else {
                        const newReceipt = new Receipt(purchase, this.context.apiDecorators);
                        this._receipts.push(newReceipt);
                        this.context.listener.receiptsUpdated(Platform.AMAZON_APPSTORE, [newReceipt]);
                        if (newReceipt.transactions[0].state === TransactionState.INITIATED && !newReceipt.transactions[0].isPending) {
                            newReceipt.refreshPurchase(purchase);
                            this.context.listener.receiptsUpdated(Platform.AMAZON_APPSTORE, [newReceipt]);
                        }
                    }
                });
            }

            /** Refresh purchases from Amazon */
            getPurchaseUpdates(): Promise<IError | undefined> {
                return new Promise(resolve => {
                    this.log.debug('getPurchaseUpdates');
                    const success = () => {
                        this.log.debug('getPurchaseUpdates success');
                        setTimeout(() => resolve(undefined), 0);
                    }
                    const failure = (message: string, code?: number) => {
                        this.log.warn('getPurchaseUpdates failed: ' + message + ' (' + code + ')');
                        setTimeout(() => resolve(amazonError(code || ErrorCode.UNKNOWN, message, null)), 0);
                    }
                    this.bridge.getPurchaseUpdates(success, failure);
                });
            }

            /** @inheritDoc */
            async order(offer: Offer, additionalData: CdvPurchase.AdditionalData): Promise<IError | undefined> {
                return new Promise(resolve => {
                    this.log.info("Order - " + JSON.stringify(offer));
                    const buySuccess = () => resolve(undefined);
                    const buyFailed = (message: string, code?: ErrorCode): void => {
                        this.log.warn('Order failed: ' + JSON.stringify({message, code}));
                        resolve(amazonError(code ?? ErrorCode.UNKNOWN, message, offer.productId));
                    };
                    this.bridge.purchase(offer.productId, buySuccess, buyFailed);
                });
            }

            /**
             * Prepare for receipt validation
             */
            async receiptValidationBody(receipt: Receipt): Promise<Validator.Request.Body | undefined> {
                const transaction = receipt.transactions[0] as AmazonAppStore.Transaction;
                if (!transaction) return;
                const productId = transaction.products[0]?.id;
                if (!productId) return;
                const product = this._products.find(p => p.id === productId);
                if (!product) return;
                const purchase = transaction.nativePurchase;
                return {
                    id: productId,
                    type: product.type,
                    offers: product.offers,
                    products: this._products,
                    transaction: {
                        type: Platform.AMAZON_APPSTORE,
                        id: receipt.transactions[0].transactionId,
                        receiptId: purchase.receiptId,
                        userId: purchase.userId,
                    }
                }
            }

            async handleReceiptValidationResponse(_receipt: CdvPurchase.Receipt, _response: Validator.Response.Payload): Promise<void> {
                return; // Nothing specific to do on Amazon
            }

            async requestPayment(_payment: PaymentRequest, _additionalData?: CdvPurchase.AdditionalData): Promise<IError | Transaction | undefined> {
                return amazonError(ErrorCode.UNKNOWN, 'requestPayment not supported on Amazon', null);
            }

            async manageSubscriptions(): Promise<IError | undefined> {
                return amazonError(ErrorCode.UNKNOWN, 'manageSubscriptions not available on Amazon', null);
            }

            async manageBilling(): Promise<IError | undefined> {
                return amazonError(ErrorCode.UNKNOWN, 'manageBilling not available on Amazon', null);
            }

            checkSupport(functionality: PlatformFunctionality): boolean {
                const supported: PlatformFunctionality[] = ['order'];
                return supported.indexOf(functionality) >= 0;
            }

            restorePurchases(): Promise<IError | undefined> {
                return this.getPurchaseUpdates();
            }
        }

        function amazonError(code: ErrorCode, message: string, productId: string | null) {
            return storeError(code, message, Platform.AMAZON_APPSTORE, productId);
        }
    }
}
