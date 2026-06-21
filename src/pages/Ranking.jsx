
import { useAuth } from "../contexts/AuthContext";
import { useRanking } from "../contexts/RankingContext";

export default function Ranking() {
console.log("RANKING RENDERIZOU");

  const { ranking } = useRanking();
  console.log("RANKING:", ranking);
  const top3 = ranking.slice(0, 3);
  const { user } = useAuth();

const myPosition =

  ranking.findIndex((p) => p.id === user?.id) + 1;

  

  
console.log("RANKING STATE:", ranking);
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">🏆 Ranking Geral</h1>
      {myPosition > 0 && (
        <div className="bg-yellow-500 text-black font-bold rounded-xl p-4 mb-6 shadow-lg">
          🏆 Sua posição atual: #{myPosition}
        </div>
      )}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8 items-end">
          {/* Segundo Lugar */}
          <div className="bg-slate-800 rounded-2xl p-4 text-center h-44 flex flex-col justify-center">
            <div className="text-4xl mb-2">🥈</div>

            <img
              src={top3[1].avatar_url}
              alt={top3[1].name}
              className="w-16 h-16 rounded-full mx-auto border-4 border-slate-400"
            />

            <h3 className="text-white font-bold mt-2">{top3[1].name}</h3>

            <p className="text-yellow-400">{top3[1].points} pts</p>
          </div>

          {/* Primeiro Lugar */}
          <div className="bg-yellow-500 rounded-2xl p-4 text-center h-56 flex flex-col justify-center shadow-xl scale-105">
            <div className="text-5xl mb-2">🥇</div>

            <img
              src={top3[0].avatar_url}
              alt={top3[0].name}
              className="w-20 h-20 rounded-full mx-auto border-4 border-white"
            />

            <h3 className="text-white font-bold text-lg mt-2">
              {top3[0].name}
            </h3>

            <p className="text-white font-bold">{top3[0].points} pts</p>
          </div>

          {/* Terceiro Lugar */}
          <div className="bg-slate-800 rounded-2xl p-4 text-center h-36 flex flex-col justify-center">
            <div className="text-4xl mb-2">🥉</div>

            <img
              src={top3[2].avatar_url}
              alt={top3[2].name}
              className="w-16 h-16 rounded-full mx-auto border-4 border-amber-700"
            />

            <h3 className="text-white font-bold mt-2">{top3[2].name}</h3>

            <p className="text-yellow-400">{top3[2].points} pts</p>
          </div>
        </div>
      )}
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        {ranking.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-4 border-b border-slate-700 transition ${
              player.id === user?.id
                ? "bg-yellow-500/20 border-yellow-500"
                : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-yellow-400 w-8">
                {index === 0 && "🥇"}
                {index === 1 && "🥈"}
                {index === 2 && "🥉"}
                {index > 2 && `#${index + 1}`}
              </span>

              <img
                src={player.avatar_url}
                alt={player.name}
                className="w-12 h-12 rounded-full"
              />

              <div>
                <p className="font-semibold text-white">{player.name}</p>

                <p className="text-slate-400 text-sm">{player.email}</p>
              </div>
            </div>

            <div className="text-yellow-400 font-bold text-xl">
              {player.points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
