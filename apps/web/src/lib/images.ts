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
  // Bosque aéreo — hero home
  heroBosque: {
    src: UNSPLASH("1441974231531-c6227db76b6e"),
    alt: "Vista aérea de un bosque verde frondoso",
  },
  // Costa / mar — proyecto
  costa: {
    src: UNSPLASH("1505142468610-359e7d316be0"),
    alt: "Costa con olas rompiendo sobre rocas",
  },
  // Hojas con rocío — compromiso / transparencia
  hojasRocio: {
    src: UNSPLASH("1466692476868-aef1dfb1e735"),
    alt: "Hojas verdes cubiertas de gotas de rocío",
  },
  // Módulo: El Proyecto (mapa/territorio)
  modProyecto: {
    src: UNSPLASH("1500382017468-9049fed747ef"),
    alt: "Paisaje de campos verdes vistos desde lo alto",
  },
  // Módulo: Seguimiento (agua/medición)
  modSeguimiento: {
    src: UNSPLASH("1468421870903-4df1664ac249"),
    alt: "Superficie de agua clara reflejando la luz",
  },
  // Módulo: Participa (comunidad/manos-naturaleza, sin rostros)
  modParticipa: {
    src: UNSPLASH("1530836369250-ef72a3f5cda8"),
    alt: "Manos sosteniendo una pequeña planta con tierra",
  },
  // Módulo: Aprende (bosque/educación)
  modAprende: {
    src: UNSPLASH("1507413245164-6160d8298b31"),
    alt: "Sendero entre árboles altos de un bosque",
  },
  // Seguimiento — header
  seguimientoHeader: {
    src: UNSPLASH("1470115636492-6d2b56f9146d"),
    alt: "Lago de montaña con aguas tranquilas",
  },
  // El Proyecto — hero
  proyectoHero: {
    src: UNSPLASH("1518837695005-2083093ee35b"),
    alt: "Vista de la costa y el océano al atardecer",
  },
  // Vegetación nativa — bloque editorial
  vegetacion: {
    src: UNSPLASH("1502082553048-f009c37129b9"),
    alt: "Follaje denso de vegetación nativa",
  },
} as const satisfies Record<string, ImageAsset>;

export type ImageKey = keyof typeof IMAGES;

/** Construye la URL de Unsplash con parámetros de optimización. */
export function imageUrl(asset: ImageAsset, width = 1600): string {
  return `${asset.src}?auto=format&fit=crop&q=80&w=${width}`;
}
