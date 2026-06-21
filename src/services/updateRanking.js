import { supabase } from "../lib/supabase";
import { calculatePoints } from "../utils/calculatePoints";

export async function updateRanking() {
  

  const { data: bets, error: betsError } = await supabase
    .from("bets")
    .select("*");

  if (betsError) {
    console.error(betsError);
    return;
  }

  const { data: matches, error: matchesError } = await supabase
    .from("matches")
    .select("*")
    .eq("status", "finished");

    console.log("BETS:", bets);
  console.log("MATCHES:", matches);

  if (matchesError) {
    console.error(matchesError);
    return;
  }

  const userPoints = {};

  bets.forEach((bet) => {
  const match = matches.find(
    (m) => m.id === bet.match_id
  );

  console.log("=========");
  console.log("BET:", bet);
  console.log("MATCH ENCONTRADA:", match);

  if (!match) {
    console.log("❌ Não encontrou partida:", bet.match_id);
    return;
  }

  const points = calculatePoints(
    bet.home_score,
    bet.away_score,
    match.home_result,
    match.away_result
  );

  console.log("✅ Pontos calculados:", points);

  userPoints[bet.user_id] =
    (userPoints[bet.user_id] || 0) + points;
});

console.log("PONTOS FINAIS:");

  for (const userId in userPoints) {
      console.log(userId, userPoints[userId]);
    const { error } = await supabase
      .from("profiles")
      .update({
        points: userPoints[userId],
      })
      .eq("id", userId);

    if (error) {
      console.error(error);
    }
  }

  console.log("🏆 Ranking atualizado!");
}
