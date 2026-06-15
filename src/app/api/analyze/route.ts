import { NextRequest, NextResponse } from "next/server";
import { analyzeDomain } from "@/lib/ai/analyze-domain";
import { getAuthenticatedUser, userCanAnalyze } from "@/lib/auth/server";
import { getCachedReport, saveReport } from "@/lib/db/reports";

export async function POST(request: NextRequest) {
  const { domain, refresh } = await request.json();

  if (!domain?.trim()) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 });
  }

  const allowed = await userCanAnalyze();
  if (!allowed) {
    return NextResponse.json(
      { error: "Connexion requise pour générer un rapport" },
      { status: 401 }
    );
  }

  const user = await getAuthenticatedUser();
  const trimmedDomain = domain.trim();

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
          }
        }
        return NextResponse.json({ ...cached, cached: true });
      }
    }

    const report = await analyzeDomain(trimmedDomain);

    try {
      const savedReport = await saveReport(report, user?.id);
      return NextResponse.json(savedReport);
    } catch (saveError) {
      console.error("Failed to save report:", saveError);
      return NextResponse.json(report);
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
