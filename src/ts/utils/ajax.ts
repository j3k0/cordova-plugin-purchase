// plugins or browser extensions
declare var msCrypto: any;

namespace CdvPurchase {

    export namespace Utils {

        export namespace Ajax {

            /** HTTP status returned when a request times out */
            export const HTTP_REQUEST_TIMEOUT = 408;

            /** Success callback for an ajax call */
            export type SuccessCallback<T> = (body: T) => void;

            /** Error callback for an ajax call */
            export type ErrorCallback = (statusCode: number, statusText: string, data: null | object) => void;

            /** Option for an external HTTP request */
            export interface Options<T> {

                /** URL of the request (https://example.com) */
                url: string;

                /** Method for the request (POST, GET, ...) */
                method?: string;

                /** A success callback taking the body as an argument */
                success?: SuccessCallback<T>;

                /** Error callback taking the response error code, text and body as arguments */
                error?: ErrorCallback;

                /** Payload for a POST request */
                data?: object;

                /** Custom headers to pass tot the HTTP request. */
                customHeaders?: { [key: string]: string };

                /** Request timeout in milliseconds */
                timeout?: number;
            }


        }

        /**
         * Simplified version of jQuery's ajax method based on XMLHttpRequest.
         *
         * Uses cordova's http plugin when installed.
         *
         * Only supports JSON requests.
         */
        export function ajax<T>(log: Logger, options: Ajax.Options<T>): { done: (cb: () => void) => void } {

            if (typeof window !== 'undefined' && window.cordova && window.cordova.plugin && window.cordova.plugin.http) {
                return ajaxWithHttpPlugin(log, options);
            }
            var doneCb = function () { };
            var xhr = new XMLHttpRequest();
            if (options.timeout) {
                xhr.timeout = options.timeout;
                xhr.ontimeout = function (/*event*/) {
                    log.warn("ajax -> request to " + options.url + " timeout");
                    Utils.callExternal(log, 'ajax.error', options.error as Function, Ajax.HTTP_REQUEST_TIMEOUT, "Timeout");
                };
            }
            xhr.open(options.method || 'POST', options.url, true);
            xhr.onreadystatechange = function (/*event*/) {
                try {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            Utils.callExternal(log, 'ajax.success', options.success as Function, JSON.parse(xhr.responseText));
                        }
                        else {
                            log.warn("ajax -> request to " + options.url + " failed with status " + xhr.status + " (" + xhr.statusText + ")");
                            Utils.callExternal(log, 'ajax.error', options.error as Function, xhr.status, xhr.statusText);
                        }
                    }
                }
                catch (e) {
                    log.warn("ajax -> request to " + options.url + " failed with an exception: " + (e as Error).message);
                    if (options.error) options.error(417, (e as Error).message, null);
                }
                if (xhr.readyState === 4)
                    Utils.callExternal(log, 'ajax.done', doneCb);
            };
            const customHeaders = options.customHeaders;
            if (customHeaders) {
                Object.keys(customHeaders).forEach(function (header) {
                    log.debug('ajax -> adding custom header: ' + header);
                    xhr.setRequestHeader(header, customHeaders[header]);
                });
            }
            xhr.setRequestHeader("Accept", "application/json");
            log.debug('ajax -> send request to ' + options.url);
            if (options.data) {
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.send(JSON.stringify(options.data));
            }
            else {
                xhr.send();
            }
            return {
                done: function (cb: () => void) { doneCb = cb; return this; }
            };
        }

        /**
         * Simplified version of jQuery's ajax method based on XMLHttpRequest.
         *
         * Uses the http plugin.
         */
        function ajaxWithHttpPlugin<T>(log: Logger, options: Ajax.Options<T>): { done: (cb: () => void) => void } {
            let doneCb = function () { };
            const ajaxOptions: any = {
                method: (options.method || 'get').toLowerCase(),
                data: options.data,
                serializer: 'json',
                // responseType: 'json',
            };
            if (options.customHeaders) {
                log.debug('ajax[http] -> adding custom headers: ' + JSON.stringify(options.customHeaders));
                ajaxOptions.headers = options.customHeaders;
            }
            log.debug('ajax[http] -> send request to ' + options.url);
            const ajaxDone = (response: any) => {
                try {
                    if (response.status == 200) {
                        Utils.callExternal(log, 'ajax.success', options.success, JSON.parse(response.data));
                    }
                    else {
                        log.warn("ajax[http] -> request to " + options.url + " failed with status " + response.status + " (" + response.error + ")");
                        Utils.callExternal(log, 'ajax.error', options.error, response.status, response.error);
                    }
                }
                catch (e) {
                    log.warn("ajax[http] -> request to " + options.url + " failed with an exception: " + (e as Error).message);
                    if (options.error) Utils.callExternal(log, 'ajax.error', options.error, 417, (e as Error).message);
                }
                Utils.callExternal(log, 'ajax.done', doneCb);
            }
            window.cordova.plugin.http.sendRequest(options.url, ajaxOptions, ajaxDone, ajaxDone);
            return {
                done: function (cb: () => void) { doneCb = cb; return this; }
            };
        }
    }
}
