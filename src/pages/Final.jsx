import Match from '../components/Match';
import { final } from '../data/fase2';

export default function Final() {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Final</h1>
      <div>
        {final.length > 0 ? (
          final.map((match, index) => (
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
