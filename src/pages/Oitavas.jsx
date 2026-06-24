import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import MatchWithScore from "../components/MatchWithScore";

export default function Oitavas() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("stage", "R8")
      .order("round_order");

    if (error) {
      console.error(error);
      return;
    }

    setMatches(data);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pb-32">
      <h1 className="text-4xl font-bold text-center mb-8">
        Oitavas de Final
      </h1>

      <div className="grid gap-4">
        {matches.length > 0 ? (
          matches.map((match) => (
            <MatchWithScore key={match.id} match={match} />
          ))
        ) : (
          <div className="text-center text-gray-400">
            Nenhuma partida encontrada.
          </div>
        )}
      </div>
    </div>
  );
}
