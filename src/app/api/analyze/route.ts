import { NextRequest, NextResponse } from "next/server";
import { analyzeDomain } from "@/lib/ai/analyze-domain";
import { getAuthenticatedUser, userCanAnalyze } from "@/lib/auth/server";
import {
  countUserReportsThisMonth,
  getCachedReport,
  saveReport,
} from "@/lib/db/reports";
import {
  hasReachedMonthlyReportLimit,
  PRO_MONTHLY_REPORT_LIMIT,
} from "@/lib/plans";

export async function POST(request: NextRequest) {
  const { domain, refresh } = await request.json();

  if (!domain?.trim()) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const allowed = await userCanAnalyze(request);
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Connexion requise pour générer un rapport" },
      { status: 401 }
    );
  }

  if (!allowed) {
    return NextResponse.json(
      { error: "Abonnement Pro requis pour générer un rapport" },
      { status: 403 }
    );
  }

  const trimmedDomain = domain.trim();

  const usedThisMonth = await countUserReportsThisMonth(user.id);
  if (hasReachedMonthlyReportLimit(usedThisMonth)) {
    return NextResponse.json(
      {
        error: `Limite mensuelle atteinte (${PRO_MONTHLY_REPORT_LIMIT} rapports/mois). Renouvellement le 1er du mois.`,
        code: "QUOTA_EXCEEDED",
        limit: PRO_MONTHLY_REPORT_LIMIT,
        used: usedThisMonth,
      },
      { status: 429 }
    );
  }

  try {
    if (!refresh) {
      const cached = await getCachedReport(trimmedDomain);
      if (cached) {
        if (user) {
          try {
            const saved = await saveReport(cached, user.id);
            return NextResponse.json({ ...cached, ...saved, cached: true });
          } catch (saveError) {
            console.error("Failed to link cached report to user:", saveError);
            const message =
              saveError instanceof Error ? saveError.message : "Échec sauvegarde";
            return NextResponse.json({ error: message }, { status: 500 });
          }
        }
        return NextResponse.json({ ...cached, cached: true });
      }
    }

    const report = await analyzeDomain(trimmedDomain);

    try {
      const savedReport = await saveReport(report, user.id);
      return NextResponse.json(savedReport);
    } catch (saveError) {
      console.error("Failed to save report:", saveError);
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Impossible d'enregistrer le rapport";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (error) {
    console.error("Analysis failed:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Impossible de générer le rapport. Réessayez.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
