"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { ReportQuotaProvider } from "@/contexts/ReportQuotaContext";
import { CheckoutReturnHandler } from "@/components/billing/SubscribeButton";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ReportQuotaProvider>
        <AuthModalProvider>
          {children}
          <CheckoutReturnHandler />
        </AuthModalProvider>
      </ReportQuotaProvider>
    </AuthProvider>
  );
}
