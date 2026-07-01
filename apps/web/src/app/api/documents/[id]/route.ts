import { NextResponse } from "next/server";
import { readJson, jsonError } from "@/lib/dataStore";

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
    const documents = await readJson<DocumentMeta[]>("documents/meta.json");

    const document = documents.find((doc) => doc.id === id);
    if (!document) {
      return NextResponse.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: document });
  } catch (err) {
    return jsonError(err);
  }
}
