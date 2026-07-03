"use client";

import { useState, useEffect } from "react";
import StatusBadge from "@/components/StatusBadge";
import Chart from "@/components/Chart";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Hero } from "@/components/ui";
import { IMAGES } from "@/lib/images";

interface MonitoringComponent {
  code: string;
  label: string;
  status: "ok" | "warn" | "bad";
  phrase: string;
  measuredBy: string;
  lastMeasured: string;
  downloadUrl?: string;
}

interface DataPoint {
  date: string;
  value: number;
  unit: string;
  threshold?: number;
}

const TABS: { code: string; label: string }[] = [
  { code: "aire", label: "Calidad del Aire" },
  { code: "hidrica", label: "Calidad Hídrica" },
  { code: "fauna", label: "Fauna" },
  { code: "vegetacion", label: "Vegetación" },
  { code: "ruido", label: "Ruido y Vibraciones" },
  { code: "sedimentos", label: "Sedimentos" },
  { code: "paisaje", label: "Paisaje" },
  { code: "suelo", label: "Suelo" },
];

// Frecuencia de actualización por componente (TDR §2.2 / ficha CAV OT-2):
// calidad del aire mensual; fauna y vegetación estacional; resto según los
// reportes a la SMA (cada dos meses).
const FRECUENCIAS: Record<string, string> = {
  aire: "Mensual",
  fauna: "Estacional",
  vegetacion: "Estacional",
  hidrica: "Bimestral",
  ruido: "Bimestral",
  sedimentos: "Bimestral",
  paisaje: "Bimestral",
  suelo: "Bimestral",
};
const frecuenciaDe = (code: string): string => FRECUENCIAS[code] ?? "Bimestral";

// Fallback data when API is unavailable
const FALLBACK_COMPONENTS: Record<string, MonitoringComponent> = {
  aire: {
    code: "aire",
    label: "Calidad del Aire",
    status: "ok",
    phrase: "Los niveles de material particulado se encuentran dentro de la norma.",
    measuredBy: "Estación SINCA — EPSA Norte",
    lastMeasured: "2026-06-30",
    downloadUrl: "/documentos/aire-junio-2026.pdf",
  },
  hidrica: {
    code: "hidrica",
    label: "Calidad Hídrica",
    status: "ok",
    phrase: "Parámetros fisicoquímicos dentro de rangos normales.",
    measuredBy: "Laboratorio EPSA — Zona Marina",
    lastMeasured: "2026-06-30",
    downloadUrl: "/documentos/hidrica-junio-2026.pdf",
  },
  fauna: {
    code: "fauna",
    label: "Fauna",
    status: "warn",
    phrase: "Se registró actividad inusual en aves migratorias. Seguimiento activo.",
    measuredBy: "Equipo de biodiversidad EPSA",
    lastMeasured: "2026-06-30",
    downloadUrl: "/documentos/fauna-junio-2026.pdf",
  },
  vegetacion: {
    code: "vegetacion",
    label: "Vegetación",
    status: "ok",
    phrase: "Cobertura vegetal estable, sin alteraciones significativas.",
    measuredBy: "Unidad de flora y vegetación EPSA",
    lastMeasured: "2026-06-30",
    downloadUrl: "/documentos/vegetacion-junio-2026.pdf",
  },
  ruido: {
    code: "ruido",
    label: "Ruido y Vibraciones",
    status: "warn",
    phrase: "Niveles de ruido diurno cerca del límite normativo durante jornadas de obra.",
    measuredBy: "Laboratorio acústico EPSA",
    lastMeasured: "2026-06-30",
    downloadUrl: "/documentos/ruido-junio-2026.pdf",
  },
  sedimentos: {
    code: "sedimentos",
    label: "Sedimentos",
    status: "ok",
    phrase: "Concentración de sedimentos en suspensión dentro de parámetros normales.",
    measuredBy: "Monitoreo marino EPSA",
    lastMeasured: "2026-06-30",
    downloadUrl: "/documentos/sedimentos-junio-2026.pdf",
  },
  paisaje: {
    code: "paisaje",
    label: "Paisaje",
    status: "ok",
    phrase: "Índice de calidad paisajística sin variación relevante respecto a la línea de base.",
    measuredBy: "Equipo de evaluación visual EPSA",
    lastMeasured: "2026-06-30",
    downloadUrl: "/documentos/paisaje-junio-2026.pdf",
  },
  suelo: {
    code: "suelo",
    label: "Suelo",
    status: "ok",
    phrase: "No se detectan contaminantes sobre los límites reglamentarios.",
    measuredBy: "Laboratorio de suelos EPSA",
    lastMeasured: "2026-06-30",
    downloadUrl: "/documentos/suelo-junio-2026.pdf",
  },
};

function buildFallbackSeries(code: string): DataPoint[] {
  const seedMap: Record<string, number> = {
    aire: 48, hidrica: 6.8, fauna: 12, vegetacion: 78, ruido: 61,
    sedimentos: 24, paisaje: 7.2, suelo: 3.1,
  };
  const unitMap: Record<string, string> = {
    aire: "µg/m³", hidrica: "pH", fauna: "ind", vegetacion: "%", ruido: "dB(A)",
    sedimentos: "mg/L", paisaje: "ICP", suelo: "mg/kg",
  };
  const threshMap: Record<string, number> = {
    aire: 75, hidrica: 8.5, ruido: 65, sedimentos: 40,
  };
  const base = seedMap[code] ?? 50;
  const unit = unitMap[code] ?? "u";
  const threshold = threshMap[code];
  // Serie mensual: 12 mediciones, una por mes, terminando el 30/06/2026.
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 6, 0)); // 30 jun 2026 (día 0 de julio)
    d.setUTCMonth(d.getUTCMonth() - (11 - i));
    const jitter = (Math.sin(i * 1.7 + code.length) * 0.15 + (i > 7 ? 0.06 : 0)) * base;
    return {
      date: d.toISOString().slice(0, 10),
      value: parseFloat((base + jitter).toFixed(2)),
      unit,
      ...(threshold !== undefined ? { threshold } : {}),
    };
  });
}

export default function SeguimientoPage() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]!.code);
  const [components, setComponents] = useState<Record<string, MonitoringComponent>>({});
  const [series, setSeries] = useState<Record<string, DataPoint[]>>({});
  const [loadingComponents, setLoadingComponents] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(false);

  // Load component list
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/monitoring/components", { signal: controller.signal })
      .then((r) => r.ok ? r.json() as Promise<{ data: MonitoringComponent[] }> : Promise.reject())
      .then((json) => {
        const map: Record<string, MonitoringComponent> = {};
        for (const c of json.data) map[c.code] = c;
        setComponents(map);
      })
      .catch(() => {
        setComponents(FALLBACK_COMPONENTS);
      })
      .finally(() => setLoadingComponents(false));
    return () => controller.abort();
  }, []);

  // Load series for active tab
  useEffect(() => {
    if (!activeTab) return;
    setLoadingSeries(true);
    const controller = new AbortController();
    fetch(`/api/monitoring/${activeTab}/series`, { signal: controller.signal })
      .then((r) => r.ok ? r.json() as Promise<{ data: { points: DataPoint[] } }> : Promise.reject())
      .then((json) => {
        setSeries((prev) => ({ ...prev, [activeTab]: json.data?.points ?? [] }));
      })
      .catch(() => {
        setSeries((prev) => ({
          ...prev,
          [activeTab]: buildFallbackSeries(activeTab),
        }));
      })
      .finally(() => setLoadingSeries(false));
    return () => controller.abort();
  }, [activeTab]);

  const current = components[activeTab] ?? FALLBACK_COMPONENTS[activeTab];
  const currentSeries = series[activeTab] ?? [];

  return (
    <>
      <Hero
        size="md"
        image={IMAGES.seguimientoHeader}
        eyebrow="Plataforma EPSA"
        titleEmphasis="Seguimiento Ambiental"
        subtitle="Estado de los 8 componentes ambientales monitoreados en el proyecto Puerto Exterior San Antonio. La frecuencia de actualización varía por componente según el plan de seguimiento."
      />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px 64px" }}>
      {/* Aviso de frecuencia y última actualización */}
      <div
        role="note"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 20px",
          alignItems: "center",
          padding: "12px 16px",
          marginBottom: "24px",
          background: "var(--color-bg)",
          border: "1px solid var(--color-line)",
          borderRadius: "var(--radius-sm)",
          fontSize: "0.875rem",
          color: "var(--color-muted)",
        }}
      >
        <span>
          <strong style={{ color: "var(--color-ink)" }}>Frecuencia de actualización:</strong>{" "}
          Calidad del aire mensual · Fauna y vegetación estacional · Resto bimestral
        </span>
        <span>
          <strong style={{ color: "var(--color-ink)" }}>Última actualización:</strong>{" "}
          30/06/2026
        </span>
      </div>

      {/* Tab bar */}
      <div
        style={{
          overflowX: "auto",
          marginBottom: "0",
          borderBottom: "2px solid var(--color-line)",
        }}
      >
        <div
          role="tablist"
          aria-label="Componentes ambientales"
          style={{
            display: "flex",
            gap: "0",
            minWidth: "max-content",
          }}
        >
          {TABS.map((tab) => {
            const comp = components[tab.code] ?? FALLBACK_COMPONENTS[tab.code];
            const isActive = activeTab === tab.code;
            return (
              <button
                key={tab.code}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.code}`}
                id={`tab-${tab.code}`}
                onClick={() => setActiveTab(tab.code)}
                style={{
                  padding: "12px 16px",
                  background: "none",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
                  marginBottom: "-2px",
                  cursor: "pointer",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.8125rem",
                  color: isActive ? "var(--color-accent)" : "var(--color-muted)",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "color 0.15s",
                }}
              >
                {comp && (
                  <span
                    aria-hidden="true"
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      background:
                        comp.status === "ok"
                          ? "var(--sema-ok)"
                          : comp.status === "warn"
                          ? "var(--sema-warn)"
                          : "var(--sema-bad)",
                    }}
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab panel */}
      {loadingComponents ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "320px",
          }}
        >
          <LoadingSpinner size={48} label="Cargando componentes…" />
        </div>
      ) : (
        TABS.map((tab) => (
          <div
            key={tab.code}
            role="tabpanel"
            id={`panel-${tab.code}`}
            aria-labelledby={`tab-${tab.code}`}
            hidden={activeTab !== tab.code}
            style={{ paddingTop: "32px" }}
          >
            {activeTab === tab.code && current && (
              <>
                {/* Status row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                  }}
                >
                  <StatusBadge status={current.status} />
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "var(--color-ink)",
                      fontWeight: 500,
                    }}
                  >
                    {current.phrase}
                  </p>
                </div>

                {/* Chart */}
                <div style={{ marginBottom: "24px" }}>
                  {loadingSeries ? (
                    <div
                      data-testid="chart"
                      style={{
                        background: "var(--color-surface)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-line)",
                        padding: "48px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "200px",
                      }}
                    >
                      <LoadingSpinner size={40} label="Cargando datos…" />
                    </div>
                  ) : (
                    <Chart points={currentSeries} />
                  )}
                </div>

                {/* Meta row */}
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    padding: "16px 20px",
                    background: "var(--color-surface)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-line)",
                    fontSize: "0.875rem",
                    color: "var(--color-muted)",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--color-ink)" }}>
                      Quién mide:{" "}
                    </span>
                    {current.measuredBy}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--color-ink)" }}>
                      Frecuencia:{" "}
                    </span>
                    {frecuenciaDe(activeTab)}
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: "var(--color-ink)" }}>
                      Última actualización:{" "}
                    </span>
                    {current.lastMeasured}
                  </div>
                  {current.downloadUrl && (
                    <a
                      href={current.downloadUrl}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 16px",
                        background: "var(--color-primary)",
                        color: "#ffffff",
                        borderRadius: "var(--radius-sm)",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        marginLeft: "auto",
                      }}
                    >
                      <span aria-hidden="true">⬇</span>
                      Descargar reporte
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      )}
      </div>
    </>
  );
}
