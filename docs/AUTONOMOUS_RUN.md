# Corrida autónoma del MVP (desatendida, fin de semana)

> Objetivo: dejar Claude Code trabajando solo hasta cumplir `docs/SUCCESS_CRITERIA.md`, sin aprobaciones.

## Requisitos previos (una vez)
1. **Claude Code** instalado y logueado (`claude` en la terminal).
2. **GitHub conectado:** `gh auth login` (o `gh auth status` OK) y `git remote -v` apuntando al repo en la nube.
3. **Node 22 + pnpm 10** disponibles.
4. Si quedó un lock de git: `rm -f .git/index.lock`.
5. `pnpm install` y `npx playwright install --with-deps`.
6. **Permisos:** ya configurados en `.claude/settings.json` (`bypassPermissions`). El loop además lanza con `--dangerously-skip-permissions`.
7. **Playwright MCP:** ya configurado en `.mcp.json`. Verifica que aparece con `claude mcp list`.

## ☁️ Correr en la NUBE con el laptop cerrado (lee esto primero)

El loop de la "Opción A" corre **en tu máquina**: si cierras el computador, se detiene.
Lo mismo con **Remote Control** de Claude Code: mantiene la sesión corriendo *localmente*
(la terminal debe seguir abierta), así que **no sirve** para cerrar el laptop.

Para que siga sin tu computador, hay tres caminos. **Requisito común: el repo debe estar
pusheado a GitHub** (la nube clona desde ahí). Primero:
```bash
rm -f .git/index.lock && git add -A && git commit -m "chore: kit autónomo" && git push -u origin develop
```

### ✅ Nube 1 — Claude Code en la web (claude.ai/code)  ← VÍA ELEGIDA
Sesiones en VM aislada gestionada por Anthropic, con tu repo clonado. Inicias la tarea
desde el navegador y **puedes cerrar el laptop**.

**Setup de AUTO-MERGE (una sola vez en GitHub):** para que el MVP se mergee solo a `main`
cuando la CI quede verde, hay que habilitar dos cosas:
1. **Repo → Settings → General → Pull Requests → marca "Allow auto-merge".**
2. **Repo → Settings → Branches → Add branch protection rule** para `main`:
   - marca "Require status checks to pass before merging" y selecciona el check de CI
     (el job de `ci.yml`: *Lint, Typecheck, Test, Build & E2E*);
   - **NO** marques "Require approvals" (si lo marcas, el auto-merge esperaría revisión humana).
   Equivalente por CLI (necesita permisos admin):
   ```bash
   gh api -X PATCH repos/:owner/:repo --field allow_auto_merge=true
   gh api -X PUT repos/:owner/:repo/branches/main/protection \
     -F 'required_status_checks[strict]=true' \
     -F 'required_status_checks[contexts][]=ci' \
     -F 'enforce_admins=false' -F 'required_pull_request_reviews=' -F 'restrictions='
   ```

**Correr:**
1. Entra a `claude.ai/code`, conecta el repo y elige la rama `develop`.
2. Pega `KICKOFF_CLAUDE_CODE.md` como instrucción inicial.
3. Lánzala y cierra el laptop. La sesión corre en la nube; revisas el avance desde el
   navegador o el móvil. Al cumplir los criterios, Claude abre el PR y activa el auto-merge
   (`gh pr merge --auto`); GitHub mergea a `main` en cuanto la CI pase.
> Verifica límites de duración/uso de la sesión cloud; si una sesión se corta, reábrela y
> escribe "continúa con KICKOFF_CLAUDE_CODE.md" — retoma desde el último commit + PROGRESS.md.

### Nube 2 — Routines de Claude Code (Anthropic cloud, programadas)
Una *routine* dispara una sesión completa de Claude Code en la nube por **cron / evento /
webhook**, abre PRs, etc., con tu Mac cerrado. Programa una routine cada pocas horas el
sábado y domingo con el prompt "continúa hacia el GOAL de KICKOFF hasta que pasen los
criterios de SUCCESS_CRITERIA". Es el equivalente cloud del loop local.

### Nube 3 — GitHub Actions (nube de GitHub)  ← incluido y listo
Ya dejé `.github/workflows/claude-autonomous.yml`. Pasos:
1. En GitHub: **Settings → Secrets and variables → Actions** → agrega `ANTHROPIC_API_KEY`.
2. Pushea `develop` (incluye el workflow).
3. Lánzalo manual (**Actions → Claude Autónomo → Run workflow**) o deja que el `schedule`
   (cada 3h sáb/dom) lo reanude. Cada corrida continúa hasta el tope de tiempo del runner
   (~6h) y la siguiente retoma; corta sola cuando detecta `MVP_COMPLETE`.
> Consideraciones: consume minutos de Actions y créditos de API; los jobs tienen tope de
> ~6h (por eso el schedule). Verifica nombres de inputs del action en
> code.claude.com/docs/en/github-actions.

---

## Opción A — Loop desatendido EN TU MÁQUINA (requiere computador encendido)
```bash
cd /ruta/al/repo/plataforma-ambiental-epsa
mkdir -p logs logs/screens
nohup bash scripts/autonomous-loop.sh > logs/loop.out 2>&1 &
echo "Loop corriendo. Sigue el avance con: tail -f logs/loop.out"
```
El script reinvoca Claude Code en headless con el KICKOFF en cada iteración, hasta que aparezca `MVP_COMPLETE` en `.mvp_status` o se agoten las iteraciones. Cada iteración queda logueada en `logs/`.

## Opción B — Una sesión interactiva larga
Abre Claude Code en el repo y pega `KICKOFF_CLAUDE_CODE.md`. Útil para arrancar y observar las primeras iteraciones; luego puedes cambiar al loop.

## Cómo verifica el éxito (UX/UI)
Dos capas, ambas obligatorias antes de declarar el MVP terminado:
1. **Playwright MCP (interactivo):** Claude navega el sitio real con `mcp__playwright__*`, valida cada criterio, toma screenshots mobile/desktop en `logs/screens/` y arregla lo que falle.
2. **Playwright test (regresión):** `e2e/success.spec.ts` codifica los criterios; `npx playwright test` debe quedar 100% verde en `mobile` y `desktop`. La CI de GitHub lo re-corre en cada push.

## GitHub en la nube
- Cada push a `develop` dispara `.github/workflows/ci.yml` (lint, typecheck, test, build, e2e, a11y).
- **No pongas branch protection que exija revisión humana** si quieres término desatendido: deja `main` con "requiere CI verde" pero permite el merge del PR final por el propio flujo. Alternativa: el loop deja el PR `develop → main` abierto y tú lo mergeas el lunes tras revisar.
- Para preview automático, conecta el repo a **Vercel** (web) y **Render/Railway** (api) desde sus dashboards una sola vez.

## Salvaguardas
- `deny` en settings bloquea `rm -rf /`, `sudo`, force push y lectura de secretos.
- El loop tiene tope de iteraciones (`MAX_ITER`, default 40) para no quedar en bucle infinito.
- Estado siempre commiteado: si se corta, retoma desde el último commit + `PROGRESS.md`.

## El lunes
1. `cat .mvp_status` → debe decir `MVP_COMPLETE`.
2. `cat PROGRESS.md` y revisa `logs/screens/`.
3. Revisa el PR `develop → main` y el preview de Vercel.
4. `npx playwright test` para confirmar verde localmente.
