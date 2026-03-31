"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface SubscriptionContextValue {
  plan: "free" | "pro";
  isPro: boolean;
  upgradeToPro: () => void;
  downgradeToFree: () => void;
  canAccess: (isPremium: boolean) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [plan, setPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    const saved = localStorage.getItem("hanaflow_plan");
    if (saved === "pro") setPlan("pro");
  }, []);

  const upgradeToPro = () => {
    setPlan("pro");
    localStorage.setItem("hanaflow_plan", "pro");
  };

  const downgradeToFree = () => {
    setPlan("free");
    localStorage.setItem("hanaflow_plan", "free");
  };

  const canAccess = (isPremium: boolean) => {
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

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
};
