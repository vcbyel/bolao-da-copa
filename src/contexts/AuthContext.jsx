import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return error;
};

const register = async (email, password) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  return error;
};

const resetPassword = async (email) => {
  const { error } =
    await supabase.auth.resetPasswordForEmail(email);

  return error;
};

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
  const currentUser = data.session?.user ?? null;

  setUser(currentUser);

  if (currentUser) {
    await supabase
      .from("profiles")
      .upsert({
        id: currentUser.id,
        name:
          currentUser.user_metadata?.full_name ||
          currentUser.email,
        email: currentUser.email,
        avatar_url:
          currentUser.user_metadata?.avatar_url || null,
      });
  }

  setLoading(false);
});

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
  const currentUser = session?.user ?? null;

  setUser(currentUser);

  if (currentUser) {
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: currentUser.id,
        name:
          currentUser.user_metadata?.full_name ||
          currentUser.email,
        email: currentUser.email,
        avatar_url:
          currentUser.user_metadata?.avatar_url || null,
      });

    if (error) {
      console.error("Erro criando profile:", error);
    }
  }
});

    return () => subscription.unsubscribe();
  }, []);

  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user, 
        loading,
        login, 
        register,
        loginGoogle, 
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);