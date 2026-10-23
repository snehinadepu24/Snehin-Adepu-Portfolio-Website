/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Rate Limiter
   In-memory sliding window rate limiter.
   Upgradeable to Upstash Redis for production.
   ═══════════════════════════════════════════════════════════════ */

import type { RateLimitResult } from "./types";

// ── Configuration ────────────────────────────────────────────

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  general: {
    maxRequests: 30,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
  gemini: {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
};

// ── Sliding Window Store ─────────────────────────────────────

interface RequestLog {
  timestamps: number[];
}

/** In-memory store keyed by "limitType:ip" */
const store = new Map<string, RequestLog>();

/** Periodic cleanup interval (every 5 minutes) */
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

function ensureCleanup(): void {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    const maxWindow = Math.max(...Object.values(RATE_LIMITS).map((c) => c.windowMs));

    for (const [key, log] of store.entries()) {
      // Remove timestamps outside the largest window
      log.timestamps = log.timestamps.filter((t) => now - t < maxWindow);
      if (log.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  // Allow the process to exit normally (Node.js)
  if (cleanupInterval && typeof cleanupInterval === "object" && "unref" in cleanupInterval) {
    cleanupInterval.unref();
  }
}

// ── Public API ───────────────────────────────────────────────

/**
 * Check if a request is allowed under the specified rate limit.
 * If allowed, records the request timestamp.
 */
export function checkRateLimit(
  ip: string,
  limitType: "general" | "gemini"
): RateLimitResult {
  ensureCleanup();

  const config = RATE_LIMITS[limitType];
  const key = `${limitType}:${ip}`;
  const now = Date.now();

  // Get or create request log
  let log = store.get(key);
  if (!log) {
    log = { timestamps: [] };
    store.set(key, log);
  }

  // Remove timestamps outside the current window
  log.timestamps = log.timestamps.filter((t) => now - t < config.windowMs);

  // Check if limit exceeded
  if (log.timestamps.length >= config.maxRequests) {
    const oldestInWindow = log.timestamps[0];
    const resetAt = oldestInWindow + config.windowMs;

    return {
      allowed: false,
      remaining: 0,
      resetAt,
      limitType,
    };
  }

  // Record this request
  log.timestamps.push(now);

  return {
    allowed: true,
    remaining: config.maxRequests - log.timestamps.length,
    resetAt: now + config.windowMs,
  };
}

/**
 * Validate and sanitize user input.
 */
export function validateInput(message: string): {
  valid: boolean;
  sanitized: string;
  error?: string;
} {
  // Check for empty input
  if (!message || typeof message !== "string") {
    return { valid: false, sanitized: "", error: "Message is required." };
  }

  // Trim whitespace
  let sanitized = message.trim();

  // Check length
  if (sanitized.length === 0) {
    return { valid: false, sanitized: "", error: "Message cannot be empty." };
  }

  if (sanitized.length > 500) {
    return {
      valid: false,
      sanitized: "",
      error: "Message is too long. Please keep it under 500 characters.",
    };
  }

  // Basic XSS sanitization — strip HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // Remove potential script injection patterns
  sanitized = sanitized
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:/gi, "");

  // Check if anything meaningful remains after sanitization
  if (sanitized.trim().length === 0) {
    return { valid: false, sanitized: "", error: "Invalid message content." };
  }

  return { valid: true, sanitized };
}

// ── Fallback Responses ───────────────────────────────────────

const RATE_LIMIT_RESPONSE =
  "You are sending requests too quickly. Please wait a moment before trying again, or explore the portfolio directly.";

const BUDGET_EXHAUSTED_RESPONSE =
  "The daily limit for extended AI queries has been reached. You can still ask standard questions regarding Snehin's technical skills, architecture, internship deliverables, or contact details.";

const GENERAL_FALLBACK_RESPONSE =
  "I could not locate specific information for that query. You may ask about:\n\n• Background and education\n• Technical skills and system architecture\n• Enterprise experience at Eli Lilly\n• Research publications and projects\n• Direct contact options\n\nYou can also contact Snehin directly at adepu.snehin@gmail.com.";

export const fallbackResponses = {
  rateLimit: RATE_LIMIT_RESPONSE,
  budgetExhausted: BUDGET_EXHAUSTED_RESPONSE,
  generalFallback: GENERAL_FALLBACK_RESPONSE,
};
