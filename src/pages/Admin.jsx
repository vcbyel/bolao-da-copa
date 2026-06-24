import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { advanceWinner } from "../utils/advanceWinner";
import { generateGroupStandings } from "../utils/generateGroupStandings";
import { getQualifiedTeams } from "../utils/getQualifiedTeams";
export default function Admin() {
  const { user } = useAuth();
  const [stageFilter, setStageFilter] = useState("ALL");
  const [isAdmin, setIsAdmin] = useState(null);
  const [matches, setMatches] = useState([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [thirdPlaceSlots, setThirdPlaceSlots] = useState({});
  useEffect(() => {
  if (!user) return;

  checkAdmin();
  loadMatches();
  loadThirdPlaceMapping();

}, [user]);

  async function checkAdmin() {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setIsAdmin(data?.is_admin);
  }

  async function loadMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("stage")
      .order("round_order");

    if (error) {
      console.error(error);
      return;
    }

    setMatches(data);
  }
  async function saveThirdPlaces() {
  const standings = generateGroupStandings(matches);
  const qualified = getQualifiedTeams(standings);

  // Use um loop for...of para lidar com operações assíncronas corretamente
  for (const [matchId, groupCode] of Object.entries(thirdPlaceSlots)) {
    
    // 1. Atualiza o mapeamento no banco
    const { error: mapError } = await supabase
      .from("third_place_mapping")
      .update({ group_code: groupCode })
      .eq("match_id", matchId);

    if (mapError) {
      console.error("Erro ao atualizar mapping:", mapError);
      continue;
    }

    // 2. Define o time que se qualificou daquele grupo
    const team = qualified[groupCode];

    // 3. Atualiza o away_team na tabela de matches se o time existir
    if (team) {
      const { error: matchError } = await supabase
        .from("matches")
        .update({ away_team: team.team }) // Certifique-se que team.team é o nome correto
        .eq("id", matchId);

      if (matchError) {
        console.error("Erro ao atualizar match:", matchError);
      }
    }
  }

  await loadMatches();
  alert("Chaveamento atualizado!");
}

  

async function loadThirdPlaceMapping() {
  const { data, error } = await supabase
    .from("third_place_mapping")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const mapping = {};

  data.forEach((row) => {
    mapping[row.match_id] = row.group_code;
  });

  setThirdPlaceSlots(mapping);
}
  async function saveMatch(match) {
    if (match.stage !== "GROUP" && match.home_result === match.away_result) {
      alert("Partidas de mata-mata não podem terminar empatadas.");
      return;
    }

    const { error } = await supabase
      .from("matches")
      .update({
        home_result: match.home_result,
        away_result: match.away_result,
        status: match.status,
      })
      .eq("id", match.id);

    if (error) {
      console.error(error);
      alert("Erro ao salvar resultado.");
      return;
    }

    await supabase.rpc("recalculate_ranking");

    if (match.stage !== "GROUP") {
      await advanceWinner(match.id);
    }

    await loadMatches();

    alert("Resultado salvo com sucesso!");
  }

  const filteredMatches = matches.filter((match) => {
    const matchSearch =
      (match.home_team || "").toLowerCase().includes(search.toLowerCase()) ||
      (match.away_team || "").toLowerCase().includes(search.toLowerCase());

    const matchTab = tab === "all" ? true : match.status === tab;

    const matchStage =
      stageFilter === "ALL" ? true : match.stage === stageFilter;

    return matchSearch && matchTab && matchStage;
  });

  if (isAdmin === null) {
    return <div className="text-center p-10">Carregando... </div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  const pendingMatches = matches.filter((m) => m.status !== "finished");

  return (
    <div className="max-w-7xl mx-auto p-6">
      {" "}
      <h1 className="text-4xl font-bold text-white mb-8">
        ⚙️ Painel Administrativo{" "}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-5 text-center">
          <h2 className="text-3xl font-bold text-yellow-400">
            {matches.length}
          </h2>
          <p>Total de Jogos</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 text-center">
          <h2 className="text-3xl font-bold text-green-400">
            {matches.filter((m) => m.status === "finished").length}
          </h2>
          <p>Finalizados</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 text-center">
          <h2 className="text-3xl font-bold text-yellow-400">
            {matches.filter((m) => m.status === "scheduled").length}
          </h2>
          <p>Pendentes</p>
        </div>
      </div>
      <div className="bg-red-900/20 border border-red-500 rounded-xl p-4 mb-6">
        <h2 className="text-xl font-bold text-red-400 mb-3">
          🚨 Jogos Pendentes
        </h2>

        <div className="grid md:grid-cols-2 gap-2">
          {pendingMatches.map((match) => (
            <button
              key={match.id}
              onClick={() => {
                document.getElementById(match.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              className="bg-slate-700 hover:bg-slate-600 p-3 rounded text-left"
            >
              {match.home_team} x {match.away_team}
            </button>
          ))}
        </div>
      </div>
      <input
        type="text"
        placeholder="🔍 Buscar partida..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-slate-800 text-white p-4 rounded-xl mb-6"
      />
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStageFilter("ALL")}
          className={`px-4 py-2 rounded-lg ${
            stageFilter === "ALL" ? "bg-blue-600" : "bg-slate-700"
          }`}
        >
          📊 Todos
        </button>

        <button
          onClick={() => setStageFilter("GROUP")}
          className={`px-4 py-2 rounded-lg ${
            stageFilter === "GROUP" ? "bg-blue-600" : "bg-slate-700"
          }`}
        >
          ⚽ Grupos
        </button>

        <button
          onClick={() => setStageFilter("R16")}
          className={`px-4 py-2 rounded-lg ${
            stageFilter === "R16" ? "bg-blue-600" : "bg-slate-700"
          }`}
        >
          🏆 16 Avos
        </button>

        <button
          onClick={() => setStageFilter("R8")}
          className={`px-4 py-2 rounded-lg ${
            stageFilter === "R8" ? "bg-blue-600" : "bg-slate-700"
          }`}
        >
          🥇 Oitavas
        </button>

        <button
          onClick={() => setStageFilter("QF")}
          className={`px-4 py-2 rounded-lg ${
            stageFilter === "QF" ? "bg-blue-600" : "bg-slate-700"
          }`}
        >
          🎯 Quartas
        </button>

        <button
          onClick={() => setStageFilter("SF")}
          className={`px-4 py-2 rounded-lg ${
            stageFilter === "SF" ? "bg-blue-600" : "bg-slate-700"
          }`}
        >
          🔥 Semi
        </button>

        <button
          onClick={() => setStageFilter("FINAL")}
          className={`px-4 py-2 rounded-lg ${
            stageFilter === "FINAL" ? "bg-blue-600" : "bg-slate-700"
          }`}
        >
          👑 Final
        </button>
      </div>
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded-lg ${
            tab === "all" ? "bg-blue-600" : "bg-slate-700"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setTab("scheduled")}
          className={`px-4 py-2 rounded-lg ${
            tab === "scheduled" ? "bg-yellow-500 text-black" : "bg-slate-700"
          }`}
        >
          Pendentes
        </button>

        <button
          onClick={() => setTab("live")}
          className={`px-4 py-2 rounded-lg ${
            tab === "live" ? "bg-red-500" : "bg-slate-700"
          }`}
        >
          Ao Vivo
        </button>

        <button
          onClick={() => setTab("finished")}
          className={`px-4 py-2 rounded-lg ${
            tab === "finished" ? "bg-green-500" : "bg-slate-700"
          }`}
        >
          Finalizados
        </button>
      </div>
      <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          🏆 Configuração Manual dos Melhores 3º Colocados
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            "r16_1",
            "r16_2",
            "r16_7",
            "r16_8",
            "r16_11",
            "r16_12",
            "r16_15",
            "r16_16",
          ].map((slot) => (
            <div key={slot} className="bg-slate-700 p-4 rounded-xl">
              <p className="font-bold mb-2">{slot}</p>

              <select
                value={thirdPlaceSlots[slot] || ""}
                onChange={(e) =>
                  setThirdPlaceSlots((prev) => ({
                    ...prev,
                    [slot]: e.target.value,
                  }))
                }
                className="w-full bg-slate-900 text-white p-3 rounded-lg"
              >
                <option value="">Selecione o terceiro colocado</option>

                <option value="A3">Grupo A - 3º</option>
                <option value="B3">Grupo B - 3º</option>
                <option value="C3">Grupo C - 3º</option>
                <option value="D3">Grupo D - 3º</option>
                <option value="E3">Grupo E - 3º</option>
                <option value="F3">Grupo F - 3º</option>
                <option value="G3">Grupo G - 3º</option>
                <option value="H3">Grupo H - 3º</option>
                <option value="I3">Grupo I - 3º</option>
                <option value="J3">Grupo J - 3º</option>
                <option value="K3">Grupo K - 3º</option>
                <option value="L3">Grupo L - 3º</option>
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={saveThirdPlaces}
          className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold"
        >
          💾 Salvar Chaveamento
        </button>
      </div>
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <div
            id={match.id}
            key={match.id}
            className="bg-slate-800 rounded-2xl p-5 border border-slate-700"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">
                  {match.home_team} x {match.away_team}
                </h2>

                <p className="text-sm text-gray-400">{match.stage}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  match.status === "finished"
                    ? "bg-green-500/20 text-green-400"
                    : match.status === "live"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {match.status}
              </span>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <input
                type="number"
                value={match.home_result ?? ""}
                onChange={(e) =>
                  setMatches((prev) =>
                    prev.map((m) =>
                      m.id === match.id
                        ? {
                            ...m,
                            home_result: Number(e.target.value),
                          }
                        : m,
                    ),
                  )
                }
                className="w-20 bg-slate-700 text-white text-center p-3 rounded-xl"
              />

              <span className="text-2xl font-bold">X</span>

              <input
                type="number"
                value={match.away_result ?? ""}
                onChange={(e) =>
                  setMatches((prev) =>
                    prev.map((m) =>
                      m.id === match.id
                        ? {
                            ...m,
                            away_result: Number(e.target.value),
                          }
                        : m,
                    ),
                  )
                }
                className="w-20 bg-slate-700 text-white text-center p-3 rounded-xl"
              />

              <select
                value={match.status}
                onChange={(e) =>
                  setMatches((prev) =>
                    prev.map((m) =>
                      m.id === match.id
                        ? {
                            ...m,
                            status: e.target.value,
                          }
                        : m,
                    ),
                  )
                }
                className="bg-slate-700 text-white p-3 rounded-xl"
              >
                <option value="scheduled">scheduled</option>

                <option value="live">live</option>

                <option value="finished">finished</option>
              </select>

              <button
                onClick={() => saveMatch(match)}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-bold"
              >
                💾 Salvar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
