"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Bulletin {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: "boletin" | "noticia";
  downloadUrl?: string;
  readUrl?: string;
}

const FALLBACK_BULLETINS: Bulletin[] = [
  {
    id: "b001",
    category: "boletin",
    title: "Boletín Ambiental N°12 — Junio 2026",
    date: "2026-06-20",
    summary:
      "Resumen de los indicadores ambientales del mes de junio. Calidad del aire dentro de norma. Evento de fauna en zona de amortiguación bajo seguimiento.",
    downloadUrl: "/documentos/boletin-12-junio-2026.pdf",
  },
  {
    id: "b002",
    category: "boletin",
    title: "Boletín Ambiental N°11 — Mayo 2026",
    date: "2026-05-20",
    summary:
      "Todos los indicadores de Etapa I dentro de rangos normales. Se completó la campaña estacional de fauna terrestre con resultados positivos.",
    downloadUrl: "/documentos/boletin-11-mayo-2026.pdf",
  },
  {
    id: "b003",
    category: "noticia",
    title: "EPSA presenta resultados anuales ante el Comité Ciudadano",
    date: "2026-06-15",
    summary:
      "En sesión ordinaria, el equipo EPSA presentó el informe anual de monitoreo 2025–2026 ante representantes comunitarios, alcalde y SEA. La evaluación fue positiva.",
    readUrl: "#",
  },
  {
    id: "b004",
    category: "noticia",
    title: "Nuevas estaciones de monitoreo de ruido instaladas",
    date: "2026-06-05",
    summary:
      "Se instalaron 3 estaciones adicionales de monitoreo continuo de ruido en sectores residenciales próximos a las obras, elevando a 9 el total de puntos de medición.",
    readUrl: "#",
  },
  {
    id: "b005",
    category: "boletin",
    title: "Boletín Ambiental N°10 — Abril 2026",
    date: "2026-04-22",
    summary:
      "Se reporta leve aumento en niveles de ruido diurno durante trabajos de movimiento de tierra. Se activaron medidas de mitigación según protocolo RCA.",
    downloadUrl: "/documentos/boletin-10-abril-2026.pdf",
  },
  {
    id: "b006",
    category: "noticia",
    title: "Inicio de campaña de monitoreo marino estacional",
    date: "2026-04-08",
    summary:
      "El equipo de monitoreo marino dio inicio a la campaña de otoño con muestreos de calidad hídrica, sedimentos y fauna bentónica en el área de influencia del puerto.",
    readUrl: "#",
  },
];

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr + "T12:00:00"));
  } catch {
    return dateStr;
  }
}

type FormStatus = "idle" | "success" | "error" | "submitting";

export default function BoletinesPage() {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [unsubEmail, setUnsubEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<FormStatus>("idle");
  const [unsubStatus, setUnsubStatus] = useState<FormStatus>("idle");
  const [filterCategory, setFilterCategory] = useState<"all" | "boletin" | "noticia">("all");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/newsletter/bulletins", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { data: Bulletin[] }) => setBulletins(j.data))
      .catch(() => setBulletins(FALLBACK_BULLETINS))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribeStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribeStatus(res.ok ? "success" : "error");
    } catch {
      setSubscribeStatus("error");
    }
    setEmail("");
  }

  async function handleUnsubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!unsubEmail) return;
    setUnsubStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unsubEmail }),
      });
      setUnsubStatus(res.ok ? "success" : "error");
    } catch {
      setUnsubStatus("error");
    }
    setUnsubEmail("");
  }

  const displayBulletins = bulletins.length > 0 ? bulletins : FALLBACK_BULLETINS;
  const filtered =
    filterCategory === "all"
      ? displayBulletins
      : displayBulletins.filter((b) => b.category === filterCategory);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 64px" }}>
      {/* Page header */}
      <header style={{ marginBottom: "48px" }}>
        <p
          style={{
            fontSize: "0.8125rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            marginBottom: "8px",
          }}
        >
          Comunicaciones EPSA
        </p>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: "var(--color-primary)",
            lineHeight: 1.2,
            marginBottom: "12px",
          }}
        >
          Boletines y Noticias
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-muted)",
            maxWidth: "620px",
            lineHeight: 1.65,
          }}
        >
          Mantente informado sobre el estado ambiental del proyecto. Suscríbete
          para recibir los boletines mensuales directamente en tu correo.
        </p>
      </header>

      {/* Subscription section */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "56px",
        }}
      >
        {/* Subscribe form */}
        <div
          style={{
            background: "var(--color-primary)",
            borderRadius: "var(--radius-md)",
            padding: "28px 24px",
            color: "#ffffff",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              marginBottom: "8px",
              color: "#ffffff",
            }}
          >
            Suscríbete al boletín
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.75)",
              marginBottom: "20px",
              lineHeight: 1.55,
            }}
          >
            Recibe el boletín mensual con los indicadores ambientales y novedades
            del proyecto.
          </p>
          {subscribeStatus === "success" ? (
            <p
              role="alert"
              style={{
                background: "rgba(46,139,87,0.3)",
                border: "1px solid var(--sema-ok)",
                borderRadius: "var(--radius-sm)",
                padding: "14px 16px",
                fontSize: "0.9rem",
                color: "#ffffff",
              }}
            >
              ¡Suscripción confirmada! Recibirás el próximo boletín en tu correo.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} noValidate>
              <label
                htmlFor="subscribe-email"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Correo electrónico
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <input
                  id="subscribe-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.cl"
                  required
                  style={{
                    flex: "1 1 180px",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.12)",
                    color: "#ffffff",
                    fontSize: "0.9rem",
                  }}
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === "submitting"}
                  style={{
                    padding: "10px 20px",
                    background: "var(--color-accent)",
                    color: "var(--color-bg-deep)",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {subscribeStatus === "submitting" ? "Enviando…" : "Suscribirme"}
                </button>
              </div>
              {subscribeStatus === "error" && (
                <p
                  role="alert"
                  style={{
                    marginTop: "10px",
                    color: "#ffbdbd",
                    fontSize: "0.8125rem",
                  }}
                >
                  Hubo un error. Inténtalo de nuevo más tarde.
                </p>
              )}
            </form>
          )}
        </div>

        {/* Unsubscribe form */}
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-line)",
            padding: "28px 24px",
          }}
        >
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--color-ink)",
              marginBottom: "8px",
            }}
          >
            Cancelar suscripción
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-muted)",
              marginBottom: "20px",
              lineHeight: 1.55,
            }}
          >
            Si ya no deseas recibir el boletín, puedes darte de baja en cualquier
            momento.
          </p>
          {unsubStatus === "success" ? (
            <p
              role="alert"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
                borderRadius: "var(--radius-sm)",
                padding: "14px 16px",
                fontSize: "0.9rem",
                color: "var(--color-muted)",
              }}
            >
              Tu correo fue eliminado de la lista de distribución.
            </p>
          ) : (
            <form onSubmit={handleUnsubscribe} noValidate>
              <label
                htmlFor="unsub-email"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-ink)",
                  marginBottom: "8px",
                }}
              >
                Correo electrónico
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <input
                  id="unsub-email"
                  type="email"
                  value={unsubEmail}
                  onChange={(e) => setUnsubEmail(e.target.value)}
                  placeholder="tu@correo.cl"
                  required
                  style={{
                    flex: "1 1 180px",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-line)",
                    background: "var(--color-bg)",
                    color: "var(--color-ink)",
                    fontSize: "0.9rem",
                  }}
                />
                <button
                  type="submit"
                  disabled={unsubStatus === "submitting"}
                  style={{
                    padding: "10px 20px",
                    background: "var(--color-bg)",
                    color: "var(--color-muted)",
                    border: "1px solid var(--color-line)",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {unsubStatus === "submitting" ? "Procesando…" : "Darme de baja"}
                </button>
              </div>
              {unsubStatus === "error" && (
                <p
                  role="alert"
                  style={{
                    marginTop: "10px",
                    color: "var(--sema-bad)",
                    fontSize: "0.8125rem",
                  }}
                >
                  Hubo un error. Inténtalo de nuevo más tarde.
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* Bulletins list */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "24px",
            paddingBottom: "12px",
            borderBottom: "2px solid var(--color-line)",
          }}
        >
          <h2
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              color: "var(--color-ink)",
            }}
          >
            Publicaciones
          </h2>
          <div
            role="group"
            aria-label="Filtrar publicaciones"
            style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
          >
            {(["all", "boletin", "noticia"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                aria-pressed={filterCategory === cat}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid",
                  borderColor:
                    filterCategory === cat ? "var(--color-accent)" : "var(--color-line)",
                  background:
                    filterCategory === cat ? "var(--color-accent)" : "var(--color-surface)",
                  color:
                    filterCategory === cat ? "var(--color-bg-deep)" : "var(--color-muted)",
                  fontWeight: filterCategory === cat ? 700 : 500,
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                }}
              >
                {cat === "all" ? "Todos" : cat === "boletin" ? "Boletines" : "Noticias"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "64px",
            }}
          >
            <LoadingSpinner size={48} label="Cargando publicaciones…" />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {filtered.map((item) => (
              <article
                key={item.id}
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-line)",
                  boxShadow: "var(--shadow-card)",
                  padding: "20px 24px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{ fontSize: "2rem", flexShrink: 0, marginTop: "2px" }}
                >
                  {item.category === "boletin" ? "📋" : "📰"}
                </div>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: "var(--radius-full)",
                        background:
                          item.category === "boletin"
                            ? "rgba(0,59,92,0.1)"
                            : "rgba(0,159,227,0.1)",
                        color:
                          item.category === "boletin"
                            ? "var(--color-primary)"
                            : "var(--color-accent-700)",
                        border: `1px solid ${item.category === "boletin" ? "var(--color-primary)" : "var(--color-accent)"}`,
                      }}
                    >
                      {item.category === "boletin" ? "Boletín" : "Noticia"}
                    </span>
                    <time
                      dateTime={item.date}
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--color-muted)",
                      }}
                    >
                      {formatDate(item.date)}
                    </time>
                  </div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--color-ink)",
                      marginBottom: "8px",
                      lineHeight: 1.35,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-muted)",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.summary}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    alignSelf: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.downloadUrl && (
                    <a
                      href={item.downloadUrl}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "9px 16px",
                        background: "var(--color-primary)",
                        color: "#ffffff",
                        borderRadius: "var(--radius-sm)",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span aria-hidden="true">⬇</span>
                      Descargar PDF
                    </a>
                  )}
                  {item.readUrl && (
                    <a
                      href={item.readUrl}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "9px 16px",
                        background: "var(--color-bg)",
                        color: "var(--color-primary)",
                        border: "1px solid var(--color-line)",
                        borderRadius: "var(--radius-sm)",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Leer más →
                    </a>
                  )}
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  padding: "48px",
                  color: "var(--color-muted)",
                  fontSize: "0.9rem",
                }}
              >
                No hay publicaciones en esta categoría.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
