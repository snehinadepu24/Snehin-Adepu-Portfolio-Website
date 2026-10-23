/* ═══════════════════════════════════════════════════════════════
   Ask Snehin — Chat Widget
   Floating "Ask Snehin" button + responsive chat panel.
   Premium glassmorphism design matching the portfolio's
   warm editorial copper/bone/ink palette.
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

  // Scroll to bottom on new messages
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

  // ── Send Message ─────────────────────────────────────────

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      if (!hasInteracted) setHasInteracted(true);

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
        const response = await fetch("/api/ask-snehin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });

        const data: AskSnehinResponse = await response.json();

        const assistantMsg: Message = {
          id: nextId(),
          role: "assistant",
          content: data.message,
          links: data.links,
          source: data.source,
          suggestions: data.suggestions,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        const errorMsg: Message = {
          id: nextId(),
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach out to Snehin directly at adepu.snehin@gmail.com",
          source: "fallback",
          links: [
            { label: "Email Snehin", url: "mailto:adepu.snehin@gmail.com" },
          ],
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasInteracted]
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

  // Get the latest suggestions (from the last assistant message)
  const latestSuggestions =
    messages.filter((m) => m.role === "assistant").pop()?.suggestions || [];

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
          {messages.map((msg) => (
            <div key={msg.id}>
              <ChatMessage
                role={msg.role}
                content={msg.content}
                links={msg.links}
                source={msg.source}
              />
              {/* Show suggestions after this message if it's the latest assistant message */}
              {msg.role === "assistant" &&
                msg.id === messages.filter((m) => m.role === "assistant").pop()?.id &&
                msg.suggestions &&
                msg.suggestions.length > 0 && (
                  <SuggestedQuestions
                    questions={msg.suggestions}
                    onSelect={handleSuggestion}
                    disabled={isLoading}
                  />
                )}
            </div>
          ))}

          {/* Loading indicator */}
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
              disabled={isLoading}
              aria-label="Type your question"
              id="ask-snehin-input"
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!input.trim() || isLoading}
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
