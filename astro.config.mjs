import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// catena.run -- public marketing site.
//
// i18n: FR is the default and serves at /; EN serves at /en/. Astro's
// i18n routing keeps non-default locale-folders prefixed. Quebec-based
// operator + bilingual delivery -> French is the primary surface.
//
// Output: static. The Dockerfile multi-stages the build then nginx
// serves dist/. No runtime JS framework -- the scroll-vignettes
// hero is GSAP/Lenis-driven from islands when we add them.
//
// SEO: see apps/ASTRO_INSTRUCTIONS.md. Sitemap emits hreflang
// alternates per locale and is referenced from public/robots.txt.
export default defineConfig({
  site: "https://catena.run",
  trailingSlash: "ignore",
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "fr",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    icon(),
    sitemap({
      i18n: {
        defaultLocale: "fr",
        locales: {
          en: "en-CA",
          fr: "fr-CA",
        },
      },
    }),
  ],
});
