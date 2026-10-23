/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Shared Types
   ═══════════════════════════════════════════════════════════════ */

// ── FAQ Database ─────────────────────────────────────────────

export type FAQCategory =
  | "profile"
  | "skills"
  | "projects"
  | "experience"
  | "achievements"
  | "education"
  | "contact"
  | "general";

export interface FAQEntry {
  id: string;
  category: FAQCategory;
  question: string;
  /** Alternative phrasings that should match this FAQ */
  variants: string[];
  /** Pre-approved answer (Markdown-safe) */
  answer: string;
  /** Clickable links to include with the answer */
  relatedLinks?: { label: string; url: string }[];
  /** IDs of related FAQs to suggest after answering */
  relatedQuestions?: string[];
  /** Tags for semantic retrieval weighting */
  tags?: string[];
}

// ── Knowledge Base ───────────────────────────────────────────

export type KnowledgeCategory =
  | "profile"
  | "education"
  | "skills"
  | "projects"
  | "experience"
  | "achievements"
  | "leadership"
  | "links";

export interface KnowledgeRecord {
  id: string;
  category: KnowledgeCategory;
  /** Factual content — verified and approved */
  content: string;
  tags: string[];
  links?: { label: string; url: string }[];
}

// ── Chat Messages ────────────────────────────────────────────

export type MessageRole = "user" | "assistant" | "system";

export type MessageSource = "faq" | "semantic" | "gemini" | "fallback";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  /** Where this answer originated */
  source?: MessageSource;
  /** Links to display with the message */
  links?: { label: string; url: string }[];
  /** Follow-up questions to suggest */
  suggestions?: string[];
}

// ── Intent Classification ────────────────────────────────────

export type IntentType =
  | "PROFILE"
  | "SKILLS"
  | "PROJECT_DEEP_DIVE"
  | "EXPERIENCE"
  | "RECRUITER"
  | "CAREER_FIT"
  | "LEADERSHIP"
  | "GENERAL";

export interface IntentResult {
  primary: IntentType;
  secondary?: IntentType;
  confidence: number;
  knowledgeTopics: KnowledgeCategory[];
  responseStyle: "concise" | "detailed" | "technical" | "persuasive";
  detailLevel: "brief" | "standard" | "deep";
}

// ── API Request / Response ───────────────────────────────────

export interface AskSnehinRequest {
  message: string;
  /** Optional session ID for future conversation context */
  sessionId?: string;
}

export interface AskSnehinResponse {
  success: boolean;
  message: string;
  source: MessageSource;
  links?: { label: string; url: string }[];
  suggestions?: string[];
  /** Error details (only in error responses) */
  error?: string;
}

// ── Rate Limiting ────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  /** Which limit was hit */
  limitType?: "general" | "gemini" | "daily_budget";
}

// ── Semantic Search ──────────────────────────────────────────

export interface SemanticMatch {
  faqId: string;
  score: number;
  question: string;
}
