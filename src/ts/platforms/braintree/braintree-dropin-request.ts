namespace CdvPurchase {
  export namespace Braintree {
    export namespace DropIn {

      /** A Braintree Drop-In Request */
      export interface Request {

        threeDSecureRequest?: ThreeDSecure.Request;

        // requestThreeDSecureVerification?: boolean;
        // collectDeviceData?: boolean;

        /**
         * the default value used to determine if Drop-in should vault the customer's card.
         *
         * This setting can be overwritten by the customer if the save card checkbox is visible using setAllowVaultCardOverride(boolean)
         *
         * If the save card CheckBox is shown, and default vault value is true: the save card CheckBox will appear pre-checked.
         * If the save card CheckBox is shown, and default vault value is false: the save card Checkbox will appear un-checked.
         * If the save card CheckBox is not shown, and default vault value is true: card always vaults.
         * If the save card CheckBox is not shown, and default vault value is false: card never vaults.
         *
         * This value is true by default.
         */
        vaultCardDefaultValue?: boolean;

        /**
         * - true shows save card CheckBox to allow user to choose whether or not to vault their card.
         * - false does not show Save Card CheckBox.
         * 
         * Default value is false.
         */
        allowVaultCardOverride?: boolean;

        /**
         * Sets the Cardholder Name field status, which is how it will behave in CardForm.
         * 
         * Default is DISABLED.
         */
        cardholderNameStatus?: CardFormFieldStatus;

        /**
         * true to allow customers to manage their vaulted payment methods. Defaults to false.
         */
        vaultManager?: boolean;

        /**
         * If set to true, disables Card in Drop-in. Default value is false.
         */
        disableCard?: boolean;

        /**
         * true to mask the card number when the field is not focused. See com.braintreepayments.cardform.view.CardEditText for more details.
         */
        maskCardNumber?: boolean;

        /**
         * true to mask the security code during input. Defaults to false.
         */
        maskSecurityCode?: boolean;
      }

      /** How a field will behave in CardForm. */
      export enum CardFormFieldStatus {
        DISABLED = 0,
        OPTIONAL = 1,
        REQUIRED = 2,
      }

    }
  }
}
