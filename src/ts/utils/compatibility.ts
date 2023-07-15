// Functions defined here so we can generate code compatible with old version of JS
namespace CdvPurchase {
    export namespace Utils {
        /** Object.values() for ES6 */
        export function objectValues<T>(obj: {[key: string]: T}): T[] {
            const ret: T[] = [];
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    ret.push(obj[key]);
                }
            }
            return ret;
        }
    }
}
