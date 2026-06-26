"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginStatus = "idle" | "loading" | "error";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim() || !email.includes("@")) {
      errors.email = "Ingrese un correo electrónico válido.";
    }
    if (!password) {
      errors.password = "Ingrese su contraseña.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error ?? "Credenciales incorrectas.");
      }

      const json = (await res.json()) as { token?: string; data?: { token?: string } };
      const token = json.token ?? json.data?.token;
      if (token) {
        localStorage.setItem("epsa_admin_token", token);
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error al iniciar sesión."
      );
      setStatus("error");
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px - 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        background: "var(--color-bg)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Logo / brand mark */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              background: "var(--color-primary)",
              borderRadius: "var(--radius-md)",
              marginBottom: "16px",
            }}
            aria-hidden="true"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--color-primary)",
              marginBottom: "6px",
            }}
          >
            Administración EPSA
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-muted)",
            }}
          >
            Acceso restringido a usuarios autorizados
          </p>
        </div>

        {/* Login card */}
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-line)",
            boxShadow: "var(--shadow-card)",
            padding: "36px 32px",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    marginBottom: "6px",
                  }}
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((fe) => ({ ...fe, email: undefined }));
                    if (status === "error") {
                      setStatus("idle");
                      setErrorMessage("");
                    }
                  }}
                  placeholder="nombre@empresa.cl"
                  aria-describedby={
                    fieldErrors.email ? "email-error" : undefined
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: `1.5px solid ${fieldErrors.email ? "var(--sema-bad)" : "var(--color-line)"}`,
                    background: "var(--color-bg)",
                    fontSize: "0.9375rem",
                    color: "var(--color-ink)",
                    fontFamily: "inherit",
                  }}
                />
                {fieldErrors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--sema-bad)",
                      marginTop: "4px",
                    }}
                  >
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                    marginBottom: "6px",
                  }}
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((fe) => ({ ...fe, password: undefined }));
                    if (status === "error") {
                      setStatus("idle");
                      setErrorMessage("");
                    }
                  }}
                  placeholder="••••••••"
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: `1.5px solid ${fieldErrors.password ? "var(--sema-bad)" : "var(--color-line)"}`,
                    background: "var(--color-bg)",
                    fontSize: "0.9375rem",
                    color: "var(--color-ink)",
                    fontFamily: "inherit",
                  }}
                />
                {fieldErrors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--sema-bad)",
                      marginTop: "4px",
                    }}
                  >
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Server error */}
              {status === "error" && errorMessage && (
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
                  {errorMessage}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  background:
                    status === "loading"
                      ? "var(--color-muted)"
                      : "var(--color-primary)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                {status === "loading" ? "Ingresando…" : "Ingresar"}
              </button>
            </div>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "var(--color-muted)",
            marginTop: "20px",
          }}
        >
          Solo personal autorizado puede acceder al panel de administración.
        </p>
      </div>
    </div>
  );
}
