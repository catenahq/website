import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
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
  // Opt-in prefetch. Links with data-astro-prefetch prefetch on hover.
  // We keep prefetchAll off so unmarked links pay zero JS cost.
  prefetch: {
    defaultStrategy: "hover",
  },
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "fr",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Guides moved from /guides/ (marketing) to the docs knowledge base
  // in May 2026, then to docs.catena.run when docs lifted to its own
  // subdomain. Preserve external links and SEO juice with static
  // redirects emitted at build time as <meta http-equiv="refresh">
  // HTML stubs. Cross-origin targets are supported by the meta refresh
  // mechanism.
  redirects: {
    "/guides":                            "https://docs.catena.run/guides/email-providers/",
    "/guides/fournisseurs-courriel":      "https://docs.catena.run/guides/email-providers/",
    "/guides/comptes-fournisseurs":       "https://docs.catena.run/guides/provider-accounts/",
    "/guides/dns-durci":                  "https://docs.catena.run/guides/dns-hardening/",
    "/en/guides":                         "https://docs.catena.run/en/guides/email-providers/",
    "/en/guides/email-providers":         "https://docs.catena.run/en/guides/email-providers/",
    "/en/guides/provider-accounts":       "https://docs.catena.run/en/guides/provider-accounts/",
    "/en/guides/dns-hardening":           "https://docs.catena.run/en/guides/dns-hardening/",
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
  vite: {
    resolve: {
      alias: {
        "@catena/i18n": fileURLToPath(new URL("./src/i18n/index.js", import.meta.url)),
      },
    },
    // The sibling `../contracts/` checkout holds brand assets (fonts,
    // logos) that `@catenahq/contracts` imports. npm symlinks it into
    // node_modules but Vite's dev fs-allow-list resolves through the
    // symlink to the REAL path and rejects it as outside the project
    // root, throwing "outside of Vite serving allow list" for each
    // .otf/.svg request. Allow the sibling explicitly. See
    // CLAUDE.md "Brand + pricing + legal contracts (sibling read)".
    server: {
      fs: {
        allow: [
          fileURLToPath(new URL(".", import.meta.url)),
          fileURLToPath(new URL("../contracts", import.meta.url)),
        ],
      },
    },
  },
});
