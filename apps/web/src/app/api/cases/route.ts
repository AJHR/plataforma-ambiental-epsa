import { NextResponse } from "next/server";
import { readJson, writeJson, jsonError } from "@/lib/dataStore";

export const runtime = "nodejs";

interface CaseRecord {
  caseNumber: string;
  category: string;
  message: string;
  consent: boolean;
  status: string;
  createdAt: string;
}

interface Counter {
  [year: string]: number;
}

export async function GET() {
  try {
    const data = await readJson<CaseRecord[]>("cases/cases.json");
    return NextResponse.json({ data });
  } catch (err) {
    return jsonError(err);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("category" in body) ||
    !("message" in body) ||
    !("consent" in body)
  ) {
    return NextResponse.json(
      { error: "Campos requeridos: category, message, consent" },
      { status: 400 }
    );
  }

  const { category, message, consent } = body as {
    category: unknown;
    message: unknown;
    consent: unknown;
  };

  if (typeof category !== "string" || category.trim() === "") {
    return NextResponse.json({ error: "'category' debe ser un texto" }, { status: 400 });
  }
  if (typeof message !== "string" || message.trim() === "") {
    return NextResponse.json({ error: "'message' debe ser un texto" }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json({ error: "Debe aceptar el consentimiento" }, { status: 400 });
  }

  try {
    // Read and increment year counter.
    const counter = await readJson<Counter>("cases/counter.json", {});
    const year = String(new Date().getFullYear());
    const next = (typeof counter[year] === "number" ? counter[year] : 0) + 1;
    counter[year] = next;
    await writeJson("cases/counter.json", counter);

    const caseNumber = `EPSA-${year}-${String(next).padStart(4, "0")}`;

    // Append the new case.
    const cases = await readJson<CaseRecord[]>("cases/cases.json", []);
    const newCase: CaseRecord = {
      caseNumber,
      category: category.trim(),
      message: message.trim(),
      consent: true,
      status: "recibido",
      createdAt: new Date().toISOString(),
    };
    cases.push(newCase);
    await writeJson("cases/cases.json", cases);

    return NextResponse.json(
      { data: { caseNumber, status: newCase.status } },
      { status: 201 }
    );
  } catch (err) {
    return jsonError(err);
  }
}
