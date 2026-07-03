# Política de assets — Imágenes e íconos

Reglas del proyecto para fotos e íconos. **Obligatorio** seguirlas en todo el equipo.

## Fotografías

### Desarrollo / placeholders
- Usar **[picsum.photos](https://picsum.photos)** o la **API de Unsplash**. No descargar archivos al repo.
- Ejemplo: `https://picsum.photos/seed/<seed>/<w>/<h>`.

### Imágenes definitivas
- **Solo** de **[Unsplash](https://unsplash.com)**, **[Pexels](https://pexels.com)** o **[Pixabay](https://pixabay.com)** (licencia libre con uso comercial).
- **Nunca** usar imágenes con personas, marcas o edificios reconocibles sin verificar el release.
- Priorizar **naturaleza / paisaje sin rostros**, coherente con la temática ambiental.
- Cargar siempre vía `next/image`; los hosts permitidos se configuran en `apps/web/next.config.ts` (`images.remotePatterns`).

### Claves de API
- La key de Unsplash va en variable de entorno **server-side** (`UNSPLASH_ACCESS_KEY`, ver `apps/web/.env.example`).
- **Prohibido** el prefijo `NEXT_PUBLIC_` para la key: nunca debe quedar expuesta en el bundle del cliente.

### Registro de imágenes definitivas
Por cada imagen definitiva que entre al producto, registrar aquí su origen y licencia:

El catálogo vive en `apps/web/src/lib/images.ts` (mapa `key → { src, alt }`). Todas
son fotos de **mar / agua / costa sin rostros** (identidad portuaria), servidas vía
`images.unsplash.com`.

| Clave (`images.ts`) | Uso en la UI | URL de origen | Fuente | Licencia |
| --- | --- | --- | --- | --- |
| `heroMar` | Hero Home | https://unsplash.com/photos/photo-1505142468610-359e7d316be0 | Unsplash | Unsplash License |
| `proyectoHero` | Hero El Proyecto | https://unsplash.com/photos/photo-1518837695005-2083093ee35b | Unsplash | Unsplash License |
| `seguimientoHeader` | Header Seguimiento | https://unsplash.com/photos/photo-1470115636492-6d2b56f9146d | Unsplash | Unsplash License |
| `aguaDetalle` | Bloque "Compromiso" (Home) | https://unsplash.com/photos/photo-1468421870903-4df1664ac249 | Unsplash | Unsplash License |
| `mar` | Bloque "Descripción" (Proyecto) | https://unsplash.com/photos/photo-1507525428034-b723cf961d3e | Unsplash | Unsplash License |
| `modProyecto` | Tarjeta módulo El Proyecto | https://unsplash.com/photos/photo-1518837695005-2083093ee35b | Unsplash | Unsplash License |
| `modSeguimiento` | Tarjeta módulo Seguimiento | https://unsplash.com/photos/photo-1468421870903-4df1664ac249 | Unsplash | Unsplash License |
| `modParticipa` | Tarjeta módulo Participa | https://unsplash.com/photos/photo-1507525428034-b723cf961d3e | Unsplash | Unsplash License |
| `modAprende` | Tarjeta módulo Aprende | https://unsplash.com/photos/photo-1505142468610-359e7d316be0 | Unsplash | Unsplash License |

> Para cambiar una imagen, edita solo `apps/web/src/lib/images.ts` (la UI no se toca)
> y actualiza esta tabla.

## Logo de Puerto San Antonio

El logo institucional debe colocarse en `apps/web/public/logo-puerto.svg` (o `.png`).
El sitio oficial (`puertosanantonio.com`) no es accesible desde el entorno de CI
para descargarlo automáticamente, y es un **activo de marca de terceros**: debe
incorporarse con la autorización correspondiente. Mientras no exista el archivo, la
navbar usa un wordmark "EPSA" tipográfico con los tokens de marca.

## Íconos

- Librería **única**: **[lucide-react](https://lucide.dev)**. No mezclar otros sets.
- **Imports selectivos** (tree-shaking), nunca el paquete completo:
  ```tsx
  import { Leaf, Wind } from "lucide-react"; // ✅
  // import * as Icons from "lucide-react";  // ❌
  ```
