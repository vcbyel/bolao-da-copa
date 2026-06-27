import { createClient } from "@supabase/supabase-js";
import fs from "fs";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Read .env file manually
const envPath = ".env";
const envContent = fs.readFileSync(envPath, "utf-8");

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`${name}\\s*=\\s*([^\\n\\r]+)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar("VITE_SUPABASE_URL");
const supabaseAnonKey = getEnvVar("VITE_SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials not found in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select("id, home_team, away_team, match_date, stage, round_order")
    .order("stage")
    .order("round_order");

  if (error) {
    console.error("Error fetching matches:", error);
    return;
  }

  console.log(`Total matches in DB: ${data.length}`);
  
  const stages = {};
  data.forEach(m => {
    if (!stages[m.stage]) {
      stages[m.stage] = [];
    }
    stages[m.stage].push(m);
  });

  for (const [stage, list] of Object.entries(stages)) {
    console.log(`\n--- Stage: ${stage} (${list.length} matches) ---`);
    list.forEach(m => {
      console.log(`ID: ${m.id} | ${m.home_team} vs ${m.away_team} | Date: ${m.match_date} | Order: ${m.round_order}`);
    });
  }
}

checkMatches();
