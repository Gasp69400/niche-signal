import type { Plan } from "@/types/auth";

/** Temporairement ouvert aux comptes free pour les tests. Remettre `plan === "pro"` pour le paywall. */
export function canAccessReports(plan: Plan | null | undefined): boolean {
  return plan === "free" || plan === "pro";
}
