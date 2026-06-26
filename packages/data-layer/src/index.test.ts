import { describe, expect, it } from "vitest";
import { makeRepositories, NotImplementedError } from "./index.js";

// Suite de CONTRATO: garantiza que ambas implementaciones (file y postgres)
// exponen exactamente la misma forma de repositorios. En WS1 se amplía para
// validar comportamiento real de la implementación en archivos.

const REPO_KEYS = ["monitoring", "documents", "content", "cases", "newsletter", "users", "audit"] as const;

describe("data-layer factory", () => {
  it("file driver expone todos los repositorios", () => {
    const repos = makeRepositories("file");
    for (const k of REPO_KEYS) expect(repos[k]).toBeDefined();
  });

  it("postgres driver expone todos los repositorios (stub)", () => {
    const repos = makeRepositories("postgres");
    for (const k of REPO_KEYS) expect(repos[k]).toBeDefined();
  });

  it("los métodos aún no implementados fallan de forma explícita (no silenciosa)", async () => {
    const repos = makeRepositories("file");
    await expect(repos.monitoring.listComponents()).rejects.toBeInstanceOf(NotImplementedError);
  });
});
