"use client";

import { useState, useCallback, useEffect } from "react";
import { FloorLayout, TableStatus, Occupancy } from "@/types/restaurant";
import type { UserRole } from "@/types/auth";
import TableElement from "./TableElement";
import DecorationElement from "./DecorationElement";
import TableModal from "./TableModal";
import BraseiroLogo from "./BraseiroLogo";
import LogoutButton from "./LogoutButton";
import { createClient } from "@/lib/supabase/client";
import { occupyTable, freeTable, reserveTable, markEating, getTableHistory } from "@/app/actions/tables";

interface TableData {
  status: TableStatus;
  currentOccupancy: Occupancy | null;
  history: Occupancy[];
}

interface FloorMapProps {
  layout: FloorLayout;
  userRole: UserRole;
  userName: string;
  initialTableStates: Array<{
    table_id: string;
    status: string;
    guests_count: number;
    notes: string;
    is_eating: boolean;
    started_at: string;
    updated_at: string;
  }>;
}

function dbRowToTableData(row: { table_id: string; status: string; guests_count: number; notes: string; is_eating?: boolean; started_at: string }): { status: TableStatus; currentOccupancy: Occupancy | null } {
  const status = row.status as TableStatus;
  if (status === "available") {
    return { status, currentOccupancy: null };
  }
  return {
    status,
    currentOccupancy: {
      id: row.table_id,
      tableId: row.table_id,
      guestsCount: row.guests_count,
      startedAt: new Date(row.started_at),
      endedAt: null,
      notes: row.notes || "",
      isEating: row.is_eating ?? false,
    },
  };
}

export default function FloorMap({ layout, userRole, userName, initialTableStates }: FloorMapProps) {
  const [tables, setTables] = useState<Record<string, TableData>>(() => {
    const initial: Record<string, TableData> = {};
    for (const table of layout.tables) {
      initial[table.id] = { status: "available", currentOccupancy: null, history: [] };
    }
    // Aplicar estados do banco
    for (const row of initialTableStates) {
      const { status, currentOccupancy } = dbRowToTableData(row);
      if (initial[row.table_id]) {
        initial[row.table_id] = { ...initial[row.table_id], status, currentOccupancy };
      }
    }
    return initial;
  });

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // Supabase Realtime - escutar mudanças na tabela table_states
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('table_states_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'table_states' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new as { table_id: string; status: string; guests_count: number; notes: string; started_at: string };
            const { status, currentOccupancy } = dbRowToTableData(row);
            setTables((prev) => ({
              ...prev,
              [row.table_id]: {
                ...prev[row.table_id],
                status,
                currentOccupancy,
              },
            }));
          } else if (payload.eventType === 'DELETE') {
            const row = payload.old as { table_id: string };
            setTables((prev) => ({
              ...prev,
              [row.table_id]: {
                ...prev[row.table_id],
                status: "available",
                currentOccupancy: null,
              },
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleOccupy = useCallback(
    async (tableId: string, guestsCount: number, notes: string) => {
      setLoadingAction(true);
      // Atualização otimista
      setTables((prev) => ({
        ...prev,
        [tableId]: {
          ...prev[tableId],
          status: "occupied",
          currentOccupancy: {
            id: tableId,
            tableId,
            guestsCount,
            startedAt: new Date(),
            endedAt: null,
            notes,
            isEating: false,
          },
        },
      }));
      setSelectedTableId(null);
      await occupyTable(tableId, guestsCount, notes);
      setLoadingAction(false);
    },
    []
  );

  const handleFree = useCallback(async (tableId: string) => {
    setLoadingAction(true);
    // Atualização otimista
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
    await freeTable(tableId);
    setLoadingAction(false);
  }, []);

  const handleReserve = useCallback(async (tableId: string, notes: string) => {
    setLoadingAction(true);
    // Atualização otimista
    setTables((prev) => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        status: "reserved",
        currentOccupancy: {
          id: tableId,
          tableId,
          guestsCount: 0,
          startedAt: new Date(),
          endedAt: null,
          notes: notes || "Reservada",
          isEating: false,
        },
      },
    }));
    setSelectedTableId(null);
    await reserveTable(tableId, notes);
    setLoadingAction(false);
  }, []);

  const handleMarkEating = useCallback(async (tableId: string) => {
    setLoadingAction(true);
    // Atualização otimista
    setTables((prev) => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        currentOccupancy: prev[tableId].currentOccupancy
          ? { ...prev[tableId].currentOccupancy!, isEating: true }
          : null,
      },
    }));
    setSelectedTableId(null);
    await markEating(tableId);
    setLoadingAction(false);
  }, []);

  // Carregar histórico quando abrir modal
  const handleOpenModal = useCallback(async (tableId: string) => {
    setSelectedTableId(tableId);
    const historyData = await getTableHistory(tableId);
    const history: Occupancy[] = historyData.map((row: { id: string; table_id: string; guests_count: number; notes: string; started_at: string; ended_at: string | null; is_eating?: boolean }) => ({
      id: row.id,
      tableId: row.table_id,
      guestsCount: row.guests_count,
      startedAt: new Date(row.started_at),
      endedAt: row.ended_at ? new Date(row.ended_at) : null,
      notes: row.notes || "",
      isEating: row.is_eating ?? false,
    }));
    setTables((prev) => ({
      ...prev,
      [tableId]: { ...prev[tableId], history },
    }));
  }, []);

  const selectedTable = selectedTableId
    ? layout.tables.find((t) => t.id === selectedTableId)
    : null;

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
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-2 flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <BraseiroLogo />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              {userName}
            </span>
            {userRole === "gerente" && (
              <a
                href="/admin"
                className="text-sm text-red-400 hover:text-red-300 transition"
              >
                Admin
              </a>
            )}
            <LogoutButton />
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-gray-400">
                <span className="font-semibold text-white">{availableCount}</span> livres
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-gray-400">
                <span className="font-semibold text-white">{occupiedCount}</span> ocupadas
              </span>
            </div>
            {reservedCount > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-gray-400">
                  <span className="font-semibold text-white">{reservedCount}</span> reservadas
                </span>
              </div>
            )}
            <div className="hidden sm:block text-gray-600">|</div>
            <div className="hidden sm:block text-gray-400">
              <span className="font-semibold text-white">{occupiedSeats}</span>/{totalSeats} lugares
            </div>
          </div>
        </div>
      </header>

      {/* Mapa */}
      <div className="flex-1 overflow-auto bg-stone-200 p-4">
        <div className="max-w-7xl mx-auto">
          <svg
            viewBox={`-20 -20 ${layout.width + 40} ${layout.height + 40}`}
            className="w-full h-auto bg-[#f5f0e8] shadow-lg"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Defs: grid, shadows */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#ddd5c8" strokeWidth="0.7" />
              </pattern>
              <filter id="element-shadow" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#00000018" />
              </filter>
              <filter id="table-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#00000020" />
              </filter>
            </defs>

            {/* Fundo */}
            <rect x={0} y={0} width={layout.width} height={layout.height} fill="#f5f0e8" />
            <rect x={0} y={0} width={layout.width} height={layout.height} fill="url(#grid)" />

            {/* Contorno preto com vão na entrada */}
            {(() => {
              const entrance = layout.decorations.find(d => d.type === "entrance");
              const W = layout.width;
              const H = layout.height;
              if (!entrance) {
                return <rect x={0} y={0} width={W} height={H} fill="none" stroke="#1a1a1a" strokeWidth={6} />;
              }
              const blockH = Math.round(entrance.height * 0.25);
              const gapTop = entrance.y + blockH;
              const gapBottom = entrance.y + entrance.height - blockH;
              // Path: contorno completo exceto o vão da entrada (lado direito)
              const d = `M ${W} ${gapTop} L ${W} 0 L 0 0 L 0 ${H} L ${W} ${H} L ${W} ${gapBottom}`;
              return (
                <path
                  d={d}
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth={6}
                  strokeLinecap="square"
                />
              );
            })()}

            {/* Decorações */}
            {layout.decorations.map((dec) => (
              <DecorationElement key={dec.id} decoration={dec} />
            ))}

            {/* Mesas */}
            {layout.tables.map((table) => {
              const data = tables[table.id] ?? { status: "available" as const, currentOccupancy: null, history: [] };
              return (
                <TableElement
                  key={table.id}
                  table={table}
                  status={data.status}
                  guestsCount={data.currentOccupancy?.guestsCount ?? 0}
                  isEating={data.currentOccupancy?.isEating ?? false}
                  onClick={() => handleOpenModal(table.id)}
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
          onMarkEating={() => handleMarkEating(selectedTable.id)}
          loading={loadingAction}
        />
      )}
    </div>
  );
}
