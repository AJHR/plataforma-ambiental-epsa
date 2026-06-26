-- Esquema PostgreSQL de referencia para la migración futura (Etapa II+).
-- NO se usa en Etapa I (persistencia en archivos). Se incluye para que la
-- migración sea directa: el esquema genérico absorbe las 89 medidas, no solo las 8.

CREATE TABLE IF NOT EXISTS components (
  code        TEXT PRIMARY KEY,            -- ej. SMC-CCA-2
  component   TEXT NOT NULL,               -- ej. Calidad del aire
  frequency   TEXT NOT NULL CHECK (frequency IN ('mensual','estacional','semestral','unica'))
);

CREATE TABLE IF NOT EXISTS stations (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  lat         DOUBLE PRECISION,
  lng         DOUBLE PRECISION,
  area        TEXT                          -- portuaria | vialidad | canteras | general
);

CREATE TABLE IF NOT EXISTS datasets (
  id            TEXT PRIMARY KEY,
  component_code TEXT NOT NULL REFERENCES components(code),
  version       INT  NOT NULL DEFAULT 1,
  status        TEXT NOT NULL DEFAULT 'borrador' CHECK (status IN ('borrador','publicado')),
  source        TEXT,
  uploaded_by   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS measurements (
  id            BIGSERIAL PRIMARY KEY,
  dataset_id    TEXT NOT NULL REFERENCES datasets(id),
  component_code TEXT NOT NULL REFERENCES components(code),
  station_id    TEXT REFERENCES stations(id),
  parameter     TEXT NOT NULL,              -- MP10, MP2.5, dB, ...
  measured_at   DATE NOT NULL,
  value         DOUBLE PRECISION NOT NULL,
  unit          TEXT NOT NULL,
  threshold     DOUBLE PRECISION,
  status        TEXT CHECK (status IN ('ok','warn','bad'))
);
CREATE INDEX IF NOT EXISTS idx_measurements_comp_date ON measurements (component_code, measured_at);

CREATE TABLE IF NOT EXISTS documents (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  component_code TEXT REFERENCES components(code),
  category      TEXT,
  file_name     TEXT NOT NULL,
  size_bytes    BIGINT NOT NULL,
  version       INT NOT NULL DEFAULT 1,
  status        TEXT NOT NULL DEFAULT 'borrador' CHECK (status IN ('borrador','publicado')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cases (
  case_number   TEXT PRIMARY KEY,           -- EPSA-2026-0042
  category      TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('ingresado','acuse','evaluacion','resuelto')),
  assignee      TEXT,
  payload       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS case_events (
  id            BIGSERIAL PRIMARY KEY,
  case_number   TEXT NOT NULL REFERENCES cases(case_number),
  status        TEXT NOT NULL,
  actor         TEXT NOT NULL,
  at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscribers (
  email         TEXT PRIMARY KEY,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bulletins (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  body          JSONB,
  published_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS users (
  email         TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('editor','admin'))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id            BIGSERIAL PRIMARY KEY,
  actor         TEXT NOT NULL,
  action        TEXT NOT NULL,
  target        TEXT NOT NULL,
  at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
