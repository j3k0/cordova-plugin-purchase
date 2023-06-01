namespace CdvPurchase {

    export namespace Validator {

        /**
         * Dates stored as a ISO formatted string
         */
        export type ISODate = string;

        /**
         * Receipt validator as a function.
         */
        export interface Function {
            (receipt: Validator.Request.Body, callback: Callback<Validator.Response.Payload>): void;
        }

        /**
         * Custom definition of the validation request target.
         */
        export interface Target {

            /** URL of the receipt validator */
            url: string;

            /** Custom headers */
            headers?: { [token: string]: string };

            /** Request timeout in millseconds */
            timeout?: number;
        }

    }
}
