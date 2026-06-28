import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "./NotificationBell";

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
      {menuAberto && (
        <div
          className="fixed inset-0 bg-black/70 z-30 md:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    fixed
    top-0 left-0
    h-screen
    w-[280px]
    max-w-[85vw]
    bg-gray-900
    text-white
    flex
    flex-col
    transition-transform
    duration-300
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

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">
                {user?.user_metadata?.full_name || "Usuário"}
              </h3>

              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>

            <NotificationBell />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="w-full py-4">
            <Link to="/" className="block">
              <div className="py-6 text-center border-b border-gray-700">
                <h1 className="text-3xl font-black tracking-wider text-green-500">
                  BOLÃO
                </h1>

                <p className="text-xs uppercase tracking-[4px] text-gray-400">
                  World Cup 2026
                </p>
              </div>
            </Link>

            <hr className="border-gray-700" />

            <li className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
              Fase de Grupos
            </li>

            <Link to="/rodada1">
              <li className="px-4 py-3 hover:bg-gray-800">Rodada 1</li>
            </Link>

            <Link to="/rodada2">
              <li className="px-4 py-3 hover:bg-gray-800">Rodada 2</li>
            </Link>

            <Link to="/rodada3">
              <li className="px-4 py-3 hover:bg-gray-800">Rodada 3</li>
            </Link>

            <li className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
              Fase Mata-Mata
            </li>

            <Link to="/16avos">
              <li className="px-4 py-3 hover:bg-gray-800">16 avos</li>
            </Link>

            <Link to="/oitavas">
              <li className="px-4 py-3 hover:bg-gray-800">Oitavas de Final</li>
            </Link>

            <Link to="/quartas">
              <li className="px-4 py-3 hover:bg-gray-800">Quartas de Final</li>
            </Link>

            <Link to="/semifinal">
              <li className="px-4 py-3 hover:bg-gray-800">Semi Final</li>
            </Link>

            <Link to="/final">
              <li className="px-4 py-3 hover:bg-gray-800">Final</li>
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
              onClick={() => setMenuAberto(false)}
              className="block p-3 hover:bg-slate-700 rounded-lg"
            >
              🏆 Ranking
            </Link>
            <Link
              to="/classificacao"
              className="block p-3 hover:bg-slate-700 rounded-lg"
            >
              📊 Classificação
            </Link>
            <Link
              to="/minhas-apostas"
              className="block p-3 hover:bg-slate-700 rounded-lg"
            >
              🎯 Minhas Apostas
            </Link>
            <Link
              to="/notificacoes"
              onClick={() => setMenuAberto(false)}
              className="block p-3 hover:bg-slate-700 rounded-lg"
            >
              🔔 Notificações
            </Link>

            <hr className="border-gray-700 my-4" />
          </ul>
          <div className="border-t border-gray-700 p-4">
            <button
              onClick={logout}
              className="
                  w-full
                  bg-red-600
                  hover:bg-red-700
                  py-3
                  rounded-lg
                  font-semibold
                  transition
                "
            >
              🚪 Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
