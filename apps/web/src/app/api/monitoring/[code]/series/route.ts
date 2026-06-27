import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

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
    const filePath = path.join(DATA_DIR, "monitoring", `${code}.json`);
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as unknown;
    return NextResponse.json({ data });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json(
        { data: { componentCode: code, points: [] } },
        { status: 200 }
      );
    }
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
