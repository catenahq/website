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
  { locale: "fr", subpath: "about",               title: "À propos" },
  { locale: "fr", subpath: "contact",             title: "Contact" },
  { locale: "fr", subpath: "faq",                 title: "Foire aux questions" },
  { locale: "fr", subpath: "status",              title: "État des services" },
  // EN
  { locale: "en", subpath: "about",               title: "About" },
  { locale: "en", subpath: "contact",             title: "Contact" },
  { locale: "en", subpath: "faq",                 title: "Frequently asked questions" },
  { locale: "en", subpath: "status",              title: "Service status" },
];

export function ogImagePathFor(locale: "en" | "fr", subpath: string): string | null {
  const found = ogPages.find((p) => p.locale === locale && p.subpath === subpath);
  return found ? `/og/${locale}/${subpath}.png` : null;
}
