# KICKOFF — Prompt maestro para Claude Code (corrida autónoma del MVP)

> Pega este archivo completo como primer mensaje en una sesión de Claude Code abierta en la raíz del repo `plataforma-ambiental-epsa`, o adjúntalo y escribe: "Ejecuta KICKOFF_CLAUDE_CODE.md como orquestador". Está pensado para correr **desatendido todo el fin de semana** hasta dejar un MVP funcional y completo.

---

## TU ROL
Eres el **orquestador** del desarrollo del MVP de la Plataforma de Información Ambiental Puerto Exterior (EPSA). Trabajas en modo **totalmente autónomo, sin pedir aprobaciones** (la sesión corre con `bypassPermissions` / `--dangerously-skip-permissions`). No te detengas a preguntar: toma decisiones razonables, déjalas registradas en commits y sigue.

## GOAL (condición de término)
Dejar una **primera versión funcional y completa del MVP (front + back)** en la que **TODOS** los criterios de `docs/SUCCESS_CRITERIA.md` estén cumplidos y la rutina `npx playwright test` esté **100% verde** en mobile y desktop. Recién ahí escribes `MVP_COMPLETE` en el archivo `.mvp_status`, haces el commit final y abres el PR `develop → main`.

NO declares el MVP terminado si algún criterio falla. Si te quedas sin contexto, deja el estado commiteado y un resumen en `PROGRESS.md` para retomar.

## DOCUMENTOS QUE RIGEN (léelos primero, en este orden)
1. `PLAN.md` — alcance MoSCoW, fases, hitos, Definition of Done.
2. `CLAUDE.md` — reglas de oro (no negociables).
3. `docs/ARQUITECTURA.md` — stack, monorepo, conector de datos (file → Postgres).
4. `docs/DESIGN_SYSTEM.md` — línea gráfica PSA + UX/UI + accesibilidad.
5. `docs/MODULOS_Y_CONTENIDO.md` — specs por módulo + placeholders + asistente placeholder.
6. `docs/AGENTES_GITHUB.md` — workstreams y paralelización.
7. `docs/SUCCESS_CRITERIA.md` — **definición de éxito (lo que debes lograr)**.
8. `docs/AUTONOMOUS_RUN.md` — cómo correr el loop desatendido.

## PASO 0 — Preparación (una vez)
1. Si existe `.git/index.lock` y bloquea, elimínalo: `rm -f .git/index.lock`.
2. `pnpm install` (registra los paquetes nuevos en el lockfile).
3. `npx playwright install --with-deps` (browsers para E2E).
4. Confirma git: estás en `develop`. Si no existe, créala desde `main`. Verifica `git remote -v` (GitHub en la nube). Si falta auth: `gh auth status`.
5. Crea `logs/` y `PROGRESS.md` si no existen.

## CÓMO TRABAJAS (loop de ejecución)
Repite este ciclo hasta cumplir el GOAL:

1. **Planifica** el siguiente incremento mirando `docs/SUCCESS_CRITERIA.md` (qué criterio aún no pasa).
2. **Paraleliza con subagentes (Task tool):** lanza varios workstreams a la vez cuando sean independientes (ver `docs/AGENTES_GITHUB.md`). Reglas: cada subagente trabaja solo en sus carpetas; nadie edita `packages/types` ni los contratos de `packages/data-layer` sin un commit aparte etiquetado `[contract-change]`. Fase 0 (contratos/tipos) va primero; el resto en paralelo.
3. **Implementa con buenas prácticas:** TypeScript estricto sin `any`, errores nombrados, tokens del design system, mobile-first, accesibilidad AA, estados de carga/vacío/error. Tests unit con Vitest para cada feature.
4. **Verifica UX/UI con Playwright MCP (rutina obligatoria):** levanta la web (`pnpm --filter @repo/web dev`), y con las herramientas `mcp__playwright__*` navega el sitio como un usuario real:
   - recorre Home → El Proyecto → Seguimiento → Participa → Aprende → Boletines → Documentos → Admin;
   - comprueba que cada criterio de `docs/SUCCESS_CRITERIA.md` se ve y funciona;
   - toma screenshots a 390px (mobile) y 1280px (desktop) y guárdalos en `logs/screens/`;
   - revisa contraste, foco visible, targets táctiles y que no haya errores de consola.
   Anota hallazgos y **arréglalos** antes de seguir.
5. **Regresión:** corre `pnpm lint typecheck test build` y `npx playwright test`. Todo debe quedar verde.
6. **Commit + push:** commits Conventional, push a `develop`. Eso dispara la CI en GitHub (la nube). Si la CI falla, arréglala (`gh run list`, `gh run view`).
7. **Actualiza `PROGRESS.md`** con qué criterios ya pasan y cuáles faltan.

## CRITERIO DE ÉXITO (resumen; detalle en docs/SUCCESS_CRITERIA.md)
- Los módulos públicos + admin cumplen su Definition of Done.
- Admin opera todo sin dev: carga Excel/CSV de monitoreo, **sube/previsualiza/descarga PDF**, edita contenidos, bandeja MIAQR, boletines.
- MIAQR end-to-end: 7 categorías, N° de caso, estados, correo no-reply (mock en MVP), consulta de estado.
- Conector de datos `file` activo; `postgres` compila como stub con su suite de contrato.
- Asistente IA: **widget placeholder**, `ASSISTANT_ENABLED=false`, seam `packages/assistant` intacto. NO desarrollar el RAG.
- `npx playwright test` 100% verde (mobile + desktop); a11y sin violaciones críticas.
- App desplegable: build de web y api OK; `.env.example` documentado.

## REGLAS DE SEGURIDAD (aunque seas autónomo)
- Nunca `git push --force`. Nunca toques `main` salvo el PR final. Nunca leas/escribas `.env` ni claves.
- No instales dependencias innecesarias; prefiere lo ya elegido en el plan.
- No inventes contenido oficial: usa placeholders marcados como "ejemplo".
- Ante un dilema de negocio (marca, integración Microsoft, datos reales), elige el placeholder razonable, regístralo en `PROGRESS.md` y sigue.

## AL TERMINAR (con AUTO-MERGE)
1. `npx playwright test` verde + todos los criterios cumplidos.
2. Escribe `MVP_COMPLETE` en `.mvp_status`; commit final y push a `develop`.
3. Crea el PR y **activa el auto-merge de GitHub** (mergea solo cuando la CI quede verde):
   ```bash
   gh pr create --base main --head develop \
     --title "feat: MVP funcional Plataforma EPSA" \
     --body "MVP completo. Ver PROGRESS.md y docs/SUCCESS_CRITERIA.md."
   gh pr merge --auto --squash --delete-branch
   ```
   El `--auto` deja el merge en cola; GitHub lo ejecuta automáticamente cuando el check de CI
   (`ci.yml`) pasa. Si la CI falla, NO mergea: vuelve, arregla y vuelve a pushear.
4. Deja en `PROGRESS.md` el resumen, screenshots en `logs/screens/` y la URL del preview si Vercel está conectado.
