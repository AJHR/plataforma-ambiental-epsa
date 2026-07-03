// Componentes base del design system EPSA. Consumen los tokens de
// @repo/config/theme.css vía utilidades Tailwind — sin colores hardcodeados.
export { default as Button } from "./Button";
export type { ButtonProps } from "./Button";
export { default as Card } from "./Card";
export type { CardProps } from "./Card";
export { default as Container } from "./Container";
export type { ContainerProps } from "./Container";
export { default as Section } from "./Section";
export type { SectionProps } from "./Section";
export { default as Heading } from "./Heading";
export type { HeadingProps } from "./Heading";

// Componentes editoriales / foto-ricos
export { default as Hero } from "./Hero";
export type { HeroProps } from "./Hero";
export { default as ImageCard } from "./ImageCard";
export type { ImageCardProps } from "./ImageCard";
export { default as MediaBlock } from "./MediaBlock";
export type { MediaBlockProps } from "./MediaBlock";
export { default as SectionTitle } from "./SectionTitle";
export type { SectionTitleProps } from "./SectionTitle";
export { default as FeatureColumns } from "./FeatureColumns";
export type { FeatureColumn, FeatureColumnsProps } from "./FeatureColumns";
