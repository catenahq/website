// App-selector seed data.
//
// This module is the single source of truth for the picker's needs +
// apps + coverage matrix + external-SaaS pricing. Labels live in
// i18n (src/i18n/{en,fr}/common.json under `common.app_selector.*`)
// and are joined at render time.
//
// Catena pricing (server, per-app, support packs, installer fees)
// comes from the vendored @catenahq/contracts/pricing/tiers.json at
// build time. Storage rate is below.

export const STORAGE_RATE_CAD_PER_GB_PER_MONTH = 0.10;

// VPS hosting passthrough -- the underlying provider charge (OVH BHS
// default per project_default_architecture). Billed to the client by
// the provider, not by Catena, but surfaced in the picker so the
// monthly total reflects the true cost of running a Catena deployment.
export const VPS_BASE_MONTHLY_CAD = 13.60;

export type CategoryId =
  | "collaboration"
  | "sales_crm"
  | "billing"
  | "back_office"
  | "communications"
  | "operations"
  | "marketing"
  | "infrastructure";

export const CATEGORIES: readonly CategoryId[] = [
  "collaboration",
  "sales_crm",
  "billing",
  "back_office",
  "communications",
  "operations",
  "marketing",
  "infrastructure",
];

export interface Need {
  id: string;
  category: CategoryId;
}

export const NEEDS: readonly Need[] = [
  // collaboration
  { id: "file_sharing", category: "collaboration" },
  { id: "collab_editing", category: "collaboration" },
  { id: "internal_calendar", category: "collaboration" },
  { id: "contacts_directory", category: "collaboration" },
  { id: "internal_forms", category: "collaboration" },
  { id: "knowledge_wiki", category: "collaboration" },
  { id: "note_taking", category: "collaboration" },
  { id: "password_secrets_manager", category: "collaboration" },

  // sales_crm
  { id: "crm_pipeline", category: "sales_crm" },
  { id: "lead_capture_forms", category: "sales_crm" },
  { id: "quotes_estimates_crm", category: "sales_crm" },
  { id: "email_marketing_mass", category: "sales_crm" },
  { id: "workflow_automation_light", category: "sales_crm" },
  { id: "social_posting", category: "sales_crm" },

  // billing
  { id: "invoicing", category: "billing" },
  { id: "payments_stripe", category: "billing" },
  { id: "expenses", category: "billing" },
  { id: "recurring_billing", category: "billing" },
  { id: "client_portal_billing", category: "billing" },
  { id: "contracts_signing", category: "billing" },

  // back_office
  { id: "accounting_gl", category: "back_office" },
  { id: "sales_tax_filing", category: "back_office" },
  { id: "payroll", category: "back_office" },
  { id: "hr_records", category: "back_office" },
  { id: "inventory_management", category: "back_office" },
  { id: "ecommerce_storefront", category: "back_office" },

  // communications
  { id: "internal_chat", category: "communications" },
  { id: "internal_video", category: "communications" },
  { id: "customer_inbox_omnichannel", category: "communications" },
  { id: "customer_support_tickets", category: "communications" },
  { id: "phone_calls", category: "communications" },
  { id: "phone_dial_in_meetings", category: "communications" },
  { id: "email_hosted", category: "communications" },

  // operations
  { id: "project_management", category: "operations" },
  { id: "time_tracking", category: "operations" },
  { id: "appointment_booking", category: "operations" },
  { id: "automation_glue", category: "operations" },
  { id: "public_website", category: "operations" },

  // marketing
  { id: "marketing_automation", category: "marketing" },
  { id: "newsletter_campaigns", category: "marketing" },

  // infrastructure
  { id: "identity_sso", category: "infrastructure" },
  { id: "backups", category: "infrastructure" },
];

export type AppType =
  | "catena_bundled"
  | "catena_managed"
  | "external_saas"
  | "external_oss";

export type Strength = "primary" | "secondary";

export interface Coverage {
  need: string;
  strength: Strength;
}

export type PricingModel =
  | { kind: "flat"; monthly_cad: number; pricing_url: string }
  | {
      kind: "per_seat";
      per_seat_monthly_cad: number;
      pricing_url: string;
    }
  | {
      kind: "per_seat_plus_base";
      base_monthly_cad: number;
      per_seat_monthly_cad: number;
      pricing_url: string;
    }
  | {
      kind: "tiered_by_users";
      tiers: { max_users: number; monthly_cad: number }[];
      pricing_url: string;
    };

export interface App {
  id: string;
  label: string;
  type: AppType;
  catalog_ref?: string;
  pricing?: PricingModel;
  pricing_url?: string;
  covers: Coverage[];
  warning_key?: string;
  // Pre-ticked on a fresh visit (no saved state). User can untick;
  // saved state wins on subsequent visits.
  default_selected?: boolean;
  // Force-ticked on every init, regardless of saved state. Renders
  // with a disabled checkbox so the user cannot untick it -- intended
  // for the implicit suite baseline (Keycloak + Restic + the server
  // itself), which is always there as soon as a Catena VPS exists.
  always_selected?: boolean;
}

export const APPS: readonly App[] = [
  // Catena-bundled (included in $400 server)
  //
  // Catena Suite covers the internal infrastructure that ships with
  // the base server: Keycloak (identity_sso) and Restic (backups).
  // Modelled as one virtual catena_bundled app rather than separate
  // Keycloak/Restic rows because those pieces are not user-installable
  // -- they come with the suite, always-on.
  {
    id: "catena_suite",
    label: "Catena Suite",
    type: "catena_bundled",
    always_selected: true,
    covers: [
      { need: "identity_sso", strength: "primary" },
      { need: "backups", strength: "primary" },
    ],
  },
  {
    id: "nextcloud",
    label: "Nextcloud",
    type: "catena_bundled",
    catalog_ref: "nextcloud-s3-oidc",
    default_selected: true,
    covers: [
      { need: "file_sharing", strength: "primary" },
      { need: "internal_calendar", strength: "primary" },
      { need: "contacts_directory", strength: "primary" },
      { need: "internal_forms", strength: "primary" },
      { need: "knowledge_wiki", strength: "secondary" },
      { need: "internal_chat", strength: "secondary" },
      { need: "internal_video", strength: "secondary" },
      { need: "time_tracking", strength: "secondary" },
    ],
  },
  // OnlyOffice / Collabora are picked per-client at install (Catena
  // ships either, never both). Merged into one picker row so the
  // user does not falsely see an overlap when the suite implies the
  // generic "document editor". catalog_ref omitted -- two Dokploy
  // templates back this depending on operator choice.
  {
    id: "office_editor",
    label: "OnlyOffice / Collabora",
    type: "catena_bundled",
    default_selected: true,
    covers: [{ need: "collab_editing", strength: "primary" }],
  },

  // Catena-managed ($100/mo each)
  {
    id: "rocketchat",
    label: "Rocket.Chat",
    type: "catena_managed",
    catalog_ref: "rocketchat-oidc",
    covers: [
      { need: "internal_chat", strength: "primary" },
      { need: "internal_video", strength: "primary" },
      { need: "customer_inbox_omnichannel", strength: "primary" },
    ],
  },
  {
    id: "element",
    label: "Element / Matrix",
    type: "catena_managed",
    catalog_ref: "element",
    covers: [
      { need: "internal_chat", strength: "primary" },
      { need: "internal_video", strength: "primary" },
      { need: "phone_dial_in_meetings", strength: "primary" },
    ],
  },
  {
    id: "espocrm",
    label: "EspoCRM",
    type: "catena_managed",
    catalog_ref: "espocrm",
    covers: [
      { need: "crm_pipeline", strength: "primary" },
      { need: "lead_capture_forms", strength: "primary" },
      { need: "email_marketing_mass", strength: "primary" },
      { need: "workflow_automation_light", strength: "primary" },
      { need: "quotes_estimates_crm", strength: "primary" },
      { need: "contacts_directory", strength: "secondary" },
    ],
  },
  {
    id: "twenty",
    label: "Twenty",
    type: "catena_managed",
    catalog_ref: "twenty",
    covers: [{ need: "crm_pipeline", strength: "primary" }],
  },
  {
    id: "plane",
    label: "Plane",
    type: "catena_managed",
    catalog_ref: "plane",
    covers: [{ need: "project_management", strength: "primary" }],
  },
  {
    id: "zammad",
    label: "Zammad",
    type: "catena_managed",
    catalog_ref: "zammad",
    covers: [{ need: "customer_support_tickets", strength: "primary" }],
  },
  {
    id: "chatwoot",
    label: "Chatwoot",
    type: "catena_managed",
    catalog_ref: "chatwoot",
    covers: [
      { need: "customer_inbox_omnichannel", strength: "primary" },
    ],
  },
  {
    id: "easyappointments",
    label: "Easy!Appointments",
    type: "catena_managed",
    catalog_ref: "easyappointments",
    covers: [{ need: "appointment_booking", strength: "primary" }],
  },
  {
    id: "docuseal",
    label: "DocuSeal",
    type: "catena_managed",
    catalog_ref: "docuseal",
    covers: [{ need: "contracts_signing", strength: "primary" }],
  },
  {
    id: "outline",
    label: "Outline",
    type: "catena_managed",
    catalog_ref: "outline",
    covers: [{ need: "knowledge_wiki", strength: "primary" }],
  },
  {
    id: "wordpress",
    label: "WordPress",
    type: "catena_managed",
    catalog_ref: "wordpress",
    covers: [{ need: "public_website", strength: "primary" }],
  },
  {
    id: "n8n",
    label: "n8n",
    type: "catena_managed",
    catalog_ref: "n8n",
    covers: [{ need: "automation_glue", strength: "primary" }],
  },
  {
    id: "postiz",
    label: "Postiz",
    type: "catena_managed",
    catalog_ref: "postiz",
    covers: [{ need: "social_posting", strength: "primary" }],
  },
  {
    id: "mautic",
    label: "Mautic",
    type: "catena_managed",
    catalog_ref: "mautic",
    covers: [
      { need: "marketing_automation", strength: "primary" },
      { need: "newsletter_campaigns", strength: "primary" },
    ],
  },
  // Vaultwarden: self-hosted Bitwarden-compatible vault. No catalog
  // entry yet (no dokploy-templates compose); add `catalog_ref` once
  // the template ships. The sales/4-defining-contract/planning.md
  // historically argued AGAINST self-hosting the vault ("VPS death =
  // vault death") -- revisit that doc if Vaultwarden becomes a
  // first-class managed offer.
  {
    id: "vaultwarden",
    label: "Vaultwarden",
    type: "catena_managed",
    covers: [{ need: "password_secrets_manager", strength: "primary" }],
  },
  {
    id: "invoiceninja",
    label: "Invoice Ninja",
    type: "catena_managed",
    catalog_ref: "invoiceninja",
    covers: [
      { need: "invoicing", strength: "primary" },
      { need: "payments_stripe", strength: "primary" },
      { need: "expenses", strength: "primary" },
      { need: "recurring_billing", strength: "primary" },
      { need: "client_portal_billing", strength: "primary" },
      { need: "quotes_estimates_crm", strength: "secondary" },
      { need: "time_tracking", strength: "secondary" },
    ],
  },
  {
    id: "kimai",
    label: "Kimai",
    type: "catena_managed",
    catalog_ref: "kimai",
    covers: [{ need: "time_tracking", strength: "primary" }],
  },
  {
    id: "erpnext",
    label: "ERPNext",
    type: "catena_managed",
    catalog_ref: "erpnext",
    warning_key: "erpnext_not_recommended",
    covers: [
      { need: "accounting_gl", strength: "primary" },
      { need: "inventory_management", strength: "primary" },
      { need: "hr_records", strength: "primary" },
      { need: "ecommerce_storefront", strength: "primary" },
    ],
  },

  // External SaaS -- QBO Canada. Tiers as of 2026-05-22: EasyStart /
  // Plus / Advanced. No Essentials tier in Canada (US-only). Each
  // tier is a standalone row; the picker shows them all and the user
  // picks one. Coverage differences are encoded directly in `covers`
  // -- EasyStart skips inventory_management, Plus and Advanced
  // include it.
  {
    id: "qbo_easystart",
    label: "QuickBooks Online EasyStart",
    type: "external_saas",
    pricing: {
      kind: "tiered_by_users",
      tiers: [{ max_users: 1, monthly_cad: 30 }],
      pricing_url: "https://quickbooks.intuit.com/ca/pricing/",
    },
    covers: [
      { need: "accounting_gl", strength: "primary" },
      { need: "sales_tax_filing", strength: "primary" },
    ],
  },
  {
    id: "qbo_plus",
    label: "QuickBooks Online Plus",
    type: "external_saas",
    pricing: {
      kind: "tiered_by_users",
      tiers: [{ max_users: 5, monthly_cad: 110 }],
      pricing_url: "https://quickbooks.intuit.com/ca/pricing/",
    },
    covers: [
      { need: "accounting_gl", strength: "primary" },
      { need: "sales_tax_filing", strength: "primary" },
      { need: "inventory_management", strength: "primary" },
    ],
  },
  {
    id: "qbo_advanced",
    label: "QuickBooks Online Advanced",
    type: "external_saas",
    pricing: {
      kind: "tiered_by_users",
      tiers: [{ max_users: 25, monthly_cad: 220 }],
      pricing_url: "https://quickbooks.intuit.com/ca/pricing/",
    },
    covers: [
      { need: "accounting_gl", strength: "primary" },
      { need: "sales_tax_filing", strength: "primary" },
      { need: "inventory_management", strength: "primary" },
    ],
  },

  // External SaaS -- QuickBooks Time (add-on, separate sub-bill)
  {
    id: "qbo_time",
    label: "QuickBooks Time",
    type: "external_saas",
    pricing: {
      kind: "per_seat_plus_base",
      base_monthly_cad: 30,
      per_seat_monthly_cad: 10,
      pricing_url: "https://quickbooks.intuit.com/ca/pricing/",
    },
    covers: [{ need: "time_tracking", strength: "primary" }],
  },

  // External SaaS -- QBO Online Payroll (add-on). Canada tiers as of
  // 2026-05-22: EasyStart / Essentials / Premium.
  {
    id: "qbo_payroll_easystart",
    label: "QuickBooks Online Payroll (EasyStart)",
    type: "external_saas",
    pricing: {
      kind: "per_seat_plus_base",
      base_monthly_cad: 60,
      per_seat_monthly_cad: 5,
      pricing_url: "https://quickbooks.intuit.com/ca/payroll/",
    },
    covers: [{ need: "payroll", strength: "primary" }],
  },
  {
    id: "qbo_payroll_essentials",
    label: "QuickBooks Online Payroll (Essentials)",
    type: "external_saas",
    pricing: {
      kind: "per_seat_plus_base",
      base_monthly_cad: 100,
      per_seat_monthly_cad: 5,
      pricing_url: "https://quickbooks.intuit.com/ca/payroll/",
    },
    covers: [{ need: "payroll", strength: "primary" }],
  },
  {
    id: "qbo_payroll_premium",
    label: "QuickBooks Online Payroll (Premium)",
    type: "external_saas",
    pricing: {
      kind: "per_seat_plus_base",
      base_monthly_cad: 165,
      per_seat_monthly_cad: 8,
      pricing_url: "https://quickbooks.intuit.com/ca/payroll/",
    },
    covers: [{ need: "payroll", strength: "primary" }],
  },

  // External SaaS -- Wagepoint
  {
    id: "wagepoint",
    label: "Wagepoint",
    type: "external_saas",
    pricing: {
      kind: "per_seat_plus_base",
      base_monthly_cad: 20,
      per_seat_monthly_cad: 4,
      pricing_url: "https://wagepoint.com/ca/pricing",
    },
    covers: [{ need: "payroll", strength: "primary" }],
  },

  // External SaaS -- email hosting
  {
    id: "infomaniak_mail",
    label: "Infomaniak Mail",
    type: "external_saas",
    pricing: {
      kind: "per_seat",
      per_seat_monthly_cad: 2,
      pricing_url: "https://www.infomaniak.com/en/mail",
    },
    covers: [{ need: "email_hosted", strength: "primary" }],
  },
  {
    id: "mailbox_org",
    label: "Mailbox.org",
    type: "external_saas",
    pricing: {
      kind: "per_seat",
      per_seat_monthly_cad: 4,
      pricing_url: "https://mailbox.org/en/private-customers",
    },
    covers: [{ need: "email_hosted", strength: "primary" }],
  },
  {
    id: "ovh_email_pro",
    label: "OVH Email Pro",
    type: "external_saas",
    pricing: {
      kind: "per_seat",
      per_seat_monthly_cad: 3,
      pricing_url: "https://www.ovhcloud.com/en-ca/emails/email-pro/",
    },
    covers: [{ need: "email_hosted", strength: "primary" }],
  },
  {
    id: "proton_mail_business",
    label: "Proton Mail Business",
    type: "external_saas",
    pricing: {
      kind: "per_seat",
      per_seat_monthly_cad: 12,
      pricing_url: "https://proton.me/business",
    },
    covers: [{ need: "email_hosted", strength: "primary" }],
  },

  // External OSS notes apps. Free, self-host yourself. Listed so
  // clients evaluating note-taking against M365 OneNote can see the
  // FOSS alternatives -- not Catena-managed.
  {
    id: "appflowy",
    label: "AppFlowy",
    type: "external_saas",
    pricing: {
      kind: "flat",
      monthly_cad: 0,
      pricing_url: "https://appflowy.com/",
    },
    covers: [{ need: "note_taking", strength: "primary" }],
  },
  {
    id: "memos",
    label: "Memos",
    type: "external_saas",
    pricing: {
      kind: "flat",
      monthly_cad: 0,
      pricing_url: "https://usememos.com/",
    },
    covers: [{ need: "note_taking", strength: "primary" }],
  },

  // External SaaS -- Bitwarden free tier. Personal/individual use is
  // unlimited; the free Teams Starter org tops out at 2 users. For
  // larger teams the paid Teams plan applies (~$4 USD/user/mo);
  // verify and add a second row when a Catena client crosses the
  // 2-user threshold.
  {
    id: "bitwarden_free",
    label: "Bitwarden",
    type: "external_saas",
    pricing: {
      kind: "flat",
      monthly_cad: 0,
      pricing_url: "https://bitwarden.com/pricing/",
    },
    covers: [{ need: "password_secrets_manager", strength: "primary" }],
  },

  // External SaaS -- phone
  {
    id: "voipms",
    label: "VoIP.ms (per extension)",
    type: "external_saas",
    pricing: {
      kind: "per_seat",
      per_seat_monthly_cad: 5,
      pricing_url: "https://wiki.voip.ms/",
    },
    covers: [
      { need: "phone_calls", strength: "primary" },
      { need: "phone_dial_in_meetings", strength: "secondary" },
    ],
  },

  // External SaaS -- Microsoft 365 (the headline migration case)
  {
    id: "m365_business_basic",
    label: "Microsoft 365 Business Basic",
    type: "external_saas",
    pricing: {
      kind: "per_seat",
      per_seat_monthly_cad: 8.10,
      pricing_url:
        "https://www.microsoft.com/en-ca/microsoft-365/business/compare-all-plans",
    },
    covers: [
      { need: "email_hosted", strength: "primary" },
      { need: "file_sharing", strength: "primary" },
      { need: "collab_editing", strength: "primary" },
      { need: "internal_chat", strength: "primary" },
      { need: "internal_video", strength: "primary" },
      { need: "internal_calendar", strength: "primary" },
      { need: "contacts_directory", strength: "primary" },
      { need: "knowledge_wiki", strength: "primary" },
      { need: "note_taking", strength: "primary" },
    ],
  },
  {
    id: "m365_business_standard",
    label: "Microsoft 365 Business Standard",
    type: "external_saas",
    pricing: {
      kind: "per_seat",
      per_seat_monthly_cad: 17,
      pricing_url:
        "https://www.microsoft.com/en-ca/microsoft-365/business/compare-all-plans",
    },
    covers: [
      { need: "email_hosted", strength: "primary" },
      { need: "file_sharing", strength: "primary" },
      { need: "collab_editing", strength: "primary" },
      { need: "internal_chat", strength: "primary" },
      { need: "internal_video", strength: "primary" },
      { need: "internal_calendar", strength: "primary" },
      { need: "contacts_directory", strength: "primary" },
      { need: "knowledge_wiki", strength: "primary" },
      { need: "note_taking", strength: "primary" },
    ],
  },

  // External SaaS -- Google Workspace
  {
    id: "gws_business_starter",
    label: "Google Workspace Business Starter",
    type: "external_saas",
    pricing: {
      kind: "per_seat",
      per_seat_monthly_cad: 9,
      pricing_url: "https://workspace.google.com/pricing",
    },
    covers: [
      { need: "email_hosted", strength: "primary" },
      { need: "file_sharing", strength: "primary" },
      { need: "collab_editing", strength: "primary" },
      { need: "internal_chat", strength: "primary" },
      { need: "internal_video", strength: "primary" },
      { need: "internal_calendar", strength: "primary" },
      { need: "contacts_directory", strength: "primary" },
      { need: "knowledge_wiki", strength: "primary" },
    ],
  },

  // Odoo CE vs Enterprise -- paired rows, both external_saas so the
  // bill column shows their respective costs side by side. CE is
  // flat $0/mo (self-host yourself; no Catena management); Enterprise
  // is per-seat. Coverage differences live directly in `covers` --
  // Enterprise has the wider feature set (marketing, e-sign, studio
  // workflows). No tier-trap warning: the picker just shows what
  // each row covers and the user picks the cheaper covering option.
  {
    id: "odoo_ce",
    label: "Odoo Community Edition",
    type: "external_saas",
    pricing: {
      kind: "flat",
      monthly_cad: 0,
      pricing_url: "https://www.odoo.com/page/editions",
    },
    covers: [
      { need: "accounting_gl", strength: "primary" },
      { need: "sales_tax_filing", strength: "primary" },
      { need: "crm_pipeline", strength: "primary" },
      { need: "inventory_management", strength: "primary" },
      { need: "ecommerce_storefront", strength: "primary" },
      { need: "invoicing", strength: "primary" },
      { need: "expenses", strength: "primary" },
      { need: "quotes_estimates_crm", strength: "primary" },
      { need: "project_management", strength: "primary" },
      { need: "hr_records", strength: "primary" },
    ],
  },
  {
    id: "odoo_enterprise",
    label: "Odoo Enterprise",
    type: "external_saas",
    pricing: {
      kind: "per_seat",
      per_seat_monthly_cad: 34,
      pricing_url: "https://www.odoo.com/page/pricing-plan",
    },
    covers: [
      { need: "accounting_gl", strength: "primary" },
      { need: "sales_tax_filing", strength: "primary" },
      { need: "crm_pipeline", strength: "primary" },
      { need: "inventory_management", strength: "primary" },
      { need: "ecommerce_storefront", strength: "primary" },
      { need: "invoicing", strength: "primary" },
      { need: "expenses", strength: "primary" },
      { need: "quotes_estimates_crm", strength: "primary" },
      { need: "project_management", strength: "primary" },
      { need: "time_tracking", strength: "primary" },
      { need: "hr_records", strength: "primary" },
      { need: "contracts_signing", strength: "primary" },
      { need: "marketing_automation", strength: "primary" },
      { need: "email_marketing_mass", strength: "primary" },
      { need: "appointment_booking", strength: "primary" },
      { need: "workflow_automation_light", strength: "primary" },
    ],
  },
];

