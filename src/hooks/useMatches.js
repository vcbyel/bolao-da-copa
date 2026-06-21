import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useMatches() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    const { data, error } = await supabase.from("matches").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setMatches(data);
  };

  return { matches };
}
