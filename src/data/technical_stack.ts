// Per-component catalog driving the /features/technical page.
// Parallel to services.ts: each technical component has a slug,
// display name, upstream URL, and optional logo path. The page
// groups them into capability buckets defined under
// common.for_your_it.buckets.<key> in the i18n bundles.

export interface TechnicalComponent {
  slug: string;
  name: string;
  upstream_url: string;
  logo_path?: string;
}

export const TECHNICAL_STACK: TechnicalComponent[] = [
  { slug: "ansible",           name: "Ansible",                upstream_url: "https://www.ansible.com/" },
  { slug: "sops_age",          name: "SOPS + age",             upstream_url: "https://github.com/getsops/sops" },
  { slug: "cloudflare_tunnel", name: "Cloudflare Tunnel",      upstream_url: "https://www.cloudflare.com/products/tunnel/" },
  { slug: "tailscale",         name: "Tailscale",              upstream_url: "https://tailscale.com/" },
  { slug: "keycloak",          name: "Keycloak + oauth2-proxy", upstream_url: "https://www.keycloak.org/" },
  { slug: "restic",            name: "Restic",                 upstream_url: "https://restic.net/" },
  { slug: "dokploy",           name: "Dokploy",                upstream_url: "https://dokploy.com/" },
  { slug: "gatus",             name: "Gatus",                  upstream_url: "https://gatus.io/" },
  { slug: "healthchecks",      name: "Healthchecks",           upstream_url: "https://healthchecks.io/" },
];

export interface TechnicalBucket {
  key: string;
  component_slugs: string[];
}

export const TECHNICAL_BUCKETS: TechnicalBucket[] = [
  { key: "secure_deployment", component_slugs: ["ansible", "sops_age"] },
  { key: "secure_access",     component_slugs: ["cloudflare_tunnel", "tailscale", "keycloak"] },
  { key: "backup_recovery",   component_slugs: ["restic"] },
  { key: "orchestration",     component_slugs: ["dokploy"] },
  { key: "observability",     component_slugs: ["gatus", "healthchecks"] },
];

export function resolveComponents(bucket: TechnicalBucket): TechnicalComponent[] {
  return bucket.component_slugs
    .map((slug) => TECHNICAL_STACK.find((c) => c.slug === slug))
    .filter((c): c is TechnicalComponent => Boolean(c));
}
