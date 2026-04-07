import resolve from '@rollup/plugin-node-resolve';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Rollup plugin that serves www/store.js as a virtual ES module.
 * Appends `export { CdvPurchase }` so the IIFE-defined variable
 * can be imported by the entry file.
 */
function storeJsPlugin() {
  const VIRTUAL_ID = 'virtual:store-js';
  const RESOLVED_ID = '\0' + VIRTUAL_ID;

  return {
    name: 'store-js',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id === RESOLVED_ID) {
        let storeJs = readFileSync(join(__dirname, 'www', 'store.js'), 'utf-8');
        // In Capacitor, window.cordova exists (Cordova shim) which causes
        // initCDVPurchase to be called via setTimeout — too late for ES module
        // exports. Force synchronous initialization.
        storeJs = storeJs.replace(
          /if \(window\.cordova\) \{[\s\S]*?setTimeout\(initCDVPurchase.*?\)[\s\S]*?\}\s*else \{\s*initCDVPurchase\(\);\s*\}/,
          'initCDVPurchase();'
        );
        return storeJs + '\nexport { CdvPurchase };\n';
      }
    }
  };
}

export default {
  input: 'build/entry.mjs',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [storeJsPlugin(), resolve()],
  external: ['@capacitor/core']
};
