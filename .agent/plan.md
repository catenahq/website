# Plan: ops issue 430, name automatic firewall reconciliation on the website

## Facts the copy rests on

- Edition: CE. ops `internal_docs/generated/audit/feature-grid.md` row `networking` is CE, anchors
  `catena-admin/payload/lib/public_ports.py`, `catena-admin/payload/lanes/catena-public-ports.py`,
  `catena-ce/ansible/reconcile/roles/public_ports`. The timer runs on every host
  (`catena-admin/payload/lanes/systemd/catena-public-ports.timer` comment) and catena-ce
  `reconcile/roles/public_ports/tasks/main.yml` enables it with no licence condition.
- Opens only declared ports: the rule plan is built from the infra fragments plus `vps.expose.*` labels
  (`catena-public-ports.py:424-449`, `public_ports.py:516`); ufw default deny incoming
  (`catena-ce/ansible/bootstrap/roles/common/tasks/main.yml:409`).
- Closes a removed app's ports: stale rules pruned against the applied state (`catena-public-ports.py:439-446`);
  Docker closes a docker-bound public port when the container stops (`catena-public-ports.py:21-23`);
  a service remove event starts a pass (`catena-app-events.py:21-24`).
- Puts back missing rules: every pass re-adds each planned ufw rule and each DOCKER-USER guard missing from
  `iptables -C` (`catena-public-ports.py:280-294`, `347-378`).
- Cadence: every 5 minutes (`catena-public-ports.timer` `OnUnitActiveSec=5min`), on every docker start
  (catena-ce `public_ports` drop-in), on service create/update/remove (`catena-app-events.py`), end of a converge.
- Not claimed: removal of hand-added rules outside the registry (only rules it applied are pruned); closure of a
  port an app publishes without declaring it (applint K12 is a warning).

## Steps

1. [In Progress] Home features card `secure_connections` (EN + FR): name automatic firewall reconciliation and what it
   does. Files: `src/i18n/en/common.json`, `src/i18n/fr/common.json`.
2. [Open] Pricing matrix connectivity row `firewall_reconciliation`, yes in every edition. Files:
   `src/components/PricingMatrix.astro` (groups list only), both `common.json`. Clear of PR 103's lines.
3. [Open] Gates: `npm run test:i18n`, prose, unicode, `npm run build`/`check` where they run without secrets.
4. [Open] Review, commit.

## Open questions

None.
