import { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import AdminMatchCard from "./AdminMatchCard";

const STAGES = [
  { id: "ALL", label: "Todos" },
  { id: "GROUP", label: "Grupos" },
  { id: "R16", label: "16 Avos" },
  { id: "R8", label: "Oitavas" },
  { id: "QF", label: "Quartas" },
  { id: "SF", label: "Semi" },
  { id: "FINAL", label: "Final" },
];

const STATUSES = [
  { id: "all", label: "Todos", dot: "bg-gray-400" },
  { id: "scheduled", label: "Agendados", dot: "bg-yellow-400" },
  { id: "live", label: "Ao Vivo", dot: "bg-red-400" },
  { id: "finished", label: "Finalizados", dot: "bg-green-400" },
];

export default function AdminMatches({ matches, onUpdate, onSave }) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = matches.filter((match) => {
    const matchSearch =
      (match.home_team || "").toLowerCase().includes(search.toLowerCase()) ||
      (match.away_team || "").toLowerCase().includes(search.toLowerCase()) ||
      match.id.toLowerCase().includes(search.toLowerCase());

    const matchStage = stageFilter === "ALL" || match.stage === stageFilter;
    const matchStatus = statusFilter === "all" || match.status === statusFilter;

    return matchSearch && matchStage && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold text-white">Partidas</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie resultados e status das partidas
          </p>
        </div>
        <span className="text-sm text-gray-500 bg-slate-800 px-3 py-1 rounded-full">
          {filtered.length} resultado(s)
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          size={16}
        />
        <input
          type="text"
          placeholder="Buscar por time ou ID da partida..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800/50 text-white pl-11 pr-4 py-3 rounded-xl border border-slate-700/50 focus:border-yellow-400/50 focus:outline-none transition text-sm placeholder-gray-500"
        />
      </div>

      {/* Filters */}
      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 space-y-3">
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
          <FiFilter size={12} />
          <span>Filtros</span>
        </div>

        {/* Stage filter */}
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setStageFilter(stage.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                stageFilter === stage.id
                  ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                  : "bg-slate-800/80 text-gray-400 border border-slate-700/50 hover:border-slate-600"
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((status) => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                statusFilter === status.id
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                  : "bg-slate-800/80 text-gray-400 border border-slate-700/50 hover:border-slate-600"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Match Cards */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((match) => (
            <AdminMatchCard
              key={match.id}
              match={match}
              onUpdate={onUpdate}
              onSave={onSave}
            />
          ))
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg mb-1">Nenhuma partida encontrada</p>
            <p className="text-sm">Tente ajustar os filtros ou a busca</p>
          </div>
        )}
      </div>
    </div>
  );
}
