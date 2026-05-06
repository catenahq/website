// Per-service catalog driving the Features page. Single source of
// truth for slug + upstream URL; copy lives in i18n
// (common.for_your_team.apps.<slug>.{title,role,body}).
//
// `docs_slug` overrides the slug used to construct the per-app docs
// link when the apps/docs/ filename differs from the i18n key
// (e.g. nextcloud -> nextcloud-s3-oidc, rocketchat -> rocketchat-oidc).
//
// `image_path` is the per-service screenshot/preview image used by
// ServiceSection. Path is relative to /apps/website/public/. When
// unset the section renders an empty placeholder slot (intentional --
// designer fills these in over time).
//
// `openalternative_slug` is the path component on openalternative.co
// (e.g. https://openalternative.co/<slug>) used to deep-link to the
// curated alternatives list for each pick. Verified manually -- some
// slugs do not match the obvious app name (Rocket.Chat -> rocket-chat,
// OnlyOffice -> onlyoffice-docs, Easy!Appointments -> easy-appointments,
// Invoice Ninja -> invoice-ninja).

export interface Service {
  slug: string;
  upstream_url: string;
  openalternative_slug: string;
  docs_slug?: string;
  image_path?: string;
}

export const SERVICES: Service[] = [
  { slug: "nextcloud",    upstream_url: "https://nextcloud.com/",        openalternative_slug: "nextcloud",         docs_slug: "nextcloud-s3-oidc" },
  { slug: "onlyoffice",   upstream_url: "https://www.onlyoffice.com/",   openalternative_slug: "onlyoffice-docs" },
  { slug: "rocketchat",   upstream_url: "https://www.rocket.chat/",      openalternative_slug: "rocket-chat",       docs_slug: "rocketchat-oidc" },
  { slug: "espocrm",      upstream_url: "https://www.espocrm.com/",      openalternative_slug: "espocrm" },
  { slug: "scheduler",    upstream_url: "https://easyappointments.org/", openalternative_slug: "easy-appointments" },
  { slug: "n8n",          upstream_url: "https://n8n.io/",               openalternative_slug: "n8n" },
  { slug: "postiz",       upstream_url: "https://postiz.com/",           openalternative_slug: "postiz" },
  { slug: "outline",      upstream_url: "https://www.getoutline.com/",   openalternative_slug: "outline" },
  { slug: "plane",        upstream_url: "https://plane.so/",             openalternative_slug: "plane" },
  { slug: "docuseal",     upstream_url: "https://www.docuseal.com/",     openalternative_slug: "docuseal" },
  { slug: "invoiceninja", upstream_url: "https://invoiceninja.com/",     openalternative_slug: "invoice-ninja" },
];

export function appDocsHref(service: Service, locale: "en" | "fr"): string {
  const slug = service.docs_slug ?? service.slug;
  const prefix = locale === "en" ? "/docs/apps" : "/docs/fr/apps";
  return `${prefix}/${slug}/`;
}

export function openAlternativeHref(service: Service): string {
  return `https://openalternative.co/${service.openalternative_slug}`;
}
