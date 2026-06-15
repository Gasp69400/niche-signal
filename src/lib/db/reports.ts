import { createAdminClient } from "@/lib/supabase/admin";
import type { AnalyzeReport } from "@/types/market-report";

const CACHE_DAYS = 7;

export async function getCachedReport(
  domain: string
): Promise<(AnalyzeReport & { id: string; createdAt: string }) | null> {
  const supabase = createAdminClient();
  const trimmedDomain = domain.trim();
  const cutoff = new Date(Date.now() - CACHE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: match, error } = await supabase
    .from("reports")
    .select("id, domain, data, created_at")
    .ilike("domain", trimmedDomain)
    .gte("created_at", cutoff)
    .not("data", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !match?.data) {
    return null;
  }

  const report = match.data as AnalyzeReport;
  return {
    ...report,
    id: match.id,
    createdAt: match.created_at,
    cached: true,
  };
}

export async function saveReport(
  report: AnalyzeReport
): Promise<AnalyzeReport & { id: string; createdAt: string }> {
  const supabase = createAdminClient();

  const { data: savedReport, error: reportError } = await supabase
    .from("reports")
    .insert({
      domain: report.domain.trim(),
      data: report,
    })
    .select("id, created_at")
    .single();

  if (reportError || !savedReport) {
    throw new Error(reportError?.message ?? "Failed to save report");
  }

  return {
    ...report,
    id: savedReport.id,
    createdAt: savedReport.created_at,
    cached: false,
  };
}

export async function getReportById(
  id: string
): Promise<(AnalyzeReport & { id: string; createdAt: string }) | null> {
  const supabase = createAdminClient();

  const { data: report, error: reportError } = await supabase
    .from("reports")
    .select("id, domain, data, created_at")
    .eq("id", id)
    .single();

  if (reportError || !report || !report.data) {
    return null;
  }

  const stored = report.data as AnalyzeReport;
  return {
    ...stored,
    id: report.id,
    domain: report.domain,
    createdAt: report.created_at,
  };
}
