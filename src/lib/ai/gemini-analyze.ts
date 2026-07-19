import { buildAnalyzeUserMessage } from "@/lib/ai/build-user-message";
import {
  buildAntiGenericMessage,
  isGenericResponse,
  resolveGeminiModels,
} from "@/lib/ai/response-quality";
import { ANALYZE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { extractJson } from "@/lib/ai/extract-json";
import { mapClaudeResponse } from "@/lib/reports/map-response";
import type { AnalyzeReport } from "@/types/market-report";
import type { ClaudeAnalyzeResponse } from "@/types/claude-response";

const AI_TEMPERATURE = 0.9;
const MAX_RETRIES_PER_MODEL = 2;

async function callGeminiModel(
  model: string,
  apiKey: string,
  domain: string,
  extraInstruction?: string
): Promise<ClaudeAnalyzeResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const userMessage = extraInstruction
    ? `${buildAnalyzeUserMessage(domain)}\n\n${extraInstruction}`
    : buildAnalyzeUserMessage(domain);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: ANALYZE_SYSTEM_PROMPT }],
      },
      contents: [
        {
          parts: [{ text: userMessage }],
        },
      ],
      generationConfig: {
        temperature: AI_TEMPERATURE,
        maxOutputTokens: 8192,
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

  return extractJson(text);
}

export async function analyzeWithGemini(
  domain: string,
  apiKey: string
): Promise<AnalyzeReport> {
  const models = resolveGeminiModels();
  let lastError: Error | null = null;

  for (const model of models) {
    for (let attempt = 0; attempt <= MAX_RETRIES_PER_MODEL; attempt++) {
      try {
        const extraInstruction =
          attempt > 0 ? buildAntiGenericMessage(domain, attempt) : undefined;

        const parsed = await callGeminiModel(model, apiKey, domain, extraInstruction);

        if (isGenericResponse(parsed) && attempt < MAX_RETRIES_PER_MODEL) {
          console.warn(
            `[analyze] Score générique 78 avec ${model}, retry ${attempt + 1}...`
          );
          continue;
        }

        if (!isGenericResponse(parsed) || model === models[models.length - 1]) {
          return mapClaudeResponse(parsed, domain);
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`[analyze] ${model} échoué:`, lastError.message.slice(0, 120));
        break;
      }
    }
  }

  throw new Error(
    lastError?.message ??
      "Échec de l'analyse IA. Réessayez dans quelques instants."
  );
}
