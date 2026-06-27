import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

export async function GET() {
  try {
    const filePath = path.join(DATA_DIR, "newsletter", "bulletins.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as unknown;
    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
