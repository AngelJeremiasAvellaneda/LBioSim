"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useMolecularContext } from "@/contexts/MolecularContext";

const AA_COLORS: Record<string, number> = {
  A: 0x22c55e, C: 0x3b82f6, D: 0xef4444, E: 0xec4899,
  F: 0xeab308, G: 0x84cc16, H: 0x8b5cf6, I: 0x14b8a6,
  K: 0xf97316, L: 0x06b6d4, M: 0x6366f1, N: 0x10b981,
  P: 0xd946ef, Q: 0x0ea5e9, R: 0xa855f7, S: 0x64748b,
  T: 0xf43f5e, V: 0x4f46e5, W: 0x78716c, Y: 0xdc2626,
};

const SPHERE_RADIUS = 0.22;

function Particles() {
  const positions = useMemo(() => {
    const arr = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null!);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={0x22c55e} size={0.03} transparent opacity={0.2} />
    </points>
  );
}

function FoldingContent({ aminoAcids: _aminoAcids }: { aminoAcids?: string }) {
  const { reducedMotion } = useMolecularContext();
  const sequence = _aminoAcids ?? "ACDEFGHIKLMNPQRSTVWY";
  const aaList = sequence.split("");
  const count = aaList.length;
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);

  const linearPositions = useMemo(() => {
    return aaList.map((_, i) => [
      (i - (count - 1) / 2) * 0.65,
      0,
      0,
    ] as [number, number, number]);
  }, [aaList, count]);

  const helixPositions = useMemo(() => {
    return aaList.map((_, i) => {
      const t = i / count;
      const angle = t * Math.PI * 6;
      const r = 1.0;
      return [
        Math.cos(angle) * r,
        (t - 0.5) * 3.5,
        Math.sin(angle) * r,
      ] as [number, number, number];
    });
  }, [aaList, count]);

  const compactPositions = useMemo(() => {
    const points: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const phi = Math.acos(2 * t - 1);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.9;
      points.push([
        Math.sin(phi) * Math.cos(theta) * r,
        Math.sin(phi) * Math.sin(theta) * r,
        Math.cos(phi) * r,
      ]);
    }
    return points;
  }, [aaList, count]);

  useEffect(() => {
    if (reducedMotion) {
      const meshes = meshesRef.current;
      for (let i = 0; i < count; i++) {
        const m = meshes[i];
        if (!m) continue;
        m.position.set(linearPositions[i][0], linearPositions[i][1], linearPositions[i][2]);
        (m.material as THREE.MeshStandardMaterial).opacity = 1;
      }
      return;
    }

    const tl = gsap.timeline();
    const meshes = meshesRef.current;

    for (let i = 0; i < count; i++) {
      const m = meshes[i];
      if (!m) continue;
      const mat = m.material as THREE.MeshStandardMaterial;
      const delay = i * (1 / count);

      tl.set(m.position, {
        x: linearPositions[i][0],
        y: linearPositions[i][1],
        z: linearPositions[i][2],
      }, 0);
      tl.set(mat, { opacity: 0 }, 0);
      tl.to(mat, { opacity: 1, duration: 0.2, ease: "power2.out" }, delay);
    }

    for (let i = 0; i < count; i++) {
      const m = meshes[i];
      if (!m) continue;
      tl.to(m.position, {
        x: helixPositions[i][0],
        y: helixPositions[i][1],
        z: helixPositions[i][2],
        duration: 2,
        ease: "power2.inOut",
      }, 1);
    }

    for (let i = 0; i < count; i++) {
      const m = meshes[i];
      if (!m) continue;
      tl.to(m.position, {
        x: compactPositions[i][0],
        y: compactPositions[i][1],
        z: compactPositions[i][2],
        duration: 2,
        ease: "power2.inOut",
      }, 3);
    }

    return () => { tl.kill(); };
  }, [count, linearPositions, helixPositions, compactPositions, reducedMotion]);

  if (count === 0) return null;

  return (
    <group>
      {aaList.map((aa, i) => (
        <mesh
          key={`aa-${i}`}
          ref={(el) => { meshesRef.current[i] = el; }}
        >
          <sphereGeometry args={[SPHERE_RADIUS, 16, 16]} />
          <meshStandardMaterial
            color={AA_COLORS[aa] ?? 0x64748b}
            transparent
            opacity={0}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export function FoldingScene({ aminoAcids: _aminoAcids }: { aminoAcids?: string }) {
  const { reducedMotion } = useMolecularContext();
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={20}
          enableDamping
          dampingFactor={0.1}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} />
        <pointLight position={[-3, 2, 3]} intensity={0.7} color={0x22c55e} />
        <pointLight position={[3, -2, -3]} intensity={0.4} color={0x3b82f6} />
        <Particles />
        <FoldingContent aminoAcids={_aminoAcids} />
      </Canvas>
      {reducedMotion && (
        <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
          <span className="px-3 py-1.5 bg-white/90 border border-stone-200 rounded-lg text-xs text-stone-500 backdrop-blur-sm shadow-sm">
            Modo estático — usa los controles paso a paso
          </span>
        </div>
      )}
    </div>
  );
}
