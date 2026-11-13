# Checkpoint: ops issue 430

## Done

- Investigated the reconciler (catena-admin, catena-ce clones beside this one) and the feature grid (ops clone).
  Facts with file:line are in plan.md.
- CE/EE caveat in the issue: settled by the code and the grid, reconciler is CE. No owner decision needed.

## In flight

- Nothing. Copy committed (12681a9); review by fleet:code-reviewer applied (dropped "only": an undeclared
  Docker publish is a K12 warning, not refused, catena-admin `payload/engines/apps/check.go:29`).

## Next

- Coordinator: apply the features.yml line from plan.md in its own ops commit; drop .agent/ before the merge.

## Hypotheses

- "Reconciler only drift-corrects ports Ansible opened": ruled out. It is the single applier: it opens
  (ufw allow), restricts (ufw + DOCKER-USER DROP), and prunes from its own applied state
  (catena-admin `payload/lanes/catena-public-ports.py:424-468`).
- "Nothing opens that was not declared": partly ruled out. A port an app publishes without a `vps.expose.*`
  label is opened by Docker and only warned about (catena-admin `payload/engines/applint/catena.go:784-798`,
  K12 Warn). The copy does not claim "only".

## Commands that work

- Gates (cwd /var/tmp/issues/430/website): `npm run test:i18n`, `node ../contracts/scripts/check-prose.mjs`,
  `node ../contracts/scripts/check-unicode.mjs`.
- Pricing generator check (ops clone, features.yml patched then restored):
  `CATENAHQ_WEBSITE_ROOT=/var/tmp/issues/430/website python3 -I automation/operator-tools/generate-pricing-matrix.py --check` rc 0.
- `npm ci`, `npm run check`, `npm run build` pass locally (no Polar token: no amounts).
- `check-repo-rules.mjs` fails only on the tracked .agent/ files, which the coordinator removes.
