# Local Development

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** — Enable with Corepack: `corepack enable` then `corepack prepare pnpm@latest --activate`
- **Docker** and **Docker Compose** (for Postgres, Redis, Meilisearch, MinIO)

## Repository setup

```bash
git clone <repo-url>
cd pieceKeeper
pnpm install
cp .env.example .env
# Edit .env if you need to change defaults
```

## Running the app

The web app runs without Docker:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app is a SPA; backend services are optional until you wire API calls.

## Backend services (optional)

Start the stack with Docker Compose (use `docker-compose`, with a hyphen, if your setup doesn’t have the Compose V2 plugin):

```bash
docker compose up -d
# or: docker-compose up -d
```

| Service | Port(s) | Purpose |
|---------|--------|--------|
| Postgres | 5432 | Database |
| Redis | 6379 | Cache / queues |
| Meilisearch | 7700 | Search API |
| MinIO | 9000 (API), 9001 (console) | S3-compatible storage |

Data is persisted in `./infra/data/<service>` (created on first run). Ensure Docker is running (e.g. Colima: `colima start`).

## Health check

From the repo root:

```bash
pnpm health
```

Runs `scripts/healthcheck.mjs`: checks Postgres (TCP 5432), Redis (6379), Meilisearch (HTTP :7700/health), MinIO (HTTP :9000/minio/health/live). Output is OK/FAIL per service; exit code 0 only if all pass.

## Environment

Key variables (see `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | Piece Keeper | App title |
| `APP_URL` | http://localhost:3000 | Base URL |
| `REBRICKABLE_API_KEY` | — | **Required for catalog.** Rebrickable API key for sets/parts/minifigs. Get one at [Rebrickable API v3](https://rebrickable.com/api/v3/docs/). Loaded from repo root `.env` or `apps/web/.env`. |
| `POSTGRES_*`, `DATABASE_URL` | — | Postgres connection |
| `REDIS_URL` | redis://localhost:6379 | Redis |
| `MEILI_HOST` | http://localhost:7700 | Meilisearch |
| `MEILI_MASTER_KEY` | local_master_key_change_me | Meilisearch key |
| `MINIO_*` | — | MinIO (optional) |

## Scripts (repo root)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Nuxt dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | ESLint (apps/web) |
| `pnpm typecheck` | TypeScript check (apps/web) |
| `pnpm health` | Check backend services |
| `pnpm docker:up` | Start Docker Compose stack |
| `pnpm docker:down` | Stop stack |
| `pnpm docker:logs` | Follow container logs |

## Notes

- **Vue** — Pinned to 3.4.10 via pnpm override in root `package.json` to avoid hydration/nextSibling issues.
- **SSR** — Disabled (`ssr: false` in Nuxt config); app is client-rendered only.
- **Catalog** — Without `REBRICKABLE_API_KEY`, the catalog page shows a message to add the key; list/detail API calls return 502 until configured.
