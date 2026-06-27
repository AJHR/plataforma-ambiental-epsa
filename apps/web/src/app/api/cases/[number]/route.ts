import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

interface CaseRecord {
  caseNumber: string;
  category: string;
  message: string;
  consent: boolean;
  status: string;
  createdAt: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;

  try {
    const filePath = path.join(DATA_DIR, "cases", "cases.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const cases = JSON.parse(raw) as CaseRecord[];

    const caseRecord = cases.find((c) => c.caseNumber === number);
    if (!caseRecord) {
      return NextResponse.json({ error: "Caso no encontrado" }, { status: 404 });
    }

    // Return a limited view (no full message content) for public status lookup
    return NextResponse.json({
      data: {
        caseNumber: caseRecord.caseNumber,
        category: caseRecord.category,
        status: caseRecord.status,
        createdAt: caseRecord.createdAt,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
