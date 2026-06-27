import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Hero,
  ImageCard,
  MediaBlock,
  Section,
  SectionTitle,
  Container,
  Button,
} from "@/components/ui";
import NewsletterSignup from "@/components/NewsletterSignup";
import { IMAGES } from "@/lib/images";

const modules = [
  {
    href: "/el-proyecto",
    caption: "Contexto",
    title: "El Proyecto",
    image: IMAGES.modProyecto,
  },
  {
    href: "/seguimiento",
    caption: "Datos en vivo",
    title: "Seguimiento Ambiental",
    image: IMAGES.modSeguimiento,
  },
  {
    href: "/participa",
    caption: "Comunidad",
    title: "Participa",
    image: IMAGES.modParticipa,
  },
  {
    href: "/aprende",
    caption: "Educación",
    title: "Aprende",
    image: IMAGES.modAprende,
  },
] as const;

const stats = [
  { value: "8", label: "Componentes monitoreados" },
  { value: "4", label: "Áreas de influencia" },
  { value: "24/7", label: "Monitoreo continuo" },
  { value: "100%", label: "Datos públicos" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        image={IMAGES.heroMar}
        eyebrow="EPSA — Puerto Exterior San Antonio"
        titleLead="Información ambiental"
        titleEmphasis="clara y verificable"
        subtitle="Accede de forma transparente a los datos de monitoreo del Puerto Exterior de San Antonio. Información actualizada, verificable y comprensible para toda la comunidad."
        actions={
          <>
            <Link href="/seguimiento">
              <Button size="lg">
                Ver datos en vivo
                <ArrowRight className="size-5" aria-hidden />
              </Button>
            </Link>
            <Link href="/el-proyecto">
              <Button
                size="lg"
                variant="outline"
                className="!border-white/40 !text-white hover:!bg-white/10"
              >
                Conocer más
              </Button>
            </Link>
          </>
        }
      />

      {/* Accesos a módulos como tarjetas-foto */}
      <Section tone="muted">
        <Container>
          <SectionTitle
            eyebrow="Explora la plataforma"
            lead="Cuatro accesos a la"
            emphasis="información ambiental"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {modules.map((mod) => (
              <ImageCard
                key={mod.href}
                href={mod.href}
                ariaLabel={mod.title}
                image={mod.image}
                caption={mod.caption}
                title={mod.title}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Bloque editorial — compromiso */}
      <Section tone="default">
        <MediaBlock image={IMAGES.aguaDetalle}>
          <SectionTitle
            eyebrow="Nuestro compromiso"
            lead="Transparencia que se puede"
            emphasis="verificar"
          />
          <p className="mt-5 leading-relaxed text-muted">
            El Plan de Manejo Ambiental establece un sistema de monitoreo continuo
            de ocho componentes. Publicamos cada medición con su fuente, fecha y un
            semáforo de estado simple de interpretar, para que cualquier persona
            pueda seguir el desempeño ambiental del proyecto.
          </p>
          <div className="mt-7">
            <Link href="/seguimiento">
              <Button variant="primary">
                Explorar los indicadores
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </Link>
          </div>
        </MediaBlock>
      </Section>

      {/* Banda de estadísticas */}
      <Section tone="deep" className="!py-16">
        <Container>
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-extrabold text-accent sm:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-white/75">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Pre-footer CTA — boletín */}
      <Section tone="deep" className="!pt-0 !pb-20">
        <Container>
          <div className="flex flex-col gap-8 rounded-lg border border-white/10 bg-white/5 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <SectionTitle
                light
                lead="Recibe las"
                emphasis="novedades ambientales"
              />
              <p className="mt-4 text-white/80">
                Boletines con resultados de monitoreo, instancias de participación
                y avances del proyecto, directo a tu correo.
              </p>
            </div>
            <NewsletterSignup />
          </div>
        </Container>
      </Section>
    </>
  );
}
