import MapViewer from "@/components/MapViewer";

export const metadata = {
  title: "El Proyecto — EPSA Plataforma Ambiental",
  description:
    "Descripción del Puerto Exterior de San Antonio y las áreas de monitoreo ambiental del proyecto EPSA.",
};

const areas = [
  {
    id: "puerto-exterior",
    color: "#003b5c",
    label: "Puerto Exterior",
    description:
      "Zona de infraestructura portuaria principal donde se desarrollan las operaciones de carga y descarga. Concentra monitoreo de emisiones, ruido y calidad del aire.",
  },
  {
    id: "zona-amortiguacion",
    color: "#2e8b57",
    label: "Zona de Amortiguación",
    description:
      "Franja buffer entre el puerto y las áreas sensibles. Se monitorean vegetación, fauna y calidad del suelo para detectar impactos indirectos.",
  },
  {
    id: "area-marina",
    color: "#009fe3",
    label: "Área Marina",
    description:
      "Zona de influencia sobre el ecosistema marino y costero. Incluye seguimiento de calidad hídrica, sedimentos y fauna acuática.",
  },
  {
    id: "zona-terrestre",
    color: "#e8743b",
    label: "Zona Terrestre",
    description:
      "Área de monitoreo de biodiversidad terrestre, vegetación nativa y calidad del suelo en los sectores adyacentes al puerto.",
  },
];

const phases = [
  {
    name: "Etapa I — Línea de Base",
    period: "2023 – 2024",
    description:
      "Levantamiento de información de referencia para los 8 componentes ambientales. Define los valores base para comparación futura.",
    status: "Completada",
    statusColor: "var(--sema-ok)",
  },
  {
    name: "Etapa II — Construcción",
    period: "2024 – 2026",
    description:
      "Monitoreo activo durante las obras. Detecta desviaciones respecto a la línea de base y activa protocolos de respuesta.",
    status: "En curso",
    statusColor: "var(--sema-warn)",
  },
  {
    name: "Etapa III — Operación",
    period: "2026 en adelante",
    description:
      "Monitoreo continuo durante la operación plena del puerto. Reportes trimestrales y ajustes al Plan de Manejo Ambiental.",
    status: "Próxima",
    statusColor: "var(--color-muted)",
  },
];

export default function ElProyectoPage() {
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
          Puerto Exterior San Antonio
        </p>
        <h1
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 800,
            color: "var(--color-primary)",
            lineHeight: 1.2,
            marginBottom: "16px",
          }}
        >
          El Proyecto
        </h1>
        <p
          style={{
            fontSize: "1.0625rem",
            color: "var(--color-muted)",
            maxWidth: "680px",
            lineHeight: 1.7,
          }}
        >
          El Puerto Exterior de San Antonio es una de las mayores obras de
          infraestructura portuaria de Chile. El Plan de Manejo Ambiental (PMA)
          establece un sistema de monitoreo continuo para asegurar la protección
          del entorno natural y la calidad de vida de las comunidades vecinas.
        </p>
      </header>

      {/* Description section */}
      <section style={{ marginBottom: "56px" }}>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--color-ink)",
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "2px solid var(--color-line)",
          }}
        >
          Descripción General
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-line)",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--color-primary)",
                marginBottom: "10px",
              }}
            >
              Objetivo General
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-muted)",
                lineHeight: 1.65,
              }}
            >
              Monitorear y gestionar los impactos ambientales del Puerto Exterior
              de San Antonio, garantizando el cumplimiento de la Resolución de
              Calificación Ambiental (RCA) y los estándares internacionales de
              sostenibilidad portuaria.
            </p>
          </div>
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-line)",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--color-primary)",
                marginBottom: "10px",
              }}
            >
              Componentes Monitoreados
            </h3>
            <ul
              style={{
                fontSize: "0.9rem",
                color: "var(--color-muted)",
                lineHeight: 1.65,
                paddingLeft: "0",
                listStyle: "none",
              }}
            >
              {[
                "Calidad del Aire",
                "Calidad Hídrica",
                "Fauna",
                "Vegetación",
                "Ruido y Vibraciones",
                "Sedimentos",
                "Paisaje",
                "Calidad del Suelo",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "3px 0",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--color-accent)",
                      flexShrink: 0,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-line)",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--color-primary)",
                marginBottom: "10px",
              }}
            >
              Ficha Técnica
            </h3>
            <dl style={{ fontSize: "0.9rem", color: "var(--color-muted)" }}>
              {[
                { dt: "Ubicación", dd: "San Antonio, Región de Valparaíso" },
                { dt: "Inversión", dd: "USD 2.700 millones" },
                { dt: "Capacidad", dd: "3 millones de TEU/año" },
                { dt: "Inicio obras", dd: "2024" },
                { dt: "Operación", dd: "2026 (Fase I)" },
              ].map(({ dt, dd }) => (
                <div
                  key={dt}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px solid var(--color-line)",
                    gap: "16px",
                  }}
                >
                  <dt style={{ fontWeight: 600, color: "var(--color-ink)", flexShrink: 0 }}>{dt}</dt>
                  <dd style={{ textAlign: "right" }}>{dd}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Map section */}
      <section style={{ marginBottom: "56px" }}>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--color-ink)",
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "2px solid var(--color-line)",
          }}
        >
          Áreas de Monitoreo
        </h2>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--color-muted)",
            marginBottom: "24px",
            lineHeight: 1.65,
          }}
        >
          El plan de monitoreo abarca cuatro zonas geográficas, cada una con
          indicadores y frecuencias de medición diferenciadas según sus
          características ambientales.
        </p>

        <MapViewer />

        {/* Area descriptions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {areas.map((area) => (
            <div
              key={area.id}
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-line)",
                padding: "18px",
                borderLeft: `4px solid ${area.color}`,
              }}
            >
              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  color: "var(--color-ink)",
                  marginBottom: "8px",
                }}
              >
                {area.label}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-muted)",
                  lineHeight: 1.6,
                }}
              >
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Phases */}
      <section>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--color-ink)",
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "2px solid var(--color-line)",
          }}
        >
          Etapas de Implementación
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {phases.map((phase, idx) => (
            <div
              key={phase.name}
              style={{
                display: "flex",
                gap: "20px",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-line)",
                padding: "20px 24px",
                alignItems: "flex-start",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "var(--color-primary)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1rem",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "6px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--color-ink)",
                    }}
                  >
                    {phase.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: phase.statusColor,
                      padding: "2px 10px",
                      borderRadius: "var(--radius-full)",
                      border: `1px solid ${phase.statusColor}`,
                      background: `${phase.statusColor}18`,
                    }}
                  >
                    {phase.status}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-accent)",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  {phase.period}
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--color-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {phase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
