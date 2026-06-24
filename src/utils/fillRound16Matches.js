import { supabase } from "../lib/supabase";

export async function fillRound16Matches(
  qualifiedTeams
) {
  
  const updates = [
    {
      id: "r16_1",
      home_team: qualifiedTeams["A1"]?.team,
      away_team: qualifiedTeams["B2"]?.team,
    },

    {
      id: "r16_2",
      home_team: qualifiedTeams["C1"]?.team,
      away_team: qualifiedTeams["D2"]?.team,
    },

    {
      id: "r16_3",
      home_team: qualifiedTeams["E1"]?.team,
      away_team: qualifiedTeams["F2"]?.team,
    },

    {
      id: "r16_4",
      home_team: qualifiedTeams["G1"]?.team,
      away_team: qualifiedTeams["H2"]?.team,
    },
    
  ];
  

  for (const match of updates) {
    await supabase
      .from("matches")
      .update({
        home_team: match.home_team,
        away_team: match.away_team,
      })
      .eq("id", match.id);
  }
}