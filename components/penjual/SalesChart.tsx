"use client";

import React, { useState } from "react";

type Point = { label: string; value: number };

export default function SalesChart({ data }: { data: Point[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 900;
  const height = 280;
  const padding = 40;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const gap = 16;
  const barW = data.length > 0 ? (innerW - gap * (data.length - 1)) / data.length : innerW;

  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-600">Belum ada data penjualan</p>
        <p className="text-xs text-slate-500 mt-1">Chart akan ditampilkan setelah ada pesanan selesai</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        width="100%" 
        height="auto"
        preserveAspectRatio="xMidYMid meet" 
        role="img" 
        aria-label="Tren pendapatan 7 hari terakhir"
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="sales-chart-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="sales-chart-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding + innerH - innerH * ratio;
          const value = Math.round(max * ratio);
          return (
            <g key={`grid-${ratio}`}>
              <line x1={padding - 5} x2={width - padding} y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 6" />
              <text x={padding - 12} y={y + 4} fontSize="11" fill="#94a3b8" textAnchor="end">
                Rp {(value / 1000).toLocaleString("id-ID")}K
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding + i * (barW + gap);
          const h = (d.value / max) * innerH;
          const y = padding + (innerH - h);
          const isHovered = hoveredIndex === i;
          
          return (
            <g key={`bar-${i}`} filter={isHovered ? "url(#shadow)" : ""}>
              <rect 
                x={x} 
                y={y} 
                width={barW} 
                height={h} 
                fill="url(#sales-chart-gradient)" 
                rx="8"
                className="transition-opacity duration-200"
                opacity={isHovered ? 1 : 0.8}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              />
              <rect 
                x={x} 
                y={y} 
                width={barW} 
                height={Math.max(h * 0.25, 8)} 
                fill="url(#sales-chart-fill)" 
                rx="8"
              />
              
              {/* Label */}
              <text 
                x={x + barW / 2} 
                y={height - 12} 
                fontSize="12" 
                fontWeight="600"
                fill={isHovered ? "#8b5cf6" : "#64748b"} 
                textAnchor="middle"
                className="transition-colors duration-200"
              >
                Hari {d.label}
              </text>

              {/* Value label on hover */}
              {isHovered && d.value > 0 && (
                <g>
                  <rect
                    x={x + barW / 2 - 45}
                    y={y - 35}
                    width="90"
                    height="28"
                    rx="6"
                    fill="#1e293b"
                    opacity="0.9"
                  />
                  <text 
                    x={x + barW / 2} 
                    y={y - 15} 
                    fontSize="13" 
                    fontWeight="700"
                    fill="#fff" 
                    textAnchor="middle"
                  >
                    Rp {d.value.toLocaleString("id-ID")}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Trend line */}
        {data.length > 1 && data.some((d) => d.value > 0) && (
          <polyline
            fill="none"
            stroke="#8b5cf6"
            strokeOpacity="0.25"
            strokeWidth="2"
            points={data
              .map((d, i) => {
                const x = padding + i * (barW + gap) + barW / 2;
                const h = (d.value / max) * innerH;
                const y = padding + (innerH - h);
                return `${x},${y}`;
              })
              .join(" ")}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-gradient-to-b from-violet-500 to-indigo-600"></div>
          <span className="text-slate-600">Omzet penjualan harian</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-slate-300 opacity-40"></div>
          <span className="text-slate-600">Trend penjualan</span>
        </div>
      </div>
    </div>
  );
}
