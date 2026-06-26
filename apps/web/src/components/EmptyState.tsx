"use client";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "empty" | "error" | "search";
  action?: {
    label: string;
    onClick: () => void;
  };
}

const ICONS: Record<NonNullable<EmptyStateProps["icon"]>, () => React.ReactElement> = {
  empty: () => (
    <svg
      aria-hidden="true"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
    >
      <circle cx="32" cy="32" r="28" fill="var(--color-bg)" stroke="var(--color-line)" strokeWidth="2" />
      <rect x="20" y="22" width="24" height="4" rx="2" fill="var(--color-line)" />
      <rect x="20" y="30" width="18" height="4" rx="2" fill="var(--color-line)" />
      <rect x="20" y="38" width="22" height="4" rx="2" fill="var(--color-line)" />
    </svg>
  ),
  error: () => (
    <svg
      aria-hidden="true"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
    >
      <circle cx="32" cy="32" r="28" fill="#fff0ef" stroke="var(--sema-bad)" strokeWidth="2" />
      <line x1="22" y1="22" x2="42" y2="42" stroke="var(--sema-bad)" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="22" x2="22" y2="42" stroke="var(--sema-bad)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  search: () => (
    <svg
      aria-hidden="true"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
    >
      <circle cx="28" cy="28" r="18" fill="var(--color-bg)" stroke="var(--color-line)" strokeWidth="2.5" />
      <line x1="41" y1="41" x2="54" y2="54" stroke="var(--color-line)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="28" cy="28" r="8" fill="none" stroke="var(--color-muted)" strokeWidth="2" strokeDasharray="4 3" />
    </svg>
  ),
};

export default function EmptyState({
  title = "Sin datos",
  description = "No hay información disponible en este momento.",
  icon = "empty",
  action,
}: EmptyStateProps) {
  const IconComponent = ICONS[icon];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "48px 24px",
        textAlign: "center",
        color: "var(--color-muted)",
      }}
    >
      <IconComponent />
      <div>
        <p
          style={{
            fontWeight: 600,
            color: "var(--color-ink)",
            fontSize: "1rem",
            marginBottom: "6px",
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: "0.875rem", maxWidth: "360px" }}>{description}</p>
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          style={{
            padding: "10px 24px",
            background: "var(--color-primary)",
            color: "#ffffff",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
