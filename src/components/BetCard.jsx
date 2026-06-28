import { calculatePoints } from "../utils/calculatePoints";

export default function BetCard({ bet }) {
  const match = bet.matches;

  const finished = match.status === "finished";

  const points = finished
    ? calculatePoints(
        bet.home_score,
        bet.away_score,
        match.home_result,
        match.away_result,
      )
    : null;

  const borderColor =
    points === 10
      ? "border-green-500"
      : points === 5
        ? "border-yellow-500"
        : finished
          ? "border-red-500"
          : "border-slate-600";

  const shadowColor =
    points === 10
      ? "hover:shadow-green-500/20"
      : points === 5
        ? "hover:shadow-yellow-500/20"
        : "hover:shadow-red-500/20";

  return (
    <div
      className={`
        bg-slate-800
        rounded-3xl
        border-2
        ${borderColor}
        shadow-xl
        ${shadowColor}
        hover:scale-[1.02]
        transition-all
        duration-300
        p-6
        min-w-[340px]
      `}
    >
      {/* HEADER */}

      <div className="flex justify-between items-center mb-5">
        <span
          className={`
            text-xs
            font-bold
            px-3
            py-1
            rounded-full

            ${
              finished
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }
          `}
        >
          {finished ? "FINALIZADO" : "AGENDADO"}
        </span>

        {finished && (
          <span
            className={`
              font-bold
              ${
                points === 10
                  ? "text-green-400"
                  : points === 5
                    ? "text-yellow-400"
                    : "text-red-400"
              }
            `}
          >
            ⭐ +{points}
          </span>
        )}
      </div>

      {/* DATA */}

      <div className="text-center text-sm text-slate-400 mb-5">
        📅 {new Date(match.match_date).toLocaleDateString("pt-BR")}
      </div>

      {/* RESULTADO */}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {match.home_flag && (
              <img src={match.home_flag} className="w-8 h-8 rounded-full" />
            )}

            <span className="font-semibold text-lg">{match.home_team}</span>
          </div>

          {finished && (
            <span className="text-3xl font-bold">{match.home_result}</span>
          )}
        </div>

        <div className="text-center text-slate-500 font-bold">VS</div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {match.away_flag && (
              <img src={match.away_flag} className="w-8 h-8 rounded-full" />
            )}

            <span className="font-semibold text-lg">{match.away_team}</span>
          </div>

          {finished && (
            <span className="text-3xl font-bold">{match.away_result}</span>
          )}
        </div>
      </div>

      {/* APOSTA */}

      <div className="mt-8 border-t border-slate-700 pt-5">
        <p className="text-sm text-slate-400 mb-2">🎯 Minha aposta</p>

        <div className="text-center text-3xl font-bold text-yellow-400">
          {bet.home_score} x {bet.away_score}
        </div>
      </div>

      {/* RODAPÉ */}

      {finished && (
        <div className="mt-6">
          {points === 10 && (
            <div className="bg-green-500/20 rounded-xl p-3 text-center font-bold text-green-400">
              🏆 PLACAR EXATO
            </div>
          )}

          {points === 5 && (
            <div className="bg-yellow-500/20 rounded-xl p-3 text-center font-bold text-yellow-400">
              ⭐ ACERTOU O VENCEDOR
            </div>
          )}

          {points === 0 && (
            <div className="bg-red-500/20 rounded-xl p-3 text-center font-bold text-red-400">
              ❌ NÃO PONTUOU
            </div>
          )}
        </div>
      )}
    </div>
  );
}
