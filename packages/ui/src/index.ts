// @repo/ui — Design system de la Plataforma EPSA.
// Los componentes React viven en apps/web/src/components/ (App Router).
// Este paquete exporta tokens, constantes de diseño y utilidades sin dependencias de React.
// Importar los tokens CSS con:  import "@repo/ui/tokens.css";

export const UI_PACKAGE = "@repo/ui";

// Design token values (mirrors tokens.css) — útil en tests y en configuraciones de herramientas
export const COLOR_TOKENS = {
  primary: "#0e5c8a",
  primary600: "#1577b0",
  accent: "#38b6e8",
  accent700: "#0e6fa8",
  accentForeground: "#07293b",
  eco: "#1597b8",
  cta: "#e0742e",
  semaOk: "#2e8b57",
  semaWarn: "#b8860b",
  semaBad: "#c0392b",
  ink: "#122a38",
  muted: "#5a6b78",
  line: "#d6e2ea",
  surface: "#ffffff",
  bg: "#f1f6f9",
  bgDeep: "#082235",
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
