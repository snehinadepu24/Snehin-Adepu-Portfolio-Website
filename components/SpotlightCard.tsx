'use client';

// Source: react-bits (DavidHDev/react-bits) — MIT + Commons Clause
// Spotlight cursor-following glow card — copper themed

import React, { useEffect, useRef } from 'react';
import './SpotlightCard.css';

export type SpotlightCardProps = React.HTMLAttributes<HTMLDivElement> & {
  spotlightColor?: string;
  intensity?: number;
  spotlightSize?: number;
  softness?: number;
  borderGlow?: number;
  proximity?: number;
  smoothing?: number;
  ambient?: boolean;
  flare?: boolean;
};

type Settings = {
  fill: string;
  edge: string;
  size: number;
  intensity: number;
  borderGlow: number;
  proximity: number;
  smoothing: number;
  ambient: boolean;
  flare: boolean;
};

const clamp = (v: number, mn: number, mx: number) => Math.min(mx, Math.max(mn, v));

const falloff = (color: string, softness: number) => {
  const soft = clamp(softness, 0, 1);
  const core = (1 - soft) ** 1.5 * 0.85;
  const stop = (alpha: number, at: number) =>
    `color-mix(in srgb, ${color} ${(alpha * 100).toFixed(2)}%, transparent) ${(at * 100).toFixed(2)}%`;
  const list = [stop(1, 0)];
  for (let i = 0; i <= 14; i++) {
    const t = core + ((1 - core) * i) / 14;
    const g = (t - core) / (1 - core);
    const smooth = 1 - g * g * (3 - 2 * g);
    const glow = Math.exp(-4.6 * g * g) * (1 - g ** 6);
    list.push(stop(smooth + (glow - smooth) * soft, t));
  }
  return list.join(', ');
};

const SpotlightCard = ({
  children,
  className = '',
  style,
  spotlightColor = '#C45C26',
  intensity = 0.14,
  spotlightSize = 260,
  softness = 0.75,
  borderGlow = 0.5,
  proximity = 100,
  smoothing = 0.25,
  ambient = false,
  flare = true,
  ...rest
}: SpotlightCardProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLSpanElement>(null);
  const edgeRef = useRef<HTMLSpanElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);

  const settings: Settings = {
    fill: falloff(spotlightColor, softness),
    edge: falloff(spotlightColor, 1),
    size: Math.max(20, spotlightSize),
    intensity: clamp(intensity, 0, 1),
    borderGlow: clamp(borderGlow, 0, 1),
    proximity: Math.max(0, proximity),
    smoothing: clamp(smoothing, 0, 1),
    ambient,
    flare,
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => { wakeRef.current?.(); });

  useEffect(() => {
    const root = rootRef.current;
    const light = lightRef.current;
    const edge = edgeRef.current;
    if (!root || !light || !edge) return undefined;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const state = { x: 0, y: 0, presence: 0, flare: 0, time: Math.random() * 60, pressed: false, visible: true };
    const pointer = { x: 0, y: 0, active: false };
    let raf = 0, last = 0, alive = true;

    const gradient = (s: Settings, x: number, y: number, stops: string) =>
      `radial-gradient(circle ${s.size.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, ${stops})`;

    const paint = (s: Settings) => {
      const boost = 1 + 0.7 * state.flare;
      light.style.background = gradient(s, state.x, state.y, s.fill);
      edge.style.background = gradient(s, state.x, state.y, s.edge);
      light.style.opacity = String(Math.min(1, state.presence * s.intensity * boost));
      edge.style.opacity = String(Math.min(1, state.presence * s.borderGlow * boost));
    };

    const tick = (now: number) => {
      raf = 0;
      if (!alive) return;
      if (document.hidden) return; // tab backgrounded — skip frame
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const rect = root.getBoundingClientRect();
      let tx = state.x, ty = state.y, target = 0;

      if (pointer.active) {
        tx = pointer.x - rect.left;
        ty = pointer.y - rect.top;
        const gap = Math.hypot(Math.max(0, -tx, tx - rect.width), Math.max(0, -ty, ty - rect.height));
        if (gap === 0) target = 1;
        else if (s.proximity > 0) target = Math.max(0, 1 - gap / s.proximity) ** 2;
      }
      if (target < 0.6 && s.ambient && state.visible) {
        if (!reduce) state.time += dt;
        const drift = 0.6 - target;
        tx += (rect.width * (0.5 + 0.34 * Math.sin(state.time * 0.43)) - tx) * (drift / 0.6);
        ty += (rect.height * (0.5 + 0.3 * Math.sin(state.time * 0.61 + 1.3)) - ty) * (drift / 0.6);
        target = 0.6;
      }
      if (state.presence < 0.02 && target > 0) { state.x = tx; state.y = ty; }
      const follow = reduce ? 1 : 1 - Math.exp(-dt / (0.015 + s.smoothing * 0.22));
      state.x += (tx - state.x) * follow;
      state.y += (ty - state.y) * follow;
      const fade = reduce ? 1 : 1 - Math.exp(-dt / (target > state.presence ? 0.1 : 0.32));
      state.presence += (target - state.presence) * fade;
      if (Math.abs(target - state.presence) < 0.002) state.presence = target;
      const press = state.pressed && s.flare && !reduce ? 1 : 0;
      state.flare += (press - state.flare) * (1 - Math.exp(-dt / (press ? 0.05 : 0.28)));
      paint(s);
      const settled = Math.abs(tx - state.x) < 0.1 && Math.abs(ty - state.y) < 0.1 && state.presence === target;
      if (!settled || (s.ambient && state.visible && !reduce)) raf = requestAnimationFrame(tick);
    };

    const wake = () => { if (raf || !alive) return; last = performance.now(); raf = requestAnimationFrame(tick); };
    wakeRef.current = wake;

    const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; wake(); };
    const onOut = (e: PointerEvent) => { if (e.relatedTarget) return; pointer.active = false; wake(); };
    const onDown = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; state.pressed = true; wake(); };
    const onUp = (e: PointerEvent) => { if (e.pointerType !== 'mouse') pointer.active = false; state.pressed = false; wake(); };

    // Use a meaningful threshold so cards only animate when substantially visible
    const obs = new IntersectionObserver(
      entries => {
        state.visible = entries.some(e => e.isIntersecting);
        if (state.visible) wake();
      },
      { threshold: 0.2 }
    );
    obs.observe(root);

    // Also pause when the tab is hidden
    const onVisChange = () => { if (!document.hidden && state.visible) wake(); };
    document.addEventListener('visibilitychange', onVisChange);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    document.addEventListener('pointerout', onOut);
    root.addEventListener('pointerdown', onDown);

    wake();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      obs.disconnect();
      document.removeEventListener('visibilitychange', onVisChange);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.removeEventListener('pointerout', onOut);
      root.removeEventListener('pointerdown', onDown);
      wakeRef.current = null;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`spotlight-card${className ? ` ${className}` : ''}`}
      style={{
        '--spotlight-card-surface': '#1C1B17',
        '--spotlight-card-border': 'rgba(243,238,230,0.06)',
        '--spotlight-card-shadow': '0 12px 40px rgba(0,0,0,0.5)',
        ...style,
      } as React.CSSProperties}
      {...rest}
    >
      <span ref={lightRef} className="spotlight-card__light" aria-hidden="true" />
      {children}
      <span className="spotlight-card__border" aria-hidden="true" />
      <span ref={edgeRef} className="spotlight-card__edge" aria-hidden="true" />
    </div>
  );
};

export default SpotlightCard;
