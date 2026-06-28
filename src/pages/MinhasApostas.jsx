import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { calculatePoints } from "../utils/calculatePoints";
import BetStats from "../components/BetStats";
import BetCard from "../components/BetCard";
import BetTabs from "../components/BetTabs";

export default function MinhasApostas() {
  const { user } = useAuth();

  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("GROUP_1");

  useEffect(() => {
    if (user) {
      loadBets();
    }
  }, [user]);

  async function loadBets() {
    const { data, error } = await supabase
      .from("bets")
      .select(
        `
        *,
        matches(*)
      `,
      )
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    setBets(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-white">Carregando apostas...</div>
    );
  }

  const totalPoints = bets.reduce((total, bet) => {
    const match = bet.matches;

    if (match?.status !== "finished") return total;

    return (
      total +
      calculatePoints(
        bet.home_score,
        bet.away_score,
        match.home_result,
        match.away_result,
      )
    );
  }, 0);
  const totalBets = bets.length;

  const exactBets = bets.filter((bet) => {
    const match = bet.matches;

    if (match.status !== "finished") return false;

    return (
      calculatePoints(
        bet.home_score,
        bet.away_score,
        match.home_result,
        match.away_result,
      ) === 10
    );
  }).length;

  const acertouGanhador = bets.filter((bet) => {
    const match = bet.matches;

    if (match.status !== "finished") return false;

    return (
      calculatePoints(
        bet.home_score,
        bet.away_score,
        match.home_result,
        match.away_result,
      ) === 5
    );
  }).length;

  const errou = bets.filter((bet) => {
    const match = bet.matches;

    if (match.status !== "finished") return false;

    return (
      calculatePoints(
        bet.home_score,
        bet.away_score,
        match.home_result,
        match.away_result,
      ) === 0
    );
  }).length;

  const pendingBets = bets.filter(
    (bet) => bet.matches.status !== "finished",
  ).length;
  const filteredBets = bets.filter((bet) => {

    if (!bet.matches) return false;

    return bet.matches.match_round === activeTab;

});



  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 overflow-x-hidden">
      <h1 className="text-3xl font-bold text-white mb-6">🎯 Minhas Apostas</h1>

      <BetStats
        totalPoints={totalPoints}
        totalBets={totalBets}
        exactBets={exactBets}
        acertouGanhador={acertouGanhador}
        errou={errou}
        pendingBets={pendingBets}
      />
      <BetTabs active={activeTab} setActive={setActiveTab} />

      {/* AQUI ENTRA O NOVO CARD */}
      <div
        className="

flex

gap-6

overflow-x-auto

snap-x

snap-mandatory

pb-4

scroll-smooth

"
      >
        {filteredBets.length === 0 && (

    <div className="bg-slate-800 rounded-xl p-10 text-center">

        <p className="text-slate-400">

            Nenhuma aposta encontrada nesta fase.

        </p>

    </div>

)}
        {filteredBets.map((bet) => (
          <BetCard key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  );
}
