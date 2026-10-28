/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Intent Classifier
   Local keyword/pattern-based intent detection with weighted
   scoring. No external API calls.
   ═══════════════════════════════════════════════════════════════ */

import type { IntentType, IntentResult, KnowledgeCategory } from "./types";

// ── Intent Patterns ──────────────────────────────────────────

interface IntentPattern {
  intent: IntentType;
  /** Keywords that suggest this intent (weighted by position in array — earlier = higher) */
  keywords: string[];
  /** Exact phrases that strongly suggest this intent */
  phrases: string[];
  /** Knowledge categories relevant to this intent */
  knowledgeTopics: KnowledgeCategory[];
  /** Default response style */
  responseStyle: IntentResult["responseStyle"];
  /** Default detail level */
  detailLevel: IntentResult["detailLevel"];
}

const intentPatterns: IntentPattern[] = [
  {
    intent: "PROFILE",
    keywords: [
      "who", "about", "introduction", "introduce", "background", "bio",
      "overview", "summary", "person", "himself", "snehin",
    ],
    phrases: [
      "who is", "tell me about", "introduce yourself", "about snehin",
      "who are you", "what does snehin do", "brief intro",
    ],
    knowledgeTopics: ["profile", "education"],
    responseStyle: "concise",
    detailLevel: "standard",
  },
  {
    intent: "SKILLS",
    keywords: [
      "skills", "technologies", "tech", "stack", "tools", "languages",
      "frameworks", "programming", "capabilities", "expertise", "proficient",
      "know", "work with", "familiar",
    ],
    phrases: [
      "tech stack", "what languages", "what tools", "technical skills",
      "what technologies", "programming languages", "skills and tools",
    ],
    knowledgeTopics: ["skills"],
    responseStyle: "concise",
    detailLevel: "standard",
  },
  {
    intent: "PROJECT_DEEP_DIVE",
    keywords: [
      "project", "built", "build", "created", "architecture", "implementation",
      "design", "jansamadhan", "monument", "uber", "pipeline", "ddos", "iot",
      "3d", "lidar", "price feed", "demo", "portfolio",
    ],
    phrases: [
      "tell me about the", "how did you build", "explain the project",
      "project details", "most interesting", "best project", "what has he built",
    ],
    knowledgeTopics: ["projects"],
    responseStyle: "technical",
    detailLevel: "deep",
  },
  {
    intent: "EXPERIENCE",
    keywords: [
      "experience", "internship", "intern", "work", "job", "company",
      "loomylabs", "alfago", "eli lilly", "lilly", "role", "position",
      "employment", "career", "professional",
    ],
    phrases: [
      "work experience", "internship experience", "where has he worked",
      "what did he do at", "accomplish during", "career history",
      "professional experience",
    ],
    knowledgeTopics: ["experience"],
    responseStyle: "concise",
    detailLevel: "standard",
  },
  {
    intent: "RECRUITER",
    keywords: [
      "hire", "hiring", "candidate", "strengths", "stand out", "special",
      "why should", "recruit", "pitch", "impressive", "strong",
      "best candidate", "qualities",
    ],
    phrases: [
      "why should we hire", "why is he a good", "what makes him stand out",
      "hiring pitch", "strengths as a candidate", "good fit for",
      "why might he be",
    ],
    knowledgeTopics: ["profile", "experience", "achievements"],
    responseStyle: "persuasive",
    detailLevel: "standard",
  },
  {
    intent: "CAREER_FIT",
    keywords: [
      "fit", "suitable", "role", "match", "looking for", "goals",
      "aspirations", "interested", "want", "seeking", "open to",
      "new grad", "ai engineer", "backend engineer", "swe",
      "machine learning", "ml engineer",
    ],
    phrases: [
      "good fit for", "career goals", "what roles", "job preferences",
      "looking for a job", "open to", "career aspirations",
      "is he suitable for", "would he be a good",
    ],
    knowledgeTopics: ["profile", "skills", "experience"],
    responseStyle: "persuasive",
    detailLevel: "standard",
  },
  {
    intent: "LEADERSHIP",
    keywords: [
      "leadership", "community", "event", "organize", "team", "lead",
      "conference", "presentation", "speaker", "award", "achievement",
      "competition", "india innovates", "iconfest", "recognition",
      "builder", "sbg", "sbgl", "aws", "workshop", "extracurricular",
    ],
    phrases: [
      "leadership experience", "student communities", "organized events",
      "awards and achievements", "research presentations", "competitions",
      "aws student builder", "builder group", "student community",
    ],
    knowledgeTopics: ["achievements", "leadership"],
    responseStyle: "concise",
    detailLevel: "standard",
  },
  {
    intent: "MODEL_INFO",
    keywords: [
      "model", "llm", "gemini", "gpt", "claude", "llama", "deepseek",
      "architecture", "parameters", "engine", "ai",
    ],
    phrases: [
      "what model", "which model", "what llm", "which llm", "what ai",
      "what model are you using", "which model are you using", "reveal which model",
      "what model is this", "what powers this", "are you chatgpt", "are you gemini",
    ],
    knowledgeTopics: ["profile"],
    responseStyle: "technical",
    detailLevel: "standard",
  },
  {
    intent: "OUT_OF_SCOPE",
    keywords: [
      "married", "marry", "marriage", "wedding", "wife", "husband",
      "girlfriend", "boyfriend", "dating", "religion", "caste", "recipe",
      "weather", "horoscope", "salary", "wealth", "kids", "children",
    ],
    phrases: [
      "get married", "when will", "getting married", "who is his girlfriend",
      "is snehin married", "who is his wife", "when will snehin get married",
    ],
    knowledgeTopics: ["profile"],
    responseStyle: "concise",
    detailLevel: "brief",
  },
  {
    intent: "GENERAL",
    keywords: [
      "contact", "email", "linkedin", "linkdin", "connect", "reach",
      "github", "resume", "cv", "location", "based", "website",
      "portfolio", "chatbot", "social", "socials", "message", "hire",
      "hello", "hi", "thanks", "bye", "help",
    ],
    phrases: [
      "how to contact", "how to connect", "connect to him", "connect with him",
      "reach snehin", "email address", "get in touch", "where is he",
      "download resume", "this website", "this chatbot", "snehin linkedin",
    ],
    knowledgeTopics: ["links", "profile"],
    responseStyle: "concise",
    detailLevel: "brief",
  },
];

// ── Classification Logic ─────────────────────────────────────

/**
 * Classify the intent of a visitor's question using weighted
 * keyword and phrase matching.
 */
export function classifyIntent(query: string): IntentResult {
  const normalizedQuery = query.toLowerCase().trim();
  const scores = new Map<IntentType, number>();

  for (const pattern of intentPatterns) {
    let score = 0;

    // Phrase matching (higher weight — 3 points per phrase match)
    for (const phrase of pattern.phrases) {
      if (normalizedQuery.includes(phrase)) {
        score += 3;
      }
    }

    // Keyword matching (1 point per keyword, diminishing after first 3)
    let keywordHits = 0;
    for (const keyword of pattern.keywords) {
      // Word boundary check for short keywords
      const regex = keyword.length <= 3
        ? new RegExp(`\\b${escapeRegex(keyword)}\\b`, "i")
        : new RegExp(escapeRegex(keyword), "i");

      if (regex.test(normalizedQuery)) {
        keywordHits++;
        score += keywordHits <= 3 ? 1 : 0.5;
      }
    }

    if (score > 0) {
      scores.set(pattern.intent, score);
    }
  }

  // Sort by score descending
  const sorted = Array.from(scores.entries())
    .sort(([, a], [, b]) => b - a);

  // Default to GENERAL if no match
  if (sorted.length === 0) {
    const generalPattern = intentPatterns.find((p) => p.intent === "GENERAL")!;
    return {
      primary: "GENERAL",
      confidence: 0.3,
      knowledgeTopics: generalPattern.knowledgeTopics,
      responseStyle: generalPattern.responseStyle,
      detailLevel: generalPattern.detailLevel,
    };
  }

  const [primaryIntent, primaryScore] = sorted[0];
  const primaryPattern = intentPatterns.find((p) => p.intent === primaryIntent)!;

  // Calculate confidence (normalize score)
  const maxPossibleScore = primaryPattern.phrases.length * 3 + primaryPattern.keywords.length;
  const confidence = Math.min(primaryScore / Math.max(maxPossibleScore * 0.3, 1), 1);

  // Detect secondary intent
  let secondary: IntentType | undefined;
  if (sorted.length > 1) {
    const [secondaryIntent, secondaryScore] = sorted[1];
    // Only include secondary if it's reasonably close to primary
    if (secondaryScore >= primaryScore * 0.5) {
      secondary = secondaryIntent;
    }
  }

  // Combine knowledge topics from primary and secondary
  const knowledgeTopics = [...primaryPattern.knowledgeTopics];
  if (secondary) {
    const secondaryPattern = intentPatterns.find((p) => p.intent === secondary)!;
    for (const topic of secondaryPattern.knowledgeTopics) {
      if (!knowledgeTopics.includes(topic)) {
        knowledgeTopics.push(topic);
      }
    }
  }

  return {
    primary: primaryIntent,
    secondary,
    confidence,
    knowledgeTopics,
    responseStyle: primaryPattern.responseStyle,
    detailLevel: primaryPattern.detailLevel,
  };
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
