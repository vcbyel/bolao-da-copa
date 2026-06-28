import { useNotifications } from "../contexts/NotificationContext";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, ArrowLeft } from "lucide-react";

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refresh } =
    useNotifications();

  const typeIcons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Notificações</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-400">
                {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition"
            >
              <CheckCheck size={16} />
              <span className="hidden sm:inline">Marcar todas lidas</span>
            </button>
          )}
          <button
            onClick={refresh}
            className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-white"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Lista */}
      {notifications.length === 0 ? (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-12 text-center">
          <Bell size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">Nenhuma notificação</p>
          <p className="text-gray-500 text-sm mt-1">
            Quando houver novidades, elas aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`
                bg-gray-800/80 rounded-xl border p-4 cursor-pointer
                hover:bg-gray-700/80 transition-all
                ${
                  !n.read
                    ? "border-yellow-500/30 bg-gray-800"
                    : "border-gray-700/50"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">
                  {typeIcons[n.type] || "ℹ️"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`font-semibold ${
                        !n.read ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{n.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      {new Date(n.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-yellow-400 hover:text-yellow-300 transition"
                      >
                        Ver →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
