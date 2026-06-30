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
        background: "var(--color-primary)",
        color: "#ffffff",
        minHeight: "64px",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
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
        {/* Brand — logo institucional Puerto San Antonio */}
        <Link
          href="/"
          aria-label="Puerto San Antonio — Plataforma Ambiental (inicio)"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          {/* Fondo blanco para legibilidad del logo sobre la barra azul */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#ffffff",
              borderRadius: "var(--radius-sm)",
              padding: "6px 10px",
            }}
          >
            <Image
              src="/logo-puerto.png"
              alt="Puerto San Antonio"
              width={260}
              height={48}
              priority
              style={{ height: "30px", width: "auto" }}
            />
          </span>
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
                  color: "rgba(255,255,255,0.9)",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  display: "block",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(255,255,255,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "#ffffff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(255,255,255,0.9)";
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
                border: "1px solid rgba(255,255,255,0.35)",
                color: "rgba(255,255,255,0.9)",
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
                background: "var(--color-accent)",
                color: "var(--color-accent-foreground)",
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
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "var(--radius-sm)",
            color: "#ffffff",
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
              background: "#ffffff",
              borderRadius: "1px",
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "#ffffff",
              borderRadius: "1px",
            }}
          />
          <span
            style={{
              display: "block",
              width: "20px",
              height: "2px",
              background: "#ffffff",
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
            background: "var(--color-primary-600)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
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
                    color: "rgba(255,255,255,0.9)",
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
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
                  color: "rgba(255,255,255,0.9)",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
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
                  background: "var(--color-accent)",
                  color: "var(--color-accent-foreground)",
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
          .brand-subtitle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
