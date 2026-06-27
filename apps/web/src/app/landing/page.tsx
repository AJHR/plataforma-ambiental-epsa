import Image from "next/image";
import { Leaf, Wind, Droplets, TreePine, ArrowRight } from "lucide-react";
import { Button, Card, Container, Section, Heading } from "@/components/ui";
import StatusBadge from "@/components/StatusBadge";

export const metadata = {
  title: "Design System — Plataforma Ambiental EPSA",
  description:
    "Landing de ejemplo que demuestra el sistema de diseño natural-tech: tokens, tipografía y componentes base.",
};

// Imagen de hero — placeholder de desarrollo (ver docs/assets-credits.md).
// Naturaleza/paisaje sin rostros. Reemplazar por definitiva de Unsplash en prod.
const HERO_IMAGE = "https://picsum.photos/seed/epsa-forest/1600/900";

const features = [
  {
    icon: Wind,
    title: "Calidad del Aire",
    description:
      "Monitoreo continuo de material particulado y gases con estaciones distribuidas en el área de influencia.",
  },
  {
    icon: Droplets,
    title: "Calidad Hídrica",
    description:
      "Seguimiento de parámetros fisicoquímicos del agua marina y continental en tiempo casi real.",
  },
  {
    icon: TreePine,
    title: "Biodiversidad",
    description:
      "Vigilancia de fauna y vegetación nativa para detectar impactos y activar protocolos de respuesta.",
  },
];

const metrics = [
  { label: "Calidad del Aire", value: "48", unit: "µg/m³", status: "ok" as const },
  { label: "Calidad Hídrica", value: "6.8", unit: "pH", status: "ok" as const },
  { label: "Ruido Diurno", value: "61", unit: "dB(A)", status: "warn" as const },
  { label: "Fauna", value: "12", unit: "ind", status: "warn" as const },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero full-bleed con imagen ── */}
      <Section tone="deep" fullBleed className="relative overflow-hidden !py-0">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Vegetación nativa cubierta de rocío"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Velo para garantizar contraste AA del texto sobre la imagen */}
          <div
            aria-hidden
            className="absolute inset-0 bg-bg-deep/72"
          />
        </div>
        <Container className="relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-sm font-semibold text-white">
              <Leaf className="size-4" aria-hidden />
              Plataforma Ambiental EPSA
            </span>
            <Heading
              level={1}
              className="mt-6 !text-white"
            >
              Información ambiental{" "}
              <span className="text-accent">clara y verificable</span>
            </Heading>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
              Datos de monitoreo del Puerto Exterior de San Antonio, abiertos y
              comprensibles para toda la comunidad. Transparencia al servicio
              del medio ambiente.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg">
                Explorar la plataforma
                <ArrowRight className="size-5" aria-hidden />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="!border-white/40 !text-white hover:!bg-white/10"
              >
                Conocer el proyecto
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Features con íconos ── */}
      <Section tone="muted">
        <Container>
          <div className="max-w-2xl">
            <Heading level={2}>Qué monitoreamos</Heading>
            <p className="mt-4 text-lg text-muted">
              Ocho componentes ambientales bajo seguimiento permanente, con un
              semáforo de estado simple de interpretar.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <div className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden />
                </div>
                <Heading level={3} className="mt-5">
                  {title}
                </Heading>
                <p className="mt-2 leading-relaxed text-muted">{description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Bloque de datos / dashboard simple ── */}
      <Section tone="default">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <Heading level={2}>Estado actual</Heading>
              <p className="mt-4 text-lg text-muted">
                Última medición registrada por componente.
              </p>
            </div>
            <Button variant="ghost">
              Ver seguimiento completo
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m) => (
              <Card key={m.label} className="flex flex-col gap-3">
                <span className="text-sm font-medium text-muted">
                  {m.label}
                </span>
                <span className="text-3xl font-extrabold text-ink">
                  {m.value}
                  <span className="ml-1 text-base font-medium text-muted">
                    {m.unit}
                  </span>
                </span>
                <StatusBadge status={m.status} />
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
