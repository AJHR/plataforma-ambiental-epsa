"use client";

interface DataPoint {
  date: string;
  value: number;
  unit: string;
  threshold?: number;
}

interface ChartProps {
  points: DataPoint[];
}

const SVG_WIDTH = 600;
const SVG_HEIGHT = 200;
const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax === inMin) return (outMin + outMax) / 2;
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

export default function Chart({ points }: ChartProps) {
  if (points.length === 0) {
    return (
      <div
        data-testid="chart"
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-line)",
          padding: "32px",
          textAlign: "center",
          color: "var(--color-muted)",
          fontSize: "0.875rem",
        }}
      >
        Sin datos disponibles
      </div>
    );
  }

  const values = points.map((p) => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const unit = points[0]?.unit ?? "";
  const latest = points[points.length - 1];
  const first = points[0];
  const trend =
    latest !== undefined && first !== undefined && points.length > 1
      ? latest.value - first.value
      : 0;

  const plotW = SVG_WIDTH - PADDING.left - PADDING.right;
  const plotH = SVG_HEIGHT - PADDING.top - PADDING.bottom;

  const toX = (i: number) =>
    PADDING.left + mapRange(i, 0, points.length - 1, 0, plotW);
  const toY = (v: number) =>
    PADDING.top + mapRange(v, minVal, maxVal, plotH, 0);

  const linePath = points
    .map(
      (p, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(p.value).toFixed(1)}`,
    )
    .join(" ");

  const areaPath =
    linePath +
    ` L ${toX(points.length - 1).toFixed(1)} ${(PADDING.top + plotH).toFixed(1)}` +
    ` L ${toX(0).toFixed(1)} ${(PADDING.top + plotH).toFixed(1)} Z`;

  const hasThreshold = points.some((p) => p.threshold !== undefined);
  const thresholdVal = points.find((p) => p.threshold !== undefined)?.threshold;
  const thresholdY =
    thresholdVal !== undefined ? toY(thresholdVal).toFixed(1) : null;

  const trendSymbol = trend > 0 ? "↑" : trend < 0 ? "↓" : "→";
  const trendColor =
    trend > 0 ? "var(--sema-bad)" : trend < 0 ? "var(--sema-ok)" : "var(--color-muted)";

  return (
    <div
      data-testid="chart"
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-line)",
        boxShadow: "var(--shadow-card)",
        padding: "16px",
        overflow: "hidden",
      }}
    >
      {/* Summary row */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        {latest !== undefined && (
          <div>
            <div
              style={{
                fontSize: "0.6875rem",
                color: "var(--color-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              Último valor
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--color-ink)",
              }}
            >
              {latest.value.toFixed(2)}{" "}
              <span
                style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}
              >
                {unit}
              </span>
            </div>
          </div>
        )}
        <div>
          <div
            style={{
              fontSize: "0.6875rem",
              color: "var(--color-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            Mín / Máx
          </div>
          <div
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "var(--color-ink)",
            }}
          >
            {minVal.toFixed(2)} / {maxVal.toFixed(2)}{" "}
            <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>
              {unit}
            </span>
          </div>
        </div>
        {points.length > 1 && (
          <div>
            <div
              style={{
                fontSize: "0.6875rem",
                color: "var(--color-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontWeight: 600,
              }}
            >
              Tendencia
            </div>
            <div
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: trendColor,
              }}
            >
              {trendSymbol} {Math.abs(trend).toFixed(2)} {unit}
            </div>
          </div>
        )}
      </div>

      {/* SVG chart */}
      <div style={{ overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          style={{ width: "100%", minWidth: "280px", height: "auto" }}
          aria-label="Gráfico de línea"
          role="img"
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#009fe3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#009fe3" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = PADDING.top + plotH * (1 - frac);
            const val = minVal + (maxVal - minVal) * frac;
            return (
              <g key={frac}>
                <line
                  x1={PADDING.left}
                  y1={y}
                  x2={PADDING.left + plotW}
                  y2={y}
                  stroke="var(--color-line)"
                  strokeWidth="0.5"
                />
                <text
                  x={PADDING.left - 6}
                  y={y + 4}
                  fontSize="10"
                  fill="var(--color-muted)"
                  textAnchor="end"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Threshold line */}
          {hasThreshold && thresholdY !== null && (
            <line
              x1={PADDING.left}
              y1={thresholdY}
              x2={PADDING.left + plotW}
              y2={thresholdY}
              stroke="var(--sema-warn)"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />
          )}

          {/* Area fill */}
          <path d={areaPath} fill="url(#chartGrad)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={toX(i)}
              cy={toY(p.value)}
              r={points.length > 30 ? 0 : 3}
              fill="var(--color-accent)"
              stroke="var(--color-surface)"
              strokeWidth="1.5"
            >
              <title>
                {p.date}: {p.value} {unit}
              </title>
            </circle>
          ))}

          {/* X-axis date labels (first, middle, last) */}
          {points.length >= 2 &&
            [0, Math.floor((points.length - 1) / 2), points.length - 1]
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((idx) => {
                const p = points[idx];
                if (!p) return null;
                return (
                  <text
                    key={idx}
                    x={toX(idx)}
                    y={PADDING.top + plotH + 20}
                    fontSize="10"
                    fill="var(--color-muted)"
                    textAnchor="middle"
                  >
                    {p.date.slice(0, 10)}
                  </text>
                );
              })}
        </svg>
      </div>
    </div>
  );
}
