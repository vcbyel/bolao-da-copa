import { grupos } from "../data/grupos";
import { supabase } from "../lib/supabase";

export async function seedMatches() {
  const matches = [];

  Object.values(grupos).forEach((grupo) => {
    const todasPartidas = [
      ...(grupo.partidas || []),
      ...(grupo.partida2 || []),
      ...(grupo.partida3 || []),
    ];

    todasPartidas.forEach((match) => {
      matches.push({
        id: match.id,
        home_team: match.home,
        away_team: match.away,
        home_flag: match.homeFlag,
        away_flag: match.awayFlag,
        match_date: `${match.data} ${match.hora}:00`,
        status: "scheduled",
      });
    });
  });

  console.log(`Tentando inserir ${matches.length} partidas no Supabase...`);

  const { data, error } = await supabase
    .from("matches")
    .upsert(matches);

  if (error) {
    console.error("Erro detalhado do Supabase:", error);
    alert(`Erro ao salvar: ${error.message}`);
  } else {
    console.log("Partidas importadas com sucesso!");
    alert("Todas as partidas foram cadastradas no banco!");
  }
}
