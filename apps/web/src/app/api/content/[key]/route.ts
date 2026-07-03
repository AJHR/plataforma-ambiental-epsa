import { NextResponse } from "next/server";
import { readJson, jsonError } from "@/lib/dataStore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  // Sanitize key: only allow alphanumeric, dashes, underscores
  if (!/^[\w-]+$/.test(key)) {
    return NextResponse.json({ error: "Clave inválida" }, { status: 400 });
  }

  try {
    const data = await readJson<unknown>(`content/${key}.json`);
    return NextResponse.json({ data });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json(
        { error: "Contenido no encontrado" },
        { status: 404 }
      );
    }
    return jsonError(err);
  }
}
