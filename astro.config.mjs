import { defineConfig } from "astro/config";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// catena.run -- public marketing site.
//
// i18n: EN is the default and serves at /; FR serves at /fr/. Astro's
// i18n routing keeps non-English locale-folders prefixed.
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
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    icon(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-CA",
          fr: "fr-CA",
        },
      },
    }),
  ],
});
