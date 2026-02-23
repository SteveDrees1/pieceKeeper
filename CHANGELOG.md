# Changelog

All notable changes to Piece Keeper are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Rebrickable catalog** — Search sets, parts, and minifigs via Rebrickable API. Server proxy routes: list (`/api/catalog/sets`, `parts`, `minifigs`) and detail (`/api/catalog/sets/:set_num`, etc.). Requires `REBRICKABLE_API_KEY` in `.env`. See [Rebrickable API reference](docs/reference/rebrickable-api.md).
- **Catalog preview modal** — Click a search result to open a detail modal (image, ID, name, type-specific fields). Database-style layout with type badge, accent bar, and data grid. Spinning loader while fetching.
- **Futuristic theme** — Dark “data center” UI: deep blue background, electric blue accents, grid background, glowing borders and buttons. Theme tokens and shadows in `main.css` / `tailwind.config.ts`.
- **Sticky layout** — Header and footer stay fixed; only main content scrolls. Catalog results list scrolls within its panel between header and footer.
- **Route loading indicator** — Spinning loader over main content when navigating (e.g. nav links). Skips initial page load.
- **Modal loading** — Catalog preview modal shows the same spinning loader (`.pk-spinner`) while detail data loads.
- **Pagination** — Catalog uses first / prev / next / last controls with “1 of N” and even spacing (`<<` `<` `1 of 12` `>` `>>`).
- **Scrollbar styling** — Themed scrollbars (dark track, accent thumb, hover state) in `main.css` for consistency with the UI.
- **Design system** — Shared primitives (`pk-container`, `pk-card`, `pk-panel`, `pk-btn`, `pk-input`, `pk-chip`, `pk-spinner`, etc.), LogoMark, AppModal (with optional `size="lg"`), modals for Add Item / Import / Export.
- **Dashboard** — Stat cards (Sets, Parts, Minifigs, Est. value), Recent activity, Quick actions. “Live” chip with accent styling.
- **Responsive layout** — Mobile-first, collapsible nav drawer, 44px touch targets, safe-area padding.
- **Documentation** — Architecture overview, IA, design system, local dev, Rebrickable API reference; doc index in `docs/README.md`.

### Changed

- **Theme** — From Brick & Blueprint (light) to futuristic dark theme (electric blue on dark blue/grey).
- **Container** — Full-width responsive padding; no max-width.
- **SSR** — Disabled (`ssr: false`); app runs as SPA. Vue pinned to 3.4.10 via pnpm override.
- **Catalog** — Real data from Rebrickable; catalog table fits between header and footer with internal scroll.
- **Env** — Repo-root `.env` loaded from Nuxt config (dotenv) so `REBRICKABLE_API_KEY` works when running from `apps/web`.

### Fixed

- Vue 3.4.x hydration/nextSibling issues via SPA mode and Vue 3.4.10 override.
- Tailwind custom colors used via CSS variables in component classes to avoid `@apply` build issues.

---

## [0.1.0] — Initial

- Nuxt 3 app shell with Tailwind via `@nuxtjs/tailwindcss`.
- Pages: Dashboard (index), Catalog, Collection, Lists.
- Docker Compose: Postgres, Redis, Meilisearch, MinIO.
- Healthcheck script for local services.
- Monorepo with pnpm workspace (`apps/web`).

[Unreleased]: https://github.com/your-org/pieceKeeper/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/pieceKeeper/releases/tag/v0.1.0
