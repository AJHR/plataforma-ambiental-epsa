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

| Ubicación en la UI | URL de origen | Autor | Fuente | Licencia |
| --- | --- | --- | --- | --- |
| _(ejemplo)_ Hero landing | https://unsplash.com/photos/XXXX | — | Unsplash | Unsplash License |

> Mientras se usen placeholders de `picsum.photos` no es necesario registrarlos (son de desarrollo).

## Íconos

- Librería **única**: **[lucide-react](https://lucide.dev)**. No mezclar otros sets.
- **Imports selectivos** (tree-shaking), nunca el paquete completo:
  ```tsx
  import { Leaf, Wind } from "lucide-react"; // ✅
  // import * as Icons from "lucide-react";  // ❌
  ```
