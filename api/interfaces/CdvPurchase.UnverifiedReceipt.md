# Interface: UnverifiedReceipt

[CdvPurchase](../modules/CdvPurchase.md).UnverifiedReceipt

## Table of contents

### Properties

- [payload](CdvPurchase.UnverifiedReceipt.md#payload)
- [receipt](CdvPurchase.UnverifiedReceipt.md#receipt)
- [transient](CdvPurchase.UnverifiedReceipt.md#transient)

## Properties

### payload

• **payload**: [`ErrorPayload`](CdvPurchase.Validator.Response.ErrorPayload.md)

___

### receipt

• **receipt**: [`Receipt`](../classes/CdvPurchase.Receipt.md)

___

### transient

• `Optional` **transient**: `boolean`

True when validation failed for a temporary reason: the validator
(or the store behind it) couldn't be reached, timed out, or answered
with a server error. The receipt may well be valid.

Don't revoke access on a transient failure: keep what your app (or
your server) last knew, and validate again later.

The plugin already retried a few times (with backoff) before firing
a transient failure.

False when the validator gave a definitive answer (e.g. invalid
receipt, expired subscription, authentication error).

Transient:
- HTTP 5xx, from the transport or as `payload.status` in the response body
- `CONNECTION_FAILED` (6778002) from the validator
- request timeout, no network, unreadable response

Definitive: everything else (HTTP 400 `INVALID_PAYLOAD`, 401/403, 410,
419 expired, ...).

Set by the plugin on every `unverified` event since v13.19.0.
