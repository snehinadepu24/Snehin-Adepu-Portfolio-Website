'use client';

import { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import styles from './CobeGlobe.module.css';

export default function CobeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let width = 0;
    let currentPhi = 0;
    const currentTheta = 0.25;
    let rafId: number;
    let isVisible = false; // start paused; resume when in view
    let resizeTimer = 0;

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (canvasRef.current) width = canvasRef.current.offsetWidth;
      }, 120) as unknown as number;
    };
    window.addEventListener('resize', onResize, { passive: true });
    if (canvasRef.current) width = canvasRef.current.offsetWidth;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: (width || 300) * 2,
      height: (width || 300) * 2,
      phi: 0,
      theta: currentTheta,
      dark: 1,
      diffuse: 1.1,
      mapSamples: 14000,
      mapBrightness: 5,
      baseColor: [0.08, 0.07, 0.06],
      markerColor: [0.77, 0.36, 0.15],
      glowColor: [0.77, 0.36, 0.15],
      markers: [
        { location: [17.385, 78.4867], size: 0.08 },
        { location: [39.7684, -86.1581], size: 0.06 },
        { location: [37.7749, -122.4194], size: 0.05 },
        { location: [51.5074, -0.1278], size: 0.05 },
        { location: [35.6762, 139.6503], size: 0.05 },
      ],
    });

    const animate = () => {
      if (!pointerInteracting.current) {
        currentPhi += 0.004;
      } else {
        currentPhi += pointerInteractionMovement.current;
        pointerInteractionMovement.current *= 0.92;
      }

      if (isVisible) {
        globe.update({
          phi: currentPhi,
          width: (width || 300) * 2,
          height: (width || 300) * 2,
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    // Only start rAF once in view
    const obs = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) {
        rafId = requestAnimationFrame(animate);
        setLoaded(true);
      }
    }, { threshold: 0.1 });
    if (canvasRef.current) obs.observe(canvasRef.current.parentElement ?? canvasRef.current);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      obs.disconnect();
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      className={styles.globeContainer}
      data-cursor="drag"
      onPointerDown={(e) => {
        pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grabbing';
        }
      }}
      onPointerUp={() => {
        pointerInteracting.current = null;
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grab';
        }
      }}
      onPointerOut={() => {
        pointerInteracting.current = null;
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'grab';
        }
      }}
      onMouseMove={(e) => {
        if (pointerInteracting.current !== null) {
          const delta = e.clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta * 0.005;
        }
      }}
      onTouchMove={(e) => {
        if (pointerInteracting.current !== null && e.touches[0]) {
          const delta = e.touches[0].clientX - pointerInteracting.current;
          pointerInteractionMovement.current = delta * 0.005;
        }
      }}
    >
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${loaded ? styles.canvasLoaded : ''}`}
      />
      <div className={styles.globeLabel}>
        <span className={styles.pulseDot} />
        <span className={styles.labelText}>Hyderabad • Global Enterprise</span>
      </div>
    </div>
  );
}
