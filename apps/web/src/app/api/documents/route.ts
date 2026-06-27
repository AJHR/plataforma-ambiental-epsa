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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    const filePath = path.join(DATA_DIR, "documents", "meta.json");
    const raw = await fs.readFile(filePath, "utf-8");
    let documents = JSON.parse(raw) as DocumentMeta[];

    if (statusFilter) {
      documents = documents.filter((doc) => doc.status === statusFilter);
    }

    return NextResponse.json({ data: documents });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
