import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Acceso centralizado a los archivos de datos (data/) para las rutas API.
 * Evita repetir en cada ruta la resolución de DATA_DIR, el read/parse, la
 * escritura y el manejo de errores. Las escrituras son atómicas (tmp + rename).
 */

export const DATA_DIR =
  process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

/** Construye una ruta absoluta dentro de DATA_DIR. */
export function dataPath(...segments: string[]): string {
  return path.join(DATA_DIR, ...segments);
}

function isENOENT(err: unknown): boolean {
  return (err as NodeJS.ErrnoException)?.code === "ENOENT";
}

/** Lee y parsea un JSON dentro de DATA_DIR. Lanza si no existe. */
export async function readJson<T>(relPath: string): Promise<T>;
/** Lee y parsea un JSON; devuelve `fallback` si el archivo no existe (ENOENT). */
export async function readJson<T>(relPath: string, fallback: T): Promise<T>;
export async function readJson<T>(relPath: string, fallback?: T): Promise<T> {
  try {
    const raw = await fs.readFile(dataPath(relPath), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if (arguments.length >= 2 && isENOENT(err)) {
      return fallback as T;
    }
    throw err;
  }
}

/** Escribe un JSON de forma atómica (escribe a tmp y renombra). */
export async function writeJson(relPath: string, data: unknown): Promise<void> {
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
