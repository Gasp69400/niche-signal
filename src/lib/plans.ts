export const PRO_MONTHLY_REPORT_LIMIT = 80;

export function getCurrentMonthStartIso(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export function getNextMonthResetIso(): string {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString();
}

export function hasReachedMonthlyReportLimit(used: number): boolean {
  return used >= PRO_MONTHLY_REPORT_LIMIT;
}

export function remainingMonthlyReports(used: number): number {
  return Math.max(0, PRO_MONTHLY_REPORT_LIMIT - used);
}

export function buildReportQuota(used: number) {
  return {
    limit: PRO_MONTHLY_REPORT_LIMIT,
    used,
    remaining: remainingMonthlyReports(used),
    isExceeded: hasReachedMonthlyReportLimit(used),
    periodStart: getCurrentMonthStartIso(),
    periodReset: getNextMonthResetIso(),
  };
}
