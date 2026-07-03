"use client";

interface LoadingSpinnerProps {
  size?: number;
  label?: string;
}

export default function LoadingSpinner({
  size = 32,
  label = "Cargando…",
}: LoadingSpinnerProps) {
  const strokeWidth = Math.max(2, size / 12);
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      role="status"
      aria-label={label}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        style={{ animation: "epsa-spin 0.8s linear infinite" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={circumference * 0.25}
        />
        <style>{`
          @keyframes epsa-spin {
            from { transform-origin: center; transform: rotate(0deg); }
            to   { transform-origin: center; transform: rotate(360deg); }
          }
        `}</style>
      </svg>
      <span
        style={{ fontSize: "0.8125rem", color: "var(--color-muted)" }}
        aria-live="polite"
      >
        {label}
      </span>
    </div>
  );
}
