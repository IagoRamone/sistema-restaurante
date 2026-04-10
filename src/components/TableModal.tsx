"use client";

import { RestaurantTable, TableStatus, Occupancy } from "@/types/restaurant";
import { useState } from "react";

interface TableModalProps {
  table: RestaurantTable;
  status: TableStatus;
  currentOccupancy: Occupancy | null;
  history: Occupancy[];
  onClose: () => void;
  onOccupy: (guestsCount: number, notes: string) => void;
  onFree: () => void;
  onReserve: (notes: string) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(start: Date, end: Date | null): string {
  const now = end || new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / 1000 / 60);
  if (diff < 60) return `${diff}min`;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${hours}h${mins > 0 ? ` ${mins}min` : ""}`;
}

export default function TableModal({
  table,
  status,
  currentOccupancy,
  history,
  onClose,
  onOccupy,
  onFree,
  onReserve,
}: TableModalProps) {
  const [guestsCount, setGuestsCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [view, setView] = useState<"actions" | "occupy" | "reserve" | "history">("actions");

  const statusLabels: Record<TableStatus, string> = {
    available: "Disponível",
    occupied: "Ocupada",
    reserved: "Reservada",
  };

  const statusBadgeColors: Record<TableStatus, string> = {
    available: "bg-green-200 text-green-900",
    occupied:  "bg-red-200 text-red-900",
    reserved:  "bg-amber-200 text-amber-900",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">
              Mesa {table.label}
            </h2>
            <p className="text-sm text-gray-400">{table.seats} lugares</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadgeColors[status]}`}
            >
              {statusLabels[status]}
            </span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 text-2xl leading-none"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Ocupação atual */}
        {currentOccupancy && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-red-700 font-medium">
                {currentOccupancy.guestsCount} pessoa{currentOccupancy.guestsCount > 1 ? "s" : ""} desde{" "}
                {formatTime(currentOccupancy.startedAt)}
              </span>
              <span className="text-red-600 font-bold">
                {formatDuration(currentOccupancy.startedAt, null)}
              </span>
            </div>
            {currentOccupancy.notes && (
              <p className="text-xs text-red-600 mt-1">{currentOccupancy.notes}</p>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">
          {view === "actions" && (
            <div className="space-y-3">
              {status === "available" && (
                <>
                  <button
                    onClick={() => setView("occupy")}
                    className="w-full py-3.5 bg-red-500 text-white rounded-xl font-semibold text-lg hover:bg-red-600 active:bg-red-700 transition-colors"
                  >
                    Ocupar Mesa
                  </button>
                  <button
                    onClick={() => setView("reserve")}
                    className="w-full py-3.5 bg-yellow-500 text-white rounded-xl font-semibold text-lg hover:bg-yellow-600 active:bg-yellow-700 transition-colors"
                  >
                    Reservar Mesa
                  </button>
                </>
              )}
              {status === "occupied" && (
                <button
                  onClick={onFree}
                  className="w-full py-3.5 bg-green-500 text-white rounded-xl font-semibold text-lg hover:bg-green-600 active:bg-green-700 transition-colors"
                >
                  Liberar Mesa
                </button>
              )}
              {status === "reserved" && (
                <>
                  <button
                    onClick={() => setView("occupy")}
                    className="w-full py-3.5 bg-red-500 text-white rounded-xl font-semibold text-lg hover:bg-red-600 active:bg-red-700 transition-colors"
                  >
                    Clientes Chegaram
                  </button>
                  <button
                    onClick={onFree}
                    className="w-full py-3.5 bg-green-500 text-white rounded-xl font-semibold text-lg hover:bg-green-600 active:bg-green-700 transition-colors"
                  >
                    Cancelar Reserva
                  </button>
                </>
              )}
              {history.length > 0 && (
                <button
                  onClick={() => setView("history")}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Ver Histórico ({history.length})
                </button>
              )}
            </div>
          )}

          {view === "occupy" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade de pessoas
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuestsCount(Math.max(1, guestsCount - 1))}
                    className="w-12 h-12 rounded-xl bg-gray-100 text-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold text-gray-900 w-16 text-center">
                    {guestsCount}
                  </span>
                  <button
                    onClick={() => setGuestsCount(Math.min(table.seats, guestsCount + 1))}
                    className="w-12 h-12 rounded-xl bg-gray-100 text-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-400 ml-2">
                    máx {table.seats}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: aniversário, criança, cadeirante..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setView("actions")}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => onOccupy(guestsCount, notes)}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 active:bg-red-700 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}

          {view === "reserve" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações da reserva
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: nome do cliente, horário..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setView("actions")}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => onReserve(notes)}
                  className="flex-1 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 active:bg-yellow-700 transition-colors"
                >
                  Reservar
                </button>
              </div>
            </div>
          )}

          {view === "history" && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Histórico de hoje
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {history
                  .slice()
                  .reverse()
                  .map((occ) => (
                    <div
                      key={occ.id}
                      className="p-3 bg-gray-100 rounded-lg text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          {occ.guestsCount} pessoa{occ.guestsCount > 1 ? "s" : ""}
                        </span>
                        <span className="text-gray-500">
                          {formatTime(occ.startedAt)} — {occ.endedAt ? formatTime(occ.endedAt) : "..."}
                        </span>
                      </div>
                      <div className="text-gray-400 text-xs mt-0.5">
                        Duração: {formatDuration(occ.startedAt, occ.endedAt)}
                        {occ.notes ? ` • ${occ.notes}` : ""}
                      </div>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => setView("actions")}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
