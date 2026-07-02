# Despliegue en Vercel

La app que se despliega es **`apps/web`** (Next.js). `apps/api` (Fastify) es un
stub independiente y no se despliega: la web usa sus propias rutas `/api/*`.

## 1. Crear el proyecto

1. vercel.com → **Add New → Project** → importar `AJHR/plataforma-ambiental-epsa`.
2. **Root Directory** → `apps/web` (botón *Edit*).
3. Dejar activado **"Include files outside of the Root Directory"** (por defecto).
4. Framework: Next.js (autodetectado). Build/Install: por defecto.

## 2. Persistencia de datos (Vercel KV / Upstash Redis)

El filesystem de Vercel es de **solo lectura**, por lo que los formularios que
guardan datos (reclamos MIAQR, suscripción al boletín, etc.) necesitan un
almacén externo. Se usa **Redis** (Vercel KV, gratis para este volumen).

1. En el proyecto de Vercel → pestaña **Storage** → **Create Database** →
   **KV (Upstash Redis)** → crear y **conectar al proyecto**.
2. Al conectarla, Vercel inyecta solas las variables de entorno
   `KV_REST_API_URL` y `KV_REST_API_TOKEN` (también sirve una integración
   directa de Upstash con `UPSTASH_REDIS_REST_URL` / `_TOKEN`).
3. No hay que sembrar nada: si una clave aún no existe en Redis, la app
   devuelve el dato semilla empaquetado (carpeta `data/`). El primer envío de
   cada formulario crea la clave y a partir de ahí persiste.

> Comportamiento: **lecturas** siempre funcionan (KV → si vacío, semilla).
> **Escrituras** van a KV. En local/tests, sin credenciales KV, todo usa el
> filesystem como antes.

### Pendiente aparte: archivos PDF de documentos

La subida/descarga de **archivos** PDF en el admin guarda binarios en disco, lo
que no persiste en Vercel. Para habilitarlo hay que migrar esas dos rutas a
**Vercel Blob** (los metadatos de documentos sí persisten vía KV). No afecta a
reclamos MIAQR ni al boletín.

## 3. Variables de entorno

| Variable | Valor | Nota |
| --- | --- | --- |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | (las inyecta Vercel al conectar KV) | requeridas para persistencia |
| `NEXT_PUBLIC_DEMO_PASSWORD` | `epsa2030!` | opcional (es el valor por defecto) |
| `NEXT_PUBLIC_DEMO_GATE` | *(no definir)* | dejar sin definir mantiene el gate **activo** |

## 4. Rama de producción

El trabajo va en `develop`. En **Settings → Git → Production Branch** poner
`develop` para que cada push publique.

## 5. Deploy y dominio

1. **Deploy**. La URL `*.vercel.app` debe mostrar la pantalla de clave
   (`epsa2030!`) y luego la portada.
2. **Settings → Domains → Add** → tu dominio. Configurar en tu proveedor DNS:
   - Dominio raíz: registro **A** → `76.76.21.21`.
   - `www`: **CNAME** → `cname.vercel-dns.com`.
3. El certificado SSL lo emite Vercel automáticamente al validar el DNS.
