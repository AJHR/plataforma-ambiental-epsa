import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Sanitize id: only allow alphanumeric, dashes, underscores
  if (!/^[\w-]+$/.test(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const filePath = path.join(DATA_DIR, "documents", "files", `${id}.pdf`);

  try {
    const bytes = await fs.readFile(filePath);
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(bytes.byteLength),
      },
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "Archivo no disponible" }, { status: 404 });
    }
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
