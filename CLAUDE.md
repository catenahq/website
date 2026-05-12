# catenahq/website -- catena marketing site

Astro 6 marketing site. Builds standalone (`npm run build` ->
`astro build` -> `dist/`). The docs site lives in its own repo at
github.com/catenahq/docs and ships as its own deployment.

## Build flow

- `npm run dev` -- Astro dev server.
- `npm run build` -- marketing-only Astro build into `dist/`.
- `npm run check` -- typecheck (Astro check).
- `npm run test:i18n` -- bilingual parity gate (EN + FR key parity).
- `prebuild` runs `./tools/sync-brand.mjs` to seed `src/styles/brand/`
  from the vendored brand source under `tools/brand/`.

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
- Never mention the operator infrastructure, automation, or any
  filesystem path that lives outside this repo.

## Working on Astro

Use the Astro MCP (`mcp__Astro_docs__search_astro_docs`) for any
Astro / Starlight feature question rather than guessing from memory.

## Brand assets

Brand tokens + source live under `tools/brand/`. `tools/sync-brand.mjs`
copies them into `src/styles/brand/` on `predev` and `prebuild`. The
synced output is gitignored. Update tokens in `tools/brand/` and the
sync picks them up on the next build.

The same brand assets exist in `catenahq/docs` and `catenahq/portal`
under their respective `tools/brand/`. Brand changes are coordinated
manually across the three repos until the operator wires a shared
distribution mechanism.
