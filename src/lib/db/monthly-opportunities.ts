import { createAdminClient } from "@/lib/supabase/admin";
import type {
  MonthlyOpportunityAiResponse,
  MonthlyOpportunityEdition,
  MonthlyOpportunityItem,
} from "@/types/monthly-opportunity";

interface EditionRow {
  id: string;
  year: number;
  month: number;
  title: string;
  subtitle: string;
  data: { opportunities: MonthlyOpportunityItem[] };
  generated_at: string;
}

function mapRow(row: EditionRow): MonthlyOpportunityEdition {
  return {
    id: row.id,
    year: row.year,
    month: row.month,
    title: row.title,
    subtitle: row.subtitle,
    opportunities: row.data?.opportunities ?? [],
    generatedAt: row.generated_at,
  };
}

export function getCurrentPeriod() {
  const now = new Date();
  return {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth() + 1,
  };
}

export async function getEditionByPeriod(
  year: number,
  month: number
): Promise<MonthlyOpportunityEdition | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("monthly_opportunity_editions")
    .select("id, year, month, title, subtitle, data, generated_at")
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapRow(data as EditionRow);
}

export async function getCurrentEdition(): Promise<MonthlyOpportunityEdition | null> {
  const { year, month } = getCurrentPeriod();
  return getEditionByPeriod(year, month);
}

export async function saveEdition(
  year: number,
  month: number,
  payload: MonthlyOpportunityAiResponse
): Promise<MonthlyOpportunityEdition> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("monthly_opportunity_editions")
    .upsert(
      {
        year,
        month,
        title: payload.title,
        subtitle: payload.subtitle,
        data: { opportunities: payload.opportunities },
        generated_at: new Date().toISOString(),
      },
      { onConflict: "year,month" }
    )
    .select("id, year, month, title, subtitle, data, generated_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Impossible d'enregistrer l'édition mensuelle");
  }

  return mapRow(data as EditionRow);
}
