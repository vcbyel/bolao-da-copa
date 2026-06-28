import { supabase } from "../lib/supabase";

export async function createNotification(userId, { title, message, type = "info", link = null }) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    link,
  });

  if (error) {
    console.error("Erro ao criar notificação:", error);
  }
}

export async function notifyAllUsers({ title, message, type = "info", link = null }) {
  const { data: profiles, error: fetchError } = await supabase
    .from("profiles")
    .select("id");

  if (fetchError) {
    console.error("Erro ao buscar usuários:", fetchError);
    return;
  }

  const notifications = profiles.map((p) => ({
    user_id: p.id,
    title,
    message,
    type,
    link,
  }));

  const { error } = await supabase.from("notifications").insert(notifications);

  if (error) {
    console.error("Erro ao notificar todos:", error);
  }
}

export async function notifyMatchResult(matchId, homeTeam, awayTeam, homeResult, awayResult) {
  const { data: bets, error: fetchError } = await supabase
    .from("bets")
    .select("user_id")
    .eq("match_id", matchId);

  if (fetchError || !bets || bets.length === 0) return;

  const uniqueUserIds = [...new Set(bets.map((b) => b.user_id))];

  const notifications = uniqueUserIds.map((userId) => ({
    user_id: userId,
    title: "Resultado atualizado!",
    message: `${homeTeam} ${homeResult} x ${awayResult} ${awayTeam}`,
    type: "info",
    link: "/minhas-apostas",
  }));

  const { error } = await supabase.from("notifications").insert(notifications);

  if (error) {
    console.error("Erro ao notificar resultado:", error);
  }
}
