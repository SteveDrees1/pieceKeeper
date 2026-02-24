# Piece Keeper

**Track. Value. Trade.**

A modern LEGO collection manager: inventory, catalog, optional pricing, and marketplace later. Start as a personal collection tool and scale when you need it.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [UI/UX & design](#uiux--design)
- [Documentation](#documentation)
- [License](#license)

---

## Features

- **Dashboard** — Collection totals, recent activity, quick actions (Search catalog, Add item, Import).
- **Catalog** — Search sets, parts, and minifigs via [Rebrickable](https://rebrickable.com/api/v3/docs/). Click a result to open a detail preview modal. Pagination (first / prev / next / last) and type filters (Sets, Parts, Minifigs).
- **My Collection** — Owned items, quantities, condition, locations; Add Item / Import / Export (modals; API wiring planned).
- **Lists** — Wanted list, trade pile, build queue (placeholder).
- **Responsive** — Mobile-first layout, sticky header and footer, scrollable content area, touch-friendly controls.
- **Accessible** — Semantic HTML, focus-visible states, ARIA, loading indicators for navigation and modals.

---

## Tech stack

| Layer           | Choice                                                                 |
|----------------|-------------------------------------------------------------------------|
| Framework      | [Nuxt 3](https://nuxt.com) (Vue 3)                                     |
| Styling        | [Tailwind CSS](https://tailwindcss.com) via `@nuxtjs/tailwindcss`      |
| Language       | TypeScript (strict)                                                     |
| Package manager| pnpm (workspace)                                                        |
| Catalog data   | [Rebrickable API](https://rebrickable.com/api/v3/docs/) (server proxy) |
| Data (planned) | PostgreSQL, Redis                                                      |
| Search (planned)| Meilisearch                                                            |
| Storage (optional) | MinIO                                                              |

---

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** — Enable with `corepack enable` then `corepack prepare pnpm@latest --activate`
- **Docker** & **Docker Compose** (optional; for Postgres, Redis, Meilisearch, MinIO)

---

## Quick start

**1. Clone and install**

```bash
git clone <repo-url>
cd pieceKeeper
pnpm install
```

**2. Environment**

```bash
cp .env.example .env
```

For **catalog search** (sets, parts, minifigs), add a Rebrickable API key to `.env`:

```bash
REBRICKABLE_API_KEY=your_key_here
```

Get a key at [Rebrickable API v3](https://rebrickable.com/api/v3/docs/). Without it, catalog search will show a setup message.

**3. Start services (optional)**

```bash
docker-compose up -d
pnpm health
```

**4. Run the app**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The web app runs without Docker; use Docker for Postgres, Redis, Meilisearch, and MinIO when you wire them up.

---

## Scripts

| Command          | Description                    |
|------------------|--------------------------------|
| `pnpm dev`       | Start Nuxt dev server          |
| `pnpm build`     | Production build               |
| `pnpm preview`   | Preview production build       |
| `pnpm lint`      | Run ESLint                     |
| `pnpm typecheck` | TypeScript check (no emit)     |
| `pnpm health`    | Check Postgres, Redis, Meilisearch, MinIO |
| `pnpm docker:up` | Start stack with Docker Compose |
| `pnpm docker:down` | Stop stack                  |
| `pnpm docker:logs` | Follow container logs        |

---

## Project structure

```
pieceKeeper/
├── apps/
│   └── web/                    # Nuxt 3 app
│       ├── assets/css/         # Global styles, design tokens, scrollbar
│       ├── components/        # LogoMark, AppModal, CatalogPreviewModal, etc.
│       ├── composables/       # useActionModals, useCatalogSearch
│       ├── pages/             # File-based routes
│       ├── server/api/catalog/# Rebrickable proxy (sets, parts, minifigs)
│       ├── app.vue            # Root layout (sticky header/main/footer)
│       ├── nuxt.config.ts
│       └── tailwind.config.ts
├── docs/                       # Architecture, IA, design system, infra, reference
├── scripts/
│   └── healthcheck.mjs        # Service health checks
├── docker-compose.yml         # Postgres, Redis, Meilisearch, MinIO
├── package.json               # Workspace root scripts
└── pnpm-workspace.yaml
```

---

## UI/UX & design

The app uses a **futuristic data-center** theme: dark blues, electric blue accents, and a subtle grid background.

- **Typography** — Space Grotesk (headings), Inter (body).
- **Colors** — Deep blue-black background (`#0c1423`), slate surfaces, electric blue (`#60a5fa`) for links, focus, and glow.
- **Components** — Reusable primitives in `assets/css/main.css` (e.g. `pk-container`, `pk-card`, `pk-btn`, `pk-spinner`). Modals (Add Item, Import, Export, Catalog preview) use `AppModal`.
- **Layout** — Sticky header and footer; only main content scrolls. Catalog results list scrolls inside its panel.
- **Loading** — Spinner on route change and inside the catalog preview modal while data loads.
- **Scrollbars** — Themed to match (dark track, accent thumb).

No extra UI framework; Tailwind plus custom tokens and components only.

---

## Documentation

- [Architecture overview](docs/architecture/overview.md)
- [Information architecture](docs/ui-ux/ia.md)
- [Design system](docs/ui-ux/design-system.md)
- [Local development & infra](docs/infra/local-dev.md)
- [Rebrickable API reference](docs/reference/rebrickable-api.md)
- [ADRs](docs/adr/) — Architecture decision records

---

## License

See [LICENSE](LICENSE).
