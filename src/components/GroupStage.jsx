import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import GroupCard from "./GroupCard";
import { groupMatches } from "../utils/groupMatches";

export default function GroupStage({ title, rounds }) {
  const [groups, setGroups] = useState({});

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("stage", "GROUP");

    if (error) {
      console.error(error);
      return;
    }

    const filteredMatches = data.filter((match) =>
      rounds.includes(match.id.slice(-1)),
    );

    setGroups(groupMatches(filteredMatches));
  }

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold mb-8 text-center">{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
        {Object.values(groups)
          .sort((a, b) => a.nome.localeCompare(b.nome))
          .map((grupo) => (
            <GroupCard key={grupo.nome} grupo={grupo} />
          ))}
      </div>
    </div>
  );
}
