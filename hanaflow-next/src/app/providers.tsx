"use client";

import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { GamificationProvider } from "@/context/GamificationContext";
import { PostHogProvider } from "@/components/PostHogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <GamificationProvider>{children}</GamificationProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </PostHogProvider>
  );
}
