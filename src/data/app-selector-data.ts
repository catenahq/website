// App-selector seed data.
//
// Source of truth is two sibling CSV files, edited in any spreadsheet
// tool:
//   - app-selector-apps.csv: one row per app, with metadata + pricing
//   - app-selector-coverage.csv: needs x apps matrix; cells are
//     P (primary), S (secondary), N (explicitly not covered, for
//     editorial review), or empty (not investigated yet)
//
// This module reads both at Astro build time and exposes the same
// shapes the picker consumes (NEEDS, APPS). N and empty cells are
// both treated as "no coverage" at runtime -- the distinction exists
// only to flag rows that still need editorial review.
//
// Catena per-server / per-app / support pricing comes from the
// vendored @catenahq/contracts/pricing/tiers.json; the storage rate
// and the VPS passthrough live below.

// CSVs are inlined into the bundle at build time via Vite's `?raw`
// import; reading from disk at runtime would break because the bundled
// chunk lives next to .prerender/chunks/, not next to the source.
// @ts-expect-error -- vite ?raw suffix returns a string at build time
import appsCsv from "./app-selector-apps.csv?raw";
// @ts-expect-error -- vite ?raw suffix returns a string at build time
import coverageCsv from "./app-selector-coverage.csv?raw";

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

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  for (const line of text.split(/\r?\n/)) {
    if (line.length === 0) continue;
    const cells: string[] = [];
    let cur = "";
    let inQuotes = false;
    let i = 0;
    while (i < line.length) {
      const c = line[i];
      if (inQuotes) {
        if (c === '"' && line[i + 1] === '"') {
          cur += '"';
          i += 2;
        } else if (c === '"') {
          inQuotes = false;
          i++;
        } else {
          cur += c;
          i++;
        }
      } else if (c === ",") {
        cells.push(cur);
        cur = "";
        i++;
      } else if (c === '"' && cur.length === 0) {
        inQuotes = true;
        i++;
      } else {
        cur += c;
        i++;
      }
    }
    cells.push(cur);
    rows.push(cells);
  }
  return rows;
}

function parseApp(row: Record<string, string>): App {
  const app: App = {
    id: row.id,
    label: row.label,
    type: row.type as AppType,
    covers: [],
  };
  if (row.default_selected === "true") app.default_selected = true;
  if (row.always_selected === "true") app.always_selected = true;
  if (row.catalog_ref) app.catalog_ref = row.catalog_ref;
  if (row.warning_key) app.warning_key = row.warning_key;
  if (row.pricing_kind) {
    const url = row.pricing_url;
    if (row.pricing_kind === "flat") {
      app.pricing = {
        kind: "flat",
        monthly_cad: Number(row.flat_cad || "0"),
        pricing_url: url,
      };
    } else if (row.pricing_kind === "per_seat") {
      app.pricing = {
        kind: "per_seat",
        per_seat_monthly_cad: Number(row.per_seat_cad || "0"),
        pricing_url: url,
      };
    } else if (row.pricing_kind === "per_seat_plus_base") {
      app.pricing = {
        kind: "per_seat_plus_base",
        base_monthly_cad: Number(row.base_cad || "0"),
        per_seat_monthly_cad: Number(row.per_seat_cad || "0"),
        pricing_url: url,
      };
    } else if (row.pricing_kind === "tiered_by_users") {
      app.pricing = {
        kind: "tiered_by_users",
        tiers: [
          {
            max_users: Number(row.tier_max_users || "0"),
            monthly_cad: Number(row.tier_cad || "0"),
          },
        ],
        pricing_url: url,
      };
    }
  }
  return app;
}

const appsTable = parseCsv(appsCsv);
const appsHeader = appsTable[0];
const appsList: App[] = appsTable.slice(1).map((row) => {
  const rec: Record<string, string> = {};
  for (let i = 0; i < appsHeader.length; i++) rec[appsHeader[i]] = row[i] ?? "";
  return parseApp(rec);
});
const appsById = new Map(appsList.map((a) => [a.id, a]));

const covTable = parseCsv(coverageCsv);
const covHeader = covTable[0];
const appIdCols = covHeader.slice(2);
const needsList: Need[] = [];

for (const row of covTable.slice(1)) {
  const category = row[0] as CategoryId;
  const need = row[1];
  needsList.push({ id: need, category });
  for (let i = 0; i < appIdCols.length; i++) {
    const cell = row[i + 2];
    if (cell === "P" || cell === "S") {
      const app = appsById.get(appIdCols[i]);
      if (app) {
        app.covers.push({
          need,
          strength: cell === "P" ? "primary" : "secondary",
        });
      }
    }
    // "N" and "" both mean "no coverage" at runtime. The distinction
    // is editorial: N = checked and confirmed absent; empty = not yet
    // investigated. Scan the coverage CSV in a spreadsheet to find
    // the empty cells that still need a verdict.
  }
}

export const NEEDS: readonly Need[] = needsList;
export const APPS: readonly App[] = appsList;
