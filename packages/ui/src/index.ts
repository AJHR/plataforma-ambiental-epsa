// @repo/ui — Design system de la Plataforma EPSA.
// Los componentes React viven en apps/web/src/components/ (App Router).
// Este paquete exporta tokens, constantes de diseño y utilidades sin dependencias de React.
// Importar los tokens CSS con:  import "@repo/ui/tokens.css";

export const UI_PACKAGE = "@repo/ui";

// Design token values (mirrors tokens.css) — útil en tests y en configuraciones de herramientas
export const COLOR_TOKENS = {
  primary: "#003b5c",
  primary600: "#0b5c87",
  accent: "#009fe3",
  accent700: "#0277b6",
  eco: "#2e8b57",
  cta: "#e8743b",
  semaOk: "#2e8b57",
  semaWarn: "#e0a800",
  semaBad: "#c0392b",
  ink: "#1a2b3c",
  muted: "#5b6b7b",
  line: "#d9e1e8",
  surface: "#ffffff",
  bg: "#f5f8fa",
  bgDeep: "#002a41",
} as const;

export const RADIUS_TOKENS = {
  sm: "8px",
  md: "12px",
  lg: "20px",
  full: "999px",
} as const;

// Navigation items for use in Navbar and other components
export const NAV_LINKS = [
  { href: "/proyecto", label: "El Proyecto" },
  { href: "/seguimiento", label: "Seguimiento" },
  { href: "/participa", label: "Participa" },
  { href: "/aprende", label: "Aprende" },
  { href: "/boletines", label: "Boletines" },
  { href: "/documentos", label: "Documentos" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
