#!/usr/bin/env bash
set -euo pipefail

# Piece Keeper bootstrap (monorepo + Nuxt web + docker data stack + docs)
# Usage:
#   ./cursor-bootstrap.sh
#   ./cursor-bootstrap.sh --install
#   FORCE=1 ./cursor-bootstrap.sh --install

PROJECT_SLUG="${PROJECT_SLUG:-piece-keeper}"
FORCE="${FORCE:-0}"
DO_INSTALL="0"

if [[ "${1:-}" == "--install" ]]; then
  DO_INSTALL="1"
fi

say() { printf "%s\n" "$*"; }

require_cmd() { command -v "$1" >/dev/null 2>&1; }

ensure_dir() { mkdir -p "$1"; }

write_file() {
  local path="$1"
  if [[ -f "$path" && "$FORCE" != "1" ]]; then
    say "skip  $path (exists)"
    cat >/dev/null
    return 0
  fi
  ensure_dir "$(dirname "$path")"
  cat > "$path"
  say "write $path"
}

say "==> Bootstrapping $PROJECT_SLUG"

# ----------------------------
# Folders
# ----------------------------
ensure_dir "apps/web/pages"
ensure_dir "apps/api"
ensure_dir "packages/ui"
ensure_dir "packages/shared"
ensure_dir "docs/adr"
ensure_dir "docs/ui-ux"
ensure_dir "docs/architecture"
ensure_dir "docs/infra"
ensure_dir "infra/data"
ensure_dir "scripts"

# ----------------------------
# Git init
# ----------------------------
if [[ ! -d ".git" ]]; then
  if require_cmd git; then
    git init -q
    say "init  git"
  else
    say "warn  git not found; skipping git init"
  fi
fi

# ----------------------------
# Root config files
# ----------------------------
write_file ".editorconfig" <<'EOF'
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
EOF

write_file ".gitignore" <<'EOF'
# Node / JS
node_modules/
.pnpm-store/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Nuxt
.nuxt/
.output/
dist/
.nitro/
.cache/

# Env
.env
.env.*
!.env.example

# OS / IDE
.DS_Store
Thumbs.db
.idea/
.vscode/

# Docker data
infra/data/
EOF

write_file ".npmrc" <<'EOF'
engine-strict=true
fund=false
audit=false
EOF

write_file "pnpm-workspace.yaml" <<'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF

write_file "package.json" <<EOF
{
  "name": "$PROJECT_SLUG",
  "private": true,
  "packageManager": "pnpm@9.15.4",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "pnpm -C apps/web dev",
    "build": "pnpm -C apps/web build",
    "preview": "pnpm -C apps/web preview",
    "lint": "pnpm -C apps/web lint",
    "typecheck": "pnpm -C apps/web typecheck",
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down",
    "docker:logs": "docker compose logs -f --tail=200",
    "health": "node ./scripts/healthcheck.mjs"
  }
}
EOF

write_file ".env.example" <<'EOF'
# App
APP_NAME="Piece Keeper"
APP_ENV="local"
APP_URL="http://localhost:3000"

# Postgres
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_DB="piece_keeper"
POSTGRES_USER="piece_keeper"
POSTGRES_PASSWORD="piece_keeper_local"
DATABASE_URL="postgresql://piece_keeper:piece_keeper_local@localhost:5432/piece_keeper?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Meilisearch
MEILI_HOST="http://localhost:7700"
MEILI_MASTER_KEY="local_master_key_change_me"

# MinIO (optional)
MINIO_ENDPOINT="http://localhost:9000"
MINIO_ROOT_USER="minio"
MINIO_ROOT_PASSWORD="minio_password_change_me"
MINIO_BUCKET="piece-keeper"
EOF

# ----------------------------
# Docker compose stack
# ----------------------------
write_file "docker-compose.yml" <<'EOF'
services:
  postgres:
    image: postgres:16
    container_name: pk-postgres
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-piece_keeper}
      POSTGRES_USER: ${POSTGRES_USER:-piece_keeper}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-piece_keeper_local}
    ports:
      - "5432:5432"
    volumes:
      - ./infra/data/postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-piece_keeper} -d ${POSTGRES_DB:-piece_keeper}"]
      interval: 5s
      timeout: 5s
      retries: 20

  redis:
    image: redis:7
    container_name: pk-redis
    ports:
      - "6379:6379"
    volumes:
      - ./infra/data/redis:/data
    command: ["redis-server", "--appendonly", "yes"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 20

  meilisearch:
    image: getmeili/meilisearch:v1.8
    container_name: pk-meili
    environment:
      MEILI_MASTER_KEY: ${MEILI_MASTER_KEY:-local_master_key_change_me}
      MEILI_NO_ANALYTICS: "true"
    ports:
      - "7700:7700"
    volumes:
      - ./infra/data/meili:/meili_data
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:7700/health | grep -q available"]
      interval: 5s
      timeout: 5s
      retries: 20

  minio:
    image: minio/minio:latest
    container_name: pk-minio
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minio}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minio_password_change_me}
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - ./infra/data/minio:/data
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:9000/minio/health/live > /dev/null 2>&1"]
      interval: 5s
      timeout: 5s
      retries: 20
EOF

# ----------------------------
# Scripts
# ----------------------------
write_file "scripts/healthcheck.mjs" <<'EOF'
const endpoints = [
  { name: "Postgres", type: "tcp", port: 5432 },
  { name: "Redis", type: "tcp", port: 6379 },
  { name: "Meilisearch", type: "http", url: "http://localhost:7700/health" },
  { name: "MinIO", type: "http", url: "http://localhost:9000/minio/health/live" },
];

const net = await import("node:net");

async function checkTcp(name, port) {
  return new Promise((resolve) => {
    const s = net.createConnection({ host: "localhost", port }, () => {
      s.end(); resolve({ name, ok: true });
    });
    s.on("error", () => resolve({ name, ok: false }));
    s.setTimeout(1500, () => { s.destroy(); resolve({ name, ok: false }); });
  });
}

async function checkHttp(name, url) {
  try {
    const res = await fetch(url, { method: "GET" });
    return { name, ok: res.ok };
  } catch {
    return { name, ok: false };
  }
}

const results = [];
for (const e of endpoints) {
  if (e.type === "tcp") results.push(await checkTcp(e.name, e.port));
  else results.push(await checkHttp(e.name, e.url));
}

const pad = (s, n) => (s + " ".repeat(n)).slice(0, n);
for (const r of results) console.log(`${pad(r.name, 12)} ${r.ok ? "OK" : "FAIL"}`);
process.exit(results.every(r => r.ok) ? 0 : 1);
EOF

# ----------------------------
# Nuxt web app skeleton
# ----------------------------
write_file "apps/web/package.json" <<'EOF'
{
  "name": "@pk/web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "lint": "eslint .",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "nuxt": "^3.12.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.30",
    "eslint": "^9.8.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-vue": "^9.26.0",
    "prettier": "^3.3.3",
    "typescript": "^5.5.4"
  }
}
EOF

write_file "apps/web/nuxt.config.ts" <<'EOF'
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: { strict: true },
  app: {
    head: {
      title: "Piece Keeper",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "LEGO collection inventory, pricing, and marketplace." }
      ]
    }
  },
  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME || "Piece Keeper",
      meiliHost: process.env.MEILI_HOST || "http://localhost:7700"
    }
  }
});
EOF

write_file "apps/web/app.vue" <<'EOF'
<template>
  <div class="min-h-screen">
    <header class="border-b">
      <div class="wrap">
        <div class="brand">{{ appName }}</div>
        <nav class="nav">
          <NuxtLink to="/">Dashboard</NuxtLink>
          <NuxtLink to="/catalog">Catalog</NuxtLink>
          <NuxtLink to="/collection">My Collection</NuxtLink>
          <NuxtLink to="/lists">Lists</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="wrap main">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const appName = useRuntimeConfig().public.appName;
</script>

<style>
.wrap { max-width: 72rem; margin: 0 auto; padding: 1rem; display: flex; align-items: center; justify-content: space-between; }
.main { display: block; padding-top: 2rem; }
.brand { font-weight: 600; }
.nav { font-size: 0.875rem; display: flex; gap: 1rem; }
a { text-decoration: none; color: inherit; }
a.router-link-active { font-weight: 600; }
.border-b { border-bottom: 1px solid rgba(0,0,0,0.1); }
</style>
EOF

write_file "apps/web/pages/index.vue" <<'EOF'
<template>
  <section class="stack">
    <h1 class="h1">Dashboard</h1>
    <p class="muted">Collection totals, recent adds, alerts. Keep it fast.</p>
  </section>
</template>

<style scoped>
.stack > * + * { margin-top: 0.5rem; }
.h1 { font-size: 1.5rem; line-height: 2rem; font-weight: 600; }
.muted { font-size: 0.875rem; opacity: 0.8; }
</style>
EOF

write_file "apps/web/pages/catalog.vue" <<'EOF'
<template>
  <section class="stack">
    <h1 class="h1">Catalog</h1>
    <p class="muted">Search sets, parts, and minifigs (Meilisearch later).</p>

    <div class="stack-sm">
      <label class="label">Search</label>
      <input class="input" placeholder="Try: 10276, 'Millennium Falcon', 'minifig'" />
    </div>

    <div class="grid">
      <div class="card">
        <div class="title">Results</div>
        <div class="muted">Hook this to the search API.</div>
      </div>
      <div class="card">
        <div class="title">Filters</div>
        <div class="muted">Theme, year, type, etc.</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stack > * + * { margin-top: 0.75rem; }
.stack-sm > * + * { margin-top: 0.5rem; }
.h1 { font-size: 1.5rem; line-height: 2rem; font-weight: 600; }
.label { font-size: 0.875rem; font-weight: 600; }
.muted { font-size: 0.875rem; opacity: 0.8; }
.input { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid rgba(0,0,0,0.15); border-radius: 0.75rem; }
.grid { display: grid; gap: 1rem; grid-template-columns: 2fr 1fr; }
.card { border: 1px solid rgba(0,0,0,0.12); border-radius: 1rem; padding: 1rem; }
.title { font-weight: 600; margin-bottom: 0.25rem; }
</style>
EOF

write_file "apps/web/pages/collection.vue" <<'EOF'
<template>
  <section class="stack">
    <h1 class="h1">My Collection</h1>
    <p class="muted">Owned items, quantities, condition, locations, notes.</p>

    <div class="card">
      <div class="row">
        <button class="btn primary">Add Item</button>
        <button class="btn">Import</button>
        <button class="btn">Export</button>
      </div>
      <div class="muted mt">Wire this to Postgres once the API exists.</div>
    </div>
  </section>
</template>

<style scoped>
.stack > * + * { margin-top: 0.75rem; }
.h1 { font-size: 1.5rem; line-height: 2rem; font-weight: 600; }
.muted { font-size: 0.875rem; opacity: 0.8; }
.card { border: 1px solid rgba(0,0,0,0.12); border-radius: 1rem; padding: 1rem; }
.row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.btn { border: 1px solid rgba(0,0,0,0.15); padding: 0.55rem 0.75rem; border-radius: 0.75rem; background: white; }
.primary { border-color: rgba(0,0,0,0.35); font-weight: 600; }
.mt { margin-top: 0.75rem; }
</style>
EOF

write_file "apps/web/pages/lists.vue" <<'EOF'
<template>
  <section class="stack">
    <h1 class="h1">Lists</h1>
    <p class="muted">Wanted list, trade pile, build queue.</p>

    <div class="card">
      <div class="title">No lists yet</div>
      <div class="muted">Create: Wanted, Trade, Build</div>
    </div>
  </section>
</template>

<style scoped>
.stack > * + * { margin-top: 0.75rem; }
.h1 { font-size: 1.5rem; line-height: 2rem; font-weight: 600; }
.muted { font-size: 0.875rem; opacity: 0.8; }
.card { border: 1px solid rgba(0,0,0,0.12); border-radius: 1rem; padding: 1rem; }
.title { font-weight: 600; margin-bottom: 0.25rem; }
</style>
EOF

write_file "apps/web/tsconfig.json" <<'EOF'
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true
  }
}
EOF

write_file "apps/web/eslint.config.mjs" <<'EOF'
import vue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";

export default [
  ...vue.configs["flat/recommended"],
  prettier,
  {
    rules: {
      "vue/multi-word-component-names": "off"
    }
  }
];
EOF

# ----------------------------
# Docs
# ----------------------------
write_file "docs/README.md" <<'EOF'
# Docs

- `architecture/` High-level system design
- `ui-ux/` UX flows, IA, component rules
- `infra/` Proxmox + docker + deployment notes
- `adr/` Architecture Decision Records
EOF

write_file "docs/architecture/overview.md" <<'EOF'
# Architecture Overview

## Goal
A LEGO collection manager that can evolve into pricing + marketplace without rewrites.

## MVP boundaries
- Catalog ingestion (Rebrickable-backed)
- User collection CRUD
- Import pipeline (CSV)
- Fast search (Meilisearch)

## Services (local)
- Web: Nuxt 3
- Data: Postgres
- Cache/Jobs: Redis
- Search: Meilisearch
- Object storage (optional): MinIO
EOF

write_file "docs/ui-ux/ia.md" <<'EOF'
# Information Architecture

## Top nav
- Dashboard
- Catalog
- My Collection
- Lists
- Marketplace (later)

## Core flows
- Add item: Search → Select → Qty/Condition/Location → Save
- Import: Source → Upload → Map → Preview → Commit
- Detail: Overview | My Notes | Inventory (sets) | Pricing (optional) | Activity
EOF

write_file "docs/infra/local-dev.md" <<'EOF'
# Local Dev

## Stack
`docker compose up -d` starts:
- Postgres :5432
- Redis :6379
- Meilisearch :7700
- MinIO :9000 (+ console :9001)

## Health
`pnpm health`
EOF

write_file "docs/adr/0000-template.md" <<'EOF'
# ADR-0000: Title

## Status
Proposed | Accepted | Deprecated

## Context
What problem are we solving?

## Decision
What did we choose?

## Consequences
Tradeoffs, risks, follow-ups
EOF

# ----------------------------
# README
# ----------------------------
write_file "README.md" <<'EOF'
# Piece Keeper

LEGO inventory + catalog + pricing (optional) + marketplace (later). Start as a personal collection manager. Scale when needed.

## Requirements
- Node 20+
- pnpm (via Corepack)
- Docker + Docker Compose

## Setup
1) Copy env:
```bash
cp .env.example .env