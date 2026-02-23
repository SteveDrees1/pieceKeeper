# Rebrickable API Reference

Use this doc for future catalog and LEGO data features. Official source of truth:

- **Docs:** https://rebrickable.com/api/v3/docs/
- **OpenAPI/Swagger:** https://rebrickable.com/api/v3/swagger/?format=openapi
- **Auth:** Every request needs `key` (query) or `Authorization: key YOUR_KEY` (header). Get a key from the docs page.
- **Rate limits:** ~1 req/sec; 429 = throttled. Use list params (`page`, `page_size`, `search`) and avoid per-item calls when possible.

## LEGO catalog endpoints we use

Base URL: `https://rebrickable.com/api/v3/lego`

| Resource   | List (search)              | Detail (single item)        |
|-----------|----------------------------|-----------------------------|
| **Sets**  | `GET /sets/?search=&page=&page_size=` | `GET /sets/{set_num}/`      |
| **Parts** | `GET /parts/?search=&page=&page_size=` | `GET /parts/{part_num}/`    |
| **Minifigs** | `GET /minifigs/?search=&page=&page_size=` | `GET /minifigs/{set_num}/` |

Detail responses return full object (name, image URLs, year, num_parts, theme_id, etc.). List responses have `results`, `count`, `next`, `previous`.

## Our proxy (server API)

- Env: `REBRICKABLE_API_KEY` (loaded from repo root or `apps/web/.env`).
- List: `GET /api/catalog/sets`, `/api/catalog/parts`, `/api/catalog/minifigs` — query: `search`, `page`, `page_size`.
- Detail: `GET /api/catalog/sets/:set_num`, `/api/catalog/parts/:part_num`, `/api/catalog/minifigs/:set_num` — single item JSON.

Errors: 502 = key not configured; 429 = rate limited.
