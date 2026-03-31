"use client";

import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

interface SubscriptionContextValue {
  plan: "free" | "pro";
  isPro: boolean;
  canAccess: (isPremium: boolean) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  const isPro = isAuthenticated && (user?.isPro ?? false);
  const plan: "free" | "pro" = isPro ? "pro" : "free";

  const canAccess = (isPremium: boolean) => {
    if (!isPremium) return true;
    if (!isAuthenticated) return false;
    return isPro;
  };

  return (
    <SubscriptionContext.Provider value={{ plan, isPro, canAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
};
