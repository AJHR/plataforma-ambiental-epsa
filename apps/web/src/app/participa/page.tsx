"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  "Impactos ambientales y sociales",
  "Navegación",
  "Gestión vial San Juan",
  "Pueblos indígenas",
  "Reasentamiento",
  "Trabajo y condiciones laborales",
  "Otros",
] as const;

type Category = (typeof CATEGORIES)[number];

interface FormState {
  category: Category | "";
  message: string;
  consent: boolean;
}

interface SubmitResult {
  caseNumber: string;
}

type PageStatus = "form" | "submitting" | "success" | "error";

export default function ParticipaPage() {
  const [form, setForm] = useState<FormState>({
    category: "",
    message: "",
    consent: false,
  });
  const [status, setStatus] = useState<PageStatus>("form");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.category) errors.category = "Seleccione una categoría.";
    if (!form.message.trim() || form.message.trim().length < 10)
      errors.message = "Ingrese un mensaje de al menos 10 caracteres.";
    if (!form.consent) errors.consent = "Debe aceptar los términos para continuar.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.category,
          message: form.message,
          consent: form.consent,
        }),
      });

      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error ?? "Error al enviar la consulta");
      }

      const json = (await res.json()) as { caseNumber?: string; data?: { caseNumber?: string } };
      const caseNumber = json.caseNumber ?? json.data?.caseNumber;
      if (!caseNumber) throw new Error("No se recibió número de caso");

      setResult({ caseNumber });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "success" && result) {
    return (
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "48px 24px 64px",
        }}
      >
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-line)",
            boxShadow: "var(--shadow-card)",
            padding: "40px 32px",
            textAlign: "center",
          }}
        >
          {/* Success icon */}
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "#e8f5ee",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
            aria-hidden="true"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M6 14l6 6 10-12"
                stroke="var(--sema-ok)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              color: "var(--color-primary)",
              marginBottom: "12px",
            }}
          >
            Solicitud recibida
          </h1>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--color-muted)",
              marginBottom: "28px",
              lineHeight: 1.6,
            }}
          >
            Su consulta ha sido registrada exitosamente. Conserve este número
            para hacer seguimiento.
          </p>

          {/* Case number */}
          <div
            style={{
              background: "var(--color-bg)",
              border: "2px solid var(--color-accent)",
              borderRadius: "var(--radius-md)",
              padding: "20px 24px",
              marginBottom: "32px",
              display: "inline-block",
            }}
          >
            <p
              style={{
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-muted)",
                marginBottom: "6px",
              }}
            >
              Número de caso
            </p>
            <p
              style={{
                fontSize: "1.625rem",
                fontWeight: 800,
                color: "var(--color-primary)",
                letterSpacing: "0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {result.caseNumber}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/participa/estado"
              style={{
                padding: "10px 24px",
                background: "var(--color-primary)",
                color: "#ffffff",
                borderRadius: "var(--radius-sm)",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Consultar estado
            </Link>
            <button
              type="button"
              onClick={() => {
                setForm({ category: "", message: "", consent: false });
                setResult(null);
                setFieldErrors({});
                setStatus("form");
              }}
              style={{
                padding: "10px 24px",
                background: "transparent",
                color: "var(--color-primary)",
                border: "1.5px solid var(--color-primary)",
                borderRadius: "var(--radius-sm)",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Nueva consulta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 24px 64px",
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: "36px" }}>
        <p
          style={{
            fontSize: "0.6875rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-accent-700)",
            marginBottom: "8px",
          }}
        >
          Mecanismo de quejas y reclamos
        </p>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "var(--color-primary)",
            lineHeight: 1.2,
            textWrap: "balance",
            marginBottom: "12px",
          }}
        >
          Participa
        </h1>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--color-muted)",
            maxWidth: "560px",
            lineHeight: 1.6,
          }}
        >
          Envíe su consulta, queja o reclamo relacionado con el proyecto EPSA.
          Todas las comunicaciones son registradas y reciben una respuesta
          formal.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "24px",
        }}
      >
        {/* Form card */}
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-line)",
            boxShadow: "var(--shadow-card)",
            padding: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "24px",
            }}
          >
            Nueva consulta
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Category */}
              <div>
                <label
                  htmlFor="categoria"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    marginBottom: "6px",
                  }}
                >
                  Categoría <span style={{ color: "var(--sema-bad)" }}>*</span>
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={form.category}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, category: e.target.value as Category | "" }));
                    setFieldErrors((fe) => ({ ...fe, category: undefined }));
                  }}
                  required
                  aria-describedby={fieldErrors.category ? "categoria-error" : undefined}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: `1.5px solid ${fieldErrors.category ? "var(--sema-bad)" : "var(--color-line)"}`,
                    background: "var(--color-bg)",
                    fontSize: "0.9375rem",
                    color: form.category ? "var(--color-ink)" : "var(--color-muted)",
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Seleccione una categoría…</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <p
                    id="categoria-error"
                    role="alert"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--sema-bad)",
                      marginTop: "4px",
                    }}
                  >
                    {fieldErrors.category}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="mensaje"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    marginBottom: "6px",
                  }}
                >
                  Descripción{" "}
                  <span style={{ color: "var(--sema-bad)" }}>*</span>
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  value={form.message}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, message: e.target.value }));
                    setFieldErrors((fe) => ({ ...fe, message: undefined }));
                  }}
                  required
                  placeholder="Describa su consulta, queja o reclamo con el mayor detalle posible…"
                  aria-describedby={fieldErrors.message ? "mensaje-error" : undefined}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: `1.5px solid ${fieldErrors.message ? "var(--sema-bad)" : "var(--color-line)"}`,
                    background: "var(--color-bg)",
                    fontSize: "0.9375rem",
                    color: "var(--color-ink)",
                    resize: "vertical",
                    lineHeight: 1.6,
                    fontFamily: "inherit",
                  }}
                />
                {fieldErrors.message && (
                  <p
                    id="mensaje-error"
                    role="alert"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--sema-bad)",
                      marginTop: "4px",
                    }}
                  >
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {/* Consent */}
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="consentimiento"
                    checked={form.consent}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, consent: e.target.checked }));
                      setFieldErrors((fe) => ({ ...fe, consent: undefined }));
                    }}
                    aria-describedby={fieldErrors.consent ? "consent-error" : undefined}
                    style={{
                      width: "18px",
                      height: "18px",
                      marginTop: "2px",
                      flexShrink: 0,
                      cursor: "pointer",
                      accentColor: "var(--color-primary)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    <strong style={{ color: "var(--color-ink)" }}>
                      Consentimiento:
                    </strong>{" "}
                    Acepto los términos del mecanismo de quejas y reclamos y
                    consiento el tratamiento de mis datos personales conforme a
                    la política de privacidad de EPSA.
                  </span>
                </label>
                {fieldErrors.consent && (
                  <p
                    id="consent-error"
                    role="alert"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--sema-bad)",
                      marginTop: "6px",
                      marginLeft: "28px",
                    }}
                  >
                    {fieldErrors.consent}
                  </p>
                )}
              </div>

              {/* Server error */}
              {status === "error" && (
                <div
                  role="alert"
                  style={{
                    padding: "12px 16px",
                    background: "#fff0ef",
                    border: "1px solid var(--sema-bad)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.875rem",
                    color: "var(--sema-bad)",
                    fontWeight: 500,
                  }}
                >
                  No se pudo registrar su consulta. Verifique su conexión e intente nuevamente.
                </div>
              )}

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  style={{
                    padding: "12px 32px",
                    background: status === "submitting" ? "var(--color-muted)" : "var(--color-primary)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    cursor: status === "submitting" ? "not-allowed" : "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {status === "submitting" ? "Enviando…" : "Enviar"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Status lookup section */}
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-line)",
            boxShadow: "var(--shadow-card)",
            padding: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "1.0625rem",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "8px",
            }}
          >
            Consultar estado de caso
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-muted)",
              marginBottom: "20px",
            }}
          >
            Ingrese el número de caso recibido al enviar su consulta para ver
            su estado actual.
          </p>
          <Link
            href="/participa/estado"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              border: "1.5px solid var(--color-primary)",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-primary)",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            Ir a consulta de estado
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 7h10M7 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
