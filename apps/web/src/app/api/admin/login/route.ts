import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const DATA_DIR = process.env.DATA_DIR ?? path.resolve(process.cwd(), "../../data");

interface User {
  email: string;
  passwordHash: string;
  role: "admin" | "editor";
  name: string;
  createdAt: string;
  active: boolean;
}

interface TokenPayload {
  email: string;
  role: "admin" | "editor";
  name: string;
  exp: number;
}

function generateToken(payload: TokenPayload): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json, "utf-8").toString("base64url");
}

export async function POST(request: Request) {
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
  const password =
    typeof body === "object" && body !== null && "password" in body
      ? (body as { password: unknown }).password
      : undefined;

  if (typeof email !== "string" || email.trim() === "") {
    return NextResponse.json({ error: "Email requerido" }, { status: 400 });
  }
  if (typeof password !== "string" || password === "") {
    return NextResponse.json({ error: "Contraseña requerida" }, { status: 400 });
  }

  try {
    const usersPath = path.join(DATA_DIR, "users", "users.json");
    const raw = await fs.readFile(usersPath, "utf-8");
    const users = JSON.parse(raw) as User[];

    const user = users.find(
      (u) =>
        u.email === email.toLowerCase().trim() &&
        u.active === true &&
        u.passwordHash === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Token expires in 8 hours
    const exp = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
    const token = generateToken({ email: user.email, role: user.role, name: user.name, exp });

    return NextResponse.json({
      data: { token, role: user.role, name: user.name },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
