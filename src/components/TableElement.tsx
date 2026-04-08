"use client";

import { RestaurantTable, TableStatus } from "@/types/restaurant";
import ChairIcon from "./ChairIcon";

interface TableElementProps {
  table: RestaurantTable;
  status: TableStatus;
  guestsCount: number;
  onClick: () => void;
}

const statusColors: Record<TableStatus, { fill: string; stroke: string; text: string }> = {
  available: { fill: "#dcfce7", stroke: "#22c55e", text: "#166534" },
  occupied: { fill: "#fee2e2", stroke: "#ef4444", text: "#991b1b" },
  reserved: { fill: "#fef9c3", stroke: "#eab308", text: "#854d0e" },
};

function getChairPositions(table: RestaurantTable): { x: number; y: number; angle: number }[] {
  const positions: { x: number; y: number; angle: number }[] = [];
  const cx = table.x + table.width / 2;
  const cy = table.y + table.height / 2;
  const pad = 18;

  if (table.shape === "circle") {
    const radius = table.width / 2 + pad;
    for (let i = 0; i < table.seats; i++) {
      const angle = (i * 360) / table.seats - 90;
      const rad = (angle * Math.PI) / 180;
      positions.push({
        x: cx + radius * Math.cos(rad),
        y: cy + radius * Math.sin(rad),
        angle: angle + 90,
      });
    }
  } else {
    const seats = table.seats;
    if (seats <= 2) {
      // 1 de cada lado (esquerda/direita)
      positions.push({ x: table.x - pad, y: cy, angle: -90 });
      if (seats > 1) positions.push({ x: table.x + table.width + pad, y: cy, angle: 90 });
    } else if (seats <= 4) {
      // 2 em cima, 2 embaixo
      const topSpacing = table.width / 3;
      positions.push({ x: table.x + topSpacing, y: table.y - pad, angle: 0 });
      positions.push({ x: table.x + topSpacing * 2, y: table.y - pad, angle: 0 });
      positions.push({ x: table.x + topSpacing, y: table.y + table.height + pad, angle: 180 });
      if (seats > 3)
        positions.push({ x: table.x + topSpacing * 2, y: table.y + table.height + pad, angle: 180 });
    } else {
      // 6+ lugares: 2 em cima, 2 embaixo, 1 em cada lado
      const topSpacing = table.width / 3;
      positions.push({ x: table.x + topSpacing, y: table.y - pad, angle: 0 });
      positions.push({ x: table.x + topSpacing * 2, y: table.y - pad, angle: 0 });
      positions.push({ x: table.x + topSpacing, y: table.y + table.height + pad, angle: 180 });
      positions.push({ x: table.x + topSpacing * 2, y: table.y + table.height + pad, angle: 180 });
      positions.push({ x: table.x - pad, y: cy, angle: -90 });
      if (seats > 5)
        positions.push({ x: table.x + table.width + pad, y: cy, angle: 90 });
    }
  }

  return positions;
}

export default function TableElement({ table, status, guestsCount, onClick }: TableElementProps) {
  const colors = statusColors[status];
  const chairs = getChairPositions(table);
  const cx = table.x + table.width / 2;
  const cy = table.y + table.height / 2;

  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
    >
      {/* Cadeiras */}
      {chairs.map((chair, i) => (
        <ChairIcon
          key={i}
          x={chair.x}
          y={chair.y}
          angle={chair.angle}
          occupied={status === "occupied" && i < guestsCount}
        />
      ))}

      {/* Mesa */}
      {table.shape === "circle" ? (
        <circle
          cx={cx}
          cy={cy}
          r={table.width / 2}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={2.5}
          className="transition-all duration-200 hover:brightness-95"
        />
      ) : (
        <rect
          x={table.x}
          y={table.y}
          width={table.width}
          height={table.height}
          rx={8}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={2.5}
          className="transition-all duration-200 hover:brightness-95"
        />
      )}

      {/* Número da mesa */}
      <text
        x={cx}
        y={cy - (status === "occupied" ? 6 : 0)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={16}
        fontWeight={700}
        fill={colors.text}
      >
        {table.label}
      </text>

      {/* Contagem de pessoas */}
      {status === "occupied" && (
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={11}
          fill={colors.text}
          fontWeight={500}
        >
          {guestsCount}/{table.seats}
        </text>
      )}

      {/* Indicador de status */}
      {status === "reserved" && (
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fill={colors.text}
          fontWeight={500}
        >
          Reservada
        </text>
      )}

      {/* Hover area maior para toque */}
      {table.shape === "circle" ? (
        <circle
          cx={cx}
          cy={cy}
          r={table.width / 2 + 25}
          fill="transparent"
        />
      ) : (
        <rect
          x={table.x - 25}
          y={table.y - 25}
          width={table.width + 50}
          height={table.height + 50}
          fill="transparent"
        />
      )}
    </g>
  );
}
