/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Chat Widget
   Floating "Ask Snehin" button + responsive chat panel.
   Premium glassmorphism design matching the portfolio's
   warm editorial copper/bone/ink palette.
   Features streaming typewriter effect for assistant responses.
   ═══════════════════════════════════════════════════════════════ */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import SuggestedQuestions from "./SuggestedQuestions";
import styles from "./AskSnehinWidget.module.css";
import type { AskSnehinResponse } from "@/lib/ask-snehin/types";

// ── Types ────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  links?: { label: string; url: string }[];
  source?: string;
  suggestions?: string[];
  isStreaming?: boolean;        // true while typewriter is still running
  streamedContent?: string;    // partially-revealed text during streaming
}

// ── Constants ────────────────────────────────────────────────

const OPENING_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Welcome. I am an assistant for Snehin Adepu's portfolio. You can ask about his engineering projects, technical stack, enterprise experience at Eli Lilly, or how to get in touch.",
  suggestions: [
    "Give me an overview of Snehin's background",
    "Tell me about his AWS Student Builder Group leadership",
    "What did he accomplish at Eli Lilly?",
    "Tell me about his key projects",
  ],
};

/** Typing speed — milliseconds per character (lower = faster). */
const CHAR_DELAY_MS = 16;

/** Extra pause after punctuation for natural rhythm. */
const PUNCTUATION_PAUSE_MS = 60;

/** Characters that trigger the longer pause. */
const PAUSE_CHARS = new Set([".", ",", "!", "?", ":", ";", "\n"]);

/** Minimum time (ms) the bouncing dots stay visible — makes even instant answers feel natural. */
const MIN_THINKING_MS = 800;
const MAX_THINKING_MS = 1400;

/** Returns a promise that resolves after a randomized "thinking" delay. */
function thinkingDelay(): Promise<void> {
  const duration =
    MIN_THINKING_MS + Math.random() * (MAX_THINKING_MS - MIN_THINKING_MS);
  return new Promise((resolve) => setTimeout(resolve, duration));
}

let messageCounter = 0;
function nextId(): string {
  return `msg-${++messageCounter}-${Date.now()}`;
}

// ── Widget Component ─────────────────────────────────────────

export default function AskSnehinWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPromptBubble, setShowPromptBubble] = useState(true);
  const [messages, setMessages] = useState<Message[]>([OPENING_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const streamTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll to bottom on new messages or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Cleanup streaming timer on unmount
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearTimeout(streamTimerRef.current);
    };
  }, []);

  // ── Typewriter Streaming ────────────────────────────────

  const streamMessage = useCallback(
    (msgId: string, fullText: string) => {
      let charIndex = 0;

      const typeNext = () => {
        if (charIndex >= fullText.length) {
          // Streaming complete — remove streaming flag
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId
                ? { ...m, isStreaming: false, streamedContent: undefined }
                : m
            )
          );
          return;
        }

        charIndex++;
        const revealed = fullText.slice(0, charIndex);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, streamedContent: revealed } : m
          )
        );

        // Determine delay — pause longer on sentence-ending punctuation
        const currentChar = fullText[charIndex - 1];
        const delay = PAUSE_CHARS.has(currentChar)
          ? CHAR_DELAY_MS + PUNCTUATION_PAUSE_MS
          : CHAR_DELAY_MS;

        streamTimerRef.current = setTimeout(typeNext, delay);
      };

      typeNext();
    },
    []
  );

  // ── Send Message ─────────────────────────────────────────

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      if (!hasInteracted) setHasInteracted(true);

      // Clear any in-progress streaming
      if (streamTimerRef.current) {
        clearTimeout(streamTimerRef.current);
        streamTimerRef.current = null;
      }

      // Add user message
      const userMsg: Message = {
        id: nextId(),
        role: "user",
        content: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        // Run API fetch and minimum "thinking" delay in parallel.
        // This ensures the bouncing dots always show for a natural duration,
        // even when the answer is instant (FAQ / semantic match).
        const [response] = await Promise.all([
          fetch("/api/ask-snehin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: trimmed }),
          }),
          thinkingDelay(),
        ]);

        const data: AskSnehinResponse = await response.json();

        const assistantMsgId = nextId();
        const assistantMsg: Message = {
          id: assistantMsgId,
          role: "assistant",
          content: data.message,
          links: data.links,
          source: data.source,
          suggestions: data.suggestions,
          isStreaming: true,
          streamedContent: "",
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);

        // Begin typewriter animation
        streamMessage(assistantMsgId, data.message);
      } catch {
        const errorText =
          "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach out to Snehin directly at adepu.snehin@gmail.com";
        const errorMsgId = nextId();
        const errorMsg: Message = {
          id: errorMsgId,
          role: "assistant",
          content: errorText,
          source: "fallback",
          links: [
            { label: "Email Snehin", url: "mailto:adepu.snehin@gmail.com" },
          ],
          isStreaming: true,
          streamedContent: "",
        };
        setMessages((prev) => [...prev, errorMsg]);
        setIsLoading(false);

        streamMessage(errorMsgId, errorText);
      }
    },
    [isLoading, hasInteracted, streamMessage]
  );

  // ── Handle Suggested Question Click ──────────────────────

  const handleSuggestion = useCallback(
    (question: string) => {
      sendMessage(question);
    },
    [sendMessage]
  );

  // ── Handle Input ─────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  // Check if any message is currently streaming
  const isAnyStreaming = messages.some((m) => m.isStreaming);

  return (
    <>
      {/* ── Floating Trigger & Eye-Catching Prompt Bubble ── */}
      <div className={`${styles.fabContainer} ${isOpen ? styles.fabHidden : ""}`}>
        {/* Animated Speech Bubble Prompt */}
        {showPromptBubble && (
          <div
            className={styles.promptBubble}
            onClick={() => {
              setIsOpen(true);
              setShowPromptBubble(false);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setIsOpen(true);
                setShowPromptBubble(false);
              }
            }}
            aria-label="Ask Snehin — click to chat"
          >
            <div className={styles.promptBubbleBody}>
              <span className={styles.promptIcon} aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <div className={styles.promptText}>
                <span className={styles.promptHeading}>Ask Snehin</span>
                <span className={styles.promptSub}>Explore projects, engineering & skills</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.promptCloseBtn}
              onClick={(e) => {
                e.stopPropagation();
                setShowPromptBubble(false);
              }}
              aria-label="Dismiss prompt"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <span className={styles.promptTail} aria-hidden="true" />
          </div>
        )}

        {/* Circular Avatar Trigger Button */}
        <button
          type="button"
          className={styles.fabCircle}
          onClick={() => {
            setIsOpen(true);
            setShowPromptBubble(false);
          }}
          aria-label="Open Ask Snehin chat assistant"
          id="ask-snehin-fab"
        >
          <div className={styles.fabAvatarWrapper}>
            <Image
              src="/Avatar.png"
              alt="Ask Snehin"
              width={60}
              height={60}
              priority
              className={styles.fabAvatarImg}
            />
            <span className={styles.fabOnlineDot} aria-hidden="true" />
          </div>
          <span className={styles.fabPulse} aria-hidden="true" />
        </button>
      </div>

      {/* ── Chat Panel ── */}
      <div
        ref={panelRef}
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
        role="dialog"
        aria-label="Ask Snehin AI assistant"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className={styles.panelHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerAvatar}>
              <Image
                src="/Avatar.png"
                alt="Snehin Adepu"
                width={36}
                height={36}
                className={styles.avatarImg}
              />
            </div>
            <div className={styles.headerInfo}>
              <h3 className={styles.headerTitle}>Ask Snehin</h3>
              <p className={styles.headerSubtitle}>
                <span className={styles.statusDot} aria-hidden="true" />
                AI portfolio assistant
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className={styles.messages} role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg) => {
            // Determine displayed text: streamed partial or full content
            const displayContent = msg.isStreaming
              ? (msg.streamedContent ?? "")
              : msg.content;

            // Only show suggestions and links after streaming is complete
            const showExtras = !msg.isStreaming;

            return (
              <div key={msg.id}>
                <ChatMessage
                  role={msg.role}
                  content={displayContent}
                  links={showExtras ? msg.links : undefined}
                  source={msg.source}
                  isStreaming={msg.isStreaming}
                />
                {/* Show suggestions after this message if it's the latest assistant message and done streaming */}
                {msg.role === "assistant" &&
                  msg.id === messages.filter((m) => m.role === "assistant").pop()?.id &&
                  showExtras &&
                  msg.suggestions &&
                  msg.suggestions.length > 0 && (
                    <SuggestedQuestions
                      questions={msg.suggestions}
                      onSelect={handleSuggestion}
                      disabled={isLoading || isAnyStreaming}
                    />
                  )}
              </div>
            );
          })}

          {/* Loading indicator — bouncing dots while waiting for API */}
          {isLoading && (
            <div className={`${styles.message} ${styles.messageAssistant}`}>
              <div className={styles.messageAvatar} aria-hidden="true">
                <Image
                  src="/Avatar.png"
                  alt="Snehin"
                  width={28}
                  height={28}
                  className={styles.avatarImg}
                />
              </div>
              <div className={`${styles.messageBubble} ${styles.bubbleAssistant}`}>
                <div className={styles.typingIndicator} aria-label="Typing">
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about Snehin's work..."
              rows={1}
              maxLength={500}
              disabled={isLoading || isAnyStreaming}
              aria-label="Type your question"
              id="ask-snehin-input"
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || isLoading || isAnyStreaming}
              aria-label="Send message"
              id="ask-snehin-send"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className={styles.inputDisclaimer}>
            AI-powered · Answers from verified portfolio data
          </p>
        </form>
      </div>

      {/* ── Backdrop (mobile) ── */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
