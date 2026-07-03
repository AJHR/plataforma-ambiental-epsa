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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    let documents = await readJson<DocumentMeta[]>("documents/meta.json");

    if (statusFilter) {
      documents = documents.filter((doc) => doc.status === statusFilter);
    }

    return NextResponse.json({ data: documents });
  } catch (err) {
    return jsonError(err);
  }
}
