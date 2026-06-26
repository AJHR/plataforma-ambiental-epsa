"use client";

interface MapArea {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

const PROJECT_AREAS: MapArea[] = [
  {
    id: "puerto-exterior",
    label: "Puerto Exterior",
    color: "#003b5c",
    x: 60,
    y: 80,
    width: 180,
    height: 140,
    description: "Zona de infraestructura portuaria principal",
  },
  {
    id: "zona-amortiguacion",
    label: "Zona de Amortiguación",
    color: "#2e8b57",
    x: 260,
    y: 60,
    width: 160,
    height: 100,
    description: "Buffer entre el puerto y áreas sensibles",
  },
  {
    id: "area-marina",
    label: "Área Marina",
    color: "#009fe3",
    x: 40,
    y: 240,
    width: 200,
    height: 130,
    description: "Zona de influencia marina y ecosistemas acuáticos",
  },
  {
    id: "zona-terrestre",
    label: "Zona Terrestre",
    color: "#e8743b",
    x: 260,
    y: 180,
    width: 160,
    height: 130,
    description: "Área de monitoreo terrestre y biodiversidad",
  },
];

const SVG_W = 480;
const SVG_H = 400;

export default function MapViewer() {
  return (
    <div
      data-testid="map-viewer"
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-line)",
        boxShadow: "var(--shadow-card)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--color-primary)",
          color: "#ffffff",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
        <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>
          Áreas del Proyecto — Puerto Exterior San Antonio
        </span>
      </div>

      {/* Map SVG */}
      <div style={{ overflowX: "auto", background: "#e8f4f8", flex: 1 }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ width: "100%", minWidth: "320px", height: "auto" }}
          aria-label="Mapa de las 4 áreas del proyecto EPSA"
          role="img"
        >
          {/* Ocean/water background */}
          <defs>
            <pattern
              id="water"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect width="20" height="20" fill="#cce9f5" />
              <line
                x1="0"
                y1="10"
                x2="20"
                y2="10"
                stroke="#b3ddef"
                strokeWidth="0.8"
                strokeDasharray="3 2"
              />
            </pattern>
            <pattern
              id="land"
              x="0"
              y="0"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <rect width="16" height="16" fill="#e8f0e0" />
              <circle cx="8" cy="8" r="1" fill="#c8d8b8" />
            </pattern>
          </defs>

          {/* Background: water */}
          <rect width={SVG_W} height={SVG_H} fill="url(#water)" />

          {/* Land mass shape (simplified coast of San Antonio) */}
          <path
            d={`M 200 0 L ${SVG_W} 0 L ${SVG_W} ${SVG_H} L 200 ${SVG_H} L 180 320 L 160 240 L 200 160 L 180 80 Z`}
            fill="url(#land)"
            stroke="#b8cca8"
            strokeWidth="1"
          />

          {/* Area rectangles */}
          {PROJECT_AREAS.map((area) => (
            <g key={area.id}>
              <rect
                x={area.x}
                y={area.y}
                width={area.width}
                height={area.height}
                rx="6"
                fill={area.color}
                fillOpacity="0.75"
                stroke={area.color}
                strokeWidth="2"
              />
              {/* Label background */}
              <rect
                x={area.x + 4}
                y={area.y + area.height / 2 - 14}
                width={area.width - 8}
                height="28"
                rx="4"
                fill="rgba(255,255,255,0.25)"
              />
              {/* Label text */}
              <text
                x={area.x + area.width / 2}
                y={area.y + area.height / 2 + 5}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#ffffff"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
              >
                {area.label}
              </text>
              {/* Compass-style indicator dot */}
              <circle
                cx={area.x + 12}
                cy={area.y + 12}
                r="4"
                fill="#ffffff"
                fillOpacity="0.8"
              />
            </g>
          ))}

          {/* Compass rose */}
          <g transform={`translate(${SVG_W - 44} 36)`}>
            <circle r="20" fill="rgba(255,255,255,0.7)" stroke="#003b5c" strokeWidth="1" />
            {/* N arrow */}
            <polygon points="0,-14 4,-4 -4,-4" fill="#003b5c" />
            {/* S */}
            <polygon points="0,14 4,4 -4,4" fill="#888" />
            {/* E */}
            <polygon points="14,0 4,4 4,-4" fill="#888" />
            {/* W */}
            <polygon points="-14,0 -4,4 -4,-4" fill="#888" />
            <text x="0" y="-16" textAnchor="middle" fontSize="8" fontWeight="800" fill="#003b5c">
              N
            </text>
          </g>

          {/* Scale bar */}
          <g transform={`translate(20 ${SVG_H - 24})`}>
            <rect width="60" height="6" rx="1" fill="#003b5c" fillOpacity="0.4" />
            <rect width="30" height="6" rx="0" fill="#003b5c" fillOpacity="0.7" />
            <text x="0" y="-4" fontSize="8" fill="#003b5c" fontWeight="600">0</text>
            <text x="60" y="-4" fontSize="8" fill="#003b5c" fontWeight="600" textAnchor="end">500m</text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--color-line)",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {PROJECT_AREAS.map((area) => (
          <div
            key={area.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              color: "var(--color-ink)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: area.color,
                flexShrink: 0,
              }}
            />
            <span>{area.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
