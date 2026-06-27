import { test, expect } from "@playwright/test";

/**
 * Flujos de usuario de punta a punta: ejercitan UI + API juntos para detectar
 * flujos rotos (envíos, login, navegación entre vistas).
 */

test.describe("Flujo MIAQR — enviar consulta y seguir su estado", () => {
  test("crea un caso y lo consulta por su número", async ({ page }) => {
    await page.goto("/participa");
    await page.getByLabel(/categoría/i).selectOption({ index: 1 });
    await page
      .getByLabel(/mensaje|descripción/i)
      .fill("Consulta E2E para seguimiento de estado.");
    await page.getByLabel(/consentimiento|acepto/i).check();
    await page.getByRole("button", { name: /enviar/i }).click();

    const numberEl = page.getByText(/EPSA-\d{4}-\d{4}/).first();
    await expect(numberEl).toBeVisible();
    const caseNumber = (await numberEl.innerText()).trim();

    // Consultar el estado del caso recién creado.
    await page.goto("/participa/estado");
    await page.getByLabel(/número de caso/i).fill(caseNumber);
    await page.getByRole("button", { name: /consultar/i }).click();

    // Que el número del caso aparezca en la vista de estado confirma que el
    // lookup contra /api/cases/{n} tuvo éxito.
    await expect(page.getByText(caseNumber)).toBeVisible();
  });
});

test.describe("Flujo Admin — login y back-office", () => {
  test("acceso directo a /admin/dashboard sin sesión redirige al login", async ({
    page,
  }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByLabel(/correo|email/i)).toBeVisible();
  });

  test("login válido entra al panel de gestión", async ({ page }) => {
    await page.goto("/admin");
    await page.getByLabel(/correo|email/i).fill("admin@epsa.cl");
    await page.getByLabel(/contraseña|password/i).fill("admin123");
    await page.getByRole("button", { name: /ingresar/i }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard$/);
    await expect(page.getByText(/panel de gestión/i)).toBeVisible();
  });

  test("login inválido muestra error y no redirige", async ({ page }) => {
    await page.goto("/admin");
    await page.getByLabel(/correo|email/i).fill("admin@epsa.cl");
    await page.getByLabel(/contraseña|password/i).fill("incorrecta");
    await page.getByRole("button", { name: /ingresar/i }).click();

    // Mensaje de error de credenciales (apuntado por texto: el role=alert también
    // lo usa el route-announcer oculto de Next, que rompería el modo estricto).
    await expect(
      page.getByText(/credenciales inválidas|incorrect|inválid/i)
    ).toBeVisible();
    await expect(page).toHaveURL(/\/admin$/);
  });
});

test.describe("Flujo Seguimiento — cambiar de componente", () => {
  test("al cambiar de pestaña se actualizan gráfico y semáforo", async ({
    page,
  }) => {
    await page.goto("/seguimiento");
    await expect(page.locator("[data-testid='chart']").first()).toBeVisible();

    await page.getByRole("tab", { name: /calidad hídrica/i }).click();
    await expect(
      page.getByRole("tab", { name: /calidad hídrica/i })
    ).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("[data-testid='chart']").first()).toBeVisible();
    await expect(
      page.locator("[data-testid='status-badge']").first()
    ).toBeVisible();
  });
});

test.describe("Flujo Documentos — previsualizar y descargar", () => {
  test("previsualiza un PDF y ofrece descarga", async ({ page }) => {
    await page.goto("/documentos");
    const card = page.locator("[data-testid='file-card']").first();
    await expect(card).toBeVisible();

    // El enlace de descarga apunta al endpoint correcto.
    const download = card.getByRole("link", { name: /descargar/i });
    await expect(download).toHaveAttribute("href", /\/api\/documents\/.+\/download/);

    await card.getByRole("button", { name: /previsualizar|ver/i }).click();
    await expect(page.locator("[data-testid='pdf-preview']")).toBeVisible();
  });
});

test.describe("Flujo Boletines — suscripción", () => {
  test("suscribirse confirma el registro", async ({ page }) => {
    await page.goto("/boletines");
    await page.getByLabel(/correo electrónico/i).first().fill("vecino@example.cl");
    await page.getByRole("button", { name: /suscribirme/i }).click();
    await expect(page.getByText(/suscripción confirmada/i)).toBeVisible();
  });
});
