import { supabase } from "../lib/supabase";
import { ROUND_OF_32_MAPPING } from "./roundOf32Mapping";

export async function updateRoundOf32(qualifiedTeams) {
  

  for (const [matchId, mapping] of Object.entries(
    ROUND_OF_32_MAPPING
  )) {
    
    const homeTeam =
      qualifiedTeams[mapping.home];

    const awayTeam =
      qualifiedTeams[mapping.away];

   

    if (!homeTeam || !awayTeam) {
      console.log(
        "⛔ Pulando partida porque falta time"
      );

      continue;
    }

    

    const { data, error } = await supabase
      .from("matches")
      .update({
        home_team: homeTeam.team,
        away_team: awayTeam.team,
      })
      .eq("id", matchId)
      .select();

    

    if (error) {
      console.error(
        "ERRO SUPABASE:",
        error
      );
    }
  }

  console.log("🏁 FIM UPDATE ROUND OF 32");
}