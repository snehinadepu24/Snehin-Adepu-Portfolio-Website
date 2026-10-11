'use client';

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  distance?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
  distance = '40px',
  direction = 'up',
  duration = 700,
  className = '',
  style,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const translateMap = {
    up: `0, ${distance}`,
    down: `0, -${distance}`,
    left: `${distance}, 0`,
    right: `-${distance}, 0`,
  };

  const baseStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0, 0)' : `translate(${translateMap[direction]})`,
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: 'opacity, transform',
  };

  return (
    <div ref={ref} className={className} style={{ ...baseStyle, ...style }}>
      {children}
    </div>
  );
}
