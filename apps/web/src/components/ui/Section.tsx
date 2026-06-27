import type { HTMLAttributes } from "react";

type Tone = "default" | "muted" | "deep";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Fondo de la sección (consume tokens). */
  tone?: Tone;
  /** Ocupa todo el ancho del viewport (heros full-bleed). */
  fullBleed?: boolean;
}

const tones: Record<Tone, string> = {
  default: "bg-surface text-ink",
  muted: "bg-bg text-ink",
  deep: "bg-bg-deep text-white",
};

/** Banda vertical de página, con padding generoso (mucho espacio en blanco). */
export default function Section({
  tone = "default",
  fullBleed = false,
  className = "",
  ...props
}: SectionProps) {
  return (
    <section
      className={
        `${tones[tone]} py-16 sm:py-20 lg:py-24 ` +
        (fullBleed ? "w-full " : "") +
        className
      }
      {...props}
    />
  );
}
