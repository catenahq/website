// Number of apps in the published catalog, read at build time: the folders
// under blueprints/ of catenahq/catena-templates, one per app. A build that
// cannot read them gets null and the page shows the catalog link with no number.
const BLUEPRINTS_URL = "https://api.github.com/repos/catenahq/catena-templates/contents/blueprints";

async function fetchCount(): Promise<number | null> {
  try {
    const res = await fetch(BLUEPRINTS_URL, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`answered ${res.status}`);
    const entries = (await res.json()) as unknown;
    if (!Array.isArray(entries)) throw new Error("no folder list");
    const apps = entries.filter((e) => (e as { type?: unknown }).type === "dir").length;
    if (apps === 0) throw new Error("no app folders");
    return apps;
  } catch (err) {
    console.warn(`catalog-count: ${BLUEPRINTS_URL}: ${err}; the apps section shows no number`);
    return null;
  }
}

// One request per build, shared by every page.
let cached: Promise<number | null> | undefined;
export const catalogCount = () => (cached ??= fetchCount());
