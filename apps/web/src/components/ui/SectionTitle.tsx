import type { ReactNode } from "react";

export interface SectionTitleProps {
  /** Texto previo en peso ligero (ej. "Nuestro"). */
  lead?: string;
  /** Texto enfatizado en bold (ej. "Compromiso"). */
  emphasis: ReactNode;
  /** Etiqueta superior en mayúsculas. */
  eyebrow?: string;
  /** Nivel semántico del heading. */
  level?: 1 | 2 | 3;
  /** Color claro para fondos oscuros. */
  light?: boolean;
  className?: string;
}

/** Titular editorial de dos pesos con eyebrow opcional. */
export default function SectionTitle({
  lead,
  emphasis,
  eyebrow,
  level = 2,
  light = false,
  className = "",
}: SectionTitleProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  const sizes =
    level === 1
      ? "text-4xl sm:text-5xl lg:text-6xl"
      : "text-3xl sm:text-4xl";
  return (
    <div className={className}>
      {eyebrow && (
        <span
          className={
            "mb-3 block text-sm font-bold uppercase tracking-[0.12em] " +
            (light ? "text-accent" : "text-accent-700")
          }
        >
          {eyebrow}
        </span>
      )}
      <Tag
        className={
          `${sizes} leading-tight tracking-tight text-balance ` +
          (light ? "text-white" : "text-ink")
        }
      >
        {lead && <span className="font-medium">{lead} </span>}
        <span className="font-extrabold">{emphasis}</span>
      </Tag>
    </div>
  );
}
