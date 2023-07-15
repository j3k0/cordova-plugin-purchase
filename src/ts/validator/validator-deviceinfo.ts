namespace CdvPurchase {

    export namespace Validator {

        export interface DeviceInfo {

            /** Version of the plugin. Requires "support" or "analytics" policy. */
            plugin?: string;

            /** Version of cordova. Requires "support" or "analytics" policy. */
            cordova?: string;

            /** Device model. Requires "support" or "analytics" policy. */
            model?: string;

            /** OS. Requires "support" or "analytics" policy. */
            platform?: string;

            /** OS version. Requires "support" or "analytics" policy. */
            version?: string;

            /** Device manufacturer. Requires "support" or "analytics" policy. */
            manufacturer?: string;

            /** Ionic version. Requires "support" or "analytics" policy. */
            ionic?: string;

            /** Hardware serial number. Only when the "tracking" policy is enabled. */
            serial?: string;

            /** Device UUID. Only when the "tracking" policy is enabled. */
            uuid?: string;

            /** If the device is running in a simulator */
            isVirtual?: boolean;

            /** Best effort device fingerprint. Only when the "fraud" policy is enabled. */
            fingerprint?: string;
        }

        /**
         * @internal
         */
        export namespace Internal {

            export interface PrivacyPolicyProvider {
                validator_privacy_policy: undefined | string | string[];
            }

            function isArray<T>(arg: any): arg is Array<T> {
                return Object.prototype.toString.call(arg) === '[object Array]';
            }
            function isObject(arg: any) {
                return Object.prototype.toString.call(arg) === '[object Object]';
            }

            // List of functions allowed by store.validator_privacy_policy
            function getPrivacyPolicy(store: PrivacyPolicyProvider): PrivacyPolicyItem[] {
                if (typeof store.validator_privacy_policy === 'string')
                    return store.validator_privacy_policy.split(',') as PrivacyPolicyItem[];
                else if (isArray<PrivacyPolicyItem>(store.validator_privacy_policy))
                    return store.validator_privacy_policy;
                else // default: no tracking
                    return ['analytics', 'support', 'fraud'];
            }

            export function getDeviceInfo(store: PrivacyPolicyProvider): DeviceInfo {

                const privacyPolicy = getPrivacyPolicy(store); // string[]
                function allowed(policy: PrivacyPolicyItem) {
                    return privacyPolicy.indexOf(policy) >= 0;
                }

                // Different versions of the plugin use different response fields.
                // Sending this information allows the validator to reply with only expected information.
                const ret: DeviceInfo = {
                    plugin: 'cordova-plugin-purchase/' + CdvPurchase.PLUGIN_VERSION,
                };

                const wdw: {
                    device: any;
                    ionic: any;
                    Ionic: any;
                } = window as any;

                // the cordova-plugin-device global object
                const device: any = isObject(wdw.device) ? wdw.device : {};

                // Send the receipt validator information about the device.
                // This will allow to make vendor or device specific fixes and detect class
                // of devices with issues.
                // Knowing running version of OS and libraries also required for handling
                // support requests.
                if (allowed('analytics') || allowed('support')) {
                    // Version of ionic (if applicable)
                    const ionic = wdw.Ionic || wdw.ionic;
                    if (ionic && ionic.version)
                        ret.ionic = ionic.version;
                    // Information from the cordova-plugin-device (if installed)
                    if (device.cordova)
                        ret.cordova = device.cordova; // Version of cordova
                    if (device.model)
                        ret.model = device.model; // Device model
                    if (device.platform)
                        ret.platform = device.platform; // OS
                    if (device.version)
                        ret.version = device.version; // OS version
                    if (device.manufacturer)
                        ret.manufacturer = device.manufacturer; // Device manufacturer
                }

                // Device identifiers are used for tracking users across services
                // It is sometimes required for support requests too, but I choose to
                // keep this out.
                if (allowed('tracking')) {
                    if (device.serial)
                        ret.serial = device.serial; // Hardware serial number
                    if (device.uuid)
                        ret.uuid = device.uuid; // Device UUID
                }

                // Running from a simulator is an error condition for in-app purchases.
                // Since only developers run in a simulator, let's always report that.
                if (device.isVirtual)
                    ret.isVirtual = device.isVirtual; // Simulator

                // Probably nobody wants to disable fraud discovery.
                // A fingerprint of the device identifiers is used for fraud discovery.
                // An alert should be triggered by the validator when a lot of devices
                // share a single receipt.
                if (allowed('fraud')) {
                    // For fraud discovery, we only need a fingerprint of the device.
                    var fingerprint = '';
                    if (device.serial)
                        fingerprint = 'serial:' + device.serial; // Hardware serial number
                    else if (device.uuid)
                        fingerprint = 'uuid:' + device.uuid; // Device UUID
                    else {
                        // Using only model and manufacturer, we might end-up with many
                        // users sharing the same fingerprint, which is fine for fraud discovery.
                        if (device.model)
                            fingerprint += '/' + device.model;
                        if (device.manufacturer)
                            fingerprint = '/' + device.manufacturer;
                    }
                    // Fingerprint is hashed to keep required level of privacy.
                    if (fingerprint)
                        ret.fingerprint = CdvPurchase.Utils.md5(fingerprint);
                }

                return ret;
            }
        }
    }
}
