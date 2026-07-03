import { NextResponse } from "next/server";
import { jsonError } from "@/lib/dataStore";
import { readSubscribers, writeSubscribers, extractEmail } from "@/lib/newsletter";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const normalized = extractEmail(body);
  if (!normalized) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  try {
    const subscribers = await readSubscribers();
    const index = subscribers.findIndex((s) => s.email === normalized);

    if (index === -1) {
      return NextResponse.json(
        { error: "Email no encontrado en la lista de suscriptores" },
        { status: 404 }
      );
    }

    subscribers.splice(index, 1);
    await writeSubscribers(subscribers);

    return NextResponse.json({
      data: { email: normalized, message: "Suscripción cancelada" },
    });
  } catch (err) {
    return jsonError(err);
  }
}
