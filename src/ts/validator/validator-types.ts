namespace CdvPurchase {

    export namespace Validator {

        /**
         * Dates stored as a ISO formatted string
         */
        export type ISODate = string;

        export type Callback = (payload: Validator.Response.Payload) => void;

        export interface Function {
            (receipt: Receipt, callback: Callback): void;
        }

        export interface Target {
            url: string;
            headers?: { [token: string]: string };
        }

    }
}
