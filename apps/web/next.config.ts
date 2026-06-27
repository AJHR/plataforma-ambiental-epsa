import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
