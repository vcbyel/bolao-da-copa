import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { advanceWinner } from "../utils/advanceWinner";

export default function Admin() {
const { user } = useAuth();

const [isAdmin, setIsAdmin] = useState(null);
const [matches, setMatches] = useState([]);
const [search, setSearch] = useState("");
const [tab, setTab] = useState("all");

useEffect(() => {
if (!user) return;
checkAdmin();
loadMatches();


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
.order("match_date");


if (error) {
  console.error(error);
  return;
}

setMatches(data);


}

async function saveMatch(match) {
if (
match.stage !== "GROUP" &&
match.home_result === match.away_result
) {
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
(match.home_team || "")
.toLowerCase()
.includes(search.toLowerCase()) ||
(match.away_team || "")
.toLowerCase()
.includes(search.toLowerCase());


const matchTab =
  tab === "all"
    ? true
    : match.status === tab;

return matchSearch && matchTab;


});

if (isAdmin === null) {
return ( <div className="text-center p-10">
Carregando... </div>
);
}

if (!isAdmin) {
return <Navigate to="/" />;
}

return ( <div className="max-w-7xl mx-auto p-6"> <h1 className="text-4xl font-bold text-white mb-8">
⚙️ Painel Administrativo </h1>


  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <div className="bg-slate-800 rounded-xl p-5 text-center">
      <h2 className="text-3xl font-bold text-yellow-400">
        {matches.length}
      </h2>
      <p>Total de Jogos</p>
    </div>

    <div className="bg-slate-800 rounded-xl p-5 text-center">
      <h2 className="text-3xl font-bold text-green-400">
        {
          matches.filter(
            (m) => m.status === "finished"
          ).length
        }
      </h2>
      <p>Finalizados</p>
    </div>

    <div className="bg-slate-800 rounded-xl p-5 text-center">
      <h2 className="text-3xl font-bold text-yellow-400">
        {
          matches.filter(
            (m) => m.status === "scheduled"
          ).length
        }
      </h2>
      <p>Pendentes</p>
    </div>
  </div>

  <input
    type="text"
    placeholder="🔍 Buscar partida..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="w-full bg-slate-800 text-white p-4 rounded-xl mb-6"
  />

  <div className="flex gap-3 mb-8 flex-wrap">
    <button
      onClick={() => setTab("all")}
      className={`px-4 py-2 rounded-lg ${
        tab === "all"
          ? "bg-blue-600"
          : "bg-slate-700"
      }`}
    >
      Todos
    </button>

    <button
      onClick={() => setTab("scheduled")}
      className={`px-4 py-2 rounded-lg ${
        tab === "scheduled"
          ? "bg-yellow-500 text-black"
          : "bg-slate-700"
      }`}
    >
      Pendentes
    </button>

    <button
      onClick={() => setTab("live")}
      className={`px-4 py-2 rounded-lg ${
        tab === "live"
          ? "bg-red-500"
          : "bg-slate-700"
      }`}
    >
      Ao Vivo
    </button>

    <button
      onClick={() => setTab("finished")}
      className={`px-4 py-2 rounded-lg ${
        tab === "finished"
          ? "bg-green-500"
          : "bg-slate-700"
      }`}
    >
      Finalizados
    </button>
  </div>

  <div className="space-y-4">
    {filteredMatches.map((match) => (
      <div
        key={match.id}
        className="bg-slate-800 rounded-2xl p-5 border border-slate-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {match.home_team} x {match.away_team}
          </h2>

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
                        home_result:
                          Number(
                            e.target.value
                          ),
                      }
                    : m
                )
              )
            }
            className="w-20 bg-slate-700 text-white text-center p-3 rounded-xl"
          />

          <span className="text-2xl font-bold">
            X
          </span>

          <input
            type="number"
            value={match.away_result ?? ""}
            onChange={(e) =>
              setMatches((prev) =>
                prev.map((m) =>
                  m.id === match.id
                    ? {
                        ...m,
                        away_result:
                          Number(
                            e.target.value
                          ),
                      }
                    : m
                )
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
                        status:
                          e.target.value,
                      }
                    : m
                )
              )
            }
            className="bg-slate-700 text-white p-3 rounded-xl"
          >
            <option value="scheduled">
              scheduled
            </option>

            <option value="live">
              live
            </option>

            <option value="finished">
              finished
            </option>
          </select>

          <button
            onClick={() =>
              saveMatch(match)
            }
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
