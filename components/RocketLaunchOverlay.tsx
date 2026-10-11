'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import styles from './RocketLaunchOverlay.module.css';

interface LaunchOptions {
  type: 'resume' | 'contact' | 'custom';
  title?: string;
  onComplete?: () => void;
}

interface RocketLaunchContextType {
  triggerLaunch: (options: LaunchOptions) => void;
}

const RocketLaunchContext = createContext<RocketLaunchContextType | null>(null);

export const useRocketLaunch = () => {
  const context = useContext(RocketLaunchContext);
  if (!context) {
    throw new Error('useRocketLaunch must be used within a RocketLaunchProvider');
  }
  return context;
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

export function RocketLaunchProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<LaunchOptions | null>(null);
  const [statusMessage, setStatusMessage] = useState('IGNITING THRUSTERS...');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  const triggerLaunch = useCallback((options: LaunchOptions) => {
    setCurrentOptions(options);
    setIsActive(true);
    setStatusMessage('IGNITING THRUSTERS...');
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        setIsActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  // Main animation sequence
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const rocket = rocketRef.current;
    if (!canvas || !rocket) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particlesRef.current = [];
    const colors = ['#FF8040', '#C45C26', '#F3EEE6', '#FFAA66', '#8A847A'];

    const startTime = performance.now();
    let hasDelivered = false;
    let actionTriggered = false;

    // Rocket physics: start near bottom of viewport
    let rocketY = window.innerHeight - 90;
    let rocketVy = -2.5;
    const rocketAy = -0.55; // upward acceleration

    const animate = (now: number) => {
      const elapsed = now - startTime;

      // Clear canvas with smooth trail fade
      ctx.fillStyle = 'rgba(12, 11, 9, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Accelerate rocket upward
      rocketVy += rocketAy;
      rocketY += rocketVy;

      const rocketX = window.innerWidth / 2;
      rocket.style.top = `${rocketY}px`;

      // Spawn thruster flames and sparks from rocket base
      if (rocketY > -160) {
        for (let i = 0; i < 8; i++) {
          particlesRef.current.push({
            x: rocketX + (Math.random() - 0.5) * 18,
            y: rocketY + 84,
            vx: (Math.random() - 0.5) * 4.5,
            vy: Math.random() * 9 + 4, // blast downward
            size: Math.random() * 5.5 + 2.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: Math.random() * 0.035 + 0.015,
          });
        }
      }

      // Draw and update particle sparks
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size *= 0.97;

        if (p.alpha <= 0 || p.size <= 0.5) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Mid-flight payload delivery & celebratory confetti
      if (rocketY < window.innerHeight * 0.45 && !hasDelivered) {
        hasDelivered = true;

        const isResume = currentOptions?.type === 'resume';
        setStatusMessage(
          isResume ? 'PAYLOAD DELIVERED • RÉSUMÉ DISPATCHED 🚀' : 'TRANSMISSION SENT • READY TO BUILD 🛰️'
        );

        // Confetti burst in brand copper & bone palette
        try {
          confetti({
            particleCount: 110,
            spread: 85,
            origin: { y: 0.4 },
            colors: ['#C45C26', '#FF8040', '#F3EEE6', '#3ECF6E'],
          });
        } catch (e) {
          // ignore if canvas not supported
        }
      }

      // When rocket has completely cleared the screen, open the payload!
      if (elapsed >= 1400 && !actionTriggered) {
        actionTriggered = true;

        if (currentOptions?.onComplete) {
          currentOptions.onComplete();
        } else if (currentOptions?.type === 'resume') {
          const link = document.createElement('a');
          link.href = '/Snehin-Adepu-Resume.pdf';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else if (currentOptions?.type === 'contact') {
          const mailLink = document.createElement('a');
          mailLink.href = 'mailto:adepu.snehin@gmail.com';
          document.body.appendChild(mailLink);
          mailLink.click();
          document.body.removeChild(mailLink);
        }
      }

      // Automatically end when celebration finishes
      if (elapsed > 1850) {
        setIsActive(false);
        return;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, currentOptions]);

  return (
    <RocketLaunchContext.Provider value={{ triggerLaunch }}>
      {children}

      {isActive && (
        <div
          className={styles.overlay}
          onClick={() => setIsActive(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Rocket Launch Animation"
        >
          <canvas ref={canvasRef} className={styles.canvas} />

          {/* HUD Telemetry Banner */}
          <div className={styles.hudOverlay}>
            <span className={styles.telemetryTag}>ORBITAL TELEMETRY</span>
            <div className={styles.statusPill}>
              <span className={styles.statusSuccessDot} />
              <span>{statusMessage}</span>
            </div>
          </div>

          {/* Flying Rocket */}
          <div ref={rocketRef} className={styles.rocketWrapper}>
            <svg
              className={styles.rocketSvg}
              viewBox="0 0 64 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Nose cone */}
              <path
                d="M32 0C32 0 16 16 16 40H48C48 16 32 0 32 0Z"
                fill="#F3EEE6"
              />
              {/* Main Fuselage */}
              <rect x="16" y="40" width="32" height="34" rx="2" fill="#E2DBD0" />
              {/* Copper Accent Stripe */}
              <rect x="16" y="48" width="32" height="8" fill="#C45C26" />
              {/* Porthole */}
              <circle cx="32" cy="32" r="7" fill="#0C0B09" stroke="#C45C26" strokeWidth="2.5" />
              <circle cx="32" cy="32" r="3.5" fill="#3ECF6E" />
              {/* Fins */}
              <path d="M16 54L0 76V82H16V54Z" fill="#C45C26" />
              <path d="M48 54L64 76V82H48V54Z" fill="#C45C26" />
              {/* Center Engine Nozzle */}
              <polygon points="22,74 42,74 46,84 18,84" fill="#8A847A" />
            </svg>
            <div className={styles.thrusterFlame} />
          </div>

          <span className={styles.dismissHint}>Click anywhere or press ESC to dismiss</span>
        </div>
      )}
    </RocketLaunchContext.Provider>
  );
}
