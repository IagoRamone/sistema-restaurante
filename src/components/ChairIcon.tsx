"use client";

interface ChairIconProps {
  x: number;
  y: number;
  angle: number;
  occupied: boolean;
}

export default function ChairIcon({ x, y, angle, occupied }: ChairIconProps) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <rect
        x={-7}
        y={-7}
        width={14}
        height={14}
        rx={3}
        fill={occupied ? "#991b1b" : "#166534"}
        opacity={0.7}
        stroke={occupied ? "#7f1d1d" : "#14532d"}
        strokeWidth={1}
      />
      {/* Encosto da cadeira */}
      <rect
        x={-7}
        y={-10}
        width={14}
        height={4}
        rx={2}
        fill={occupied ? "#991b1b" : "#166534"}
        opacity={0.9}
        stroke={occupied ? "#7f1d1d" : "#14532d"}
        strokeWidth={1}
      />
    </g>
  );
}
