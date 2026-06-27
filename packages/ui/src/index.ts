// @repo/ui — Design system de la Plataforma EPSA.
// Los componentes React viven en apps/web/src/components/ (App Router).
// Este paquete exporta tokens, constantes de diseño y utilidades sin dependencias de React.
// Importar los tokens CSS con:  import "@repo/ui/tokens.css";

export const UI_PACKAGE = "@repo/ui";

// Design token values (mirrors tokens.css) — útil en tests y en configuraciones de herramientas
export const COLOR_TOKENS = {
  primary: "#1f4d3a",
  primary600: "#2a6349",
  accent: "#7cb342",
  accent700: "#3f6b1e",
  accentForeground: "#14241b",
  eco: "#2e8b57",
  cta: "#bf6b3a",
  semaOk: "#2e8b57",
  semaWarn: "#b8860b",
  semaBad: "#c0392b",
  ink: "#1c2b22",
  muted: "#5e6b60",
  line: "#dde3d8",
  surface: "#ffffff",
  bg: "#f5f2ec",
  bgDeep: "#14241b",
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
