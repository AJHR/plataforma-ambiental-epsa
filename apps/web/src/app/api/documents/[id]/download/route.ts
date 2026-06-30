import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import { dataPath, readJson, jsonError } from "@/lib/dataStore";

interface DocumentMeta {
  id: string;
  fileName: string;
  [key: string]: unknown;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Sanitize id: only allow alphanumeric, dashes, underscores
  if (!/^[\w-]+$/.test(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  // Look up the original file name from meta (best-effort).
  let fileName = `${id}.pdf`;
  try {
    const documents = await readJson<DocumentMeta[]>("documents/meta.json", []);
    const doc = documents.find((d) => d.id === id);
    if (doc?.fileName) {
      fileName = doc.fileName;
    }
  } catch {
    // If meta read fails, fall back to id-based name
  }

  try {
    const bytes = await fs.readFile(dataPath("documents", "files", `${id}.pdf`));
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(bytes.byteLength),
        "Content-Disposition": `attachment; filename="${fileName}"`,
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
