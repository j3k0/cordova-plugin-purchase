# Troubleshooting

#### iOS - Apple reject app because no IPv6 compatibility
Please check your `store.validator` settings! Your hostname need to be reachable via IPv4 and IPv6. If your hostname can't be connected via dualstack Apple will reject your app. This is mostly when you use product type `store.PAID_SUBSCRIPTION`.

#### Andorid - Problems with the payment (Billing Key changed)
Sometimes you have to change the BILLING_KEY, if this is the case you have to handle several places to change the BILLING_KEY.
It is best to search for the old BILLING_KEY and change the BILLING_KEY with the new BILLING_KEY. This should fix all problems.
