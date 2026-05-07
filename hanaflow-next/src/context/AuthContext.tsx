"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api`
  : "/api";

const apiFetch = (path: string, options: RequestInit = {}) =>
  fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });

interface ImpersonationInfo {
  id: number;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isImpersonating: boolean;
  impersonatedBy: ImpersonationInfo | null;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (data: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; password?: string }) => Promise<User>;
  startImpersonation: (data: { token: string; user: User; impersonatedBy: ImpersonationInfo }) => void;
  stopImpersonation: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [impersonatedBy, setImpersonatedBy] = useState<ImpersonationInfo | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = (accessToken: string, skip = false) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (skip) return;
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const delay = payload.exp * 1000 - Date.now() - 2 * 60 * 1000;
      if (delay > 0) {
        refreshTimerRef.current = setTimeout(() => silentRefresh(), delay);
      }
    } catch {
      // token malformé
    }
  };

  const setSession = (newToken: string, newUser: User, opts?: { skipRefresh?: boolean }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", newToken);
    }
    setToken(newToken);
    setUser(newUser);
    scheduleRefresh(newToken, opts?.skipRefresh);
  };

  const clearSession = () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    }
    setToken(null);
    setUser(null);
    setImpersonatedBy(null);
  };

  const silentRefresh = async (): Promise<boolean> => {
    try {
      const res = await apiFetch("/auth/refresh", { method: "POST" });
      if (!res.ok) { clearSession(); return false; }
      const data = await res.json();
      setSession(data.token, data.user);
      return true;
    } catch {
      clearSession();
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      const storedToken =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const adminToken =
        typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

      if (storedToken) {
        // Détecter mode impersonation depuis le token JWT
        const impInfo = decodeImpersonatedBy(storedToken);

        try {
          const res = await apiFetch("/auth/me", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setSession(storedToken, data.user, { skipRefresh: Boolean(impInfo) });
            setImpersonatedBy(impInfo);
            setLoading(false);
            return;
          }
        } catch {
          // réseau indisponible
        }

        // Si on était en impersonation et que le token est invalide, restaurer l'admin
        if (impInfo && adminToken) {
          try {
            const res = await apiFetch("/auth/me", {
              headers: { Authorization: `Bearer ${adminToken}` },
            });
            if (res.ok) {
              const data = await res.json();
              localStorage.removeItem("admin_token");
              localStorage.removeItem("admin_user");
              setSession(adminToken, data.user);
              setLoading(false);
              return;
            }
          } catch {
            // ignored
          }
        }
      }

      const refreshed = await silentRefresh();
      if (!refreshed) clearSession();
      setLoading(false);
    };

    init();

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de connexion");
    setSession(data.token, data.user);
    return data.user;
  };

  const register = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de l'inscription");
    setSession(data.token, data.user);
    return data.user;
  };

  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    clearSession();
  };

  const startImpersonation = ({
    token: impToken,
    user: targetUser,
    impersonatedBy: by,
  }: {
    token: string;
    user: User;
    impersonatedBy: ImpersonationInfo;
  }) => {
    if (typeof window === "undefined") return;
    // Sauvegarder le contexte admin courant
    if (token) localStorage.setItem("admin_token", token);
    if (user) localStorage.setItem("admin_user", JSON.stringify(user));
    setImpersonatedBy(by);
    setSession(impToken, targetUser, { skipRefresh: true });
  };

  const stopImpersonation = async () => {
    if (typeof window === "undefined") return;
    const adminToken = localStorage.getItem("admin_token");
    const adminUserStr = localStorage.getItem("admin_user");
    if (adminToken && adminUserStr) {
      try {
        const adminUser = JSON.parse(adminUserStr) as User;
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setImpersonatedBy(null);
        setSession(adminToken, adminUser);
        return;
      } catch {
        // fallback : tenter de récupérer via refresh
      }
    }
    // Si aucun admin_token sauvegardé, on tente un silent refresh
    setImpersonatedBy(null);
    const refreshed = await silentRefresh();
    if (!refreshed) clearSession();
  };

  const updateProfile = async ({
    name,
    password,
  }: {
    name?: string;
    password?: string;
  }) => {
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await apiFetch("/auth/profile", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${storedToken ?? ""}` },
      body: JSON.stringify({ name, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur lors de la mise à jour");
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isImpersonating: !!impersonatedBy,
        impersonatedBy,
        login,
        register,
        logout,
        updateProfile,
        startImpersonation,
        stopImpersonation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function decodeImpersonatedBy(token: string): ImpersonationInfo | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload?.impersonatedBy?.id && payload.impersonatedBy.email) {
      return { id: payload.impersonatedBy.id, email: payload.impersonatedBy.email };
    }
    return null;
  } catch {
    return null;
  }
}
