/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Chat Message
   Individual message bubble with simple Markdown rendering
   and clickable links.
   Supports a streaming cursor indicator during typewriter playback.
   ═══════════════════════════════════════════════════════════════ */

"use client";

import Image from "next/image";
import styles from "./AskSnehinWidget.module.css";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  links?: { label: string; url: string }[];
  source?: string;
  /** When true, a blinking cursor is appended to indicate ongoing streaming. */
  isStreaming?: boolean;
}

/**
 * Simple Markdown-like renderer for chat messages.
 * Supports: **bold**, bullet lists (•), newlines, links.
 */
function renderMessageContent(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    if (line.trim() === "") {
      elements.push(<br key={`br-${lineIdx}`} />);
      return;
    }

    // Process inline formatting
    const parts = processInlineFormatting(line);

    // Detect bullet points
    const trimmed = line.trimStart();
    const isBullet = trimmed.startsWith("•") || trimmed.startsWith("- ") || /^\d+\.\s/.test(trimmed);

    if (isBullet) {
      elements.push(
        <div key={`line-${lineIdx}`} className={styles.messageBullet}>
          {parts}
        </div>
      );
    } else {
      elements.push(
        <span key={`line-${lineIdx}`}>
          {parts}
          {lineIdx < lines.length - 1 && lines[lineIdx + 1]?.trim() !== "" ? " " : null}
        </span>
      );
    }
  });

  return elements;
}

function processInlineFormatting(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold** and emoji patterns
  const regex = /(\*\*(.+?)\*\*)|(\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold text
      parts.push(
        <strong key={`bold-${match.index}`} className={styles.messageBold}>
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Markdown link
      parts.push(
        <a
          key={`link-${match.index}`}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.messageInlineLink}
        >
          {match[4]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export default function ChatMessage({
  role,
  content,
  links,
  source,
  isStreaming,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`${styles.message} ${isUser ? styles.messageUser : styles.messageAssistant}`}
    >
      {!isUser && (
        <div className={styles.messageAvatar} aria-hidden="true">
          <Image
            src="/Avatar.png"
            alt="Snehin"
            width={28}
            height={28}
            className={styles.avatarImg}
          />
        </div>
      )}
      <div className={`${styles.messageBubble} ${isUser ? styles.bubbleUser : styles.bubbleAssistant}`}>
        <div className={styles.messageText}>
          {renderMessageContent(content)}
          {/* Blinking cursor while streaming */}
          {isStreaming && (
            <span className={styles.streamingCursor} aria-hidden="true">
              ▍
            </span>
          )}
        </div>

        {/* Clickable links */}
        {links && links.length > 0 && (
          <div className={styles.messageLinks}>
            {links.map((link, idx) => (
              <a
                key={`${link.url}-${idx}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.messageLink}
              >
                {link.label}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

