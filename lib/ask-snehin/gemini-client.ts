/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Gemini Client
   Secure server-side Gemini Flash integration with budget
   tracking, timeouts, and graceful fallback.
   ═══════════════════════════════════════════════════════════════ */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IntentResult, KnowledgeRecord } from "./types";
import { buildPrompt } from "./prompt-engine";

// ── Configuration ────────────────────────────────────────────

const PRIMARY_GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const FALLBACK_GEMINI_MODEL = "gemini-3.6-flash";
const MAX_OUTPUT_TOKENS = 500;
const TEMPERATURE = 0.3; // Low temperature for factual, grounded responses
const TIMEOUT_MS = 8000; // 8-second timeout

// ── Daily Budget Tracking ────────────────────────────────────

interface BudgetState {
  date: string; // YYYY-MM-DD
  callCount: number;
}

const DAILY_BUDGET = 100;
let budgetState: BudgetState = {
  date: new Date().toISOString().split("T")[0],
  callCount: 0,
};

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function checkAndIncrementBudget(): boolean {
  const today = getTodayString();

  // Reset counter if it's a new day
  if (budgetState.date !== today) {
    budgetState = { date: today, callCount: 0 };
  }

  if (budgetState.callCount >= DAILY_BUDGET) {
    return false; // Budget exhausted
  }

  budgetState.callCount++;
  return true;
}

/**
 * Get current budget status.
 */
export function getBudgetStatus(): { remaining: number; total: number; date: string } {
  const today = getTodayString();
  if (budgetState.date !== today) {
    return { remaining: DAILY_BUDGET, total: DAILY_BUDGET, date: today };
  }
  return {
    remaining: Math.max(0, DAILY_BUDGET - budgetState.callCount),
    total: DAILY_BUDGET,
    date: budgetState.date,
  };
}

// ── Gemini Client ────────────────────────────────────────────

/**
 * Call Gemini Flash with a constructed prompt.
 * Returns the generated text or null if the call fails.
 */
export async function callGemini(
  userQuery: string,
  intent: IntentResult,
  relevantFacts: KnowledgeRecord[]
): Promise<{
  text: string | null;
  error?: string;
  budgetExhausted?: boolean;
}> {
  // Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      text: null,
      error: "Gemini API key not configured",
    };
  }

  // Check daily budget
  if (!checkAndIncrementBudget()) {
    return {
      text: null,
      error: "Daily Gemini budget exhausted",
      budgetExhausted: true,
    };
  }

  // Build the prompt
  const { systemPrompt, userPrompt } = buildPrompt(userQuery, intent, relevantFacts);

  try {
    // Create client
    const genAI = new GoogleGenerativeAI(apiKey);
    // Helper to generate with a specific model
    async function executeModel(modelName: string): Promise<string> {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          temperature: TEMPERATURE,
        },
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const result = await Promise.race([
          model.generateContent({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            systemInstruction: { role: "model", parts: [{ text: systemPrompt }] },
          }),
          new Promise<never>((_, reject) => {
            controller.signal.addEventListener("abort", () =>
              reject(new Error("Gemini request timed out"))
            );
          }),
        ]);
        clearTimeout(timeoutId);
        return result.response.text();
      } finally {
        clearTimeout(timeoutId);
      }
    }

    let text: string;
    try {
      text = await executeModel(PRIMARY_GEMINI_MODEL);
    } catch (primaryErr) {
      // If primary model failed and is different from fallback, try fallback
      if (PRIMARY_GEMINI_MODEL !== FALLBACK_GEMINI_MODEL) {
        try {
          text = await executeModel(FALLBACK_GEMINI_MODEL);
        } catch {
          throw primaryErr; // Rethrow primary error if fallback also fails
        }
      } else {
        throw primaryErr;
      }
    }

    if (!text || text.trim().length === 0) {
      return { text: null, error: "Gemini returned empty response" };
    }

    return { text: text.trim() };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    // Don't count failed requests against budget
    budgetState.callCount = Math.max(0, budgetState.callCount - 1);

    return { text: null, error: `Gemini call failed: ${message}` };
  }
}
