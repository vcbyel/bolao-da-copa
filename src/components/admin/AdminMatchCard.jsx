import { FiSave } from "react-icons/fi";

const STAGE_LABELS = {
  GROUP: "Fase de Grupos",
  R16: "16 Avos",
  R8: "Oitavas",
  QF: "Quartas",
  SF: "Semi Final",
  FINAL: "Final",
};

const STATUS_CONFIG = {
  scheduled: {
    label: "Agendado",
    badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  },
  live: {
    label: "Ao Vivo",
    badge: "bg-red-500/15 text-red-400 border-red-500/20",
    pulse: true,
  },
  finished: {
    label: "Finalizado",
    badge: "bg-green-500/15 text-green-400 border-green-500/20",
  },
};

export default function AdminMatchCard({ match, onUpdate, onSave }) {
  const config = STATUS_CONFIG[match.status] || STATUS_CONFIG.scheduled;

  return (
    <div
      id={match.id}
      className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition group"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/30 border-b border-slate-700/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">{match.id}</span>
          <span className="text-gray-700">|</span>
          <span className="text-xs text-gray-400">
            {STAGE_LABELS[match.stage] || match.stage}
          </span>
        </div>
        <span
          className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${config.badge} ${
            config.pulse ? "animate-pulse" : ""
          }`}
        >
          {config.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Teams row */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="font-semibold text-white text-sm text-right truncate">
              {match.home_team || "A definir"}
            </span>
            {match.home_flag ? (
              <img
                src={match.home_flag}
                alt=""
                className="w-7 h-7 rounded shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded bg-slate-700 flex items-center justify-center text-xs text-gray-500 shrink-0">
                ?
              </div>
            )}
          </div>

          <span className="text-gray-600 font-bold text-xs shrink-0">VS</span>

          <div className="flex items-center gap-2 flex-1">
            {match.away_flag ? (
              <img
                src={match.away_flag}
                alt=""
                className="w-7 h-7 rounded shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded bg-slate-700 flex items-center justify-center text-xs text-gray-500 shrink-0">
                ?
              </div>
            )}
            <span className="font-semibold text-white text-sm truncate">
              {match.away_team || "A definir"}
            </span>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Score inputs */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="20"
              value={match.home_result ?? ""}
              onChange={(e) =>
                onUpdate(match.id, "home_result", Number(e.target.value))
              }
              placeholder="-"
              className="w-14 bg-slate-700/80 text-white text-center p-2 rounded-lg border border-slate-600 focus:border-yellow-400 focus:outline-none transition text-sm font-bold"
            />
            <span className="text-gray-600 font-bold">x</span>
            <input
              type="number"
              min="0"
              max="20"
              value={match.away_result ?? ""}
              onChange={(e) =>
                onUpdate(match.id, "away_result", Number(e.target.value))
              }
              placeholder="-"
              className="w-14 bg-slate-700/80 text-white text-center p-2 rounded-lg border border-slate-600 focus:border-yellow-400 focus:outline-none transition text-sm font-bold"
            />
          </div>

          {/* Status select */}
          <select
            value={match.status}
            onChange={(e) => onUpdate(match.id, "status", e.target.value)}
            className="bg-slate-700/80 text-white p-2 rounded-lg border border-slate-600 focus:border-yellow-400 focus:outline-none transition text-sm flex-1 min-w-[120px]"
          >
            <option value="scheduled">Agendado</option>
            <option value="live">Ao Vivo</option>
            <option value="finished">Finalizado</option>
          </select>

          {/* Save button */}
          <button
            onClick={() => onSave(match)}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1.5 transition whitespace-nowrap"
          >
            <FiSave size={14} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
