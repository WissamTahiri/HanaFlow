import { createContext, useContext, useCallback } from "react";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { user, token, setUser } = useAuth();

  const plan = user?.plan ?? "free";
  const isPro = !!user && plan === "pro";

  // Upgrade vers Pro — appelle le backend, met à jour l'objet user dans AuthContext
  const upgradeToPro = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`${API_URL}/auth/upgrade`, {
      method: "POST",
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Impossible d'activer le plan Pro");
    const data = await res.json();
    setUser(data.user);
  }, [token, setUser]);

  // Downgrade vers Free
  const downgradeToFree = useCallback(async () => {
    if (!token) return;
    const res = await fetch(`${API_URL}/auth/downgrade`, {
      method: "POST",
      credentials: "include",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Impossible de downgrader le plan");
    const data = await res.json();
    setUser(data.user);
  }, [token, setUser]);

  const canAccess = (isPremium) => {
    if (!isPremium) return true;
    if (!user) return false;
    return isPro;
  };

  return (
    <SubscriptionContext.Provider value={{ plan, isPro, upgradeToPro, downgradeToFree, canAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);
