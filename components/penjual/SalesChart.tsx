"use client";

import React from "react";

type Point = { label: string; value: number };

export default function SalesChart({ data }: { data: Point[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 600;
  const height = 140;
  const padding = 24;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const barW = innerW / data.length - 8;

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Penjualan Terakhir</h3>
        <p className="text-xs text-gray-400">(7 terakhir)</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {data.map((d, i) => {
          const x = padding + i * (barW + 8) + 4;
          const h = (d.value / max) * innerH;
          const y = padding + (innerH - h);
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={h} fill="url(#g)" rx={4} />
              <text x={x + barW / 2} y={height - 6} fontSize={10} fill="#6b7280" textAnchor="middle">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
