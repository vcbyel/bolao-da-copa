import { useState } from "react";
import { FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import { generateGroupStandings } from "../../utils/generateGroupStandings";
import { getQualifiedTeams } from "../../utils/getQualifiedTeams";
import { updateRoundOf32 } from "../../utils/updateRoundOf32";

export default function AdminBracket({ matches, onReload }) {
  const [loading, setLoading] = useState(false);

  const groupMatches = matches.filter((m) => m.stage === "GROUP");
  const finishedGroups = groupMatches.filter(
    (m) => m.status === "finished"
  ).length;
  const allGroupsFinished =
    groupMatches.length > 0 && finishedGroups === groupMatches.length;

  async function handleUpdateBracket() {
    const confirm = window.confirm(
      "Tem certeza que deseja recalcular e atualizar o chaveamento do mata-mata?"
    );
    if (!confirm) return;

    setLoading(true);
    try {
      const standings = generateGroupStandings(matches);
      const qualified = getQualifiedTeams(standings);
      await updateRoundOf32(qualified);
      await onReload();
      alert("Chaveamento atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar chaveamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Chaveamento</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Atualize o mata-mata com base na classificacao dos grupos
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
        <h3 className="font-semibold text-white text-sm mb-3">
          Status da Fase de Grupos
        </h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                allGroupsFinished ? "bg-green-400" : "bg-yellow-400"
              }`}
              style={{
                width: `${
                  groupMatches.length > 0
                    ? (finishedGroups / groupMatches.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-400 shrink-0">
            {finishedGroups}/{groupMatches.length}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {allGroupsFinished
            ? "Todas as partidas da fase de grupos foram finalizadas."
            : "Ainda existem partidas pendentes na fase de grupos."}
        </p>
      </div>

      {/* Warning if groups not finished */}
      {!allGroupsFinished && groupMatches.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
          <FiAlertTriangle
            className="text-yellow-400 shrink-0 mt-0.5"
            size={18}
          />
          <div className="text-sm text-yellow-300">
            <p className="font-medium mb-1">Atencao</p>
            <p className="text-yellow-400/80">
              A fase de grupos ainda nao foi concluida. O chaveamento pode ficar
              incompleto se voce atualizar agora.
            </p>
          </div>
        </div>
      )}

      {/* Action Card */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-xl shrink-0">
            <FiRefreshCw size={24} className="text-yellow-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">
              Atualizar Mata-Mata (16 Avos)
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Recalcula a classificacao dos grupos e preenche automaticamente os
              confrontos dos 16 avos de final com os times classificados (1o, 2o
              e melhores 3o colocados).
            </p>
            <button
              onClick={handleUpdateBracket}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              {loading ? "Atualizando..." : "Recalcular Chaveamento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
