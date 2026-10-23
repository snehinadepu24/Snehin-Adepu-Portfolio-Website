/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — API Route Handler
   POST /api/ask-snehin
   Pipeline: validate → rate-limit → exact-match → semantic →
             intent → knowledge → gemini → respond
   ═══════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from "next/server";
import type { AskSnehinRequest, AskSnehinResponse } from "@/lib/ask-snehin/types";
import { exactMatchFAQ, getFAQById } from "@/lib/ask-snehin/faq-database";
import { findBestMatch, getRelatedQuestions } from "@/lib/ask-snehin/semantic-search";
import { classifyIntent } from "@/lib/ask-snehin/intent-classifier";
import { getKnowledgeByCategories, getKnowledgeByTags } from "@/lib/ask-snehin/knowledge-base";
import { callGemini } from "@/lib/ask-snehin/gemini-client";
import { checkRateLimit, validateInput, fallbackResponses } from "@/lib/ask-snehin/rate-limiter";

// ── Helpers ──────────────────────────────────────────────────

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function jsonResponse(data: AskSnehinResponse, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

// ── Route Handler ────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const ip = getClientIP(request);

  // 1. Rate limit check (general)
  const generalLimit = checkRateLimit(ip, "general");
  if (!generalLimit.allowed) {
    return jsonResponse(
      {
        success: false,
        message: fallbackResponses.rateLimit,
        source: "fallback",
        error: "Rate limit exceeded",
      },
      429
    );
  }

  // 2. Parse and validate input
  let body: AskSnehinRequest;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      {
        success: false,
        message: "Invalid request format.",
        source: "fallback",
        error: "Invalid JSON",
      },
      400
    );
  }

  const validation = validateInput(body.message);
  if (!validation.valid) {
    return jsonResponse(
      {
        success: false,
        message: validation.error || "Invalid input.",
        source: "fallback",
        error: validation.error,
      },
      400
    );
  }

  const query = validation.sanitized;

  // 3. Try exact FAQ match
  const exactMatch = exactMatchFAQ(query);
  if (exactMatch) {
    const suggestions = getFollowUpSuggestions(exactMatch.relatedQuestions);
    return jsonResponse({
      success: true,
      message: exactMatch.answer,
      source: "faq",
      links: exactMatch.relatedLinks,
      suggestions,
    });
  }

  // 4. Try semantic FAQ match
  const semanticResult = findBestMatch(query);

  if (semanticResult.confidence === "high" && semanticResult.faq) {
    const suggestions = getFollowUpSuggestions(semanticResult.faq.relatedQuestions);
    return jsonResponse({
      success: true,
      message: semanticResult.faq.answer,
      source: "semantic",
      links: semanticResult.faq.relatedLinks,
      suggestions,
    });
  }

  // 5. Medium confidence — still return the FAQ but note it might not be perfect
  if (semanticResult.confidence === "medium" && semanticResult.faq) {
    const suggestions = getFollowUpSuggestions(semanticResult.faq.relatedQuestions);
    return jsonResponse({
      success: true,
      message: semanticResult.faq.answer,
      source: "semantic",
      links: semanticResult.faq.relatedLinks,
      suggestions,
    });
  }

  // 6. No FAQ match — need Gemini. Check Gemini rate limit.
  const geminiLimit = checkRateLimit(ip, "gemini");
  if (!geminiLimit.allowed) {
    // Return a useful fallback instead of an error
    return jsonResponse({
      success: true,
      message: fallbackResponses.budgetExhausted,
      source: "fallback",
      links: [
        { label: "Email Snehin", url: "mailto:adepu.snehin@gmail.com" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
        { label: "GitHub", url: "https://github.com/snehinadepu24" },
      ],
      suggestions: [
        "What are Snehin's technical skills?",
        "Tell me about his internships",
        "What are his best projects?",
      ],
    });
  }

  // 7. Classify intent
  const intent = classifyIntent(query);

  // 8. Retrieve relevant knowledge (always include contact links for complete grounding)
  const contactFacts = getKnowledgeByCategories(["links"]);
  const categoryFacts = getKnowledgeByCategories(intent.knowledgeTopics);

  // Also try tag-based retrieval from query keywords
  const queryWords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const tagFacts = getKnowledgeByTags(queryWords);

  // Merge and deduplicate
  const allFactIds = new Set<string>();
  const relevantFacts = [...categoryFacts, ...tagFacts, ...contactFacts].filter((f) => {
    if (allFactIds.has(f.id)) return false;
    allFactIds.add(f.id);
    return true;
  });

  // 9. Call Gemini
  const geminiResult = await callGemini(query, intent, relevantFacts);

  if (geminiResult.text) {
    // Collect relevant links from the knowledge records used
    const links = relevantFacts
      .flatMap((f) => f.links || [])
      .filter((link, idx, arr) =>
        arr.findIndex((l) => l.url === link.url) === idx
      )
      .slice(0, 4);

    const relatedQuestions = getRelatedQuestions(query, undefined, 3);

    return jsonResponse({
      success: true,
      message: geminiResult.text,
      source: "gemini",
      links: links.length > 0 ? links : undefined,
      suggestions: relatedQuestions.length > 0 ? relatedQuestions : [
        "What are Snehin's technical skills?",
        "Tell me about his projects",
        "How can I contact Snehin?",
      ],
    });
  }

  // 10. Gemini failed — return fallback
  if (geminiResult.budgetExhausted) {
    return jsonResponse({
      success: true,
      message: fallbackResponses.budgetExhausted,
      source: "fallback",
      suggestions: [
        "What are Snehin's technical skills?",
        "Tell me about his internships",
        "What are his best projects?",
      ],
    });
  }

  // General fallback
  return jsonResponse({
    success: true,
    message: fallbackResponses.generalFallback,
    source: "fallback",
    links: [
      { label: "Email", url: "mailto:adepu.snehin@gmail.com" },
      { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
    ],
    suggestions: [
      "Who is Snehin Adepu?",
      "What are his best projects?",
      "Tell me about his experience",
    ],
  });
}

// ── Follow-up Suggestions ────────────────────────────────────

function getFollowUpSuggestions(relatedQuestionIds?: string[]): string[] {
  if (!relatedQuestionIds || relatedQuestionIds.length === 0) {
    return [
      "What are Snehin's technical skills?",
      "Tell me about his projects",
      "How can I contact Snehin?",
    ];
  }

  const suggestions: string[] = [];
  for (const id of relatedQuestionIds.slice(0, 3)) {
    const faq = getFAQById(id);
    if (faq) {
      suggestions.push(faq.question);
    }
  }

  // Fill up to 3 if needed
  if (suggestions.length < 3) {
    const defaults = [
      "What are Snehin's technical skills?",
      "Tell me about his projects",
      "How can I contact Snehin?",
    ];
    for (const d of defaults) {
      if (suggestions.length >= 3) break;
      if (!suggestions.includes(d)) suggestions.push(d);
    }
  }

  return suggestions;
}
