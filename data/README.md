# data/ — Persistencia local (sin base de datos)

Etapa I guarda los datos en archivos a través de `@repo/data-layer` (patrón Repository).
NINGÚN dato se escribe aquí directamente: siempre vía un repositorio.

- `content/`     textos del sitio, FAQ, glosario, material educativo (JSON)
- `monitoring/`  datasets por componente (JSON derivado de Excel/CSV)
- `documents/`   PDFs subidos + documents.index.json
- `cases/`       casos MIAQR (JSON) + adjuntos
- `newsletter/`  suscriptores + boletines (JSON)
- `audit/`       log de auditoría (JSONL)

## Versionado vs runtime
- El **seed de ejemplo** (placeholder) se versiona desde `@repo/content/seed` (script de import en WS9).
- Los **datos escritos en runtime** (casos reales, PDFs subidos, datasets publicados) NO se versionan:
  viven en el volumen persistente del hosting (Render/Railway montado en /data). Ver .gitignore.
