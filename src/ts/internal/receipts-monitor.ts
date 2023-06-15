namespace CdvPurchase
{
    export namespace Internal {

        export interface ReceiptsMonitorController {
            when(): When;
            hasLocalReceipts(): boolean;
            receiptsVerified(): void;
            hasValidator(): boolean;
            numValidationRequests(): number;
            numValidationResponses(): number;
            off<T>(callback: Callback<T>): void;
            log: Logger,
        }

        export class ReceiptsMonitor {

            controller: ReceiptsMonitorController;
            log: Logger;

            constructor(controller: ReceiptsMonitorController) {
                this.controller = controller;
                this.log = controller.log.child('ReceiptsMonitor');
            }

            private hasCalledReceiptsVerified = false;

            callReceiptsVerified() {
                if (this.hasCalledReceiptsVerified) return;
                this.hasCalledReceiptsVerified = true;
                this.log.info('receiptsVerified()');
                this.controller.receiptsVerified();
            }

            launch() {
                const check = () => {
                    this.log.debug(`check(${this.controller.numValidationResponses()}/${this.controller.numValidationRequests()})`);
                    if (this.controller.numValidationRequests() === this.controller.numValidationResponses()) {
                        this.callReceiptsVerified();
                        this.controller.off(check);
                    }
                }
                this.controller.when()
                .verified(check)
                .unverified(check)
                .receiptsReady(() => {
                    this.log.debug('receiptsReady...');
                    if (!this.controller.hasLocalReceipts() || !this.controller.hasValidator()) {
                        setTimeout(() => {
                            check();
                        }, 0);
                    }
                    // after 5s, if no "verified" or "unverified" have been triggered, we'll run a final test.
                    setTimeout(() => {
                        this.log.debug('check after 5s');
                        check();
                    }, 5000);
                });
            }
        }
    }
}
