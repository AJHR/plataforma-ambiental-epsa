import MapViewer from "@/components/MapViewer";
import { FileText, ArrowRight } from "lucide-react";
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
    "Descripción del Puerto Exterior de San Antonio: terminales, fases, áreas de obras y monitoreo ambiental del proyecto EPSA.",
};

// Expediente oficial del proyecto en el SEIA (Servicio de Evaluación Ambiental):
// EIA "Puerto Exterior de San Antonio". Desde la ficha se accede a los documentos
// del expediente (incluida la Descripción de Proyecto / Anexo ADC-2).
const PROJECT_PDF_URL =
  "https://seia.sea.gob.cl/expediente/ficha/fichaPrincipal.php?modo=ficha&id_expediente=2146439114";

// Zonas de monitoreo ambiental (coinciden con el visor de mapa).
const monitoringAreas = [
  {
    id: "puerto-exterior",
    color: "#0e5c8a",
    label: "Puerto Exterior",
    description:
      "Zona de infraestructura portuaria principal donde se desarrollan las operaciones de carga y descarga. Concentra monitoreo de emisiones, ruido y calidad del aire.",
  },
  {
    id: "zona-amortiguacion",
    color: "#1597b8",
    label: "Zona de Amortiguación",
    description:
      "Franja buffer entre el puerto y las áreas sensibles. Se monitorean vegetación, fauna y calidad del suelo para detectar impactos indirectos.",
  },
  {
    id: "area-marina",
    color: "#38b6e8",
    label: "Área Marina",
    description:
      "Zona de influencia sobre el ecosistema marino y costero. Incluye seguimiento de calidad hídrica, sedimentos y fauna acuática.",
  },
  {
    id: "zona-terrestre",
    color: "#e0742e",
    label: "Zona Terrestre",
    description:
      "Área de monitoreo de biodiversidad terrestre, vegetación nativa y calidad del suelo en los sectores adyacentes al puerto.",
  },
];

// Áreas de obras del proyecto (según la Descripción de Proyecto del EIA).
const projectAreas = [
  {
    title: "Área Portuaria",
    description:
      "Obras de abrigo (rompeolas), dragados y rellenos de explanadas, muelles de los terminales TS1 y TS2, sector logístico, instalación de faena principal y la vialidad y trazado ferroviario internos.",
  },
  {
    title: "Área Transporte y Vialidad",
    description:
      "Estación de transferencia ferroviaria y de descarga, mejoramiento de la línea férrea existente y las Conexiones Norte y Sur que enlazan con la Ruta 66 (Ruta de la Fruta).",
  },
  {
    title: "Área Canteras",
    description:
      "Canteras Román y Javer y el sector Intercanteras, que proveen el material pétreo de relleno para la construcción de rompeolas y explanadas portuarias.",
  },
];

// Fases de desarrollo (crecimiento operacional a 1,5 MM TEU/año por fase).
const phases = [
  {
    name: "Fase 0 — Obras comunes",
    period: "≈ 7–8 años",
    description:
      "Dragado del fondo marino, rompeolas y relleno de explanadas para TS1 y TS2; habilitación de faenas, canteras, estación de transferencia y accesos.",
  },
  {
    name: "Fase 1-A — Terminal TS1-A",
    period: "≈ 3 años",
    description:
      "Construcción de la primera mitad del Terminal TS1. Inicia la operación del puerto: 1,5 MM TEU/año (25% de la capacidad total).",
  },
  {
    name: "Fase 1-B — Terminal TS1",
    period: "≈ 3 años",
    description:
      "Completa el Terminal TS1. Suma 1,5 MM TEU/año, alcanzando 3 MM TEU/año (50% de la capacidad total).",
  },
  {
    name: "Fase 2-A — Terminal TS2 (sur)",
    period: "≈ 3–4 años",
    description:
      "Mitad sur del Terminal TS2. Suma 1,5 MM TEU/año, alcanzando 4,5 MM TEU/año (75% de la capacidad total).",
  },
  {
    name: "Fase 2-B — Terminal TS2 (norte)",
    period: "≈ 3 años",
    description:
      "Extensión norte del Terminal TS2. Alcanza la plena operación: 6 MM TEU/año (100% de la capacidad total).",
  },
];

const fichaTecnica = [
  { dt: "Titular", dd: "Empresa Portuaria San Antonio (EPSA)" },
  { dt: "Ubicación", dd: "San Antonio, Región de Valparaíso" },
  { dt: "Inversión estimada", dd: "USD 4.000 millones" },
  { dt: "Capacidad plena", dd: "6 millones de TEU/año" },
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
        subtitle="El Puerto Exterior de San Antonio contempla la construcción y operación de dos terminales portuarios (TS1 y TS2) en la comuna de San Antonio, Región de Valparaíso, para movilizar hasta 6 millones de TEU/año con estándares de última tecnología."
      />

      {/* Descripción — bloque editorial con foto */}
      <Section tone="default">
        <MediaBlock image={IMAGES.mar}>
          <SectionTitle
            eyebrow="Descripción general"
            lead="Dos terminales, cinco"
            emphasis="fases de crecimiento"
          />
          <p className="mt-5 leading-relaxed text-muted">
            El proyecto se desarrolla en cinco fases (0, 1-A, 1-B, 2-A y 2-B),
            permitiendo el atraque simultáneo de naves Post-New-Panamax (clase E,
            de 400 m de eslora). Su objetivo es aumentar la capacidad de
            transferencia de carga de la zona central del país y dinamizar el
            comercio exterior de Chile. El monitoreo ambiental cubre ocho
            componentes bajo la Resolución de Calificación Ambiental (RCA):
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2">
            {[
              "Calidad del Aire",
              "Calidad Hídrica",
              "Fauna",
              "Vegetación",
              "Ruido y Vibraciones",
              "Sedimentos",
              "Paisaje",
              "Calidad del Suelo",
            ].map((c) => (
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
            {fichaTecnica.map(({ dt, dd }) => (
              <Card key={dt}>
                <dt className="text-sm font-medium text-muted">{dt}</dt>
                <dd className="mt-1 text-lg font-bold text-ink">{dd}</dd>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Áreas y obras del proyecto */}
      <Section tone="default">
        <Container>
          <SectionTitle
            eyebrow="Alcance de las obras"
            lead="Áreas y"
            emphasis="obras"
          />
          <p className="mt-4 max-w-2xl text-muted">
            Las partes, obras y acciones se agrupan en tres áreas, que en conjunto
            hacen posible la construcción y operación del puerto.
          </p>
          <div className="mt-10">
            <FeatureColumns items={projectAreas} />
          </div>
        </Container>
      </Section>

      {/* Áreas de monitoreo + mapa */}
      <Section tone="muted">
        <Container>
          <SectionTitle
            eyebrow="Cobertura territorial"
            lead="Áreas de"
            emphasis="monitoreo"
          />
          <p className="mt-4 max-w-2xl text-muted">
            El plan de monitoreo abarca cuatro zonas geográficas, cada una con
            indicadores y frecuencias de medición diferenciadas según sus
            características ambientales.
          </p>
          <div className="mt-10">
            <MapViewer />
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {monitoringAreas.map((area) => (
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

      {/* Fases */}
      <Section tone="default">
        <Container>
          <SectionTitle
            eyebrow="Hoja de ruta"
            lead="Fases de"
            emphasis="desarrollo"
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

      {/* Documento oficial (PDF) */}
      <Section tone="muted" className="!py-16">
        <Container>
          <Card
            elevated
            className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FileText className="size-6" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">
                  Expediente oficial (SEIA)
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Estudio de Impacto Ambiental del Puerto Exterior de San Antonio,
                  incluida la Descripción de Proyecto (Anexo ADC-2), en el Servicio
                  de Evaluación Ambiental.
                </p>
              </div>
            </div>
            <a
              href={PROJECT_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Ver expediente en el SEIA
              <ArrowRight className="size-4" aria-hidden />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>
          </Card>
        </Container>
      </Section>
    </>
  );
}
