"use client";

import { useState, useEffect, useCallback } from "react";
import PdfPreview from "@/components/PdfPreview";
import EmptyState from "@/components/EmptyState";

interface Document {
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

function getFileIcon(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "PDF";
  if (["doc", "docx"].includes(ext)) return "DOC";
  if (["xls", "xlsx"].includes(ext)) return "XLS";
  if (["zip", "rar"].includes(ext)) return "ZIP";
  return "FILE";
}

export default function DocumentosPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  useEffect(() => {
    fetch("/api/documents?status=publicado")
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching documents");
        return res.json() as Promise<unknown>;
      })
      .then((json) => {
        const docs: Document[] = Array.isArray(json)
          ? (json as Document[])
          : ((json as { data?: Document[] }).data ?? []);
        setDocuments(docs);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const closePreview = useCallback(() => setPreviewDoc(null), []);

  // Close modal on Escape key
  useEffect(() => {
    if (!previewDoc) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePreview();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [previewDoc, closePreview]);

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 24px 64px",
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: "36px" }}>
        <p
          style={{
            fontSize: "0.6875rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-accent-700)",
            marginBottom: "8px",
          }}
        >
          Repositorio
        </p>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "var(--color-primary)",
            lineHeight: 1.2,
            textWrap: "balance",
            marginBottom: "12px",
          }}
        >
          Documentos Públicos
        </h1>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--color-muted)",
            maxWidth: "560px",
            lineHeight: 1.6,
          }}
        >
          Acceda a los documentos ambientales, reportes y resoluciones
          publicados por el proyecto EPSA. Los borradores no son públicos.
        </p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
          }}
          aria-busy="true"
          aria-label="Cargando documentos"
        >
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-line)",
                height: "172px",
                opacity: 0.55,
              }}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <EmptyState
          icon="error"
          title="No se pudieron cargar los documentos"
          description="Hubo un problema al conectar con el servidor. Intente recargar la página."
        />
      )}

      {/* Empty state */}
      {!loading && !error && documents.length === 0 && (
        <EmptyState
          icon="empty"
          title="Sin documentos publicados"
          description="No hay documentos disponibles en este momento. Vuelva pronto."
        />
      )}

      {/* Document grid */}
      {!loading && !error && documents.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          {documents.map((doc) => (
            <div
              key={doc.id}
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
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
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
                  {getFileIcon(doc.fileName)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "var(--color-ink)",
                      margin: "0 0 4px",
                      lineHeight: 1.3,
                    }}
                  >
                    {doc.title}
                  </h2>
                  {doc.description && (
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
                      {doc.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Metadata */}
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
                  <strong style={{ color: "var(--color-ink)" }}>
                    Archivo:
                  </strong>{" "}
                  {doc.fileName}
                </span>
                <span>
                  <strong style={{ color: "var(--color-ink)" }}>Tamaño:</strong>{" "}
                  {formatBytes(doc.sizeBytes)}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(doc)}
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
                  }}
                >
                  Previsualizar
                </button>
                <a
                  href={`/api/documents/${doc.id}/download`}
                  download={doc.fileName}
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
                    textDecoration: "none",
                  }}
                >
                  Descargar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewDoc !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista previa: ${previewDoc.title}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closePreview();
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 26, 41, 0.75)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "0 20px 60px rgba(0,43,65,0.35)",
              width: "100%",
              maxWidth: "900px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                borderBottom: "1px solid var(--color-line)",
                flexShrink: 0,
                gap: "12px",
              }}
            >
              <h2
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--color-ink)",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {previewDoc.title}
              </h2>
              <button
                type="button"
                onClick={closePreview}
                aria-label="Cerrar vista previa"
                style={{
                  background: "transparent",
                  border: "1px solid var(--color-line)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  padding: "6px 14px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-muted)",
                  flexShrink: 0,
                }}
              >
                Cerrar
              </button>
            </div>

            {/* Preview */}
            <div
              style={{ flex: 1, overflow: "auto", minHeight: 0 }}
              data-testid="pdf-preview"
            >
              <PdfPreview documentId={previewDoc.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
