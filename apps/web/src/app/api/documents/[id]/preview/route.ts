import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import { dataPath, jsonError } from "@/lib/dataStore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Sanitize id: only allow alphanumeric, dashes, underscores
  if (!/^[\w-]+$/.test(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const bytes = await fs.readFile(dataPath("documents", "files", `${id}.pdf`));
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(bytes.byteLength),
      },
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json(
        { error: "Archivo no disponible" },
        { status: 404 }
      );
    }
    return jsonError(err);
  }
}
