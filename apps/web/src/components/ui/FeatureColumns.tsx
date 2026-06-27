export interface FeatureColumn {
  title: string;
  description: string;
}

export interface FeatureColumnsProps {
  items: FeatureColumn[];
  className?: string;
}

/** Fila de columnas con borde fino (líneas de trabajo / compromisos). */
export default function FeatureColumns({
  items,
  className = "",
}: FeatureColumnsProps) {
  return (
    <div
      className={
        "grid divide-y divide-line border border-line " +
        "sm:grid-cols-2 sm:divide-x lg:grid-cols-3 " +
        className
      }
    >
      {items.map((item) => (
        <div key={item.title} className="p-6">
          <h3 className="text-base font-bold text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
