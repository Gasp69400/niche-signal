import type { Plan } from "@/types/auth";

/** Temporairement ouvert aux comptes free pour les tests. Remettre `plan === "free"` seul pour le paywall. */
export function canAccessReports(plan: Plan | null | undefined): boolean {
  return plan === "free" || plan === "pro";
}

/** Export PDF réservé au plan Pro. */
export function canExportPdf(plan: Plan | null | undefined): boolean {
  return plan === "pro";
}
