#!/usr/bin/env node
// Chained build for catena.run.
//
// Astro 6 has no first-class subpath-mount for two integrations in
// one project, so the marketing site (apps/website) and the docs
// (apps/docs, Starlight) build separately and the docs dist is
// copied under apps/website/dist/docs/. One nginx container, one
// deploy, one `npm run build -w @catena/website`.

import { spawnSync } from "node:child_process";
import { cpSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const websiteDir = resolve(here, "..");
const repoRoot = resolve(websiteDir, "..", "..");
const docsDir = join(repoRoot, "apps", "docs");

function run(cmd, args, cwd) {
  console.log(`> ${cmd} ${args.join(" ")}  (cwd=${cwd})`);
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: false });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

// 1. Build the marketing site at base="/" -> apps/website/dist/.
//    Use npx (not `npm run build`) to avoid recursing into this script.
//    The website's prebuild already fired (this script IS the build),
//    so the brand assets are already synced into src/styles/brand/.
run("npx", ["astro", "build"], websiteDir);

// 2. Build the docs at base="/docs/" -> apps/docs/dist/.
//    Use `npm run build` so docs's own prebuild (brand sync) fires.
run("npm", ["run", "build"], docsDir);

// 3. Merge: copy apps/docs/dist/* into apps/website/dist/docs/
const websiteDist = join(websiteDir, "dist");
const docsDist = join(docsDir, "dist");
const targetDocsDir = join(websiteDist, "docs");

if (!existsSync(websiteDist)) {
  console.error(`Marketing build did not produce ${websiteDist}`);
  process.exit(1);
}
if (!existsSync(docsDist)) {
  console.error(`Docs build did not produce ${docsDist}`);
  process.exit(1);
}

rmSync(targetDocsDir, { recursive: true, force: true });
mkdirSync(targetDocsDir, { recursive: true });
cpSync(docsDist, targetDocsDir, { recursive: true });

console.log(`Merged ${docsDist} -> ${targetDocsDir}`);
