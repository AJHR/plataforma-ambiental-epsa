import Link from "next/link";

const modules = [
  {
    href: "/el-proyecto",
    emoji: "🗺️",
    title: "El Proyecto",
    description:
      "Conoce el Puerto Exterior de San Antonio: sus áreas de influencia, objetivos ambientales y el equipo responsable del monitoreo.",
  },
  {
    href: "/seguimiento",
    emoji: "📊",
    title: "Seguimiento Ambiental",
    description:
      "Consulta en tiempo real los indicadores de calidad del aire, agua, fauna, vegetación y más. Datos actualizados con semáforo de estado.",
  },
  {
    href: "/participa",
    emoji: "🤝",
    title: "Participa",
    description:
      "Reporta observaciones, participa en consultas ciudadanas y mantente informado sobre las instancias de participación comunitaria.",
  },
  {
    href: "/aprende",
    emoji: "📚",
    title: "Aprende",
    description:
      "Cápsulas educativas, glosario ambiental y preguntas frecuentes para entender el impacto y la gestión ambiental del proyecto.",
  },
] as const;

const secondaryLinks = [
  { href: "/boletines", emoji: "📰", label: "Boletines y Noticias" },
  { href: "/documentos", emoji: "📁", label: "Documentos y Reportes" },
];

export default function HomePage() {
  return (
    <>
      <style>{`
        .module-card {
          display: flex;
          flex-direction: column;
          background: var(--color-surface);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-line);
          box-shadow: var(--shadow-card);
          padding: 32px 28px;
          color: var(--color-ink);
          text-decoration: none;
          transition: box-shadow 0.18s, transform 0.18s;
        }
        .module-card:hover {
          box-shadow: 0 6px 24px rgba(0,59,92,0.14);
          transform: translateY(-2px);
        }
        .secondary-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 28px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-line);
          background: var(--color-bg);
          color: var(--color-primary);
          font-weight: 600;
          font-size: 0.9375rem;
          min-width: 220px;
          justify-content: center;
          transition: background 0.15s, border-color 0.15s;
        }
        .secondary-link:hover {
          background: var(--color-surface);
          border-color: var(--color-primary);
        }
        .hero-cta-primary {
          background: var(--color-accent);
          color: var(--color-bg-deep);
          padding: 14px 28px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.9375rem;
          display: inline-block;
          transition: opacity 0.15s;
        }
        .hero-cta-primary:hover { opacity: 0.9; }
        .hero-cta-secondary {
          background: rgba(255,255,255,0.12);
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.35);
          padding: 14px 28px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.9375rem;
          display: inline-block;
          transition: background 0.15s;
        }
        .hero-cta-secondary:hover { background: rgba(255,255,255,0.2); }
      `}</style>

      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-bg-deep) 0%, var(--color-primary) 60%, var(--color-primary-600) 100%)",
          color: "#ffffff",
          padding: "80px 24px 72px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "0.8125rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: "16px",
            }}
          >
            EPSA — Puerto Exterior San Antonio
          </p>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "20px",
            }}
          >
            Plataforma de Información Ambiental Puerto Exterior
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.1875rem)",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.82)",
              maxWidth: "560px",
              margin: "0 auto 36px",
            }}
          >
            Accede de forma transparente a los datos de monitoreo ambiental del
            Puerto Exterior de San Antonio. Información actualizada, verificable
            y comprensible para toda la comunidad.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/seguimiento"
              role="link"
              className="hero-cta-primary"
            >
              Explorar la plataforma
            </Link>
            <Link
              href="/el-proyecto"
              role="link"
              className="hero-cta-secondary"
            >
              Conocer más
            </Link>
          </div>
        </div>
      </section>

      {/* Module cards */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "64px 24px 48px",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: 700,
            color: "var(--color-ink)",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Módulos de la Plataforma
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "var(--color-muted)",
            marginBottom: "40px",
            fontSize: "1rem",
          }}
        >
          Explora cada área de la plataforma ambiental
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              role="link"
              aria-label={mod.title}
              className="module-card"
            >
              <span
                aria-hidden="true"
                style={{ fontSize: "2.5rem", marginBottom: "16px", display: "block" }}
              >
                {mod.emoji}
              </span>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  marginBottom: "10px",
                }}
              >
                {mod.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--color-muted)",
                  lineHeight: 1.65,
                  flex: 1,
                }}
              >
                {mod.description}
              </p>
              <span
                aria-hidden="true"
                style={{
                  marginTop: "20px",
                  color: "var(--color-accent)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                Explorar →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Secondary links */}
      <section
        style={{
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-line)",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="link"
              aria-label={link.label}
              className="secondary-link"
            >
              <span aria-hidden="true" style={{ fontSize: "1.375rem" }}>
                {link.emoji}
              </span>
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section
        style={{
          background: "var(--color-primary)",
          color: "#ffffff",
          padding: "48px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "32px",
            textAlign: "center",
          }}
        >
          {[
            { value: "8", label: "Componentes monitoreados" },
            { value: "4", label: "Áreas de influencia" },
            { value: "24/7", label: "Monitoreo continuo" },
            { value: "100%", label: "Datos públicos" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "var(--color-accent)",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.75)",
                  marginTop: "4px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
