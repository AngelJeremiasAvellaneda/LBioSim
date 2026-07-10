"use client";

import { useRef, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface AminoAcidData {
  name: string;
  singleLetter: string;
  threeLetter: string;
  formula: string;
  weight: number;
  polarity: string;
  charge: string;
}

interface AminoAcidSceneProps {
  aminoAcid: AminoAcidData;
  showLabels?: boolean;
}

function Stick({ from, to, radius, color }: {
  from: THREE.Vector3; to: THREE.Vector3;
  radius: number; color: number;
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
      <meshStandardMaterial color={color} roughness={0.6} metalness={0} />
    </mesh>
  );
}

function Sphere({ position, radius, color, emissive = false }: {
  position: [number, number, number];
  radius: number; color: number; emissive?: boolean;
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.1}
        emissive={emissive ? color : 0x000000}
        emissiveIntensity={emissive ? 0.3 : 0}
      />
    </mesh>
  );
}

function RingStructure({ color, hydroxyl = false, indole = false }: {
  color: number; hydroxyl?: boolean; indole?: boolean;
}) {
  const ringR = 0.2;
  const n = indole ? 5 : 6;
  const positions = useMemo(() => Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * 2 * Math.PI;
    return [-0.7 + Math.cos(angle) * ringR, 0, Math.sin(angle) * ringR] as [number, number, number];
  }), []);

  return (
    <group>
      <Sphere position={[-0.3, 0, 0]} radius={0.12} color={color} />
      <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
      {positions.map((pos, i) => (
        <group key={i}>
          <Sphere position={pos} radius={0.08} color={color} />
          <Stick
            from={new THREE.Vector3(...positions[i])}
            to={new THREE.Vector3(...positions[(i + 1) % n])}
            radius={0.025}
            color={0x71717a}
          />
        </group>
      ))}
      {hydroxyl && <Sphere position={[-0.7, 0.3, 0]} radius={0.08} color={0xef4444} />}
      {indole && (
        <>
          <Sphere position={[-1.0, 0, 0]} radius={0.08} color={color} />
          <Sphere position={[-1.2, 0, 0]} radius={0.08} color={color} />
        </>
      )}
    </group>
  );
}

function ProlineRing() {
  return (
    <group>
      <Sphere position={[0, 0, 0]} radius={0.18} color={0x9ca3af} />
      <Sphere position={[-0.25, 0.2, 0.2]} radius={0.1} color={0x22c55e} />
      <Sphere position={[-0.45, 0.1, 0.35]} radius={0.1} color={0x22c55e} />
      <Sphere position={[-0.5, -0.1, 0.2]} radius={0.1} color={0x22c55e} />
      <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.25, 0.2, 0.2)} radius={0.04} color={0x71717a} />
      <Stick from={new THREE.Vector3(-0.25, 0.2, 0.2)} to={new THREE.Vector3(-0.45, 0.1, 0.35)} radius={0.03} color={0x71717a} />
      <Stick from={new THREE.Vector3(-0.45, 0.1, 0.35)} to={new THREE.Vector3(-0.5, -0.1, 0.2)} radius={0.03} color={0x71717a} />
    </group>
  );
}

function RGroup({ threeLetter, polarity }: { threeLetter: string; polarity: string }) {
  const chainColor = polarity === "nonpolar" ? 0x22c55e : polarity === "polar" ? 0x3b82f6 : 0xef4444;

  switch (threeLetter) {
    case "Gly":
      return <Sphere position={[-0.5, 0, 0]} radius={0.08} color={0xd1d5db} />;

    case "Ala":
      return (
        <group>
          <Sphere position={[-0.5, 0, 0]} radius={0.12} color={chainColor} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.5, 0, 0)} radius={0.04} color={0x71717a} />
        </group>
      );

    case "Val":
      return (
        <group>
          <Sphere position={[-0.5, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.8, 0.3, 0]} radius={0.1} color={chainColor} />
          <Sphere position={[-0.8, -0.3, 0]} radius={0.1} color={chainColor} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.5, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.5, 0, 0)} to={new THREE.Vector3(-0.8, 0.3, 0)} radius={0.03} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.5, 0, 0)} to={new THREE.Vector3(-0.8, -0.3, 0)} radius={0.03} color={0x71717a} />
        </group>
      );

    case "Leu":
      return (
        <group>
          <Sphere position={[-0.3, 0.1, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.6, 0.2, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.9, 0.45, 0]} radius={0.1} color={chainColor} />
          <Sphere position={[-0.9, -0.05, 0]} radius={0.1} color={chainColor} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0.1, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0.1, 0)} to={new THREE.Vector3(-0.6, 0.2, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.6, 0.2, 0)} to={new THREE.Vector3(-0.9, 0.45, 0)} radius={0.03} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.6, 0.2, 0)} to={new THREE.Vector3(-0.9, -0.05, 0)} radius={0.03} color={0x71717a} />
        </group>
      );

    case "Ile":
      return (
        <group>
          <Sphere position={[-0.5, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.8, 0.3, 0]} radius={0.1} color={chainColor} />
          <Sphere position={[-0.8, -0.3, 0.2]} radius={0.12} color={chainColor} />
          <Sphere position={[-1.1, -0.3, 0.4]} radius={0.1} color={chainColor} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.5, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.5, 0, 0)} to={new THREE.Vector3(-0.8, 0.3, 0)} radius={0.03} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.5, 0, 0)} to={new THREE.Vector3(-0.8, -0.3, 0.2)} radius={0.03} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.8, -0.3, 0.2)} to={new THREE.Vector3(-1.1, -0.3, 0.4)} radius={0.03} color={0x71717a} />
        </group>
      );

    case "Phe":
      return <RingStructure color={chainColor} />;

    case "Tyr":
      return <RingStructure color={chainColor} hydroxyl />;

    case "Trp":
      return <RingStructure color={chainColor} indole />;

    case "Pro":
      return <ProlineRing />;

    case "Lys":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.6, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.9, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-1.2, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-1.5, 0, 0]} radius={0.14} color={0x2563eb} emissive />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.6, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.6, 0, 0)} to={new THREE.Vector3(-0.9, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.9, 0, 0)} to={new THREE.Vector3(-1.2, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-1.2, 0, 0)} to={new THREE.Vector3(-1.5, 0, 0)} radius={0.04} color={0x71717a} />
        </group>
      );

    case "Arg":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.6, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.9, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-1.2, 0.15, 0]} radius={0.14} color={0x2563eb} emissive />
          <Sphere position={[-1.2, -0.15, 0.2]} radius={0.1} color={0x2563eb} />
          <Sphere position={[-1.2, -0.15, -0.2]} radius={0.1} color={0x2563eb} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.6, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.6, 0, 0)} to={new THREE.Vector3(-0.9, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.9, 0, 0)} to={new THREE.Vector3(-1.2, 0.15, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-1.2, 0.15, 0)} to={new THREE.Vector3(-1.2, -0.15, 0.2)} radius={0.03} color={0x71717a} />
          <Stick from={new THREE.Vector3(-1.2, 0.15, 0)} to={new THREE.Vector3(-1.2, -0.15, -0.2)} radius={0.03} color={0x71717a} />
        </group>
      );

    case "Asp":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.6, 0, 0]} radius={0.14} color={0xef4444} emissive />
          <Sphere position={[-0.7, 0.2, 0]} radius={0.08} color={0xef4444} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.6, 0, 0)} radius={0.04} color={0x71717a} />
        </group>
      );

    case "Glu":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.6, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.9, 0, 0]} radius={0.14} color={0xef4444} emissive />
          <Sphere position={[-1.0, 0.2, 0]} radius={0.08} color={0xef4444} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.6, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.6, 0, 0)} to={new THREE.Vector3(-0.9, 0, 0)} radius={0.04} color={0x71717a} />
        </group>
      );

    case "Ser":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.55, 0.2, 0]} radius={0.1} color={0x3b82f6} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.55, 0.2, 0)} radius={0.03} color={0x71717a} />
        </group>
      );

    case "Thr":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.6, 0.15, 0]} radius={0.1} color={0x3b82f6} />
          <Sphere position={[-0.6, -0.15, 0]} radius={0.1} color={chainColor} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.6, 0.15, 0)} radius={0.03} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.6, -0.15, 0)} radius={0.03} color={0x71717a} />
        </group>
      );

    case "Cys":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.55, 0, 0]} radius={0.12} color={0xeab308} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.55, 0, 0)} radius={0.03} color={0x71717a} />
        </group>
      );

    case "Met":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.6, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.9, 0, 0]} radius={0.12} color={0xeab308} />
          <Sphere position={[-1.2, 0, 0]} radius={0.1} color={chainColor} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.6, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.6, 0, 0)} to={new THREE.Vector3(-0.9, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.9, 0, 0)} to={new THREE.Vector3(-1.2, 0, 0)} radius={0.03} color={0x71717a} />
        </group>
      );

    case "Asn":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.6, 0, 0]} radius={0.14} color={0x3b82f6} />
          <Sphere position={[-0.8, 0.2, 0]} radius={0.08} color={0x3b82f6} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.6, 0, 0)} radius={0.04} color={0x71717a} />
        </group>
      );

    case "Gln":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.6, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.9, 0, 0]} radius={0.14} color={0x3b82f6} />
          <Sphere position={[-1.1, 0.2, 0]} radius={0.08} color={0x3b82f6} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.6, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.6, 0, 0)} to={new THREE.Vector3(-0.9, 0, 0)} radius={0.04} color={0x71717a} />
        </group>
      );

    case "His":
      return (
        <group>
          <Sphere position={[-0.3, 0, 0]} radius={0.12} color={chainColor} />
          <Sphere position={[-0.5, 0.25, 0]} radius={0.1} color={chainColor} />
          <Sphere position={[-0.5, -0.25, 0]} radius={0.1} color={0x3b82f6} />
          <Sphere position={[-0.7, 0.25, 0]} radius={0.1} color={chainColor} />
          <Sphere position={[-0.7, -0.25, 0]} radius={0.1} color={chainColor} />
          <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.3, 0, 0)} radius={0.04} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.5, 0.25, 0)} radius={0.03} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.3, 0, 0)} to={new THREE.Vector3(-0.5, -0.25, 0)} radius={0.03} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.5, 0.25, 0)} to={new THREE.Vector3(-0.7, 0.25, 0)} radius={0.03} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.5, -0.25, 0)} to={new THREE.Vector3(-0.7, -0.25, 0)} radius={0.03} color={0x71717a} />
          <Stick from={new THREE.Vector3(-0.7, 0.25, 0)} to={new THREE.Vector3(-0.7, -0.25, 0)} radius={0.03} color={0x71717a} />
        </group>
      );

    default:
      return <Sphere position={[-0.5, 0, 0]} radius={0.12} color={chainColor} />;
  }
}

function AminoAcid3D({ aminoAcid }: { aminoAcid: AminoAcidData }) {
  const cAlpha: [number, number, number] = [0, 0, 0];
  const amino: [number, number, number] = [0.5, 0.5, 0];
  const carboxyl: [number, number, number] = [0.5, -0.5, 0];
  const h: [number, number, number] = [-0.5, -0.3, 0.5];

  return (
    <group>
      <Sphere position={cAlpha} radius={0.2} color={0x9ca3af} />
      <Sphere position={amino} radius={0.16} color={0x3b82f6} />
      <Sphere position={carboxyl} radius={0.16} color={0xef4444} />
      <Sphere position={h} radius={0.1} color={0xd1d5db} />
      <Stick from={new THREE.Vector3(...cAlpha)} to={new THREE.Vector3(...amino)} radius={0.045} color={0x71717a} />
      <Stick from={new THREE.Vector3(...cAlpha)} to={new THREE.Vector3(...carboxyl)} radius={0.045} color={0x71717a} />
      <Stick from={new THREE.Vector3(...cAlpha)} to={new THREE.Vector3(...h)} radius={0.035} color={0x71717a} />

      <group position={[-0.5, 0.3, 0]}>
        <RGroup threeLetter={aminoAcid.threeLetter} polarity={aminoAcid.polarity} />
      </group>
    </group>
  );
}

export function AminoAcidScene({ aminoAcid, showLabels = true }: AminoAcidSceneProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#f8f7f4', borderRadius: '0.75rem', overflow: 'hidden' }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent", width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 5], fov: 45 }}
      >
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={2}
          maxDistance={12}
          enableDamping
          dampingFactor={0.1}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]} intensity={1.0} />
        <pointLight position={[-3, 2, 3]} intensity={0.7} color={0x22c55e} />
        <pointLight position={[3, -2, -3]} intensity={0.4} color={0x3b82f6} />
        <AminoAcid3D aminoAcid={aminoAcid} />
      </Canvas>

      {showLabels && (
        <div className="absolute top-3 left-3 z-10 px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg space-y-1 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-semibold">{aminoAcid.name}</span>
            <span className="text-stone-300">|</span>
            <span className="text-blue-500">{aminoAcid.threeLetter}</span>
            <span className="text-stone-300">|</span>
            <span className="text-amber-500">{aminoAcid.singleLetter}</span>
          </div>
          <div className="text-stone-500">{aminoAcid.formula}</div>
          <div className="flex gap-3 pt-1">
            <span className="text-stone-400">PM: {aminoAcid.weight} Da</span>
            <span className="text-stone-400">{aminoAcid.polarity}</span>
            <span className="text-stone-400">{aminoAcid.charge}</span>
          </div>
        </div>
      )}
    </div>
  );
}
