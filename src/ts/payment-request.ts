namespace CdvPurchase {

  export class PaymentRequestPromise {

    private failedCallbacks = new Internal.PromiseLike<IError>();
    failed(callback: Callback<IError>): PaymentRequestPromise {
      this.failedCallbacks.push(callback);
      return this;
    }

    private initiatedCallbacks = new Internal.PromiseLike<Transaction>();
    initiated(callback: Callback<Transaction>): PaymentRequestPromise {
      this.initiatedCallbacks.push(callback);
      return this;
    }

    private approvedCallbacks = new Internal.PromiseLike<Transaction>();
    approved(callback: Callback<Transaction>): PaymentRequestPromise {
      this.approvedCallbacks.push(callback);
      return this;
    }

    private finishedCallbacks = new Internal.PromiseLike<Transaction>();
    finished(callback: Callback<Transaction>): PaymentRequestPromise {
      this.finishedCallbacks.push(callback);
      return this;
    }

    private cancelledCallback = new Internal.PromiseLike<void>();
    cancelled(callback: Callback<void>): PaymentRequestPromise {
      this.cancelledCallback.push(callback);
      return this;
    }

    /** @internal */
    trigger(argument?: IError | Transaction): PaymentRequestPromise {
      if (!argument) {
        this.cancelledCallback.resolve();
      }
      else if ('isError' in argument) {
        this.failedCallbacks.resolve(argument);
      }
      else {
        switch(argument.state) {
          case TransactionState.INITIATED: this.initiatedCallbacks.resolve(argument); break;
          case TransactionState.APPROVED: this.approvedCallbacks.resolve(argument); break;
          case TransactionState.FINISHED: this.finishedCallbacks.resolve(argument); break;
        }
      }
      return this;
    }

    /**
     * Return a failed promise.
     *
     * @internal
     */
    static failed(code: ErrorCode, message: string, platform: Platform | null, productId: string | null) {
      return new PaymentRequestPromise().trigger(storeError(code, message, platform, productId));
    }

    /**
     * Return a failed promise.
     *
     * @internal
     */
    static cancelled() {
      return new PaymentRequestPromise().trigger();
    }

    /**
     * Return an initiated transaction.
     *
     * @internal
     */
    static initiated(transaction: Transaction) {
      return new PaymentRequestPromise().trigger(transaction);
    }
  }

  /**
   * Item being purchased with `requestPayment`
   *
   * The format is such as it's compatible with `Product`. This way, normal products can be added to
   * the payment request.
   */
  export interface PaymentRequestItem {

    /** Identifier */
    id: string;

    /** Label for the item */
    title: string;

    /** Item pricing information.
     *
     * It can be undefined if a single product is purchased. If that case, it's assumed the price
     * is equal to the total amount requested. */
    pricing?: {
      /** Price in micro units (i.e. price * 1,000,000) */
      priceMicros: number;
      /** Currency, for verification, if set it should be equal to the PaymentRequest currency */
      currency?: string;
    }
  }

  /**
   * Request for payment.
   *
   * Use with {@link Store.requestPayment} to initiate a payment for a given amount.
   *
   * @example
   *  const {store, Platform, ErrorCode} = CdvPurchase;
   *  store.requestPayment({
   *    platform: Platform.BRAINTREE,
   *    items: [{
   *      id: 'margherita_large',
   *      title: 'Pizza Margherita Large',
   *      pricing: {
   *        priceMicros: 9990000,
   *      }
   *    }, {
   *      id: 'delivery_standard',
   *      title: 'Delivery',
   *      pricing: {
   *        priceMicros: 2000000,
   *      }
   *    }]
   *    amountMicros: 11990000,
   *    currency: 'USD',
   *    description: 'This this the description of the payment request',
   *  })
   *  .cancelled(() => { // user cancelled by closing the window
   *  })
   *  .failed(error => { // payment request failed
   *  })
   *  .initiated(transaction => { // transaction initiated
   *  })
   *  .approved(transaction => { // transaction approved
   *  })
   *  .finished(transaction => { // transaction finished
   *  });
   */
  export interface PaymentRequest {

    /**
     * Products being purchased.
     *
     * They do not have to be products registered with the plugin, but they can be.
     */
    items: (PaymentRequestItem | undefined)[];

    /**
     * Platform that will handle the payment request.
     */
    platform: Platform;

    /**
     * Amount to pay.
     *
     * Default to the sum of all items.
     */
    amountMicros?: number;

    /**
     * Currency.
     *
     * Some payment platforms only support one currency thus do not require this field.
     *
     * Default to the currency of the items.
     */
    currency?: string;

    /**
     * Description for the payment.
     */
    description?: string;

    /** The email used for verification. Optional. */
    email?: string;

    /**
     * The mobile phone number used for verification. Optional.
     *
     * Only numbers. Remove dashes, parentheses and other characters.
     */
    mobilePhoneNumber?: string;

    /** The billing address used for verification. Optional. */
    billingAddress?: PostalAddress;
  }

  /**
   * Postal address for payment requests.
   */
  export interface PostalAddress {

    /** Given name associated with the address. */
    givenName?: string;

    /** Surname associated with the address. */
    surname?: string;

    /** Line 1 of the Address (eg. number, street, etc) */
    streetAddress1?: string;

    /** Line 2 of the Address (eg. suite, apt #, etc.) */
    streetAddress2?: string;

    /** Line 3 of the Address (eg. suite, apt #, etc.) */
    streetAddress3?: string;

    /** City name */
    locality?: string;

    /** Either a two-letter state code (for the US), or an ISO-3166-2 country subdivision code of up to three letters. */
    region?: string;

    /**
     * Zip code or equivalent is usually required for countries that have them.
     *
     * For a list of countries that do not have postal codes please refer to http://en.wikipedia.org/wiki/Postal_code
     */
    postalCode?: string;

    /**
     * The phone number associated with the address
     *
     * Note: Only numbers. Remove dashes, parentheses and other characters
     */
    phoneNumber?: string;

    /**
     * 2 letter country code
     */
    countryCode?: string;
  }
}
