# Overview

The most important classes in plugin are:

 - The {@link CdvPurchase.Store Store} class - Entry point to the features of the plugin.
 - The {@link CdvPurchase.Product Product} class - Contains the definition of a product on the store.
 - The {@link CdvPurchase.Receipt Receipt} class - Contains the information of the users purchases.

In general, you will only interact with direct members of the {@link CdvPurchase} namespace.

# Contributing to the API documentation

This API documentation is **generated with [typedoc](https://typedoc.org)**. Do not edit files in the `api/` directory directly. Only edit files in src/ts/ then run "npm run typedoc".

In particular, the source file for the README.md `src/ts/README.md`
