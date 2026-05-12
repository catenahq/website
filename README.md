# catenahq/website -- catena.run

Astro static marketing site. EN at `/`, FR at `/fr/`. Self-contained.
Brand tokens come from `@catenahq/contracts/brand`. Page-level prose
stays in the components themselves until enough copy accumulates to
justify a content collection.

The docs site (catena.run/docs) lives in its own repo at
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

Dockerfile is multi-stage: Astro build inside `node:22-alpine`,
served from `nginx:alpine`. Build context is this repo's root.

In Dokploy: Create Compose -> GitHub source pointing at this repo,
`composePath: dokploy.compose.yml`.

## Add a page

Drop a file under `src/pages/<slug>.astro` for the EN version and
`src/pages/fr/<slug>.astro` for the FR mirror. Use the `Base.astro`
layout with the right `locale` prop. Shared chrome strings (nav,
CTAs, errors) live in `src/i18n/`. Section copy goes inline in the
component.

## Add a language

1. Add a new locale dir under `src/pages/<lang>/` mirroring the EN
   tree.
2. Add it to `astro.config.mjs::i18n.locales`.
3. Add it to `src/i18n/<lang>/` (one JSON file per namespace,
   mirroring the EN shape).
4. Add it to `LOCALES` in `scripts/i18n-parity.mjs`.
5. Add it to `locales` + the `bundles` map in `src/i18n/index.js`.
6. Run `npm run test:i18n` -- it will tell you which keys still need
   translation.
