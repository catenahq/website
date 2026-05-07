# apps/website -- catena.run

Astro static site. Marketing landing pages + Starlight docs at
`/docs/*`. EN at `/`, FR at `/fr/`. Self-contained: consumes shared
brand tokens (synced from `tools/brand/` at prebuild time into
`src/styles/brand/`) and ships its own translations under
`src/i18n/`. Page-level prose stays in the components themselves
until enough copy accumulates to justify a content collection.

## Develop

```bash
cd apps/website
npm install
npm run dev
# -> http://localhost:4321
```

## Build

```bash
cd apps/website
npm run build
# fires `prebuild` (brand sync) -> astro build -> chains apps/docs
# emits apps/website/dist/
```

## Test (i18n key parity)

```bash
cd apps/website
npm run test:i18n
```

## Deploy

Dockerfile is multi-stage: Astro build inside `node:22-alpine`,
served from `nginx:alpine`. The build context must be the **repo
root** so the prebuild script reaches `tools/brand/` via
`../../tools/sync-brand.mjs`.

In Dokploy: Create Compose -> GitHub source pointing at this repo,
`composePath: apps/website/dokploy.compose.yml`. See
`internal_docs/operator/deploy-webapp-from-github.md`.

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
