import { NextResponse } from "next/server";
import { readJson, jsonError } from "@/lib/dataStore";

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
    const cases = await readJson<CaseRecord[]>("cases/cases.json", []);

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
    return jsonError(err);
  }
}
