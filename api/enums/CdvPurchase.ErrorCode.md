# Enumeration: ErrorCode

[CdvPurchase](../modules/CdvPurchase.md).ErrorCode

Error codes

## Table of contents

### Enumeration Members

- [BAD\_RESPONSE](CdvPurchase.ErrorCode.md#bad_response)
- [CLIENT\_INVALID](CdvPurchase.ErrorCode.md#client_invalid)
- [CLOUD\_SERVICE\_NETWORK\_CONNECTION\_FAILED](CdvPurchase.ErrorCode.md#cloud_service_network_connection_failed)
- [CLOUD\_SERVICE\_PERMISSION\_DENIED](CdvPurchase.ErrorCode.md#cloud_service_permission_denied)
- [CLOUD\_SERVICE\_REVOKED](CdvPurchase.ErrorCode.md#cloud_service_revoked)
- [COMMUNICATION](CdvPurchase.ErrorCode.md#communication)
- [DOWNLOAD](CdvPurchase.ErrorCode.md#download)
- [FINISH](CdvPurchase.ErrorCode.md#finish)
- [INVALID\_OFFER\_IDENTIFIER](CdvPurchase.ErrorCode.md#invalid_offer_identifier)
- [INVALID\_OFFER\_PRICE](CdvPurchase.ErrorCode.md#invalid_offer_price)
- [INVALID\_PRODUCT\_ID](CdvPurchase.ErrorCode.md#invalid_product_id)
- [INVALID\_SIGNATURE](CdvPurchase.ErrorCode.md#invalid_signature)
- [LOAD](CdvPurchase.ErrorCode.md#load)
- [LOAD\_RECEIPTS](CdvPurchase.ErrorCode.md#load_receipts)
- [MISSING\_OFFER\_PARAMS](CdvPurchase.ErrorCode.md#missing_offer_params)
- [MISSING\_TOKEN](CdvPurchase.ErrorCode.md#missing_token)
- [PAYMENT\_CANCELLED](CdvPurchase.ErrorCode.md#payment_cancelled)
- [PAYMENT\_EXPIRED](CdvPurchase.ErrorCode.md#payment_expired)
- [PAYMENT\_INVALID](CdvPurchase.ErrorCode.md#payment_invalid)
- [PAYMENT\_NOT\_ALLOWED](CdvPurchase.ErrorCode.md#payment_not_allowed)
- [PRIVACY\_ACKNOWLEDGEMENT\_REQUIRED](CdvPurchase.ErrorCode.md#privacy_acknowledgement_required)
- [PRODUCT\_NOT\_AVAILABLE](CdvPurchase.ErrorCode.md#product_not_available)
- [PURCHASE](CdvPurchase.ErrorCode.md#purchase)
- [REFRESH](CdvPurchase.ErrorCode.md#refresh)
- [REFRESH\_RECEIPTS](CdvPurchase.ErrorCode.md#refresh_receipts)
- [SETUP](CdvPurchase.ErrorCode.md#setup)
- [SUBSCRIPTIONS\_NOT\_AVAILABLE](CdvPurchase.ErrorCode.md#subscriptions_not_available)
- [SUBSCRIPTION\_UPDATE\_NOT\_AVAILABLE](CdvPurchase.ErrorCode.md#subscription_update_not_available)
- [UNAUTHORIZED\_REQUEST\_DATA](CdvPurchase.ErrorCode.md#unauthorized_request_data)
- [UNKNOWN](CdvPurchase.ErrorCode.md#unknown)
- [VERIFICATION\_FAILED](CdvPurchase.ErrorCode.md#verification_failed)

## Enumeration Members

### BAD\_RESPONSE

• **BAD\_RESPONSE** = `number`

Error: Bad response from the server

___

### CLIENT\_INVALID

• **CLIENT\_INVALID** = `number`

Error: Client is not allowed to issue the request

___

### CLOUD\_SERVICE\_NETWORK\_CONNECTION\_FAILED

• **CLOUD\_SERVICE\_NETWORK\_CONNECTION\_FAILED** = `number`

Error: The device could not connect to the network.

___

### CLOUD\_SERVICE\_PERMISSION\_DENIED

• **CLOUD\_SERVICE\_PERMISSION\_DENIED** = `number`

Error: The user has not allowed access to Cloud service information

___

### CLOUD\_SERVICE\_REVOKED

• **CLOUD\_SERVICE\_REVOKED** = `number`

Error: The user has revoked permission to use this cloud service.

___

### COMMUNICATION

• **COMMUNICATION** = `number`

Error: Failed to communicate with the server

___

### DOWNLOAD

• **DOWNLOAD** = `number`

Error: Failed to download the content

___

### FINISH

• **FINISH** = `number`

Error: Cannot finalize a transaction or acknowledge a purchase

___

### INVALID\_OFFER\_IDENTIFIER

• **INVALID\_OFFER\_IDENTIFIER** = `number`

Error: The offer identifier is invalid.

___

### INVALID\_OFFER\_PRICE

• **INVALID\_OFFER\_PRICE** = `number`

Error: The price you specified in App Store Connect is no longer valid.

___

### INVALID\_PRODUCT\_ID

• **INVALID\_PRODUCT\_ID** = `number`

Error: The product identifier is invalid

___

### INVALID\_SIGNATURE

• **INVALID\_SIGNATURE** = `number`

Error: The signature in a payment discount is not valid.

___

### LOAD

• **LOAD** = `number`

Error: Failed to load in-app products metadata

___

### LOAD\_RECEIPTS

• **LOAD\_RECEIPTS** = `number`

Error: Failed to load the purchase receipt

___

### MISSING\_OFFER\_PARAMS

• **MISSING\_OFFER\_PARAMS** = `number`

Error: Parameters are missing in a payment discount.

___

### MISSING\_TOKEN

• **MISSING\_TOKEN** = `number`

Error: Purchase information is missing token

___

### PAYMENT\_CANCELLED

• **PAYMENT\_CANCELLED** = `number`

Error: Purchase flow has been cancelled by user

___

### PAYMENT\_EXPIRED

• **PAYMENT\_EXPIRED** = `number`

Error: Payment has expired

___

### PAYMENT\_INVALID

• **PAYMENT\_INVALID** = `number`

Error: Something is suspicious about a purchase

___

### PAYMENT\_NOT\_ALLOWED

• **PAYMENT\_NOT\_ALLOWED** = `number`

Error: The user is not allowed to make a payment

___

### PRIVACY\_ACKNOWLEDGEMENT\_REQUIRED

• **PRIVACY\_ACKNOWLEDGEMENT\_REQUIRED** = `number`

Error: The user has not yet acknowledged Apple’s privacy policy

___

### PRODUCT\_NOT\_AVAILABLE

• **PRODUCT\_NOT\_AVAILABLE** = `number`

Error: The requested product is not available in the store.

___

### PURCHASE

• **PURCHASE** = `number`

Error: Failed to make a purchase

___

### REFRESH

• **REFRESH** = `number`

Error: Failed to refresh the store

___

### REFRESH\_RECEIPTS

• **REFRESH\_RECEIPTS** = `number`

Error: Failed to refresh the purchase receipt

___

### SETUP

• **SETUP** = `number`

Error: Failed to intialize the in-app purchase library

___

### SUBSCRIPTIONS\_NOT\_AVAILABLE

• **SUBSCRIPTIONS\_NOT\_AVAILABLE** = `number`

Error: Subscriptions are not available

___

### SUBSCRIPTION\_UPDATE\_NOT\_AVAILABLE

• **SUBSCRIPTION\_UPDATE\_NOT\_AVAILABLE** = `number`

Error: Failed to update a subscription

___

### UNAUTHORIZED\_REQUEST\_DATA

• **UNAUTHORIZED\_REQUEST\_DATA** = `number`

Error: The app is attempting to use a property for which it does not have the required entitlement.

___

### UNKNOWN

• **UNKNOWN** = `number`

Error: Unknown error

___

### VERIFICATION\_FAILED

• **VERIFICATION\_FAILED** = `number`

Error: Verification of store data failed
