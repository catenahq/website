# catenahq/website -- catena marketing site

Astro 6 marketing site. Builds standalone (`npm run build` ->
`astro build` -> `dist/`). The docs site lives in its own repo at
github.com/catenahq/docs and ships as its own deployment.

## Build flow

- `npm run dev` -- Astro dev server.
- `npm run build` -- marketing-only Astro build into `dist/`.
- `npm run check` -- typecheck (Astro check).
- `npm run test:i18n` -- bilingual parity gate (EN + FR key parity).

## Brand + pricing + legal contracts (sibling read)

`@catenahq/contracts` is consumed via sibling-directory read, NOT a
vendored tarball. `package.json` declares it as
`"@catenahq/contracts": "file:../contracts"`, so npm symlinks
`node_modules/@catenahq/contracts` to the sibling `catena/contracts/`
checkout. Edits in `contracts/` are visible immediately on the next
`npm run dev` / `npm run build`.

Local dev assumes the standard `catena/website/` + `catena/contracts/`
sibling layout (the workspace layout). CI mirrors this: the website
job checks out the website repo into `website/` and catenahq/contracts
into `contracts/` under `$GITHUB_WORKSPACE`, then runs npm install +
build with `working-directory: ./website`.

catenahq/contracts is public (2026-07-11): the sibling-checkout steps
need no token (the former CONTRACTS_READ_TOKEN secret is retired).

No version pinning, no freshness gate, no bump workflow. To roll out
a contracts change: edit `contracts/`, push contracts, push website
(or whichever consumer needs the new value). CI re-clones contracts
fresh on every run.

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

## Security invariants (machine-enforced -- do not weaken silently)

- Prices render from @catenahq/contracts pricing/tiers.json (single
  versioned source); never reintroduce hand-synced price strings.
- Legal pages render verbatim from the contracts package; msa.json
  pins the accepted revision -- never inline legal text here.
- No secrets in tree or history (gitleaks; history re-rooted clean at
  publication 2026-07-12 -- never push the backup-pre-reroot-* branches).
