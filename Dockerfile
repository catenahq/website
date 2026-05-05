# apps/website -- catena.run
#
# Multi-stage build: Astro static build -> nginx:alpine serving dist/.
# Workspace deps (@catena/brand, @catena/i18n) need the full repo
# context, so build is invoked from the monorepo root via the
# Dokploy "build context" set to the repo root and "Dockerfile path"
# set to apps/website/Dockerfile.

# ---- Stage 1: build ----
FROM node:22-alpine AS build
WORKDIR /repo

# Copy workspace manifests first so Docker caches the install layer.
COPY package.json package-lock.json* ./
COPY apps/website/package.json apps/website/
COPY apps/docs/package.json apps/docs/
COPY packages/brand/package.json packages/brand/
COPY packages/i18n/package.json packages/i18n/

RUN npm install --workspaces --include-workspace-root --no-audit --no-fund

# Copy the actual source. Workspace symlinks already exist from the
# install above. apps/docs is included because the website build
# script chains a Starlight build at base=/docs and merges the dist
# tree -- single deploy serves both surfaces.
COPY apps/website apps/website
COPY apps/docs apps/docs
COPY packages/brand packages/brand
COPY packages/i18n packages/i18n

WORKDIR /repo/apps/website
RUN npm run build

# ---- Stage 2: serve ----
FROM nginx:alpine AS serve
COPY apps/website/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/website/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1/ || exit 1

EXPOSE 80
