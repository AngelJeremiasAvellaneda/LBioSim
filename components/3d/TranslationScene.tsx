"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useMolecularContext } from "@/contexts/MolecularContext";

const BASE_SPACING = 0.6;
const BASE_SIZE = 0.2;

const BASE_COLORS: Record<string, number> = {
  A: 0x22c55e,
  U: 0xef4444,
  C: 0x3b82f6,
  G: 0xeab308,
};

const AA_COLORS = [
  0x22c55e, 0xef4444, 0x3b82f6, 0xeab308, 0xf97316,
  0xec4899, 0x8b5cf6, 0x14b8a6, 0xf43f5e, 0x84cc16,
  0x06b6d4, 0xd946ef, 0x10b981, 0xf59e0b, 0x6366f1,
  0x64748b, 0x0ea5e9, 0xa855f7, 0x4f46e5, 0x78716c,
];

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

function TranslationContent({ rnaSequence: seq }: { rnaSequence?: string }) {
  const { reducedMotion } = useMolecularContext();
  const sequence = seq ?? "AUGGCUAAGUGGAA";
  const bases = sequence.split("");
  const groupRef = useRef<THREE.Group>(null!);
  const aaRefs = useRef<(THREE.Mesh | null)[]>([]);

  const basePositions = useMemo(
    () => bases.map((_, i) => (i - (bases.length - 1) / 2) * BASE_SPACING),
    [bases]
  );

  const numCodons = Math.floor(bases.length / 3);

  const aaPositions = useMemo(() => {
    return Array.from({ length: numCodons }, (_, i) => [
      basePositions[i * 3] + BASE_SPACING,
      0.8 + i * 0.35,
      0,
    ] as [number, number, number]);
  }, [basePositions, numCodons]);

  useEffect(() => {
    const tl = gsap.timeline();

    if (reducedMotion) { tl.pause(); return () => { tl.kill(); }; }

    for (let i = 0; i < numCodons; i++) {
      const targetX = basePositions[i * 3] ?? 0;

      tl.to(groupRef.current.position, {
        x: targetX,
        duration: 0.8,
        ease: "power2.inOut",
      }, i * 0.8);

      const mesh = aaRefs.current[i];
      if (mesh) {
        tl.to(mesh.material, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        }, i * 0.8 + 0.4);
      }
    }

    return () => { tl.kill(); };
  }, [basePositions, numCodons, reducedMotion]);

  if (bases.length === 0) return null;

  return (
    <group>
      {bases.map((base, i) => (
        <mesh key={`base-${i}`} position={[basePositions[i], 0, 0]}>
          <boxGeometry args={[BASE_SIZE, BASE_SIZE, BASE_SIZE]} />
          <meshStandardMaterial
            color={BASE_COLORS[base] ?? 0x64748b}
            roughness={0.5}
          />
        </mesh>
      ))}

      <group ref={groupRef}>
        <mesh position={[0, 0.4, 0]} scale={[1, 0.7, 1]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={0x6366f1} roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.3, 0]} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color={0x818cf8} roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {Array.from({ length: numCodons }, (_, i) => (
        <mesh
          key={`aa-${i}`}
          position={aaPositions[i]}
          ref={(el) => { aaRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial
            color={AA_COLORS[i % AA_COLORS.length]}
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

export function TranslationScene({ rnaSequence }: { rnaSequence?: string }) {
  const { reducedMotion } = useMolecularContext();
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 8], fov: 45 }}
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
        <TranslationContent rnaSequence={rnaSequence} />
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
