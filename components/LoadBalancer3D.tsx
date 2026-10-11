"use client";

/**
 * LoadBalancer3D — High-Visibility Distributed Systems Visualizer
 *
 * Visualises GCP load balancing + concurrent user traffic:
 * - Request packets streaming into the central load balancer
 * - Dynamic fan-out to 3 scalable backend GCP server instances
 * - Real-time simulated server load pulse indicators
 * - Scaled up for high clarity and legibility
 */

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PerformanceMonitor, Line } from "@react-three/drei";
import * as THREE from "three";

const COPPER = "#C45C26";
const BONE   = "#F3EEE6";
const GREEN  = "#3ecf6e";
const INK    = "#8A847A";

const SERVER_POSITIONS: [number, number, number][] = [
  [ 3.3,  1.2, 0],
  [ 3.3,  0.0, 0],
  [ 3.3, -1.2, 0],
];

const SERVER_LABELS = ["GCP Instance A", "GCP Instance B", "GCP Instance C"];

interface RequestParticle {
  phase: "toLB" | "toServer";
  t: number;
  speed: number;
  targetServer: number;
  color: string;
}

function createParticle(): RequestParticle {
  return {
    phase: "toLB",
    t: Math.random(),
    speed: 0.5 + Math.random() * 0.6,
    targetServer: Math.floor(Math.random() * 3),
    color: Math.random() > 0.5 ? COPPER : BONE,
  };
}

function SceneContent() {
  const groupRef     = useRef<THREE.Group>(null);
  const instanceRef  = useRef<THREE.InstancedMesh>(null);
  const mouse        = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  const isMobile = viewport.width < 7.5;

  // Responsive scale based on canvas viewport width
  // Total span from entry x = -4.2 to servers x = 3.3 (approx 9.2 width with labels)
  const responsiveScale = Math.min(1, Math.max(0.48, viewport.width / 9.2));

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 0.5;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = (e.touches[0].clientX / window.innerWidth  - 0.5) * 0.5;
        mouse.current.y = (e.touches[0].clientY / window.innerHeight - 0.5) * 0.3;
      }
    };
    window.addEventListener("mousemove", h, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", h);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const PARTICLE_POOL = 18;
  const particles = useRef<RequestParticle[]>(
    Array.from({ length: PARTICLE_POOL }, createParticle)
  );

  const serverLoad = useRef([0.4, 0.6, 0.3]);
  const serverMeshes = useRef<(THREE.Mesh | null)[]>([null, null, null]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Entry point — left side
  const entryPos  = new THREE.Vector3(-4.2, 0, 0);
  // Load balancer
  const lbPos     = new THREE.Vector3( 0.0, 0, 0);
  // Server positions
  const serverVecs = SERVER_POSITIONS.map(p => new THREE.Vector3(...p));

  const entryToLB = useMemo(() =>
    new THREE.QuadraticBezierCurve3(entryPos, new THREE.Vector3(-2.1, 0.45, 0.3), lbPos),
    []
  );
  const lbToServer = useMemo(() =>
    serverVecs.map(sv =>
      new THREE.QuadraticBezierCurve3(lbPos, new THREE.Vector3(1.65, (sv.y + lbPos.y) / 2 + 0.25, 0.2), sv)
    ), []
  );

  useFrame((_, delta) => {
    if (!groupRef.current || !instanceRef.current) return;

    groupRef.current.rotation.y += (mouse.current.x * 0.4 - groupRef.current.rotation.y) * delta * 2.5;
    groupRef.current.rotation.x += (-mouse.current.y * 0.25 - groupRef.current.rotation.x) * delta * 2.5;

    particles.current.forEach((p, i) => {
      p.t += delta * p.speed;
      let pos: THREE.Vector3;

      if (p.phase === "toLB") {
        if (p.t >= 1) {
          p.phase = "toServer";
          p.t = 0;
          p.speed = 0.6 + Math.random() * 0.5;
          serverLoad.current[p.targetServer] = Math.min(1, serverLoad.current[p.targetServer] + 0.08);
        }
        pos = entryToLB.getPoint(Math.min(p.t, 1));
      } else {
        if (p.t >= 1) {
          p.phase = "toLB";
          p.t = Math.random() * 0.2;
          p.speed = 0.5 + Math.random() * 0.6;
          p.targetServer = Math.floor(Math.random() * 3);
        }
        pos = lbToServer[p.targetServer].getPoint(Math.min(p.t, 1));
      }

      dummy.position.copy(pos);
      dummy.scale.setScalar(0.08);
      dummy.updateMatrix();
      instanceRef.current!.setMatrixAt(i, dummy.matrix);
    });
    instanceRef.current.instanceMatrix.needsUpdate = true;

    serverMeshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const load = serverLoad.current[i];
      serverLoad.current[i] += (0.4 - load) * delta * 0.3;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + load * 0.8;
    });
  });

  const pathPoints = {
    entryToLB: entryToLB.getPoints(35),
    lbToServer: lbToServer.map(c => c.getPoints(35)),
  };

  return (
    <group ref={groupRef} scale={[responsiveScale, responsiveScale, responsiveScale]}>
      <ambientLight intensity={0.45} />
      <pointLight position={[0, 4, 4]}   intensity={2.2} color={COPPER} />
      <pointLight position={[5, 0, 3]}   intensity={1.2} color={GREEN}  />
      <pointLight position={[-5, 0, 3]}  intensity={1.0} color={BONE}   />

      {/* ── Entry path */}
      <Line points={pathPoints.entryToLB} color={COPPER} lineWidth={2.2} transparent opacity={0.45} />

      {/* ── Entry label */}
      <Html position={[-4.2, 0.7, 0]} center distanceFactor={isMobile ? 12 : 9}>
        <div style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: isMobile ? "8px" : "10px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: BONE,
          background: "rgba(10,9,8,0.92)",
          border: "1px solid rgba(196,92,38,0.4)",
          borderRadius: "4px",
          padding: isMobile ? "2px 5px" : "3px 8px",
          whiteSpace: "nowrap",
          backdropFilter: "blur(6px)",
        }}>
          {isMobile ? "Inbound" : "Requests Inbound"}
        </div>
      </Html>

      {/* ── Inbound particle emitter node */}
      <mesh position={[-4.2, 0, 0]}>
        <sphereGeometry args={[0.30, 16, 12]} />
        <meshStandardMaterial color={COPPER} emissive={COPPER} emissiveIntensity={0.6} roughness={0.25} metalness={0.7} />
      </mesh>

      {/* ── Load Balancer central node */}
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.60]} />
        <meshStandardMaterial color={COPPER} emissive={COPPER} emissiveIntensity={0.7} roughness={0.2} metalness={0.85} />
      </mesh>
      {/* LB outer ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.88, 0.030, 8, 48]} />
        <meshBasicMaterial color={COPPER} transparent opacity={0.55} />
      </mesh>
      <Html position={[0, -1.05, 0]} center distanceFactor={isMobile ? 12 : 9}>
        <div style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: isMobile ? "8.5px" : "11px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: COPPER,
          background: "rgba(10,9,8,0.92)",
          border: "1px solid rgba(196,92,38,0.5)",
          borderRadius: "4px",
          padding: isMobile ? "2px 6px" : "3px 9px",
          whiteSpace: "nowrap",
          backdropFilter: "blur(6px)",
          boxShadow: "0 0 10px rgba(196,92,38,0.3)",
        }}>
          {isMobile ? "Load Balancer" : "Cloud Load Balancer"}
        </div>
      </Html>

      {/* ── Server paths */}
      {pathPoints.lbToServer.map((pts, i) => (
        <Line key={i} points={pts} color={i === 1 ? COPPER : INK} lineWidth={2.0} transparent opacity={0.45} />
      ))}

      {/* ── Server nodes (GCP instances) */}
      {SERVER_POSITIONS.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh ref={(el) => { serverMeshes.current[i] = el; }}>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial
              color={GREEN}
              emissive={GREEN}
              emissiveIntensity={0.5}
              roughness={0.25}
              metalness={0.6}
            />
          </mesh>
          <Html position={[0, -0.75, 0]} center distanceFactor={isMobile ? 12 : 9}>
            <div style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: isMobile ? "8px" : "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: GREEN,
              background: "rgba(10,9,8,0.92)",
              border: "1px solid rgba(62,207,110,0.4)",
              borderRadius: "4px",
              padding: isMobile ? "2px 5px" : "2px 7px",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
            }}>
              {isMobile ? `GCP ${String.fromCharCode(65 + i)}` : SERVER_LABELS[i]}
            </div>
          </Html>
        </group>
      ))}

      {/* ── Instanced request particles */}
      <instancedMesh ref={instanceRef} args={[undefined, undefined, PARTICLE_POOL]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshBasicMaterial color="#FFE090" />
      </instancedMesh>
    </group>
  );
}

export default function LoadBalancer3D({ height = "400px" }: { height?: string }) {
  const [dpr, setDpr]         = useState(1.5);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1, rootMargin: "100px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => { mq.removeEventListener("change", h); obs.disconnect(); };
  }, []);

  if (reduced) return null;

  return (
    <div ref={ref} style={{ width: "100%", height, position: "relative" }}>
      {visible && (
        <Canvas
          camera={{ position: [0, 0, isMobile ? 10.2 : 6.8], fov: isMobile ? 58 : 46 }}
          dpr={dpr}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <PerformanceMonitor onDecline={() => setDpr(1)} />
          <SceneContent />
        </Canvas>
      )}
    </div>
  );
}
