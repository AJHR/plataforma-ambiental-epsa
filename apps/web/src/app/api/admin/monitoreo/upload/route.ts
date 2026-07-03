import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminAuth";
import { writeJson, jsonError } from "@/lib/dataStore";

export const runtime = "nodejs";

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
    await writeJson(`monitoring/${parsed.componentCode}.json`, parsed);
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
    return jsonError(err);
  }
}
