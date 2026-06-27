import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

interface DocumentMeta {
  id: string;
  fileName: string;
  sizeBytes: number;
  [key: string]: unknown;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Sanitize id: only allow alphanumeric, dashes, underscores
  if (!/^[\w-]+$/.test(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Campo 'file' requerido" }, { status: 400 });
  }

  try {
    const filesDir = path.join(DATA_DIR, "documents", "files");
    await fs.mkdir(filesDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const destPath = path.join(filesDir, `${id}.pdf`);
    await fs.writeFile(destPath, buffer);

    // Update meta.json with new sizeBytes
    const metaPath = path.join(DATA_DIR, "documents", "meta.json");
    try {
      const metaRaw = await fs.readFile(metaPath, "utf-8");
      const documents = JSON.parse(metaRaw) as DocumentMeta[];
      const docIndex = documents.findIndex((d) => d.id === id);
      if (docIndex !== -1) {
        documents[docIndex].sizeBytes = buffer.byteLength;
        await fs.writeFile(metaPath, JSON.stringify(documents, null, 2), "utf-8");
      }
    } catch {
      // Meta update is best-effort; file was already saved
    }

    return NextResponse.json({
      data: { id, sizeBytes: buffer.byteLength, path: `documents/files/${id}.pdf` },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
