"use client";

/**
 * FrameScrubPortrait — Latent Core & Neural Attention Hub
 *
 * Integrated with the 3D HeroLattice neural network:
 * - 8 Perimeter Synaptic Docking Sockets matching the 3D network convergence
 * - Gyroscopic Multi-Head Attention rotating telemetry rings
 * - Real-time Forward-Pass & Epoch Training Telemetry readout
 * - Smooth scroll-scrubbing across frames 1–50
 */

import { useEffect, useRef, useState } from "react";
// NOTE: fraction state removed — all scroll-driven updates are now imperative
// (direct DOM mutations) to avoid 60 React re-renders/second while scrolling.
import styles from "./FrameScrubPortrait.module.css";

const TOTAL_FRAMES = 50;
const SOCKET_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function FrameScrubPortrait() {
  const imgRef         = useRef<HTMLImageElement>(null);
  const ringRef        = useRef<SVGCircleElement>(null);
  const titleRef       = useRef<HTMLSpanElement>(null);
  const lossRef        = useRef<HTMLSpanElement>(null);
  const scrollHintRef  = useRef<HTMLDivElement>(null);
  const framesRef      = useRef<string[]>([]);
  const fractionRef    = useRef(0);
  // Keep a tiny render-state just for the initial mount (shows frame 0 src)
  const [ready, setReady] = useState(false);

  // Preload frames — stagger to not block the main thread at startup
  useEffect(() => {
    const urls = Array.from({ length: TOTAL_FRAMES }, (_, i) =>
      `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`
    );
    framesRef.current = urls;
    setReady(true);

    // Preload first 18 immediately
    urls.slice(0, 18).forEach((src) => { const img = new Image(); img.src = src; });
    // Defer the rest
    setTimeout(() => {
      urls.slice(18).forEach((src) => { const img = new Image(); img.src = src; });
    }, 600);
  }, []);

  // Scroll listener — fully imperative, zero React state updates on scroll
  useEffect(() => {
    if (!ready) return;
    const circumference = 2 * Math.PI * 48;

    // Cache layout reads — recompute only on resize, not every scroll tick
    let runwayTop    = 0;
    let scrollZone   = 1;

    const cacheLayout = () => {
      const runway = document.getElementById("hero-runway");
      if (!runway) return;
      runwayTop  = runway.offsetTop;
      scrollZone = Math.max(runway.offsetHeight - window.innerHeight, 1);
    };
    cacheLayout();

    const onResize = () => cacheLayout();
    window.addEventListener("resize", onResize, { passive: true });

    const update = () => {
      const scrolled = Math.max(window.scrollY - runwayTop, 0);
      const frac     = Math.min(Math.max(scrolled / scrollZone, 0), 1);
      fractionRef.current = frac;

      // Frame swap
      const idx = Math.min(Math.floor(frac * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
      if (imgRef.current) imgRef.current.src = framesRef.current[idx] ?? framesRef.current[0];

      // Progress ring
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(circumference * (1 - frac));
      }

      // Telemetry badge — direct DOM mutation, no re-render
      if (titleRef.current) {
        const frameIdx = idx + 1;
        titleRef.current.textContent =
          frac === 0 ? "LATENT CORE · STANDBY"
          : frac < 1  ? `FORWARD PASS · FRAME ${frameIdx}/${TOTAL_FRAMES}`
          :              "CONVERGENCE · 100% OPTIMIZED";
      }
      if (lossRef.current) {
        lossRef.current.textContent = `LOSS: ${(0.048 / (1 + frac * 3.8)).toFixed(4)}`;
      }

      // Scroll hint opacity
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(Math.max(1 - frac * 5, 0));
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
    };
  }, [ready]);

  return (
    <div className={styles.wrapper}>
      {/* Ambient Neural Backlight & Orbital Shell */}
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.border} aria-hidden="true" />

      {/* Embedded Portrait Circle */}
      <div className={styles.circle}>
        <img
          ref={imgRef}
          src="/frames/frame_0001.jpg"
          alt="Snehin Adepu"
          className={styles.image}
          draggable={false}
        />
        {/* Softening inner neural rim vignette */}
        <div className={styles.circleVignette} aria-hidden="true" />
      </div>

      {/* ── Multi-Head Attention Gyroscopic SVG Ring ── */}
      <svg className={styles.progressRing} viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-copper)" />
            <stop offset="60%" stopColor="#FF8040" />
            <stop offset="100%" stopColor="var(--color-bone)" />
          </linearGradient>
          <radialGradient id="socketGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF8040" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-copper)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Counter-rotating inner Attention Weight ring */}
        <circle
          className={styles.attentionRing}
          cx="50"
          cy="50"
          r="46"
          strokeDasharray="2 4"
        />

        {/* Progress ring track */}
        <circle className={styles.ringTrack} cx="50" cy="50" r="48" />

        {/* Dynamic inference progress ring */}
        <circle
          ref={ringRef}
          className={styles.ringFill}
          cx="50"
          cy="50"
          r="48"
          strokeDasharray={301.6}
          strokeDashoffset={301.6}
        />

        {/* 8 Synaptic Docking Sockets connected to 3D network */}
        {SOCKET_ANGLES.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 50 + 48 * Math.cos(rad);
          const cy = 50 + 48 * Math.sin(rad);
          return (
            <g key={`socket-${i}`} className={styles.socketGroup}>
              <circle cx={cx} cy={cy} r="2.2" className={styles.socketPulse} />
              <circle cx={cx} cy={cy} r="1.3" className={styles.socketCore} />
            </g>
          );
        })}
      </svg>

      {/* ── Real-Time Deep Learning Telemetry Badge ── */}
      <div className={styles.telemetryBadge}>
        <div className={styles.telemetryHeader}>
          <span className={styles.telemetryDot} />
          <span ref={titleRef} className={styles.telemetryTitle}>
            LATENT CORE · STANDBY
          </span>
        </div>
        <div className={styles.telemetryData}>
          <span ref={lossRef}>LOSS: 0.0480</span>
          <span className={styles.telemetryDivider}>|</span>
          <span>DIM: 1536</span>
          <span className={styles.telemetryDivider}>|</span>
          <span>HEAD: 08/08</span>
        </div>
      </div>

      {/* Initial Scroll Prompt Badge (fades out as user scrolls) */}
      <div
        ref={scrollHintRef}
        className={styles.scrollHintBadge}
        style={{ opacity: 1 }}
        aria-hidden="true"
      >
        <span className={styles.scrollHintArrow}>↓</span>
        <span className={styles.scrollHintText}>scroll to compute</span>
      </div>
    </div>
  );
}
