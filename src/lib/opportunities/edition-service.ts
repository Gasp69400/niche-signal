import { generateMonthlyOpportunities } from "@/lib/ai/generate-monthly-opportunities";
import {
  getCurrentEdition,
  getCurrentPeriod,
  getEditionByPeriod,
  saveEdition,
} from "@/lib/db/monthly-opportunities";
import type { MonthlyOpportunityEdition } from "@/types/monthly-opportunity";
import type { Locale } from "@/i18n/config";

export async function getOrCreateCurrentEdition(
  locale: Locale = "fr"
): Promise<MonthlyOpportunityEdition> {
  const { year, month } = getCurrentPeriod();
  const existing = await getEditionByPeriod(year, month);
  if (existing) {
    return existing;
  }

  const generated = await generateMonthlyOpportunities(year, month, locale);
  return saveEdition(year, month, generated);
}

export async function regenerateCurrentEdition(
  locale: Locale = "fr",
  force = false
): Promise<MonthlyOpportunityEdition> {
  const { year, month } = getCurrentPeriod();

  if (!force) {
    const existing = await getCurrentEdition();
    if (existing) {
      return existing;
    }
  }

  const generated = await generateMonthlyOpportunities(year, month, locale);
  return saveEdition(year, month, generated);
}
