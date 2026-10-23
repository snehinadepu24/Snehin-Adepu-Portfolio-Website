/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Suggested Questions
   Clickable chip-style question suggestions.
   ═══════════════════════════════════════════════════════════════ */

"use client";

import styles from "./AskSnehinWidget.module.css";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export default function SuggestedQuestions({
  questions,
  onSelect,
  disabled = false,
}: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className={styles.suggestions}>
      {questions.map((q, i) => (
        <button
          key={`${q}-${i}`}
          type="button"
          className={styles.suggestionChip}
          onClick={() => onSelect(q)}
          disabled={disabled}
          aria-label={`Ask: ${q}`}
        >
          {q}
        </button>
      ))}
    </div>
  );
}
