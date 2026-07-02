import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/**
 * Acceso centralizado a los archivos de datos (data/) para las rutas API.
 *
 * Dos modos de almacenamiento, según entorno:
 *  - Desarrollo / tests (sin credenciales KV): se lee y escribe en el sistema
 *    de archivos local (carpeta data/). Escrituras atómicas (tmp + rename).
 *  - Producción (Vercel + Vercel KV / Upstash Redis): las lecturas consultan
 *    primero Redis; si la clave aún no existe se devuelve el dato semilla
 *    empaquetado (data/) y las escrituras persisten en Redis. Así los
 *    formularios (reclamos MIAQR, boletín, etc.) guardan datos de forma
 *    permanente, ya que el filesystem de Vercel es de solo lectura.
 */

export const DATA_DIR =
  process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

// Credenciales de KV: Vercel KV inyecta KV_REST_API_*; una integración
// directa de Upstash usa UPSTASH_REDIS_REST_*. Se admiten ambas.
const redisUrl =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

/** Prefijo de las claves en Redis para no chocar con otros datos. */
function kvKey(relPath: string): string {
  return `data:${relPath}`;
}

/** Construye una ruta absoluta dentro de DATA_DIR. */
export function dataPath(...segments: string[]): string {
  return path.join(DATA_DIR, ...segments);
}

function isENOENT(err: unknown): boolean {
  return (err as NodeJS.ErrnoException)?.code === "ENOENT";
}

/** Lee el dato semilla desde el filesystem (data/). undefined si no existe. */
async function readSeed<T>(relPath: string): Promise<T | undefined> {
  try {
    const raw = await fs.readFile(dataPath(relPath), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if (isENOENT(err)) return undefined;
    throw err;
  }
}

/** Lee y parsea un JSON dentro de DATA_DIR. Lanza si no existe. */
export async function readJson<T>(relPath: string): Promise<T>;
/** Lee y parsea un JSON; devuelve `fallback` si el archivo no existe (ENOENT). */
export async function readJson<T>(relPath: string, fallback: T): Promise<T>;
export async function readJson<T>(relPath: string, fallback?: T): Promise<T> {
  const hasFallback = arguments.length >= 2;

  if (redis) {
    const stored = await redis.get<T>(kvKey(relPath));
    if (stored !== null && stored !== undefined) return stored;
    // Aún no hay valor en KV: devolvemos la semilla empaquetada.
    const seed = await readSeed<T>(relPath);
    if (seed !== undefined) return seed;
    if (hasFallback) return fallback as T;
    throw new Error(`No existe el recurso de datos: ${relPath}`);
  }

  try {
    const raw = await fs.readFile(dataPath(relPath), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if (hasFallback && isENOENT(err)) {
      return fallback as T;
    }
    throw err;
  }
}

/** Escribe un JSON. En producción persiste en KV; en local, atómico en disco. */
export async function writeJson(relPath: string, data: unknown): Promise<void> {
  if (redis) {
    await redis.set(kvKey(relPath), data);
    return;
  }
  const target = dataPath(relPath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  const tmp = `${target}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmp, target);
}

/** Respuesta de error JSON estándar para las rutas API. */
export function jsonError(err: unknown, status = 500): NextResponse {
  const message =
    err instanceof Error ? err.message : "Error interno del servidor";
  return NextResponse.json({ error: message }, { status });
}
