import { readJson, writeJson } from "@/lib/dataStore";

const SUBSCRIBERS_FILE = "newsletter/subscribers.json";

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

/** Lee la lista de suscriptores (vacía si el archivo no existe). */
export function readSubscribers(): Promise<Subscriber[]> {
  return readJson<Subscriber[]>(SUBSCRIBERS_FILE, []);
}

/** Persiste la lista de suscriptores (escritura atómica). */
export function writeSubscribers(subscribers: Subscriber[]): Promise<void> {
  return writeJson(SUBSCRIBERS_FILE, subscribers);
}

/** Valida un email de forma simple. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Extrae y normaliza el campo `email` de un body JSON desconocido. */
export function extractEmail(body: unknown): string | null {
  const email =
    typeof body === "object" && body !== null && "email" in body
      ? (body as { email: unknown }).email
      : undefined;
  if (typeof email !== "string" || !isValidEmail(email)) return null;
  return email.toLowerCase().trim();
}
