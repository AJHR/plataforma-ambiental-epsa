"use client";

import { useState } from "react";

interface PdfPreviewProps {
  documentId: string;
}

export default function PdfPreview({ documentId }: PdfPreviewProps) {
  const [error, setError] = useState(false);
  const src = `/api/documents/${documentId}/preview`;

  return (
    <div
      data-testid="pdf-preview"
      style={{
        background: "var(--color-bg)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-line)",
        overflow: "hidden",
        minHeight: "480px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-line)",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--color-ink)",
          }}
        >
          Vista previa del documento
        </span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.75rem",
            color: "var(--color-accent)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Abrir en pestaña nueva ↗
        </a>
      </div>

      {/* PDF iframe or placeholder */}
      {error ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "48px 24px",
            color: "var(--color-muted)",
          }}
        >
          <svg
            aria-hidden="true"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
          >
            <rect
              x="8"
              y="4"
              width="40"
              height="52"
              rx="4"
              fill="var(--color-line)"
            />
            <rect
              x="10"
              y="6"
              width="36"
              height="48"
              rx="3"
              fill="var(--color-surface)"
              stroke="var(--color-line)"
              strokeWidth="1"
            />
            <rect
              x="16"
              y="14"
              width="24"
              height="2"
              rx="1"
              fill="var(--color-line)"
            />
            <rect
              x="16"
              y="20"
              width="24"
              height="2"
              rx="1"
              fill="var(--color-line)"
            />
            <rect
              x="16"
              y="26"
              width="18"
              height="2"
              rx="1"
              fill="var(--color-line)"
            />
            <text x="10" y="50" fontSize="10" fill="var(--sema-bad)" fontWeight="bold">
              PDF
            </text>
          </svg>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontWeight: 600,
                color: "var(--color-ink)",
                marginBottom: "4px",
              }}
            >
              Vista previa no disponible
            </p>
            <p style={{ fontSize: "0.8125rem" }}>
              El documento no pudo cargarse en este momento.
            </p>
          </div>
          <a
            href={src}
            download
            style={{
              padding: "8px 20px",
              background: "var(--color-primary)",
              color: "#ffffff",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Descargar documento
          </a>
        </div>
      ) : (
        <iframe
          src={src}
          title="Vista previa del documento"
          style={{
            flex: 1,
            width: "100%",
            minHeight: "440px",
            border: "none",
            display: "block",
          }}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
