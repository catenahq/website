# Checkpoint: ops issue 430

## Done

- Investigated the reconciler (catena-admin, catena-ce clones beside this one) and the feature grid (ops clone).
  Facts with file:line are in plan.md.
- CE/EE caveat in the issue: settled by the code and the grid, reconciler is CE. No owner decision needed.

## In flight

- Copy edits, steps 1-2 of plan.md.

## Next

- Gates (step 3), review, commit (step 4).

## Hypotheses

- "Reconciler only drift-corrects ports Ansible opened": ruled out. It is the single applier: it opens
  (ufw allow), restricts (ufw + DOCKER-USER DROP), and prunes from its own applied state
  (catena-admin `payload/lanes/catena-public-ports.py:424-468`).
- "Nothing opens that was not declared": partly ruled out. A port an app publishes without a `vps.expose.*`
  label is opened by Docker and only warned about (catena-admin `payload/engines/applint/catena.go:784-798`,
  K12 Warn). The copy claims only what the reconciler opens.

## Commands that work

- Gates (cwd /var/tmp/issues/430/website): `npm run test:i18n`, `node ../contracts/scripts/check-prose.mjs`,
  `node ../contracts/scripts/check-unicode.mjs`.
