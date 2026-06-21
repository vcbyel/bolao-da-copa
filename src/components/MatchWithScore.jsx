import { useBets } from "../contexts/BetContext";
import BetButton from "./BetButton";
import ScoreSelector from "./ScoreSelector";

import { useMatches } from "../hooks/useMatches";

export default function MatchWithScore({ match }) {
  const { getBet } = useBets();
  const bet = getBet(match.id);
  
  const { matches } = useMatches();

  const dbMatch = matches.find((m) => m.id === match.id);
  const currentStatus = dbMatch?.status || "scheduled";
  // Formatar data
  const formatData = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}`;
  };
  console.log(match.id, dbMatch);
  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4 border-2 border-gray-600 hover:border-yellow-400 transition">
      {/* Data e Hora */}
      <div className="text-xs text-gray-300 mb-2 flex gap-2">
        <span>📅 {formatData(match.data)}</span>
        <span>⏰ {match.hora}</span>
      </div>

      {/* Times */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          <img
            src={match.homeFlag}
            alt={match.home}
            className="w-6 h-6 rounded"
          />
          <span className="font-semibold text-white">{match.home}</span>
        </div>

        <div className="flex-1 text-right pr-2">
          <span className="font-semibold text-white">{match.away}</span>
          <img
            src={match.awayFlag}
            alt={match.away}
            className="w-6 h-6 rounded inline-block ml-2"
          />
        </div>
      </div>
      {/* Status da Partida */}
      <div className="text-center mb-3">
        {currentStatus === "scheduled" && (
          <p className="text-yellow-400 font-semibold">⏳ Aguardando início</p>
        )}

        {currentStatus === "live" && (
          <p className="text-green-500 font-semibold animate-pulse">
            🟢 AO VIVO
          </p>
        )}

        {dbMatch?.status === "finished" && (
          <>
            <p className="text-red-500 font-bold">🔒 JOGO ENCERRADO</p>

            <div className="mt-3 bg-green-900/30 border border-green-500 rounded-lg p-3 text-center">
              <p className="text-green-400 font-bold">🏆 Resultado Oficial</p>

              <p className="text-white text-lg md:text-xl font-bold mt-2">
                {match.home} {dbMatch.home_result}
                {" x "}
                {dbMatch.away_result} {match.away}
              </p>
            </div>
          </>
        )}
      </div>
      {/* Seletor de Placar */}
      <ScoreSelector matchId={match.id} matchData={match} />

      {/* Botão Apostar */}
      <BetButton matchId={match.id} matchData={match} />
    </div>
  );
}
