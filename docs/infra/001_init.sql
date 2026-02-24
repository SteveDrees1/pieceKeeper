-- infra/sql/001_init.sql
-- Piece Keeper: MVP schema (collection manager + catalog + imports + pricing snapshots)

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- Enums
DO $$ BEGIN
  CREATE TYPE item_type AS ENUM ('set', 'part', 'minifig');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE item_condition AS ENUM (
    'new_sealed',
    'new_opened',
    'used_good',
    'used_fair',
    'used_poor',
    'unknown'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE list_kind AS ENUM ('wanted', 'trade', 'build');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE import_source AS ENUM ('rebrickable_csv', 'bricklink_xml', 'bricklink_csv', 'manual');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Updated-at trigger helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         citext UNIQUE NOT NULL,
  display_name  text,
  created_at    timestamptz NOT NULL DEFAULT NOW(),
  updated_at    timestamptz NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Catalog: Sets (Rebrickable set_num like '10276-1')
CREATE TABLE IF NOT EXISTS catalog_sets (
  set_num        text PRIMARY KEY,
  name           text NOT NULL,
  year           integer,
  theme          text,
  num_parts      integer,
  image_url      text,
  last_synced_at timestamptz,
  created_at     timestamptz NOT NULL DEFAULT NOW(),
  updated_at     timestamptz NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_catalog_sets_updated_at ON catalog_sets;
CREATE TRIGGER trg_catalog_sets_updated_at
BEFORE UPDATE ON catalog_sets
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_catalog_sets_name ON catalog_sets USING gin (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_catalog_sets_theme_year ON catalog_sets(theme, year);

-- Catalog: Parts (Rebrickable part_num like '3001')
CREATE TABLE IF NOT EXISTS catalog_parts (
  part_num       text PRIMARY KEY,
  name           text NOT NULL,
  category       text,
  image_url      text,
  last_synced_at timestamptz,
  created_at     timestamptz NOT NULL DEFAULT NOW(),
  updated_at     timestamptz NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_catalog_parts_updated_at ON catalog_parts;
CREATE TRIGGER trg_catalog_parts_updated_at
BEFORE UPDATE ON catalog_parts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_catalog_parts_name ON catalog_parts USING gin (to_tsvector('english', name));

-- Catalog: Minifigs (Rebrickable fig_num like 'sw0001')
CREATE TABLE IF NOT EXISTS catalog_minifigs (
  fig_num        text PRIMARY KEY,
  name           text NOT NULL,
  num_parts      integer,
  image_url      text,
  last_synced_at timestamptz,
  created_at     timestamptz NOT NULL DEFAULT NOW(),
  updated_at     timestamptz NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_catalog_minifigs_updated_at ON catalog_minifigs;
CREATE TRIGGER trg_catalog_minifigs_updated_at
BEFORE UPDATE ON catalog_minifigs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_catalog_minifigs_name ON catalog_minifigs USING gin (to_tsvector('english', name));

-- User collection items
CREATE TABLE IF NOT EXISTS collection_items (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type    item_type NOT NULL,
  item_id      text NOT NULL, -- references set_num/part_num/fig_num (enforced in app)
  qty          integer NOT NULL DEFAULT 1 CHECK (qty >= 0),
  condition    item_condition NOT NULL DEFAULT 'unknown',
  location     text,          -- bin/shelf/etc
  notes        text,
  acquired_at  date,
  created_at   timestamptz NOT NULL DEFAULT NOW(),
  updated_at   timestamptz NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_collection_items_updated_at ON collection_items;
CREATE TRIGGER trg_collection_items_updated_at
BEFORE UPDATE ON collection_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_collection_user_item ON collection_items(user_id, item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_collection_user_location ON collection_items(user_id, location);
CREATE INDEX IF NOT EXISTS idx_collection_user_condition ON collection_items(user_id, condition);

-- Lists (wanted/trade/build)
CREATE TABLE IF NOT EXISTS lists (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  kind        list_kind NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  updated_at  timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)
);

DROP TRIGGER IF EXISTS trg_lists_updated_at ON lists;
CREATE TRIGGER trg_lists_updated_at
BEFORE UPDATE ON lists
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS list_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id     uuid NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  item_type   item_type NOT NULL,
  item_id     text NOT NULL,
  target_qty  integer NOT NULL DEFAULT 1 CHECK (target_qty > 0),
  max_price   numeric(12,2),
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (list_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS idx_list_items_lookup ON list_items(list_id, item_type, item_id);

-- Imports (track runs + errors)
CREATE TABLE IF NOT EXISTS imports (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source      import_source NOT NULL,
  filename    text,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  stats       jsonb NOT NULL DEFAULT '{}'::jsonb,
  error       text,
  created_at  timestamptz NOT NULL DEFAULT NOW(),
  finished_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_imports_user_created ON imports(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS import_rows (
  id         bigserial PRIMARY KEY,
  import_id  uuid NOT NULL REFERENCES imports(id) ON DELETE CASCADE,
  row_num    integer NOT NULL,
  raw        jsonb NOT NULL DEFAULT '{}'::jsonb,
  error      text,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_import_rows_import_rownum ON import_rows(import_id, row_num);

-- Price sources + snapshots (optional now, useful soon)
CREATE TABLE IF NOT EXISTS price_sources (
  id    smallserial PRIMARY KEY,
  code  text NOT NULL UNIQUE,  -- e.g. 'bricklink', 'rebrickable_est', 'manual'
  name  text NOT NULL,
  note  text
);

CREATE TABLE IF NOT EXISTS price_snapshots (
  id          bigserial PRIMARY KEY,
  source_id   smallint NOT NULL REFERENCES price_sources(id) ON DELETE RESTRICT,
  item_type   item_type NOT NULL,
  item_id     text NOT NULL,
  currency    char(3) NOT NULL DEFAULT 'USD',
  price       numeric(12,2) NOT NULL CHECK (price >= 0),
  qty         integer CHECK (qty IS NULL OR qty >= 0),
  captured_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_snapshots_item ON price_snapshots(item_type, item_id, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_snapshots_source_time ON price_snapshots(source_id, captured_at DESC);

-- Seed one default price source so the table isn't empty
INSERT INTO price_sources(code, name, note)
VALUES ('manual', 'Manual', 'User-entered values')
ON CONFLICT (code) DO NOTHING;

COMMIT;