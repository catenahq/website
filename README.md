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

## Styling

Tailwind CSS. `src/styles/global.css` loads the brand theme from
`@catenahq/contracts/brand/theme.css`: utilities such as `bg-page`,
`text-heading`, `text-muted`, `border-line`, `bg-primary`, and the
`btn-primary` / `btn-secondary` / `btn-tertiary` buttons the docs site
shares.
Sections are built from the widgets in `src/components/astrowind/`,
adapted from AstroWind (MIT, notice in that directory): `Hero`,
`Features2`, `Content`, `CallToAction`, inside `WidgetWrapper` with a
`Headline`. Header and footer content per locale comes from
`src/navigation.ts`. Icons are Tabler icons through astro-icon; a new
icon name is added to the `include` list in `astro.config.mjs`.

The theme toggle stores the visitor's choice and sets `dark` or `light`
on `<html>`; the brand tokens and Tailwind's `dark:` variant both read
it, and the OS preference applies when nothing is stored.

## Add a language

1. Add it to `astro.config.mjs::i18n.locales`.
2. Add it to `src/i18n/<lang>/` (one JSON file per namespace,
   mirroring the EN shape).
3. Add it to `LOCALES` in `scripts/i18n-parity.mjs`.
4. Add it to `locales` + the `bundles` map in `src/i18n/index.js`;
   every page under `src/pages/[locale]/` then renders it.
5. Run `npm run test:i18n` -- it will tell you which keys still need
   translation.
