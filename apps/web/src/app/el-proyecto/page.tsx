import MapViewer from "@/components/MapViewer";
import {
  Hero,
  MediaBlock,
  Section,
  SectionTitle,
  Container,
  Card,
  FeatureColumns,
} from "@/components/ui";
import { IMAGES } from "@/lib/images";

export const metadata = {
  title: "El Proyecto — EPSA Plataforma Ambiental",
  description:
    "Descripción del Puerto Exterior de San Antonio y las áreas de monitoreo ambiental del proyecto EPSA.",
};

const areas = [
  {
    id: "puerto-exterior",
    color: "#1f4d3a",
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
    color: "#3f6b1e",
    label: "Área Marina",
    description:
      "Zona de influencia sobre el ecosistema marino y costero. Incluye seguimiento de calidad hídrica, sedimentos y fauna acuática.",
  },
  {
    id: "zona-terrestre",
    color: "#bf6b3a",
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
  },
  {
    name: "Etapa II — Construcción",
    period: "2024 – 2026",
    description:
      "Monitoreo activo durante las obras. Detecta desviaciones respecto a la línea de base y activa protocolos de respuesta.",
  },
  {
    name: "Etapa III — Operación",
    period: "2026 en adelante",
    description:
      "Monitoreo continuo durante la operación plena del puerto. Reportes trimestrales y ajustes al Plan de Manejo Ambiental.",
  },
];

const componentes = [
  "Calidad del Aire",
  "Calidad Hídrica",
  "Fauna",
  "Vegetación",
  "Ruido y Vibraciones",
  "Sedimentos",
  "Paisaje",
  "Calidad del Suelo",
];

export default function ElProyectoPage() {
  return (
    <>
      {/* Hero — único h1 que matchea /proyecto/i */}
      <Hero
        size="md"
        image={IMAGES.proyectoHero}
        eyebrow="Puerto Exterior San Antonio"
        titleEmphasis="El Proyecto"
        subtitle="Una de las mayores obras de infraestructura portuaria de Chile, con un Plan de Manejo Ambiental que asegura la protección del entorno natural y la calidad de vida de las comunidades vecinas."
      />

      {/* Descripción — bloque editorial con foto */}
      <Section tone="default">
        <MediaBlock image={IMAGES.vegetacion}>
          <SectionTitle
            eyebrow="Descripción general"
            lead="Monitorear para"
            emphasis="proteger"
          />
          <p className="mt-5 leading-relaxed text-muted">
            El objetivo es monitorear y gestionar los impactos ambientales del
            Puerto Exterior de San Antonio, garantizando el cumplimiento de la
            Resolución de Calificación Ambiental (RCA) y los estándares
            internacionales de sostenibilidad portuaria.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2">
            {componentes.map((c) => (
              <li key={c} className="flex items-center gap-2 text-sm text-ink">
                <span
                  aria-hidden
                  className="size-1.5 shrink-0 rounded-full bg-accent-700"
                />
                {c}
              </li>
            ))}
          </ul>
        </MediaBlock>
      </Section>

      {/* Ficha técnica */}
      <Section tone="muted" className="!py-16">
        <Container>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { dt: "Ubicación", dd: "San Antonio, Valparaíso" },
              { dt: "Inversión", dd: "USD 2.700 millones" },
              { dt: "Capacidad", dd: "3 millones de TEU/año" },
              { dt: "Operación", dd: "2026 (Fase I)" },
            ].map(({ dt, dd }) => (
              <Card key={dt}>
                <dt className="text-sm font-medium text-muted">{dt}</dt>
                <dd className="mt-1 text-lg font-bold text-ink">{dd}</dd>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Áreas de monitoreo + mapa */}
      <Section tone="default">
        <Container>
          <SectionTitle
            eyebrow="Cobertura territorial"
            lead="Áreas de"
            emphasis="monitoreo"
          />
          <p className="mt-4 max-w-2xl text-muted">
            El plan abarca cuatro zonas geográficas, cada una con indicadores y
            frecuencias de medición diferenciadas según sus características
            ambientales.
          </p>
          <div className="mt-10">
            <MapViewer />
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((area) => (
              <Card
                key={area.id}
                className="border-l-4"
                style={{ borderLeftColor: area.color }}
              >
                <h3 className="text-base font-bold text-ink">{area.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {area.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Etapas */}
      <Section tone="muted">
        <Container>
          <SectionTitle
            eyebrow="Hoja de ruta"
            lead="Etapas de"
            emphasis="implementación"
          />
          <div className="mt-10">
            <FeatureColumns
              items={phases.map((p) => ({
                title: p.name,
                description: `${p.period} — ${p.description}`,
              }))}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
