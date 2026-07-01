"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Image from "next/image";

// Gate de acceso al demo con clave estática (no es seguridad real; solo evita
// que el sitio de demostración quede abierto a cualquiera). La clave y el
// interruptor pueden sobreescribirse por entorno; en CI el gate va desactivado.
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "epsa2030!";
const GATE_ENABLED = process.env.NEXT_PUBLIC_DEMO_GATE !== "off";
const STORAGE_KEY = "epsa_demo_ok";

export default function SiteGate({ children }: { children: ReactNode }) {
  const [locked, setLocked] = useState(true);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!GATE_ENABLED || sessionStorage.getItem(STORAGE_KEY) === "1") {
      setLocked(false);
    }
  }, []);

  if (!GATE_ENABLED || !locked) {
    return <>{children}</>;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === DEMO_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setLocked(false);
    } else {
      setError(true);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background:
          "linear-gradient(135deg, var(--color-bg-deep) 0%, var(--color-primary) 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 20px 60px rgba(8,34,53,0.35)",
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            background: "#ffffff",
            borderRadius: "var(--radius-sm)",
            padding: "6px 10px",
            marginBottom: "20px",
          }}
        >
          <Image
            src="/logo-puerto.png"
            alt="Puerto San Antonio"
            width={260}
            height={48}
            priority
            style={{ height: "30px", width: "auto" }}
          />
        </span>

        <h1
          style={{
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "var(--color-primary)",
            lineHeight: 1.35,
            marginBottom: "8px",
          }}
        >
          Demo Plataforma Información Ambiental Proyecto Puerto Exterior
        </h1>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-muted)",
            marginBottom: "24px",
          }}
        >
          Acceso restringido. Ingrese la clave para continuar.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="demo-clave" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
            Clave de acceso
          </label>
          <input
            id="demo-clave"
            type="password"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(false);
            }}
            placeholder="Clave de acceso"
            aria-invalid={error}
            aria-describedby={error ? "demo-clave-error" : undefined}
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "var(--radius-sm)",
              border: `1.5px solid ${error ? "var(--sema-bad)" : "var(--color-line)"}`,
              background: "var(--color-bg)",
              fontSize: "0.9375rem",
              color: "var(--color-ink)",
              marginBottom: "12px",
            }}
          />
          {error && (
            <p
              id="demo-clave-error"
              role="alert"
              style={{
                fontSize: "0.8125rem",
                color: "var(--sema-bad)",
                marginBottom: "12px",
              }}
            >
              Clave incorrecta. Intente nuevamente.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 24px",
              background: "var(--color-primary)",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.9375rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
