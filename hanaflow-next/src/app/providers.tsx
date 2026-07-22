"use client";

import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { GamificationProvider } from "@/context/GamificationContext";
import AnalyticsProvider from "@/components/AnalyticsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <GamificationProvider>
          <AnalyticsProvider />
          {children}
        </GamificationProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
