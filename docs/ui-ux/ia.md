# Information Architecture

## Top-level navigation

| Route | Label | Purpose |
|-------|--------|---------|
| `/` | Dashboard | Overview: stat cards, recent activity, quick actions |
| `/catalog` | Catalog | Search sets, parts, minifigs (Meilisearch; UI ready) |
| `/collection` | My Collection | Owned items, quantities, condition, locations; Add / Import / Export |
| `/lists` | Lists | Wanted list, trade pile, build queue (future) |
| — | Marketplace | Planned; not in nav yet |

Nav is in the header (desktop) and in a slide-out menu on mobile.

## Global actions

- **Add Item** — Opens Add Item modal; from modal user can go to Catalog to search. (Full flow: search → select → qty/condition/location → save — to be wired to API.)
- **Import** — Opens Import modal (upload/map/preview/commit flow — to be implemented).
- **Export** — Opens Export modal (export collection — to be implemented).

Actions appear in the header and in the dashboard Quick actions; Collection page has its own Add Item / Import / Export buttons. All use shared modal state (`useActionModals`).

## Core flows (target)

- **Add item:** Search (Catalog) → Select set/part → Qty, condition, location → Save.
- **Import:** Choose source → Upload file → Map columns → Preview → Commit.
- **Item detail:** Overview | My notes | Inventory (sets) | Pricing (optional) | Activity — (screens not built yet).

## Footer

- Copyright and app name.
- Links: Privacy (`/privacy`), Terms (`/terms`) — pages to be added.
- Social: Twitter, GitHub, Instagram (placeholder URLs).

## Accessibility and UX

- All clickable elements have a `title` tooltip; optional `AppTooltip` for custom tooltips.
- Interactive elements use `cursor: pointer`.
- Modals are accessible (focus, Escape, overlay click to close).
- Responsive layout with 44px minimum touch targets and safe-area padding.
