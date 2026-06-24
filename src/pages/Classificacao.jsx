import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { generateGroupStandings } from "../utils/generateGroupStandings";
import { getBestThirdPlaced } from "../utils/getBestThirdPlaced";
import { getQualifiedTeams } from "../utils/getQualifiedTeams";

export default function Classificacao() {
  const [groups, setGroups] = useState({});
  const [qualifiedTeams, setQualifiedTeams] = useState({});
  const [bestThirds, setBestThirds] = useState([]);

  useEffect(() => {
    loadStandings();
  }, []);

  async function loadStandings() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("stage", "GROUP");

    if (error) {
      console.error(error);
      return;
    }

    const standings = generateGroupStandings(data);

    const thirds = getBestThirdPlaced(standings);

    setBestThirds(thirds);

    const qualified = getQualifiedTeams(standings);

    setQualifiedTeams(qualified);

    setGroups(standings);
  }

  const isBestThird = (group) => {
    return bestThirds.some((team) => team.group === group);
  };

  const isDirectQualified = (position) => {
    return position <= 2;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-white mb-8">
        🏆 Classificação da Copa
      </h1>

      <div className="flex gap-4 text-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-900/30 rounded"></div>
          <span>Classificados</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-900/30 rounded"></div>
          <span>Melhor 3º colocado</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-900/20 rounded"></div>
          <span>Eliminado</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {Object.entries(groups)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([groupName, teams]) => (
            <div
              key={groupName}
              className="bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-700"
            >
              <div className="bg-slate-900 px-4 py-3">
                <h2 className="text-yellow-400 font-bold text-xl">
                  Grupo {groupName}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-white">
                  <thead>
                    <tr className="border-b border-slate-600 text-yellow-400">
                      <th className="py-2">#</th>
                      <th className="text-left">Time</th>
                      <th className="border-l border-slate-600 px-2">P</th>
                      <th className="border-l border-slate-600 px-2">V</th>
                      <th className="border-l border-slate-600 px-2">E</th>
                      <th className="border-l border-slate-600 px-2">D</th>
                      <th className="border-l border-slate-600 px-2">GP</th>
                      <th className="border-l border-slate-600 px-2">GC</th>
                      <th className="border-l border-slate-600 px-2">SG</th>
                      <th className="border-l border-slate-600 px-2">Pts</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teams.map((team, index) => (
                      <tr
                        key={team.team}
                        className={`border-b border-slate-700 ${
                          isDirectQualified(index + 1)
                            ? "bg-green-900/30"
                            : index === 2 && isBestThird(groupName)
                              ? "bg-yellow-900/30"
                              : "bg-red-900/20"
                        }`}
                      >
                        <td
                          className={`w-10 text-center py-2 font-bold ${
                            index < 2
                              ? "text-green-400"
                              : index === 2
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          {index + 1}
                        </td>

                        <td className="font-semibold">{team.team}</td>

                        <td className="text-center border-l border-slate-700">
                          {team.wins + team.draws + team.losses}
                        </td>

                        <td className="text-center border-l border-slate-700">
                          {team.wins}
                        </td>

                        <td className="text-center border-l border-slate-700">
                          {team.draws}
                        </td>

                        <td className="text-center border-l border-slate-700">
                          {team.losses}
                        </td>

                        <td className="text-center border-l border-slate-700">
                          {team.gf}
                        </td>

                        <td className="text-center border-l border-slate-700">
                          {team.ga}
                        </td>

                        <td className="text-center border-l border-slate-700">
                          {team.gd}
                        </td>

                        <td className="text-center font-bold border-l border-slate-700 text-yellow-400">
                          {team.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 text-xs text-slate-400">
                🟢 Classificados para os 16 avos
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
