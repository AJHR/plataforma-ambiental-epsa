import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

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
    const filePath = path.join(DATA_DIR, "cases", "cases.json");
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as CaseRecord[];
    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
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

  const counterPath = path.join(DATA_DIR, "cases", "counter.json");
  const casesPath = path.join(DATA_DIR, "cases", "cases.json");

  try {
    // Read and increment counter
    const counterRaw = await fs.readFile(counterPath, "utf-8");
    const counter = JSON.parse(counterRaw) as Counter;
    const year = String(new Date().getFullYear());
    const prev = typeof counter[year] === "number" ? counter[year] : 0;
    const next = prev + 1;
    counter[year] = next;
    await fs.writeFile(counterPath, JSON.stringify(counter, null, 2), "utf-8");

    const caseNumber = `EPSA-${year}-${String(next).padStart(4, "0")}`;

    // Append case record
    let cases: CaseRecord[] = [];
    try {
      const casesRaw = await fs.readFile(casesPath, "utf-8");
      cases = JSON.parse(casesRaw) as CaseRecord[];
    } catch {
      // File may be empty or not exist yet; start fresh
    }

    const newCase: CaseRecord = {
      caseNumber,
      category: category.trim(),
      message: message.trim(),
      consent: true,
      status: "recibido",
      createdAt: new Date().toISOString(),
    };

    cases.push(newCase);
    await fs.writeFile(casesPath, JSON.stringify(cases, null, 2), "utf-8");

    return NextResponse.json(
      { data: { caseNumber, status: newCase.status } },
      { status: 201 }
    );
  } catch (err) {
    const message2 = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message2 }, { status: 500 });
  }
}
