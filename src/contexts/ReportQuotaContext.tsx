"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api/fetch";
import type { ReportQuota } from "@/types/report-quota";

interface ReportQuotaContextValue {
  quota: ReportQuota | null;
  loading: boolean;
  refreshQuota: () => Promise<void>;
}

const ReportQuotaContext = createContext<ReportQuotaContextValue | null>(null);

export function ReportQuotaProvider({ children }: { children: React.ReactNode }) {
  const { user, canAnalyze, loading: authLoading } = useAuth();
  const [quota, setQuota] = useState<ReportQuota | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshQuota = useCallback(async () => {
    if (!user || !canAnalyze) {
      setQuota(null);
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/api/reports/quota");
      if (res.ok) {
        const data: ReportQuota = await res.json();
        setQuota(data);
      } else {
        setQuota(null);
      }
    } catch {
      setQuota(null);
    } finally {
      setLoading(false);
    }
  }, [user, canAnalyze]);

  useEffect(() => {
    if (authLoading) return;
    void refreshQuota();
  }, [authLoading, refreshQuota]);

  return (
    <ReportQuotaContext.Provider value={{ quota, loading, refreshQuota }}>
      {children}
    </ReportQuotaContext.Provider>
  );
}

export function useReportQuota() {
  const ctx = useContext(ReportQuotaContext);
  if (!ctx) {
    throw new Error("useReportQuota must be used within ReportQuotaProvider");
  }
  return ctx;
}
