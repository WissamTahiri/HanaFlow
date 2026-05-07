"use client";

import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { GamificationProvider } from "@/context/GamificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <GamificationProvider>{children}</GamificationProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
