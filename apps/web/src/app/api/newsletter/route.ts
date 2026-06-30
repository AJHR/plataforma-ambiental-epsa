import { NextResponse } from "next/server";
import { jsonError } from "@/lib/dataStore";
import { readSubscribers, writeSubscribers, extractEmail } from "@/lib/newsletter";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  const action = pathname.endsWith("/unsubscribe") ? "unsubscribe" : "subscribe";

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

    if (action === "subscribe") {
      if (subscribers.some((s) => s.email === normalized)) {
        return NextResponse.json(
          { data: { email: normalized, message: "Ya estás suscrito" } },
          { status: 200 }
        );
      }
      subscribers.push({ email: normalized, subscribedAt: new Date().toISOString() });
      await writeSubscribers(subscribers);
      return NextResponse.json(
        { data: { email: normalized, message: "Suscripción exitosa" } },
        { status: 201 }
      );
    }

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
