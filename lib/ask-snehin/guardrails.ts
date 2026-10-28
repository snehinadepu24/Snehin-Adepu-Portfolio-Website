/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Guardrails & Safety Engine
   Enforces domain boundaries, handles out-of-scope/personal
   queries gracefully, and provides transparent model disclosure.
   ═══════════════════════════════════════════════════════════════ */

export interface GuardrailCheckResult {
  triggered: boolean;
  type?: "personal" | "off_topic" | "model_disclosure" | "harmful";
  message?: string;
  suggestions?: string[];
  links?: { label: string; url: string }[];
}

// ── Model Disclosure Patterns ────────────────────────────────

const MODEL_QUERY_PATTERNS = [
  /\b(?:which|what)\s+(?:llm|model|ai\s+model|foundation\s+model)\b/i,
  /\bwhat\s+(?:model|llm)\s+are\s+you\b/i,
  /\bwhat\s+(?:model|llm)\s+is\s+(?:this|running)\b/i,
  /\bwhich\s+model\s+(?:is\s+this|are\s+you|powers\s+this|powers\s+you)\b/i,
  /\breveal\s+(?:your\s+model|which\s+model|the\s+model|what\s+model)\b/i,
  /\b(?:are\s+you|is\s+this)\s+(?:gemini|chatgpt|gpt|claude|llama|openai|deepseek|mistral)\b/i,
  /\bwhat\s+powers\s+(?:this\s+chat|this\s+bot|this\s+assistant|ask\s+snehin|you)\b/i,
  /\bwhat\s+is\s+(?:your|the)\s+architecture\b/i,
  /\bwhat\s+ai\s+(?:powers|runs|is\s+behind)\s+(?:this|you)\b/i,
];

const MODEL_DISCLOSURE_RESPONSE =
  "I am powered by **Google Gemini 3.8 Flash** (`gemini-3.8-flash`) combined with a custom local semantic retrieval system.\n\n" +
  "**Architecture & Technology Stack:**\n" +
  "• **Language Model:** Google Gemini 3.8 Flash via Google Generative AI (temperature: 0.3 for high factual grounding)\n" +
  "• **Retrieval Pipeline:** Custom local TF-IDF vectorizer + cosine similarity for zero-latency, deterministic matching on verified portfolio facts\n" +
  "• **Domain Guardrails:** Strict boundary checking to ensure questions stay focused on Snehin's engineering portfolio\n" +
  "• **Application:** Next.js 15 App Router, React 19, TypeScript, and streaming UI playback deployed on Vercel";

const MODEL_DISCLOSURE_SUGGESTIONS = [
  "Tell me about Snehin's LLM work at Loomylabs",
  "What are Snehin's technical skills?",
  "What are his best engineering projects?",
];

// ── Personal / Private Life Patterns ─────────────────────────

const PERSONAL_LIFE_PATTERNS = [
  // Marriage & romantic relationships
  /\b(?:marr(?:y|ied|iage)|wedding|spouse|wife|husband|fianc[eé]e?)\b/i,
  /\b(?:girl\s*friend|boy\s*friend|dating|relationship|love\s*life|partner|crush|single)\b/i,
  /\bwhen\s+will\s+(?:snehin|he)\s+(?:get\s+married|marry)\b/i,
  /\bis\s+(?:snehin|he)\s+married\b/i,
  /\bwho\s+is\s+(?:snehin'?s|his)\s+(?:wife|girlfriend|partner)\b/i,

  // Family & private details
  /\b(?:parents|father|mother|dad|mom|sister|brother|sibling|kids|children|son|daughter)\b/i,
  /\b(?:religion|religious|caste|god|faith|horoscope|zodiac|astrology)\b/i,
  /\b(?:salary|net\s*worth|personal\s*wealth|bank\s*balance|how\s*rich)\b/i,
  /\b(?:phone\s*number|mobile\s*number|home\s*address|where\s+does\s+he\s+sleep)\b/i,
];

const PERSONAL_LIFE_RESPONSE =
  "I don't have access to information regarding Snehin's personal life . " +
  "I am designed specifically to assist with questions about his professional background, software and machine learning engineering experience, projects, technical skills, and verified contact details.";

// ── Unrelated / Off-Topic General Knowledge Patterns ─────────

const OFF_TOPIC_PATTERNS = [
  // General random topics completely outside portfolio domain
  /^(?:write\s+a\s+(?:poem|story|song|essay|novel|script\s+about))\b/i,
  /^(?:tell\s+me\s+a\s+joke)\b/i,
  /\b(?:recipe\s+for|how\s+to\s+cook|ingredients\s+for)\b/i,
  /\b(?:weather\s+in|weather\s+today|temperature\s+in)\b/i,
  /^(?:who\s+won\s+the\s+(?:match|game|cup|world\s+cup|election))\b/i,
  /^(?:what\s+is\s+the\s+capital\s+of)\b/i,
  /^(?:who\s+is\s+(?:elon\s+musk|donald\s+trump|joe\s+biden|narendra\s+modi|virat\s+kohli|messi|ronaldo))\b/i,
  /\b(?:solve\s+this\s+(?:math|calculus|equation)|calculate\s+\d+)\b/i,
  /\b(?:cricket\s+score|football\s+score|ipl\s+score)\b/i,
];

const OFF_TOPIC_RESPONSE =
  "I am specialized exclusively as Snehin Adepu's portfolio assistant. I cannot answer general trivia, personal requests, or topics unrelated to his engineering work.\n\n" +
  "You can ask me about:\n" +
  "• **Engineering Experience:** Enterprise automation at Eli Lilly, LLM optimization at Loomylabs, data systems at Alfago\n" +
  "• **Key Projects:** JanSamadhan, IoT DDoS Detection (ICONFEST 2025), AI Monument 3D Restoration\n" +
  "• **Technical Skills:** Machine Learning, Backend Architecture, Python, GCP, FastAPI\n" +
  "• **Education & Leadership:** VNR VJIET (CGPA 8.55), AWS Student Builder Group Lead";

const DEFAULT_SUGGESTIONS = [
  "What are Snehin's technical skills?",
  "What did he accomplish at Eli Lilly?",
  "Tell me about his key projects",
  "How can I contact Snehin?",
];

const DEFAULT_LINKS = [
  { label: "Email Snehin", url: "mailto:adepu.snehin@gmail.com" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/snehin-adepu-1774b928b/" },
  { label: "GitHub", url: "https://github.com/snehinadepu24" },
];

// ── Public Check Function ────────────────────────────────────

/**
 * Checks if a user's query triggers any guardrails (personal info,
 * model disclosure request, or completely off-topic topics).
 */
export function checkGuardrails(rawQuery: string): GuardrailCheckResult {
  const query = rawQuery.trim();

  // 1. Model disclosure requests
  for (const pattern of MODEL_QUERY_PATTERNS) {
    if (pattern.test(query)) {
      return {
        triggered: true,
        type: "model_disclosure",
        message: MODEL_DISCLOSURE_RESPONSE,
        suggestions: MODEL_DISCLOSURE_SUGGESTIONS,
      };
    }
  }

  // 2. Personal / private life queries (marriage, relationships, family, religion, personal finances)
  for (const pattern of PERSONAL_LIFE_PATTERNS) {
    if (pattern.test(query)) {
      return {
        triggered: true,
        type: "personal",
        message: PERSONAL_LIFE_RESPONSE,
        suggestions: DEFAULT_SUGGESTIONS,
        links: DEFAULT_LINKS,
      };
    }
  }

  // 3. Completely off-topic queries
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(query)) {
      return {
        triggered: true,
        type: "off_topic",
        message: OFF_TOPIC_RESPONSE,
        suggestions: DEFAULT_SUGGESTIONS,
        links: DEFAULT_LINKS,
      };
    }
  }

  return { triggered: false };
}

