import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { verifyAdminToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

interface SeriesPayload {
  componentCode: string;
  points: { date: string; value: number; unit: string; threshold?: number }[];
}

function isValidPayload(v: unknown): v is SeriesPayload {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  if (typeof o.componentCode !== "string" || !/^[\w-]+$/.test(o.componentCode)) {
    return false;
  }
  if (!Array.isArray(o.points)) return false;
  return o.points.every(
    (p) =>
      typeof p === "object" &&
      p !== null &&
      typeof (p as Record<string, unknown>).date === "string" &&
      typeof (p as Record<string, unknown>).value === "number" &&
      typeof (p as Record<string, unknown>).unit === "string"
  );
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
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Campo 'file' requerido" }, { status: 400 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    return NextResponse.json(
      { error: "El archivo debe ser un JSON válido" },
      { status: 400 }
    );
  }

  if (!isValidPayload(parsed)) {
    return NextResponse.json(
      {
        error:
          "Formato inválido. Se espera { componentCode, points: [{ date, value, unit }] }",
      },
      { status: 400 }
    );
  }

  try {
    const dir = path.join(DATA_DIR, "monitoring");
    await fs.mkdir(dir, { recursive: true });
    const destPath = path.join(dir, `${parsed.componentCode}.json`);
    await fs.writeFile(destPath, JSON.stringify(parsed, null, 2), "utf-8");

    return NextResponse.json(
      {
        data: {
          componentCode: parsed.componentCode,
          points: parsed.points.length,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
