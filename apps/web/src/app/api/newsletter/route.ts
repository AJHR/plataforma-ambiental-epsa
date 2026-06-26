import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

const SUBSCRIBERS_PATH = () =>
  path.join(DATA_DIR, "newsletter", "subscribers.json");

interface Subscriber {
  email: string;
  subscribedAt: string;
}

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_PATH(), "utf-8");
    return JSON.parse(raw) as Subscriber[];
  } catch {
    return [];
  }
}

async function writeSubscribers(subscribers: Subscriber[]): Promise<void> {
  await fs.writeFile(
    SUBSCRIBERS_PATH(),
    JSON.stringify(subscribers, null, 2),
    "utf-8"
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const { pathname } = new URL(request.url);
  const action = pathname.endsWith("/unsubscribe") ? "unsubscribe" : "subscribe";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body
      ? (body as { email: unknown }).email
      : undefined;

  if (typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();

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
    } else {
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
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
