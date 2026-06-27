"use client";

import { useState, useEffect, useRef } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Capsule {
  id: string;
  title: string;
  content: string;
  emoji: string;
}

interface GlossaryTerm {
  term: string;
  definition: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

const FALLBACK_CAPSULES: Capsule[] = [
  {
    id: "1",
    emoji: "🌫️",
    title: "¿Qué es el material particulado (MP)?",
    content:
      "El material particulado (MP) son pequeñas partículas sólidas o líquidas suspendidas en el aire. Se clasifican según su tamaño: MP10 (menores a 10 µm) y MP2,5 (menores a 2,5 µm). Las más pequeñas son las más peligrosas, ya que pueden penetrar profundamente en los pulmones. La Norma Primaria Chilena fija límites de 50 µg/m³ para MP10 en promedio anual.",
  },
  {
    id: "2",
    emoji: "💧",
    title: "Calidad Hídrica: parámetros clave",
    content:
      "El monitoreo de calidad hídrica evalúa el pH (acidez), oxígeno disuelto, turbidez, temperatura y presencia de metales pesados. Un pH entre 6,5 y 8,5 es adecuado para la vida acuática. La turbidez se mide en NTU (Unidades Nefelométricas de Turbidez). El Decreto 90 del MMA establece los límites para emisión a cuerpos de agua.",
  },
  {
    id: "3",
    emoji: "🦅",
    title: "Monitoreo de Fauna: metodologías",
    content:
      "Para monitorear fauna se utilizan transectos lineales (recorridos sistemáticos contando individuos), cámaras trampa, redes de niebla para aves y murciélagos, y muestreos acústicos. Los resultados se expresan como índices de abundancia relativa (IAR) o densidad estimada por hectárea. Es importante registrar estacionalidad y comparar con la línea de base.",
  },
  {
    id: "4",
    emoji: "📏",
    title: "¿Qué es la RCA y por qué importa?",
    content:
      "La Resolución de Calificación Ambiental (RCA) es el instrumento legal que aprueba un proyecto de inversión en Chile, estableciendo las condiciones bajo las cuales puede ejecutarse. Incluye compromisos ambientales, medidas de mitigación y el Plan de Monitoreo. El incumplimiento de la RCA puede derivar en multas o la paralización del proyecto.",
  },
  {
    id: "5",
    emoji: "🌱",
    title: "Vegetación y sus indicadores",
    content:
      "El índice de cobertura vegetal mide qué porcentaje del suelo está cubierto por plantas vivas. La riqueza de especies indica cuántas especies distintas hay en un área. El NDVI (Índice de Vegetación de Diferencia Normalizada) se calcula con imágenes satelitales y permite monitorear cambios en la vegetación sin necesidad de trabajo en terreno.",
  },
  {
    id: "6",
    emoji: "📢",
    title: "Ruido ambiental: normas y medición",
    content:
      "El ruido se mide en decibeles A [dB(A)]. El Decreto 38 del MMA fija límites horarios según zona (residencial, mixta, industrial). La medición se realiza con sonómetros calibrados durante periodos de día (7:00–21:00 h) y noche (21:00–7:00 h). Un sonido de 65 dB(A) equivale aproximadamente al ruido de una conversación animada.",
  },
];

const FALLBACK_GLOSSARY: GlossaryTerm[] = [
  {
    term: "RCA",
    definition:
      "Resolución de Calificación Ambiental. Documento legal que aprueba un proyecto sujeto al Sistema de Evaluación de Impacto Ambiental (SEIA), estableciendo condiciones y compromisos ambientales.",
  },
  {
    term: "PMA",
    definition:
      "Plan de Manejo Ambiental. Conjunto de medidas, programas y acciones diseñadas para prevenir, mitigar, corregir o compensar los impactos ambientales de un proyecto.",
  },
  {
    term: "Línea de Base",
    definition:
      "Descripción del estado del medio ambiente en el área de influencia de un proyecto antes de su ejecución. Sirve como referencia para evaluar los impactos.",
  },
  {
    term: "MP2,5",
    definition:
      "Material particulado fino con diámetro aerodinámico menor o igual a 2,5 micrómetros. Por su pequeño tamaño puede penetrar profundamente en el sistema respiratorio.",
  },
  {
    term: "SINCA",
    definition:
      "Sistema de Información Nacional de Calidad del Aire. Plataforma del Ministerio del Medio Ambiente que integra datos de redes de monitoreo de calidad del aire en Chile.",
  },
  {
    term: "TEU",
    definition:
      "Twenty-foot Equivalent Unit. Unidad de medida estándar de contenedores de carga marítima, equivalente a un contenedor de 20 pies de longitud.",
  },
  {
    term: "Turbidez",
    definition:
      "Medida de la claridad del agua. Indica la cantidad de partículas en suspensión. Se mide en Unidades Nefelométricas de Turbidez (NTU).",
  },
  {
    term: "IAR",
    definition:
      "Índice de Abundancia Relativa. Indicador que estima la densidad de individuos de una especie en función de las detecciones en transectos o puntos de conteo.",
  },
];

const FALLBACK_FAQ: FaqItem[] = [
  {
    question: "¿Con qué frecuencia se actualizan los datos de monitoreo?",
    answer:
      "La frecuencia varía según el componente. Calidad del Aire se actualiza diariamente desde estaciones automáticas. Calidad Hídrica y Sedimentos se reportan mensualmente. Fauna y Vegetación se evalúan de forma estacional (4 veces al año). Todos los datos se publican en esta plataforma dentro de las 48 horas siguientes a su verificación.",
  },
  {
    question: "¿Quién fiscaliza el cumplimiento del monitoreo?",
    answer:
      "La Superintendencia del Medio Ambiente (SMA) es el organismo fiscalizador. El Servicio de Evaluación Ambiental (SEA) supervisa el cumplimiento de las condiciones de la RCA. Adicionalmente, existe un Comité Ciudadano de Monitoreo que puede acceder a todos los datos en tiempo real.",
  },
  {
    question: "¿Cómo puedo reportar una anomalía ambiental?",
    answer:
      "Puedes reportar a través del módulo 'Participa' de esta plataforma, por la línea directa EPSA (600 XXX XXXX), o directamente a la SMA a través del formulario en sma.gob.cl. Todos los reportes son respondidos en un plazo máximo de 72 horas hábiles.",
  },
  {
    question: "¿Qué significa el semáforo de estado?",
    answer:
      "Verde (Normal): los valores están dentro de los rangos establecidos por la normativa y la RCA. Amarillo (Advertencia): se detectaron valores que se acercan a los límites, se activan medidas preventivas. Rojo (Alerta): se superaron los límites, se deben aplicar medidas correctivas inmediatas y notificar a la autoridad.",
  },
  {
    question: "¿Los datos son auditables?",
    answer:
      "Sí. Todos los datos son auditables. Los laboratorios acreditados por el INN realizan los análisis y emiten informes con cadena de custodia. Los datos crudos y los informes mensuales están disponibles para descarga en el módulo Documentos. Las metodologías de muestreo siguen protocolos ISO y ASTM.",
  },
];

interface TooltipProps {
  term: string;
  definition: string;
}

function Tooltip({ term, definition }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span style={{ position: "relative", display: "inline" }}>
      <button
        type="button"
        ref={ref as React.RefObject<HTMLButtonElement>}
        aria-describedby={`tooltip-${term}`}
        onClick={() => setVisible((v) => !v)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        style={{
          background: "none",
          border: "none",
          padding: "0 1px",
          cursor: "help",
          fontWeight: 700,
          color: "var(--color-primary)",
          textDecoration: "underline dotted",
          textUnderlineOffset: "3px",
          fontSize: "inherit",
          fontFamily: "inherit",
        }}
      >
        {term}
      </button>
      {visible && (
        <span
          id={`tooltip-${term}`}
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
            background: "var(--color-bg-deep)",
            color: "#ffffff",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.8125rem",
            lineHeight: 1.55,
            maxWidth: "280px",
            width: "max-content",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <strong style={{ display: "block", marginBottom: "4px" }}>{term}</strong>
          {definition}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              border: "6px solid transparent",
              borderTopColor: "var(--color-bg-deep)",
            }}
          />
        </span>
      )}
    </span>
  );
}

interface FaqAccordionItemProps {
  item: FaqItem;
  idx: number;
}

function FaqAccordionItem({ item, idx }: FaqAccordionItemProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`faq-answer-${idx}`}
        id={`faq-question-${idx}`}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "18px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          textAlign: "left",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "var(--color-ink)",
            lineHeight: 1.45,
          }}
        >
          {item.question}
        </span>
        <span
          aria-hidden="true"
          style={{
            fontSize: "1.25rem",
            color: "var(--color-muted)",
            flexShrink: 0,
            transition: "transform 0.2s",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
      </button>
      <div
        id={`faq-answer-${idx}`}
        role="region"
        aria-labelledby={`faq-question-${idx}`}
        style={{
          overflow: "hidden",
          maxHeight: open ? "600px" : "0",
          transition: "max-height 0.25s ease",
        }}
      >
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--color-muted)",
            lineHeight: 1.7,
            paddingBottom: "18px",
          }}
        >
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function AprendePage() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controllers = [
      new AbortController(),
      new AbortController(),
      new AbortController(),
    ];

    Promise.allSettled([
      fetch("/api/content/educativo", { signal: controllers[0]!.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((j: { data: Capsule[] }) => setCapsules(j.data)),
      fetch("/api/content/glosario", { signal: controllers[1]!.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((j: { data: GlossaryTerm[] }) => setGlossary(j.data)),
      fetch("/api/content/faq", { signal: controllers[2]!.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((j: { data: FaqItem[] }) => setFaq(j.data)),
    ])
      .then((results) => {
        if (results[0]?.status === "rejected" || capsules.length === 0)
          setCapsules(FALLBACK_CAPSULES);
        if (results[1]?.status === "rejected" || glossary.length === 0)
          setGlossary(FALLBACK_GLOSSARY);
        if (results[2]?.status === "rejected" || faq.length === 0)
          setFaq(FALLBACK_FAQ);
      })
      .catch(() => {
        setCapsules(FALLBACK_CAPSULES);
        setGlossary(FALLBACK_GLOSSARY);
        setFaq(FALLBACK_FAQ);
      })
      .finally(() => setLoading(false));

    return () => controllers.forEach((c) => c.abort());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show fallbacks immediately if loading takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setCapsules(FALLBACK_CAPSULES);
        setGlossary(FALLBACK_GLOSSARY);
        setFaq(FALLBACK_FAQ);
        setLoading(false);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner size={48} label="Cargando contenido educativo…" />
      </div>
    );
  }

  const displayCapsules = capsules.length > 0 ? capsules : FALLBACK_CAPSULES;
  const displayGlossary = glossary.length > 0 ? glossary : FALLBACK_GLOSSARY;
  const displayFaq = faq.length > 0 ? faq : FALLBACK_FAQ;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 64px" }}>
      {/* Page header */}
      <header style={{ marginBottom: "52px" }}>
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
          Educación Ambiental
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
          Aprende
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-muted)",
            maxWidth: "620px",
            lineHeight: 1.65,
          }}
        >
          Recursos para entender el monitoreo ambiental del Puerto Exterior.
          Cápsulas educativas, glosario de términos y respuestas a las preguntas
          más frecuentes.
        </p>
      </header>

      {/* Educational capsules */}
      <section style={{ marginBottom: "64px" }}>
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
          Cápsulas Educativas
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {displayCapsules.map((cap) => (
            <article
              key={cap.id}
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-line)",
                boxShadow: "var(--shadow-card)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <span
                aria-hidden="true"
                style={{ fontSize: "2rem", display: "block" }}
              >
                {cap.emoji}
              </span>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  lineHeight: 1.35,
                }}
              >
                {cap.title}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--color-muted)",
                  lineHeight: 1.7,
                  flex: 1,
                }}
              >
                {cap.content}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Glossary */}
      <section style={{ marginBottom: "64px" }}>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--color-ink)",
            marginBottom: "8px",
            paddingBottom: "10px",
            borderBottom: "2px solid var(--color-line)",
          }}
        >
          Glosario Ambiental
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-muted)",
            marginBottom: "24px",
          }}
        >
          Pasa el cursor o toca un término para ver su definición completa.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "32px",
          }}
        >
          {displayGlossary.map((item) => (
            <Tooltip key={item.term} term={item.term} definition={item.definition} />
          ))}
        </div>
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {displayGlossary.map((item) => (
            <div
              key={item.term}
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-line)",
                padding: "16px 18px",
              }}
            >
              <dt
                style={{
                  fontWeight: 700,
                  color: "var(--color-primary)",
                  fontSize: "0.9375rem",
                  marginBottom: "6px",
                }}
              >
                {item.term}
              </dt>
              <dd
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-muted)",
                  lineHeight: 1.6,
                }}
              >
                {item.definition}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* FAQ */}
      <section>
        <h2
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--color-ink)",
            marginBottom: "8px",
            paddingBottom: "10px",
            borderBottom: "2px solid var(--color-line)",
          }}
        >
          Preguntas Frecuentes
        </h2>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-muted)",
            marginBottom: "24px",
          }}
        >
          Respuestas a las consultas más comunes sobre la plataforma y el
          monitoreo ambiental.
        </p>
        <div>
          {displayFaq.map((item, idx) => (
            <FaqAccordionItem key={idx} item={item} idx={idx} />
          ))}
        </div>
      </section>
    </div>
  );
}
