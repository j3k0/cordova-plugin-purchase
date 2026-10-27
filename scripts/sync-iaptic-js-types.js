#!/usr/bin/env node
// Regenerates src/ts/platforms/iaptic-js/iaptic-js-types.d.ts from the
// iaptic-js package resolved by the lockfile (normally: node_modules).
// The output is committed; CI fails when this file and the committed
// copy disagree (workflow: Unit Tests & Type Check).
//
// Deltas, applied on top of upstream (FOV-2225a, review FOV-2228 option (a)):
//   Keep the plugin's historical contract: the surface of the vendored copy must
//   stay byte-for-byte the same *types* as the hand-written copy (additions only).
//   1. Config.stripePublicKey: string — added back (upstream 2.x dropped it).
//   2. PlanChange.purchaseId: string  — kept required (upstream made it optional).
//   3. Fields the server can omit stay required (upstream made them optional;
//      the hand-written copy declares them required — no widening in a minor).
//      The runtime gap is handled by PR #1741's adapter guards; renegotiate at 14.x:
//      PricingPhase.currency/billingPeriod/recurrenceMode,
//      Purchase.purchaseDate/lastRenewalDate/expirationDate/renewalIntent/
//      isTrialPeriod/amountMicros/currency.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PKG = path.join(ROOT, 'node_modules', 'iaptic-js', 'dist', 'types');
const OUT = path.join(ROOT, 'src', 'ts', 'platforms', 'iaptic-js', 'iaptic-js-types.d.ts');

// Ordered: types.d.ts, iaptic-stripe.d.ts, refresh-scheduler.d.ts,
// utils.d.ts, index.d.ts (createAdapter only).
const FILES = ['types.d.ts', 'iaptic-stripe.d.ts', 'refresh-scheduler.d.ts', 'utils.d.ts', 'index.d.ts'];

function replaceOnce(body, from, to) {
    if (!body.includes(from)) throw new Error(`anchor not found:\n${from}`);
    if (body.split(from).length !== 2) throw new Error(`anchor not unique:\n${from}`);
    return body.replace(from, to);
}

let body = '';
for (const file of FILES) {
    let text = fs.readFileSync(path.join(PKG, file), 'utf8');
    // No imports, no star re-exports, no sourcemap comments.
    text = text.replace(/^import .*$/gm, '').replace(/^export \* from .*$/gm, '');
    text = text.replace(/^\/\/# sourceMappingURL=.*$/gm, '');
    // Ambient namespace members are not module exports.
    text = text.replace(/^export declare /gm, 'export ');
    // Private members would make the classes nominal for consumers.
    text = text.replace(/^\s*private\s.*;\n/gm, '');
    if (file === 'utils.d.ts') {
        // Utils is not @internal in the plugin: the copy exposes createAdapter()
        // config helpers (e.g. Utils.buildUrl) to app developers.
        text = text.replace('* Utility functions for the Iaptic library\n * @internal\n', '* Utility functions for the Iaptic library\n');
    }
    if (file === 'types.d.ts') {
        // Upstream augments Window with import('...') types: not expressible
        // inside an ambient namespace; the window block below replaces it.
        text = text.replace(/^declare global \{[\s\S]*^\}\n/m, '');
        text = text.trimEnd();
    }
    if (file === 'index.d.ts') {
        // Only keep createAdapter; the IapticJS const is replaced by the
        // window block below.
        const createAdapter = text.match(/\/\*\*[\s\S]*?\*\/\nexport function createAdapter\(config: Config\): IapticStripe;/);
        if (!createAdapter) throw new Error('createAdapter declaration not found in index.d.ts');
        text = createAdapter[0] + '\n';
    }
    body += body.endsWith('\n') || body === '' ? text.trimEnd() + '\n\n' : text.trimEnd() + '\n\n';
    if (file === 'index.d.ts') body = body.trimEnd() + '\n';
}

// Deltas — each anchor must match exactly once.
body = replaceOnce(
    body,
    '/**\n     * Optional custom Iaptic URL for private deployments',
    '/**\n     * Stripe publishable key\n     */\n    stripePublicKey: string;\n    /**\n     * Optional custom Iaptic URL for private deployments',
);
body = replaceOnce(
    body,
    'export interface PlanChange {\n    /** Unique identifier for the purchase to replace. If not provided, the best suited subscription will be used */\n    purchaseId?: string;',
    'export interface PlanChange {\n    /** Unique identifier for the purchase to replace */\n    purchaseId: string;',
);
// 3. Keep the server-omittable fields required — the copy must not widen
//    existing types (FOV-2228 review, option (a)). Each anchor carries the
//    field's unique JSDoc line, so the two `currency?` disambiguate.
const REQUIRED = [
    ["/** ISO 4217 currency code (e.g., 'USD', 'EUR', 'JPY') */\n    currency?: string;", 'currency'],
    ["     * Absent for one-time purchases.\n     */\n    billingPeriod?: string;", 'billingPeriod'],
    ["    recurrenceMode?: 'INFINITE_RECURRING' | 'NON_RECURRING' | 'FINITE_RECURRING';", 'recurrenceMode'],
    ["/** Date of the purchase (ISO 8601). Can be absent, check before use. */\n    purchaseDate?: string;", 'purchaseDate'],
    ["/** Date of the last renewal (ISO 8601). Can be absent, check before use. */\n    lastRenewalDate?: string;", 'lastRenewalDate'],
    ["/** Date of the expiration (ISO 8601). Absent for one-time purchases. */\n    expirationDate?: string;", 'expirationDate'],
    ["    renewalIntent?: 'Lapse' | 'Renew' | 'Cancel';", 'renewalIntent'],
    ["/** Whether the purchase is a trial period */\n    isTrialPeriod?: boolean;", 'isTrialPeriod'],
    ["/** Price in micros (1/1,000,000 of the currency unit) */\n    amountMicros?: number;", 'amountMicros'],
    ["/** Currency code (e.g., 'USD', 'EUR') */\n    currency?: string;", 'Purchase.currency'],
];
for (const [anchor, name] of REQUIRED) {
    if (!anchor.includes('?:')) throw new Error(`delta anchor ${name} has no optional marker`);
    body = replaceOnce(body, anchor, anchor.replace('?:', ':'));
}

// Wrap in the ambient namespace.
body = body.replace(/^/gm, '    ').trimEnd();
body = `declare namespace ModuleIapticJS {\n${body}\n}\n\n/**\n * Global IapticJS object available in browser environments\n */\ninterface Window {\n    IapticJS: {\n        /** Current version of the IapticJS library */\n        version: string;\n        /** Function to create a new Iaptic adapter */\n        createAdapter: typeof ModuleIapticJS.createAdapter;\n        /** Stripe adapter class */\n        IapticStripe: typeof ModuleIapticJS.IapticStripe;\n        /** Utility functions */\n        Utils: typeof ModuleIapticJS.Utils;\n    };\n}\n`;

fs.writeFileSync(OUT, body);
console.log(`wrote ${path.relative(path.join(ROOT, '..'), OUT)} from iaptic-js@${require(path.join(ROOT, 'node_modules', 'iaptic-js', 'package.json')).version}`);