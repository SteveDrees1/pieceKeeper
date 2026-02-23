# Architecture Overview

## Goal

A LEGO collection manager that can evolve into pricing and marketplace features without rewrites. **Tagline:** Track. Value. Trade.

## MVP boundaries

- **Catalog** — Rebrickable-backed: list/detail proxy in Nuxt server API (`/api/catalog/sets`, `parts`, `minifigs` and `/:id`). Search UI and preview modal in place. Meilisearch later for full-text when needed.
- **User collection** — CRUD for owned items, quantities, condition, locations (API to be added).
- **Import** — Pipeline (e.g. CSV): upload → map → preview → commit (to be implemented).
- **Search** — Catalog search via Rebrickable; fast full-text via Meilisearch when wired.

## Tech stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Nuxt 3 (Vue 3), TypeScript (strict), Tailwind CSS via `@nuxtjs/tailwindcss` |
| **Rendering** | SPA (`ssr: false`) — avoids Vue 3.4.x hydration issues; Vue pinned to 3.4.10 via pnpm override |
| **Styles** | Custom design system in `apps/web/assets/css/main.css`; no extra UI framework |
| **Package manager** | pnpm (workspace root; app in `apps/web`) |
| **Data** | PostgreSQL 16 |
| **Cache / jobs** | Redis 7 |
| **Search** | Meilisearch |
| **Object storage** | MinIO (optional) |

## Services (local)

Started with Docker Compose from repo root:

| Service | Port(s) | Purpose |
|---------|--------|--------|
| Postgres | 5432 | Primary data |
| Redis | 6379 | Cache / queues |
| Meilisearch | 7700 | Search API |
| MinIO | 9000, 9001 | S3-compatible storage + console |

Health check: `pnpm health` (see [Local dev](../infra/local-dev.md)).

## Project structure

```
pieceKeeper/
├── apps/web/              # Nuxt 3 app
│   ├── assets/css/        # Global styles, design tokens, scrollbar, .pk-spinner
│   ├── components/        # LogoMark, AppModal, CatalogPreviewModal, modal contents
│   ├── composables/       # useActionModals, useCatalogSearch
│   ├── pages/             # File-based routes (index, catalog, collection, lists)
│   ├── server/api/catalog/# Rebrickable proxy (sets, parts, minifigs list + detail)
│   ├── app.vue            # Root layout (sticky header, scrollable main, sticky footer)
│   ├── nuxt.config.ts
│   └── tailwind.config.ts
├── docs/                  # This documentation
├── scripts/               # healthcheck.mjs
├── docker-compose.yml     # Postgres, Redis, Meilisearch, MinIO
├── package.json           # Workspace root; pnpm scripts
└── pnpm-workspace.yaml
```

## Out of scope (for now)

- Server-side API (backend to be added)
- Auth
- Marketplace
- Pricing integrations
