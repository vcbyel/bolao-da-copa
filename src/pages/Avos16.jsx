import Match from '../components/Match';
import { avos16 } from '../data/fase2';

export default function Avos16() {
  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">16 avos de Final</h1>
      <div>
        {avos16.length > 0 ? (
          avos16.map((match, index) => (
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
