"use client";

import { useState, useEffect, useMemo } from "react";
import { Hero, Section, Container, SectionTitle, Card } from "@/components/ui";
import { IMAGES } from "@/lib/images";

interface Compromiso {
  id: string;
  tipo: string;
  componente: string;
  titulo: string;
  descripcion: string;
  fase: string;
  frecuencia: string;
  area?: string;
}

// Etapa I del TDR (Tabla N°2). Fallback embebido para que la vista funcione
// aunque la API no responda (mismo patrón que el resto de las páginas).
const FALLBACK: Compromiso[] = [
  {
    id: "SMC-CCA-2",
    tipo: "Plan de seguimiento",
    componente: "Calidad del aire",
    titulo: "Monitoreo de MP10 y MP2,5 en estaciones de calidad del aire",
    descripcion:
      "Seguimiento de la medida de control: monitoreo de material particulado respirable MP10 y MP2,5 en las estaciones de calidad del aire del área del Proyecto.",
    fase: "Construcción y operación",
    frecuencia: "Mensual",
    area: "Área Portuaria y Vialidad",
  },
  {
    id: "CAV-CA-2",
    tipo: "Compromiso Ambiental Voluntario",
    componente: "Calidad del aire",
    titulo: "Plan de seguimiento voluntario monitoreo calidad del aire",
    descripcion:
      "Plan de seguimiento voluntario del monitoreo de la calidad del aire en el área de influencia del Proyecto.",
    fase: "Construcción y operación",
    frecuencia: "Mensual",
    area: "Áreas del Proyecto",
  },
  {
    id: "CAV-CA-3",
    tipo: "Compromiso Ambiental Voluntario",
    componente: "Calidad del aire",
    titulo: "Monitoreo material particulado sedimentable en sector canteras",
    descripcion:
      "Monitoreo voluntario de material particulado sedimentable (MPS) en el sector de canteras.",
    fase: "Construcción y operación",
    frecuencia: "Mensual",
    area: "Área Canteras",
  },
  {
    id: "CAV-RU-2",
    tipo: "Compromiso Ambiental Voluntario",
    componente: "Niveles de ruido",
    titulo: "Monitoreo de ruido en receptores humanos",
    descripcion:
      "Monitoreo voluntario de los niveles de ruido en receptores humanos del área de influencia del Proyecto.",
    fase: "Construcción y operación",
    frecuencia: "Según plan de seguimiento",
    area: "Áreas del Proyecto",
  },
  {
    id: "CAV-VI-2",
    tipo: "Compromiso Ambiental Voluntario",
    componente: "Vibraciones",
    titulo:
      "Plan de seguimiento voluntario de vibraciones en viviendas cercanas a línea férrea",
    descripcion:
      "Plan de seguimiento voluntario de los niveles de vibraciones en viviendas cercanas a la línea férrea, en el Área Transporte y Vialidad.",
    fase: "Construcción y operación",
    frecuencia: "Según plan de seguimiento",
    area: "Área Transporte y Vialidad",
  },
  {
    id: "CAV-AS-1",
    tipo: "Compromiso Ambiental Voluntario",
    componente: "Fauna y flora",
    titulo: "Monitoreo de flora y fauna en lagunas Llolleo y Estuario Río Maipo",
    descripcion:
      "Monitoreo voluntario de flora y fauna en el sistema de lagunas de Llolleo y el estuario del Río Maipo.",
    fase: "Construcción y operación",
    frecuencia: "Estacional",
    area: "Lagunas de Llolleo / Estuario Río Maipo",
  },
  {
    id: "CAV-EAC-2",
    tipo: "Compromiso Ambiental Voluntario",
    componente: "Ecosistemas acuáticos continentales",
    titulo: "Monitoreo voluntario de biota acuática en estuario Río Maipo",
    descripcion:
      "Monitoreo voluntario de la biota acuática en el estuario del Río Maipo.",
    fase: "Construcción y operación",
    frecuencia: "Estacional",
    area: "Estuario Río Maipo",
  },
  {
    id: "CAV-EAC-4",
    tipo: "Compromiso Ambiental Voluntario",
    componente: "Ecosistemas acuáticos continentales",
    titulo:
      "Plan de seguimiento voluntario ecosistemas acuáticos continentales en Parque Lagunas de Llolleo",
    descripcion:
      "Plan de seguimiento voluntario de los ecosistemas acuáticos continentales en el Parque Lagunas de Llolleo.",
    fase: "Construcción y operación",
    frecuencia: "Estacional",
    area: "Parque Lagunas de Llolleo",
  },
];

const TODOS = "Todos";

export default function CompromisosPage() {
  const [items, setItems] = useState<Compromiso[]>([]);
  const [componente, setComponente] = useState<string>(TODOS);
  const [tipo, setTipo] = useState<string>(TODOS);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/compromisos", { signal: controller.signal })
      .then((r) => (r.ok ? (r.json() as Promise<{ data: Compromiso[] }>) : Promise.reject()))
      .then((json) => {
        const list = json.data;
        setItems(Array.isArray(list) && list.length > 0 ? list : FALLBACK);
      })
      .catch(() => setItems(FALLBACK));
    return () => controller.abort();
  }, []);

  const componentes = useMemo(
    () => [TODOS, ...Array.from(new Set(items.map((i) => i.componente)))],
    [items]
  );
  const tipos = useMemo(
    () => [TODOS, ...Array.from(new Set(items.map((i) => i.tipo)))],
    [items]
  );

  const filtered = items.filter(
    (i) =>
      (componente === TODOS || i.componente === componente) &&
      (tipo === TODOS || i.tipo === tipo)
  );

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: "var(--radius-sm)",
    border: "1.5px solid var(--color-line)",
    background: "var(--color-surface)",
    fontSize: "0.875rem",
    color: "var(--color-ink)",
    cursor: "pointer",
  };

  return (
    <>
      <Hero
        size="md"
        image={IMAGES.aguaDetalle}
        eyebrow="Plan de Seguimiento Ambiental"
        titleEmphasis="Compromisos ambientales"
        subtitle="Medidas, planes de seguimiento y compromisos ambientales voluntarios (CAV) del proyecto Puerto Exterior de San Antonio comprometidos para la Etapa I."
      />

      <Section tone="muted">
        <Container>
          {/* Aviso de alcance */}
          <div
            role="note"
            style={{
              padding: "12px 16px",
              marginBottom: "28px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-line)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              color: "var(--color-muted)",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "var(--color-ink)" }}>Etapa I —</strong> se
            informan {items.length} compromisos y planes de seguimiento. Calidad
            del aire con actualización <strong>mensual</strong>; fauna, flora y
            biota acuática con actualización <strong>estacional</strong>.
          </div>

          <SectionTitle
            eyebrow="Seguimiento comprometido"
            lead="Medidas, planes y"
            emphasis="CAV"
          />

          {/* Filtros */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              margin: "24px 0 8px",
            }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-muted)" }}>
              Componente
              <select
                aria-label="Filtrar por componente"
                value={componente}
                onChange={(e) => setComponente(e.target.value)}
                style={selectStyle}
              >
                {componentes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-muted)" }}>
              Tipo
              <select
                aria-label="Filtrar por tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={selectStyle}
              >
                {tipos.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Grilla de compromisos */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <Card key={c.id} data-testid="compromiso-card" className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm bg-primary/10 px-2 py-1 font-mono text-xs font-bold text-primary">
                    {c.id}
                  </span>
                  <span className="rounded-full border border-line px-2 py-0.5 text-xs font-medium text-muted">
                    {c.tipo}
                  </span>
                </div>
                <h3 className="text-base font-bold leading-snug text-ink">
                  {c.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{c.descripcion}</p>
                <dl className="mt-auto grid grid-cols-1 gap-1 border-t border-line pt-3 text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted">Componente</dt>
                    <dd className="text-right font-medium text-ink">{c.componente}</dd>
                  </div>
                  {c.area && (
                    <div className="flex justify-between gap-2">
                      <dt className="text-muted">Área</dt>
                      <dd className="text-right font-medium text-ink">{c.area}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted">Fase</dt>
                    <dd className="text-right font-medium text-ink">{c.fase}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted">Frecuencia</dt>
                    <dd className="text-right font-medium text-ink">{c.frecuencia}</dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
