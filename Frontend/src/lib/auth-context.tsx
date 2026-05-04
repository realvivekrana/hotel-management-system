import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "./api";
import type { AuthSession } from "./types";

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthSession>;
  signup: (username: string, email: string, password: string) => Promise<AuthSession>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(authApi.current());
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const s = await authApi.login({ email, password });
    setSession(s);
    return s;
  };
  const signup = async (username: string, email: string, password: string) => {
    const s = await authApi.signup({ username, email, password });
    setSession(s);
    return s;
  };
  const logout = () => {
    authApi.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}