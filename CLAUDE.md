# apps/website -- catena marketing site

Astro 6 marketing site. The full `npm run build` script chains a
Starlight docs build into `dist/docs/` (see
`scripts/build-with-docs.mjs`). Use `npm run build:marketing-only`
for marketing-only builds (and as the default `build` script in a
lifted standalone repo).

## Build flow

- `npm run dev` -- Astro dev server (`apps/website`).
- `npm run build` -- chained marketing + docs build into a single
  dist. Used by CI and by the production Dokploy deployment.
- `npm run build:marketing-only` -- marketing only; used post-split.
- `prebuild` runs `packages/tools/sync-brand.mjs` to seed
  `src/styles/brand/` from the monorepo's brand source. After split,
  the script is vendored into the lifted repo (see
  `internal_docs/operator/repo-split-runbook.md` in the canonical
  monorepo).

## Content rules

- Never write "playbook" in client-facing copy. Use "automation
  flow" or "managed operation" instead.
- Bilingual parity is enforced by `npm run test:i18n` (CI gate). Any
  new key lands in EN and FR in the same commit.
- Canadian English + Quebec French (not American English / France
  French).
- Cross-page references must be real hyperlinks; verify the target
  exists before linking. No naked prose pointers.
- No emojis or em-dashes in copy or code. Plain hyphens + straight
  quotes only.
- Never mention the operator documentation, automation/, internal_docs/,
  Ansible roles, or any filesystem path that lives outside this app.

## Working on Astro

Use the Astro MCP (`mcp__Astro_docs__search_astro_docs`) for any
Astro / Starlight feature question rather than guessing from memory.

## Repo split

This folder is structured to be lifted into its own repo via
`git subtree split --prefix=apps/website`. The split runbook is
`internal_docs/operator/repo-split-runbook.md` in the canonical
monorepo. Two couplings the runbook resolves:

- `predev` / `prebuild` reference `../../packages/tools/sync-brand.mjs`
  -- vendor `tools/` locally on split.
- `npm run build` chains a docs build from `apps/docs/` -- in the
  lifted repo, switch the `build` script to `astro build` (already
  present as `build:marketing-only`).
