import { useCallback, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useAuth } from "./contexts/AuthContext";
import { useBets } from "./contexts/BetContext";
import { checkForUpdates } from "./utils/liveUpdate";
import Admin from "./pages/Admin";
import Avos16 from "./pages/Avos16";
import Final from "./pages/Final";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MinhasApostas from "./pages/MinhasApostas";
import Oitavas from "./pages/Oitavas";
import Profile from "./pages/Profile";
import Quartas from "./pages/Quartas";
import Ranking from "./pages/Ranking";
import Rodada1 from "./pages/Rodada1";
import Rodada2 from "./pages/Rodada2";
import Rodada3 from "./pages/Rodada3";
import SemiFinal from "./pages/SemiFinal";
import Classificacao from "./pages/Classificacao";
import Notifications from "./pages/Notifications";

function App() {
  const { user, loading } = useAuth();
  const { loadBets } = useBets();

  const loadUserBets = useCallback(() => {
    if (user) {
      loadBets(user.id);
    }
  }, [user, loadBets]);

  useEffect(() => {
    loadUserBets();
  }, [loadUserBets]);

  useEffect(() => {
    checkForUpdates();
  }, []);

  if (loading) return <div>Carregando...</div>;

  if (!user) return <Login />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rodada1" element={<Rodada1 />} />
        <Route path="/rodada2" element={<Rodada2 />} />
        <Route path="/rodada3" element={<Rodada3 />} />
        <Route path="/16avos" element={<Avos16 />} />
        <Route path="/oitavas" element={<Oitavas />} />
        <Route path="/quartas" element={<Quartas />} />
        <Route path="/semifinal" element={<SemiFinal />} />
        <Route path="/final" element={<Final />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/classificacao" element={<Classificacao />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/minhas-apostas" element={<MinhasApostas />} />
        <Route path="/notificacoes" element={<Notifications />} />
      </Routes>
    </Layout>
  );
}

export default App;
