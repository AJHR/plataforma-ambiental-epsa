import { NextResponse } from "next/server";
import { readJson, jsonError } from "@/lib/dataStore";

export async function GET() {
  try {
    const data = await readJson<unknown>("newsletter/bulletins.json");
    return NextResponse.json({ data });
  } catch (err) {
    return jsonError(err);
  }
}
