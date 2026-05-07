/* @catena/i18n -- main entry.
 *
 * Loads both languages eagerly (the bundle is small -- ~2 KB per
 * language) and exposes a small lookup helper. Apps that need a
 * heavier i18n stack (ICU plurals, interpolation contexts) should
 * wire these JSON files into i18next or similar at the app level;
 * this module is intentionally tiny so it is the same shape across
 * Astro / Next / Starlight.
 */
import enCommon from "./en/common.json" with { type: "json" };
import enErrors from "./en/errors.json" with { type: "json" };
import frCommon from "./fr/common.json" with { type: "json" };
import frErrors from "./fr/errors.json" with { type: "json" };

/** Supported locales. Add new ones here AND ship matching JSON files. */
export const locales = /** @type {const} */ (["en", "fr"]);

/** Default locale when none is specified. */
export const defaultLocale = "fr";

const bundles = {
  en: { common: enCommon, errors: enErrors },
  fr: { common: frCommon, errors: frErrors },
};

/**
 * Get the full bundle for a locale. Falls back to defaultLocale on
 * unknown input rather than throwing -- safer for query-string-
 * driven locale switches.
 *
 * @param {string} locale
 * @returns {typeof bundles.en}
 */
export function bundle(locale) {
  return bundles[locale] ?? bundles[defaultLocale];
}

/**
 * Look up a single string by dotted path (`namespace.path.to.key`).
 * Returns the path itself on miss so a missing translation is loud
 * but doesn't crash a render.
 *
 * @param {string} locale
 * @param {string} key  e.g. "common.cta.primary" or "errors.form.required"
 * @returns {string}
 */
export function t(locale, key) {
  const b = bundle(locale);
  const [ns, ...rest] = key.split(".");
  let node = b[ns];
  for (const part of rest) {
    if (node == null || typeof node !== "object") return key;
    node = node[part];
  }
  return typeof node === "string" ? node : key;
}

/**
 * Look up an array of strings by dotted path. Returns an empty array
 * on miss; renderers that depend on a length-N list should treat
 * missing keys as a parity violation surfaced by the unit tests, not
 * handled at render time.
 *
 * @param {string} locale
 * @param {string} key
 * @returns {string[]}
 */
export function tArray(locale, key) {
  const b = bundle(locale);
  const [ns, ...rest] = key.split(".");
  let node = b[ns];
  for (const part of rest) {
    if (node == null || typeof node !== "object") return [];
    node = node[part];
  }
  return Array.isArray(node) ? node : [];
}
