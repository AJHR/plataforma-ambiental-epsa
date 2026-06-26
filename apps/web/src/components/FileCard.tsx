"use client";

interface FileCardProps {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  sizeBytes: number;
  status: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "vigente":
    case "active":
      return "var(--sema-ok)";
    case "pendiente":
    case "pending":
      return "var(--sema-warn)";
    case "archivado":
    case "archived":
      return "var(--color-muted)";
    default:
      return "var(--color-accent)";
  }
}

function getFileIcon(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "PDF";
  if (["doc", "docx"].includes(ext)) return "DOC";
  if (["xls", "xlsx"].includes(ext)) return "XLS";
  if (["zip", "rar"].includes(ext)) return "ZIP";
  return "FILE";
}

export default function FileCard({
  id,
  title,
  description,
  fileName,
  sizeBytes,
  status,
}: FileCardProps) {
  const statusColor = getStatusColor(status);
  const fileIcon = getFileIcon(fileName);

  return (
    <div
      data-testid="file-card"
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-line)",
        boxShadow: "var(--shadow-card)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        {/* File type badge */}
        <div
          aria-hidden="true"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-line)",
            borderRadius: "var(--radius-sm)",
            padding: "8px",
            fontSize: "0.625rem",
            fontWeight: 800,
            color: "var(--color-primary)",
            letterSpacing: "0.04em",
            flexShrink: 0,
            minWidth: "40px",
            textAlign: "center",
          }}
        >
          {fileIcon}
        </div>

        {/* Title and status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "4px",
            }}
          >
            <h3
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--color-ink)",
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {title}
            </h3>
            <span
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: statusColor,
                background: `${statusColor}15`,
                border: `1px solid ${statusColor}`,
                borderRadius: "var(--radius-full)",
                padding: "2px 8px",
                whiteSpace: "nowrap",
                letterSpacing: "0.03em",
              }}
            >
              {status}
            </span>
          </div>
          {description && (
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--color-muted)",
                margin: 0,
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* File metadata */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          fontSize: "0.75rem",
          color: "var(--color-muted)",
          flexWrap: "wrap",
        }}
      >
        <span>
          <strong style={{ color: "var(--color-ink)" }}>Archivo:</strong>{" "}
          {fileName}
        </span>
        <span>
          <strong style={{ color: "var(--color-ink)" }}>Tamaño:</strong>{" "}
          {formatBytes(sizeBytes)}
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <a
          href={`/api/documents/${id}/preview`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "var(--radius-sm)",
            border: "1.5px solid var(--color-primary)",
            background: "transparent",
            color: "var(--color-primary)",
            fontSize: "0.8125rem",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <span aria-hidden="true">👁</span>
          Previsualizar
        </a>
        <a
          href={`/api/documents/${id}/download`}
          download={fileName}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "var(--radius-sm)",
            border: "1.5px solid transparent",
            background: "var(--color-primary)",
            color: "#ffffff",
            fontSize: "0.8125rem",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          <span aria-hidden="true">⬇</span>
          Descargar
        </a>
      </div>
    </div>
  );
}
