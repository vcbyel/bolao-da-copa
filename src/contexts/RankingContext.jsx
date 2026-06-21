import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const RankingContext = createContext();

export function RankingProvider({ children }) {
  const [ranking, setRanking] = useState([]);

  async function loadRanking() {
  console.log("BUSCANDO RANKING...");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("points", { ascending: false });

  console.log("RANKING RECEBIDO:", data);
  console.log("ERRO:", error);

  if (error) return;

  setRanking(data);
}

  useEffect(() => {
    loadRanking();

    const channel = supabase
      .channel("ranking-realtime")
      .on(
  "postgres_changes",
  {
    event: "UPDATE",
    schema: "public",
    table: "profiles",
  },
  (payload) => {
    console.log("🔥 REALTIME DISPAROU");
    console.log(payload);

    loadRanking();
  }
)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <RankingContext.Provider
      value={{
        ranking,
        loadRanking,
      }}
    >
      {children}
    </RankingContext.Provider>
  );
}

export function useRanking() {
  return useContext(RankingContext);
}