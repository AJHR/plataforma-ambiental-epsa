# Proyecto: plataforma-ambiental-epsa

## Comandos
- `pnpm dev` — levanta web y api en paralelo (Turbo)
- `pnpm build` — build de producción
- `pnpm test` — Vitest
- `pnpm lint` — ESLint
- `pnpm typecheck` — tsc --noEmit en todo el workspace

## Arquitectura
- Monorepo pnpm + Turborepo
- apps/web: Next.js App Router, React, Server Components por defecto
- apps/api: Fastify + TS
- packages/types: contrato API compartido (fuente de verdad de tipos)

## Convenciones
- TypeScript strict, prohibido `any`
- Conventional Commits, en imperativo
- Tests para toda feature nueva

## No hacer
- No push directo a main
- No modificar packages/types sin actualizar web y api
