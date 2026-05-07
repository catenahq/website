# apps/website -- catena.run
#
# Multi-stage build: Astro static build (with chained Starlight docs
# at /docs) -> nginx:alpine serving dist/.
#
# Build context is the repo root (not apps/website) because the
# chain script also builds apps/docs and the prebuild scripts read
# tools/brand/ via ../../tools/sync-brand.mjs. Dokploy compose sets
# `build: { context: ., dockerfile: apps/website/Dockerfile }`.

# ---- Stage 1: build ----
FROM node:22-alpine AS build
WORKDIR /repo

# Install per-app deps first so source changes don't invalidate the
# install cache. Each app has its own package-lock.json (no workspaces).
COPY apps/website/package.json apps/website/package-lock.json* apps/website/
COPY apps/docs/package.json apps/docs/package-lock.json* apps/docs/

RUN cd apps/website && npm ci --no-audit --no-fund
RUN cd apps/docs    && npm ci --no-audit --no-fund

# Copy source. Brand sync target dirs are gitignored; the prebuild
# step inside `npm run build` populates them from tools/brand/.
COPY apps/website apps/website
COPY apps/docs apps/docs
COPY tools tools

WORKDIR /repo/apps/website
RUN npm run build

# ---- Stage 2: serve ----
FROM nginx:alpine AS serve
COPY apps/website/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/website/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1/ || exit 1

EXPOSE 80
