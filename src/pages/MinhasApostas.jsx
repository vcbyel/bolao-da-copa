import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { calculatePoints } from "../utils/calculatePoints";

export default function MinhasApostas() {
  const { user } = useAuth();

  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBets();
    }
  }, [user]);

  async function loadBets() {
    const { data, error } = await supabase
      .from("bets")
      .select(`
        *,
        matches(*)
      `)
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
      <div className="p-6 text-center text-white">
        Carregando apostas...
      </div>
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
        match.away_result
      )
    );
  }, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-white mb-6">
        🎯 Minhas Apostas
      </h1>

      <div className="bg-slate-800 rounded-xl p-4 mb-6">
        <p className="text-yellow-400 text-xl font-bold">
          🏆 Total de Pontos: {totalPoints}
        </p>
      </div>

      <div className="space-y-4">
        {bets.map((bet) => {
          const match = bet.matches;

          const points =
            match?.status === "finished"
              ? calculatePoints(
                  bet.home_score,
                  bet.away_score,
                  match.home_result,
                  match.away_result
                )
              : null;

          return (
            <div
              key={bet.id}
              className="bg-slate-800 rounded-xl p-4"
            >
              <div className="flex justify-between items-center flex-wrap gap-4">

                <div>
                  <h2 className="text-white font-bold text-lg">
                    {match.home_team} x {match.away_team}
                  </h2>

                  <p className="text-slate-400">
                    Minha aposta:
                    {" "}
                    <span className="text-yellow-400 font-bold">
                      {bet.home_score} x {bet.away_score}
                    </span>
                  </p>
                </div>

                <div className="text-right">

                  {match.status === "finished" ? (
                    <>
                      <p className="text-green-400 font-bold">
                        Resultado Oficial
                      </p>

                      <p className="text-white text-xl">
                        {match.home_result} x {match.away_result}
                      </p>

                      <p className="text-yellow-400 font-bold mt-2">
                        ⭐ {points} pontos
                      </p>
                    </>
                  ) : (
                    <p className="text-yellow-400">
                      ⏳ Aguardando resultado
                    </p>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}