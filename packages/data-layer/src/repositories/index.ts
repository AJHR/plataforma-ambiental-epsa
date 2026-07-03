// Contratos (interfaces) del conector de datos.
// REGLA DE ORO: ninguna app importa `fs` ni `pg` directamente. Todo pasa por aquí.
// Estas interfaces son la "fuente de verdad" del acceso a datos y NO cambian al
// migrar de archivos a PostgreSQL: solo cambia la implementación.

// --- Tipos de soporte (placeholders; los DTO formales viven en @repo/types) ---
export type ISODate = string;

export interface ComponentSummary {
  code: string; // ej. "SMC-CCA-2"
  component: string; // ej. "Calidad del aire"
  frequency: "mensual" | "estacional" | "semestral" | "unica";
  lastCampaign: ISODate | null;
}

export interface SeriesQuery {
  from?: ISODate;
  to?: ISODate;
  station?: string;
  parameter?: string;
}

export interface MonitoringSeries {
  componentCode: string;
  points: Array<{
    station: string;
    parameter: string;
    date: ISODate;
    value: number;
    unit: string;
    threshold?: number;
    status?: "ok" | "warn" | "bad";
  }>;
}

export interface DatasetInput {
  componentCode: string;
  rows: unknown[]; // validado con Zod antes de llegar aquí
  source: string; // archivo Excel/CSV de origen
  uploadedBy: string;
}

export interface DatasetResult {
  datasetId: string;
  accepted: number;
  rejected: number;
  errors: string[];
}

export interface DatasetMeta {
  datasetId: string;
  componentCode: string;
  createdAt: ISODate;
  version: number;
  status: "borrador" | "publicado";
}

// --- Repositorios ---

export interface MonitoringRepository {
  listComponents(): Promise<ComponentSummary[]>;
  getSeries(componentCode: string, params: SeriesQuery): Promise<MonitoringSeries>;
  publishDataset(input: DatasetInput): Promise<DatasetResult>;
  listDatasets(componentCode: string): Promise<DatasetMeta[]>;
}

export interface DocumentMeta {
  id: string;
  title: string;
  description?: string;
  componentCode?: string;
  category?: string;
  fileName: string;
  sizeBytes: number;
  version: number;
  status: "borrador" | "publicado";
  createdAt: ISODate;
}

export interface DocumentRepository {
  list(filter?: { componentCode?: string; status?: DocumentMeta["status"] }): Promise<DocumentMeta[]>;
  getById(id: string): Promise<DocumentMeta | null>;
  /** Guarda el binario del PDF y devuelve sus metadatos (sube versión si ya existe). */
  save(meta: Omit<DocumentMeta, "id" | "version" | "createdAt">, bytes: Uint8Array): Promise<DocumentMeta>;
  /** Stream/bytes para previsualizar o descargar. */
  readBytes(id: string): Promise<Uint8Array>;
  publish(id: string): Promise<DocumentMeta>;
  remove(id: string): Promise<void>;
}

export interface ContentRepository {
  get(key: string): Promise<unknown | null>; // home, proyecto, faq, glosario, educativo...
  set(key: string, value: unknown, editor: string): Promise<void>;
  publish(key: string): Promise<void>;
}

export type CaseCategory =
  | "impactos-ambientales-sociales"
  | "navegacion"
  | "gestion-vial-san-juan"
  | "pueblos-indigenas"
  | "reasentamiento"
  | "trabajo-condiciones-laborales"
  | "otros";

export interface CaseRecord {
  caseNumber: string; // ej. "EPSA-2026-0042"
  category: CaseCategory;
  status: "ingresado" | "acuse" | "evaluacion" | "resuelto";
  createdAt: ISODate;
  assignee?: string;
}

export interface CaseRepository {
  create(input: { category: CaseCategory; payload: unknown }): Promise<CaseRecord>;
  getByNumber(caseNumber: string): Promise<CaseRecord | null>;
  updateStatus(caseNumber: string, status: CaseRecord["status"], actor: string): Promise<CaseRecord>;
  list(filter?: { category?: CaseCategory; status?: CaseRecord["status"] }): Promise<CaseRecord[]>;
}

export interface NewsletterRepository {
  subscribe(email: string): Promise<void>;
  unsubscribe(email: string): Promise<void>;
  listSubscribers(): Promise<string[]>;
  listBulletins(): Promise<Array<{ id: string; title: string; publishedAt: ISODate | null }>>;
}

export interface UserRepository {
  findByEmail(email: string): Promise<{ email: string; role: "editor" | "admin" } | null>;
  verifyCredentials(email: string, password: string): Promise<boolean>;
}

export interface AuditRepository {
  log(event: { actor: string; action: string; target: string; at?: ISODate }): Promise<void>;
}

export interface Repositories {
  monitoring: MonitoringRepository;
  documents: DocumentRepository;
  content: ContentRepository;
  cases: CaseRepository;
  newsletter: NewsletterRepository;
  users: UserRepository;
  audit: AuditRepository;
}
