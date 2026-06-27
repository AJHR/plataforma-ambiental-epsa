import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Resalta la tarjeta con sombra mayor (ej. featured). */
  elevated?: boolean;
}

/** Superficie base: fondo, borde sutil, radio suave y sombra. */
export default function Card({
  elevated = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={
        "rounded-lg border border-line bg-surface p-6 " +
        (elevated ? "shadow-lg" : "shadow-card") +
        " " +
        className
      }
      {...props}
    />
  );
}
