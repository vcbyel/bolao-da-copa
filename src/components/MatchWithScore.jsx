import BetButton from "./BetButton";
import ScoreSelector from "./ScoreSelector";

export default function MatchWithScore({ match }) {
  const currentStatus = match?.status || "scheduled";

  const formatData = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatHora = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4 border-2 border-gray-600 hover:border-yellow-400 transition">
      {/* Data e Hora */}
      <div className="text-xs text-gray-300 mb-2 flex gap-2">
        <span>📅 {match.match_date ? formatData(match.match_date) : "--"}</span>

        <span>⏰ {match.match_date ? formatHora(match.match_date) : "--"}</span>
      </div>

      {/* Times */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          {match.home_flag ? (
            <img
              src={match.home_flag}
              alt={match.home_team}
              className="w-6 h-6 rounded"
            />
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">🏆</div>
          )}
          <span className="font-semibold text-white">{match.home_team}</span>
        </div>

        <div className="flex items-center justify-end gap-2 flex-1">
          <span className="font-semibold text-white">{match.away_team}</span>
          {match.away_flag ? (
            <img
              src={match.away_flag}
              alt={match.away_team}
              className="w-6 h-6 rounded"
            />
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">🏆</div>
          )}
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

        {currentStatus === "finished" && (
          <>
            <p className="text-red-500 font-bold">🔒 JOGO ENCERRADO</p>

            <div className="mt-3 bg-green-900/30 border border-green-500 rounded-lg p-3 text-center">
              <p className="text-green-400 font-bold">🏆 Resultado Oficial</p>

              <p className="text-white text-lg md:text-xl font-bold mt-2">
                {match.home_team} {match.home_result}
                {" x "}
                {match.away_result} {match.away_team}
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
