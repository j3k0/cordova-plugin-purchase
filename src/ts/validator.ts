namespace CDVPurchase2
{
    export interface ValidatorCallback {
        (success: boolean, data: any): void;
    }

    export interface ValidatorFunction {
        (offer: Offer, callback: ValidatorCallback): void;
    }

    export interface ValidatorTarget {
        url: string;
        headers?: { [token: string]: string };
    }

    export namespace Internal {

        export class ReceiptsToValidate {
            private array: Receipt[] = [];

            get(): Receipt[] {
                return this.array.concat();
            }

            add(receipt: Receipt) {
                if (!this.has(receipt))
                    this.array.push(receipt);
            }

            clear() {
                while (this.array.length !== 0)
                    this.array.pop();
            }

            has(receipt: Receipt): boolean {
                return !!this.array.find(el => el === receipt);
            }
        }

        export interface ValidatorController {
            get validator(): string | ValidatorFunction | ValidatorTarget | undefined;
            get receipts(): Receipt[];
        }

        export class Validator {

            private receipts: ReceiptsToValidate = new ReceiptsToValidate();
            private controller: ValidatorController;

            constructor(controller: ValidatorController) {
                this.controller = controller;
            }

            add(receiptOrTransaction: Receipt | Transaction) {
                const receipt: Receipt | undefined =
                    (receiptOrTransaction instanceof Transaction)
                        ? this.controller.receipts.filter(r => r.hasTransaction(receiptOrTransaction))[0]
                        : receiptOrTransaction;
                if (receipt) {
                    this.receipts.add(receipt);
                }
            }

            run(onVerified: (receipt: Receipt) => void) {
                // pseudo implementation
                const receipts = this.receipts.get();
                this.receipts.clear();
                receipts.forEach(receipt => {
                    setTimeout(() => onVerified(receipt), 0);
                });
            }
        }
    }
}
