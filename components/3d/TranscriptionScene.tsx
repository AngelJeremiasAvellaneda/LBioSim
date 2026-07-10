"use client";

import { useRef, useMemo, useEffect, type DependencyList } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { BASE_HEX_COLORS, BASE_COMPLEMENT } from "@/constants";
import { useTranscriptionContext } from "@/contexts/TranscriptionContext";
import { useAnimationTimeline } from "@/components/animations/useAnimationTimeline";
import { useMolecularContext } from "@/contexts/MolecularContext";

const R = 1.0;
const PITCH = 1.3;
const TWIST = Math.PI / 5;
const SR = 0.2;
const BR = 0.07;
const HR = 0.05;

const ZINC = 0x3f3f46;
const EMERALD = 0x22c55e;
const BLUE = 0x3b82f6;
const RED = 0xef4444;
const ORANGE = 0xf97316;
const YELLOW = 0xeab308;

const RNA_COLORS: Record<string, number> = {
  A: 0x4ade80,
  U: 0xfb923c,
  C: 0x60a5fa,
  G: 0xfacc15,
};

function rnaColor(base: string): number {
  return RNA_COLORS[base] ?? ORANGE;
}

function Sphere({ p, c, o = 1, s = 1 }: { p: [number, number, number]; c: number; o?: number; s?: number }) {
  return (
    <mesh position={p} scale={s}>
      <sphereGeometry args={[SR, 12, 12]} />
      <meshStandardMaterial color={c} roughness={0.3} metalness={0.1} transparent={o < 1} opacity={o} />
    </mesh>
  );
}

function Cyl({ from, to, r, c, o = 1 }: { from: THREE.Vector3; to: THREE.Vector3; r: number; c: number; o?: number }) {
  const mid = from.clone().add(to).multiplyScalar(0.5);
  const dir = to.clone().sub(from);
  const len = dir.length();
  if (len < 0.001) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return (
    <mesh position={mid.toArray()} quaternion={q}>
      <cylinderGeometry args={[r, r, len, 6]} />
      <meshStandardMaterial color={c} roughness={0.6} metalness={0} transparent={o < 1} opacity={o} />
    </mesh>
  );
}

function BubbleRing({ p }: { p: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  const tRef = useRef(0);
  useFrame((_, d) => {
    if (!ref.current) return;
    tRef.current += d * 2;
    const s = 1 + Math.sin(tRef.current) * 0.08;
    ref.current.scale.setScalar(s);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.3 + Math.sin(tRef.current * 1.3) * 0.15;
  });
  return (
    <mesh ref={ref} position={p} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[R * 1.6, 0.03, 8, 32]} />
      <meshBasicMaterial color={EMERALD} transparent opacity={0.4} />
    </mesh>
  );
}

function RNAPolymerase({ p, angle }: { p: [number, number, number]; angle?: number }) {
  return (
    <group position={p} rotation={[0, angle ?? 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.4, 0.5, 8]} />
        <meshStandardMaterial color={EMERALD} emissive={EMERALD} emissiveIntensity={0.2} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.2, 0.2, 6]} />
        <meshStandardMaterial color={0x4ade80} roughness={0.3} />
      </mesh>
    </group>
  );
}

function TranscriptionContent({ templateDNA: propTemplateDNA }: { templateDNA?: string }) {
  const ctx = useTranscriptionContext();
  const templateDNA = ctx?.templateSequence || propTemplateDNA || "ATGGCCTAGCTA";
  const { reducedMotion } = useMolecularContext();
  const setCurrentNtIndex = ctx?.setCurrentNtIndex;
  const setMRNABuilt = ctx?.setMRNABuilt;

  const groupRef = useRef<THREE.Group>(null!);
  const rotRef = useRef(0);

  const animState = useRef({
    bubbleY: 0,
    polY: 0,
    polRotation: 0,
    mrnaProgress: 0,
    mrnaBaseOpacity: [] as number[],
    mrnaBasePositions: [] as [number, number, number][],
  }).current;

  const bases = useMemo(() => templateDNA.split(""), [templateDNA]);
  const len = bases.length;
  const totalH = (len - 1) * PITCH;
  const offsetY = -totalH / 2;

  const pairs = useMemo(() => bases.map((sym, i) => {
    const angle = i * TWIST;
    const y = i * PITCH + offsetY;
    const x1 = Math.cos(angle) * R;
    const z1 = Math.sin(angle) * R;
    const x2 = Math.cos(angle + Math.PI) * R;
    const z2 = Math.sin(angle + Math.PI) * R;
    const comp = BASE_COMPLEMENT[sym as keyof typeof BASE_COMPLEMENT] ?? sym;
    return { i, sym, comp, y, x1, z1, x2, z2 };
  }), [bases, offsetY]);

  useEffect(() => {
    animState.mrnaBaseOpacity = bases.map(() => 0);
    animState.mrnaBasePositions = bases.map((_, i) => {
      const angle = i * TWIST;
      const y = i * PITCH + offsetY;
      return [
        Math.cos(angle + Math.PI) * R * 2.5 + 0.5,
        y + 0.3,
        Math.sin(angle + Math.PI) * R * 2.5,
      ] as [number, number, number];
    });
  }, [templateDNA, bases, offsetY, animState.mrnaBaseOpacity, animState.mrnaBasePositions]);

  const deps: DependencyList = [templateDNA];

  useAnimationTimeline((tl) => {
    if (len === 0) return;

    animState.bubbleY = offsetY;
    animState.polY = offsetY;
    animState.polRotation = 0;
    animState.mrnaProgress = 0;
    for (let i = 0; i < len; i++) animState.mrnaBaseOpacity[i] = 0;

    const bubbleStart = offsetY + PITCH * Math.floor(len * 0.3);
    const bubbleEnd = offsetY + PITCH * Math.ceil(len * 0.7);
    const bubbleMid = (bubbleStart + bubbleEnd) / 2;
    const polStartY = bubbleStart;
    const polEndY = bubbleEnd;

    tl.set(animState, { bubbleY: bubbleMid, polY: polStartY });

    tl.to(animState, { bubbleY: bubbleMid, duration: 0.5 }, 0);

    const moveDuration = 3;
    tl.to(animState, { polY: polEndY, duration: moveDuration, ease: "power1.inOut" }, 0.5);
    tl.to(animState, { polRotation: Math.PI * 2, duration: moveDuration, ease: "none" }, 0.5);

    const ntStart = 0.7;
    const ntDuration = moveDuration - 0.2;
    for (let i = 0; i < len; i++) {
      const delay = ntStart + (i / len) * ntDuration;
      tl.to(animState.mrnaBaseOpacity, { [i]: 1, duration: 0.25, ease: "power2.out" }, delay);
      if (setCurrentNtIndex) {
        tl.call(() => setCurrentNtIndex(i), undefined, delay + 0.1);
      }
      if (setMRNABuilt) {
        const sym = bases[i];
        const rnaBase = sym === "T" ? "U" : sym;
        tl.call(() => setMRNABuilt(templateDNA.slice(0, i + 1).replace(/T/g, "U")), undefined, delay + 0.15);
      }
    }
  }, deps);

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return;
    rotRef.current += delta * 0.15;
    groupRef.current.rotation.y = rotRef.current;
  });

  if (len === 0) return null;

  const halfLen = Math.floor(len / 2);
  const bubbleCenterIdx = halfLen;

  return (
    <group ref={groupRef}>
      {pairs.map(({ i, sym, comp, y, x1, z1, x2, z2 }) => {
        const distFromPol = Math.abs(i - bubbleCenterIdx);
        const inBubble = distFromPol <= 1;
        const sep = inBubble ? 0.6 * (1 - distFromPol / 2) : 0;

        const angle = i * TWIST;
        const mrnaIdx = i;
        const mrnaOpacity = animState.mrnaBaseOpacity[mrnaIdx] ?? 0;
        const mrnaPos = animState.mrnaBasePositions[mrnaIdx] ?? [0, 0, 0];

        const templateSym = sym;
        const rnaSym = templateSym === "T" ? "U" : templateSym;
        const rnaColorVal = rnaColor(rnaSym);

        return (
          <group key={i}>
            <Sphere p={[x1 + sep, y, z1]} c={BASE_HEX_COLORS[sym as keyof typeof BASE_HEX_COLORS] ?? ZINC} />
            <Sphere p={[x2 - sep, y, z2]} c={BASE_HEX_COLORS[comp as keyof typeof BASE_HEX_COLORS] ?? ZINC} />
            {!inBubble && <Cyl from={new THREE.Vector3(x1 + sep, y, z1)} to={new THREE.Vector3(x2 - sep, y, z2)} r={HR} c={0x4b5563} o={0.45} />}
            {i > 0 && (() => {
              const prev = pairs[i - 1];
              const pSep = Math.abs(i - 1 - bubbleCenterIdx) <= 1 ? 0.6 * (1 - Math.abs(i - 1 - bubbleCenterIdx) / 2) : 0;
              return (
                <>
                  <Cyl from={new THREE.Vector3(prev.x1 + pSep, prev.y, prev.z1)} to={new THREE.Vector3(x1 + sep, y, z1)} r={BR} c={0x52525b} />
                  <Cyl from={new THREE.Vector3(prev.x2 - pSep, prev.y, prev.z2)} to={new THREE.Vector3(x2 - sep, y, z2)} r={BR} c={0x52525b} />
                </>
              );
            })()}

            <Sphere p={mrnaPos} c={rnaColorVal} o={mrnaOpacity} s={0.9} />
            {i > 0 && mrnaOpacity > 0.1 && (() => {
              const prevOpacity = animState.mrnaBaseOpacity[i - 1] ?? 0;
              if (prevOpacity <= 0.1) return null;
              const prevPos = animState.mrnaBasePositions[i - 1] ?? [0, 0, 0];
              return (
                <Cyl
                  from={new THREE.Vector3(...prevPos)}
                  to={new THREE.Vector3(...mrnaPos)}
                  r={HR * 0.8}
                  c={ORANGE}
                  o={Math.min(mrnaOpacity, prevOpacity)}
                />
              );
            })()}
          </group>
        );
      })}

      <BubbleRing p={[0, animState.bubbleY, 0]} />

      <RNAPolymerase p={[R * 0.3, animState.polY, 0]} angle={animState.polRotation} />

      <Text position={[0, totalH / 2 + 1.5, 0]} fontSize={0.28} color="#22c55e" anchorX="center" anchorY="middle">
        ARN Polimerasa
      </Text>
      <Text position={[R * 2.8, animState.bubbleY - 0.5, 0]} fontSize={0.22} color="#22c55e" anchorX="left" anchorY="middle">
        Burbuja de transcripción
      </Text>
      <Text position={[R * 3.5, offsetY - 1.2, 0]} fontSize={0.22} color="#fb923c" anchorX="left" anchorY="middle">
        ARN mensajero
      </Text>
      <Text position={[-R * 2.8, totalH / 2 + 0.5, 0]} fontSize={0.22} color="#3b82f6" anchorX="right" anchorY="middle">
        ADN molde
      </Text>
    </group>
  );
}

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
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.02; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={EMERALD} size={0.03} transparent opacity={0.25} />
    </points>
  );
}

export function TranscriptionScene({ templateDNA: propTemplateDNA }: { templateDNA?: string }) {
  const { reducedMotion } = useMolecularContext();
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} style={{ background: "transparent", width: '100%', height: '100%' }} camera={{ position: [0, 0, 8], fov: 45 }}>
        <OrbitControls enablePan={false} minDistance={3} maxDistance={20} enableDamping dampingFactor={0.1} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} />
        <pointLight position={[-3, 2, 3]} intensity={0.7} color={EMERALD} />
        <pointLight position={[3, -2, -3]} intensity={0.4} color={BLUE} />
        <Particles />
        <TranscriptionContent templateDNA={propTemplateDNA} />
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
