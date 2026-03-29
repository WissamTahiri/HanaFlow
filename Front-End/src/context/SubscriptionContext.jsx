import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [plan, setPlan] = useState("free");

  // Lire le plan depuis localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem("hanaflow_plan");
    if (saved === "pro") setPlan("pro");
  }, []);

  // Si l'utilisateur se déconnecte, pas besoin de downgrader —
  // le plan reste mais canAccess() vérifie l'auth.
  const upgradeToPro = () => {
    setPlan("pro");
    localStorage.setItem("hanaflow_plan", "pro");
  };

  const downgradeToFree = () => {
    setPlan("free");
    localStorage.setItem("hanaflow_plan", "free");
  };

  // Un utilisateur peut accéder au contenu si :
  // - le contenu est gratuit (isPremium = false), ou
  // - il est connecté ET a un plan Pro
  const canAccess = (isPremium) => {
    if (!isPremium) return true;
    if (!isAuthenticated) return false;
    return plan === "pro";
  };

  const isPro = isAuthenticated && plan === "pro";

  return (
    <SubscriptionContext.Provider value={{ plan, isPro, upgradeToPro, downgradeToFree, canAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);
