"use client";

import { useState } from "react";
import Link from "next/link";

type CaseStatus = "ingresado" | "acuse" | "evaluacion" | "resuelto";

interface CaseInfo {
  caseNumber: string;
  status: CaseStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

const STATUS_STEPS: { key: CaseStatus; label: string; description: string }[] = [
  {
    key: "ingresado",
    label: "Ingresado",
    description: "La consulta fue recibida en el sistema.",
  },
  {
    key: "acuse",
    label: "Acuse de recibo",
    description: "Se confirmó la recepción y fue asignada a un responsable.",
  },
  {
    key: "evaluacion",
    label: "En evaluación",
    description: "El equipo EPSA está analizando su consulta.",
  },
  {
    key: "resuelto",
    label: "Resuelto",
    description: "La consulta fue atendida. Revise su canal de contacto.",
  },
];

function getStepIndex(status: CaseStatus): number {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

export default function EstadoPage() {
  const [inputValue, setInputValue] = useState("");
  const [queried, setQueried] = useState(false);
  const [loading, setLoading] = useState(false);
  const [caseInfo, setCaseInfo] = useState<CaseInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [inputError, setInputError] = useState("");

  function validateInput(): boolean {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setInputError("Ingrese un número de caso.");
      return false;
    }
    if (!/^EPSA-\d{4}-\d{4}$/.test(trimmed)) {
      setInputError("Formato inválido. Use EPSA-AAAA-####, por ejemplo EPSA-2026-0001.");
      return false;
    }
    setInputError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true);
    setQueried(false);
    setCaseInfo(null);
    setNotFound(false);

    try {
      const res = await fetch(
        `/api/participacion/estado?caso=${encodeURIComponent(inputValue.trim())}`
      );

      if (res.status === 404) {
        setNotFound(true);
      } else if (!res.ok) {
        throw new Error("Server error");
      } else {
        const json = (await res.json()) as CaseInfo | { data: CaseInfo };
        const info = "caseNumber" in json ? (json as CaseInfo) : (json as { data: CaseInfo }).data;
        setCaseInfo(info);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
      setQueried(true);
    }
  }

  const activeStep = caseInfo ? getStepIndex(caseInfo.status) : -1;

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "40px 24px 64px",
      }}
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Ruta de navegación"
        style={{ marginBottom: "28px", fontSize: "0.8125rem" }}
      >
        <Link
          href="/participa"
          style={{
            color: "var(--color-accent-700)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Participa
        </Link>
        <span
          style={{ color: "var(--color-muted)", margin: "0 8px" }}
          aria-hidden="true"
        >
          /
        </span>
        <span style={{ color: "var(--color-muted)" }}>
          Consultar estado de caso
        </span>
      </nav>

      {/* Page header */}
      <div style={{ marginBottom: "32px" }}>
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
          Seguimiento
        </p>
        <h1
          style={{
            fontSize: "clamp(1.375rem, 4vw, 1.875rem)",
            fontWeight: 700,
            color: "var(--color-primary)",
            lineHeight: 1.2,
            textWrap: "balance",
            marginBottom: "10px",
          }}
        >
          Consultar estado de caso
        </h1>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--color-muted)",
            lineHeight: 1.6,
          }}
        >
          Ingrese el número de caso generado al enviar su consulta para ver su
          estado actual.
        </p>
      </div>

      {/* Search form */}
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-card)",
          padding: "28px 32px",
          marginBottom: "24px",
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="caso"
            style={{
              display: "block",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: "6px",
            }}
          >
            Número de caso
          </label>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <input
              id="caso"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setInputError("");
              }}
              placeholder="EPSA-2026-0001"
              aria-describedby={inputError ? "caso-error" : undefined}
              style={{
                flex: 1,
                minWidth: "220px",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                border: `1.5px solid ${inputError ? "var(--sema-bad)" : "var(--color-line)"}`,
                background: "var(--color-bg)",
                fontSize: "0.9375rem",
                fontFamily: "inherit",
                color: "var(--color-ink)",
                letterSpacing: "0.02em",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 24px",
                background: loading ? "var(--color-muted)" : "var(--color-primary)",
                color: "#ffffff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.9375rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "Consultando…" : "Consultar"}
            </button>
          </div>
          {inputError && (
            <p
              id="caso-error"
              role="alert"
              style={{
                fontSize: "0.75rem",
                color: "var(--sema-bad)",
                marginTop: "6px",
              }}
            >
              {inputError}
            </p>
          )}
        </form>
      </div>

      {/* Results */}
      {queried && notFound && (
        <div
          role="alert"
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-line)",
            padding: "28px 32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontWeight: 600,
              color: "var(--color-ink)",
              marginBottom: "6px",
            }}
          >
            Caso no encontrado
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
            No se encontró un caso con el número{" "}
            <strong>{inputValue.trim()}</strong>. Verifique el número e intente
            nuevamente.
          </p>
        </div>
      )}

      {queried && caseInfo && (
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-line)",
            boxShadow: "var(--shadow-card)",
            overflow: "hidden",
          }}
        >
          {/* Case header */}
          <div
            style={{
              padding: "24px 32px",
              borderBottom: "1px solid var(--color-line)",
              background: "var(--color-bg)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Número de caso
                </p>
                <p
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: 800,
                    color: "var(--color-primary)",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.02em",
                  }}
                >
                  {caseInfo.caseNumber}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--color-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Categoría
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                  }}
                >
                  {caseInfo.category}
                </p>
              </div>
            </div>
          </div>

          {/* Progress tracker */}
          <div style={{ padding: "32px" }}>
            <p
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "24px",
              }}
            >
              Estado del caso
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              {STATUS_STEPS.map((step, idx) => {
                const isDone = idx < activeStep;
                const isActive = idx === activeStep;
                const isPending = idx > activeStep;

                const dotColor = isDone
                  ? "var(--sema-ok)"
                  : isActive
                  ? "var(--color-accent)"
                  : "var(--color-line)";

                const labelColor = isPending
                  ? "var(--color-muted)"
                  : "var(--color-ink)";

                return (
                  <div
                    key={step.key}
                    style={{
                      display: "flex",
                      gap: "16px",
                      position: "relative",
                    }}
                  >
                    {/* Connector line and dot */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: dotColor,
                          border: isActive
                            ? `3px solid var(--color-accent)`
                            : `2px solid ${dotColor}`,
                          boxSizing: "border-box",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          zIndex: 1,
                        }}
                        aria-hidden="true"
                      >
                        {isDone && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path
                              d="M2 5l2 2 4-4"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div
                          aria-hidden="true"
                          style={{
                            width: "2px",
                            flex: 1,
                            minHeight: "28px",
                            background: isDone
                              ? "var(--sema-ok)"
                              : "var(--color-line)",
                          }}
                        />
                      )}
                    </div>

                    {/* Step label */}
                    <div
                      style={{
                        paddingBottom: idx < STATUS_STEPS.length - 1 ? "24px" : "0",
                        paddingTop: "0",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: isActive ? 700 : 600,
                          color: labelColor,
                          marginBottom: "2px",
                          lineHeight: 1.3,
                        }}
                      >
                        {step.label}
                        {isActive && (
                          <span
                            style={{
                              display: "inline-block",
                              marginLeft: "8px",
                              fontSize: "0.6875rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "var(--color-accent-700)",
                              background: "#e0f3fc",
                              borderRadius: "var(--radius-full)",
                              padding: "2px 8px",
                            }}
                          >
                            Actual
                          </span>
                        )}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: isPending
                            ? "var(--color-line)"
                            : "var(--color-muted)",
                          lineHeight: 1.5,
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dates */}
            <div
              style={{
                marginTop: "28px",
                paddingTop: "20px",
                borderTop: "1px solid var(--color-line)",
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
                fontSize: "0.8125rem",
                color: "var(--color-muted)",
              }}
            >
              <span>
                <strong style={{ color: "var(--color-ink)" }}>
                  Ingresado:
                </strong>{" "}
                {caseInfo.createdAt}
              </span>
              <span>
                <strong style={{ color: "var(--color-ink)" }}>
                  Última actualización:
                </strong>{" "}
                {caseInfo.updatedAt}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
