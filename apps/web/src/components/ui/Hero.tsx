import Image from "next/image";
import type { ReactNode } from "react";
import Container from "./Container";
import SectionTitle from "./SectionTitle";
import type { ImageAsset } from "@/lib/images";
import { imageUrl } from "@/lib/images";

export interface HeroProps {
  image: ImageAsset;
  eyebrow?: string;
  titleLead?: string;
  titleEmphasis: ReactNode;
  subtitle?: ReactNode;
  /** Acciones (botones/links). */
  actions?: ReactNode;
  /** Altura del hero. */
  size?: "md" | "lg";
}

/** Banda full-bleed con foto de fondo, velo para contraste AA y contenido. */
export default function Hero({
  image,
  eyebrow,
  titleLead,
  titleEmphasis,
  subtitle,
  actions,
  size = "lg",
}: HeroProps) {
  const minH = size === "lg" ? "min-h-[78vh]" : "min-h-[48vh]";
  return (
    <section className={`relative isolate flex ${minH} w-full items-center overflow-hidden`}>
      <Image
        src={imageUrl(image, 1920)}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Velo: degradado oscuro a la izquierda para garantizar contraste del texto */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-bg-deep/85 via-bg-deep/60 to-bg-deep/25"
      />
      <Container className="relative py-20 sm:py-28">
        <div className="max-w-2xl">
          <SectionTitle
            level={1}
            light
            eyebrow={eyebrow}
            lead={titleLead}
            emphasis={titleEmphasis}
          />
          {subtitle && (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
              {subtitle}
            </p>
          )}
          {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </Container>
    </section>
  );
}
