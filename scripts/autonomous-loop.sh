#!/usr/bin/env bash
# Loop autónomo: reinvoca Claude Code con el KICKOFF hasta cumplir el GOAL.
# Pensado para correr desatendido (fin de semana). Ver docs/AUTONOMOUS_RUN.md.
#
#   bash scripts/autonomous-loop.sh
#
# Variables:
#   MAX_ITER   máximo de iteraciones (default 40)
#   SLEEP_S    pausa entre iteraciones (default 10)

set -uo pipefail
cd "$(dirname "$0")/.."

MAX_ITER="${MAX_ITER:-40}"
SLEEP_S="${SLEEP_S:-10}"
SENTINEL="MVP_COMPLETE"
mkdir -p logs logs/screens

echo "== Loop autónomo del MVP =="
echo "Inicio: $(date) | MAX_ITER=$MAX_ITER"

# Preparación idempotente
[ -f .git/index.lock ] && rm -f .git/index.lock || true

for i in $(seq 1 "$MAX_ITER"); do
  echo ""
  echo "===== ITERACIÓN $i / $MAX_ITER ($(date)) ====="

  # ¿Ya terminamos?
  if [ -f .mvp_status ] && grep -q "$SENTINEL" .mvp_status; then
    echo "🎉 $SENTINEL detectado. MVP completo en iteración previa."
    break
  fi

  PROMPT="$(cat KICKOFF_CLAUDE_CODE.md)

--- INSTRUCCIÓN DE ESTA ITERACIÓN (#$i) ---
Continúa hacia el GOAL. Trabaja en incrementos verificables. Antes de terminar la
iteración: corre 'pnpm lint typecheck test build' y 'npx playwright test', arregla lo
que falle, valida UX/UI con Playwright MCP, y haz commit+push a develop.
SOLO cuando TODOS los criterios de docs/SUCCESS_CRITERIA.md pasen y 'npx playwright test'
esté 100% verde, escribe exactamente '$SENTINEL' en el archivo .mvp_status y crea el PR a main.
Si no, deja el avance commiteado y resume el estado en PROGRESS.md."

  claude -p "$PROMPT" \
    --dangerously-skip-permissions \
    --output-format stream-json --verbose \
    2>&1 | tee "logs/iteracion-$(printf '%02d' "$i").log"

  if [ -f .mvp_status ] && grep -q "$SENTINEL" .mvp_status; then
    echo "🎉 $SENTINEL alcanzado en iteración $i."
    break
  fi

  echo "Iteración $i terminada. Pausa ${SLEEP_S}s..."
  sleep "$SLEEP_S"
done

echo ""
echo "== Fin del loop: $(date) =="
if [ -f .mvp_status ] && grep -q "$SENTINEL" .mvp_status; then
  echo "Estado: COMPLETO ✅  (ver PROGRESS.md, logs/screens/, PR develop→main)"
else
  echo "Estado: INCOMPLETO ⏳  (revisa PROGRESS.md y logs/; relanza el loop para continuar)"
fi
