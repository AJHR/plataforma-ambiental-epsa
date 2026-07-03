import { describe, expect, it } from "vitest";
import { createAssistant, DisabledAssistant } from "./index.js";

describe("assistant seam (placeholder)", () => {
  it("por defecto el asistente está deshabilitado", () => {
    const a = createAssistant();
    expect(a.enabled).toBe(false);
    expect(a).toBeInstanceOf(DisabledAssistant);
  });

  it("el stub no responde y deriva al MIAQR (sin inventar)", async () => {
    const ans = await createAssistant().ask("¿dónde veo la calidad del aire?");
    expect(ans.deferToMiaqr).toBe(true);
    expect(ans.sources).toHaveLength(0);
    expect(ans.text).toContain("Participa");
  });
});
