import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      {/* Botão Hambúrguer */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
        onClick={() => setMenuAberto(!menuAberto)}
      >
        {menuAberto ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`
  fixed
  top-0 left-0
  h-screen
  w-64
  bg-gray-900 text-white
  transition-transform duration-300
  z-40
  ${menuAberto ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
`}
      >
        {/* Usuário */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.user_metadata?.avatar_url ||
                user?.user_metadata?.picture ||
                "https://ui-avatars.com/api/?name=User"
              }
              alt="Avatar"
              className="
        w-12
        h-12
        rounded-full
        object-cover
        border-2
        border-green-500
      "
            />

            <div>
              <h3 className="font-semibold text-sm">
                {user?.user_metadata?.full_name || "Usuário"}
              </h3>

              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <ul className="w-full py-4">
          <Link to="/">
            <li className="mt-4 mb-4 flex justify-center items-center">
              <div className="text-center">
                <h1 className="text-xl font-extrabold text-green-500">BOLÃO</h1>

                <p className="text-sm text-gray-400">Copa 2026</p>
              </div>
            </li>
          </Link>

          <hr className="border-gray-700" />

          <li className="mt-4 mb-4 ml-3 font-semibold">Fase de Grupos</li>

          <Link to="/rodada1">
            <li className="p-2 hover:bg-gray-800 text-center">Rodada 1</li>
          </Link>

          <Link to="/rodada2">
            <li className="p-2 hover:bg-gray-800 text-center">Rodada 2</li>
          </Link>

          <Link to="/rodada3">
            <li className="p-2 hover:bg-gray-800 text-center">Rodada 3</li>
          </Link>

          <li className="mt-6 mb-4 ml-3 font-semibold">Fase Mata-Mata</li>

          

          <Link to="/16avos">
            <li className="p-2 hover:bg-gray-800 text-center">16 avos</li>
          </Link>

          <Link to="/oitavas">
            <li className="p-2 hover:bg-gray-800 text-center">
              Oitavas de Final
            </li>
          </Link>

          <Link to="/quartas">
            <li className="p-2 hover:bg-gray-800 text-center">
              Quartas de Final
            </li>
          </Link>

          <Link to="/semifinal">
            <li className="p-2 hover:bg-gray-800 text-center">Semi Final</li>
          </Link>

          <Link to="/final">
            <li className="p-2 hover:bg-gray-800 text-center">Final</li>
          </Link>
          <hr className="border-gray-700" />

          <Link
            to="/perfil"
            className="block p-3 hover:bg-slate-700 rounded-lg"
          >
            👤 Perfil
          </Link>
          <Link
            to="/ranking"
            className="block p-3 hover:bg-slate-700 rounded-lg"
          >
            🏆 Ranking
          </Link>
          <Link
            to="/classificacao"
            className="block p-3 hover:bg-slate-700 rounded-lg">
             📊 Classificação
          </Link>
          <Link to="/minhas-apostas" className="block p-3 hover:bg-slate-700 rounded-lg">
             🎯 Minhas Apostas
          </Link>

          <hr className="border-gray-700 my-4" />

          <li
            onClick={logout}
            className="
              p-3
              text-center
              cursor-pointer
              hover:bg-red-600
              transition
            "
          >
            🚪 Sair
          </li>
        </ul>
      </div>
    </>
  );
}
