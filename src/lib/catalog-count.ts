// Number of apps in the published catalog, read at build time from the
// catalog.json of catenahq/catena-templates. A build that cannot read it
// gets null and the page shows the catalog link with no number.
const CATALOG_URL = "https://raw.githubusercontent.com/catenahq/catena-templates/HEAD/catalog.json";

async function fetchCount(): Promise<number | null> {
  try {
    const res = await fetch(CATALOG_URL);
    if (!res.ok) throw new Error(`answered ${res.status}`);
    const { templates } = (await res.json()) as { templates?: unknown };
    if (!Array.isArray(templates) || templates.length === 0) throw new Error("no templates list");
    return templates.length;
  } catch (err) {
    console.warn(`catalog-count: ${CATALOG_URL}: ${err}; the apps section shows no number`);
    return null;
  }
}

// One request per build, shared by every page.
let cached: Promise<number | null> | undefined;
export const catalogCount = () => (cached ??= fetchCount());
