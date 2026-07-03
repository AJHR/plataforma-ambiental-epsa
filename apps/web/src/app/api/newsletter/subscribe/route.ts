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
  } catch (err) {
    return jsonError(err);
  }
}
