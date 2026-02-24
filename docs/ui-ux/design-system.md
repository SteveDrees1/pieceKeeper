# Design System — Futuristic data center

Dark, high-tech theme with electric blue accents and grid structure. Implemented in `apps/web/assets/css/main.css` and `apps/web/tailwind.config.ts`; no extra UI framework.

## Typography

| Role | Font | Usage |
|------|------|--------|
| Headings / display | Space Grotesk (500, 600, 700) | Page titles, section labels, stat values |
| Body | Inter (400, 500, 600) | Copy, labels, nav, buttons |

Loaded via Google Fonts in `nuxt.config.ts`.

## Colors (CSS variables)

Defined in `:root` in `main.css` as RGB triplets (for alpha support). Dark palette with electric blue glow:

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | #0c1423 | Page background (deep blue-black) |
| `--surface` | #1e293b | Cards, panels, header/footer |
| `--surface-elevated` | #334155 | Inputs, hover surfaces |
| `--text` | #f8fafc | Primary text |
| `--muted` | #94a3b8 | Secondary text, labels |
| `--border` | #334155 | Borders, dividers |
| `--brand-primary` | #3b82f6 | Primary actions, CTA |
| `--brand-primary-hover` | #60a5fa | Primary hover |
| `--brand-accent` | #60a5fa | Links, focus, nav active, glow |
| `--brand-highlight` | #38bdf8 | Highlights |
| `--glow` | #60a5fa | Glow shadows (box-shadow) |
| `--warning` | #f59e0b | Warning alerts, setup hints |
| `--error` | #ef4444 | Error text, error toasts |
| `--success` | #22c55e | Success toasts |

## Layout

- **Container** — `.pk-container`: full width, responsive horizontal padding (`px-4 sm:px-6 md:px-8`). No max-width.
- **Safe area** — `.safe-area-pad-x`, `.safe-area-pad-r` for notched devices (use `env(safe-area-inset-*)`).

## Component primitives (CSS classes)

Defined in `main.css`; use Tailwind for spacing and layout alongside these.

| Class | Purpose |
|-------|--------|
| `.pk-container` | Full-width wrapper with responsive padding |
| `.pk-card` | Card: surface bg, border, rounded-xl, soft shadow |
| `.pk-card-pad` | Card inner padding (p-4 sm:p-5) |
| `.pk-panel` | Elevated card (stronger shadow) |
| `.pk-panel-accent` | Left border accent (brand-accent) |
| `.pk-h1` | Page title (display font, text-xl sm:text-2xl, semibold) |
| `.pk-subtle` | Muted secondary text (text-sm) |
| `.pk-stat-value` | Large stat number (display font, tabular-nums) |
| `.pk-stat-label` | Stat label (uppercase, tracking, muted) |
| `.pk-input` | Text input: rounded-lg, border, focus ring (accent) |
| `.pk-btn` | Secondary button: border, surface, hover/focus |
| `.pk-btn-primary` | Primary button: brand-primary, white text |
| `.pk-btn-ghost` | Ghost button: text only, hover bg |
| `.pk-chip` | Pill: rounded-full, border, surface, muted text |
| `.pk-nav-pill` | Nav link: rounded-lg, hover/active states |
| `.pk-nav-pill-mobile` | Larger tap target for mobile nav |
| `.pk-logo-bg` | Logo gradient + glow (brand-primary/accent) |
| `.pk-spinner` | Spinning loader (border ring, accent top); used for route and modal loading |
| `.pk-alert-warning` | Warning callout (border/background from `--warning`) |
| `.pk-alert-error` | Error message text (uses `--error`) |

## Shadows and radius

- **Radius** — Buttons/inputs: 12px (`rounded-lg`). Cards/panels: 16px (`rounded-xl`).
- **Shadows** — `shadow-soft`, `shadow-card`, `shadow-elevated` in Tailwind config; used on cards, header, modals.

## Scrollbars

- Themed in `main.css`: thin scrollbar, dark track (`--bg`), thumb (`--surface-elevated`), hover/active use `--brand-accent`. Applied globally via `*` and `*::-webkit-scrollbar*`.
- **Radius** — Scrollbar track and thumb use 4px rounded corners.

## Responsiveness and accessibility

- **Breakpoints** — Tailwind default (sm 640px, md 768px, lg 1024px, …).
- **Header** — Nav and actions inline on md+; hamburger + slide-out menu on smaller.
- **Touch** — Buttons/inputs min-height 44px; nav items in drawer use `.pk-nav-pill-mobile`.
- **Background** — Subtle grid (line) on body using `--glow` for a data-panel feel.
- **Reduced motion** — `prefers-reduced-motion: reduce` supported globally; animations and transitions are minimized when the user prefers reduced motion.
- **Tables** — Use `<th scope="col">` for column headers.
- **Semantic alerts** — `.pk-alert-warning`, `.pk-alert-error` for setup and error messages using design tokens.

## Vue components (app-specific)

| Component | Role |
|-----------|------|
| `LogoMark` | In-app logo (gradient + glow; no external icon lib) |
| `AppModal` | Accessible modal (Teleport, focus, Escape, overlay). Optional `size="lg"` for wider dialogs. |
| `AppTooltip` | Optional hover/focus tooltip (delay, placement) |
| `CatalogPreviewModal` | Catalog item detail: type badge, image, ID/name, data grid; shows `.pk-spinner` while loading. |
| `AddItemModalContent` | Add Item modal body |
| `ImportModalContent` | Import modal body |
| `ExportModalContent` | Export modal body |

## Cursor and tooltips

- **Cursor** — `cursor: pointer` on `a`, `button`, `[role="button"]`, `.pk-btn*`, `.pk-nav-pill`, and relevant inputs (submit/button/reset).
- **Tooltips** — Native `title` on all clickable elements; use `AppTooltip` when a custom hover/focus tooltip is needed.
