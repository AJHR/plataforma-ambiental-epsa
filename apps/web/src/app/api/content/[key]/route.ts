import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  // Sanitize key: only allow alphanumeric, dashes, underscores
  if (!/^[\w-]+$/.test(key)) {
    return NextResponse.json({ error: "Clave inválida" }, { status: 400 });
  }

  try {
    const filePath = path.join(DATA_DIR, "content", `${key}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as unknown;
    return NextResponse.json({ data });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "Contenido no encontrado" }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
