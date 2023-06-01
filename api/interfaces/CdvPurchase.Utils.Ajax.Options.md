# Interface: Options<T\>

[Utils](../modules/CdvPurchase.Utils.md).[Ajax](../modules/CdvPurchase.Utils.Ajax.md).Options

Option for an external HTTP request

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [customHeaders](CdvPurchase.Utils.Ajax.Options.md#customheaders)
- [data](CdvPurchase.Utils.Ajax.Options.md#data)
- [error](CdvPurchase.Utils.Ajax.Options.md#error)
- [method](CdvPurchase.Utils.Ajax.Options.md#method)
- [success](CdvPurchase.Utils.Ajax.Options.md#success)
- [timeout](CdvPurchase.Utils.Ajax.Options.md#timeout)
- [url](CdvPurchase.Utils.Ajax.Options.md#url)

## Properties

### customHeaders

• `Optional` **customHeaders**: `Object`

Custom headers to pass tot the HTTP request.

#### Index signature

▪ [key: `string`]: `string`

___

### data

• `Optional` **data**: `object`

Payload for a POST request

___

### error

• `Optional` **error**: [`ErrorCallback`](../modules/CdvPurchase.Utils.Ajax.md#errorcallback)

Error callback taking the response error code, text and body as arguments

___

### method

• `Optional` **method**: `string`

Method for the request (POST, GET, ...)

___

### success

• `Optional` **success**: [`SuccessCallback`](../modules/CdvPurchase.Utils.Ajax.md#successcallback)<`T`\>

A success callback taking the body as an argument

___

### timeout

• `Optional` **timeout**: `number`

Request timeout in milliseconds

___

### url

• **url**: `string`

URL of the request (https://example.com)
