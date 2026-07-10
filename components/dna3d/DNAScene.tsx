"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BASE_HEX_COLORS, BASE_COMPLEMENT } from "@/constants";
import { useSimulationStore } from "@/store/simulation-store";
import type { DNABase, TapeSymbol } from "@/types";

// ─── Geometría B-DNA escalada para caber en vista ─────────────────────────────
const HELIX_RADIUS = 1.0;
const HELIX_PITCH  = 1.4;   // más compacto
const HELIX_TWIST  = (2 * Math.PI) / 10;
const SPHERE_R     = 0.20;
const BACKBONE_R   = 0.07;
const BRIDGE_R     = 0.05;

// ─── Colores ──────────────────────────────────────────────────────────────────
const DIM: Record<string, number> = {
  X: 0x166534, Y: 0x7f1d1d, P: 0x1e3a8a, Q: 0x713f12,
};

function bColor(sym: TapeSymbol): number {
  if (sym in BASE_HEX_COLORS) return BASE_HEX_COLORS[sym as DNABase];
  return DIM[sym as string] ?? 0x3f3f46;
}

// ─── Nucleótido ───────────────────────────────────────────────────────────────
function Nucleotide({
  position, symbol, isHead,
}: {
  position: [number, number, number];
  symbol: TapeSymbol;
  isHead: boolean;
}) {
  const ref  = useRef<THREE.Mesh>(null!);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    if (isHead) {
      tRef.current += delta * 3;
      ref.current.scale.setScalar(1 + Math.sin(tRef.current) * 0.15);
    } else {
      ref.current.scale.setScalar(1);
    }
  });

  const color    = bColor(symbol);
  const emissive = isHead ? color : 0x000000;

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[SPHERE_R, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={isHead ? 0.5 : 0}
        roughness={0.25}
        metalness={0.15}
      />
    </mesh>
  );
}

// ─── Cilindro entre dos puntos ────────────────────────────────────────────────
function Stick({
  from, to, radius, color, opacity = 1,
}: {
  from: THREE.Vector3; to: THREE.Vector3;
  radius: number; color: number; opacity?: number;
}) {
  const mid = from.clone().add(to).multiplyScalar(0.5);
  const dir = to.clone().sub(from);
  const len = dir.length();
  if (len < 0.001) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0), dir.normalize()
  );
  return (
    <mesh position={mid.toArray()} quaternion={q}>
      <cylinderGeometry args={[radius, radius, len, 6]} />
      <meshStandardMaterial
        color={color} roughness={0.6} metalness={0}
        transparent={opacity < 1} opacity={opacity}
      />
    </mesh>
  );
}

// ─── Anillo pulsante en la posición del cabezal ───────────────────────────────
function HeadRing({ position }: { position: [number, number, number] }) {
  const ref  = useRef<THREE.Mesh>(null!);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    tRef.current += delta * 2.5;
    const s = 1 + Math.sin(tRef.current) * 0.1;
    ref.current.scale.setScalar(s);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.4 + Math.sin(tRef.current * 1.4) * 0.25;
  });

  return (
    <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.5, 0.035, 8, 32]} />
      <meshBasicMaterial color={0xfbbf24} transparent opacity={0.65} />
    </mesh>
  );
}

// ─── Doble hélice completa ────────────────────────────────────────────────────
const DEFAULT_TAPE = "ATGCGATCGTAGCATCGGCTA".split("") as TapeSymbol[];

function DoubleHelix() {
  const { tape: storeTape, head, status } = useSimulationStore();
  const tape = storeTape.length > 0 ? storeTape : DEFAULT_TAPE;
  const groupRef = useRef<THREE.Group>(null!);
  const rotRef   = useRef(0);

  // Rotación continua lenta cuando no está corriendo
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (status !== "running") {
      rotRef.current += delta * 0.3;
      groupRef.current.rotation.y = rotRef.current;
    }
  });

  const totalH = (tape.length - 1) * HELIX_PITCH;
  const offsetY = -totalH / 2;

  const pairs = useMemo(() => tape.map((sym, i) => {
    const angle = i * HELIX_TWIST;
    const y     = i * HELIX_PITCH + offsetY;
    const x1 = Math.cos(angle)           * HELIX_RADIUS;
    const z1 = Math.sin(angle)           * HELIX_RADIUS;
    const x2 = Math.cos(angle + Math.PI) * HELIX_RADIUS;
    const z2 = Math.sin(angle + Math.PI) * HELIX_RADIUS;
    const comp = (sym in BASE_COMPLEMENT ? BASE_COMPLEMENT[sym as DNABase] : sym) as TapeSymbol;
    return { i, sym, comp, y, x1, z1, x2, z2 };
  }), [tape, offsetY]);

  if (tape.length === 0) return null;

  return (
    <group ref={groupRef}>
      {pairs.map(({ i, sym, comp, y, x1, z1, x2, z2 }) => {
        const active = i === head;
        const p1 = new THREE.Vector3(x1, y, z1);
        const p2 = new THREE.Vector3(x2, y, z2);

        return (
          <group key={i}>
            <Nucleotide position={[x1, y, z1]} symbol={sym}  isHead={active} />
            <Nucleotide position={[x2, y, z2]} symbol={comp} isHead={false}  />

            {/* Puente de hidrógeno */}
            <Stick from={p1} to={p2} radius={BRIDGE_R} color={0x4b5563} opacity={0.45} />

            {/* Esqueleto */}
            {i > 0 && (() => {
              const prev  = pairs[i - 1];
              const pp1   = new THREE.Vector3(prev.x1, prev.y, prev.z1);
              const pp2   = new THREE.Vector3(prev.x2, prev.y, prev.z2);
              return (
                <>
                  <Stick from={pp1} to={p1} radius={BACKBONE_R} color={0x52525b} />
                  <Stick from={pp2} to={p2} radius={BACKBONE_R} color={0x52525b} />
                </>
              );
            })()}

            {active && <HeadRing position={[x1, y, z1]} />}
          </group>
        );
      })}
    </group>
  );
}

// ─── Partículas de fondo ──────────────────────────────────────────────────────
function Particles() {
  const positions = useMemo(() => {
    const arr = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      arr[i*3]   = (Math.random() - 0.5) * 22;
      arr[i*3+1] = (Math.random() - 0.5) * 22;
      arr[i*3+2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.025; });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={0x22c55e} size={0.035} transparent opacity={0.3} />
    </points>
  );
}

// ─── Cámara que se ajusta al tamaño de la hélice ─────────────────────────────
function SmartCamera() {
  const { tape, head, status } = useSimulationStore();
  const { camera } = useThree();
  const targetZ = useRef(8);
  const targetY = useRef(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (tape.length === 0) return;

    // Distancia necesaria para ver toda la hélice verticalmente
    const totalH = (tape.length - 1) * HELIX_PITCH;
    const halfH  = totalH / 2 + 1.5;           // + margen
    const fovRad = (45 * Math.PI) / 180;
    const neededZ = halfH / Math.tan(fovRad / 2);
    targetZ.current = Math.max(5, Math.min(neededZ, 14));

    // Seguir el cabezal verticalmente durante ejecución
    if (status === "running") {
      const offsetY = -totalH / 2;
      targetY.current = head * HELIX_PITCH + offsetY;
    }

    if (!initialized.current) {
      camera.position.set(0, 0, targetZ.current);
      initialized.current = true;
    }
  }, [tape.length, head, status, camera]);

  useFrame((_, delta) => {
    const lerp = 1 - Math.pow(0.01, delta);
    camera.position.z += (targetZ.current - camera.position.z) * lerp;
    if (status === "running") {
      camera.position.y += (targetY.current - camera.position.y) * lerp;
    }
  });

  return null;
}

// ─── Escena exportada ─────────────────────────────────────────────────────────
export function DNAScene() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
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
        <directionalLight position={[4, 6, 4]}  intensity={1.0} />
        <pointLight      position={[-3, 2, 3]}  intensity={0.7} color={0x22c55e} />
        <pointLight      position={[3, -2, -3]} intensity={0.4} color={0x3b82f6} />

        <Particles />
        <DoubleHelix />
        <SmartCamera />
      </Canvas>
    </div>
  );
}
