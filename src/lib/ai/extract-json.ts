import type { ClaudeAnalyzeResponse } from "@/types/claude-response";

export function extractJson(text: string): ClaudeAnalyzeResponse {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : trimmed;
  return JSON.parse(jsonStr) as ClaudeAnalyzeResponse;
}
