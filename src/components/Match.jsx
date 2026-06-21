import { getMatchStatus } from "../utils/matchStatus";

export default function Match({
  home,
  homeFlag,
  away,
  awayFlag,
  homeScore,
  awayScore,
  match,
}) {
  const status = getMatchStatus(match);

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-2">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">
          <img
            src={homeFlag}
            alt={home}
            className="w-8 h-8 rounded"
          />
          <span className="font-semibold">
            {home}
          </span>
        </div>

        <div className="flex gap-4 items-center">

          {homeScore !== undefined &&
          awayScore !== undefined ? (
            <>
              <span className="placar">
                {homeScore}
              </span>

              <span className="text-gray-400">
                vs
              </span>

              <span className="placar">
                {awayScore}
              </span>
            </>
          ) : (
            <span className="text-gray-400">
              -
            </span>
          )}

        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {away}
          </span>

          <img
            src={awayFlag}
            alt={away}
            className="w-8 h-8 rounded"
          />
        </div>

      </div>

      {/* Status da partida */}

      <div className="mt-3 text-center">

        {status === "scheduled" && (
          <p className="text-yellow-400 font-semibold">
            ⏳ Aguardando início
          </p>
        )}

        {status === "live" && (
          <p className="text-green-500 font-semibold animate-pulse">
            🟢 AO VIVO
          </p>
        )}

        {status === "finished" && (
  <div className="mt-3">
    <p className="text-red-500 font-bold">
      🔒 JOGO ENCERRADO
    </p>

    <div className="mt-3">
      <p className="text-yellow-400 font-bold">
        🏆 Placar Oficial
      </p>

      <p className="text-white text-lg font-bold mt-2">
        {home} {match.homeResult}
        {" x "}
        {match.awayResult} {away}
      </p>
    </div>
  </div>
)}

      </div>

    </div>
  );
}