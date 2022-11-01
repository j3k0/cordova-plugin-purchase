# Interface: DeviceInfo

[CdvPurchase](../modules/CdvPurchase.md).[Validator](../modules/CdvPurchase.Validator.md).DeviceInfo

## Properties

### cordova

• `Optional` **cordova**: `string`

Version of cordova. Requires "support" or "analytics" policy.

___

### fingerprint

• `Optional` **fingerprint**: `string`

Best effort device fingerprint. Only when the "fraud" policy is enabled.

___

### ionic

• `Optional` **ionic**: `string`

Ionic version. Requires "support" or "analytics" policy.

___

### isVirtual

• `Optional` **isVirtual**: `boolean`

If the device is running in a simulator

___

### manufacturer

• `Optional` **manufacturer**: `string`

Device manufacturer. Requires "support" or "analytics" policy.

___

### model

• `Optional` **model**: `string`

Device model. Requires "support" or "analytics" policy.

___

### platform

• `Optional` **platform**: `string`

OS. Requires "support" or "analytics" policy.

___

### plugin

• `Optional` **plugin**: `string`

Version of the plugin. Requires "support" or "analytics" policy.

___

### serial

• `Optional` **serial**: `string`

Hardware serial number. Only when the "tracking" policy is enabled.

___

### uuid

• `Optional` **uuid**: `string`

Device UUID. Only when the "tracking" policy is enabled.

___

### version

• `Optional` **version**: `string`

OS version. Requires "support" or "analytics" policy.
