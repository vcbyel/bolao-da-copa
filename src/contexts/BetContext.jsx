import { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const BetContext = createContext();

export function BetProvider({ children }) {
  const [bets, setBets] = useState({});

  const loadBets = useCallback(async (userId) => {
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
  }, []);

  const updateBet = useCallback((matchId, homeScore, awayScore) => {
    if (bets[matchId]?.confirmed) {
      alert("Esta aposta já foi confirmada!");
      return;
    }

    console.log("UPDATE BET", {
      matchId,
      homeScore,
      awayScore,
    });

    setBets((prev) => {
      const newState = {
        ...prev,
        [matchId]: {
          home: homeScore,
          away: awayScore,
          timestamp: new Date(),
          confirmed: false,
        },
      };

      console.log("NOVO STATE", newState);

      return newState;
    });
  }, [bets]);

  const hasBet = useCallback((matchId) => {
    return !!bets[matchId];
  }, [bets]);

  const confirmBet = useCallback((matchId) => {
    setBets((prev) => {
      if (!prev[matchId]) return prev;
      return {
        ...prev,
        [matchId]: {
          ...prev[matchId],
          confirmed: true,
        },
      };
    });
  }, []);

  const getBet = useCallback((matchId) => bets[matchId], [bets]);

  const getAllBets = useCallback(() => bets, [bets]);

  const getTotalBets = useCallback(() => Object.keys(bets).length, [bets]);

  const clearAllBets = useCallback(() => {
    setBets((prev) => {
      const unconfirmed = {};
      Object.entries(prev).forEach(([matchId, bet]) => {
        if (bet.confirmed) {
          unconfirmed[matchId] = bet;
        }
      });
      return unconfirmed;
    });
  }, []);

  return (
    <BetContext.Provider value={{ bets, updateBet, confirmBet, getBet, getAllBets, getTotalBets, hasBet, loadBets, clearAllBets, }}>
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

