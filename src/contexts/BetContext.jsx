import { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';

const BetContext = createContext();

export function BetProvider({ children }) {
  const [bets, setBets] = useState({});
  const loadBets = async (userId) => {
    console.log("Buscando apostas do usuário:", userId);
  const { data, error } = await supabase
    .from("bets")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Erro ao carregar apostas:", error);
    return;    
  }
  console.log("Apostas encontradas:", data);

  const loadedBets = {};

  data.forEach((bet) => {
    loadedBets[bet.match_id] = {
      home: bet.home_score,
      away: bet.away_score,
      confirmed: bet.confirmed,
      timestamp: bet.created_at,
    };
  });

  console.log("Objeto carregado:", loadedBets);

  setBets(loadedBets);
};
  const updateBet = (matchId, homeScore, awayScore) => {
  if (bets[matchId]?.confirmed) {
    alert("Esta aposta já foi confirmada!");
    return;
  }

  setBets((prev) => ({
    ...prev,
    [matchId]: {
      home: homeScore,
      away: awayScore,
      timestamp: new Date(),
      confirmed: false,
    },
  }));
};

const hasBet = (matchId) => {
  return !!bets[matchId];
};

  const confirmBet = (matchId) => {
  if (!bets[matchId]) return;

  setBets((prev) => ({
    ...prev,
    [matchId]: {
      ...prev[matchId],
      confirmed: true,
    },
  }));
};

  const getBet = (matchId) => bets[matchId];

  const getAllBets = () => bets;

  const getTotalBets = () => Object.keys(bets).length;

  return (
    <BetContext.Provider value={{ bets, updateBet, confirmBet, getBet, getAllBets, getTotalBets, hasBet, loadBets, }}>
      {children}
    </BetContext.Provider>
  );
}

export function useBets() {
  const context = useContext(BetContext);
  if (!context) {
    throw new Error('useBets deve ser usado dentro de BetProvider');
  }
  return context;
}
