// Per-service catalog driving the Features page. Single source of
// truth for slug + display name + upstream URL; capability-level copy
// lives in i18n (common.for_your_team.capabilities.<slug>.{title,intro}).
//
// `name` is the public display name as it should appear in the
// "Built on" footer (e.g. "Rocket.Chat", "Nextcloud Talk"). Proper
// nouns -- no translation.
//
// `docs_slug` overrides the slug used to construct the per-app docs
// link when the apps/docs/ filename differs from the i18n key
// (e.g. nextcloud -> nextcloud-s3-oidc, rocketchat -> rocketchat-oidc).
//
// `image_path` is the per-capability screenshot/preview image used by
// CapabilitySection. Path is relative to /apps/website/public/. When
// unset the section renders without a media slot.
//
// `logo_path` is the per-service logo used in the "Built on" footer.
// When unset the footer renders text-only for that service (no broken
// image fallback).
//
// `openalternative_slug` is the path component on openalternative.co
// used to deep-link to the curated alternatives list. Optional so
// supporting tools that are not on openalternative.co (e.g. Nextcloud
// Talk as a Nextcloud subapp, Linphone) can still ship without a
// fake slug. Verified manually -- some slugs do not match the obvious
// app name (Rocket.Chat -> rocket-chat, OnlyOffice -> onlyoffice-docs,
// Easy!Appointments -> easy-appointments, Invoice Ninja -> invoice-ninja).

export interface Service {
  slug: string;
  name: string;
  upstream_url: string;
  openalternative_slug?: string;
  docs_slug?: string;
  image_path?: string;
  logo_path?: string;
}

export const SERVICES: Service[] = [
  { slug: "nextcloud",     name: "Nextcloud",         upstream_url: "https://nextcloud.com/",        openalternative_slug: "nextcloud",         docs_slug: "nextcloud-s3-oidc" },
  { slug: "onlyoffice",    name: "OnlyOffice",        upstream_url: "https://www.onlyoffice.com/",   openalternative_slug: "onlyoffice-docs" },
  { slug: "rocketchat",    name: "Rocket.Chat",       upstream_url: "https://www.rocket.chat/",      openalternative_slug: "rocket-chat",       docs_slug: "rocketchat-oidc" },
  { slug: "espocrm",       name: "EspoCRM",           upstream_url: "https://www.espocrm.com/",      openalternative_slug: "espocrm" },
  { slug: "scheduler",     name: "Easy!Appointments", upstream_url: "https://easyappointments.org/", openalternative_slug: "easy-appointments" },
  { slug: "n8n",           name: "n8n",               upstream_url: "https://n8n.io/",               openalternative_slug: "n8n" },
  { slug: "postiz",        name: "Postiz",            upstream_url: "https://postiz.com/",           openalternative_slug: "postiz" },
  { slug: "outline",       name: "Outline",           upstream_url: "https://www.getoutline.com/",   openalternative_slug: "outline" },
  { slug: "plane",         name: "Plane",             upstream_url: "https://plane.so/",             openalternative_slug: "plane" },
  { slug: "docuseal",      name: "DocuSeal",          upstream_url: "https://www.docuseal.com/",     openalternative_slug: "docuseal" },
  { slug: "invoiceninja",  name: "Invoice Ninja",     upstream_url: "https://invoiceninja.com/",     openalternative_slug: "invoice-ninja" },
  { slug: "nextcloudtalk", name: "Nextcloud Talk",    upstream_url: "https://nextcloud.com/talk/" },
  { slug: "element",       name: "Element",           upstream_url: "https://element.io/" },
  { slug: "linphone",      name: "Linphone",          upstream_url: "https://www.linphone.org/" },
];

export function appDocsHref(service: Service, locale: "en" | "fr"): string {
  const slug = service.docs_slug ?? service.slug;
  const prefix = locale === "en" ? "/docs/apps" : "/docs/fr/apps";
  return `${prefix}/${slug}/`;
}

export function openAlternativeHref(service: Service): string | undefined {
  return service.openalternative_slug
    ? `https://openalternative.co/${service.openalternative_slug}`
    : undefined;
}
