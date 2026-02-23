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

- **Dashboard** — Collection totals, recent activity, quick actions
- **Catalog** — Search sets, parts, and minifigs (Meilisearch)
- **My Collection** — Owned items, quantities, condition, locations
- **Lists** — Wanted list, trade pile, build queue
- **Responsive** — Mobile-first layout with touch-friendly controls and adaptive navigation
- **Accessible** — Semantic HTML, focus-visible states, ARIA where needed

---

## Tech stack

| Layer      | Choice                |
| ---------- | --------------------- |
| Framework  | [Nuxt 3](https://nuxt.com) (Vue 3) |
| Styling    | [Tailwind CSS](https://tailwindcss.com) via `@nuxtjs/tailwindcss` |
| Language   | TypeScript (strict)    |
| Package manager | pnpm (workspace) |
| Data       | PostgreSQL, Redis     |
| Search     | Meilisearch           |
| Storage    | MinIO (optional)      |

---

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** (enable with `corepack enable` then `corepack prepare pnpm@latest --activate`)
- **Docker** & **Docker Compose** (for Postgres, Redis, Meilisearch, MinIO)

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
# Edit .env if you need to change defaults
```

**3. Start services (optional)**

```bash
docker compose up -d
pnpm health
```

**4. Run the app**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The web app runs without Docker; use Docker for Postgres, Redis, Meilisearch, and MinIO when you wire them up.

---

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `pnpm dev`     | Start Nuxt dev server          |
| `pnpm build`   | Production build               |
| `pnpm preview` | Preview production build       |
| `pnpm lint`    | Run ESLint                     |
| `pnpm typecheck` | TypeScript check (no emit)   |
| `pnpm health`  | Check Postgres, Redis, Meilisearch, MinIO |
| `pnpm docker:up`   | Start stack with Docker Compose |
| `pnpm docker:down` | Stop stack                    |
| `pnpm docker:logs` | Follow container logs         |

---

## Project structure

```
pieceKeeper/
├── apps/
│   └── web/                 # Nuxt 3 app
│       ├── assets/css/      # Global styles, design tokens
│       ├── components/      # Vue components (e.g. LogoMark)
│       ├── pages/           # File-based routes
│       ├── app.vue          # Root layout (header, main, footer)
│       ├── nuxt.config.ts
│       └── tailwind.config.ts
├── docs/                    # Architecture, ADRs, IA, infra
├── scripts/
│   └── healthcheck.mjs      # Service health checks
├── docker-compose.yml       # Postgres, Redis, Meilisearch, MinIO
├── package.json             # Workspace root scripts
└── pnpm-workspace.yaml
```

---

## UI/UX & design

The app uses a **Brick & Blueprint** theme: a clear, data-focused interface that stays consistent across devices.

- **Typography** — Space Grotesk (headings), Inter (body)
- **Colors** — Brand primary (#C4312E), accent (#2F80ED), neutral bg/surface/text/muted with CSS variables
- **Components** — Reusable primitives (e.g. `pk-container`, `pk-card`, `pk-btn`, `pk-input`) in `assets/css/main.css`
- **Responsive** — Breakpoints for mobile, tablet, desktop; sticky header, collapsible nav drawer on small screens
- **Touch** — 44px minimum tap targets, spacing and typography tuned for readability
- **Focus** — Visible focus rings (e.g. `focus-visible:ring-2`) for keyboard and assistive tech

No extra UI framework; Tailwind + custom tokens and components only.

---

## Documentation

- [Architecture overview](docs/architecture/overview.md)
- [Information architecture](docs/ui-ux/ia.md)
- [Design system](docs/ui-ux/design-system.md)
- [Local development & infra](docs/infra/local-dev.md)
- [ADRs](docs/adr/) — Architecture decision records

---

## License

See [LICENSE](LICENSE).
