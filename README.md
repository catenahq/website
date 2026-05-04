# apps/website -- catena.run

Astro static site. Marketing landing pages + Starlight docs at
`/docs/*`. EN at `/`, FR at `/fr/`. Consumes `@catena/brand` (tokens)
and `@catena/i18n` (shared chrome strings). Page-level prose stays
in the components themselves until enough copy accumulates to
justify a content collection.

## Develop

```bash
# from repo root
npm install
npm run dev -w @catena/website
# -> http://localhost:4321
```

## Build

```bash
npm run build -w @catena/website
# emits apps/website/dist/
```

## Deploy

Dockerfile is multi-stage: Astro build inside `node:22-alpine`,
served from `nginx:alpine`. The build context must be the **repo
root** so workspace deps (`@catena/brand`, `@catena/i18n`) resolve.

In Dokploy:

1. Create new Application -> "From Dockerfile".
2. **Build context**: repo root (the catena clone).
3. **Dockerfile path**: `apps/website/Dockerfile`.
4. **Domain**: `catena.run`. Auto-generated cert via Cloudflare
   Tunnel (no Let's Encrypt -- TLS terminates at the edge).
5. **Cloudflare Tunnel route**: add `catena.run -> http://<service>:80`
   in the cloudflared config managed by `automation/ansible/roles/
   infrastructure/tasks/`.

## Add a page

Drop a file under `src/pages/<slug>.astro` for the EN version and
`src/pages/fr/<slug>.astro` for the FR mirror. Use the `Base.astro`
layout with the right `locale` prop. If a page needs shared strings
(nav, CTAs, errors), they're already in `@catena/i18n`. If it needs
section copy, write it inline in the component.

## Add a language

1. Add a new locale dir under `src/pages/<lang>/` mirroring the EN
   tree.
2. Add it to `astro.config.mjs::i18n.locales`.
3. Add it to `@catena/i18n` (see that package's README -- one
   command's worth of work plus the actual translations).
4. Run `node packages/i18n/scripts/i18n-parity.mjs` -- it will tell you which keys
   still need translation.
