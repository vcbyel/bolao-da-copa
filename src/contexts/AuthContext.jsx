import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { App } from "@capacitor/app";

const AuthContext = createContext();

const DEEP_LINK_URL = "com.bolao.copa2026://";

function parseHashParams(hash) {
  const params = new URLSearchParams(hash.replace(/^#\/?/, ""));
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
  };
}

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
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    return error;
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const currentUser = data.session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        await supabase.from("profiles").upsert({
          id: currentUser.id,
          name:
            currentUser.user_metadata?.full_name || currentUser.email,
          email: currentUser.email,
          avatar_url: currentUser.user_metadata?.avatar_url || null,
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
        const { error } = await supabase.from("profiles").upsert({
          id: currentUser.id,
          name:
            currentUser.user_metadata?.full_name || currentUser.email,
          email: currentUser.email,
          avatar_url: currentUser.user_metadata?.avatar_url || null,
        });

        if (error) {
          console.error("Erro criando profile:", error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handler = App.addListener("appUrlOpen", async ({ url }) => {
      if (url.startsWith("com.bolao.copa2026://")) {
        const hashIndex = url.indexOf("#");
        if (hashIndex !== -1) {
          const hash = url.substring(hashIndex);
          const { access_token, refresh_token } = parseHashParams(hash);

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) {
              console.error("Erro ao definir sessão:", error);
            }
          }
        }

        await Browser.close();
      }
    });

    return () => {
      handler.then((h) => h.remove());
    };
  }, []);

  const loginGoogle = async () => {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: DEEP_LINK_URL,
        },
      });

      if (error) {
        console.error("Erro ao gerar URL OAuth:", error);
        return;
      }

      await Browser.open({ url: data.url });
    } else {
      await supabase.auth.signInWithOAuth({
        provider: "google",
      });
    }
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
