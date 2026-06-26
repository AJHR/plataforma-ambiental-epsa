# Criterios de éxito del MVP (definición de "terminado")

> Esto es lo que el loop autónomo debe lograr. Cada criterio es **verificable**: por test E2E (`e2e/success.spec.ts`), por test unit, o por inspección con Playwright MCP. El MVP NO está terminado hasta que todos pasen en **mobile (390px)** y **desktop (1280px)**.

## Gates técnicos (deben estar verdes)
- [ ] `pnpm install` sin errores; lockfile actualizado.
- [ ] `pnpm lint` sin errores.
- [ ] `pnpm typecheck` sin errores; **cero `any`** sin justificación, cero `@ts-ignore` sin comentario.
- [ ] `pnpm test` (Vitest) verde; cobertura ≥80% en `@repo/data-layer` y servicios.
- [ ] `pnpm build` (web + api) verde.
- [ ] `npx playwright test` 100% verde en los proyectos `mobile` y `desktop`.
- [ ] Auditoría a11y (axe) sin violaciones críticas en Home, Seguimiento, Participa, Documentos.
- [ ] `.env.example` documentado; app levanta con `pnpm dev`.

## Criterios funcionales por módulo
**Home** — un mensaje claro + 4 accesos grandes a módulos; responsive; carga < 3s en móvil simulado.
**El Proyecto** — descripción + visor de mapa interactivo con las 4 áreas (`data-testid="map-viewer"`).
**Seguimiento Ambiental** — tabs por los 8 ítems de Etapa I; por componente: semáforo (`status-badge`) + frase simple + gráfico (`chart`) + "quién mide/fecha" + descarga de informe. Frecuencias correctas (aire mensual, fauna estacional, agua semestral).
**Participa / MIAQR** — formulario con 7 categorías + consentimiento; al enviar genera **N° de caso** `EPSA-AAAA-####`; página de consulta de estado; correo no-reply (mock en MVP, registrado en auditoría); doble canal consulta/emergencia visible.
**Aprende** — ≥5 cápsulas educativas + glosario + FAQ; términos con tooltip.
**Boletines** — suscripción (alta/baja) + listado de boletines + noticias.
**Documentos / RCA** — repositorio con `file-card`; **previsualización embebida** (`pdf-preview`) y **descarga** funcionando; los borradores no son públicos.
**Asistente IA** — widget **placeholder**: con `ASSISTANT_ENABLED=false` el widget NO aparece (`chat-widget` count 0); seam `packages/assistant` intacto, sin RAG.

## Criterios del Admin (autoservicio sin dev)
- [ ] Login con rol (Editor / Administrador); `/admin` exige autenticación.
- [ ] Gestor de monitoreos: subir plantilla Excel/CSV → validación (rechazo con mensaje claro) → previsualizar gráfico+semáforo → publicar.
- [ ] **Gestor de documentos: subir PDF → clasificar/versionar → publicar → aparece en el sitio público para previsualizar y descargar.**
- [ ] Gestor de contenidos: editar textos/FAQ/glosario; flujo borrador → publicado.
- [ ] Bandeja MIAQR: ver casos, asignar, cambiar estado, descargar reporte.
- [ ] Boletines: crear/editar/programar/enviar (envío mock en MVP).
- [ ] Toda acción de admin queda en auditoría (`data/audit`).

## Criterios de arquitectura
- [ ] Ningún `import` de `fs`/`pg` fuera de `@repo/data-layer`.
- [ ] `DATA_DRIVER=file` activo; `DATA_DRIVER=postgres` compila (stub) y pasa la suite de contrato.
- [ ] Errores nombrados (sin catch genérico); logs estructurados en la API.
- [ ] Tokens del design system usados en todos los componentes (sin colores/espacios hardcodeados).

## Criterios UX/UI (verificación con Playwright MCP)
- [ ] Recorrido completo sin errores de consola en mobile y desktop.
- [ ] Contraste AA en títulos y cuerpo; foco visible en navegación por teclado; targets ≥44px.
- [ ] Estados vacío/carga/error presentes (ej. "Aún no hay datos publicados para este mes").
- [ ] Screenshots de cada módulo (mobile + desktop) guardados en `logs/screens/`.

> Cuando todo lo anterior esté marcado y `npx playwright test` esté verde, escribir `MVP_COMPLETE` en `.mvp_status`.
