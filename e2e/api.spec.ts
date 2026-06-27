import { test, expect } from "@playwright/test";

/**
 * Contrato de los endpoints de la API (nivel request, sin UI). Verifica que
 * ningún endpoint esté roto y que las respuestas tengan la forma esperada.
 * Depende del seed data versionado en data/ (presente en CI y clones nuevos).
 */

test.describe("API · Monitoreo", () => {
  test("GET /api/monitoring/components devuelve los 8 componentes", async ({
    request,
  }) => {
    const res = await request.get("/api/monitoring/components");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThanOrEqual(8);
    expect(json.data[0]).toMatchObject({
      code: expect.any(String),
      label: expect.any(String),
      status: expect.stringMatching(/^(ok|warn|bad)$/),
    });
  });

  test("GET /api/monitoring/aire/series devuelve puntos", async ({
    request,
  }) => {
    const res = await request.get("/api/monitoring/aire/series");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.data.points)).toBe(true);
    expect(json.data.points.length).toBeGreaterThan(0);
    expect(json.data.points[0]).toMatchObject({
      date: expect.any(String),
      value: expect.any(Number),
      unit: expect.any(String),
    });
  });

  test("GET /api/monitoring/{code}/series con código inválido → 400", async ({
    request,
  }) => {
    const res = await request.get("/api/monitoring/..%2Fetc/series");
    expect([400, 404]).toContain(res.status());
  });
});

test.describe("API · Contenido y documentos", () => {
  for (const key of ["educativo", "glosario", "faq"]) {
    test(`GET /api/content/${key} → 200`, async ({ request }) => {
      const res = await request.get(`/api/content/${key}`);
      expect(res.status()).toBe(200);
    });
  }

  test("GET /api/documents?status=publicado devuelve documentos", async ({
    request,
  }) => {
    const res = await request.get("/api/documents?status=publicado");
    expect(res.status()).toBe(200);
    const json = await res.json();
    const list = Array.isArray(json) ? json : json.data;
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  test("GET /api/newsletter/bulletins → 200", async ({ request }) => {
    const res = await request.get("/api/newsletter/bulletins");
    expect(res.status()).toBe(200);
  });
});

test.describe("API · Casos (MIAQR)", () => {
  test("POST válido crea caso y luego se puede consultar", async ({
    request,
  }) => {
    const create = await request.post("/api/cases", {
      data: {
        category: "Navegación",
        message: "Caso de prueba de contrato E2E.",
        consent: true,
      },
    });
    expect(create.status()).toBe(201);
    const { data } = await create.json();
    expect(data.caseNumber).toMatch(/^EPSA-\d{4}-\d{4}$/);

    const lookup = await request.get(`/api/cases/${data.caseNumber}`);
    expect(lookup.status()).toBe(200);
    const found = await lookup.json();
    expect(found.data.caseNumber).toBe(data.caseNumber);
  });

  test("POST sin consentimiento → 400", async ({ request }) => {
    const res = await request.post("/api/cases", {
      data: { category: "Otros", message: "Sin consent", consent: false },
    });
    expect(res.status()).toBe(400);
  });

  test("GET caso inexistente → 404", async ({ request }) => {
    const res = await request.get("/api/cases/EPSA-9999-9999");
    expect(res.status()).toBe(404);
  });
});

test.describe("API · Autenticación admin", () => {
  test("login con credenciales válidas devuelve token", async ({ request }) => {
    const res = await request.post("/api/admin/login", {
      data: { email: "admin@epsa.cl", password: "admin123" },
    });
    expect(res.status()).toBe(200);
    const { data } = await res.json();
    expect(typeof data.token).toBe("string");
    expect(data.token.length).toBeGreaterThan(0);
  });

  test("login con credenciales inválidas → 401", async ({ request }) => {
    const res = await request.post("/api/admin/login", {
      data: { email: "admin@epsa.cl", password: "incorrecta" },
    });
    expect(res.status()).toBe(401);
  });

  test("uploads admin sin token → 401", async ({ request }) => {
    const docs = await request.post("/api/admin/documents/upload", {
      multipart: {
        title: "x",
        file: { name: "x.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") },
      },
    });
    expect(docs.status()).toBe(401);

    const mon = await request.post("/api/admin/monitoreo/upload", {
      multipart: {
        file: {
          name: "s.json",
          mimeType: "application/json",
          buffer: Buffer.from('{"componentCode":"aire","points":[]}'),
        },
      },
    });
    expect(mon.status()).toBe(401);
  });
});
