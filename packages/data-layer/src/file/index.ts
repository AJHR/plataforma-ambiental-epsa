// Implementación en ARCHIVOS (activa en Etapa I).
// SCAFFOLDING: las firmas existen y typechequean; la lógica (lectura/escritura
// atómica de JSON en DATA_DIR, validación, versionado de PDF) se implementa en WS1.
// Por ahora cada método lanza NotImplementedError para no fingir comportamiento.

import { NotImplementedError } from "../errors.js";
import type {
  Repositories,
  MonitoringRepository,
  DocumentRepository,
  ContentRepository,
  CaseRepository,
  NewsletterRepository,
  UserRepository,
  AuditRepository,
} from "../repositories/index.js";

const ni = (what: string): never => {
  throw new NotImplementedError(`file:${what}`);
};

const monitoring: MonitoringRepository = {
  listComponents: async () => ni("monitoring.listComponents"),
  getSeries: async () => ni("monitoring.getSeries"),
  publishDataset: async () => ni("monitoring.publishDataset"),
  listDatasets: async () => ni("monitoring.listDatasets"),
};

const documents: DocumentRepository = {
  list: async () => ni("documents.list"),
  getById: async () => ni("documents.getById"),
  save: async () => ni("documents.save"),
  readBytes: async () => ni("documents.readBytes"),
  publish: async () => ni("documents.publish"),
  remove: async () => ni("documents.remove"),
};

const content: ContentRepository = {
  get: async () => ni("content.get"),
  set: async () => ni("content.set"),
  publish: async () => ni("content.publish"),
};

const cases: CaseRepository = {
  create: async () => ni("cases.create"),
  getByNumber: async () => ni("cases.getByNumber"),
  updateStatus: async () => ni("cases.updateStatus"),
  list: async () => ni("cases.list"),
};

const newsletter: NewsletterRepository = {
  subscribe: async () => ni("newsletter.subscribe"),
  unsubscribe: async () => ni("newsletter.unsubscribe"),
  listSubscribers: async () => ni("newsletter.listSubscribers"),
  listBulletins: async () => ni("newsletter.listBulletins"),
};

const users: UserRepository = {
  findByEmail: async () => ni("users.findByEmail"),
  verifyCredentials: async () => ni("users.verifyCredentials"),
};

const audit: AuditRepository = {
  log: async () => ni("audit.log"),
};

export function makeFileRepositories(): Repositories {
  return { monitoring, documents, content, cases, newsletter, users, audit };
}
