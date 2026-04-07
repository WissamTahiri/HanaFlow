import { createContext, useContext, useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Toutes les requêtes vers l'API incluent les cookies (refresh token httpOnly)
const apiFetch = (path, options = {}) =>
  fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  // Planifie un rafraîchissement automatique avant l'expiration du token
  const scheduleRefresh = (accessToken) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      // Rafraîchit 2 minutes avant expiration
      const delay = (payload.exp * 1000 - Date.now()) - 2 * 60 * 1000;
      if (delay > 0) {
        refreshTimerRef.current = setTimeout(() => silentRefresh(), delay);
      }
    } catch {
      // Token malformé, on ignore
    }
  };

  const setSession = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
    scheduleRefresh(newToken);
  };

  const clearSession = () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Essaie de renouveler silencieusement l'access token via le refresh token (cookie)
  const silentRefresh = async () => {
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

  // Restaure la session au montage de l'app
  useEffect(() => {
    // Nettoyage des anciennes clés localStorage utilisées avant la migration serveur
    localStorage.removeItem("hanaflow_plan");
    localStorage.removeItem("hf_xp");
    localStorage.removeItem("hf_badges");
    localStorage.removeItem("hf_streak");
    localStorage.removeItem("hf_last_login");
    localStorage.removeItem("hf_quiz_pass");

    const init = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const res = await apiFetch("/auth/me", {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setSession(storedToken, data.user);
            setLoading(false);
            return;
          }
        } catch { /* réseau indisponible */ }
      }

      // Access token absent ou expiré → tenter un refresh silencieux
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

  const login = async ({ email, password }) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erreur de connexion");
    setSession(data.token, data.user);
    return data.user;
  };

  const register = async ({ name, email, password }) => {
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
    // Invalide le refresh token côté serveur avant de nettoyer localement
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    clearSession();
  };

  const updateProfile = async ({ name, password }) => {
    const storedToken = localStorage.getItem("token");
    const res = await apiFetch("/auth/profile", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${storedToken}` },
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
        login,
        register,
        logout,
        updateProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
