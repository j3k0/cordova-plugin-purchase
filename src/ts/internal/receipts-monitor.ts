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
            intervalChecker?: number;

            constructor(controller: ReceiptsMonitorController) {
                this.controller = controller;
                this.log = controller.log.child('ReceiptsMonitor');
            }

            private hasCalledReceiptsVerified = false;

            callReceiptsVerified() {
                if (this.hasCalledReceiptsVerified) return;
                this.hasCalledReceiptsVerified = true;
                this.log.info('receiptsVerified()');
                // ensure those 2 events are called in order.
                this.controller.when().receiptsReady(() => {
                    setTimeout(() => {
                        this.controller.receiptsVerified();
                    }, 0);
                }, 'receiptsMonitor_callReceiptsVerified');
            }

            launch() {
                const check = () => {
                    this.log.debug(`check(${this.controller.numValidationResponses()}/${this.controller.numValidationRequests()})`);
                    if (this.controller.numValidationRequests() === this.controller.numValidationResponses()) {
                        if (this.intervalChecker !== undefined) {
                            clearInterval(this.intervalChecker);
                            this.intervalChecker = undefined;
                        }
                        this.controller.off(check);
                        this.callReceiptsVerified();
                    }
                }
                this.controller.when()
                .verified(check, 'receiptsMonitor_check')
                .unverified(check, 'receiptsMonitor_check')
                .receiptsReady(() => {
                    this.log.debug('receiptsReady...');
                    if (!this.controller.hasLocalReceipts() || !this.controller.hasValidator()) {
                        setTimeout(() => {
                            check();
                        }, 0);
                    }
                    // check every 10s, to handle cases where neither "verified" nor "unverified" have been triggered.
                    this.intervalChecker = setInterval(() => {
                        this.log.debug('keep checking every 10s...');
                        check();
                    }, 10000);
                }, 'receiptsMonitor_setup');
            }
        }
    }
}
