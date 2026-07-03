// Factory del conector de datos.
// Elige la implementación según la variable de entorno DATA_DRIVER:
//   - "file"     → persistencia en archivos (ACTIVA en Etapa I)
//   - "postgres" → PostgreSQL (STUB, listo para el futuro)
//
// Cambiar de archivos a Postgres en el futuro = setear DATA_DRIVER=postgres.
// NINGÚN otro archivo de la app debe cambiar.

import type { Repositories } from "./repositories/index.js";
import { makeFileRepositories } from "./file/index.js";
import { makePostgresRepositories } from "./postgres/index.js";

export * from "./repositories/index.js";
export * from "./errors.js";

export type DataDriver = "file" | "postgres";

export function makeRepositories(driver: DataDriver = (process.env.DATA_DRIVER as DataDriver) ?? "file"): Repositories {
  switch (driver) {
    case "postgres":
      return makePostgresRepositories();
    case "file":
    default:
      return makeFileRepositories();
  }
}
