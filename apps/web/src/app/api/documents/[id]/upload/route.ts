import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import { dataPath, readJson, writeJson, jsonError } from "@/lib/dataStore";

export const runtime = "nodejs";

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
    const filesDir = dataPath("documents", "files");
    await fs.mkdir(filesDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(dataPath("documents", "files", `${id}.pdf`), buffer);

    // Update meta.json with new sizeBytes (best-effort).
    try {
      const documents = await readJson<DocumentMeta[]>("documents/meta.json");
      const docIndex = documents.findIndex((d) => d.id === id);
      if (docIndex !== -1) {
        documents[docIndex].sizeBytes = buffer.byteLength;
        await writeJson("documents/meta.json", documents);
      }
    } catch {
      // Meta update is best-effort; file was already saved
    }

    return NextResponse.json({
      data: { id, sizeBytes: buffer.byteLength, path: `documents/files/${id}.pdf` },
    });
  } catch (err) {
    return jsonError(err);
  }
}
