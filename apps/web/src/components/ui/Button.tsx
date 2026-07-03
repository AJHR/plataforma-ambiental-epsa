import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold " +
  "transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent-700";

const variants: Record<Variant, string> = {
  // Blanco sobre primary → contraste AA (~8.7:1)
  primary: "bg-primary text-white hover:bg-primary-600",
  outline: "border-2 border-primary text-primary hover:bg-primary/5",
  ghost: "text-primary hover:bg-line/60",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-13 px-8 text-lg",
};

/** Botón base del design system. Consume tokens; sin colores hardcodeados. */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
});

export default Button;
