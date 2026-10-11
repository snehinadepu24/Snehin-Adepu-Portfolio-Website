"use client";

/**
 * PipelineScene — High-Visibility Animated Data-Flow Pipeline
 *
 * Prominent 3D nodes (scaled up for high clarity and legibility),
 * high-contrast flowing particle streams, and interactive hover effects.
 * Used for:
 *   - Work section  → LLM / RAG pipeline
 *   - Lab section   → Data ingestion pipeline
 */

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PerformanceMonitor, Line } from "@react-three/drei";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────── */
/*  Types                                                      */
/* ─────────────────────────────────────────────────────────── */
export interface PipelineNode {
  label: string;
  sublabel?: string;
  color?: string;
  shape?: "sphere" | "box" | "cylinder" | "octahedron";
  x: number;
  y: number;
  z: number;
}

export interface PipelineSceneProps {
  nodes: PipelineNode[];
  edges: [number, number][];
  height?: string;
  camZ?: number;
  particleSpeed?: number;
  particleCount?: number;
}

/* ─────────────────────────────────────────────────────────── */
/*  Single node mesh (enlarged geometry & high-contrast glow)  */
/* ─────────────────────────────────────────────────────────── */
function NodeMesh({
  node,
  hovered,
  onClick,
  index = 0,
}: {
  node: PipelineNode;
  hovered: boolean;
  onClick: () => void;
  index?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color   = node.color ?? "#C45C26";
  const { viewport } = useThree();
  const isMobile = viewport.width < 7.5;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * (hovered ? 2.0 : 0.5);
    const target = hovered ? 1.2 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 6);
  });

  const geo = () => {
    switch (node.shape) {
      case "box":        return <boxGeometry args={[0.62, 0.62, 0.62]} />;
      case "cylinder":   return <cylinderGeometry args={[0.34, 0.34, 0.70, 16]} />;
      case "octahedron": return <octahedronGeometry args={[0.45]} />;
      default:           return <sphereGeometry args={[0.38, 20, 16]} />;
    }
  };

  return (
    <group position={[node.x, node.y, node.z]}>
      {/* Outer halo ring */}
      <mesh>
        <ringGeometry args={[0.52, 0.62, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.7 : 0.28}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main 3D Node Mesh */}
      <mesh ref={meshRef} onClick={onClick}>
        {geo()}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* High-legibility HUD Label (Alternating Y-offset on mobile prevents colliding labels) */}
      <Html
        center
        distanceFactor={isMobile ? 12 : 8.5}
        style={{ pointerEvents: "none", userSelect: "none" }}
      >
        <div
          style={{
            textAlign: "center",
            transform: isMobile
              ? (index % 2 === 0 ? "translateY(32px)" : "translateY(-40px)")
              : "translateY(38px)",
            width: "auto",
            maxWidth: isMobile ? "90px" : "130px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: isMobile ? "8px" : "11px",
              fontWeight: 600,
              letterSpacing: isMobile ? "0.06em" : "0.1em",
              textTransform: "uppercase",
              color: hovered ? "#FFFFFF" : (node.color === "#F3EEE6" ? "#F3EEE6" : color),
              background: "rgba(10, 9, 8, 0.92)",
              border: `1px solid ${hovered ? color : "rgba(196, 92, 38, 0.4)"}`,
              padding: isMobile ? "2px 5px" : "3px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
              boxShadow: hovered ? `0 0 12px ${color}` : "0 2px 8px rgba(0,0,0,0.5)",
              display: "inline-block",
            }}
          >
            {node.label}
          </span>
          {node.sublabel && (!isMobile || hovered) && (
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: isMobile ? "6.5px" : "8.5px",
                letterSpacing: "0.05em",
                color: "#8A847A",
                display: "block",
                marginTop: "2px",
                whiteSpace: "nowrap",
                textShadow: "0 1px 4px rgba(0,0,0,0.8)",
              }}
            >
              {node.sublabel}
            </span>
          )}
        </div>
      </Html>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Animated edge with glowing flowing particles               */
/* ─────────────────────────────────────────────────────────── */
function PipelineEdge({
  from,
  to,
  color = "#C45C26",
  particleSpeed = 0.7,
  particleCount = 6,
}: {
  from: PipelineNode;
  to: PipelineNode;
  color?: string;
  particleSpeed?: number;
  particleCount?: number;
}) {
  const curve = useMemo(() => {
    const mid = new THREE.Vector3(
      (from.x + to.x) / 2,
      (from.y + to.y) / 2 + 0.35,
      (from.z + to.z) / 2 + 0.45
    );
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(from.x, from.y, from.z),
      mid,
      new THREE.Vector3(to.x, to.y, to.z)
    );
  }, [from.x, from.y, from.z, to.x, to.y, to.z]);

  const points = useMemo(() => curve.getPoints(40), [curve]);

  const offsets = useMemo(
    () => Array.from({ length: particleCount }, (_, i) => i / particleCount),
    [particleCount]
  );
  const tRef   = useRef(0);
  const ptsRef = useRef<THREE.Points>(null);
  const posArr = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);

  useFrame((_, delta) => {
    tRef.current = (tRef.current + delta * particleSpeed) % 1;
    offsets.forEach((offset, i) => {
      const t = (tRef.current + offset) % 1;
      const pt = curve.getPoint(t);
      posArr[i * 3 + 0] = pt.x;
      posArr[i * 3 + 1] = pt.y;
      posArr[i * 3 + 2] = pt.z;
    });
    if (ptsRef.current) {
      const attr = ptsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      attr.set(posArr);
      attr.needsUpdate = true;
    }
  });

  return (
    <>
      {/* High-visibility Conduit Path */}
      <Line
        points={points}
        color={color}
        lineWidth={2.2}
        transparent
        opacity={0.55}
      />
      {/* Flowing Data Pulses */}
      <points ref={ptsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[posArr, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#FFAA55"
          size={0.15}
          sizeAttenuation
          transparent
          opacity={0.95}
        />
      </points>
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Scene root                                                  */
/* ─────────────────────────────────────────────────────────── */
function SceneContent({
  nodes,
  edges,
  particleSpeed = 0.65,
  particleCount = 6,
}: PipelineSceneProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouse    = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Responsive scale based on canvas viewport width
  // Total pipeline node span from x = -4.2 to +5.0 (approx 10.5 width with margins)
  const responsiveScale = Math.min(1, Math.max(0.48, viewport.width / 11.2));

  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 0.5;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.35;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = (e.touches[0].clientX / window.innerWidth  - 0.5) * 0.5;
        mouse.current.y = (e.touches[0].clientY / window.innerHeight - 0.5) * 0.35;
      }
    };
    window.addEventListener("mousemove", h, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", h);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (mouse.current.x * 0.35 - groupRef.current.rotation.y) * delta * 2.5;
    groupRef.current.rotation.x += (-mouse.current.y * 0.25 - groupRef.current.rotation.x) * delta * 2.5;
  });

  return (
    <group ref={groupRef} scale={[responsiveScale, responsiveScale, responsiveScale]}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 4, 4]} intensity={2.5} color="#FF7A30" />
      <pointLight position={[-5, 0, 3]} intensity={1.5} color="#F3EEE6" />
      <pointLight position={[5, 0, 3]} intensity={1.5} color="#FF9944" />

      {/* Edges */}
      {edges.map(([fromIdx, toIdx], i) => {
        const fromNode = nodes[fromIdx];
        const toNode   = nodes[toIdx];
        if (!fromNode || !toNode) return null;
        return (
          <PipelineEdge
            key={`edge-${i}`}
            from={fromNode}
            to={toNode}
            color={toNode.color ?? "#C45C26"}
            particleSpeed={particleSpeed}
            particleCount={particleCount}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <NodeMesh
          key={`node-${i}`}
          node={node}
          index={i}
          hovered={hoveredIdx === i}
          onClick={() => setHoveredIdx((prev) => (prev === i ? null : i))}
        />
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  Public Export                                               */
/* ─────────────────────────────────────────────────────────── */
export default function PipelineScene({
  nodes,
  edges,
  height = "400px",
  camZ = 6.8,
  particleSpeed = 0.65,
  particleCount = 6,
}: PipelineSceneProps) {
  const [dpr, setDpr] = useState(1.5);
  const containerRef  = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Adjust camera distance for mobile to show full scene
  const adjustedCamZ = isMobile ? camZ * 1.5 : camZ;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        position: "relative",
      }}
    >
      {visible && (
        <Canvas
          camera={{ position: [0, 0, adjustedCamZ], fov: isMobile ? 58 : 46 }}
          dpr={dpr}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <PerformanceMonitor onDecline={() => setDpr(1)} />
          <SceneContent
            nodes={nodes}
            edges={edges}
            particleSpeed={particleSpeed}
            particleCount={particleCount}
          />
        </Canvas>
      )}
    </div>
  );
}
