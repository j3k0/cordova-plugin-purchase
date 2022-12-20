namespace CdvPurchase {

    export namespace Validator {

        /**
         * Dates stored as a ISO formatted string
         */
        export type ISODate = string;

        export interface Function {
            (receipt: Validator.Request.Body, callback: Callback<Validator.Response.Payload>): void;
        }

        export interface Target {
            url: string;
            headers?: { [token: string]: string };
        }

    }
}
