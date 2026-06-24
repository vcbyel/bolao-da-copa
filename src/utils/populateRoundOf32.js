import { supabase } from "../lib/supabase";

export async function populateRoundOf32(
  qualifiedTeams
) {
  const matches = [
    {
      id: "r16_1",
      home: qualifiedTeams[0],
      away: qualifiedTeams[24],
    },

    {
      id: "r16_2",
      home: qualifiedTeams[1],
      away: qualifiedTeams[25],
    },

    {
      id: "r16_3",
      home: qualifiedTeams[2],
      away: qualifiedTeams[26],
    },

    {
      id: "r16_4",
      home: qualifiedTeams[3],
      away: qualifiedTeams[27],
    },

    {
      id: "r16_5",
      home: qualifiedTeams[4],
      away: qualifiedTeams[28],
    },

    {
      id: "r16_6",
      home: qualifiedTeams[5],
      away: qualifiedTeams[29],
    },

    {
      id: "r16_7",
      home: qualifiedTeams[6],
      away: qualifiedTeams[30],
    },

    {
      id: "r16_8",
      home: qualifiedTeams[7],
      away: qualifiedTeams[31],
    },
  ];

  for (const match of matches) {
    await supabase
      .from("matches")
      .update({
        home_team: match.home.team,
        away_team: match.away.team,
      })
      .eq("id", match.id);
  }

  console.log("16 avos preenchidos");
}