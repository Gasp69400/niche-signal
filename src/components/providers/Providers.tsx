"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { ReportQuotaProvider } from "@/contexts/ReportQuotaContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ReportQuotaProvider>
        <AuthModalProvider>{children}</AuthModalProvider>
      </ReportQuotaProvider>
    </AuthProvider>
  );
}
