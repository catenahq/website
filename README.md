# catenahq/website -- catena.run

Astro static marketing site. EN at `/en/`, FR at `/fr/`; `/` sends the
visitor to one of them by `lang` cookie, then browser language.
Self-contained. Brand tokens come from `@catenahq/contracts/brand`.

The docs site (docs.catena.run) lives in its own repo at
github.com/catenahq/docs.

## Develop

```bash
npm install
npm run dev
# -> http://localhost:4321
```

## Build

```bash
npm run build
# astro build -> dist/
```

## Test (i18n key parity)

```bash
npm run test:i18n
```

## Deploy

GitHub Pages via `.github/workflows/deploy-pages.yml`: every push to
`main` builds (`npm run build` -> `dist/`) and publishes. The custom
domain catena.run is set via `public/CNAME`. `dev` is the active-edit
branch and does not deploy.

## Add a page

Add one file, `src/pages/[locale]/<slug>.astro`. Its `getStaticPaths`
returns every entry of `locales` from `@catena/i18n`, so it renders at
`/en/<slug>` and `/fr/<slug>` (see `src/pages/[locale]/contact.astro`).
Use the `Base.astro` layout with the page's `locale`. Page strings live
in `src/i18n/<lang>/`, with the same keys in every locale.

## Add a language

1. Add it to `astro.config.mjs::i18n.locales`.
2. Add it to `src/i18n/<lang>/` (one JSON file per namespace,
   mirroring the EN shape).
3. Add it to `LOCALES` in `scripts/i18n-parity.mjs`.
4. Add it to `locales` + the `bundles` map in `src/i18n/index.js`;
   every page under `src/pages/[locale]/` then renders it.
5. Run `npm run test:i18n` -- it will tell you which keys still need
   translation.
