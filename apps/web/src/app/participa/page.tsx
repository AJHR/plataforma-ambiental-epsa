"use client";

import { useState } from "react";
import Link from "next/link";

// Clasificaciones de temas del MIAQR (redacción textual del TDR §2.3).
const CATEGORIES = [
  "Impactos ambientales y sociales",
  "Información y seguridad en la navegación",
  "Gestión Vial Sector San Juan",
  "Pueblos indígenas",
  "Reasentamiento de la población",
  "Trabajo y condiciones laborales",
  "Otros",
] as const;

type Category = (typeof CATEGORIES)[number];

interface FormState {
  nombre: string;
  rut: string;
  category: Category | "";
  message: string;
  consent: boolean;
}

/** Valida un RUT chileno con dígito verificador (módulo 11). */
function isValidRut(rut: string): boolean {
  const clean = rut.replace(/[.\s]/g, "").toUpperCase();
  const m = clean.match(/^(\d{7,8})-([\dK])$/);
  if (!m) return false;
  const body = m[1]!;
  const dv = m[2]!;
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]!, 10) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const res = 11 - (sum % 11);
  const expected = res === 11 ? "0" : res === 10 ? "K" : String(res);
  return dv === expected;
}

interface SubmitResult {
  caseNumber: string;
}

type PageStatus = "form" | "submitting" | "success" | "error";

export default function ParticipaPage() {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    rut: "",
    category: "",
    message: "",
    consent: false,
  });
  const [status, setStatus] = useState<PageStatus>("form");
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre.trim()) errors.nombre = "Ingrese su nombre.";
    if (!form.rut.trim()) errors.rut = "Ingrese su RUT.";
    else if (!isValidRut(form.rut))
      errors.rut = "Ingrese un RUT válido (ej. 12.345.678-9).";
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
          nombre: form.nombre.trim(),
          rut: form.rut.trim(),
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
                setForm({ nombre: "", rut: "", category: "", message: "", consent: false });
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
          formal. Este mecanismo cubre todas las fases del proyecto y aborda
          temas ambientales, sociales, de género y etnicidad, garantizando la
          transparencia y la privacidad de las personas.
        </p>

        {/* Plazos de respuesta (TDR §2.3) */}
        <div
          role="note"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 20px",
            marginTop: "16px",
            padding: "12px 16px",
            background: "var(--color-bg)",
            border: "1px solid var(--color-line)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.8125rem",
            color: "var(--color-muted)",
          }}
        >
          <span>
            <strong style={{ color: "var(--color-ink)" }}>Consultas simples:</strong>{" "}
            respuesta hasta en 1 mes
          </span>
          <span>
            <strong style={{ color: "var(--color-ink)" }}>Casos complejos:</strong>{" "}
            respuesta hasta en 2 meses
          </span>
        </div>
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
              {/* Nombre */}
              <div>
                <label
                  htmlFor="nombre"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    marginBottom: "6px",
                  }}
                >
                  Nombre <span style={{ color: "var(--sema-bad)" }}>*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={form.nombre}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, nombre: e.target.value }));
                    setFieldErrors((fe) => ({ ...fe, nombre: undefined }));
                  }}
                  required
                  placeholder="Nombre y apellido"
                  aria-describedby={fieldErrors.nombre ? "nombre-error" : undefined}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: `1.5px solid ${fieldErrors.nombre ? "var(--sema-bad)" : "var(--color-line)"}`,
                    background: "var(--color-bg)",
                    fontSize: "0.9375rem",
                    color: "var(--color-ink)",
                    fontFamily: "inherit",
                  }}
                />
                {fieldErrors.nombre && (
                  <p
                    id="nombre-error"
                    role="alert"
                    style={{ fontSize: "0.75rem", color: "var(--sema-bad)", marginTop: "4px" }}
                  >
                    {fieldErrors.nombre}
                  </p>
                )}
              </div>

              {/* RUT */}
              <div>
                <label
                  htmlFor="rut"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    marginBottom: "6px",
                  }}
                >
                  RUT <span style={{ color: "var(--sema-bad)" }}>*</span>
                </label>
                <input
                  id="rut"
                  name="rut"
                  type="text"
                  inputMode="text"
                  value={form.rut}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, rut: e.target.value }));
                    setFieldErrors((fe) => ({ ...fe, rut: undefined }));
                  }}
                  required
                  placeholder="12.345.678-9"
                  aria-describedby={fieldErrors.rut ? "rut-error" : undefined}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: `1.5px solid ${fieldErrors.rut ? "var(--sema-bad)" : "var(--color-line)"}`,
                    background: "var(--color-bg)",
                    fontSize: "0.9375rem",
                    color: "var(--color-ink)",
                    fontFamily: "inherit",
                  }}
                />
                {fieldErrors.rut && (
                  <p
                    id="rut-error"
                    role="alert"
                    style={{ fontSize: "0.75rem", color: "var(--sema-bad)", marginTop: "4px" }}
                  >
                    {fieldErrors.rut}
                  </p>
                )}
              </div>

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

        {/* Canales de atención (ficha CAV OT-2) */}
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
            Canales de atención
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-muted)",
              marginBottom: "16px",
              lineHeight: 1.6,
            }}
          >
            EPSA mantiene disponibles varios canales de información y comunicación
            con la comunidad durante todas las fases del proyecto:
          </p>
          <ul style={{ listStyle: "none", display: "grid", gap: "10px" }}>
            {[
              { t: "Formulario web", d: "Este mecanismo de solicitudes, quejas y reclamos (MIAQR)." },
              { t: "Correo electrónico", d: "Casilla de contacto del equipo social EPSA (se publica al implementar)." },
              { t: "Línea telefónica de consultas", d: "Para dudas, consultas y reclamos (se publica al implementar)." },
              { t: "Línea de emergencias", d: "Para dar aviso de eventualidades relacionadas al proyecto (se publica al implementar)." },
              { t: "Equipo social EPSA", d: "Profesionales a cargo de la atención y actualización de la plataforma." },
            ].map((c) => (
              <li
                key={c.t}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  fontSize: "0.875rem",
                  color: "var(--color-muted)",
                  lineHeight: 1.5,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    marginTop: "7px",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--color-accent-700)",
                    flexShrink: 0,
                  }}
                />
                <span>
                  <strong style={{ color: "var(--color-ink)" }}>{c.t}:</strong> {c.d}
                </span>
              </li>
            ))}
          </ul>
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
