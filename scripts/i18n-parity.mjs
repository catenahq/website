#!/usr/bin/env node
/* scripts/i18n-parity.mjs
 *
 * Walk src/i18n/{en,fr}/*.json and assert that every locale has the
 * exact same key set, recursively. Exits 0 on parity, 1 on any
 * drift; the failure prints every locale, namespace, and missing /
 * extra key so a translator can fix all of it in one pass.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const I18N_ROOT = join(HERE, "..", "src", "i18n");
const SOURCE = "en";
const LOCALES = ["en", "fr"];

function readBundle(locale) {
  const dir = join(I18N_ROOT, locale);
  const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  const out = {};
  for (const f of files) {
    const ns = f.replace(/\.json$/, "");
    out[ns] = JSON.parse(readFileSync(join(dir, f), "utf8"));
  }
  return out;
}

function flatten(obj, prefix = "", out = []) {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    out.push(prefix);
    return out;
  }
  const keys = Object.keys(obj).sort();
  for (const k of keys) {
    flatten(obj[k], prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

const bundles = Object.fromEntries(LOCALES.map((l) => [l, readBundle(l)]));

const sourceNamespaces = Object.keys(bundles[SOURCE]).sort();
const failures = [];

for (const locale of LOCALES) {
  if (locale === SOURCE) continue;
  const localeNamespaces = Object.keys(bundles[locale]).sort();

  // Namespace-level drift (a whole file missing or extra).
  const missingNs = sourceNamespaces.filter((n) => !localeNamespaces.includes(n));
  const extraNs = localeNamespaces.filter((n) => !sourceNamespaces.includes(n));
  for (const n of missingNs) failures.push(`[${locale}] missing namespace: ${n}`);
  for (const n of extraNs) failures.push(`[${locale}] extra namespace (not in ${SOURCE}): ${n}`);

  // Key-level drift within each shared namespace.
  for (const ns of sourceNamespaces) {
    if (!localeNamespaces.includes(ns)) continue;
    const sourceKeys = new Set(flatten(bundles[SOURCE][ns]));
    const localeKeys = new Set(flatten(bundles[locale][ns]));

    for (const k of [...sourceKeys].sort()) {
      if (!localeKeys.has(k)) failures.push(`[${locale}] missing key: ${ns}.${k}`);
    }
    for (const k of [...localeKeys].sort()) {
      if (!sourceKeys.has(k)) failures.push(`[${locale}] extra key (not in ${SOURCE}): ${ns}.${k}`);
    }
  }
}

if (failures.length) {
  console.error(`i18n: parity FAILED (${failures.length} issue(s))`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

const stats = LOCALES.map((l) => {
  const total = Object.values(bundles[l]).reduce(
    (acc, ns) => acc + flatten(ns).length,
    0,
  );
  return `${l}=${total}`;
}).join(", ");
console.log(`i18n: parity ok (${stats})`);
