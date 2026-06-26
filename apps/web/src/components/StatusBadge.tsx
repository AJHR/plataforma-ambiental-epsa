"use client";

interface StatusBadgeProps {
  status: "ok" | "warn" | "bad";
  label?: string;
}

const STATUS_CONFIG = {
  ok: {
    color: "var(--sema-ok)",
    defaultLabel: "Normal",
    ariaLabel: "Estado normal",
  },
  warn: {
    color: "var(--sema-warn)",
    defaultLabel: "Advertencia",
    ariaLabel: "Estado de advertencia",
  },
  bad: {
    color: "var(--sema-bad)",
    defaultLabel: "Alerta",
    ariaLabel: "Estado de alerta",
  },
} as const;

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const displayLabel = label ?? config.defaultLabel;

  return (
    <span
      data-testid="status-badge"
      aria-label={`${config.ariaLabel}: ${displayLabel}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "var(--radius-full)",
        background: `${config.color}1a`,
        border: `1px solid ${config.color}`,
        fontSize: "0.75rem",
        fontWeight: 600,
        color: config.color,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {/* Colored dot indicator */}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: config.color,
          flexShrink: 0,
        }}
      />
      {displayLabel}
    </span>
  );
}
