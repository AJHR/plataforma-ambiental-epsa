// Catálogo de imágenes curadas (Unsplash, naturaleza/paisaje sin rostros).
// Política y créditos: docs/assets-credits.md. Hosts permitidos: next.config.ts.
// URLs directas de images.unsplash.com (sin API key). Reemplazables sin tocar UI.

export interface ImageAsset {
  /** URL base de Unsplash (sin params de tamaño; se agregan al construir). */
  src: string;
  /** Texto alternativo descriptivo (accesibilidad). */
  alt: string;
}

const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const IMAGES = {
  // Hero Home — olas sobre la costa
  heroMar: {
    src: UNSPLASH("1505142468610-359e7d316be0"),
    alt: "Olas del mar rompiendo sobre la costa rocosa",
  },
  // Hero El Proyecto — costa y océano
  proyectoHero: {
    src: UNSPLASH("1518837695005-2083093ee35b"),
    alt: "Vista de la costa y el océano al atardecer",
  },
  // Header Seguimiento — superficie de agua
  seguimientoHeader: {
    src: UNSPLASH("1470115636492-6d2b56f9146d"),
    alt: "Cuerpo de agua de aguas tranquilas",
  },
  // Bloque "Compromiso" — detalle de agua
  aguaDetalle: {
    src: UNSPLASH("1468421870903-4df1664ac249"),
    alt: "Superficie de agua clara reflejando la luz",
  },
  // Bloque editorial El Proyecto — mar abierto
  mar: {
    src: UNSPLASH("1507525428034-b723cf961d3e"),
    alt: "Aguas turquesas del mar junto a una playa",
  },
  // Módulo: El Proyecto (costa)
  modProyecto: {
    src: UNSPLASH("1518837695005-2083093ee35b"),
    alt: "Costa y océano al atardecer",
  },
  // Módulo: Seguimiento (agua / medición)
  modSeguimiento: {
    src: UNSPLASH("1468421870903-4df1664ac249"),
    alt: "Superficie de agua clara",
  },
  // Módulo: Participa (mar abierto)
  modParticipa: {
    src: UNSPLASH("1507525428034-b723cf961d3e"),
    alt: "Aguas turquesas del mar",
  },
  // Módulo: Aprende (olas)
  modAprende: {
    src: UNSPLASH("1505142468610-359e7d316be0"),
    alt: "Olas del mar sobre la costa",
  },
} as const satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof IMAGES;

/** Construye la URL de Unsplash con parámetros de optimización. */
export function imageUrl(asset: ImageAsset, width = 1600): string {
  return `${asset.src}?auto=format&fit=crop&q=80&w=${width}`;
}
