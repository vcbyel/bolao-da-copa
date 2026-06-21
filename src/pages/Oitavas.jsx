import Match from '../components/Match';
import { oitavas } from '../data/fase2';

export default function Oitavas() {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Oitavas de Final</h1>
      <div>
        {oitavas.length > 0 ? (
          oitavas.map((match, index) => (
            <Match
              key={index}
              home={match.home}
              homeFlag={match.homeFlag}
              away={match.away}
              awayFlag={match.awayFlag}
              homeScore={match.homeScore}
              awayScore={match.awayScore}
            />
          ))
        ) : (
          <p>Nenhuma partida disponível</p>
        )}
      </div>
    </div>
  );
}
