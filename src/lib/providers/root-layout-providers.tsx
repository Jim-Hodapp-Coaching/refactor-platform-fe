"use client";

import { ThemeProvider } from "@/components/ui/providers";
import { AuthStoreProvider } from "@/lib/providers/auth-store-provider";
import { AppStateStoreProvider } from "@/lib/providers/app-state-store-provider";

export function RootLayoutProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Provides single AuthStore & AppStateStore instances to all child pages/components/functions */}
      <AuthStoreProvider>
        <AppStateStoreProvider>{children}</AppStateStoreProvider>
      </AuthStoreProvider>
    </ThemeProvider>
  );
}
