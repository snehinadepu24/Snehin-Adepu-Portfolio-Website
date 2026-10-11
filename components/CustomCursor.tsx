'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hoverState, setHoverState] = useState<'default' | 'hover' | 'badge'>('default');
  const [badgeText, setBadgeText] = useState('');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth lag follower using spring physics
  const springX = useSpring(mouseX, { damping: 26, stiffness: 320, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 26, stiffness: 320, mass: 0.5 });

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);

      // Check hovered element for data-cursor or link/button tag
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const cursorType = cursorTarget.getAttribute('data-cursor');
        if (cursorType === 'launch') {
          setHoverState('badge');
          setBadgeText('LAUNCH 🚀');
          return;
        } else if (cursorType === 'visit') {
          setHoverState('badge');
          setBadgeText('VISIT ↗');
          return;
        } else if (cursorType === 'view') {
          setHoverState('badge');
          setBadgeText('EXPLORE ↗');
          return;
        } else if (cursorType === 'drag') {
          setHoverState('badge');
          setBadgeText('DRAG 3D ↺');
          return;
        } else if (cursorType) {
          setHoverState('badge');
          setBadgeText(cursorType.toUpperCase());
          return;
        }
      }

      // Check if hovering clickable interactive element
      const interactive = target.closest('a, button, [role="button"], input, select');
      if (interactive) {
        setHoverState('hover');
        setBadgeText('');
      } else {
        setHoverState('default');
        setBadgeText('');
      }
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, visible]);

  if (!mounted) return null;

  return (
    <div className={`${styles.cursorContainer} ${!visible ? styles.hidden : ''}`} aria-hidden="true">
      {/* Precision center dot */}
      <motion.div
        className={styles.cursorDot}
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />

      {/* Spring follower ring / badge */}
      <motion.div
        className={`${styles.cursorRing} ${
          hoverState === 'badge'
            ? styles.ringBadge
            : hoverState === 'hover'
            ? styles.ringHover
            : styles.ringDefault
        }`}
        style={{
          x: springX,
          y: springY,
        }}
      >
        {hoverState === 'badge' && badgeText && (
          <span className={styles.cursorBadgeText}>{badgeText}</span>
        )}
      </motion.div>
    </div>
  );
}
