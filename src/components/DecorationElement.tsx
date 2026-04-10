"use client";

import { Decoration } from "@/types/restaurant";

interface DecorationElementProps {
  decoration: Decoration;
}

function EntranceElement({ d }: { d: Decoration }) {
  const { x, y, width: w, height: h } = d;
  const blockH = Math.round(h * 0.25); // pillar height (~25% each)
  const openY = y + blockH;
  const openH = h - blockH * 2;
  const midX = x + w / 2;
  const midY = openY + openH / 2;

  return (
    <g>
      {/* Top pillar */}
      <rect x={x} y={y} width={w} height={blockH} fill="#374151" rx={3} />

      {/* Bottom pillar */}
      <rect x={x} y={y + h - blockH} width={w} height={blockH} fill="#374151" rx={3} />

      {/* Open gap: subtle background + arrows */}
      <rect x={x} y={openY} width={w} height={openH} fill="#f0f9ff" opacity={0.5} />

      {/* Arrow pointing left (into restaurant) */}
      <line x1={midX + 18} y1={midY} x2={midX - 14} y2={midY} stroke="#0369a1" strokeWidth={3} strokeLinecap="round" />
      <polyline
        points={`${midX - 7},${midY - 7} ${midX - 16},${midY} ${midX - 7},${midY + 7}`}
        fill="none" stroke="#0369a1" strokeWidth={3}
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Label below arrow */}
      <text
        x={midX}
        y={midY + 20}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10}
        fill="#0c4a6e"
        fontWeight={700}
        letterSpacing={0.5}
      >
        ENTRADA
      </text>
    </g>
  );
}

const decorationStyles: Record<
  Decoration["type"],
  { fill: string; stroke: string; icon: string }
> = {
  entrance:      { fill: "#e0f2fe", stroke: "#0369a1", icon: "" },
  counter:       { fill: "#fcd34d", stroke: "#92400e", icon: "" },
  kitchen:       { fill: "#fca5a5", stroke: "#b91c1c", icon: "👨‍🍳" },
  bathroom:      { fill: "#e0e7ff", stroke: "#6366f1", icon: "🚻" },
  plant:         { fill: "#dcfce7", stroke: "#22c55e", icon: "🌿" },
  wall:          { fill: "#374151", stroke: "#1f2937", icon: "" },
  churrasqueira: { fill: "#fdba74", stroke: "#9a3412", icon: "🔥" },
};

export default function DecorationElement({ decoration }: DecorationElementProps) {
  if (decoration.type === "entrance") {
    return <EntranceElement d={decoration} />;
  }

  const style = decorationStyles[decoration.type];
  const cx = decoration.x + decoration.width / 2;
  const cy = decoration.y + decoration.height / 2;
  const hasLabel = !!decoration.label;

  return (
    <g filter="url(#element-shadow)">
      {/* Background */}
      <rect
        x={decoration.x}
        y={decoration.y}
        width={decoration.width}
        height={decoration.height}
        rx={6}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={1.8}
        opacity={0.9}
      />

      {/* Counter / Bar: plank lines */}
      {decoration.type === "counter" && (
        <>
          {Array.from({ length: Math.floor(decoration.height / 28) }, (_, i) => (
            <line
              key={i}
              x1={decoration.x + 10}
              y1={decoration.y + 22 + i * 28}
              x2={decoration.x + decoration.width - 10}
              y2={decoration.y + 22 + i * 28}
              stroke={style.stroke}
              strokeWidth={1}
              opacity={0.25}
            />
          ))}
          {/* Corner accent */}
          <rect
            x={decoration.x + 4}
            y={decoration.y + 4}
            width={decoration.width - 8}
            height={decoration.height - 8}
            rx={4}
            fill="none"
            stroke={style.stroke}
            strokeWidth={0.8}
            opacity={0.18}
          />
        </>
      )}

      {/* Churrasqueira: grill marks */}
      {decoration.type === "churrasqueira" && (
        <>
          {Array.from({ length: 4 }, (_, i) => (
            <line
              key={i}
              x1={decoration.x + 14}
              y1={decoration.y + 22 + i * 16}
              x2={decoration.x + decoration.width - 14}
              y2={decoration.y + 22 + i * 16}
              stroke="#9a3412"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.35}
            />
          ))}
          <rect
            x={decoration.x + 4}
            y={decoration.y + 4}
            width={decoration.width - 8}
            height={decoration.height - 8}
            rx={4}
            fill="none"
            stroke="#c2410c"
            strokeWidth={1}
            opacity={0.3}
          />
        </>
      )}

      {/* Icon */}
      {style.icon && (
        <text
          x={cx}
          y={cy - (hasLabel ? 8 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={decoration.type === "plant" ? 18 : 20}
        >
          {style.icon}
        </text>
      )}

      {/* Label */}
      {hasLabel && (
        <text
          x={cx}
          y={style.icon ? cy + 14 : cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={decoration.type === "counter" && decoration.width > 200 ? 14 : 11}
          fill="#1c1917"
          fontWeight={600}
          letterSpacing={0.5}
        >
          {decoration.label}
        </text>
      )}
    </g>
  );
}
