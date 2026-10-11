"use client";

/**
 * HeroLattice — Deep Learning Neural Architecture & Latent Core
 *
 * Proportionally scaled to fit comfortably inside the viewport:
 * - Calibrated radii (1.34 core, 1.85 latent, 2.50 hidden, 3.15 input)
 * - Zero abrupt clipping on left, right, top, or bottom
 * - 32 High-intensity real-time data signal pulses streaming into portrait rim sockets
 * - 8 High-intensity docking sockets on the portrait circumference
 * - Tight, crisp mathematical tensor annotations (Input x, Attn(Q,K,V), W·x+b, Latent z)
 */

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PerformanceMonitor, Line } from "@react-three/drei";
import * as THREE from "three";

// ── Geometry Constants ─────────────────────────────────────────
const CORE_RADIUS = 1.34; // Matches the portrait circle border
const SOCKET_COUNT = 8;
const PULSE_COUNT = 32;

// Mobile optimization flags
const isMobileDevice = () => typeof window !== "undefined" && window.innerWidth < 768;

// ── Multi-Layer Architecture (calibrated radii prevent screen clipping) ──
interface LayerDef {
  name: string;
  count: number;
  radius: number;
  zSpread: number;
  color: string;
  size: number;
  shape: "sphere" | "octa";
}

const LAYER_DEFS: LayerDef[] = [
  { name: "input",  count: 6,  radius: 3.15, zSpread: 0.5, color: "#F3EEE6", size: 0.15, shape: "sphere" },
  { name: "hidden", count: 10, radius: 2.50, zSpread: 0.4, color: "#FF7A30", size: 0.14, shape: "octa" },
  { name: "latent", count: 8,  radius: 1.85, zSpread: 0.3, color: "#FF9944", size: 0.12, shape: "sphere" },
];

// Mobile uses smaller radii to fit in viewport
const LAYER_DEFS_MOBILE: LayerDef[] = [
  { name: "input",  count: 6,  radius: 2.4, zSpread: 0.4, color: "#F3EEE6", size: 0.13, shape: "sphere" },
  { name: "hidden", count: 10, radius: 1.9, zSpread: 0.3, color: "#FF7A30", size: 0.12, shape: "octa" },
  { name: "latent", count: 8,  radius: 1.4, zSpread: 0.25, color: "#FF9944", size: 0.10, shape: "sphere" },
];

// Deep learning mathematical badges with tight offsets
const TENSOR_BADGES = [
  { text: "Input x ∈ ℝᵈ",   layer: 0, nodeIdx: 1, offset: [-0.15,  0.26, 0] },
  { text: "Tokens [1...N]", layer: 0, nodeIdx: 3, offset: [ 0.15, -0.26, 0] },
  { text: "Attn(Q, K, V)",  layer: 1, nodeIdx: 2, offset: [-0.20,  0.26, 0] },
  { text: "W · x + b",      layer: 1, nodeIdx: 6, offset: [ 0.15, -0.26, 0] },
  { text: "LayerNorm(z)",   layer: 1, nodeIdx: 8, offset: [ 0.20,  0.26, 0] },
  { text: "Latent z ~ 1536d", layer: 2, nodeIdx: 0, offset: [-0.20, 0.24, 0] },
  { text: "Loss: 0.002",    layer: 2, nodeIdx: 4, offset: [ 0.15, -0.24, 0] },
];

function buildSockets(): THREE.Vector3[] {
  return Array.from({ length: SOCKET_COUNT }, (_, i) => {
    const angle = (i / SOCKET_COUNT) * Math.PI * 2;
    return new THREE.Vector3(
      Math.cos(angle) * CORE_RADIUS,
      Math.sin(angle) * CORE_RADIUS,
      0
    );
  });
}

function buildNodes(): THREE.Vector3[][] {
  const layerDefs = isMobileDevice() ? LAYER_DEFS_MOBILE : LAYER_DEFS;
  return layerDefs.map((layer, lIdx) =>
    Array.from({ length: layer.count }, (_, i) => {
      const angle = (i / layer.count) * Math.PI * 2 + (lIdx * 0.35);
      return new THREE.Vector3(
        Math.cos(angle) * layer.radius,
        Math.sin(angle) * layer.radius,
        (Math.sin(i * 1.6 + lIdx) * 0.4) * layer.zSpread
      );
    })
  );
}

interface PulseData {
  p0: THREE.Vector3;
  p1: THREE.Vector3;
  t: number;
  speed: number;
  isCore: boolean;
}

function NeuralConstellation() {
  const groupRef       = useRef<THREE.Group>(null);
  const pulseInstanced = useRef<THREE.InstancedMesh>(null);
  const mouse          = useRef({ x: 0, y: 0, active: false });

  const sockets = useMemo(() => buildSockets(), []);
  const layers  = useMemo(() => buildNodes(), []);
  const layerDefs = useMemo(() => isMobileDevice() ? LAYER_DEFS_MOBILE : LAYER_DEFS, []);

  // Build high-density synaptic edges
  const { edges, edgeList } = useMemo(() => {
    const res: { a: THREE.Vector3; b: THREE.Vector3; isCore: boolean; key: string }[] = [];
    const paths: { p0: THREE.Vector3; p1: THREE.Vector3; isCore: boolean }[] = [];

    // 1. Input layer -> Hidden layer
    layers[0].forEach((inPos, i) => {
      const sorted = [...layers[1]].sort((a, b) => inPos.distanceTo(a) - inPos.distanceTo(b));
      sorted.slice(0, 2).forEach((hPos, j) => {
        res.push({ a: inPos, b: hPos, isCore: false, key: `in-${i}-${j}` });
        paths.push({ p0: inPos, p1: hPos, isCore: false });
      });
    });

    // 2. Hidden layer interconnections & Hidden -> Latent
    layers[1].forEach((hPos, i) => {
      const nextH = layers[1][(i + 1) % layers[1].length];
      res.push({ a: hPos, b: nextH, isCore: false, key: `h-loop-${i}` });
      paths.push({ p0: hPos, p1: nextH, isCore: false });

      const sorted = [...layers[2]].sort((a, b) => hPos.distanceTo(a) - hPos.distanceTo(b));
      sorted.slice(0, 2).forEach((lPos, j) => {
        res.push({ a: hPos, b: lPos, isCore: false, key: `h-l-${i}-${j}` });
        paths.push({ p0: hPos, p1: lPos, isCore: false });
      });
    });

    // 3. Latent layer -> DIRECT CONDUITS INTO 8 PORTRAIT CORE SOCKETS
    layers[2].forEach((lPos, i) => {
      const sorted = [...sockets].sort((a, b) => lPos.distanceTo(a) - lPos.distanceTo(b));
      sorted.slice(0, 2).forEach((sock, j) => {
        res.push({ a: lPos, b: sock, isCore: true, key: `core-${i}-${j}` });
        paths.push({ p0: lPos, p1: sock, isCore: true });
      });
    });

    return { edges: res, edgeList: paths };
  }, [layers, sockets]);

  // Real-time signal pulses
  const pulses = useRef<PulseData[]>(
    Array.from({ length: PULSE_COUNT }, () => {
      const pick = edgeList[Math.floor(Math.random() * edgeList.length)] || {
        p0: new THREE.Vector3(),
        p1: new THREE.Vector3(),
        isCore: false,
      };
      return {
        p0: pick.p0,
        p1: pick.p1,
        t: Math.random(),
        speed: 0.5 + Math.random() * 0.7,
        isCore: pick.isCore,
      };
    })
  );

  // Per-socket energy flash
  const socketEnergy = useRef<number[]>(new Array(SOCKET_COUNT).fill(0));
  const socketMeshes = useRef<(THREE.Mesh | null)[]>(new Array(SOCKET_COUNT).fill(null));

  const { viewport } = useThree();
  const responsiveScale = Math.min(1, Math.max(0.75, viewport.width / 7.2));
  const dummyMatrix = useMemo(() => new THREE.Matrix4(), []);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsDesktop(!mobile);
      setIsMobile(mobile);
    };
    checkDevice();
    const onResize = () => checkDevice();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.current.active = true;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
        mouse.current.y = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
        mouse.current.active = true;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth responsive perspective tilt (gentle so it doesn't push nodes out of bounds)
    const targetY = mouse.current.x * 0.25;
    const targetX = -mouse.current.y * 0.18;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * delta * 2.5;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * delta * 2.5;

    // Slow ambient rotation
    groupRef.current.rotation.z += delta * 0.025;

    // Animate 32 Glowing Data Pulses
    if (pulseInstanced.current) {
      pulses.current.forEach((pulse, i) => {
        pulse.t += delta * pulse.speed;
        if (pulse.t >= 1) {
          if (pulse.isCore) {
            sockets.forEach((s, sIdx) => {
              if (s.distanceTo(pulse.p1) < 0.15) {
                socketEnergy.current[sIdx] = 1.0;
              }
            });
          }
          pulse.t = 0;
          const pick = edgeList[Math.floor(Math.random() * edgeList.length)] || {
            p0: new THREE.Vector3(),
            p1: new THREE.Vector3(),
            isCore: false,
          };
          pulse.p0 = pick.p0;
          pulse.p1 = pick.p1;
          pulse.isCore = pick.isCore;
          pulse.speed = 0.5 + Math.random() * 0.8;
        }

        const currX = THREE.MathUtils.lerp(pulse.p0.x, pulse.p1.x, pulse.t);
        const currY = THREE.MathUtils.lerp(pulse.p0.y, pulse.p1.y, pulse.t);
        const currZ = THREE.MathUtils.lerp(pulse.p0.z, pulse.p1.z, pulse.t);

        const pulseScale = pulse.isCore ? 1.35 : 1.0;
        dummyMatrix.makeTranslation(currX, currY, currZ);
        dummyMatrix.scale(new THREE.Vector3(pulseScale, pulseScale, pulseScale));
        pulseInstanced.current!.setMatrixAt(i, dummyMatrix);
      });
      pulseInstanced.current.instanceMatrix.needsUpdate = true;
    }

    // Decay socket flash energy on portrait ring
    socketEnergy.current.forEach((val, sIdx) => {
      socketEnergy.current[sIdx] = Math.max(0, val - delta * 3.0);
      const mesh = socketMeshes.current[sIdx];
      if (mesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.0 + socketEnergy.current[sIdx] * 3.5;
      }
    });
  });

  return (
    <group ref={groupRef} scale={[responsiveScale, responsiveScale, responsiveScale]}>
      {/* ── High-Contrast Studio Lighting ── */}
      <ambientLight intensity={isMobile ? 0.85 : 0.65} />
      <pointLight position={[0, 0, 5]} intensity={isMobile ? 4.5 : 3.5} color="#FF7A30" />
      <pointLight position={[4, -3, 3]} intensity={isMobile ? 2.2 : 1.5} color="#F3EEE6" />
      <pointLight position={[-4, 3, 3]} intensity={isMobile ? 2.5 : 1.8} color="#FF9944" />

      {/* ── HIGH-VISIBILITY SYNAPTIC EDGES ── */}
      {edges.map((edge) => (
        <Line
          key={edge.key}
          points={[edge.a, edge.b]}
          color={edge.isCore ? "#FFAA55" : "#FF6622"}
          lineWidth={edge.isCore ? (isMobile ? 2.5 : 1.8) : (isMobile ? 1.8 : 1.1)}
          transparent
          opacity={edge.isCore ? (isMobile ? 0.95 : 0.85) : (isMobile ? 0.75 : 0.55)}
        />
      ))}

      {/* ── ACTIVE NEURAL NODES ── */}
      {layerDefs.map((layer, lIdx) =>
        layers[lIdx].map((pos, nIdx) => {
          const mobileScale = isMobile ? 1.25 : 1.0;
          return (
            <group key={`node-grp-${lIdx}-${nIdx}`} position={pos}>
              {/* Outer Translucent Halos for Deep Glow */}
              <mesh>
                <sphereGeometry args={[layer.size * 1.4 * mobileScale, 12, 10]} />
                <meshBasicMaterial
                  color={layer.color}
                  transparent
                  opacity={isMobile ? 0.28 : 0.18}
                />
              </mesh>

              {/* Core Solid Active Node */}
              <mesh>
                {layer.shape === "octa" ? (
                  <octahedronGeometry args={[layer.size * mobileScale, 0]} />
                ) : (
                  <sphereGeometry args={[layer.size * mobileScale, 16, 12]} />
                )}
                <meshStandardMaterial
                  color={layer.color}
                  emissive={layer.color === "#F3EEE6" ? "#FF8844" : "#FF5500"}
                  emissiveIntensity={isMobile ? 2.2 : 1.8}
                  roughness={0.15}
                  metalness={0.9}
                />
              </mesh>
            </group>
          );
        })
      )}

      {/* ── 8 HIGH-INTENSITY DOCKING SOCKETS ON PORTRAIT RIM ── */}
      {sockets.map((sockPos, idx) => {
        const mobileSocketScale = isMobile ? 1.3 : 1.0;
        return (
          <group key={`socket-grp-${idx}`} position={sockPos}>
            <mesh>
              <sphereGeometry args={[0.08 * mobileSocketScale, 12, 10]} />
              <meshBasicMaterial color="#FFAA55" transparent opacity={isMobile ? 0.5 : 0.35} />
            </mesh>
            <mesh ref={(el) => { socketMeshes.current[idx] = el; }}>
              <sphereGeometry args={[0.052 * mobileSocketScale, 14, 12]} />
              <meshStandardMaterial
                color="#FFFFFF"
                emissive="#FF8040"
                emissiveIntensity={isMobile ? 2.0 : 1.4}
                roughness={0.1}
                metalness={0.95}
              />
            </mesh>
          </group>
        );
      })}

      {/* ── LUMINOUS PORTRAIT RIM DOCKING COUPLER (TORUS) ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[CORE_RADIUS, isMobile ? 0.022 : 0.016, 8, 96]} />
        <meshBasicMaterial color="#FF7A30" transparent opacity={isMobile ? 0.85 : 0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[CORE_RADIUS + 0.025, isMobile ? 0.012 : 0.008, 8, 96]} />
        <meshBasicMaterial color="#FFAA55" transparent opacity={isMobile ? 0.6 : 0.4} />
      </mesh>

      {/* ── 32 GLOWING 3D DATA SIGNAL PULSES (INSTANCED) ── */}
      <instancedMesh
        ref={pulseInstanced}
        args={[undefined, undefined, PULSE_COUNT]}
      >
        <sphereGeometry args={[isMobile ? 0.070 : 0.065, 12, 10]} />
        <meshBasicMaterial color="#FFF1D0" />
      </instancedMesh>

      {/* ── FLOATING DEEP LEARNING MATHEMATICAL HUD BADGES (Desktop only to prevent mobile clutter) ── */}
      {isDesktop && TENSOR_BADGES.map((item, idx) => {
        const basePos = layers[item.layer]?.[item.nodeIdx];
        if (!basePos) return null;
        const pos: [number, number, number] = [
          basePos.x + item.offset[0],
          basePos.y + item.offset[1],
          basePos.z + item.offset[2],
        ];
        return (
          <Html
            key={`tensor-badge-${idx}`}
            position={pos}
            center
            distanceFactor={10}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: "#F3EEE6",
                background: "rgba(10, 9, 8, 0.88)",
                border: "1px solid rgba(255, 122, 48, 0.5)",
                borderRadius: "4px",
                padding: "2px 7px",
                whiteSpace: "nowrap",
                backdropFilter: "blur(8px)",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#FF7A30",
                  boxShadow: "0 0 8px #FF7A30",
                  display: "inline-block",
                }}
              />
              {item.text}
            </div>
          </Html>
        );
      })}
    </group>
  );
}

// Fallback for reduced motion
function SvgFallback() {
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true" style={{ width: "100%", height: "100%", opacity: 0.35 }}>
      <circle cx="150" cy="150" r="100" fill="none" stroke="#FF7A30" strokeWidth="1" strokeDasharray="5 4" />
      <circle cx="150" cy="150" r="65" fill="none" stroke="#F3EEE6" strokeWidth="0.8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 150 + Math.cos(rad) * 65;
        const y = 150 + Math.sin(rad) * 65;
        return <circle key={i} cx={x} cy={y} r="4" fill="#FFAA55" />;
      })}
    </svg>
  );
}

export default function HeroLattice() {
  const [dpr, setDpr]         = useState(1.5);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const ref                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (ref.current) obs.observe(ref.current);

    // Detect mobile for camera adjustments
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      mq.removeEventListener("change", h);
      obs.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (reduced) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <SvgFallback />
      </div>
    );
  }

  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      {visible && (
        <Canvas
          camera={{ position: [0, 0, isMobile ? 5.2 : 7.8], fov: isMobile ? 52 : 48 }}
          dpr={dpr}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <PerformanceMonitor onDecline={() => setDpr(1)} />
          <NeuralConstellation />
        </Canvas>
      )}
    </div>
  );
}
