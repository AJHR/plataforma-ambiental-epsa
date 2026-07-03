import Image from "next/image";
import Link from "next/link";
import type { ImageAsset } from "@/lib/images";
import { imageUrl } from "@/lib/images";

export interface ImageCardProps {
  image: ImageAsset;
  title: string;
  /** Subtítulo opcional debajo del título. */
  caption?: string;
  /** Si se pasa, la tarjeta es un enlace. */
  href?: string;
  /** Nombre accesible del enlace (por defecto, el título). */
  ariaLabel?: string;
  /** Relación de aspecto. */
  ratio?: "portrait" | "landscape" | "square";
  className?: string;
}

const ratios: Record<NonNullable<ImageCardProps["ratio"]>, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

/** Tarjeta-foto con velo en degradado y rótulo; opcionalmente enlazable. */
export default function ImageCard({
  image,
  title,
  caption,
  href,
  ariaLabel,
  ratio = "portrait",
  className = "",
}: ImageCardProps) {
  const inner = (
    <>
      <Image
        src={imageUrl(image, 800)}
        alt={image.alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-bg-deep/85 via-bg-deep/20 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-5">
        {caption && (
          <span className="block text-xs font-semibold uppercase tracking-wider text-accent">
            {caption}
          </span>
        )}
        <span className="mt-1 block text-lg font-bold text-white">{title}</span>
      </div>
    </>
  );

  const base = `group relative block overflow-hidden rounded-lg shadow-card ${ratios[ratio]} ${className}`;

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel ?? title} className={base}>
        {inner}
      </Link>
    );
  }
  return <div className={base}>{inner}</div>;
}
