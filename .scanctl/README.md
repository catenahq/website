# scanctl baseline

`baseline.sarif` is a committed set of security findings for THIS repo that
are reviewed and accepted as benign. For how the mechanism works generally
(what `baseline:`/`--dismiss-baseline` do, how to seed or regenerate a
baseline) see
[catenahq/scanctl's README](https://github.com/catenahq/scanctl#committed-baseline-optional) --
this file only records what's baselined here and why.

## What is currently baselined

- **14 x trivy-license (LGPL-3.0-or-later)** on `@img/sharp-libvips-*` /
  `@img/sharp-*`. `sharp` is Astro's build-time image optimizer; it bundles
  libvips (LGPL). It runs only at build time and is not shipped in the deployed
  static site, so the copyleft obligation does not attach. Benign.

## Stale entries

scanctl fails `security.yml` when an entry here matches nothing the scan still
produces, and lists it under "Stale baseline entries". Delete the entry, then
review the diff: every entry must be a finding a human has confirmed is benign
here.
