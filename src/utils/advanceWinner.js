import { supabase } from "../lib/supabase";

export async function advanceWinner(matchId) {
  const { data: match, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (error || !match) return;

  if (match.status !== "finished") return;

  if (!match.winner_to) return;

  let winner = null;
  let winnerFlag = null;

  if (match.home_result > match.away_result) {
    winner = match.home_team;
    winnerFlag = match.home_flag;
  }

  if (match.away_result > match.home_result) {
    winner = match.away_team;
    winnerFlag = match.away_flag;
  }

  if (!winner) {
    console.log("Empate detectado.");
    return;
  }

  const updateData =
    match.winner_slot === "home"
      ? {
          home_team: winner,
          home_flag: winnerFlag,
        }
      : {
          away_team: winner,
          away_flag: winnerFlag,
        };

  const { error: updateError } = await supabase
    .from("matches")
    .update(updateData)
    .eq("id", match.winner_to);

  if (updateError) {
    console.error(updateError);
    return;
  }

  console.log(
    `🏆 ${winner} avançou para ${match.winner_to}`
  );
}