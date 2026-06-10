import '../www/store';

// Tests for Validator.Internal.getDeviceInfo: device information gathering
// from cordova-plugin-device (window.device) and @capacitor/device
// (window.Capacitor.Plugins.Device).

const defaultPolicyStore = { validator_privacy_policy: undefined }; // analytics, support, fraud
const trackingStore = { validator_privacy_policy: ['analytics', 'support', 'fraud', 'tracking'] as CdvPurchase.PrivacyPolicyItem[] };

function setCordovaDevice(device: any) {
    (window as any).device = device;
}

function setCapacitorDevice(plugin: { getInfo?: () => Promise<any>, getId?: () => Promise<any> }) {
    (window as any).Capacitor = { Plugins: { Device: plugin } };
}

async function getDeviceInfo(store: any): Promise<CdvPurchase.Validator.DeviceInfo> {
    return await (CdvPurchase.Validator.Internal.getDeviceInfo(store) as any);
}

describe('Validator.Internal.getDeviceInfo', () => {

    afterEach(() => {
        delete (window as any).device;
        delete (window as any).Capacitor;
    });

    test('reports only the plugin version when no device plugin is installed', async () => {
        const info = await getDeviceInfo(defaultPolicyStore);
        expect(info.plugin).toBe('cordova-plugin-purchase/' + CdvPurchase.PLUGIN_VERSION);
        expect(info.model).toBeUndefined();
        expect(info.platform).toBeUndefined();
    });

    test('uses cordova-plugin-device data when window.device is present', async () => {
        setCordovaDevice({
            cordova: '12.0.0',
            model: 'Pixel 7',
            platform: 'Android',
            version: '14',
            manufacturer: 'Google',
            isVirtual: true,
        });
        const info = await getDeviceInfo(defaultPolicyStore);
        expect(info.cordova).toBe('12.0.0');
        expect(info.model).toBe('Pixel 7');
        expect(info.platform).toBe('Android');
        expect(info.version).toBe('14');
        expect(info.manufacturer).toBe('Google');
        expect(info.isVirtual).toBe(true);
    });

    test('falls back to @capacitor/device when window.device is absent', async () => {
        setCapacitorDevice({
            getInfo: async () => ({
                model: 'SM-A536B',
                operatingSystem: 'android',
                osVersion: '14',
                manufacturer: 'samsung',
                isVirtual: true,
                platform: 'android',
                webViewVersion: '124.0',
            }),
            getId: async () => ({ identifier: 'cap-device-id' }),
        });
        const info = await getDeviceInfo(defaultPolicyStore);
        expect(info.model).toBe('SM-A536B');
        expect(info.platform).toBe('Android'); // normalized to cordova-plugin-device casing
        expect(info.version).toBe('14');
        expect(info.manufacturer).toBe('samsung');
        expect(info.isVirtual).toBe(true);
        expect(info.cordova).toBeUndefined();
    });

    test('normalizes capacitor operatingSystem "ios" to "iOS"', async () => {
        setCapacitorDevice({
            getInfo: async () => ({ model: 'iPhone15,2', operatingSystem: 'ios', osVersion: '17.4' }),
        });
        const info = await getDeviceInfo(defaultPolicyStore);
        expect(info.platform).toBe('iOS');
        expect(info.model).toBe('iPhone15,2');
        expect(info.version).toBe('17.4');
    });

    test('capacitor device id is used as uuid only with the tracking policy', async () => {
        setCapacitorDevice({
            getInfo: async () => ({ model: 'Pixel 7', operatingSystem: 'android' }),
            getId: async () => ({ identifier: 'cap-device-id' }),
        });
        const noTracking = await getDeviceInfo(defaultPolicyStore);
        expect(noTracking.uuid).toBeUndefined();
        const withTracking = await getDeviceInfo(trackingStore);
        expect(withTracking.uuid).toBe('cap-device-id');
    });

    test('fraud fingerprint is computed from the capacitor device id without tracking policy', async () => {
        setCapacitorDevice({
            getInfo: async () => ({ model: 'Pixel 7', operatingSystem: 'android' }),
            getId: async () => ({ identifier: 'cap-device-id' }),
        });
        const info = await getDeviceInfo(defaultPolicyStore);
        expect(info.uuid).toBeUndefined();
        expect(info.fingerprint).toBe(CdvPurchase.Utils.md5('uuid:cap-device-id'));
    });

    test('window.device takes precedence over @capacitor/device', async () => {
        setCordovaDevice({ model: 'CordovaModel', platform: 'Android' });
        setCapacitorDevice({
            getInfo: async () => ({ model: 'CapacitorModel', operatingSystem: 'android' }),
        });
        const info = await getDeviceInfo(defaultPolicyStore);
        expect(info.model).toBe('CordovaModel');
    });

    test('survives a failing @capacitor/device plugin', async () => {
        setCapacitorDevice({
            getInfo: async () => { throw new Error('boom'); },
            getId: async () => { throw new Error('boom'); },
        });
        const info = await getDeviceInfo(trackingStore);
        expect(info.plugin).toBe('cordova-plugin-purchase/' + CdvPurchase.PLUGIN_VERSION);
        expect(info.model).toBeUndefined();
        expect(info.uuid).toBeUndefined();
    });

    test('fallback fingerprint combines model and manufacturer', async () => {
        setCordovaDevice({ model: 'Pixel 7', manufacturer: 'Google' });
        const info = await getDeviceInfo(defaultPolicyStore);
        expect(info.fingerprint).toBe(CdvPurchase.Utils.md5('/Pixel 7/Google'));
    });
});
