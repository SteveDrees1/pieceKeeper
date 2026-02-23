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

- [Architecture overview](architecture/overview.md) — Goals, MVP, services, structure
- [Information architecture](ui-ux/ia.md) — Navigation, flows, layout, accessibility
- [Design system](ui-ux/design-system.md) — Futuristic theme, components, scrollbars, responsiveness
- [Local dev](infra/local-dev.md) — Stack, env (including `REBRICKABLE_API_KEY`), healthcheck
- [Rebrickable API](reference/rebrickable-api.md) — Catalog proxy endpoints and usage

For release history, see the root [CHANGELOG.md](../CHANGELOG.md).

## Conventions

- **ADR** — Use `docs/adr/0000-template.md` for new decisions; number sequentially (0001, 0002, …).
- **Docs** — Prefer short, scannable sections and tables; link to code or config where relevant.
