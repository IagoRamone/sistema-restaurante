"use client";

import { Decoration } from "@/types/restaurant";

interface DecorationElementProps {
  decoration: Decoration;
}

const decorationStyles: Record<
  Decoration["type"],
  { fill: string; stroke: string; icon: string }
> = {
  entrance: { fill: "#dbeafe", stroke: "#3b82f6", icon: "🚪" },
  counter: { fill: "#fef3c7", stroke: "#d97706", icon: "" },
  kitchen: { fill: "#fee2e2", stroke: "#ef4444", icon: "👨‍🍳" },
  bathroom: { fill: "#e0e7ff", stroke: "#6366f1", icon: "🚻" },
  plant: { fill: "#dcfce7", stroke: "#22c55e", icon: "🌿" },
  wall: { fill: "#e5e7eb", stroke: "#6b7280", icon: "" },
};

export default function DecorationElement({
  decoration,
}: DecorationElementProps) {
  const style = decorationStyles[decoration.type];

  return (
    <g>
      <rect
        x={decoration.x}
        y={decoration.y}
        width={decoration.width}
        height={decoration.height}
        rx={6}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={1.5}
        strokeDasharray={decoration.type === "entrance" ? "6 3" : undefined}
        opacity={0.8}
      />
      {decoration.type === "counter" && (
        <>
          {/* Textura do balcão */}
          {Array.from(
            { length: Math.floor(decoration.height / 30) },
            (_, i) => (
              <line
                key={i}
                x1={decoration.x + 10}
                y1={decoration.y + 20 + i * 30}
                x2={decoration.x + decoration.width - 10}
                y2={decoration.y + 20 + i * 30}
                stroke={style.stroke}
                strokeWidth={0.5}
                opacity={0.4}
              />
            )
          )}
        </>
      )}
      <text
        x={decoration.x + decoration.width / 2}
        y={decoration.y + decoration.height / 2 - (decoration.label ? 6 : 0)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={decoration.type === "plant" ? 18 : 20}
      >
        {style.icon}
      </text>
      {decoration.label && (
        <text
          x={decoration.x + decoration.width / 2}
          y={decoration.y + decoration.height / 2 + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fill="#374151"
          fontWeight={500}
        >
          {decoration.label}
        </text>
      )}
    </g>
  );
}
