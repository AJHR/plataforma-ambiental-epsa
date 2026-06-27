# @repo/web — Plataforma Ambiental EPSA

App Next.js (App Router, React Server Components por defecto) de la plataforma de
información ambiental del Puerto Exterior de San Antonio.

## Sistema de diseño

Estética **"natural-tech"**: moderna, sobria, mucho espacio en blanco, jerarquía
clara y tipografía serena. Mobile-first y accesible (WCAG AA).

### Tokens (fuente de verdad)

Todos los design tokens viven en **`packages/config/theme.css`** como bloque
`@theme` de **Tailwind v4**. De ahí se derivan a la vez:

1. **Utilidades Tailwind** → `bg-primary`, `text-ink`, `rounded-md`, `shadow-card`, `font-sans`…
2. **CSS vars** → `var(--color-primary)`, `var(--radius-md)`… (retro-compat con estilos inline).

`apps/web/src/app/globals.css` importa Tailwind y el theme:

```css
@import "tailwindcss";
@import "@repo/config/theme.css";
```

> **Prohibido hardcodear colores/medidas en componentes.** Cambiar la marca =
> editar solo `theme.css`; los componentes no se tocan.

#### Paleta

| Token | Valor | Uso |
| --- | --- | --- |
| `primary` | `#1F4D3A` | Verde bosque profundo — acciones, marca |
| `primary-600` | `#2A6349` | Hover / degradados |
| `accent` | `#7CB342` | Savia/lima — destacados (texto oscuro encima) |
| `accent-700` | `#3F6B1E` | Acento como texto/links sobre claro (AA) |
| `cta` | `#BF6B3A` | Terracota — segundo acento cálido |
| `ink` | `#1C2B22` | Texto principal |
| `muted` | `#5E6B60` | Texto secundario |
| `bg` | `#F5F2EC` | Fondo de página (arena cálida) |
| `surface` | `#FFFFFF` | Tarjetas |
| `bg-deep` | `#14241B` | Footer / fin de degradado |
| `sema-ok/warn/bad` | verde/ámbar/rojo | Semáforo ambiental |

Contraste verificado WCAG AA (texto ≥ 4.5:1, UI ≥ 3:1). El acento lima usa
**texto oscuro** (nunca blanco) para cumplir contraste.

### Tipografía

**Inter** vía `next/font/google` (`apps/web/src/app/layout.tsx`), expuesta como
`--font-inter` → `--font-sans`. Escala definida en `theme.css` (`--text-xs`…`--text-5xl`).

### Componentes base

En `apps/web/src/components/ui/` (consumen tokens, sin valores mágicos):

```tsx
import { Button, Card, Container, Section, Heading } from "@/components/ui";
```

- **Button** — variantes `primary | outline | ghost`, tamaños `sm | md | lg`, foco visible.
- **Card** — superficie con borde, radio y sombra (`elevated` para destacar).
- **Container** — ancho máximo + padding responsivo (`narrow | default | wide`).
- **Section** — banda vertical con tono (`default | muted | deep`) y `fullBleed` para heros.
- **Heading** — niveles h1–h4 con escala tipográfica coherente.

### Landing de ejemplo

`/landing` demuestra el sistema: hero full-bleed con imagen, features con íconos
y un bloque de datos/dashboard simple.

## Assets (fotos e íconos)

Reglas completas en [`docs/assets-credits.md`](../../docs/assets-credits.md). Resumen:

- **Fotos**: placeholders con `picsum.photos`; definitivas solo de Unsplash/Pexels/Pixabay
  (libre uso comercial), naturaleza sin rostros. Cargar con `next/image`; hosts en `next.config.ts`.
- **Key de Unsplash**: server-side (`UNSPLASH_ACCESS_KEY`, ver `.env.example`), nunca `NEXT_PUBLIC_`.
- **Íconos**: solo `lucide-react`, imports selectivos (tree-shaking).

## Scripts

```bash
pnpm dev        # desarrollo
pnpm build      # build de producción
pnpm typecheck  # tsc --noEmit
```
