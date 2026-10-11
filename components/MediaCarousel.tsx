"use client";

/**
 * MediaCarousel — auto-scrolling carousel with:
 * - Drag to scroll (mouse)
 * - Touch swipe to scroll (mobile)
 * - Hover / active drag pauses auto-scroll
 * - Infinite loop by duplicating items
 * - Respects prefers-reduced-motion (static, no auto-scroll)
 */

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./MediaCarousel.module.css";

interface MediaItem {
  type: "youtube" | "linkedin";
  src: string;
  title: string;
}

const ITEMS: MediaItem[] = [
  {
    type: "youtube",
    src: "https://www.youtube.com/embed/FCq9d1OTy2U?si=4eo3rTMrIVlF1R5Q",
    title: "YouTube video — Snehin Adepu",
  },
  {
    type: "linkedin",
    src: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7428705882382888960?collapsed=1",
    title: "LinkedIn post",
  },
  {
    type: "linkedin",
    src: "https://www.linkedin.com/embed/feed/update/urn:li:activity:7488809819978735616?collapsed=1",
    title: "AWS Student Builder Group launch",
  },
  {
    type: "linkedin",
    src: "https://www.linkedin.com/embed/feed/update/urn:li:activity:7499001159274364928?collapsed=1",
    title: "AWSSBG committee 2026-2027",
  },
  {
    type: "youtube",
    src: "https://www.youtube.com/embed/7h4zvP5xrms?si=6GyTMy5lO_jYaJfZ",
    title: "YouTube video — Snehin Adepu",
  },
];

// Auto-scroll speed in px/frame (~60fps target)
const AUTO_SPEED = 0.8;

export default function MediaCarousel() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number>(0);
  const offsetRef   = useRef(0);       // current translateX offset (negative = scrolled right)
  const halfWidthRef = useRef(0);      // width of one set (half of total track) for loop reset
  const isDragging  = useRef(false);
  const dragStartX  = useRef(0);
  const dragStartOffset = useRef(0);
  const isHovered   = useRef(false);
  const [reduced, setReduced] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Measure the half-width (one copy of all items) for loop reset
  const measureHalf = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // total track has 2 copies; half = one copy
    halfWidthRef.current = track.scrollWidth / 2;
  }, []);

  useEffect(() => {
    measureHalf();
    window.addEventListener("resize", measureHalf, { passive: true });
    return () => window.removeEventListener("resize", measureHalf);
  }, [measureHalf]);

  // Apply offset to track via transform
  const applyOffset = useCallback((offset: number) => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(${offset}px)`;
  }, []);

  // Main animation loop
  useEffect(() => {
    if (reduced) return; // no animation for reduced motion

    const tick = () => {
      // Auto-scroll only when not dragging and not hovered
      if (!isDragging.current && !isHovered.current) {
        offsetRef.current -= AUTO_SPEED;
      }

      // Infinite loop: once we've scrolled past one full copy, reset
      const half = halfWidthRef.current;
      if (half > 0 && offsetRef.current <= -half) {
        offsetRef.current += half;
      }
      // Guard against scrolling too far right (manual drag backward)
      if (offsetRef.current > 0) {
        offsetRef.current = 0;
      }

      applyOffset(offsetRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced, applyOffset]);

  // ── Mouse drag handlers ─────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartOffset.current = offsetRef.current;
    setDragging(true);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    offsetRef.current = dragStartOffset.current + delta;
    applyOffset(offsetRef.current);
  }, [applyOffset]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    setDragging(false);
  }, []);

  const onMouseLeave = useCallback(() => {
    isDragging.current = false;
    isHovered.current = false;
    setDragging(false);
  }, []);

  const onMouseEnter = useCallback(() => {
    isHovered.current = true;
  }, []);

  // ── Touch drag handlers ─────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragStartOffset.current = offsetRef.current;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = e.touches[0].clientX - dragStartX.current;
    offsetRef.current = dragStartOffset.current + delta;
    applyOffset(offsetRef.current);
  }, [applyOffset]);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Duplicate items for seamless infinite loop
  const all = [...ITEMS, ...ITEMS];

  return (
    <div
      ref={wrapperRef}
      className={styles.carousel}
      role="region"
      aria-label="Media and engagements"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      {/* Pause hint */}
      <div className={styles.hint} aria-hidden="true">
        ← drag to scroll →
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        // CSS animation only used for reduced-motion static layout; JS controls transform otherwise
        style={reduced ? undefined : { animation: "none", willChange: "transform" }}
      >
        {all.map((item, idx) => (
          <div
            key={idx}
            className={styles.item}
            // Prevent drag from accidentally clicking iframes
            style={{ pointerEvents: dragging ? "none" : "auto" }}
          >
            {item.type === "youtube" ? (
              <iframe
                className={styles.ytFrame}
                loading="lazy"
                src={item.src}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <div className={styles.liWrapper}>
                <iframe
                  className={styles.liFrame}
                  loading="lazy"
                  src={item.src}
                  frameBorder="0"
                  allowFullScreen
                  title={item.title}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
