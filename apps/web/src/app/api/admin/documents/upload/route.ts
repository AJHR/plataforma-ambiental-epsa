import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import { verifyAdminToken } from "@/lib/adminAuth";
import { dataPath, readJson, writeJson, jsonError } from "@/lib/dataStore";

export const runtime = "nodejs";

interface DocumentMeta {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  sizeBytes: number;
  version: string;
  status: string;
  createdAt: string;
}

function nextDocId(documents: DocumentMeta[]): string {
  let max = 0;
  for (const d of documents) {
    const m = d.id.match(/^doc-(\d+)$/);
    if (m) max = Math.max(max, parseInt(m[1]!, 10));
  }
  return `doc-${String(max + 1).padStart(3, "0")}`;
}

export async function POST(request: Request) {
  if (!verifyAdminToken(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  const file = formData.get("file");
  const title = formData.get("title");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Campo 'file' requerido" }, { status: 400 });
  }
  if (typeof title !== "string" || title.trim() === "") {
    return NextResponse.json({ error: "Campo 'title' requerido" }, { status: 400 });
  }

  try {
    // meta.json puede no existir todavía; partimos de cero.
    const documents = await readJson<DocumentMeta[]>("documents/meta.json", []);

    const id = nextDocId(documents);
    const originalName =
      file instanceof File && file.name ? file.name : `${id}.pdf`;

    // Guardar el archivo (binario).
    await fs.mkdir(dataPath("documents", "files"), { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(dataPath("documents", "files", `${id}.pdf`), buffer);

    const newDoc: DocumentMeta = {
      id,
      title: title.trim(),
      fileName: originalName,
      sizeBytes: buffer.byteLength,
      version: "1.0",
      status: "publicado",
      createdAt: new Date().toISOString(),
    };

    documents.push(newDoc);
    await writeJson("documents/meta.json", documents);

    return NextResponse.json({ data: newDoc }, { status: 201 });
  } catch (err) {
    return jsonError(err);
  }
}
