namespace CdvPurchase {
    export namespace Utils {

        type ShiftFunction = (r: number, n: number) => number;

        const HEX2STR = "0123456789abcdef".split("");
        function toHexString(r: number): string {
            for (var n = "", e = 0; e < 4; e++)
                n += HEX2STR[r >> 8 * e + 4 & 15] + HEX2STR[r >> 8 * e & 15];
            return n;
        }

        function hexStringFromArray(array: number[]): string {
            const out: string[] = [];
            for (var arrayLength = array.length, i = 0; i < arrayLength; i++)
                out.push(toHexString(array[i]));
            return out.join("");
        }

        function add32(r: number, n: number) {
            return r + n & 4294967295;
        }

        function complexShift(r: number, n: number, e: number, t: number, o: number, u: number, shiftFunction: ShiftFunction): number {
            function shiftAdd32(op0: number, op1: number, v1: number): number {
                return add32(op0 << op1 | op0 >>> 32 - op1, v1);
            }
            function add32x4(i0: number, i1: number, j0: number, j1: number): number {
                return add32(add32(i1, i0), add32(j0, j1));
            }
            return shiftAdd32(add32x4(r, n, t, u), o, e)
        }

        var step1Function = function (shiftFunction: ShiftFunction, n: number, e: number, t: number, o: number, u: number, f: number, a: number): number { return complexShift(e & t | ~e & o, n, e, u, f, a, shiftFunction) };
        var step2Function = function (shiftFunction: ShiftFunction, n: number, e: number, t: number, o: number, u: number, f: number, a: number): number { return complexShift(e & o | t & ~o, n, e, u, f, a, shiftFunction) };
        var step3Function = function (shiftFunction: ShiftFunction, n: number, e: number, t: number, o: number, u: number, f: number, a: number): number { return complexShift(e ^ t ^ o, n, e, u, f, a, shiftFunction) };
        var step4Function = function (shiftFunction: ShiftFunction, n: number, e: number, t: number, o: number, u: number, f: number, a: number): number { return complexShift(t ^ (e | ~o), n, e, u, f, a, shiftFunction) };

        function hashStep(inOutVec4: [number, number, number, number], strAsInts: number[], shiftFunction?: ShiftFunction | undefined) {
            if (!shiftFunction)
                shiftFunction = add32;
            let v0 = inOutVec4[0];
            let v1 = inOutVec4[1];
            let v2 = inOutVec4[2];
            let v3 = inOutVec4[3];

            var step1 = step1Function.bind(null, shiftFunction);
            v0 = step1(v0, v1, v2, v3, strAsInts[0], 7, -680876936);
            v3 = step1(v3, v0, v1, v2, strAsInts[1], 12, -389564586);
            v2 = step1(v2, v3, v0, v1, strAsInts[2], 17, 606105819);
            v1 = step1(v1, v2, v3, v0, strAsInts[3], 22, -1044525330);
            v0 = step1(v0, v1, v2, v3, strAsInts[4], 7, -176418897);
            v3 = step1(v3, v0, v1, v2, strAsInts[5], 12, 1200080426);
            v2 = step1(v2, v3, v0, v1, strAsInts[6], 17, -1473231341);
            v1 = step1(v1, v2, v3, v0, strAsInts[7], 22, -45705983);
            v0 = step1(v0, v1, v2, v3, strAsInts[8], 7, 1770035416);
            v3 = step1(v3, v0, v1, v2, strAsInts[9], 12, -1958414417);
            v2 = step1(v2, v3, v0, v1, strAsInts[10], 17, -42063);
            v1 = step1(v1, v2, v3, v0, strAsInts[11], 22, -1990404162);
            v0 = step1(v0, v1, v2, v3, strAsInts[12], 7, 1804603682);
            v3 = step1(v3, v0, v1, v2, strAsInts[13], 12, -40341101);
            v2 = step1(v2, v3, v0, v1, strAsInts[14], 17, -1502002290);
            v1 = step1(v1, v2, v3, v0, strAsInts[15], 22, 1236535329);

            var step2 = step2Function.bind(null, shiftFunction);
            v0 = step2(v0, v1, v2, v3, strAsInts[1], 5, -165796510);
            v3 = step2(v3, v0, v1, v2, strAsInts[6], 9, -1069501632);
            v2 = step2(v2, v3, v0, v1, strAsInts[11], 14, 643717713);
            v1 = step2(v1, v2, v3, v0, strAsInts[0], 20, -373897302);
            v0 = step2(v0, v1, v2, v3, strAsInts[5], 5, -701558691);
            v3 = step2(v3, v0, v1, v2, strAsInts[10], 9, 38016083);
            v2 = step2(v2, v3, v0, v1, strAsInts[15], 14, -660478335);
            v1 = step2(v1, v2, v3, v0, strAsInts[4], 20, -405537848);
            v0 = step2(v0, v1, v2, v3, strAsInts[9], 5, 568446438);
            v3 = step2(v3, v0, v1, v2, strAsInts[14], 9, -1019803690);
            v2 = step2(v2, v3, v0, v1, strAsInts[3], 14, -187363961);
            v1 = step2(v1, v2, v3, v0, strAsInts[8], 20, 1163531501);
            v0 = step2(v0, v1, v2, v3, strAsInts[13], 5, -1444681467);
            v3 = step2(v3, v0, v1, v2, strAsInts[2], 9, -51403784);
            v2 = step2(v2, v3, v0, v1, strAsInts[7], 14, 1735328473);
            v1 = step2(v1, v2, v3, v0, strAsInts[12], 20, -1926607734);

            var step3 = step3Function.bind(null, shiftFunction);
            v0 = step3(v0, v1, v2, v3, strAsInts[5], 4, -378558);
            v3 = step3(v3, v0, v1, v2, strAsInts[8], 11, -2022574463);
            v2 = step3(v2, v3, v0, v1, strAsInts[11], 16, 1839030562);
            v1 = step3(v1, v2, v3, v0, strAsInts[14], 23, -35309556);
            v0 = step3(v0, v1, v2, v3, strAsInts[1], 4, -1530992060);
            v3 = step3(v3, v0, v1, v2, strAsInts[4], 11, 1272893353);
            v2 = step3(v2, v3, v0, v1, strAsInts[7], 16, -155497632);
            v1 = step3(v1, v2, v3, v0, strAsInts[10], 23, -1094730640);
            v0 = step3(v0, v1, v2, v3, strAsInts[13], 4, 681279174);
            v3 = step3(v3, v0, v1, v2, strAsInts[0], 11, -358537222);
            v2 = step3(v2, v3, v0, v1, strAsInts[3], 16, -722521979);
            v1 = step3(v1, v2, v3, v0, strAsInts[6], 23, 76029189);
            v0 = step3(v0, v1, v2, v3, strAsInts[9], 4, -640364487);
            v3 = step3(v3, v0, v1, v2, strAsInts[12], 11, -421815835);
            v2 = step3(v2, v3, v0, v1, strAsInts[15], 16, 530742520);
            v1 = step3(v1, v2, v3, v0, strAsInts[2], 23, -995338651);

            var step4 = step4Function.bind(null, shiftFunction);
            v0 = step4(v0, v1, v2, v3, strAsInts[0], 6, -198630844);
            v3 = step4(v3, v0, v1, v2, strAsInts[7], 10, 1126891415);
            v2 = step4(v2, v3, v0, v1, strAsInts[14], 15, -1416354905);
            v1 = step4(v1, v2, v3, v0, strAsInts[5], 21, -57434055);
            v0 = step4(v0, v1, v2, v3, strAsInts[12], 6, 1700485571);
            v3 = step4(v3, v0, v1, v2, strAsInts[3], 10, -1894986606);
            v2 = step4(v2, v3, v0, v1, strAsInts[10], 15, -1051523);
            v1 = step4(v1, v2, v3, v0, strAsInts[1], 21, -2054922799);
            v0 = step4(v0, v1, v2, v3, strAsInts[8], 6, 1873313359);
            v3 = step4(v3, v0, v1, v2, strAsInts[15], 10, -30611744);
            v2 = step4(v2, v3, v0, v1, strAsInts[6], 15, -1560198380);
            v1 = step4(v1, v2, v3, v0, strAsInts[13], 21, 1309151649);
            v0 = step4(v0, v1, v2, v3, strAsInts[4], 6, -145523070);
            v3 = step4(v3, v0, v1, v2, strAsInts[11], 10, -1120210379);
            v2 = step4(v2, v3, v0, v1, strAsInts[2], 15, 718787259);
            v1 = step4(v1, v2, v3, v0, strAsInts[9], 21, -343485551);

            inOutVec4[0] = shiftFunction(v0, inOutVec4[0]);
            inOutVec4[1] = shiftFunction(v1, inOutVec4[1]);
            inOutVec4[2] = shiftFunction(v2, inOutVec4[2]);
            inOutVec4[3] = shiftFunction(v3, inOutVec4[3]);
        };

        function stringToIntArray(r: string): number[] {
            for (var ret = [], e = 0; e < 64; e += 4)
                ret[e >> 2] = r.charCodeAt(e) + (r.charCodeAt(e + 1) << 8) + (r.charCodeAt(e + 2) << 16) + (r.charCodeAt(e + 3) << 24);
            return ret;
        }

        function computeMD5(str: string, shiftFunction?: ShiftFunction): [number, number, number, number] {

            let lastCharIndex: number;
            const strLength = str.length;
            const vec4: [number, number, number, number] = [1732584193, -271733879, -1732584194, 271733878];

            for (lastCharIndex = 64; lastCharIndex <= strLength; lastCharIndex += 64)
                hashStep(vec4, stringToIntArray(str.substring(lastCharIndex - 64, lastCharIndex)), shiftFunction);

            const vec16 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            const reminderLength = (str = str.substring(lastCharIndex - 64)).length;

            // process by batch of 64
            let vec16Index: number;
            for (vec16Index = 0; vec16Index < reminderLength; vec16Index++)
                vec16[vec16Index >> 2] |= str.charCodeAt(vec16Index) << (vec16Index % 4 << 3);
            vec16[vec16Index >> 2] |= 128 << (vec16Index % 4 << 3);

            if (vec16Index > 55) {
                hashStep(vec4, vec16, shiftFunction);
                for (vec16Index = 16; vec16Index--;)
                    vec16[vec16Index] = 0;
            }
            vec16[14] = 8 * strLength;
            hashStep(vec4, vec16, shiftFunction);
            return vec4;
        };

        /**
         * Returns the MD5 hash-value of the passed string.
         *
         * Based on the work of Jeff Mott, who did a pure JS implementation of the MD5 algorithm that was published by Ronald L. Rivest in 1991.
         * Code was imported from https://github.com/pvorb/node-md5
         *
         * I cleaned up the all-including minified version of it.
         */
        export function md5(str: string): string {
            if (!str) return '';
            let shiftFunction: ShiftFunction | undefined;
            if ("5d41402abc4b2a76b9719d911017c592" !== hexStringFromArray(computeMD5("hello")))
                shiftFunction = function (r: number, n: number) {
                    const e = (65535 & r) + (65535 & n);
                    return (r >> 16) + (n >> 16) + (e >> 16) << 16 | 65535 & e;
                };
            return hexStringFromArray(computeMD5(str, shiftFunction));
        }
    }
}
