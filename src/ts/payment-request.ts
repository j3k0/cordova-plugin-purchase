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
    static failed(code: ErrorCode, message: string) {
      return new PaymentRequestPromise().trigger(storeError(code, message));
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
   * Request for payment.
   *
   * Use with {@link Store.requestPayment} to initiate a payment for a given amount.
   *
   * @example
   *  const {store, Platform, ErrorCode} = CdvPurchase;
   *  store.requestPayment({
   *    platform: Platform.BRAINTREE,
   *    productIds: ['my-product-1', 'my-product-2'],
   *    amountMicros: 1990000,
   *    currency: 'USD',
   *    description: 'This this the description of the payment request',
   *  }).then((result) => {
   *    if (result && result.isError && result.code !== ErrorCode.PAYMENT_CANCELLED) {
   *      alert(result.message);
   *    }
   *  });
   */
  export interface PaymentRequest {

    /**
     * Products being purchased.
     *
     * Used for your reference, does not have to be a product registered with the plugin.
     */
    productIds: string[];

    /**
     * Platform that will handle the payment request.
     */
    platform: Platform;

    /**
     * Amount to pay. Required.
     */
    amountMicros: number;

    /**
     * Currency.
     *
     * Some payment platforms only support one currency thus do not require this field.
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
