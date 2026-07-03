# Plataforma de Información Ambiental — Proyecto Puerto Exterior (EPSA)
## Arquitectura del sitio y stack tecnológico

> Documento de referencia técnica. Resume las tecnologías empleadas, la
> justificación de cada elección (madurez, robustez y vigencia) y el detalle de
> la arquitectura. Pensado como insumo para elaborar una propuesta.

---

## 1. Resumen ejecutivo

La plataforma es una **aplicación web moderna** que publica de forma transparente
la información ambiental del proyecto Puerto Exterior de San Antonio: seguimiento
de componentes ambientales, compromisos (medidas, planes de seguimiento y CAV),
documentos públicos, un mecanismo de participación ciudadana (MIAQR — consultas,
quejas y reclamos) y un módulo educativo.

Está construida sobre un stack **JavaScript/TypeScript de última generación**
(Next.js 16 + React 19), desplegada en una arquitectura **serverless** sobre
Vercel, con persistencia en **Redis administrado** (Upstash / Vercel KV). El
código está organizado como **monorepo** para escalar de forma ordenada y con una
**batería de pruebas automatizadas** (unitarias, de contrato y end-to-end) que
corren en integración continua.

---

## 2. Stack tecnológico y justificación

### 2.1 Lenguaje: TypeScript (strict)

- **Versión:** TypeScript 6.x, modo `strict`, prohibición explícita de `any`.
- **Por qué:** TypeScript es hoy el estándar de facto para aplicaciones web
  serias. El tipado estático detecta errores en tiempo de compilación (antes de
  producción), documenta el código y habilita refactors seguros. El modo estricto
  eleva la garantía de calidad y reduce defectos en runtime.

### 2.2 Framework de aplicación: Next.js 16 (App Router) + React 19

- **Por qué Next.js:** es el framework React líder del mercado, mantenido por
  Vercel y respaldado por una comunidad enorme. Ofrece en un solo marco:
  renderizado en servidor (SSR), generación estática (SSG), **React Server
  Components**, y **API Routes** (backend integrado) — sin necesidad de un
  servidor separado para la mayoría de los casos.
- **App Router + Server Components:** el contenido se renderiza por defecto en el
  servidor, lo que mejora el rendimiento percibido, el SEO y la seguridad (menos
  lógica y menos datos expuestos en el cliente).
- **Robustez/vigencia:** Next.js es usado por empresas de primer nivel; React 19
  es la versión estable más reciente. Es una apuesta tecnológica **actual y con
  soporte de largo plazo**, no una tecnología de nicho.

### 2.3 Estilos: Tailwind CSS v4

- **Por qué:** Tailwind es el sistema de estilos utilitario más adoptado de la
  industria. Permite construir interfaces consistentes y responsivas rápidamente,
  con un **sistema de design tokens** centralizado (colores, tipografía, radios,
  sombras) que garantiza coherencia visual y accesibilidad (contraste AA).
- **v4:** la versión más reciente, con mejor rendimiento de compilación y
  configuración basada en CSS.

### 2.4 Backend / API: Next.js API Routes (serverless)

- **Por qué:** las rutas API viven dentro del mismo proyecto Next.js y se
  despliegan como **funciones serverless**. Esto elimina la operación de un
  servidor dedicado, escala automáticamente según demanda y reduce costos
  (se paga por uso). Cubre autenticación de administración, ingreso de reclamos,
  suscripción a boletines, series de monitoreo y gestión de documentos.
- **Fastify (apps/api):** el repositorio incluye además un servicio Fastify (Node)
  como base para una API independiente si en el futuro se requiere separar el
  backend. Fastify es uno de los frameworks Node más rápidos y robustos. Hoy la
  web es autosuficiente con sus API Routes.

### 2.5 Persistencia: Redis administrado (Upstash / Vercel KV)

- **Por qué:** en producción serverless el sistema de archivos es efímero y de
  solo lectura, por lo que los datos que cambian (reclamos, suscriptores,
  contadores, metadatos de documentos) se guardan en **Redis administrado**.
  Upstash es un Redis serverless (pago por uso, sin servidores que administrar) y
  se integra nativamente con Vercel.
- **Diseño híbrido:** la capa de acceso a datos (`dataStore`) lee primero de
  Redis y, si una clave aún no existe, entrega el **dato semilla** empaquetado con
  la aplicación; las escrituras persisten en Redis. En desarrollo local, sin
  credenciales, usa el sistema de archivos — de modo que el equipo trabaja sin
  depender de infraestructura externa.
- **Escalabilidad futura:** el contrato de datos está aislado en un paquete de
  tipos, lo que permite migrar a **PostgreSQL** (p. ej. Neon/Supabase/Vercel
  Postgres) sin reescribir la interfaz de usuario cuando el volumen o la
  complejidad relacional lo ameriten.

### 2.6 Infraestructura y despliegue: Vercel

- **Por qué:** Vercel es la plataforma creadora de Next.js; el despliegue es
  **continuo desde Git** (cada push publica), con **HTTPS/SSL automático**, CDN
  global, previews por rama y escalado serverless sin configuración de
  servidores. Reduce a mínimos el costo operativo y el tiempo de puesta en
  producción.

### 2.7 Monorepo: pnpm workspaces + Turborepo

- **Por qué:** el proyecto se organiza como monorepo con **pnpm** (gestor de
  paquetes rápido y eficiente en disco) y **Turborepo** (orquestador de tareas con
  caché). Esto permite compartir código (tipos, componentes de UI, configuración)
  entre aplicaciones, mantener un único origen de verdad y builds incrementales
  veloces.

### 2.8 Calidad y pruebas

- **Vitest** — pruebas unitarias y de contrato (rápidas, API moderna).
- **Playwright** — pruebas **end-to-end** y de **accesibilidad (axe / WCAG AA)**
  sobre navegador real (Chromium), simulando el uso real del sitio.
- **ESLint** — análisis estático y estilo de código.
- **Integración continua (GitHub Actions):** en cada Pull Request se ejecuta
  lint + typecheck + tests + build + E2E. Nada llega a producción sin pasar la
  batería completa.
- **Convenciones:** Conventional Commits, revisión por PR, y tests obligatorios
  para toda funcionalidad nueva.

### 2.9 Tabla-resumen

| Capa | Tecnología | Versión | Rol |
| --- | --- | --- | --- |
| Lenguaje | TypeScript (strict) | 6.x | Tipado estático en todo el stack |
| UI / Framework | Next.js (App Router) + React | 16.x / 19.x | Renderizado, ruteo, Server Components |
| Estilos | Tailwind CSS | 4.x | Design system y responsividad |
| Iconografía | lucide-react | 0.545 | Íconos SVG accesibles |
| Backend | Next.js API Routes (serverless) | — | Endpoints de la aplicación |
| API alternativa | Fastify (Node) | 5.x | Servicio backend independiente (base) |
| Persistencia | Upstash Redis / Vercel KV | — | Datos mutables en producción |
| Infra / Deploy | Vercel | — | Serverless, CDN, SSL, CI/CD |
| Monorepo | pnpm + Turborepo | pnpm 10.x | Gestión y orquestación de paquetes |
| Pruebas | Vitest + Playwright (axe) | 4.x / 1.x | Unitarias, contrato, E2E, a11y |
| CI | GitHub Actions | — | Lint, typecheck, test, build, E2E |

---

## 3. Arquitectura del sitio

### 3.1 Vista general

```
┌───────────────────────────────────────────────────────────────┐
│                          Vercel (Edge/CDN)                       │
│                                                                  │
│   ┌───────────────────────── apps/web (Next.js 16) ──────────┐  │
│   │                                                            │  │
│   │  React Server Components  ── Páginas públicas             │  │
│   │  Client Components        ── Formularios, filtros, modales │  │
│   │                                                            │  │
│   │  API Routes (serverless)  ── /api/*  (backend integrado)   │  │
│   │        │                                                   │  │
│   │        ▼                                                   │  │
│   │  Capa de datos (dataStore) ──► Redis (Upstash/Vercel KV)   │  │
│   │        │                                                   │  │
│   │        └─ fallback ──► datos semilla (data/*.json)         │  │
│   └────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
        ▲                                   ▲
        │ push a Git                        │ dominio propio + SSL
   GitHub + CI (Actions)              usuario final (navegador)
```

### 3.2 Estructura del monorepo

```
plataforma-ambiental-epsa/
├── apps/
│   ├── web/        → Aplicación Next.js (frontend + API Routes). Se despliega.
│   └── api/        → Servicio Fastify (base para backend independiente futuro).
├── packages/
│   ├── types/      → Contrato de tipos compartido (fuente de verdad de la API).
│   ├── ui/         → Design system: componentes y tokens de estilo.
│   ├── config/     → Configuración compartida (tokens de tema, etc.).
│   ├── content/    → Contenido/estructuras de datos de dominio.
│   ├── data-layer/ → Contratos de acceso a datos (file/postgres) y esquema.
│   └── assistant/  → Módulo de apoyo (utilidades).
├── data/           → Datos semilla versionados (JSON): compromisos, monitoreo,
│                     documentos, contenido, boletines, casos.
├── e2e/            → Pruebas end-to-end (Playwright).
└── docs/           → Documentación (despliegue, arquitectura, créditos).
```

### 3.3 Módulos funcionales (páginas públicas)

| Ruta | Módulo | Descripción |
| --- | --- | --- |
| `/` | Home | Portada con accesos, métricas y boletín. |
| `/el-proyecto` | El Proyecto | Contexto del proyecto y enlace al expediente SEIA. |
| `/seguimiento` | Seguimiento Ambiental | Series de monitoreo por componente y frecuencia. |
| `/compromisos` | Compromisos | Medidas, planes de seguimiento y CAV (Etapa I / TDR). |
| `/documentos` | Documentos Públicos | Repositorio con previsualización y descarga. |
| `/participa` | Participa / Contacto | Ingreso de MIAQR (consultas, quejas, reclamos) con RUT y nombre. |
| `/aprende` · `/boletines` | Aprende / Boletines | Contenido educativo y suscripción a novedades. |
| `/admin` | Administración | Panel privado: Bandeja MIAQR, monitoreos, documentos, boletines. |

### 3.4 Capa de API (endpoints principales)

Backend integrado como funciones serverless (`apps/web/src/app/api/**`):

- **Participación (MIAQR):** `POST /api/cases` (ingreso), `GET /api/cases`
  (bandeja), `GET /api/cases/[number]` (consulta por número).
- **Monitoreo:** `GET /api/monitoring/components`,
  `GET /api/monitoring/[code]/series`.
- **Compromisos:** `GET /api/compromisos`.
- **Documentos:** `GET /api/documents`, `GET /api/documents/[id]`,
  `.../preview`, `.../download`; carga admin `POST /api/admin/documents/upload`.
- **Boletines / newsletter:** suscripción, baja y emisión de boletines.
- **Contenido:** `GET /api/content/[key]`.
- **Administración:** `POST /api/admin/login`, carga de monitoreos.

### 3.5 Capa de datos (`dataStore`)

Acceso centralizado y con dos modos según entorno:

1. **Producción (Vercel + Redis):** lecturas consultan Redis; si la clave no
   existe, devuelven el dato semilla empaquetado; las escrituras persisten en
   Redis. Filesystem de solo lectura ⇒ toda mutación va a Redis.
2. **Desarrollo/tests (sin credenciales):** lectura/escritura atómica en el
   sistema de archivos (`data/*.json`).

Ventaja: el mismo código funciona en local y en la nube, y el contrato de datos
queda desacoplado de la implementación de almacenamiento (permite migrar a
PostgreSQL sin tocar la UI).

### 3.6 Seguridad y acceso

- **Gate de acceso al demo:** clave estática configurable por entorno
  (`NEXT_PUBLIC_DEMO_PASSWORD`), desactivable en CI. Restringe el acceso durante
  la fase de demostración.
- **Administración:** panel `/admin` con autenticación por token; los endpoints de
  escritura administrativa verifican el token.
- **HTTPS/SSL:** gestionado automáticamente por Vercel para el dominio propio.
- **Validación de entrada:** las rutas API validan tipos y campos requeridos
  (por ejemplo, RUT con dígito verificador en el ingreso de reclamos).

### 3.7 Accesibilidad y rendimiento

- Diseño responsivo (móvil y escritorio) con design tokens y contraste **WCAG AA**.
- Server Components y optimización de imágenes de Next.js para tiempos de carga
  bajos; entrega vía CDN global de Vercel.
- Pruebas de accesibilidad automatizadas (axe) dentro de la suite E2E.

---

## 4. Flujo de desarrollo y operación

1. **Desarrollo:** ramas de trabajo → Pull Request a `develop`.
2. **Integración continua:** GitHub Actions ejecuta lint + typecheck + tests +
   build + E2E en cada PR. No se integra nada en rojo.
3. **Despliegue:** al llegar el código a la rama de producción, Vercel construye y
   publica automáticamente (con preview por rama antes de producción).
4. **Datos:** los datos semilla viajan versionados; los datos vivos residen en
   Redis administrado.

---

## 5. Consideraciones de escalabilidad y evolución

- **Base de datos relacional:** migración a PostgreSQL (Neon/Supabase/Vercel
  Postgres) cuando se requieran relaciones complejas, reportería o mayor volumen.
  El `data-layer` ya contempla el contrato file/postgres.
- **Almacenamiento de archivos:** los binarios (PDF) deben migrarse a un blob
  store (p. ej. **Vercel Blob** o S3) para persistencia en producción; los
  metadatos ya persisten en Redis.
- **Backend dedicado:** el servicio Fastify (`apps/api`) permite separar el
  backend si crecen las integraciones (autenticación robusta, colas, terceros).
- **Observabilidad:** Vercel Analytics/Logs e integración de monitoreo de errores
  (p. ej. Sentry) como siguiente paso.

---

## 6. Por qué este stack es una buena decisión (síntesis para la propuesta)

- **Tecnologías de punta y vigentes:** Next.js 16, React 19, TypeScript 6 y
  Tailwind 4 son las versiones más recientes y ampliamente adoptadas de un
  ecosistema líder — no tecnologías experimentales ni de nicho.
- **Robustez comprobada:** herramientas usadas por empresas de primer nivel a
  escala global, con soporte activo y comunidad masiva.
- **Bajo costo operativo:** arquitectura serverless (pago por uso), sin
  administración de servidores, con CDN y SSL incluidos.
- **Calidad asegurada:** tipado estricto + pruebas automatizadas (unitarias, de
  contrato, E2E y accesibilidad) en integración continua.
- **Escalable y evolutiva:** el diseño en monorepo y la separación de contratos
  de datos permiten crecer (base relacional, blob storage, backend dedicado) sin
  reescribir la aplicación.
- **Rápido time-to-market:** despliegue continuo desde Git y previews por rama
  aceleran la entrega y la validación con la contraparte.
