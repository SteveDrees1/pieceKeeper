# Piece Keeper — Documentation

Documentation for the Piece Keeper app: architecture, UI/UX, infra, and decisions.

## Contents

| Section | Description |
|--------|-------------|
| [**architecture/**](architecture/) | System design, tech stack, and high-level boundaries |
| [**ui-ux/**](ui-ux/) | Information architecture, flows, and design system |
| [**infra/**](infra/) | Local development, Docker, and deployment |
| [**reference/**](reference/) | External APIs (e.g. Rebrickable) and integration notes |
| [**adr/**](adr/) | Architecture Decision Records (ADR) |

## Quick links

- [Architecture overview](architecture/overview.md) — Goals, MVP, services
- [Information architecture](ui-ux/ia.md) — Navigation, flows, screens
- [Design system](ui-ux/design-system.md) — Theme, components, responsiveness
- [Local dev](infra/local-dev.md) — Stack, env, healthcheck
- [Rebrickable API](reference/rebrickable-api.md) — Catalog data (sets, parts, minifigs) for future updates

## Conventions

- **ADR** — Use `docs/adr/0000-template.md` for new decisions; number sequentially (0001, 0002, …).
- **Docs** — Prefer short, scannable sections and tables; link to code or config where relevant.
