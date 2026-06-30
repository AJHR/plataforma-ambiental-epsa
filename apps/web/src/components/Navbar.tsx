"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Accesos directos a las funciones principales de la plataforma.
const navLinks = [
  { href: "/el-proyecto", label: "El Proyecto" },
  { href: "/seguimiento", label: "Seguimiento" },
  { href: "/aprende", label: "Aprende" },
  { href: "/boletines", label: "Boletines" },
  { href: "/documentos", label: "Documentos" },
  { href: "/admin", label: "Admin" },
] as const;

// CTA destacado: participar y hacer consultas (MIAQR).
const cta = { href: "/participa", label: "Participa" } as const;

// Enlace externo al sitio institucional de Puerto San Antonio.
const PUERTO_URL = "https://www.puertosanantonio.com";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        background: "var(--color-surface)",
        color: "var(--color-ink)",
        minHeight: "64px",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid var(--color-line)",
        boxShadow: "0 1px 6px rgba(18,42,56,0.06)",
      }}
    >
      <nav
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "64px",
        }}
        aria-label="Navegación principal"
      >
        {/* Brand — logo institucional Puerto San Antonio (sobre barra blanca) */}
        <Link
          href="/"
          aria-label="Puerto San Antonio — Plataforma Ambiental (inicio)"
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Image
            src="/logo-puerto.png"
            alt="Puerto San Antonio"
            width={260}
            height={48}
            priority
            style={{ height: "32px", width: "auto" }}
          />
        </Link>

        {/* Desktop links */}
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "4px",
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{
                  color: "var(--color-ink)",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  display: "block",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "var(--color-bg)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-ink)";
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={PUERTO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-line)",
                color: "var(--color-primary)",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Puerto San Antonio
              <span aria-hidden="true">↗</span>
              <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                (se abre en una pestaña nueva)
              </span>
            </a>
          </li>
          <li>
            <Link
              href={cta.href}
              style={{
                display: "block",
                marginLeft: "4px",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-primary)",
                color: "#ffffff",
                fontSize: "0.875rem",
                fontWeight: 700,
              }}
            >
              {cta.label}
            </Link>
          </li>
        </ul>

        {/* Hamburger button — visible on small screens */}
        <button
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          style={{
            background: "transparent",
            border: "1px solid var(--color-line)",
            borderRadius: "var(--radius-sm)",
            color: "var(--color-primary)",
            cursor: "pointer",
            padding: "6px 10px",
            display: "none",
            flexDirection: "column",
            gap: "4px",
          }}
          className="hamburger"
        >
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "var(--color-primary)",
              borderRadius: "1px",
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "var(--color-primary)",
              borderRadius: "1px",
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "var(--color-primary)",
              borderRadius: "1px",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          style={{
            background: "var(--color-surface)",
            borderTop: "1px solid var(--color-line)",
            padding: "12px 24px 20px",
          }}
          className="mobile-menu"
        >
          <ul style={{ listStyle: "none" }}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    color: "var(--color-ink)",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--color-line)",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={PUERTO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--color-primary)",
                  padding: "12px 0",
                  borderBottom: "1px solid var(--color-line)",
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                }}
              >
                Puerto San Antonio
                <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <Link
                href={cta.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  marginTop: "12px",
                  textAlign: "center",
                  padding: "12px 0",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-primary)",
                  color: "#ffffff",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                }}
              >
                {cta.label}
              </Link>
            </li>
          </ul>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
