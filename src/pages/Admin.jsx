import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { advanceWinner } from "../utils/advanceWinner";
import { generateGroupStandings } from "../utils/generateGroupStandings";
import { getQualifiedTeams } from "../utils/getQualifiedTeams";
import { notifyMatchResult } from "../utils/notify";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminMatches from "../components/admin/AdminMatches";
import AdminThirdPlace from "../components/admin/AdminThirdPlace";
import AdminBracket from "../components/admin/AdminBracket";

export default function Admin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [matches, setMatches] = useState([]);
  const [thirdPlaceSlots, setThirdPlaceSlots] = useState({});
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    checkAdmin();
    loadMatches();
    loadThirdPlaceMapping();
  }, [user]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  function notify(message, type = "success") {
    setNotification({ message, type });
  }

  async function checkAdmin() {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
      setIsAdmin(false);
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

  function handleMatchUpdate(matchId, field, value) {
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, [field]: value } : m))
    );
  }

  async function handleSaveMatch(match) {
    if (
      match.stage !== "GROUP" &&
      match.home_result === match.away_result &&
      match.status === "finished"
    ) {
      notify("Partidas de mata-mata nao podem terminar empatadas.", "error");
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
      notify("Erro ao salvar resultado.", "error");
      return;
    }

    await supabase.rpc("recalculate_ranking");

    if (match.stage !== "GROUP" && match.status === "finished") {
      await advanceWinner(match.id);
    }

    if (match.status === "finished") {
      await notifyMatchResult(
        match.id,
        match.home_team,
        match.away_team,
        match.home_result,
        match.away_result
      );
    }

    await loadMatches();
    notify(`${match.home_team} x ${match.away_team} salvo!`);
  }

  async function handleSaveThirdPlaces() {
    setSaving(true);
    try {
      const standings = generateGroupStandings(matches);
      const qualified = getQualifiedTeams(standings);

      for (const [matchId, groupCode] of Object.entries(thirdPlaceSlots)) {
        const { error: mapError } = await supabase
          .from("third_place_mapping")
          .update({ group_code: groupCode })
          .eq("match_id", matchId);

        if (mapError) {
          console.error("Erro ao atualizar mapping:", mapError);
          continue;
        }

        const team = qualified[groupCode];
        if (team) {
          await supabase
            .from("matches")
            .update({ away_team: team.team, away_flag: team.flag || null })
            .eq("id", matchId);
        }
      }

      await loadMatches();
      notify("Chaveamento de 3o colocados atualizado!");
    } catch (err) {
      console.error(err);
      notify("Erro ao salvar chaveamento.", "error");
    } finally {
      setSaving(false);
    }
  }

  function handleThirdPlaceSlotChange(slot, value) {
    setThirdPlaceSlots((prev) => ({ ...prev, [slot]: value }));
  }

  // Loading state
  if (isAdmin === null) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent" />
          <p className="text-sm text-gray-400">Verificando permissoes...</p>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  function renderContent() {
    switch (activeSection) {
      case "dashboard":
        return (
          <AdminDashboard matches={matches} onNavigate={setActiveSection} />
        );
      case "matches":
        return (
          <AdminMatches
            matches={matches}
            onUpdate={handleMatchUpdate}
            onSave={handleSaveMatch}
          />
        );
      case "thirdPlace":
        return (
          <AdminThirdPlace
            thirdPlaceSlots={thirdPlaceSlots}
            onSlotChange={handleThirdPlaceSlotChange}
            onSave={handleSaveThirdPlaces}
            saving={saving}
          />
        );
      case "bracket":
        return <AdminBracket matches={matches} onReload={loadMatches} />;
      default:
        return (
          <AdminDashboard matches={matches} onNavigate={setActiveSection} />
        );
    }
  }

  return (
    <div className="w-full self-stretch flex flex-col lg:flex-row -my-4 min-h-[calc(100vh-4rem)]">
      {/* Admin Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Content */}
      <div className="flex-1 p-5 lg:p-8 overflow-y-auto">{renderContent()}</div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 max-w-sm px-5 py-3 rounded-xl shadow-2xl text-sm font-medium z-50 flex items-center gap-2 ${
            notification.type === "error"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          }`}
          style={{
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <span>{notification.type === "error" ? "!" : "OK"}</span>
          {notification.message}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
