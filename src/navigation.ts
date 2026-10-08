// Header and footer content per locale. Every label is an i18n key, so the
// parity gate (scripts/i18n-parity.mjs) covers the navigation too.
import { t } from "@catena/i18n";

type Locale = "en" | "fr";

export const docsHref = (locale: Locale) => `https://docs.catena.run/${locale}/`;

export function headerData(locale: Locale, pathname: string) {
  // EN and FR slugs are identical for every page, so the same page in each
  // language is the same path under the other prefix. Each option pairs a
  // language with the currency prices show in; FR pages show CAD only.
  const subpath = pathname.replace(/^\/(en|fr)(?=\/|$)/, "");
  return {
    homeHref: `/${locale}/`,
    brandName: t(locale, "common.brand.name"),
    links: [
      { text: t(locale, "common.nav.contact"), href: `/${locale}/contact` },
      { text: t(locale, "common.nav.docs"), href: docsHref(locale) },
    ],
    localeCurrency: {
      label: t(locale, "common.footer.language"),
      options: [
        { value: "fr-cad", text: t(locale, "common.locale_currency.fr_cad"), href: `/fr${subpath}` },
        { value: "en-cad", text: t(locale, "common.locale_currency.en_cad"), href: `/en${subpath}` },
        { value: "en-usd", text: t(locale, "common.locale_currency.en_usd"), href: `/en${subpath}` },
      ],
    },
    navLabel: t(locale, "common.nav.main_label"),
    menuLabel: t(locale, "common.nav.toggle_menu"),
    themeLabel: t(locale, "common.nav.toggle_theme"),
  };
}

export function footerData(locale: Locale) {
  const year = new Date().getFullYear();
  const brand = t(locale, "common.brand.name");
  return {
    homeHref: `/${locale}/`,
    brandName: brand,
    tagline: t(locale, "common.footer.made_in"),
    columns: [
      {
        title: t(locale, "common.footer.col_product"),
        links: [{ text: t(locale, "common.nav.docs"), href: docsHref(locale) }],
      },
      {
        title: t(locale, "common.footer.col_company"),
        links: [
          { text: t(locale, "common.nav.contact"), href: `/${locale}/contact` },
          { text: t(locale, "common.nav.status"), href: `/${locale}/status` },
          { text: t(locale, "common.footer.about"), href: "https://ma-lalonde.dev" },
        ],
      },
      {
        title: t(locale, "common.footer.col_legal"),
        links: [
          { text: t(locale, "common.privacy.title"), href: `/${locale}/privacy` },
          { text: t(locale, "common.terms.title"), href: `/${locale}/terms` },
        ],
      },
    ],
    socialLinks: [
      { text: "", ariaLabel: t(locale, "common.footer.github"), href: "https://github.com/catenahq", icon: "tabler:brand-github" },
    ],
    footNote: `&copy; ${year} ${brand}. ${t(locale, "common.footer.rights")}`,
    navLabel: t(locale, "common.footer.nav_label"),
  };
}
