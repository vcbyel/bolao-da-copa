import MatchWithScore from "./MatchWithScore";

export default function GroupCard({ grupo }) {
  console.log("GRUPO RECEBIDO:", grupo);
  return (
    <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700 hover:border-yellow-400 transition shadow-lg">
      {/* Header do Grupo */}
      <div className="mb-4 pb-3 border-b-2 border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-2">{grupo.nome}</h2>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {grupo.times && (
            <div className="grid grid-cols-2 gap-1 text-xs">
              {grupo.times.map((time) => (
                <div key={time.id}>{time.nome}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Partidas */}
      <div className="space-y-0.5">
        {grupo.partidas && grupo.partidas.length > 0 ? (
          grupo.partidas.map((match) => (
            <MatchWithScore key={match.id} match={match} />
          ))
        ) : (
          <div className="text-center text-gray-400 py-6 text-sm">
            Sem partidas disponíveis
          </div>
        )}
      </div>
    </div>
  );
}
