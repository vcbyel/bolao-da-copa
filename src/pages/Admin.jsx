import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { updateRanking } from "../services/updateRanking";

export default function Admin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  // Lista de partidas
  const [matches, setMatches] = useState([]);

  // Campo de busca
  const [search, setSearch] = useState("");

  // Aba selecionada
  const [tab, setTab] = useState("all");


  useEffect(() => {
    console.log("MATCHES ATUALIZADO:");
    console.log(matches);
  }, [matches]);
  // Carrega partidas ao abrir a página
  useEffect(() => {
  if (!user) return;

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

  checkAdmin();
  loadMatches();
}, [user]);

  // Buscar partidas no Supabase
  async function loadMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("match_date");

    if (error) {
      console.error(error);
      return;
    }

    setMatches(data);
  }

  // Salvar resultado
  async function saveMatch(match) {
  const { data, error } = await supabase
    .from("matches")
    .update({
      home_result: match.home_result,
      away_result: match.away_result,
      status: match.status,
    })
    .eq("id", match.id)
    .select();

  console.log("RETORNO UPDATE:", data);
  console.log("ERRO UPDATE:", error);

  if (error) {
    alert("Erro ao salvar!");
    return;
  }

  // recalcula ranking
  await updateRanking();

  // recarrega partidas
  await loadMatches();

  alert("Resultado salvo com sucesso!");
}

  // Filtrar partidas pela busca
  const filteredMatches = matches.filter((match) => {

    const matchSearch =
      match.home_team.toLowerCase().includes(search.toLowerCase()) ||
      match.away_team.toLowerCase().includes(search.toLowerCase());

    const matchTab = tab === "all" ? true : match.status === tab;

    console.log(
    "RENDER:",
    match.id,
    match.home_result,
    match.away_result,
    match.status
  );

    return matchSearch && matchTab;
  });

  if (isAdmin === null) {
    return <div>Carregando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* TÍTULO */}
      <h1 className="text-4xl font-bold text-white mb-8">
        ⚙️ Painel Administrativo
      </h1>

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-5 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-yellow-400">
            {matches.length}
          </h2>
          <p className="text-slate-300">Total de Jogos</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-green-400">
            {matches.filter((m) => m.status === "finished").length}
          </h2>
          <p className="text-slate-300">Finalizados</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-5 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-yellow-400">
            {matches.filter((m) => m.status === "scheduled").length}
          </h2>
          <p className="text-slate-300">Pendentes</p>
        </div>
      </div>

      {/* BUSCA */}
      <input
  type="text"
  placeholder="🔍 Buscar partida..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="w-full bg-slate-800 text-white p-4 rounded-xl mb-6 border border-slate-700"
/>

      {/* ABAS */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "all" ? "bg-blue-600" : "bg-slate-700"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setTab("scheduled")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "scheduled" ? "bg-yellow-500 text-black" : "bg-slate-700"
          }`}
        >
          Pendentes
        </button>

        <button
          onClick={() => setTab("live")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "live" ? "bg-red-500" : "bg-slate-700"
          }`}
        >
          Ao Vivo
        </button>

        <button
          onClick={() => setTab("finished")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            tab === "finished" ? "bg-green-500" : "bg-slate-700"
          }`}
        >
          Finalizados
        </button>
      </div>

      {/* LISTA DE PARTIDAS */}
      <div className="space-y-4">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-700"
          >
            {/* CABEÇALHO */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {match.home_team} x {match.away_team}
              </h2>

              {/* STATUS COLORIDO */}
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

            {/* PLACAR */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* GOLS CASA */}
              <input
  type="number"
  value={match.home_result ?? ""}
  onChange={(e) => {
    console.log(
      "HOME ALTERADO:",
      match.id,
      e.target.value
    );

    setMatches((prev) =>
      prev.map((m) =>
        m.id === match.id
          ? {
              ...m,
              home_result: Number(e.target.value),
            }
          : m
      )
    );
  }}
  className="w-20 bg-slate-700 text-white text-center p-3 rounded-xl"
/>

              <span className="text-2xl font-bold text-white">X</span>

              {/* GOLS FORA */}
              <input
  type="number"
  value={match.away_result ?? ""}
  onChange={(e) => {
    console.log(
      "AWAY ALTERADO:",
      match.id,
      e.target.value
    );

    setMatches((prev) =>
      prev.map((m) =>
        m.id === match.id
          ? {
              ...m,
              away_result: Number(e.target.value),
            }
          : m
      )
    );
  }}
  className="w-20 bg-slate-700 text-white text-center p-3 rounded-xl"
/>

              {/* STATUS */}
              <select
  value={match.status}
  onChange={(e) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === match.id
          ? {
              ...m,
              status: e.target.value,
            }
          : m
      )
    );
  }}
  className="bg-slate-700 text-white p-3 rounded-xl"
>
  <option value="scheduled">scheduled</option>
  <option value="live">live</option>
  <option value="finished">finished</option>
</select>
              

              {/* BOTÃO SALVAR */}
              <button
  onClick={() => saveMatch(match) } 
  className="
    bg-gradient-to-r
    from-green-500
    to-emerald-600
    hover:scale-105
    transition
    px-6
    py-3
    rounded-xl
    font-bold
    shadow-lg
  "
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
