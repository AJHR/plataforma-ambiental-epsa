"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface MiaqrCase {
  id: string;
  caseNumber: string;
  category: string;
  status: "ingresado" | "acuse" | "evaluacion" | "resuelto";
  createdAt: string;
}

interface DocumentEntry {
  id: string;
  title: string;
  fileName: string;
  status: string;
  uploadedAt: string;
}

type ActiveSection =
  | "monitoreo"
  | "documentos"
  | "contenidos"
  | "bandeja"
  | "boletines";

const STATUS_LABELS: Record<MiaqrCase["status"], string> = {
  ingresado: "Ingresado",
  acuse: "Acuse",
  evaluacion: "Evaluación",
  resuelto: "Resuelto",
};

const STATUS_COLORS: Record<MiaqrCase["status"], string> = {
  ingresado: "var(--color-accent)",
  acuse: "var(--sema-warn)",
  evaluacion: "var(--color-primary)",
  resuelto: "var(--sema-ok)",
};

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: 700,
          color: "var(--color-primary)",
          marginBottom: description ? "6px" : "0",
        }}
      >
        {title}
      </h2>
      {description && (
        <p style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>
          {description}
        </p>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>("bandeja");

  // Monitoreo upload
  const [monitoreoFile, setMonitoreoFile] = useState<File | null>(null);
  const [monitoreoStatus, setMonitoreoStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const monitoreoRef = useRef<HTMLInputElement>(null);

  // Documento upload
  const [docTitle, setDocTitle] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docStatus, setDocStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const docRef = useRef<HTMLInputElement>(null);

  // MIAQR
  const [cases, setCases] = useState<MiaqrCase[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);

  // Documents list
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);

  // Boletin
  const [boletinSubject, setBoletinSubject] = useState("");
  const [boletinBody, setBoletinBody] = useState("");
  const [boletinStatus, setBoletinStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("epsa_admin_token");
    if (!token) {
      router.replace("/admin");
      return;
    }
    setAuthed(true);
  }, [router]);

  // Load data when sections activate
  useEffect(() => {
    if (!authed) return;
    if (activeSection === "bandeja" && cases.length === 0) {
      loadCases();
    }
    if (activeSection === "documentos" && documents.length === 0) {
      loadDocuments();
    }
  }, [activeSection, authed]); // eslint-disable-line react-hooks/exhaustive-deps

  function getToken() {
    return localStorage.getItem("epsa_admin_token") ?? "";
  }

  async function loadCases() {
    setCasesLoading(true);
    try {
      const res = await fetch("/api/admin/participacion", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      const json = (await res.json()) as MiaqrCase[] | { data: MiaqrCase[] };
      const list = Array.isArray(json) ? json : (json as { data: MiaqrCase[] }).data;
      setCases(list);
    } catch {
      setCases([]);
    } finally {
      setCasesLoading(false);
    }
  }

  async function loadDocuments() {
    setDocsLoading(true);
    try {
      const res = await fetch("/api/admin/documents", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      const json = (await res.json()) as DocumentEntry[] | { data: DocumentEntry[] };
      const list = Array.isArray(json)
        ? json
        : (json as { data: DocumentEntry[] }).data;
      setDocuments(list);
    } catch {
      setDocuments([]);
    } finally {
      setDocsLoading(false);
    }
  }

  async function handleMonitoreoUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!monitoreoFile) return;
    setMonitoreoStatus("uploading");
    try {
      const fd = new FormData();
      fd.append("file", monitoreoFile);
      const res = await fetch("/api/admin/monitoreo/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      if (!res.ok) throw new Error();
      setMonitoreoStatus("success");
      setMonitoreoFile(null);
      if (monitoreoRef.current) monitoreoRef.current.value = "";
    } catch {
      setMonitoreoStatus("error");
    }
  }

  async function handleDocUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!docFile || !docTitle.trim()) return;
    setDocStatus("uploading");
    try {
      const fd = new FormData();
      fd.append("file", docFile);
      fd.append("title", docTitle.trim());
      const res = await fetch("/api/admin/documents/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      if (!res.ok) throw new Error();
      setDocStatus("success");
      setDocTitle("");
      setDocFile(null);
      if (docRef.current) docRef.current.value = "";
      // Refresh list
      loadDocuments();
    } catch {
      setDocStatus("error");
    }
  }

  async function handleBoletinSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!boletinSubject.trim() || !boletinBody.trim()) return;
    setBoletinStatus("sending");
    try {
      const res = await fetch("/api/admin/boletines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          subject: boletinSubject.trim(),
          body: boletinBody.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setBoletinStatus("success");
      setBoletinSubject("");
      setBoletinBody("");
    } catch {
      setBoletinStatus("error");
    }
  }

  function handleLogout() {
    localStorage.removeItem("epsa_admin_token");
    router.replace("/admin");
  }

  if (authed === null) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <p style={{ color: "var(--color-muted)" }}>Verificando acceso…</p>
      </div>
    );
  }

  const navItems: { key: ActiveSection; label: string }[] = [
    { key: "bandeja", label: "Bandeja MIAQR" },
    { key: "monitoreo", label: "Monitoreos" },
    { key: "documentos", label: "Documentos" },
    { key: "contenidos", label: "Contenidos" },
    { key: "boletines", label: "Boletines" },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "calc(100vh - 64px - 72px)",
        background: "var(--color-bg)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          background: "var(--color-bg-deep)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
        }}
      >
        <div style={{ padding: "0 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <p
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "4px",
            }}
          >
            Panel de gestión
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.75)",
              fontWeight: 600,
            }}
          >
            EPSA Admin
          </p>
        </div>

        <nav
          aria-label="Secciones de administración"
          style={{ flex: 1, padding: "16px 0" }}
        >
          <ul style={{ listStyle: "none" }}>
            {navItems.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 20px",
                    background:
                      activeSection === item.key
                        ? "rgba(0,159,227,0.15)"
                        : "transparent",
                    borderLeft:
                      activeSection === item.key
                        ? "3px solid var(--color-accent)"
                        : "3px solid transparent",
                    color:
                      activeSection === item.key
                        ? "var(--color-accent)"
                        : "rgba(255,255,255,0.65)",
                    fontSize: "0.875rem",
                    fontWeight: activeSection === item.key ? 700 : 400,
                    cursor: "pointer",
                    border: "none",
                    borderLeft:
                      activeSection === item.key
                        ? "3px solid var(--color-accent)"
                        : "3px solid transparent",
                    transition: "background 0.12s, color 0.12s",
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "9px 16px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-sm)",
              color: "rgba(255,255,255,0.65)",
              fontSize: "0.8125rem",
              fontWeight: 500,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "36px 40px",
          overflow: "auto",
          minWidth: 0,
        }}
      >
        {/* BANDEJA MIAQR */}
        {activeSection === "bandeja" && (
          <div>
            <SectionHeader
              title="Bandeja MIAQR"
              description="Consultas, quejas y reclamos recibidos a través del mecanismo de participación ciudadana."
            />

            {casesLoading && (
              <p style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>
                Cargando casos…
              </p>
            )}

            {!casesLoading && cases.length === 0 && (
              <div
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-line)",
                  padding: "40px",
                  textAlign: "center",
                  color: "var(--color-muted)",
                  fontSize: "0.875rem",
                }}
              >
                No hay casos registrados.
              </div>
            )}

            {!casesLoading && cases.length > 0 && (
              <div style={{ overflowX: "auto", borderRadius: "var(--radius-md)" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-line)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.875rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "var(--color-bg)",
                        borderBottom: "2px solid var(--color-line)",
                      }}
                    >
                      {["N° Caso", "Categoría", "Estado", "Fecha"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--color-muted)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cases.map((c, idx) => (
                      <tr
                        key={c.id}
                        style={{
                          borderBottom:
                            idx < cases.length - 1
                              ? "1px solid var(--color-line)"
                              : "none",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            fontWeight: 700,
                            color: "var(--color-primary)",
                            fontVariantNumeric: "tabular-nums",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.caseNumber}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "var(--color-ink)",
                          }}
                        >
                          {c.category}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: "var(--radius-full)",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: STATUS_COLORS[c.status],
                              background: `${STATUS_COLORS[c.status]}18`,
                              border: `1px solid ${STATUS_COLORS[c.status]}`,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {STATUS_LABELS[c.status]}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "var(--color-muted)",
                            fontVariantNumeric: "tabular-nums",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ marginTop: "16px" }}>
              <button
                type="button"
                onClick={loadCases}
                style={{
                  padding: "8px 20px",
                  background: "transparent",
                  border: "1.5px solid var(--color-line)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-muted)",
                  cursor: "pointer",
                }}
              >
                Actualizar bandeja
              </button>
            </div>
          </div>
        )}

        {/* MONITOREO */}
        {activeSection === "monitoreo" && (
          <div>
            <SectionHeader
              title="Gestor de monitoreos"
              description="Cargue datos de monitoreo ambiental en formato CSV o Excel."
            />

            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-line)",
                boxShadow: "var(--shadow-card)",
                padding: "32px",
                maxWidth: "520px",
              }}
            >
              <form onSubmit={handleMonitoreoUpload}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div>
                    <label
                      htmlFor="monitoreo-file"
                      style={{
                        display: "block",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        marginBottom: "6px",
                      }}
                    >
                      Archivo de datos (CSV / Excel)
                    </label>
                    <input
                      id="monitoreo-file"
                      ref={monitoreoRef}
                      type="file"
                      accept=".csv,.xls,.xlsx"
                      onChange={(e) =>
                        setMonitoreoFile(e.target.files?.[0] ?? null)
                      }
                      required
                      style={{
                        display: "block",
                        width: "100%",
                        fontSize: "0.875rem",
                        color: "var(--color-ink)",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-muted)",
                        marginTop: "4px",
                      }}
                    >
                      Formatos aceptados: .csv, .xls, .xlsx
                    </p>
                  </div>

                  {monitoreoStatus === "success" && (
                    <p
                      role="status"
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--sema-ok)",
                        fontWeight: 600,
                      }}
                    >
                      Datos cargados exitosamente.
                    </p>
                  )}
                  {monitoreoStatus === "error" && (
                    <p
                      role="alert"
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--sema-bad)",
                        fontWeight: 500,
                      }}
                    >
                      Error al cargar el archivo. Intente nuevamente.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={
                      !monitoreoFile || monitoreoStatus === "uploading"
                    }
                    style={{
                      alignSelf: "flex-start",
                      padding: "10px 28px",
                      background:
                        !monitoreoFile || monitoreoStatus === "uploading"
                          ? "var(--color-muted)"
                          : "var(--color-primary)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.9375rem",
                      fontWeight: 700,
                      cursor:
                        !monitoreoFile || monitoreoStatus === "uploading"
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {monitoreoStatus === "uploading"
                      ? "Cargando…"
                      : "Cargar datos"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DOCUMENTOS */}
        {activeSection === "documentos" && (
          <div>
            <SectionHeader
              title="Gestor de documentos"
              description="Suba nuevos documentos PDF y gestione los existentes."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
                alignItems: "start",
              }}
            >
              {/* Upload form */}
              <div
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-line)",
                  boxShadow: "var(--shadow-card)",
                  padding: "28px",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                    marginBottom: "20px",
                  }}
                >
                  Subir documento
                </h3>
                <form onSubmit={handleDocUpload}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <label
                        htmlFor="doc-title"
                        style={{
                          display: "block",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--color-ink)",
                          marginBottom: "6px",
                        }}
                      >
                        Título del documento
                      </label>
                      <input
                        id="doc-title"
                        type="text"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        required
                        placeholder="Informe de monitoreo — Trimestre 1"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-sm)",
                          border: "1.5px solid var(--color-line)",
                          background: "var(--color-bg)",
                          fontSize: "0.875rem",
                          fontFamily: "inherit",
                          color: "var(--color-ink)",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="doc-file"
                        style={{
                          display: "block",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--color-ink)",
                          marginBottom: "6px",
                        }}
                      >
                        Archivo PDF
                      </label>
                      <input
                        id="doc-file"
                        ref={docRef}
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
                        required
                        style={{
                          display: "block",
                          width: "100%",
                          fontSize: "0.875rem",
                          color: "var(--color-ink)",
                        }}
                      />
                    </div>

                    {docStatus === "success" && (
                      <p
                        role="status"
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--sema-ok)",
                          fontWeight: 600,
                        }}
                      >
                        Documento subido exitosamente.
                      </p>
                    )}
                    {docStatus === "error" && (
                      <p
                        role="alert"
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--sema-bad)",
                          fontWeight: 500,
                        }}
                      >
                        Error al subir el documento.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={!docFile || !docTitle.trim() || docStatus === "uploading"}
                      style={{
                        alignSelf: "flex-start",
                        padding: "10px 24px",
                        background:
                          !docFile || !docTitle.trim() || docStatus === "uploading"
                            ? "var(--color-muted)"
                            : "var(--color-primary)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        cursor:
                          !docFile || !docTitle.trim() || docStatus === "uploading"
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {docStatus === "uploading" ? "Subiendo…" : "Subir PDF"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Documents list */}
              <div
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-line)",
                  boxShadow: "var(--shadow-card)",
                  padding: "28px",
                }}
              >
                <h3
                  style={{
                    fontSize: "0.9375rem",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                    marginBottom: "16px",
                  }}
                >
                  Documentos existentes
                </h3>
                {docsLoading && (
                  <p
                    style={{
                      color: "var(--color-muted)",
                      fontSize: "0.875rem",
                    }}
                  >
                    Cargando…
                  </p>
                )}
                {!docsLoading && documents.length === 0 && (
                  <p
                    style={{
                      color: "var(--color-muted)",
                      fontSize: "0.875rem",
                    }}
                  >
                    No hay documentos aún.
                  </p>
                )}
                {!docsLoading && documents.length > 0 && (
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {documents.map((d) => (
                      <li
                        key={d.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          padding: "10px 12px",
                          background: "var(--color-bg)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--color-line)",
                          fontSize: "0.8125rem",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--color-ink)",
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.title}
                        </span>
                        <span
                          style={{
                            color: "var(--color-muted)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {d.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDOS */}
        {activeSection === "contenidos" && (
          <div>
            <SectionHeader
              title="Gestor de contenidos"
              description="Administre el contenido de las páginas del proyecto."
            />

            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-line)",
                boxShadow: "var(--shadow-card)",
                padding: "32px",
                maxWidth: "560px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  "Inicio",
                  "El Proyecto",
                  "Seguimiento",
                  "Aprende",
                  "Boletines",
                ].map((page) => (
                  <div
                    key={page}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      background: "var(--color-bg)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-line)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                      }}
                    >
                      {page}
                    </span>
                    <button
                      type="button"
                      style={{
                        padding: "6px 16px",
                        background: "transparent",
                        border: "1.5px solid var(--color-primary)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--color-primary)",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOLETINES */}
        {activeSection === "boletines" && (
          <div>
            <SectionHeader
              title="Boletines"
              description="Redacte y envíe boletines informativos a los suscriptores."
            />

            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-line)",
                boxShadow: "var(--shadow-card)",
                padding: "32px",
                maxWidth: "600px",
              }}
            >
              <form onSubmit={handleBoletinSend}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div>
                    <label
                      htmlFor="boletin-subject"
                      style={{
                        display: "block",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        marginBottom: "6px",
                      }}
                    >
                      Asunto
                    </label>
                    <input
                      id="boletin-subject"
                      type="text"
                      value={boletinSubject}
                      onChange={(e) => setBoletinSubject(e.target.value)}
                      required
                      placeholder="Boletín ambiental — Junio 2026"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: "1.5px solid var(--color-line)",
                        background: "var(--color-bg)",
                        fontSize: "0.9375rem",
                        fontFamily: "inherit",
                        color: "var(--color-ink)",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="boletin-body"
                      style={{
                        display: "block",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        marginBottom: "6px",
                      }}
                    >
                      Contenido
                    </label>
                    <textarea
                      id="boletin-body"
                      rows={8}
                      value={boletinBody}
                      onChange={(e) => setBoletinBody(e.target.value)}
                      required
                      placeholder="Redacte el contenido del boletín…"
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: "1.5px solid var(--color-line)",
                        background: "var(--color-bg)",
                        fontSize: "0.9375rem",
                        fontFamily: "inherit",
                        color: "var(--color-ink)",
                        resize: "vertical",
                        lineHeight: 1.6,
                      }}
                    />
                  </div>

                  {boletinStatus === "success" && (
                    <p
                      role="status"
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--sema-ok)",
                        fontWeight: 600,
                      }}
                    >
                      Boletín enviado exitosamente.
                    </p>
                  )}
                  {boletinStatus === "error" && (
                    <p
                      role="alert"
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--sema-bad)",
                        fontWeight: 500,
                      }}
                    >
                      Error al enviar el boletín. Intente nuevamente.
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="submit"
                      disabled={
                        !boletinSubject.trim() ||
                        !boletinBody.trim() ||
                        boletinStatus === "sending"
                      }
                      style={{
                        padding: "10px 28px",
                        background:
                          !boletinSubject.trim() ||
                          !boletinBody.trim() ||
                          boletinStatus === "sending"
                            ? "var(--color-muted)"
                            : "var(--color-primary)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.9375rem",
                        fontWeight: 700,
                        cursor:
                          !boletinSubject.trim() ||
                          !boletinBody.trim() ||
                          boletinStatus === "sending"
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {boletinStatus === "sending" ? "Enviando…" : "Enviar boletín"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBoletinSubject("");
                        setBoletinBody("");
                        setBoletinStatus("idle");
                      }}
                      style={{
                        padding: "10px 20px",
                        background: "transparent",
                        border: "1.5px solid var(--color-line)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--color-muted)",
                        cursor: "pointer",
                      }}
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
