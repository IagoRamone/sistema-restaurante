"use client";

import { RestaurantTable, TableStatus } from "@/types/restaurant";

interface TableElementProps {
  table: RestaurantTable;
  status: TableStatus;
  guestsCount: number;
  onClick: () => void;
}

const statusColors: Record<TableStatus, { fill: string; stroke: string; text: string }> = {
  available: { fill: "#bbf7d0", stroke: "#16a34a", text: "#14532d" },
  occupied:  { fill: "#fecaca", stroke: "#dc2626", text: "#7f1d1d" },
  reserved:  { fill: "#fde68a", stroke: "#d97706", text: "#78350f" },
};


export default function TableElement({ table, status, guestsCount, onClick }: TableElementProps) {
  const colors = statusColors[status];
  const cx = table.x + table.width / 2;
  const cy = table.y + table.height / 2;

  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
    >

      {/* Mesa */}
      {table.shape === "circle" ? (
        <circle
          cx={cx}
          cy={cy}
          r={table.width / 2}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={2}
          filter="url(#table-shadow)"
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
          strokeWidth={2}
          filter="url(#table-shadow)"
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
