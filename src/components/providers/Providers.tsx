"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthModalProvider>{children}</AuthModalProvider>
    </AuthProvider>
  );
}
