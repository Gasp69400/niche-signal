export interface ReportQuota {
  limit: number;
  used: number;
  remaining: number;
  isExceeded: boolean;
  periodStart: string;
  periodReset: string;
}
