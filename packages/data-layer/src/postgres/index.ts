// Implementación PostgreSQL (STUB para el futuro).
// Las mismas firmas que la implementación en archivos. Cuando se decida tener BD:
//   1) provisionar Postgres, correr schema.sql + migraciones
//   2) implementar estos métodos con `pg`
//   3) setear DATA_DRIVER=postgres
// El resto de la app NO cambia.

import { NotImplementedError } from "../errors.js";
import type { Repositories } from "../repositories/index.js";

const ni = (what: string): never => {
  throw new NotImplementedError(`postgres:${what} (migración a BD pendiente)`);
};

export function makePostgresRepositories(): Repositories {
  const stub = new Proxy(
    {},
    {
      get(_t, prop) {
        return async () => ni(String(prop));
      },
    },
  );
  return {
    monitoring: stub as Repositories["monitoring"],
    documents: stub as Repositories["documents"],
    content: stub as Repositories["content"],
    cases: stub as Repositories["cases"],
    newsletter: stub as Repositories["newsletter"],
    users: stub as Repositories["users"],
    audit: stub as Repositories["audit"],
  };
}
