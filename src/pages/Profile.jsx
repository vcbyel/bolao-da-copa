import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  async function loadProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  }
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!user) return;

    loadPoints();

    const channel = supabase
      .channel("profile-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          if (payload.new.id === user.id) {
            setPoints(payload.new.points || 0);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function loadPoints() {
    const { data } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", user.id)
      .single();

    setPoints(data?.points || 0);
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <img
            src={
              user?.user_metadata?.avatar_url ||
              "https://via.placeholder.com/100"
            }
            alt="avatar"
            className="w-20 h-20 rounded-full border-4 border-green-500"
          />

          <div>
            <h1 className="text-2xl font-bold text-white">
              {user?.user_metadata?.full_name || "Usuário"}
            </h1>

            <p className="text-slate-400">{user?.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          <div className="bg-slate-700 p-4 rounded-xl">
            🏆 Pontuação Atual: {points} pontos
          </div>
          {profile?.is_admin && (
            <Link
              to="/admin"
              className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl text-center block"
            >
              ⚙️ Painel Admin
            </Link>
          )}
          <button
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl"
            onClick={logout}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
