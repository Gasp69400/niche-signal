import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, userCanAnalyze } from "@/lib/auth/server";
import { getUserReportQuota } from "@/lib/reports/quota";
import { PRO_MONTHLY_REPORT_LIMIT } from "@/lib/plans";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 });
  }

  const allowed = await userCanAnalyze(request);
  if (!allowed) {
    return NextResponse.json(
      {
        limit: PRO_MONTHLY_REPORT_LIMIT,
        used: 0,
        remaining: 0,
        isExceeded: true,
        periodStart: null,
        periodReset: null,
        requiresPro: true,
      },
      { status: 403 }
    );
  }

  const quota = await getUserReportQuota(user.id);
  return NextResponse.json(quota);
}
