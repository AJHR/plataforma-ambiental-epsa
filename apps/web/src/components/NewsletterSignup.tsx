"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

type Status = "idle" | "submitting" | "success" | "error";

/** Formulario compacto de suscripción al boletín (pre-footer). */
export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="text-base font-medium text-white">
        ¡Listo! Te enviaremos las novedades a tu correo.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Correo electrónico
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="tu@correo.cl"
        className="h-11 flex-1 rounded-md border border-white/25 bg-white/10 px-4 text-base text-white placeholder:text-white/60 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Enviando…" : "Suscribirme"}
      </Button>
      {status === "error" && (
        <p role="alert" className="text-sm text-white/90 sm:sr-only">
          No se pudo completar. Intenta nuevamente.
        </p>
      )}
    </form>
  );
}
