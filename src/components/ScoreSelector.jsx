import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useBets } from "../contexts/BetContext";
import { getMatchStatus } from "../utils/matchStatus";

export default function ScoreSelector({ matchId, matchData }) {
  const { updateBet, getBet } = useBets();

  const bet = getBet(matchId);

  const status = getMatchStatus(matchData);

  const isLocked = bet?.confirmed ||
  status === "live" ||
  status === "finished";

  const homeScore = bet?.home ?? 0;
  const awayScore = bet?.away ?? 0;
  
 

  const handleIncrement = (type) => {
    if (isLocked) return;
    if (type === "home") {
      updateBet(matchId, Math.min(homeScore + 1, 9), awayScore);
    } else {
      updateBet(matchId, homeScore, Math.min(awayScore + 1, 9));
    }
  };

  const handleDecrement = (type) => {
    if (isLocked) return;
    if (type === "home") {
      updateBet(matchId, Math.max(homeScore - 1, 0), awayScore);
    } else {
      updateBet(matchId, homeScore, Math.max(awayScore - 1, 0));
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 my-3">
      {/* Home Score */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => handleIncrement("home")}
          disabled={isLocked}
          className={`p-1 transition ${
            isLocked
              ? "text-gray-500 cursor-not-allowed"
              : "hover:text-yellow-400"
          }`}
          title="Aumentar"
        >
          <FiChevronUp size={24} />
        </button>
        <input
          disabled={isLocked}
          type="number"
          value={homeScore}
          onChange={(e) => {
            const val = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 9);
            updateBet(matchId, val, awayScore);
          }}
          className={`w-14 h-12 text-center text-2xl font-bold rounded border-2 ${
            isLocked
              ? "bg-gray-800 text-gray-400 border-gray-600 cursor-not-allowed"
              : "bg-gray-600 text-white border-yellow-400"
          }`}
        />
        <button
          onClick={() => handleDecrement("home")}
          disabled={isLocked}
          className={`p-1 transition ${
            isLocked
              ? "text-gray-500 cursor-not-allowed"
              : "hover:text-yellow-400"
          }`}
        >
          <FiChevronDown size={24} />
        </button>
      </div>

      {/* VS */}
      <div className="text-xl font-bold text-yellow-400">vs</div>

      {/* Away Score */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => handleIncrement("away")}
          disabled={isLocked}
          className={`p-1 transition ${
            isLocked
              ? "text-gray-500 cursor-not-allowed"
              : "hover:text-yellow-400"
          }`}
          title="Aumentar"
        >
          <FiChevronUp size={24} />
        </button>
        <input
          disabled={isLocked}
          type="number"
          value={awayScore}
          onChange={(e) => {
            const val = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 9);
            updateBet(matchId, homeScore, val);
          }}
          className={`w-14 h-12 text-center text-2xl font-bold rounded border-2 ${
            isLocked
              ? "bg-gray-800 text-gray-400 border-gray-600 cursor-not-allowed"
              : "bg-gray-600 text-white border-yellow-400"
          }`}
        />
        <button
          onClick={() => handleDecrement("away")}
          disabled={isLocked}
          className={`p-1 transition ${
            isLocked
              ? "text-gray-500 cursor-not-allowed"
              : "hover:text-yellow-400"
          }`}
        >
          <FiChevronDown size={24} />
        </button>
      </div>
    </div>
  );
}
