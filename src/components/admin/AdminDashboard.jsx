import { FiCheckCircle, FiClock, FiPlay, FiTrendingUp } from "react-icons/fi";

export default function AdminDashboard({ matches, onNavigate }) {
  const total = matches.length;
  const finished = matches.filter((m) => m.status === "finished").length;
  const live = matches.filter((m) => m.status === "live").length;
  const scheduled = matches.filter((m) => m.status === "scheduled").length;
  const pendingMatches = matches.filter((m) => m.status !== "finished");

  const groupMatches = matches.filter((m) => m.stage === "GROUP");
  const knockoutMatches = matches.filter((m) => m.stage !== "GROUP");
  const groupFinished = groupMatches.filter(
    (m) => m.status === "finished"
  ).length;
  const knockoutFinished = knockoutMatches.filter(
    (m) => m.status === "finished"
  ).length;

  const stats = [
    {
      label: "Total de Jogos",
      value: total,
      icon: FiTrendingUp,
      color: "text-blue-400",
      bg: "from-blue-500/20 to-blue-500/5",
      border: "border-blue-500/20",
    },
    {
      label: "Finalizados",
      value: finished,
      icon: FiCheckCircle,
      color: "text-green-400",
      bg: "from-green-500/20 to-green-500/5",
      border: "border-green-500/20",
    },
    {
      label: "Ao Vivo",
      value: live,
      icon: FiPlay,
      color: "text-red-400",
      bg: "from-red-500/20 to-red-500/5",
      border: "border-red-500/20",
    },
    {
      label: "Pendentes",
      value: scheduled,
      icon: FiClock,
      color: "text-yellow-400",
      bg: "from-yellow-500/20 to-yellow-500/5",
      border: "border-yellow-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Visao geral do torneio</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bg} rounded-xl p-5 border ${stat.border}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-slate-800/50`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Progress Section */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Overall Progress */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-white text-sm">
              Progresso Geral
            </h3>
            <span className="text-yellow-400 font-bold text-lg">
              {total > 0 ? Math.round((finished / total) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5 mb-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-green-400 h-2.5 rounded-full transition-all duration-700"
              style={{
                width: `${total > 0 ? (finished / total) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {finished} de {total} partidas finalizadas
          </p>
        </div>

        {/* Phase Breakdown */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
          <h3 className="font-semibold text-white text-sm mb-3">
            Por Fase
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Fase de Grupos</span>
                <span className="text-gray-300">
                  {groupFinished}/{groupMatches.length}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-blue-400 h-1.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${
                      groupMatches.length > 0
                        ? (groupFinished / groupMatches.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Mata-Mata</span>
                <span className="text-gray-300">
                  {knockoutFinished}/{knockoutMatches.length}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-purple-400 h-1.5 rounded-full transition-all duration-700"
                  style={{
                    width: `${
                      knockoutMatches.length > 0
                        ? (knockoutFinished / knockoutMatches.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Matches */}
      {pendingMatches.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
              <FiClock className="text-yellow-400" size={16} />
              Partidas Pendentes
            </h3>
            <button
              onClick={() => onNavigate("matches")}
              className="text-xs text-yellow-400 hover:text-yellow-300 transition font-medium"
            >
              Ver todas
            </button>
          </div>
          <div className="divide-y divide-slate-700/50 max-h-72 overflow-y-auto">
            {pendingMatches.slice(0, 12).map((match) => (
              <div
                key={match.id}
                className="px-5 py-3 flex items-center justify-between hover:bg-slate-700/30 transition cursor-pointer"
                onClick={() => onNavigate("matches")}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    {match.home_flag && (
                      <img
                        src={match.home_flag}
                        alt=""
                        className="w-5 h-5 rounded shrink-0"
                      />
                    )}
                    <span className="text-sm font-medium text-white truncate">
                      {match.home_team || "A definir"}
                    </span>
                  </div>
                  <span className="text-gray-600 text-xs shrink-0">vs</span>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium text-white truncate">
                      {match.away_team || "A definir"}
                    </span>
                    {match.away_flag && (
                      <img
                        src={match.away_flag}
                        alt=""
                        className="w-5 h-5 rounded shrink-0"
                      />
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                    match.status === "live"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-slate-700 text-gray-400"
                  }`}
                >
                  {match.status === "live" ? "AO VIVO" : match.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
