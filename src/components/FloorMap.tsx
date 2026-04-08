"use client";

import { useState, useCallback } from "react";
import { FloorLayout, TableStatus, Occupancy } from "@/types/restaurant";
import TableElement from "./TableElement";
import DecorationElement from "./DecorationElement";
import TableModal from "./TableModal";

interface TableData {
  status: TableStatus;
  currentOccupancy: Occupancy | null;
  history: Occupancy[];
}

export default function FloorMap({ layout }: { layout: FloorLayout }) {
  const [tables, setTables] = useState<Record<string, TableData>>(() => {
    const initial: Record<string, TableData> = {};
    for (const table of layout.tables) {
      initial[table.id] = { status: "available", currentOccupancy: null, history: [] };
    }
    return initial;
  });

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const selectedTable = selectedTableId
    ? layout.tables.find((t) => t.id === selectedTableId)
    : null;

  const handleOccupy = useCallback(
    (tableId: string, guestsCount: number, notes: string) => {
      setTables((prev) => ({
        ...prev,
        [tableId]: {
          ...prev[tableId],
          status: "occupied",
          currentOccupancy: {
            id: crypto.randomUUID(),
            tableId,
            guestsCount,
            startedAt: new Date(),
            endedAt: null,
            notes,
          },
        },
      }));
      setSelectedTableId(null);
    },
    []
  );

  const handleFree = useCallback((tableId: string) => {
    setTables((prev) => {
      const current = prev[tableId];
      const closedOccupancy = current.currentOccupancy
        ? { ...current.currentOccupancy, endedAt: new Date() }
        : null;
      return {
        ...prev,
        [tableId]: {
          status: "available",
          currentOccupancy: null,
          history: closedOccupancy
            ? [...current.history, closedOccupancy]
            : current.history,
        },
      };
    });
    setSelectedTableId(null);
  }, []);

  const handleReserve = useCallback((tableId: string, notes: string) => {
    setTables((prev) => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        status: "reserved",
        currentOccupancy: {
          id: crypto.randomUUID(),
          tableId,
          guestsCount: 0,
          startedAt: new Date(),
          endedAt: null,
          notes: notes || "Reservada",
        },
      },
    }));
    setSelectedTableId(null);
  }, []);

  // Stats
  const allTableData = Object.values(tables);
  const totalTables = allTableData.length;
  const occupiedCount = allTableData.filter((t) => t.status === "occupied").length;
  const reservedCount = allTableData.filter((t) => t.status === "reserved").length;
  const availableCount = totalTables - occupiedCount - reservedCount;
  const totalSeats = layout.tables.reduce((sum, t) => sum + t.seats, 0);
  const occupiedSeats = layout.tables.reduce((sum, t) => {
    const data = tables[t.id];
    if (!data) return sum;
    return sum + (data.status === "occupied" && data.currentOccupancy ? data.currentOccupancy.guestsCount : 0);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header com stats */}
      <header className="bg-white border-b px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">{layout.name}</h1>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">{availableCount}</span> livres
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">{occupiedCount}</span> ocupadas
              </span>
            </div>
            {reservedCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">{reservedCount}</span> reservadas
                </span>
              </div>
            )}
            <div className="hidden sm:block text-gray-400">|</div>
            <div className="hidden sm:block text-gray-600">
              <span className="font-semibold text-gray-900">{occupiedSeats}</span>/{totalSeats} lugares
            </div>
          </div>
        </div>
      </header>

      {/* Mapa */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <svg
            viewBox={`-20 -20 ${layout.width + 40} ${layout.height + 40}`}
            className="w-full h-auto bg-white rounded-2xl shadow-sm border border-gray-200"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Grid de fundo */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#f3f4f6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x={0} y={0} width={layout.width} height={layout.height} fill="url(#grid)" />

            {/* Borda do salão */}
            <rect
              x={0}
              y={0}
              width={layout.width}
              height={layout.height}
              fill="none"
              stroke="#d1d5db"
              strokeWidth={2}
              rx={12}
            />

            {/* Decorações */}
            {layout.decorations.map((dec) => (
              <DecorationElement key={dec.id} decoration={dec} />
            ))}

            {/* Mesas */}
            {layout.tables.map((table) => {
              const data = tables[table.id];
              if (!data) return null;
              return (
                <TableElement
                  key={table.id}
                  table={table}
                  status={data.status}
                  guestsCount={data.currentOccupancy?.guestsCount ?? 0}
                  onClick={() => setSelectedTableId(table.id)}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Modal */}
      {selectedTable && tables[selectedTable.id] && (
        <TableModal
          table={selectedTable}
          status={tables[selectedTable.id].status}
          currentOccupancy={tables[selectedTable.id].currentOccupancy}
          history={tables[selectedTable.id].history}
          onClose={() => setSelectedTableId(null)}
          onOccupy={(count, notes) => handleOccupy(selectedTable.id, count, notes)}
          onFree={() => handleFree(selectedTable.id)}
          onReserve={(notes) => handleReserve(selectedTable.id, notes)}
        />
      )}
    </div>
  );
}
