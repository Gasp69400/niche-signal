import {
  buildMonthlyOpportunitiesUserMessage,
  MONTHLY_OPPORTUNITIES_SYSTEM_PROMPT,
} from "@/lib/ai/monthly-opportunities-prompt";
import { resolveGeminiModels } from "@/lib/ai/response-quality";
import type { MonthlyOpportunityAiResponse } from "@/types/monthly-opportunity";

const AI_TEMPERATURE = 0.85;

function extractMonthlyJson(text: string): MonthlyOpportunityAiResponse {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : trimmed;
  const parsed = JSON.parse(jsonStr) as MonthlyOpportunityAiResponse;

  if (!Array.isArray(parsed.opportunities) || parsed.opportunities.length !== 5) {
    throw new Error("Réponse IA invalide : 5 opportunités attendues");
  }

  return {
    title: parsed.title?.trim() || "Opportunités du mois",
    subtitle: parsed.subtitle?.trim() || "",
    opportunities: parsed.opportunities
      .map((item, index) => ({
        rank: item.rank ?? index + 1,
        domain: item.domain?.trim() || `Niche ${index + 1}`,
        title: item.title?.trim() || item.domain?.trim() || `Opportunité ${index + 1}`,
        opportunityScore: Math.min(95, Math.max(40, Math.round(item.opportunityScore ?? 70))),
        marketSize: item.marketSize?.trim() || "—",
        competition: item.competition?.trim() || "Modérée",
        trend: item.trend?.trim() || "—",
        painLevel: Math.min(10, Math.max(1, Math.round(item.painLevel ?? 7))),
        highlight: item.highlight?.trim() || "",
        whyNow: item.whyNow?.trim() || "",
        topPainPoint: item.topPainPoint?.trim() || "",
        willingnessToPayEstimate: item.willingnessToPayEstimate?.trim() || "—",
        sources: Array.isArray(item.sources)
          ? item.sources.filter((s): s is string => typeof s === "string").slice(0, 4)
          : [],
      }))
      .sort((a, b) => a.rank - b.rank),
  };
}

async function callGeminiMonthly(
  model: string,
  apiKey: string,
  year: number,
  month: number,
  locale: "fr" | "en"
): Promise<MonthlyOpportunityAiResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: MONTHLY_OPPORTUNITIES_SYSTEM_PROMPT }],
      },
      contents: [
        {
          parts: [
            {
              text: buildMonthlyOpportunitiesUserMessage(year, month, locale),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: AI_TEMPERATURE,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini ${model} ${response.status}: ${errBody}`);
  }

  const payload = await response.json();
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error(`Réponse IA vide (${model})`);
  }

  return extractMonthlyJson(text);
}

export async function generateMonthlyOpportunities(
  year: number,
  month: number,
  locale: "fr" | "en" = "fr"
): Promise<MonthlyOpportunityAiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY non configurée");
  }

  const models = resolveGeminiModels();
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      return await callGeminiMonthly(model, apiKey, year, month, locale);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `[monthly-opportunities] ${model} échoué:`,
        lastError.message.slice(0, 120)
      );
    }
  }

  throw new Error(
    lastError?.message ??
      "Impossible de générer les opportunités du mois. Réessayez plus tard."
  );
}
