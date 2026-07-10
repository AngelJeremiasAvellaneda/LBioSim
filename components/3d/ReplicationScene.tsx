"use client";

import { useRef, useMemo, useEffect, type DependencyList } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { BASE_HEX_COLORS, BASE_COMPLEMENT } from "@/constants";
import { useReplicationContext } from "@/contexts/ReplicationContext";
import { useAnimationTimeline } from "@/components/animations/useAnimationTimeline";
import { useMolecularContext } from "@/contexts/MolecularContext";

const R = 1.0;
const PITCH = 1.2;
const TWIST = Math.PI / 5;
const SR = 0.18;
const BR = 0.06;
const HR = 0.04;
const SEP = 0.9;

const ZINC = 0x3f3f46;
const EMERALD = 0x22c55e;
const BLUE = 0x3b82f6;
const RED = 0xef4444;

function Sphere({ p, c, o = 1 }: { p: [number, number, number]; c: number; o?: number }) {
  return (
    <mesh position={p}>
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

function HelicaseModel({ p }: { p: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.z += d * 2;
  });
  return (
    <group ref={ref} position={p}>
      <mesh>
        <torusGeometry args={[0.4, 0.08, 8, 16]} />
        <meshStandardMaterial color={EMERALD} emissive={EMERALD} emissiveIntensity={0.3} roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.15, 0.25, 6]} />
        <meshStandardMaterial color={EMERALD} roughness={0.4} />
      </mesh>
    </group>
  );
}

function PolymeraseModel({ p, color }: { p: [number, number, number]; color: number }) {
  return (
    <group position={p}>
      <mesh>
        <boxGeometry args={[0.35, 0.25, 0.25]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0.3, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function ReplicationContent() {
  const ctx = useReplicationContext();
  const seq = ctx?.templateSequence || "ATGCGATCGTAGC";
  const status = ctx?.playbackState?.status ?? "idle";
  const speed = ctx?.speed ?? 1;
  const { reducedMotion } = useMolecularContext();
  const setCurrentStep = ctx?.setCurrentStep;

  const groupRef = useRef<THREE.Group>(null!);
  const rotRef = useRef(0);

  const animState = useRef({
    separation: 0,
    forkY: 0,
    helicaseZ: R + 0.5,
    poly1Y: 0,
    poly1Z: 0,
    poly2Y: 0,
    poly2Z: 0,
    newBases: [] as number[],
  }).current;

  useEffect(() => {
    animState.newBases = seq.split("").map(() => 0);
  }, [seq, animState.newBases]);

  const deps: DependencyList = [seq];

  const ctrl = useAnimationTimeline((tl) => {
    const len = seq.length;
    if (len === 0) return;
    const totalH = (len - 1) * PITCH;
    const halfH = totalH / 2;
    const forkEndY = halfH;

    animState.separation = 0;
    animState.forkY = -halfH;
    animState.helicaseZ = R + 0.5;
    animState.poly1Y = 0;
    animState.poly1Z = 0;
    animState.poly2Y = 0;
    animState.poly2Z = 0;
    for (let i = 0; i < len; i++) animState.newBases[i] = 0;

    const t0 = 0;
    const t1 = 2;
    const t2 = 3;
    const t3 = 3.5;
    const t4 = 6;
    const tEnd = 7;

    tl.to(animState, { forkY: forkEndY, duration: t1 - t0, ease: "power1.inOut" }, t0);
    tl.to(animState, { separation: 1, duration: t1 - t0, ease: "power2.inOut" }, t0);
    tl.to(animState, { helicaseZ: -R - 0.5, duration: t1 - t0, ease: "power1.inOut" }, t0);

    const polyTargetY = halfH - PITCH;
    tl.to(animState, { poly1Y: polyTargetY, poly1Z: R + 0.4, duration: 1, ease: "back.out(1.5)" }, t2);
    tl.to(animState, { poly2Y: polyTargetY, poly2Z: -R - 0.4, duration: 1, ease: "back.out(1.5)" }, t2 + 0.3);

    for (let i = 0; i < len; i++) {
      const delay = t3 + (i / len) * (t4 - t3);
      tl.to(animState.newBases, { [i]: 1, duration: 0.3, ease: "power2.out" }, delay);
    }

    if (setCurrentStep) {
      tl.call(() => setCurrentStep(1), undefined, t0 + 0.1);
      tl.call(() => setCurrentStep(2), undefined, t1 + 0.1);
      tl.call(() => setCurrentStep(3), undefined, t2 + 0.1);
      tl.call(() => setCurrentStep(4), undefined, t4 + 0.1);
    }
  }, deps);

  useEffect(() => {
    ctrl.setSpeed(speed);
  }, [speed, ctrl.setSpeed]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (status !== "playing" && !reducedMotion) {
      rotRef.current += delta * 0.2;
      groupRef.current.rotation.y = rotRef.current;
    }
  });

  if (!seq) return null;

  const bases = seq.split("");
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

  return (
    <group ref={groupRef}>
      {pairs.map(({ i, sym, comp, y, x1, z1, x2, z2 }) => {
        const sep = y >= animState.forkY ? 0 : animState.separation * SEP * (1 - (animState.forkY - y) / (animState.forkY - offsetY + 0.1));
        const p1 = new THREE.Vector3(x1 + sep, y, z1);
        const p2 = new THREE.Vector3(x2 - sep, y, z2);
        const nbOpacity = animState.newBases[i] ?? 0;
        const nbColor = BASE_HEX_COLORS[comp as keyof typeof BASE_HEX_COLORS] ?? ZINC;
        return (
          <group key={i}>
            <Sphere p={[x1 + sep, y, z1]} c={BASE_HEX_COLORS[sym as keyof typeof BASE_HEX_COLORS] ?? ZINC} />
            <Sphere p={[x2 - sep, y, z2]} c={BASE_HEX_COLORS[comp as keyof typeof BASE_HEX_COLORS] ?? ZINC} />
            {sep < SEP * 0.8 && <Cyl from={p1} to={p2} r={HR} c={0x4b5563} o={0.45} />}
            {i > 0 && (() => {
              const prev = pairs[i - 1];
              const ps = y >= animState.forkY ? 0 : animState.separation * SEP * (1 - (animState.forkY - y) / (animState.forkY - offsetY + 0.1));
              const pps = prev.y >= animState.forkY ? 0 : animState.separation * SEP * (1 - (animState.forkY - prev.y) / (animState.forkY - offsetY + 0.1));
              const pp1 = new THREE.Vector3(prev.x1 + pps, prev.y, prev.z1);
              const pp2 = new THREE.Vector3(prev.x2 - pps, prev.y, prev.z2);
              const cp1 = new THREE.Vector3(x1 + ps, y, z1);
              const cp2 = new THREE.Vector3(x2 - ps, y, z2);
              return (
                <>
                  <Cyl from={pp1} to={cp1} r={BR} c={0x52525b} />
                  <Cyl from={pp2} to={cp2} r={BR} c={0x52525b} />
                </>
              );
            })()}
            <Sphere p={[x1 + sep + R * 1.8, y, z1]} c={nbColor} o={nbOpacity} />
            <Sphere p={[x2 - sep - R * 1.8, y, z2]} c={nbColor} o={nbOpacity * 0.7} />
          </group>
        );
      })}

      <HelicaseModel p={[0, animState.forkY, animState.helicaseZ]} />

      <PolymeraseModel p={[R + 1.2, animState.poly1Y, 0]} color={BLUE} />
      <PolymeraseModel p={[-R - 1.2, animState.poly2Y, 0]} color={RED} />

      <Text position={[0, totalH / 2 + 1.2, 0]} fontSize={0.3} color="#22c55e" anchorX="center" anchorY="middle">
        Helicasa
      </Text>
      <Text position={[R + 2.2, totalH / 2, 0]} fontSize={0.25} color="#3b82f6" anchorX="left" anchorY="middle">
        ADN Polimerasa
      </Text>
      <Text position={[R + 2.2, -totalH / 2 - 0.8, R + 0.5]} fontSize={0.22} color="#22c55e" anchorX="left" anchorY="middle">
        Hebra líder
      </Text>
      <Text position={[-R - 2.2, -totalH / 2 - 0.8, -R - 0.5]} fontSize={0.22} color="#ef4444" anchorX="right" anchorY="middle">
        Hebra rezagada
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

export function ReplicationScene() {
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
        <ReplicationContent />
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
