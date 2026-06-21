import { FiCheck } from 'react-icons/fi';
import { useBets } from '../contexts/BetContext';
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function BetButton({ matchId, matchData }) {
  const { user } = useAuth();
  const { getBet, confirmBet } = useBets();

  const bet = getBet(matchId);

  const isBetPlaced =
    bet?.home !== null &&
    bet?.home !== undefined &&
    bet?.away !== null &&
    bet?.away !== undefined;

  const isLocked = bet?.confirmed;

  const handleBet = async () => {
    if (!isBetPlaced) {
      alert("Selecione um placar antes de apostar!");
      return;
    }

    if (isLocked) {
      alert("Você já registrou sua aposta para esta partida!");
      return;
    }

    const confirmation = window.confirm(
      `Confirmar aposta: ${matchData.home} ${bet.home} x ${bet.away} ${matchData.away}?`
    );

    if (!confirmation) return;

    const { error } = await supabase
      .from("bets")
      .insert({
        user_id: user.id,
        match_id: matchId,
        home_score: bet.home,
        away_score: bet.away,
        confirmed: true,
      });

    if (error) {
  console.error(error);
  alert(error.message);
  return;
}

    // trava a aposta localmente
    confirmBet(matchId);

    alert("✅ Aposta salva no banco!");
  }; // <-- FECHAMENTO DA FUNÇÃO

  return (
    <button
      onClick={handleBet}
      disabled={!isBetPlaced || isLocked}
      className={`w-full py-2 px-4 rounded font-semibold flex items-center justify-center gap-2 transition ${
        isLocked
          ? "bg-blue-600 text-white cursor-not-allowed"
          : isBetPlaced
          ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          : "bg-gray-500 text-gray-300 cursor-not-allowed"
      }`}
    >
      <FiCheck size={20} />
      {isLocked ? "Aposta Registrada" : "Apostar"}
    </button>
  );
}