import { analyzeWithGemini } from "@/lib/ai/gemini-analyze";
import { buildAnalyzeUserMessage } from "@/lib/ai/build-user-message";
import { ANALYZE_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { extractJson } from "@/lib/ai/extract-json";
import { mapClaudeResponse } from "@/lib/reports/map-response";
import type { AnalyzeReport } from "@/types/market-report";

const AI_TEMPERATURE = 0.9;
const GROQ_MODEL = "llama-3.3-70b-versatile";
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

async function analyzeWithGroq(domain: string, apiKey: string): Promise<AnalyzeReport> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 8192,
      temperature: AI_TEMPERATURE,
      messages: [
        { role: "system", content: ANALYZE_SYSTEM_PROMPT },
        { role: "user", content: buildAnalyzeUserMessage(domain) },
      ],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("Groq API error:", response.status, errBody);
    throw new Error("Échec de l'analyse IA. Réessayez dans quelques instants.");
  }

  const payload = await response.json();
  const text = payload.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Réponse IA invalide");
  }

  return mapClaudeResponse(extractJson(text), domain);
}

async function analyzeWithClaude(domain: string, apiKey: string): Promise<AnalyzeReport> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 8192,
      system: ANALYZE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildAnalyzeUserMessage(domain),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("Claude API error:", response.status, errBody);
    throw new Error("Échec de l'analyse IA. Réessayez dans quelques instants.");
  }

  const payload = await response.json();
  const text = payload.content?.find(
    (block: { type: string }) => block.type === "text"
  )?.text;

  if (!text) {
    throw new Error("Réponse IA invalide");
  }

  return mapClaudeResponse(extractJson(text), domain);
}

/**
 * Priorité : Gemini (gratuit) → Groq (gratuit) → Claude (payant)
 */
export async function analyzeDomain(domain: string): Promise<AnalyzeReport> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (geminiKey) {
    return analyzeWithGemini(domain, geminiKey);
  }
  if (groqKey) {
    return analyzeWithGroq(domain, groqKey);
  }
  if (anthropicKey) {
    return analyzeWithClaude(domain, anthropicKey);
  }

  throw new Error(
    "Aucune clé IA configurée. Ajoutez GEMINI_API_KEY (gratuit) dans .env.local — voir https://aistudio.google.com/apikey"
  );
}

/** @deprecated Utiliser analyzeDomain */
export const analyzeDomainWithClaude = analyzeDomain;
