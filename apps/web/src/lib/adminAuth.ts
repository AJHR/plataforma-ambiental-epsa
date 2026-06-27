interface TokenPayload {
  email: string;
  role: "admin" | "editor";
  name: string;
  exp: number;
}

/**
 * Verifica el token de admin emitido por /api/admin/login.
 * El token es un payload JSON codificado en base64url (MVP, no firmado).
 * Devuelve el payload si es válido y no expiró; null en caso contrario.
 */
export function verifyAdminToken(request: Request): TokenPayload | null {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  const token = match[1]!.trim();
  if (!token) return null;

  try {
    const json = Buffer.from(token, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as Partial<TokenPayload>;

    if (
      typeof payload.email !== "string" ||
      (payload.role !== "admin" && payload.role !== "editor") ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    // Expiración (exp en segundos epoch)
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload as TokenPayload;
  } catch {
    return null;
  }
}
