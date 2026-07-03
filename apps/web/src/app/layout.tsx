import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SiteGate from "@/components/SiteGate";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Plataforma Ambiental EPSA - Puerto Exterior",
  description:
    "Plataforma de información ambiental del Puerto Exterior de San Antonio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <SiteGate>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 64px)" }}>{children}</main>
          <footer
            style={{
              background: "var(--color-bg-deep)",
              color: "white",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <p>© 2026 EPSA — Plataforma de Información Ambiental</p>
          </footer>
        </SiteGate>
      </body>
    </html>
  );
}
