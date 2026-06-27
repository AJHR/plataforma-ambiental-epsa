import Image from "next/image";
import type { ReactNode } from "react";
import Container from "./Container";
import type { ImageAsset } from "@/lib/images";
import { imageUrl } from "@/lib/images";

export interface MediaBlockProps {
  image: ImageAsset;
  children: ReactNode;
  /** Invierte el lado de la imagen (imagen a la derecha). */
  reverse?: boolean;
}

/** Bloque editorial asimétrico: foto + tarjeta blanca superpuesta con contenido. */
export default function MediaBlock({
  image,
  children,
  reverse = false,
}: MediaBlockProps) {
  return (
    <Container>
      <div className="relative grid items-center gap-8 lg:grid-cols-2">
        {/* Imagen */}
        <div
          className={
            "relative aspect-[4/3] overflow-hidden rounded-lg shadow-card " +
            (reverse ? "lg:order-2" : "")
          }
        >
          <Image
            src={imageUrl(image, 1000)}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        {/* Tarjeta superpuesta */}
        <div
          className={
            "relative z-10 rounded-lg border border-line bg-surface p-8 shadow-lg sm:p-10 " +
            "lg:-my-8 " +
            (reverse ? "lg:order-1 lg:-mr-16" : "lg:-ml-16")
          }
        >
          {children}
        </div>
      </div>
    </Container>
  );
}
