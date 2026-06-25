import type { Plan } from "@/types/auth";

/** Accès réservé au plan Pro. */
export function canAccessReports(plan: Plan | null | undefined): boolean {
  return plan === "pro";
}

/** Export PDF réservé au plan Pro. */
export function canExportPdf(plan: Plan | null | undefined): boolean {
  return plan === "pro";
}
