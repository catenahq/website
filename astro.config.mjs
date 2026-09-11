import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";

// catena.run -- public marketing site.
//
// i18n: every locale is prefixed. EN serves at /en/, FR at /fr/. A bare
// / request is language-detected and redirected by nginx (Accept-Language
// + lang cookie); src/pages/index.astro is the dev/preview fallback.
// Bilingual delivery -> EN and FR are peers, neither at the bare root.
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
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
      // Keep our own src/pages/index.astro at / (the language-detecting
      // fallback). redirectToDefaultLocale:true would replace it with a
      // plain / -> /en/ redirect, dropping cookie/browser detection.
      redirectToDefaultLocale: false,
    },
  },
  // The guides live at docs.catena.run. External links and search
  // results still point at the paths on the left, so each one is emitted
  // at build time as an HTML stub carrying <meta http-equiv="refresh">,
  // which keeps them resolving and preserves their SEO weight. A meta
  // refresh handles the cross-origin target that a server redirect on a
  // static host cannot.
  redirects: {
    "/guides":                            "https://docs.catena.run/guides/email-providers/",
    "/guides/email-providers":            "https://docs.catena.run/guides/email-providers/",
    "/guides/provider-accounts":          "https://docs.catena.run/guides/provider-accounts/",
    "/guides/dns-hardening":              "https://docs.catena.run/guides/dns-hardening/",
    "/fr/guides":                         "https://docs.catena.run/fr/guides/email-providers/",
    "/fr/guides/fournisseurs-courriel":   "https://docs.catena.run/fr/guides/email-providers/",
    "/fr/guides/comptes-fournisseurs":    "https://docs.catena.run/fr/guides/provider-accounts/",
    "/fr/guides/dns-durci":               "https://docs.catena.run/fr/guides/dns-hardening/",
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
