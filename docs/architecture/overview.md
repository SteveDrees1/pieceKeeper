# Architecture Overview

## Goal
A LEGO collection manager that can evolve into pricing + marketplace without rewrites.

## MVP boundaries
- Catalog ingestion (Rebrickable-backed)
- User collection CRUD
- Import pipeline (CSV)
- Fast search (Meilisearch)

## Services (local)
- Web: Nuxt 3
- Data: Postgres
- Cache/Jobs: Redis
- Search: Meilisearch
- Object storage (optional): MinIO
