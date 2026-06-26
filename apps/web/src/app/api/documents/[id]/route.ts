import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

interface DocumentMeta {
  id: string;
  title: string;
  description: string;
  fileName: string;
  sizeBytes: number;
  version: string;
  status: string;
  createdAt: string;
  category: string;
  author: string;
  rcaCommitment: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const filePath = path.join(DATA_DIR, "documents", "meta.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const documents = JSON.parse(raw) as DocumentMeta[];

    const document = documents.find((doc) => doc.id === id);
    if (!document) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: document });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
