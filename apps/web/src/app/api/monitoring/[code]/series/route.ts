import { NextResponse } from "next/server";
import { readJson, jsonError } from "@/lib/dataStore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Sanitize: only allow alphanumeric, dashes, underscores
  if (!/^[\w-]+$/.test(code)) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }

  try {
    // Si el archivo no existe, devolvemos una serie vacía (200).
    const data = await readJson<unknown>(`monitoring/${code}.json`, {
      componentCode: code,
      points: [],
    });
    return NextResponse.json({ data });
  } catch (err) {
    return jsonError(err);
  }
}
