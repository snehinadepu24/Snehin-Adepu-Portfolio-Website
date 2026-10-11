'use client';

// Source: react-bits (DavidHDev/react-bits) — MIT + Commons Clause
// Magnetic hover effect for CTA buttons
// Perf: uses a single shared rAF-throttled global mousemove listener
// instead of one per instance; reads getBoundingClientRect only when
// the element has transitioned into/out of proximity (not every frame).

import React, { useState, useEffect, useRef, useCallback, type ReactNode, type HTMLAttributes } from 'react';

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

// ── Shared global mouse tracker (one listener for all Magnet instances) ──
type MouseHandler = (x: number, y: number) => void;
const _handlers = new Set<MouseHandler>();
let _rafId = 0;
let _pendingX = 0;
let _pendingY = 0;

function _flush() {
  _rafId = 0;
  _handlers.forEach(h => h(_pendingX, _pendingY));
}

function _onMove(e: MouseEvent) {
  _pendingX = e.clientX;
  _pendingY = e.clientY;
  if (!_rafId) _rafId = requestAnimationFrame(_flush);
}

function registerHandler(h: MouseHandler) {
  if (_handlers.size === 0) window.addEventListener('mousemove', _onMove, { passive: true });
  _handlers.add(h);
}

function unregisterHandler(h: MouseHandler) {
  _handlers.delete(h);
  if (_handlers.size === 0) {
    window.removeEventListener('mousemove', _onMove);
    if (_rafId) { cancelAnimationFrame(_rafId); _rafId = 0; }
  }
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 80,
  disabled = false,
  magnetStrength = 2.5,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Use a ref for position to avoid triggering extra renders
  const posRef = useRef({ x: 0, y: 0 });
  const activeRef = useRef(false);

  const applyTransform = useCallback((x: number, y: number, active: boolean) => {
    if (!innerRef.current) return;
    innerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    innerRef.current.style.transition = active ? activeTransition : inactiveTransition;
    innerRef.current.style.willChange = active ? 'transform' : 'auto';
  }, [activeTransition, inactiveTransition]);

  useEffect(() => {
    if (disabled) {
      activeRef.current = false;
      setIsActive(false);
      applyTransform(0, 0, false);
      return;
    }

    const handler: MouseHandler = (clientX, clientY) => {
      if (!wrapperRef.current) return;
      const { left, top, width, height } = wrapperRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = Math.abs(centerX - clientX);
      const distY = Math.abs(centerY - clientY);
      const inRange = distX < width / 2 + padding && distY < height / 2 + padding;

      if (inRange) {
        const ox = (clientX - centerX) / magnetStrength;
        const oy = (clientY - centerY) / magnetStrength;
        posRef.current = { x: ox, y: oy };
        if (!activeRef.current) { activeRef.current = true; setIsActive(true); }
        applyTransform(ox, oy, true);
      } else if (activeRef.current) {
        activeRef.current = false;
        posRef.current = { x: 0, y: 0 };
        setIsActive(false);
        applyTransform(0, 0, false);
      }
    };

    registerHandler(handler);
    return () => unregisterHandler(handler);
  }, [padding, disabled, magnetStrength, applyTransform]);

  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <div ref={innerRef} className={innerClassName}>
        {children}
      </div>
    </div>
  );
};

export default Magnet;
