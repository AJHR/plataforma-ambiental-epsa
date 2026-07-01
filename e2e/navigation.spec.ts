import { test, expect } from "@playwright/test";
import type { Page, Locator } from "@playwright/test";

/**
 * Devuelve el contenedor de navegación visible: en móvil abre el menú
 * hamburguesa y devuelve el panel; en desktop devuelve la barra.
 */
async function openNav(page: Page): Promise<Locator> {
  const hamburger = page.getByRole("button", { name: /abrir menú/i });
  if (await hamburger.isVisible()) {
    await hamburger.click();
    return page.locator("#mobile-menu");
  }
  return page.getByRole("navigation", { name: /navegación principal/i });
}

/**
 * Smoke de navegación: cada página pública carga (HTTP < 400), muestra un
 * encabezado visible y no lanza errores JS no capturados. Detecta páginas o
 * imports rotos antes que los flujos.
 */

const ROUTES = [
  "/",
  "/el-proyecto",
  "/seguimiento",
  "/compromisos",
  "/participa",
  "/participa/estado",
  "/aprende",
  "/boletines",
  "/documentos",
  "/admin",
] as const;

for (const route of ROUTES) {
  test(`carga sin errores: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(res, `sin respuesta para ${route}`).not.toBeNull();
    expect(res!.status(), `status de ${route}`).toBeLessThan(400);

    // Un encabezado h1 visible confirma que la página renderizó contenido.
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();

    expect(errors, `errores JS en ${route}`).toEqual([]);
  });
}

test.describe("Navbar — accesos directos", () => {
  test("la barra superior enlaza a las funciones principales", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = await openNav(page);

    for (const label of [
      "El Proyecto",
      "Seguimiento",
      "Compromisos",
      "Aprende",
      "Boletines",
      "Documentos",
      "Contacto",
    ]) {
      await expect(
        nav.getByRole("link", { name: label, exact: true })
      ).toBeVisible();
    }
  });

  test("el CTA Contacto de la barra navega a /participa", async ({ page }) => {
    await page.goto("/");
    const nav = await openNav(page);
    await nav.getByRole("link", { name: "Contacto", exact: true }).click();
    await expect(page).toHaveURL(/\/participa$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("Seguimiento desde la barra abre la página de monitoreo", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = await openNav(page);
    await nav.getByRole("link", { name: "Seguimiento", exact: true }).click();
    await expect(page).toHaveURL(/\/seguimiento$/);
    await expect(
      page.getByRole("tab", { name: /calidad del aire/i })
    ).toBeVisible();
  });
});
