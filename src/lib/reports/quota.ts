import { countUserReportsThisMonth } from "@/lib/db/reports";
import { buildReportQuota } from "@/lib/plans";
import type { ReportQuota } from "@/types/report-quota";

export async function getUserReportQuota(userId: string): Promise<ReportQuota> {
  const used = await countUserReportsThisMonth(userId);
  return buildReportQuota(used);
}
