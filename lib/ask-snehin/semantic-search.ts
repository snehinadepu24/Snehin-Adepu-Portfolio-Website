/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Semantic Search
   TF-IDF vectorizer + cosine similarity for local FAQ matching.
   Zero external API calls. Sub-millisecond matching.
   ═══════════════════════════════════════════════════════════════ */

import { faqDatabase } from "./faq-database";
import type { FAQEntry, SemanticMatch } from "./types";

// ── Tokenizer ────────────────────────────────────────────────

/** Common English stop words to filter out */
const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "just",
  "don", "should", "now", "and", "but", "or", "if", "while", "about",
  "up", "down", "i", "me", "my", "myself", "we", "our", "ours",
  "you", "your", "yours", "he", "him", "his", "she", "her", "hers",
  "it", "its", "they", "them", "their", "theirs", "what", "which",
  "who", "whom", "this", "that", "these", "those", "am", "isn", "aren",
  "wasn", "weren", "hasn", "haven", "hadn", "doesn", "don", "didn",
  "won", "wouldn", "couldn", "shouldn", "mustn", "let", "that",
  "tell", "give", "explain", "describe", "show", "know", "get",
]);

const TYPO_MAP: Record<string, string> = {
  linkdin: "linkedin",
  linked: "linkedin",
  hwo: "how",
  githb: "github",
  resum: "resume",
  cv: "resume",
  skils: "skills",
  prject: "project",
  prjects: "projects",
  experiance: "experience",
  conact: "contact",
  contct: "contact",
};

/**
 * Tokenize and normalize a string:
 * - Lowercase
 * - Remove punctuation
 * - Correct common typos
 * - Split on whitespace
 * - Remove stop words
 * - Basic stemming (simple suffix stripping)
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[^a-z0-9' ]/g, " ")
    .split(/\s+/)
    .map((word) => TYPO_MAP[word] || word)
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
    .map(simpleStem);
}

/**
 * Very lightweight English stemmer (suffix stripping).
 * Not linguistically perfect, but good enough for FAQ matching.
 */
function simpleStem(word: string): string {
  if (word.length <= 3) return word;

  // Common suffix removals
  if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
  if (word.endsWith("ies")) return word.slice(0, -2);
  if (word.endsWith("ing") && word.length > 5) return word.slice(0, -3);
  if (word.endsWith("tion")) return word.slice(0, -4);
  if (word.endsWith("ment")) return word.slice(0, -4);
  if (word.endsWith("ness")) return word.slice(0, -4);
  if (word.endsWith("able")) return word.slice(0, -4);
  if (word.endsWith("ful")) return word.slice(0, -3);
  if (word.endsWith("ous")) return word.slice(0, -3);
  if (word.endsWith("ive")) return word.slice(0, -3);
  if (word.endsWith("ly") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("er") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3) return word.slice(0, -1);

  return word;
}

// ── TF-IDF Engine ────────────────────────────────────────────

interface DocumentVector {
  faqId: string;
  question: string;
  vector: Map<string, number>;
  magnitude: number;
}

/** Pre-computed document frequency across all FAQ documents */
let documentFrequency: Map<string, number> | null = null;

/** Pre-computed TF-IDF vectors for every FAQ question + variants */
let documentVectors: DocumentVector[] | null = null;

/** Total number of "documents" (each question/variant is one) */
let totalDocuments = 0;

/**
 * Build the TF-IDF index from the FAQ database.
 * Called lazily on first search.
 */
function buildIndex(): void {
  if (documentVectors !== null) return; // Already built

  const allDocs: { faqId: string; question: string; tokens: string[] }[] = [];

  // Each FAQ question and each variant becomes a separate document
  for (const faq of faqDatabase) {
    const allPhrases = [faq.question, ...faq.variants];
    for (const phrase of allPhrases) {
      allDocs.push({
        faqId: faq.id,
        question: faq.question, // Always reference the canonical question
        tokens: tokenize(phrase),
      });
    }

    // Also index the answer text (lower weight — done by including fewer tokens)
    const answerTokens = tokenize(faq.answer).slice(0, 20); // Limit to key terms
    if (answerTokens.length > 0) {
      allDocs.push({
        faqId: faq.id,
        question: faq.question,
        tokens: answerTokens,
      });
    }

    // Index tags as well
    if (faq.tags) {
      allDocs.push({
        faqId: faq.id,
        question: faq.question,
        tokens: faq.tags.map(simpleStem),
      });
    }
  }

  totalDocuments = allDocs.length;

  // Compute document frequency (how many documents each term appears in)
  documentFrequency = new Map();
  for (const doc of allDocs) {
    const uniqueTerms = new Set(doc.tokens);
    for (const term of uniqueTerms) {
      documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
    }
  }

  // Compute TF-IDF vectors
  documentVectors = allDocs.map((doc) => {
    const tf = new Map<string, number>();
    for (const token of doc.tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
    }

    const vector = new Map<string, number>();
    let magnitudeSquared = 0;

    for (const [term, count] of tf) {
      const termFreq = count / doc.tokens.length;
      const docFreq = documentFrequency!.get(term) || 1;
      const idf = Math.log(totalDocuments / docFreq);
      const tfidf = termFreq * idf;

      if (tfidf > 0) {
        vector.set(term, tfidf);
        magnitudeSquared += tfidf * tfidf;
      }
    }

    return {
      faqId: doc.faqId,
      question: doc.question,
      vector,
      magnitude: Math.sqrt(magnitudeSquared),
    };
  });
}

/**
 * Compute the TF-IDF vector for a query string.
 */
function queryToVector(query: string): { vector: Map<string, number>; magnitude: number } {
  const tokens = tokenize(query);
  const tf = new Map<string, number>();

  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  const vector = new Map<string, number>();
  let magnitudeSquared = 0;

  for (const [term, count] of tf) {
    const termFreq = count / tokens.length;
    const docFreq = documentFrequency?.get(term) || 1;
    const idf = Math.log(totalDocuments / docFreq);
    const tfidf = termFreq * idf;

    if (tfidf > 0) {
      vector.set(term, tfidf);
      magnitudeSquared += tfidf * tfidf;
    }
  }

  return { vector, magnitude: Math.sqrt(magnitudeSquared) };
}

/**
 * Cosine similarity between two TF-IDF vectors.
 */
function cosineSimilarity(
  a: { vector: Map<string, number>; magnitude: number },
  b: { vector: Map<string, number>; magnitude: number }
): number {
  if (a.magnitude === 0 || b.magnitude === 0) return 0;

  let dotProduct = 0;
  // Iterate over the smaller vector
  const [smaller, larger] = a.vector.size <= b.vector.size ? [a, b] : [b, a];

  for (const [term, value] of smaller.vector) {
    const otherValue = larger.vector.get(term);
    if (otherValue !== undefined) {
      dotProduct += value * otherValue;
    }
  }

  return dotProduct / (a.magnitude * b.magnitude);
}

// ── Public API ───────────────────────────────────────────────

/** Confidence thresholds */
const CONFIDENT_MATCH = 0.40;  // TF-IDF scores tend to be lower than embedding scores
const POSSIBLE_MATCH = 0.20;

/**
 * Search FAQs by semantic similarity.
 * Returns matches sorted by descending score.
 */
export function semanticSearch(query: string, topK: number = 5): SemanticMatch[] {
  buildIndex();

  const queryVec = queryToVector(query);
  const scores = new Map<string, { score: number; question: string }>();

  for (const doc of documentVectors!) {
    const score = cosineSimilarity(queryVec, doc);

    // Keep the best score for each FAQ ID
    const existing = scores.get(doc.faqId);
    if (!existing || score > existing.score) {
      scores.set(doc.faqId, { score, question: doc.question });
    }
  }

  // Sort by score descending and take topK
  return Array.from(scores.entries())
    .map(([faqId, { score, question }]) => ({ faqId, score, question }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Find the best matching FAQ using semantic search.
 * Returns the FAQ entry and confidence level.
 */
export function findBestMatch(
  query: string
): { faq: FAQEntry | null; score: number; confidence: "high" | "medium" | "low" } {
  const matches = semanticSearch(query, 3);

  if (matches.length === 0) {
    return { faq: null, score: 0, confidence: "low" };
  }

  const best = matches[0];
  const faq = faqDatabase.find((f) => f.id === best.faqId) || null;

  let confidence: "high" | "medium" | "low";
  if (best.score >= CONFIDENT_MATCH) {
    confidence = "high";
  } else if (best.score >= POSSIBLE_MATCH) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return { faq, score: best.score, confidence };
}

/**
 * Get related questions based on semantic similarity to the current query.
 * Excludes the best match FAQ to avoid suggesting the same question.
 */
export function getRelatedQuestions(
  query: string,
  excludeFaqId?: string,
  count: number = 3
): string[] {
  const matches = semanticSearch(query, count + 2);

  return matches
    .filter((m) => m.faqId !== excludeFaqId && m.score >= POSSIBLE_MATCH)
    .slice(0, count)
    .map((m) => m.question);
}
