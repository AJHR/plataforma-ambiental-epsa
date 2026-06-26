// @repo/assistant — Seam de integración del Asistente IA (chatbot).
//
// DECISIÓN DE ALCANCE: en el MVP el chatbot NO se desarrolla. Este paquete deja
// LA CONEXIÓN LISTA para enchufar el asistente real más adelante sin reescribir:
//   - interface AssistantProvider (el contrato)
//   - DisabledAssistant (stub activo por defecto: no responde, deriva al MIAQR)
//   - factory por env ASSISTANT_ENABLED + ASSISTANT_DRIVER
//
// Para activarlo en el futuro:
//   1) implementar un RagAssistant que cumpla AssistantProvider (RAG sobre los PDFs del admin)
//   2) registrarlo en createAssistant()
//   3) setear ASSISTANT_ENABLED=true (y ASSISTANT_DRIVER=rag)
// La UI (ChatWidget) no cambia: solo lee `assistant.enabled`.

export interface AssistantSource {
  documentId: string;
  title: string;
  section?: string;
}

export interface AssistantAnswer {
  text: string;
  sources: AssistantSource[];
  /** true cuando el asistente deriva al mecanismo formal (MIAQR) en lugar de responder. */
  deferToMiaqr: boolean;
}

export interface AssistantProvider {
  /** ¿Está disponible el asistente para el usuario final? */
  readonly enabled: boolean;
  /** Caso 1 (proyecto+docs) y Caso 2 (navegación). Cita fuentes; si no hay, deriva. */
  ask(question: string): Promise<AssistantAnswer>;
}

/** Stub activo en el MVP: nunca inventa, no responde, deriva al formulario de Participa. */
export class DisabledAssistant implements AssistantProvider {
  readonly enabled = false;

  async ask(_question: string): Promise<AssistantAnswer> {
    return {
      text:
        "El asistente estará disponible próximamente. Para consultas, quejas o reclamos, " +
        "usa el formulario en la sección Participa.",
      sources: [],
      deferToMiaqr: true,
    };
  }
}

export type AssistantDriver = "disabled" | "rag";

/**
 * Factory. Hoy devuelve siempre el stub. El branch "rag" queda preparado para
 * cuando exista la implementación real (no incluida en el MVP).
 */
export function createAssistant(): AssistantProvider {
  const enabled = process.env.ASSISTANT_ENABLED === "true";
  const driver = (process.env.ASSISTANT_DRIVER as AssistantDriver) ?? "disabled";

  if (!enabled || driver === "disabled") {
    return new DisabledAssistant();
  }

  // TODO(fase posterior): return new RagAssistant({ documents, model });
  // Mientras no exista la implementación, se mantiene el stub para no fingir comportamiento.
  return new DisabledAssistant();
}
