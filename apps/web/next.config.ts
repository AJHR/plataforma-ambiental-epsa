import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // En el monorepo, la raíz de trazado es la carpeta del repo (dos niveles
  // arriba de apps/web), para poder empaquetar la carpeta data/.
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
  // Fuerza incluir los datos semilla (data/) en el bundle de las rutas API.
  // Sin esto, Next no los detecta (las rutas se construyen dinámicamente) y
  // no estarían disponibles en el runtime de Vercel.
  outputFileTracingIncludes: {
    "/api/**": ["../../data/**/*.json"],
  },
  images: {
    // Fuentes de imágenes permitidas (ver docs/assets-credits.md):
    // - picsum.photos: placeholders de desarrollo (sin API key)
    // - images.unsplash.com: imágenes definitivas (licencia libre uso comercial)
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
