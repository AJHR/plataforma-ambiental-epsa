import type { HTMLAttributes } from "react";

type Width = "default" | "narrow" | "wide";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: Width;
}

const widths: Record<Width, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

/** Centra el contenido con ancho máximo y padding horizontal responsivo. */
export default function Container({
  width = "default",
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-6 lg:px-8 ${widths[width]} ${className}`}
      {...props}
    />
  );
}
