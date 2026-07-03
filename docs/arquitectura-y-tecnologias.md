# Plataforma de Información Ambiental — Proyecto Puerto Exterior (EPSA)
## Arquitectura del sitio y stack tecnológico

> Documento de referencia técnica. Resume las tecnologías empleadas, la
> justificación de cada elección (madurez, robustez y vigencia) y el detalle de
> la arquitectura, incluyendo un **esquema productivo** basado en base de datos
> **relacional** y nube de nivel empresarial (**AWS / Google Cloud / Azure**).
> Pensado como insumo para elaborar una propuesta.
>
> **Nota:** el ambiente de **demostración** actual está montado sobre una
> plataforma serverless (Vercel) con almacenamiento clave-valor solo para efectos
> de la demo; **no** representa el esquema productivo recomendado, que se describe
> en la sección 2.5 y 2.6.

---

## 1. Resumen ejecutivo

La plataforma es una **aplicación web moderna** que publica de forma transparente
la información ambiental del proyecto Puerto Exterior de San Antonio: seguimiento
de componentes ambientales, compromisos (medidas, planes de seguimiento y CAV),
documentos públicos, un mecanismo de participación ciudadana (MIAQR — consultas,
quejas y reclamos) y un módulo educativo.

Está construida sobre un stack **JavaScript/TypeScript de última generación**
(Next.js 16 + React 19). Para producción se propone una arquitectura con **base de
datos relacional (PostgreSQL)** y despliegue en una **nube de nivel empresarial**
(AWS, Google Cloud o Azure, indistintamente), con una **batería de pruebas
automatizadas** (unitarias, de contrato y end-to-end) ejecutadas en integración
continua.

---

## 2. Stack tecnológico y justificación

### 2.1 Lenguaje: TypeScript (strict)

- **Versión:** TypeScript 6.x, modo `strict`, prohibición explícita de `any`.
- **Por qué:** es el estándar de facto para aplicaciones web serias. El tipado
  estático detecta errores en tiempo de compilación (antes de producción),
  documenta el código y habilita refactors seguros. El modo estricto eleva la
  garantía de calidad y reduce defectos en runtime.

### 2.2 Framework de aplicación: Next.js 16 (App Router) + React 19

- **Por qué Next.js:** es el framework React líder del mercado, con una comunidad
  enorme y soporte activo. Ofrece en un solo marco: renderizado en servidor (SSR),
  generación estática (SSG), **React Server Components** y una capa de **API/BFF**
  integrada.
- **App Router + Server Components:** el contenido se renderiza por defecto en el
  servidor, lo que mejora el rendimiento percibido, el SEO y la seguridad (menos
  lógica y menos datos expuestos en el cliente).
- **Portabilidad:** Next.js puede desplegarse como aplicación Node en cualquier
  nube (contenedores o servicios gestionados), no queda atado a un proveedor.
- **Robustez/vigencia:** usado por empresas de primer nivel; React 19 es la versión
  estable más reciente. Es una apuesta tecnológica **actual y con soporte de largo
  plazo**, no una tecnología de nicho.

### 2.3 Estilos: Tailwind CSS v4

- **Por qué:** el sistema de estilos utilitario más adoptado de la industria.
  Permite construir interfaces consistentes y responsivas con un **sistema de
  design tokens** centralizado (colores, tipografía, radios, sombras) que
  garantiza coherencia visual y accesibilidad (contraste AA).

### 2.4 Backend / API

- **Modelo:** la lógica de servidor se expone como endpoints HTTP (API/BFF)
  cercanos a la aplicación: autenticación de administración, ingreso de reclamos,
  suscripción a boletines, series de monitoreo y gestión de documentos.
- **Framework Node (Fastify) para backend dedicado:** el repositorio incluye un
  servicio **Fastify** (`apps/api`) como base para un backend independiente cuando
  se requiera separar responsabilidades (integraciones, colas, terceros). Fastify
  es uno de los frameworks Node más rápidos y robustos, apto para contenedores en
  cualquier nube.

### 2.5 Persistencia: base de datos relacional (PostgreSQL) — esquema productivo

- **Recomendación productiva: PostgreSQL.** Es la base de datos relacional
  open-source más robusta y adoptada del mercado: soporte transaccional ACID,
  integridad referencial, consultas complejas, extensiones (p. ej. **PostGIS**
  para datos geoespaciales, muy pertinente para información ambiental por áreas de
  influencia), y disponibilidad como **servicio gestionado en las tres nubes
  principales**:

  | Nube | Servicio gestionado PostgreSQL |
  | --- | --- |
  | **AWS** | Amazon RDS for PostgreSQL / Amazon Aurora PostgreSQL |
  | **Google Cloud** | Cloud SQL for PostgreSQL / AlloyDB |
  | **Azure** | Azure Database for PostgreSQL (Flexible Server) |

  Estos servicios entregan **backups automáticos, alta disponibilidad
  (multi-AZ/replicación), cifrado en reposo y tránsito, y escalado vertical/
  lecturas replicadas** sin administrar servidores de base de datos.

- **Acceso a datos desacoplado:** el proyecto aísla el **contrato de datos** en un
  paquete de tipos y una capa de acceso (`data-layer`) que contempla implementación
  **file/postgres**. Esto permite conectar PostgreSQL en producción sin reescribir
  la interfaz de usuario ni la lógica de negocio.
- **ORM/consulta recomendado:** una capa como **Prisma** o **Drizzle** (TypeScript)
  para migraciones versionadas, tipado end-to-end y consultas seguras.
- **Caché (opcional):** un almacén clave-valor tipo **Redis** puede sumarse como
  **caché** o para sesiones/colas, no como base de datos principal (ElastiCache en
  AWS, Memorystore en Google, Azure Cache for Redis).

> El demo utiliza un almacén clave-valor solo por simplicidad de montaje; el
> esquema productivo es **PostgreSQL gestionado**.

### 2.6 Infraestructura y despliegue — esquema productivo en nube

La aplicación es **portable** y puede desplegarse en cualquiera de las tres nubes
principales, con dos patrones equivalentes:

**A. Contenedores (recomendado para portabilidad):** empaquetar la app Next.js y
el backend Fastify en imágenes **Docker** y ejecutarlas en un servicio gestionado
de contenedores:

| Nube | Cómputo (contenedores) | Estáticos / CDN | Almacenamiento de archivos |
| --- | --- | --- | --- |
| **AWS** | ECS Fargate / EKS / App Runner | CloudFront + S3 | Amazon S3 |
| **Google Cloud** | Cloud Run / GKE | Cloud CDN + Cloud Storage | Cloud Storage |
| **Azure** | Container Apps / AKS | Azure CDN + Blob Storage | Azure Blob Storage |

**B. Serverless / gestionado:** funciones o app services (AWS Lambda + API
Gateway/Amplify, Google Cloud Run, Azure App Service/Functions) para escalado
automático y pago por uso.

**Elementos transversales de producción (equivalentes en las tres nubes):**

- **CDN + HTTPS/TLS** gestionado y certificados automáticos.
- **Balanceo de carga** y **auto-scaling** por demanda.
- **Almacenamiento de objetos** (S3 / Cloud Storage / Blob) para documentos PDF.
- **Secret manager** (AWS Secrets Manager, Google Secret Manager, Azure Key Vault)
  para credenciales.
- **Observabilidad** (CloudWatch / Cloud Monitoring / Azure Monitor) y trazas de
  errores (p. ej. Sentry).
- **Infraestructura como código** (Terraform) para reproducibilidad entre
  ambientes (dev/staging/producción).

### 2.7 Monorepo: pnpm workspaces + Turborepo

- **Por qué:** el proyecto se organiza como monorepo con **pnpm** (gestor de
  paquetes rápido y eficiente en disco) y **Turborepo** (orquestador de tareas con
  caché). Permite compartir código (tipos, componentes de UI, configuración) entre
  aplicaciones, mantener un único origen de verdad y builds incrementales veloces.

### 2.8 Calidad y pruebas

- **Vitest** — pruebas unitarias y de contrato (rápidas, API moderna).
- **Playwright** — pruebas **end-to-end** y de **accesibilidad (axe / WCAG AA)**
  sobre navegador real (Chromium), simulando el uso real del sitio.
- **ESLint** — análisis estático y estilo de código.
- **Integración continua (GitHub Actions):** en cada Pull Request se ejecuta
  lint + typecheck + tests + build + E2E. Nada llega a producción sin pasar la
  batería completa. Es portable a cualquier CI (GitLab CI, Azure Pipelines, AWS
  CodePipeline, Google Cloud Build).
- **Convenciones:** Conventional Commits, revisión por PR, y tests obligatorios
  para toda funcionalidad nueva.

### 2.9 Tabla-resumen

| Capa | Tecnología | Versión | Rol |
| --- | --- | --- | --- |
| Lenguaje | TypeScript (strict) | 6.x | Tipado estático en todo el stack |
| UI / Framework | Next.js (App Router) + React | 16.x / 19.x | Renderizado, ruteo, Server Components |
| Estilos | Tailwind CSS | 4.x | Design system y responsividad |
| Iconografía | lucide-react | 0.545 | Íconos SVG accesibles |
| Backend | API/BFF (Next.js) + Fastify (Node) | 5.x | Endpoints de la aplicación / backend dedicado |
| **Base de datos** | **PostgreSQL (gestionado)** | 15+ | **Persistencia relacional productiva** |
| Acceso a datos | Prisma / Drizzle (recomendado) | — | ORM, migraciones, tipado |
| Almacenamiento archivos | S3 / Cloud Storage / Blob | — | Documentos PDF |
| Nube | AWS / Google Cloud / Azure | — | Cómputo, CDN, TLS, escalado |
| Contenedores | Docker | — | Portabilidad entre nubes |
| Monorepo | pnpm + Turborepo | pnpm 10.x | Gestión y orquestación de paquetes |
| Pruebas | Vitest + Playwright (axe) | 4.x / 1.x | Unitarias, contrato, E2E, a11y |
| CI/CD | GitHub Actions (portable) | — | Lint, typecheck, test, build, E2E |
| IaC | Terraform (recomendado) | — | Infraestructura reproducible |

---

## 3. Arquitectura del sitio

### 3.1 Vista general (esquema productivo)

```
                 Usuarios (navegador)
                        │  HTTPS
                        ▼
              ┌───────────────────┐
              │  CDN + TLS/WAF     │   (CloudFront / Cloud CDN / Azure CDN)
              └─────────┬─────────┘
                        ▼
        ┌───────────────────────────────┐
        │  Cómputo (contenedores/serverless)   │
        │                                │
        │   Next.js (SSR/RSC + API/BFF)  │
        │   Fastify (backend dedicado)*  │
        └───────┬───────────────┬────────┘
                │               │
                ▼               ▼
     ┌────────────────┐  ┌───────────────────┐
     │  PostgreSQL     │  │  Almacenamiento    │
     │  (gestionado)   │  │  de objetos (PDF)  │
     │  RDS/CloudSQL/  │  │  S3/GCS/Blob       │
     │  Azure DB       │  └───────────────────┘
     └────────────────┘
       (+ Redis opcional como caché)

  * backend dedicado opcional según necesidad de integraciones.

  CI/CD:  GitHub (repos + Actions) ──build/test──► registro de imágenes ──► nube
  IaC:    Terraform describe todos los recursos por ambiente (dev/staging/prod)
```

### 3.2 Estructura del monorepo

```
plataforma-ambiental-epsa/
├── apps/
│   ├── web/        → Aplicación Next.js (frontend + API/BFF). Se despliega.
│   └── api/        → Servicio Fastify (backend independiente para producción).
├── packages/
│   ├── types/      → Contrato de tipos compartido (fuente de verdad de la API).
│   ├── ui/         → Design system: componentes y tokens de estilo.
│   ├── config/     → Configuración compartida (tokens de tema, etc.).
│   ├── content/    → Contenido/estructuras de datos de dominio.
│   ├── data-layer/ → Contratos de acceso a datos (file/postgres) y esquema.
│   └── assistant/  → Módulo de apoyo (utilidades).
├── data/           → Datos semilla versionados (JSON) para bootstrap/migración.
├── e2e/            → Pruebas end-to-end (Playwright).
└── docs/           → Documentación (arquitectura, despliegue, créditos).
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

Backend integrado como capa API/BFF (`apps/web/src/app/api/**`), portable a un
servicio Fastify dedicado:

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

### 3.5 Modelo de datos (relacional)

El dominio se traduce naturalmente a un modelo relacional en PostgreSQL. Entidades
principales:

- **casos_miaqr** (nº de caso, nombre, RUT, categoría, mensaje, estado, fecha).
- **suscriptores** (correo, estado, fecha de alta/baja).
- **documentos** (metadatos: título, archivo, tamaño, versión, estado) + objeto
  binario en almacenamiento de objetos.
- **monitoreo** (componente, serie temporal de mediciones, frecuencia, área).
- **compromisos** (código, tipo, componente, descripción, fase, frecuencia).
- **contenido** (claves de contenido editorial) y **boletines**.

La capa `data-layer` ya define el contrato file/postgres; con un ORM (Prisma/
Drizzle) se agregan **migraciones versionadas** y tipado extremo a extremo.

### 3.6 Seguridad y acceso

- **Autenticación de administración:** panel `/admin` con autenticación por token;
  los endpoints de escritura administrativa verifican el token. En producción se
  recomienda **OIDC/OAuth 2.0** (proveedor corporativo o Cognito/Identity Platform/
  Entra ID según nube).
- **HTTPS/TLS + WAF:** cifrado en tránsito y firewall de aplicación en el borde.
- **Cifrado en reposo:** base de datos y almacenamiento de objetos cifrados.
- **Secretos:** gestionados en un secret manager, nunca en el código.
- **Validación de entrada:** las rutas API validan tipos y campos requeridos
  (por ejemplo, RUT con dígito verificador en el ingreso de reclamos).

### 3.7 Accesibilidad y rendimiento

- Diseño responsivo (móvil y escritorio) con design tokens y contraste **WCAG AA**.
- Server Components y optimización de imágenes para tiempos de carga bajos;
  entrega vía **CDN**.
- Pruebas de accesibilidad automatizadas (axe) dentro de la suite E2E.

---

## 4. Flujo de desarrollo y operación

1. **Desarrollo:** ramas de trabajo → Pull Request a `develop`.
2. **Integración continua:** el pipeline de CI ejecuta lint + typecheck + tests +
   build + E2E en cada PR. No se integra nada en rojo.
3. **Entrega continua (CD):** al aprobar, se construyen imágenes de contenedor y se
   despliega a los ambientes (staging → producción), idealmente con aprobación
   manual para producción.
4. **Ambientes:** dev / staging / producción reproducibles vía Terraform.

---

## 5. Escalabilidad y evolución

- **Base de datos:** PostgreSQL gestionado con réplicas de lectura y, de requerirse,
  particionamiento/escalado (Aurora/AlloyDB) para grandes volúmenes de series de
  monitoreo. **PostGIS** habilita análisis geoespacial de áreas de influencia.
- **Archivos:** documentos en almacenamiento de objetos (S3/GCS/Blob) servidos por
  CDN.
- **Backend dedicado:** el servicio Fastify permite separar el backend cuando
  crezcan las integraciones (autenticación robusta, colas, servicios de terceros,
  ETL de datos de monitoreo).
- **Multi-nube / portabilidad:** al empaquetar en contenedores y usar Terraform, la
  solución no queda atada a un proveedor y puede licitarse/migrarse entre AWS,
  Google Cloud o Azure.
- **Observabilidad:** métricas, logs y trazas centralizadas + alertamiento.

---

## 6. Arquitectura segura (seguridad por diseño)

La seguridad es un requisito de primer orden y la arquitectura la aborda en capas
(*defense in depth*), con controles estándar de la industria en cada nivel:

- **Perímetro / borde:**
  - **TLS/HTTPS** obligatorio en todo el tráfico; certificados gestionados.
  - **WAF** (Web Application Firewall) y **protección anti-DDoS** en el borde
    (AWS WAF+Shield / Google Cloud Armor / Azure WAF+DDoS Protection).
  - **CDN** que absorbe y filtra tráfico antes de llegar al origen.
- **Aplicación:**
  - **Validación y saneamiento de entradas** en cada endpoint (tipos, campos
    requeridos, RUT con dígito verificador), reduciendo inyección y datos
    inválidos.
  - Consultas parametrizadas vía **ORM (Prisma/Drizzle)** → mitiga **inyección
    SQL** por diseño.
  - **React/Next.js** escapan el contenido por defecto → mitiga **XSS**.
  - **Rate limiting** y protección de formularios (throttling / CAPTCHA opcional)
    contra abuso y bots.
  - Cabeceras de seguridad (CSP, HSTS, X-Content-Type-Options, etc.).
- **Identidad y acceso:**
  - Panel administrativo protegido; en producción se recomienda **OIDC/OAuth 2.0**
    con el proveedor corporativo (AWS Cognito / Google Identity Platform / Azure
    Entra ID) y **MFA**.
  - **Principio de menor privilegio** con **IAM** por rol para los servicios.
- **Datos:**
  - **Cifrado en reposo** (base de datos y almacenamiento de objetos) y **en
    tránsito** (TLS extremo a extremo).
  - **Gestión de secretos** en un *secret manager* (AWS Secrets Manager / Google
    Secret Manager / Azure Key Vault) — nunca credenciales en el código.
  - **Base de datos en subred privada**, sin exposición pública directa.
  - **Backups automáticos** y punto-de-recuperación (PITR) para continuidad.
- **Operación y cumplimiento:**
  - **Aislamiento por ambiente** (dev/staging/producción) vía Terraform.
  - **Registros de auditoría** y trazabilidad de acciones administrativas.
  - **Monitoreo y alertamiento** de seguridad (accesos anómalos, errores).
  - Análisis de dependencias (SCA) y estático (SAST) integrables en el CI.
  - Nubes con certificaciones (ISO 27001, SOC 2, etc.) que apoyan el cumplimiento.

## 7. Alta concurrencia, escalabilidad y disponibilidad

La arquitectura está pensada para **soportar un alto número de usuarios
concurrentes** de forma elástica:

- **Escalado horizontal automático:** el cómputo (contenedores/serverless) agrega o
  reduce instancias según la carga (**auto-scaling**), sin intervención manual;
  serverless puede escalar prácticamente a demanda.
- **Balanceo de carga:** un *load balancer* distribuye el tráfico entre instancias
  para evitar cuellos de botella.
- **Contenido cacheado en CDN:** las páginas y recursos estáticos (gran parte del
  sitio, al ser mayormente de consulta pública) se sirven desde la **CDN global**,
  descargando al origen y respondiendo cerca del usuario. Esto permite atender
  picos masivos de lectura (por ejemplo, ante una noticia o instancia de
  participación) con latencia baja.
- **Renderizado eficiente:** los **React Server Components** y la generación
  estática reducen el trabajo por solicitud.
- **Base de datos escalable:** PostgreSQL gestionado con **réplicas de lectura**
  para distribuir consultas, **pooling de conexiones** y opción de motores de alto
  rendimiento (Aurora/AlloyDB) para grandes volúmenes; una **caché Redis** puede
  absorber lecturas calientes.
- **Almacenamiento de objetos** (S3/GCS/Blob) para PDFs, con capacidad y ancho de
  banda prácticamente ilimitados vía CDN.
- **Sin estado en el cómputo (stateless):** las instancias no guardan estado local,
  por lo que se pueden replicar sin límite; el estado vive en la base de datos y el
  almacenamiento gestionados.
- **Alta disponibilidad:** despliegue **multi-zona** (multi-AZ) con conmutación por
  error de base de datos y redundancia de instancias → tolerancia a fallos.
- **Verificable:** la suite E2E y la posibilidad de **pruebas de carga** (k6,
  Artillery) permiten dimensionar y validar la capacidad antes de eventos de alto
  tráfico.

## 8. Por qué este stack es una buena decisión (síntesis para la propuesta)

- **Tecnologías de punta y vigentes:** Next.js 16, React 19, TypeScript 6 y
  Tailwind 4 son las versiones más recientes y ampliamente adoptadas de un
  ecosistema líder — no tecnologías experimentales ni de nicho.
- **Base de datos robusta y estándar:** PostgreSQL, relacional, ACID, con soporte
  gestionado en AWS, Google Cloud y Azure, y capacidades geoespaciales (PostGIS).
- **Sin dependencia de un único proveedor:** aplicación portable (contenedores +
  IaC), desplegable en cualquiera de las tres nubes principales.
- **Robustez comprobada:** herramientas usadas por empresas de primer nivel a
  escala global, con soporte activo y comunidad masiva.
- **Calidad asegurada:** tipado estricto + pruebas automatizadas (unitarias, de
  contrato, E2E y accesibilidad) en integración continua.
- **Escalable y evolutiva:** monorepo y separación de contratos de datos permiten
  crecer (réplicas, backend dedicado, ETL, geoespacial) sin reescribir la app.
- **Seguridad por diseño (defense in depth):** TLS/WAF + anti-DDoS en el borde,
  cifrado en reposo y tránsito, base de datos en red privada, gestión de secretos,
  autenticación estándar (OIDC/OAuth 2.0 + MFA), auditoría y nubes certificadas
  (ISO 27001 / SOC 2). La protección de datos es prioridad de la arquitectura.
- **Alta concurrencia y disponibilidad:** escalado horizontal automático, balanceo
  de carga, CDN global para picos masivos de lectura, cómputo *stateless*, réplicas
  de base de datos y despliegue multi-zona → soporta muchos usuarios simultáneos y
  tolera fallos.
```
