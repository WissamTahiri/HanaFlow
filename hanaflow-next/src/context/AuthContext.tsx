"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { User } from "@/types";
import { identifyUser, trackEvent } from "@/lib/analytics";

const API_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api`
  : "/api";

/** Lit le cookie CSRF (non-httpOnly) pour le renvoyer en header X-CSRF-Token. */
function readCsrfCookie(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

const apiFetch = (path: string, options: RequestInit = {}) => {
  const csrf = readCsrfCookie();
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(csrf ? { "X-CSRF-Token": csrf } : {}),
      ...options.headers,
    },
  });
};

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
  login: (credentials: { email: string; password: string; totpCode?: string }) => Promise<User>;
  register: (data: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; password?: string; currentPassword?: string; totpCode?: string }) => Promise<User>;
  startImpersonation: (data: { token: string; user: User; impersonatedBy: ImpersonationInfo }) => void;
  stopImpersonation: () => Promise<void>;
  /**
   * Renvoie le token courant (utile pour les fetch sortants). Si null, refresh-le silencieusement.
   * Tokens vivent UNIQUEMENT en mémoire React — jamais dans localStorage (résistance XSS).
   */
  getToken: () => Promise<string | null>;
  /**
   * Fetch authentifié : injecte le bearer courant et, sur 401, tente UN refresh
   * silencieux puis rejoue la requête. Empêche la perte silencieuse d'écritures
   * quand le token expire en cours de session (ex : résultat d'un examen long
   * soumis après l'expiration du token). `path` est une URL complète (ex.
   * "/api/quiz/submit"), pas préfixée par API_URL.
   */
  authFetch: (path: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

interface AdminBackup {
  token: string;
  user: User;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Token en mémoire React UNIQUEMENT (state + ref pour accès synchrone)
  const tokenRef = useRef<string | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [impersonatedBy, setImpersonatedBy] = useState<ImpersonationInfo | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshPromiseRef = useRef<Promise<boolean> | null>(null);
  // État admin sauvegardé pendant une impersonation. En mémoire UNIQUEMENT
  // (jamais sessionStorage/localStorage : résistance XSS, cf. getToken ci-dessus).
  // Si perdu (ex. rechargement de page pendant l'impersonation), stopImpersonation()
  // retombe sur un silent refresh via le cookie httpOnly de l'admin, resté intact
  // puisqu'aucun refresh n'est déclenché pendant l'impersonation (skipRefresh: true).
  const adminBackupRef = useRef<AdminBackup | null>(null);

  const setToken = (value: string | null) => {
    tokenRef.current = value;
    setTokenState(value);
  };

  const scheduleRefresh = (accessToken: string, skip = false) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    if (skip) return;
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const delay = payload.exp * 1000 - Date.now() - 2 * 60 * 1000;
      if (delay > 0) {
        refreshTimerRef.current = setTimeout(() => {
          void silentRefresh();
        }, delay);
      }
    } catch {
      // token malformé
    }
  };

  const setSession = (newToken: string, newUser: User, opts?: { skipRefresh?: boolean }) => {
    setToken(newToken);
    setUser(newUser);
    scheduleRefresh(newToken, opts?.skipRefresh);
  };

  const clearSession = () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    adminBackupRef.current = null;
    setToken(null);
    setUser(null);
    setImpersonatedBy(null);
  };

  // Déduplique les refreshs concurrents (si plusieurs composants demandent en parallèle)
  const silentRefresh = async (): Promise<boolean> => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;
    const promise = (async () => {
      try {
        const res = await apiFetch("/auth/refresh", { method: "POST" });
        if (!res.ok) {
          clearSession();
          return false;
        }
        const data = await res.json();
        setSession(data.token, data.user);
        return true;
      } catch {
        clearSession();
        return false;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();
    refreshPromiseRef.current = promise;
    return promise;
  };

  useEffect(() => {
    const init = async () => {
      // Plus de lecture localStorage. On démarre toujours par un silent refresh
      // qui utilise le cookie httpOnly (inaccessible aux scripts).
      await silentRefresh();
      setLoading(false);
    };

    void init();

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({
    email,
    password,
    totpCode,
  }: {
    email: string;
    password: string;
    totpCode?: string;
  }) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, totpCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.message || "Erreur de connexion") as Error & { requires2fa?: boolean };
      if (data.requires2fa) error.requires2fa = true;
      throw error;
    }
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
    identifyUser(data.user.id);
    trackEvent("signup_completed");
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
    // Sauvegarder le contexte admin courant en mémoire (jamais persisté)
    if (tokenRef.current && user) {
      adminBackupRef.current = { token: tokenRef.current, user };
    }
    setImpersonatedBy(by);
    // Pas de refresh auto pendant l'impersonation : le token a une durée fixe de 15 min
    setSession(impToken, targetUser, { skipRefresh: true });
  };

  const stopImpersonation = async () => {
    if (typeof window === "undefined") return;
    const backup = adminBackupRef.current;
    if (backup) {
      adminBackupRef.current = null;
      setImpersonatedBy(null);
      setSession(backup.token, backup.user);
      return;
    }
    // Si pas de backup admin (ex. rechargement de page pendant l'impersonation), fallback sur refresh
    setImpersonatedBy(null);
    const refreshed = await silentRefresh();
    if (!refreshed) clearSession();
  };

  const updateProfile = async ({
    name,
    password,
    currentPassword,
    totpCode,
  }: {
    name?: string;
    password?: string;
    currentPassword?: string;
    totpCode?: string;
  }) => {
    const res = await apiFetch("/auth/profile", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${tokenRef.current ?? ""}` },
      body: JSON.stringify({ name, password, currentPassword, totpCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      const e = new Error(data.message || "Erreur lors de la mise à jour") as Error & {
        requires2fa?: boolean;
        requiresCurrentPassword?: boolean;
      };
      // Le serveur renvoie 401 + message spécifique si current pwd manquant ou TOTP requis
      if (res.status === 401 && /actuel/i.test(data.message ?? "")) e.requiresCurrentPassword = true;
      if (res.status === 401 && /2FA|totp/i.test(data.message ?? "")) e.requires2fa = true;
      throw e;
    }
    // Si le mot de passe a été changé, le serveur a roté la session : on adopte le nouveau token
    if (data.rotated && data.token) {
      setSession(data.token, data.user);
    } else {
      setUser(data.user);
    }
    return data.user;
  };

  const getToken = async (): Promise<string | null> => {
    if (tokenRef.current) return tokenRef.current;
    const ok = await silentRefresh();
    return ok ? tokenRef.current : null;
  };

  const authFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
    const send = (bearer: string | null) =>
      fetch(path, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
          ...options.headers,
        },
      });
    let res = await send(await getToken());
    // Token présent mais expiré → 401 : getToken() ne rafraîchit pas un token
    // non-null, donc on force un refresh puis on rejoue une seule fois.
    if (res.status === 401) {
      const refreshed = await silentRefresh();
      if (refreshed) res = await send(tokenRef.current);
    }
    return res;
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
        getToken,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
