# Changelog

All notable changes to Piece Keeper are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Brick & Blueprint theme** — Design system with Space Grotesk / Inter, CSS variables (brand, bg, surface, text, muted, border), and shared primitives (`pk-container`, `pk-card`, `pk-btn`, `pk-input`, `pk-chip`, etc.).
- **LogoMark** — In-app logo component (no external icon lib).
- **Sticky footer** — Full-width footer with copyright, Privacy/Terms links, and social icons (Twitter, GitHub, Instagram); responsive layout and touch targets.
- **Responsive layout** — Mobile-first with collapsible nav drawer, responsive spacing and typography, safe-area padding for notched devices, 44px minimum touch targets.
- **Dashboard** — Stat cards (Sets, Parts, Minifigs, Est. value), Recent activity panel, Quick actions (Search catalog, Add item, Import from file).
- **Modals** — Add Item, Import, and Export modals with accessible `AppModal` (focus, Escape, overlay close) and placeholder content.
- **Tooltips** — `title` on all clickable elements (nav, buttons, links, social, footer); optional `AppTooltip` component for custom hover/focus tooltips.
- **Cursor** — `cursor: pointer` on all interactive elements (links, buttons, nav pills, `.pk-btn*`) via global CSS.
- **Compatibility** — `compatibilityDate` in Nuxt config; Vue pinned to 3.4.10 via pnpm override to avoid hydration/nextSibling issues.
- **README** — Project overview, tech stack, quick start, scripts, structure, UI/UX notes, and doc links.

### Changed

- **Container** — `.pk-container` uses full viewport width with responsive padding (`px-4 sm:px-6 md:px-8`); removed `max-w-6xl` for fully responsive content.
- **SSR** — Disabled (`ssr: false`) to prevent Vue 3.4.x hydration errors; app runs as SPA.
- **DevTools** — Nuxt DevTools disabled in config.
- **Pages** — Index, Catalog, Collection, and Lists refactored to use theme primitives; removed redundant scoped styles.
- **Header** — Sticky header with LogoMark, tagline (“Track. Value. Trade.”), nav pills, and action buttons; mobile menu opens same Add Item / Import modals.

### Fixed

- Vue 3.4.x `nextSibling` / hydration issues mitigated via Vue 3.4.10 override and SPA mode.
- Tailwind custom colors in `main.css` use CSS variables directly in component classes to avoid build-time `@apply` issues.

### Removed

- Inline and duplicate scoped CSS from app and pages in favor of shared theme primitives.
- Max-width constraint on main content container.

---

## [0.1.0] — Initial

- Nuxt 3 app shell with Tailwind via `@nuxtjs/tailwindcss`.
- Pages: Dashboard (index), Catalog, Collection, Lists.
- Docker Compose: Postgres, Redis, Meilisearch, MinIO.
- Healthcheck script for local services.
- Monorepo with pnpm workspace (`apps/web`).

[Unreleased]: https://github.com/your-org/pieceKeeper/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/pieceKeeper/releases/tag/v0.1.0
