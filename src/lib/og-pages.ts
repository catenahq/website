// Per-page OG card registry. Each entry produces one PNG at
// /og/<locale>/<subpath>.png and is consumed both by the endpoint
// at src/pages/og/[...path].png.ts and by Base.astro to decide
// which og:image URL to emit. Skip entries here when the static
// locale default (og-default-{en,fr}.png) is good enough.
export interface OgPage {
  locale: "en" | "fr";
  subpath: string;
  title: string;
}

export const ogPages: OgPage[] = [
  // FR
  { locale: "fr", subpath: "features",            title: "Fonctionnalités" },
  { locale: "fr", subpath: "pricing",             title: "Tarifs" },
  { locale: "fr", subpath: "comparison",          title: "Comparaison" },
  { locale: "fr", subpath: "about",               title: "À propos" },
  { locale: "fr", subpath: "contact",             title: "Contact" },
  { locale: "fr", subpath: "site-web",            title: "Site web d'entreprise" },
  { locale: "fr", subpath: "scheduler",           title: "Trouvez votre planificateur" },
  { locale: "fr", subpath: "faq",                 title: "Foire aux questions" },
  { locale: "fr", subpath: "conformite",          title: "Conformité Loi 25" },
  { locale: "fr", subpath: "status",              title: "État des services" },
  { locale: "fr", subpath: "features/technical",  title: "Surface technique" },
  // EN
  { locale: "en", subpath: "features",            title: "Features" },
  { locale: "en", subpath: "pricing",             title: "Pricing" },
  { locale: "en", subpath: "comparison",          title: "Comparison" },
  { locale: "en", subpath: "about",               title: "About" },
  { locale: "en", subpath: "contact",             title: "Contact" },
  { locale: "en", subpath: "site-web",            title: "Marketing website" },
  { locale: "en", subpath: "scheduler",           title: "Find your scheduler" },
  { locale: "en", subpath: "faq",                 title: "Frequently asked questions" },
  { locale: "en", subpath: "conformite",          title: "Law 25 compliance" },
  { locale: "en", subpath: "status",              title: "Service status" },
  { locale: "en", subpath: "features/technical",  title: "Technical surface" },
];

export function ogImagePathFor(locale: "en" | "fr", subpath: string): string | null {
  const found = ogPages.find((p) => p.locale === locale && p.subpath === subpath);
  return found ? `/og/${locale}/${subpath}.png` : null;
}
