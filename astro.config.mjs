import { defineConfig, fontProviders } from "astro/config";
import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import { inter } from "@catenahq/contracts/brand/fonts.mjs";

// catena.run -- public marketing site.
//
// i18n: every locale is prefixed. EN serves at /en/, FR at /fr/. A bare
// / request gets src/pages/index.astro, which redirects to the lang
// cookie's locale, else the browser language. EN and FR are peers,
// neither at the bare root.
//
// Output: static. GitHub Pages serves dist/
// (.github/workflows/deploy-pages.yml). No runtime JS framework.
//
// Styling: Tailwind CSS (src/styles/global.css) over the brand theme in
// @catenahq/contracts, with components adapted from AstroWind under
// src/components/astrowind/. Inter is self-hosted through the Fonts API,
// with the entry the docs site shares (contracts brand/fonts.mjs).
//
// SEO: the sitemap emits hreflang alternates per locale and is
// referenced from public/robots.txt.
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
      // Keep src/pages/index.astro at / (the language-detecting
      // redirect). redirectToDefaultLocale:true would replace it with a
      // plain / -> /en/ redirect, dropping cookie/browser detection.
      redirectToDefaultLocale: false,
    },
  },
  // The guides live at docs.catena.run. External links and search
  // results point at the paths on the left, so each one is emitted
  // at build time as an HTML stub carrying <meta http-equiv="refresh">,
  // which keeps them resolving and preserves their SEO weight. A meta
  // refresh handles the cross-origin target that a server redirect on a
  // static host cannot.
  redirects: {
    "/guides":                            "https://docs.catena.run/en/guides/provider-accounts/",
    "/guides/email-providers":            "https://docs.catena.run/en/guides/provider-accounts/",
    "/guides/provider-accounts":          "https://docs.catena.run/en/guides/provider-accounts/",
    "/guides/dns-hardening":              "https://docs.catena.run/en/",
    "/fr/guides":                         "https://docs.catena.run/fr/guides/provider-accounts/",
    "/fr/guides/fournisseurs-courriel":   "https://docs.catena.run/fr/guides/provider-accounts/",
    "/fr/guides/comptes-fournisseurs":    "https://docs.catena.run/fr/guides/provider-accounts/",
    "/fr/guides/dns-durci":               "https://docs.catena.run/fr/",
  },
  fonts: [inter(fontProviders)],
  integrations: [
    // Only the Tabler icons the pages name are bundled.
    icon({
      include: {
        tabler: [
          "moon", "sun", "check", "brand-github", "world", "apps",
          "shield-lock", "database-export", "key", "refresh", "layout-dashboard", "bell-ringing",
        ],
      },
    }),
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
    plugins: [tailwindcss()],
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
    // AGENTS.md "Brand + pricing + legal contracts (sibling read)".
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
