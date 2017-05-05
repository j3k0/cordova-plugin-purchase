# Troubleshooting

#### iOS - Apple reject app because no IPv6 compatibility
Please check your `store.validator` settings! Your hostname need to be reachable via IPv4 and IPv6. If your hostname can't be connected via dualstack Apple will reject your app. This is mostly when you use product type `store.PAID_SUBSCRIPTION`.
