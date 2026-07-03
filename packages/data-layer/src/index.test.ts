import { describe, expect, it } from "vitest";
import { makeRepositories } from "./index.js";

// Suite de CONTRATO: garantiza que ambas implementaciones (file y postgres)
// exponen exactamente la misma forma de repositorios.

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

  it("file driver: listComponents retorna array (vacío si no hay datos)", async () => {
    const repos = makeRepositories("file");
    const result = await repos.monitoring.listComponents();
    expect(Array.isArray(result)).toBe(true);
  });
});
