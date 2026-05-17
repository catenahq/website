// Per-capability catalog driving the Features page. Each capability
// has its own section: title + intro from i18n
// (common.for_your_team.capabilities.<slug>.{title,intro,cta_label?}),
// an optional CTA link to a docs guide or pricing add-on, and a
// "Built on" footer listing the apps that implement it. The apps
// list is resolved against SERVICES at render time.

import type { Service } from "./services";
import { SERVICES } from "./services";

export interface Capability {
  slug: string;
  app_slugs: string[];                         // references SERVICES.slug
  docs_href?: { en: string; fr: string };      // optional deep-link to a docs guide
  external_href?: { en: string; fr: string };  // optional non-docs link (pricing, etc.)
}

export const CAPABILITIES: Capability[] = [
  {
    slug: "communications",
    app_slugs: ["rocketchat", "nextcloudtalk", "element", "linphone"],
    docs_href: {
      en: "https://docs.catena.run/en/guides/communications-platforms/",
      fr: "https://docs.catena.run/guides/communications-platforms/",
    },
  },
  {
    slug: "files_and_workspace",
    app_slugs: ["nextcloud"],
    docs_href: {
      en: "https://docs.catena.run/en/nextcloud-apps-vs-suite/",
      fr: "https://docs.catena.run/nextcloud-apps-vs-suite/",
    },
  },
  { slug: "collaborative_editing", app_slugs: ["onlyoffice"] },
  { slug: "team_documentation",    app_slugs: ["outline"] },
  { slug: "document_signing",      app_slugs: ["docuseal"] },
  { slug: "crm",                   app_slugs: ["espocrm"] },
  {
    slug: "booking",
    app_slugs: ["scheduler"],
    docs_href: {
      en: "https://docs.catena.run/en/how-to-pick-a-scheduler/",
      fr: "https://docs.catena.run/how-to-pick-a-scheduler/",
    },
  },
  { slug: "invoicing",          app_slugs: ["invoiceninja"] },
  { slug: "workflow_automation", app_slugs: ["n8n"] },
  { slug: "project_management",  app_slugs: ["plane"] },
  { slug: "social_posting",      app_slugs: ["postiz"] },
  {
    slug: "website_hosting",
    app_slugs: [],
    external_href: { en: "/en/pricing#add-ons", fr: "/pricing#add-ons" },
  },
  {
    slug: "email_integration",
    app_slugs: [],
    docs_href: {
      en: "https://docs.catena.run/en/guides/email-providers/",
      fr: "https://docs.catena.run/guides/email-providers/",
    },
  },
];

export function resolveApps(capability: Capability): Service[] {
  return capability.app_slugs
    .map((slug) => SERVICES.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));
}

export function capabilityHref(
  capability: Capability,
  locale: "en" | "fr",
): string | undefined {
  return capability.docs_href?.[locale] ?? capability.external_href?.[locale];
}
