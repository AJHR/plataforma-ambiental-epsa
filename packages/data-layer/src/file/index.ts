// Implementación en ARCHIVOS (activa en Etapa I).
// Persiste datos en DATA_DIR usando fs/promises + JSON / JSONL.
// Cada repositorio es stateless: lee y escribe el archivo en cada operación
// para simplificar sin caché ni concurrencia compleja en esta etapa.

import fs from "node:fs/promises";
import path from "node:path";
import { NotFoundError, FileStorageError } from "../errors.js";
import type {
  Repositories,
  MonitoringRepository,
  DocumentRepository,
  ContentRepository,
  CaseRepository,
  NewsletterRepository,
  UserRepository,
  AuditRepository,
  ComponentSummary,
  MonitoringSeries,
  SeriesQuery,
  DatasetInput,
  DatasetResult,
  DatasetMeta,
  DocumentMeta,
  CaseRecord,
  CaseCategory,
} from "../repositories/index.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dataDir(): string {
  return process.env.DATA_DIR ?? path.join(process.cwd(), "data");
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as { code?: string }).code === "ENOENT") return fallback;
    throw new FileStorageError(`Error leyendo ${filePath}: ${String(err)}`);
  }
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath));
  const tmp = `${filePath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, filePath);
}

function now(): string {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Monitoring
// ---------------------------------------------------------------------------

interface ComponentsFile {
  components: ComponentSummary[];
}

interface SeriesDataset {
  datasetId: string;
  componentCode: string;
  createdAt: string;
  version: number;
  status: "borrador" | "publicado";
  source: string;
  uploadedBy: string;
  points: MonitoringSeries["points"];
}

interface SeriesFile {
  componentCode: string;
  datasets: SeriesDataset[];
}

function buildMonitoring(): MonitoringRepository {
  const componentsPath = () => path.join(dataDir(), "monitoring", "components.json");
  const seriesPath = (code: string) => path.join(dataDir(), "monitoring", `${code}.json`);

  return {
    async listComponents(): Promise<ComponentSummary[]> {
      const file = await readJson<ComponentsFile>(componentsPath(), { components: [] });
      return file.components;
    },

    async getSeries(componentCode: string, params: SeriesQuery): Promise<MonitoringSeries> {
      const file = await readJson<SeriesFile>(seriesPath(componentCode), {
        componentCode,
        datasets: [],
      });

      const published = file.datasets.filter((d) => d.status === "publicado");
      let points = published.flatMap((d) => d.points);

      if (params.from) {
        const from = params.from;
        points = points.filter((p) => p.date >= from);
      }
      if (params.to) {
        const to = params.to;
        points = points.filter((p) => p.date <= to);
      }
      if (params.station) {
        const station = params.station;
        points = points.filter((p) => p.station === station);
      }
      if (params.parameter) {
        const parameter = params.parameter;
        points = points.filter((p) => p.parameter === parameter);
      }

      return { componentCode, points };
    },

    async publishDataset(input: DatasetInput): Promise<DatasetResult> {
      const { componentCode, rows, source, uploadedBy } = input;
      const filePath = seriesPath(componentCode);

      const file = await readJson<SeriesFile>(filePath, {
        componentCode,
        datasets: [],
      });

      const maxVersion = file.datasets
        .filter((d) => d.componentCode === componentCode)
        .reduce((m, d) => Math.max(m, d.version), 0);

      const datasetId = crypto.randomUUID();
      const createdAt = now();
      const errors: string[] = [];
      const accepted: number[] = [];

      type RawPoint = {
        station?: unknown;
        parameter?: unknown;
        date?: unknown;
        value?: unknown;
        unit?: unknown;
        threshold?: unknown;
        status?: unknown;
      };

      const points: MonitoringSeries["points"] = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] as RawPoint;
        if (
          typeof row.station !== "string" ||
          typeof row.parameter !== "string" ||
          typeof row.date !== "string" ||
          typeof row.value !== "number" ||
          typeof row.unit !== "string"
        ) {
          errors.push(`Fila ${i + 1}: faltan campos requeridos (station, parameter, date, value, unit)`);
          continue;
        }
        const point: MonitoringSeries["points"][number] = {
          station: row.station,
          parameter: row.parameter,
          date: row.date,
          value: row.value,
          unit: row.unit,
        };
        if (typeof row.threshold === "number") point.threshold = row.threshold;
        if (row.status === "ok" || row.status === "warn" || row.status === "bad") {
          point.status = row.status;
        }
        points.push(point);
        accepted.push(i);
      }

      file.datasets.push({
        datasetId,
        componentCode,
        createdAt,
        version: maxVersion + 1,
        status: "publicado",
        source,
        uploadedBy,
        points,
      });

      await ensureDir(path.join(dataDir(), "monitoring"));
      await writeJson(filePath, file);

      // Update component list
      const compFile = await readJson<ComponentsFile>(componentsPath(), { components: [] });
      const existing = compFile.components.find((c) => c.code === componentCode);
      if (!existing) {
        compFile.components.push({
          code: componentCode,
          component: componentCode,
          frequency: "mensual",
          lastCampaign: createdAt,
        });
      } else {
        existing.lastCampaign = createdAt;
      }
      await writeJson(componentsPath(), compFile);

      return {
        datasetId,
        accepted: accepted.length,
        rejected: errors.length,
        errors,
      };
    },

    async listDatasets(componentCode: string): Promise<DatasetMeta[]> {
      const file = await readJson<SeriesFile>(seriesPath(componentCode), {
        componentCode,
        datasets: [],
      });
      return file.datasets.map((d) => ({
        datasetId: d.datasetId,
        componentCode: d.componentCode ?? componentCode,
        createdAt: d.createdAt,
        version: d.version,
        status: d.status,
      }));
    },
  };
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

interface MetaFile {
  documents: DocumentMeta[];
}

function buildDocuments(): DocumentRepository {
  const metaPath = () => path.join(dataDir(), "documents", "meta.json");
  const filesDir = () => path.join(dataDir(), "documents", "files");
  const filePath = (id: string) => path.join(filesDir(), `${id}.pdf`);

  return {
    async list(filter?: { componentCode?: string; status?: DocumentMeta["status"] }): Promise<DocumentMeta[]> {
      const file = await readJson<MetaFile>(metaPath(), { documents: [] });
      let docs = file.documents;
      if (filter?.componentCode !== undefined) {
        const cc = filter.componentCode;
        docs = docs.filter((d) => d.componentCode === cc);
      }
      if (filter?.status !== undefined) {
        const st = filter.status;
        docs = docs.filter((d) => d.status === st);
      }
      return docs;
    },

    async getById(id: string): Promise<DocumentMeta | null> {
      const file = await readJson<MetaFile>(metaPath(), { documents: [] });
      return file.documents.find((d) => d.id === id) ?? null;
    },

    async save(
      meta: Omit<DocumentMeta, "id" | "version" | "createdAt">,
      bytes: Uint8Array,
    ): Promise<DocumentMeta> {
      const file = await readJson<MetaFile>(metaPath(), { documents: [] });
      const id = crypto.randomUUID();
      const createdAt = now();

      const doc: DocumentMeta = {
        ...meta,
        id,
        version: 1,
        createdAt,
      };

      await ensureDir(filesDir());
      await fs.writeFile(filePath(id), bytes);
      file.documents.push(doc);
      await writeJson(metaPath(), file);
      return doc;
    },

    async readBytes(id: string): Promise<Uint8Array> {
      try {
        const buf = await fs.readFile(filePath(id));
        return new Uint8Array(buf);
      } catch (err) {
        if ((err as { code?: string }).code === "ENOENT") {
          throw new NotFoundError(`Documento ${id} no encontrado`);
        }
        throw new FileStorageError(`Error leyendo bytes del documento ${id}: ${String(err)}`);
      }
    },

    async publish(id: string): Promise<DocumentMeta> {
      const file = await readJson<MetaFile>(metaPath(), { documents: [] });
      const idx = file.documents.findIndex((d) => d.id === id);
      if (idx === -1) throw new NotFoundError(`Documento ${id} no encontrado`);
      file.documents[idx].status = "publicado";
      await writeJson(metaPath(), file);
      return file.documents[idx];
    },

    async remove(id: string): Promise<void> {
      const file = await readJson<MetaFile>(metaPath(), { documents: [] });
      const idx = file.documents.findIndex((d) => d.id === id);
      if (idx === -1) throw new NotFoundError(`Documento ${id} no encontrado`);
      file.documents.splice(idx, 1);
      await writeJson(metaPath(), file);
      try {
        await fs.unlink(filePath(id));
      } catch {
        // File may not exist; metadata already removed
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

interface ContentFile {
  value: unknown;
  publishedAt: string | null;
  editor: string;
  updatedAt: string;
}

function buildContent(): ContentRepository {
  const keyPath = (key: string) => path.join(dataDir(), "content", `${key}.json`);

  return {
    async get(key: string): Promise<unknown | null> {
      try {
        const file = await readJson<ContentFile | null>(keyPath(key), null);
        if (file === null) return null;
        return file.value;
      } catch {
        return null;
      }
    },

    async set(key: string, value: unknown, editor: string): Promise<void> {
      const existing = await readJson<ContentFile | null>(keyPath(key), null);
      const updated: ContentFile = {
        value,
        publishedAt: existing?.publishedAt ?? null,
        editor,
        updatedAt: now(),
      };
      await ensureDir(path.join(dataDir(), "content"));
      await writeJson(keyPath(key), updated);
    },

    async publish(key: string): Promise<void> {
      const file = await readJson<ContentFile | null>(keyPath(key), null);
      if (file === null) throw new NotFoundError(`Contenido "${key}" no encontrado`);
      file.publishedAt = now();
      await writeJson(keyPath(key), file);
    },
  };
}

// ---------------------------------------------------------------------------
// Cases
// ---------------------------------------------------------------------------

interface CasesFile {
  counters: Record<number, number>; // year -> last NNNN
  cases: CaseRecord[];
}

function formatCaseNumber(year: number, n: number): string {
  return `EPSA-${year}-${String(n).padStart(4, "0")}`;
}

function buildCases(): CaseRepository {
  const casesPath = () => path.join(dataDir(), "cases", "cases.json");

  return {
    async create(input: { category: CaseCategory; payload: unknown }): Promise<CaseRecord> {
      const file = await readJson<CasesFile>(casesPath(), { counters: {}, cases: [] });
      const year = new Date().getFullYear();
      const next = (file.counters[year] ?? 0) + 1;
      file.counters[year] = next;

      const record: CaseRecord = {
        caseNumber: formatCaseNumber(year, next),
        category: input.category,
        status: "ingresado",
        createdAt: now(),
      };

      // Store payload alongside the case in a sidecar field (not in the typed interface)
      const storedRecord = { ...record, payload: input.payload };
      (file.cases as unknown[]).push(storedRecord);
      await ensureDir(path.join(dataDir(), "cases"));
      await writeJson(casesPath(), file);
      return record;
    },

    async getByNumber(caseNumber: string): Promise<CaseRecord | null> {
      const file = await readJson<CasesFile>(casesPath(), { counters: {}, cases: [] });
      const found = file.cases.find((c) => c.caseNumber === caseNumber);
      return found ?? null;
    },

    async updateStatus(
      caseNumber: string,
      status: CaseRecord["status"],
      _actor: string,
    ): Promise<CaseRecord> {
      const file = await readJson<CasesFile>(casesPath(), { counters: {}, cases: [] });
      const idx = file.cases.findIndex((c) => c.caseNumber === caseNumber);
      if (idx === -1) throw new NotFoundError(`Caso ${caseNumber} no encontrado`);
      file.cases[idx].status = status;
      await writeJson(casesPath(), file);
      return file.cases[idx];
    },

    async list(filter?: { category?: CaseCategory; status?: CaseRecord["status"] }): Promise<CaseRecord[]> {
      const file = await readJson<CasesFile>(casesPath(), { counters: {}, cases: [] });
      let cases = file.cases;
      if (filter?.category !== undefined) {
        const cat = filter.category;
        cases = cases.filter((c) => c.category === cat);
      }
      if (filter?.status !== undefined) {
        const st = filter.status;
        cases = cases.filter((c) => c.status === st);
      }
      return cases;
    },
  };
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

interface SubscribersFile {
  subscribers: string[];
}

interface BulletinsFile {
  bulletins: Array<{ id: string; title: string; publishedAt: string | null }>;
}

function buildNewsletter(): NewsletterRepository {
  const subPath = () => path.join(dataDir(), "newsletter", "subscribers.json");
  const bulPath = () => path.join(dataDir(), "newsletter", "bulletins.json");

  return {
    async subscribe(email: string): Promise<void> {
      const file = await readJson<SubscribersFile>(subPath(), { subscribers: [] });
      if (!file.subscribers.includes(email)) {
        file.subscribers.push(email);
        await ensureDir(path.join(dataDir(), "newsletter"));
        await writeJson(subPath(), file);
      }
    },

    async unsubscribe(email: string): Promise<void> {
      const file = await readJson<SubscribersFile>(subPath(), { subscribers: [] });
      file.subscribers = file.subscribers.filter((e) => e !== email);
      await ensureDir(path.join(dataDir(), "newsletter"));
      await writeJson(subPath(), file);
    },

    async listSubscribers(): Promise<string[]> {
      const file = await readJson<SubscribersFile>(subPath(), { subscribers: [] });
      return file.subscribers;
    },

    async listBulletins(): Promise<Array<{ id: string; title: string; publishedAt: string | null }>> {
      const file = await readJson<BulletinsFile>(bulPath(), { bulletins: [] });
      return file.bulletins;
    },
  };
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

interface UserRecord {
  email: string;
  role: "editor" | "admin";
  passwordHash: string;
}

interface UsersFile {
  users: UserRecord[];
}

// Minimal safe comparison — passwords stored as plain text only in dev/seed.
// Production should use bcrypt; this suffices for file-based MVP.
function buildUsers(): UserRepository {
  const usersPath = () => path.join(dataDir(), "users", "users.json");

  return {
    async findByEmail(email: string): Promise<{ email: string; role: "editor" | "admin" } | null> {
      const file = await readJson<UsersFile>(usersPath(), { users: [] });
      const user = file.users.find((u) => u.email === email);
      if (!user) return null;
      return { email: user.email, role: user.role };
    },

    async verifyCredentials(email: string, password: string): Promise<boolean> {
      const file = await readJson<UsersFile>(usersPath(), { users: [] });
      const user = file.users.find((u) => u.email === email);
      if (!user) return false;
      // Plain-text comparison for MVP; replace with bcrypt in production
      return user.passwordHash === password;
    },
  };
}

// ---------------------------------------------------------------------------
// Audit
// ---------------------------------------------------------------------------

function buildAudit(): AuditRepository {
  const auditPath = () => path.join(dataDir(), "audit", "audit.jsonl");

  return {
    async log(event: { actor: string; action: string; target: string; at?: string }): Promise<void> {
      const entry = JSON.stringify({
        actor: event.actor,
        action: event.action,
        target: event.target,
        at: event.at ?? now(),
      });
      await ensureDir(path.join(dataDir(), "audit"));
      await fs.appendFile(auditPath(), entry + "\n", "utf8");
    },
  };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function makeFileRepositories(): Repositories {
  return {
    monitoring: buildMonitoring(),
    documents: buildDocuments(),
    content: buildContent(),
    cases: buildCases(),
    newsletter: buildNewsletter(),
    users: buildUsers(),
    audit: buildAudit(),
  };
}
