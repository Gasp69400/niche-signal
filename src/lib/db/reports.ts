import { createAdminClient } from "@/lib/supabase/admin";
import type { AnalyzeReport } from "@/types/market-report";
import type { ReportSummary } from "@/types/report-summary";

const CACHE_DAYS = 7;

interface ReportRow {
  id: string;
  domain: string;
  data: AnalyzeReport | null;
  opportunity_score: number | null;
  market_size: string | null;
  competition: string | null;
  created_at: string;
  user_id: string | null;
  is_favorite: boolean | null;
}

function mapRowToSummary(row: ReportRow): ReportSummary {
  const stored = row.data;
  return {
    id: row.id,
    domain: row.domain,
    opportunityScore:
      stored?.opportunityScore ?? row.opportunity_score ?? 0,
    marketSize: stored?.marketSize ?? row.market_size ?? "—",
    competition: stored?.competition ?? row.competition ?? "—",
    createdAt: row.created_at,
    isFavorite: row.is_favorite ?? false,
  };
}

function mapRowToReport(row: ReportRow): AnalyzeReport & { id: string; createdAt: string } {
  if (row.data) {
    return {
      ...(row.data as AnalyzeReport),
      id: row.id,
      domain: row.domain,
      createdAt: row.created_at,
      isFavorite: row.is_favorite ?? false,
    };
  }

  return {
    id: row.id,
    domain: row.domain,
    opportunityScore: row.opportunity_score ?? 0,
    marketSize: row.market_size ?? "—",
    competition: row.competition ?? "—",
    buildDifficulty: "—",
    trend: "—",
    trendPercent: "—",
    painPoints: [],
    competitors: [],
    verdict: "",
    marketTrend: { data: [], sixMonthChange: 0, trend: "—" },
    radar: [],
    persona: {
      role: "—",
      frustration: "—",
      currentTool: "—",
      willingnessToPay: "—",
      whereToFind: "—",
    },
    positioning: { oneLiner: "—", differentiators: [] },
    similarNiches: [],
    createdAt: row.created_at,
    isFavorite: row.is_favorite ?? false,
  };
}

export async function getCachedReport(
  domain: string
): Promise<(AnalyzeReport & { id: string; createdAt: string }) | null> {
  const supabase = createAdminClient();
  const trimmedDomain = domain.trim();
  const cutoff = new Date(Date.now() - CACHE_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data: match, error } = await supabase
    .from("reports")
    .select("id, domain, data, opportunity_score, market_size, competition, created_at, user_id, is_favorite")
    .ilike("domain", trimmedDomain)
    .gte("created_at", cutoff)
    .not("data", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !match) {
    return null;
  }

  return mapRowToReport(match as ReportRow);
}

export async function saveReport(
  report: AnalyzeReport,
  userId?: string
): Promise<AnalyzeReport & { id: string; createdAt: string }> {
  const supabase = createAdminClient();

  const payload: Record<string, unknown> = {
    domain: report.domain.trim(),
    data: report,
    opportunity_score: report.opportunityScore ?? 0,
    market_size: report.marketSize ?? "—",
    competition: report.competition ?? "—",
    build_difficulty: report.buildDifficulty ?? "—",
    verdict: report.verdict ?? "",
    user_id: userId,
  };

  if (!userId) {
    throw new Error("Utilisateur requis pour enregistrer le rapport");
  }

  const { data: savedReport, error: reportError } = await supabase
    .from("reports")
    .insert(payload)
    .select("id, created_at")
    .single();

  if (reportError || !savedReport) {
    const message = reportError?.message ?? "Failed to save report";
    if (message.includes("'data'") || message.includes("schema cache")) {
      throw new Error(
        "Base de données non à jour : exécute la migration SQL dans Supabase (colonne data manquante sur reports)."
      );
    }
    throw new Error(message);
  }

  return {
    ...report,
    id: savedReport.id,
    createdAt: savedReport.created_at,
    cached: false,
  };
}

export async function getReportsByUser(
  userId: string,
  options?: { search?: string; favoritesOnly?: boolean }
): Promise<ReportSummary[]> {
  const supabase = createAdminClient();
  const search = options?.search;
  const favoritesOnly = options?.favoritesOnly;

  let query = supabase
    .from("reports")
    .select("id, domain, data, opportunity_score, market_size, competition, created_at, user_id, is_favorite")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (favoritesOnly) {
    query = query.eq("is_favorite", true);
  }

  if (search?.trim()) {
    query = query.ilike("domain", `%${search.trim()}%`);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return (data as ReportRow[]).map(mapRowToSummary);
}

export async function setReportFavorite(
  reportId: string,
  userId: string,
  isFavorite: boolean
): Promise<boolean> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("reports")
    .update({ is_favorite: isFavorite })
    .eq("id", reportId)
    .eq("user_id", userId)
    .select("is_favorite")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to update favorite");
  }

  return Boolean(data.is_favorite);
}

export async function getReportById(
  id: string,
  userId?: string
): Promise<(AnalyzeReport & { id: string; createdAt: string }) | null> {
  const supabase = createAdminClient();

  const { data: report, error: reportError } = await supabase
    .from("reports")
    .select("id, domain, data, opportunity_score, market_size, competition, created_at, user_id, is_favorite")
    .eq("id", id)
    .single();

  if (reportError || !report) {
    return null;
  }

  const row = report as ReportRow;

  if (userId && row.user_id && row.user_id !== userId) {
    return null;
  }

  return mapRowToReport(row);
}
