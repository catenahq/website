// Per-service catalog driving the Features page. Single source of
// truth for slug + upstream URL; copy lives in i18n
// (common.for_your_team.apps.<slug>.{title,role,body}).
//
// `docs_slug` overrides the slug used to construct the per-app docs
// link when the apps/docs/ filename differs from the i18n key
// (e.g. nextcloud -> nextcloud-s3-oidc, rocketchat -> rocketchat-oidc).

export interface Service {
  slug: string;
  upstream_url: string;
  docs_slug?: string;
}

export const SERVICES: Service[] = [
  { slug: "nextcloud",    upstream_url: "https://nextcloud.com/",        docs_slug: "nextcloud-s3-oidc" },
  { slug: "onlyoffice",   upstream_url: "https://www.onlyoffice.com/" },
  { slug: "rocketchat",   upstream_url: "https://www.rocket.chat/",      docs_slug: "rocketchat-oidc" },
  { slug: "espocrm",      upstream_url: "https://www.espocrm.com/" },
  { slug: "scheduler",    upstream_url: "https://easyappointments.org/" },
  { slug: "n8n",          upstream_url: "https://n8n.io/" },
  { slug: "postiz",       upstream_url: "https://postiz.com/" },
  { slug: "outline",      upstream_url: "https://www.getoutline.com/" },
  { slug: "plane",        upstream_url: "https://plane.so/" },
  { slug: "docuseal",     upstream_url: "https://www.docuseal.com/" },
  { slug: "invoiceninja", upstream_url: "https://invoiceninja.com/" },
];

export function appDocsHref(service: Service, locale: "en" | "fr"): string {
  const slug = service.docs_slug ?? service.slug;
  const prefix = locale === "en" ? "/docs/apps" : "/docs/fr/apps";
  return `${prefix}/${slug}/`;
}
