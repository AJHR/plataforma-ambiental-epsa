import { expect, test } from "@playwright/test";

/**
 * RUTINA DE ÉXITO DEL MVP — fuente de verdad ejecutable de docs/SUCCESS_CRITERIA.md.
 *
 * El loop autónomo NO declara el MVP terminado hasta que TODOS estos tests pasen
 * en los dos proyectos (mobile + desktop). El agente debe ir implementando la app
 * hasta que cada `test` quede en verde. Está permitido ampliar/afinar selectores,
 * pero NO eliminar criterios sin dejar registro en docs/SUCCESS_CRITERIA.md.
 *
 * Mientras la app no exista, estos tests fallan (esperado): son la meta, no un mock.
 */

test.describe("Home", () => {
  test("carga con un mensaje claro y accesos a los módulos", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Puerto Exterior|EPSA/i);
    await expect(page.getByRole("link", { name: /el proyecto/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /seguimiento/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /participa/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /aprende/i })).toBeVisible();
  });
});

test.describe("El Proyecto", () => {
  test("muestra el visor de mapa de las 4 áreas", async ({ page }) => {
    await page.goto("/el-proyecto");
    await expect(page.getByRole("heading", { name: /proyecto/i })).toBeVisible();
    await expect(page.locator("[data-testid='map-viewer']")).toBeVisible();
  });
});

test.describe("Seguimiento Ambiental", () => {
  test("lectura simple + gráfico + semáforo por componente", async ({ page }) => {
    await page.goto("/seguimiento");
    await expect(page.getByRole("tab", { name: /calidad del aire/i })).toBeVisible();
    await expect(page.locator("[data-testid='status-badge']").first()).toBeVisible();
    await expect(page.locator("[data-testid='chart']").first()).toBeVisible();
  });
});

test.describe("Participa / MIAQR", () => {
  test("permite enviar un requerimiento y obtener N° de caso", async ({ page }) => {
    await page.goto("/participa");
    await page.getByLabel(/categoría/i).selectOption({ index: 1 });
    await page.getByLabel(/mensaje|descripción/i).fill("Consulta de prueba E2E.");
    await page.getByLabel(/consentimiento|acepto/i).check();
    await page.getByRole("button", { name: /enviar/i }).click();
    await expect(page.getByText(/EPSA-\d{4}-\d+/)).toBeVisible();
  });
});

test.describe("Documentos (PDF)", () => {
  test("se puede previsualizar y descargar un PDF", async ({ page }) => {
    await page.goto("/documentos");
    const first = page.locator("[data-testid='file-card']").first();
    await expect(first).toBeVisible();
    await first.getByRole("button", { name: /previsualizar|ver/i }).click();
    await expect(page.locator("[data-testid='pdf-preview']")).toBeVisible();
  });
});

test.describe("Asistente IA (placeholder)", () => {
  test("el widget NO está activo por defecto (ASSISTANT_ENABLED=false)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-testid='chat-widget']")).toHaveCount(0);
  });
});

test.describe("Admin", () => {
  test("exige login para entrar al back-office", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByLabel(/correo|email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña|password/i)).toBeVisible();
  });
});
