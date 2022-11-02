# Interface: DeviceInfo

[CdvPurchase](../modules/CdvPurchase.md).[Validator](../modules/CdvPurchase.Validator.md).DeviceInfo

## Table of contents

### Properties

- [cordova](CdvPurchase.Validator.DeviceInfo.md#cordova)
- [fingerprint](CdvPurchase.Validator.DeviceInfo.md#fingerprint)
- [ionic](CdvPurchase.Validator.DeviceInfo.md#ionic)
- [isVirtual](CdvPurchase.Validator.DeviceInfo.md#isvirtual)
- [manufacturer](CdvPurchase.Validator.DeviceInfo.md#manufacturer)
- [model](CdvPurchase.Validator.DeviceInfo.md#model)
- [platform](CdvPurchase.Validator.DeviceInfo.md#platform)
- [plugin](CdvPurchase.Validator.DeviceInfo.md#plugin)
- [serial](CdvPurchase.Validator.DeviceInfo.md#serial)
- [uuid](CdvPurchase.Validator.DeviceInfo.md#uuid)
- [version](CdvPurchase.Validator.DeviceInfo.md#version)

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
