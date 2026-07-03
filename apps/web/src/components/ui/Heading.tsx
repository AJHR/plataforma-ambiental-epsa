import type { HTMLAttributes } from "react";

type Level = 1 | 2 | 3 | 4;

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Nivel semántico (h1–h4). */
  level?: Level;
  /** Tamaño visual; por defecto sigue al nivel. */
  size?: Level;
}

const sizeStyles: Record<Level, string> = {
  1: "text-4xl sm:text-5xl font-extrabold tracking-tight",
  2: "text-2xl sm:text-3xl font-bold tracking-tight",
  3: "text-xl font-bold",
  4: "text-lg font-semibold",
};

/** Título con escala tipográfica coherente y balance de línea. */
export default function Heading({
  level = 2,
  size,
  className = "",
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  const visual = sizeStyles[size ?? level];
  return (
    <Tag
      className={`text-ink text-balance leading-tight ${visual} ${className}`}
      {...props}
    />
  );
}
