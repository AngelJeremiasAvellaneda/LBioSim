"use client";

import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface MoleculeViewerProps {
  moleculeType: "dna" | "rna" | "protein" | "atp" | "nucleotide" | "amino-acid" | "glucose" | "lipid" | "water";
  scale?: number;
  showLabels?: boolean;
}

const LABELS_MAP: Record<string, string[]> = {
  dna: ["Adenina", "Timina", "Citosina", "Guanina", "Esqueleto fosfato"],
  rna: ["Adenina", "Uracilo", "Citosina", "Guanina", "Esqueleto fosfato"],
  protein: ["Amino\u00e1cidos", "Enlaces pept\u00eddicos"],
  atp: ["Adenina", "Ribosa", "Fosfato \u03b1", "Fosfato \u03b2", "Fosfato \u03b3"],
  nucleotide: ["Base nitrogenada", "Az\u00facar", "Grupo fosfato"],
  "amino-acid": ["Carbono \u03b1", "Grupo amino", "Grupo carboxilo", "Cadena lateral R"],
  glucose: ["Carbono", "Ox\u00edgeno", "Grupo hidroxilo"],
  lipid: ["Glicerol", "\u00c1cido graso", "\u00c1cido graso", "\u00c1cido graso"],
  water: ["Ox\u00edgeno", "Hidr\u00f3geno", "Hidr\u00f3geno"],
};

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
        emissive={emissive ? color : 0xfff}
        emissiveIntensity={emissive ? 0.3 : 0}
      />
    </mesh>
  );
}

function DNARepresentation() {
  const helixRadius = 0.8;
  const helixPitch = 0.6;
  const twist = (2 * Math.PI) / 10;
  const sphereR = 0.15;
  const backboneR = 0.05;
  const bridgeR = 0.03;
  const baseColors = [0x22c55e, 0xef4444, 0x3b82f6, 0xeab308];
  const n = 20;

  const pairs = useMemo(() => Array.from({ length: n }, (_, i) => {
    const angle = i * twist;
    const y = i * helixPitch - (n - 1) * helixPitch / 2;
    const x1 = Math.cos(angle) * helixRadius;
    const z1 = Math.sin(angle) * helixRadius;
    const x2 = Math.cos(angle + Math.PI) * helixRadius;
    const z2 = Math.sin(angle + Math.PI) * helixRadius;
    return { y, x1, z1, x2, z2, color: baseColors[i % 4] };
  }), []);

  return (
    <group>
      {pairs.map(({ y, x1, z1, x2, z2, color }, i) => {
        const p1 = new THREE.Vector3(x1, y, z1);
        const p2 = new THREE.Vector3(x2, y, z2);
        return (
          <group key={i}>
            <Sphere position={[x1, y, z1]} radius={sphereR} color={color} />
            <Sphere position={[x2, y, z2]} radius={sphereR} color={color} />
            <Stick from={p1} to={p2} radius={bridgeR} color={0x4b5563} />
            {i > 0 && (
              <>
                <Stick
                  from={new THREE.Vector3(pairs[i - 1].x1, pairs[i - 1].y, pairs[i - 1].z1)}
                  to={p1}
                  radius={backboneR}
                  color={0x52525b}
                />
                <Stick
                  from={new THREE.Vector3(pairs[i - 1].x2, pairs[i - 1].y, pairs[i - 1].z2)}
                  to={p2}
                  radius={backboneR}
                  color={0x52525b}
                />
              </>
            )}
          </group>
        );
      })}
    </group>
  );
}

function RNARepresentation() {
  const helixRadius = 0.7;
  const helixPitch = 0.6;
  const twist = (2 * Math.PI) / 10;
  const sphereR = 0.15;
  const backboneR = 0.05;
  const colors = [0x22c55e, 0xf59e0b, 0x3b82f6, 0xef4444];
  const n = 15;

  const bases = useMemo(() => Array.from({ length: n }, (_, i) => {
    const angle = i * twist;
    const y = i * helixPitch - (n - 1) * helixPitch / 2;
    return {
      y, x: Math.cos(angle) * helixRadius, z: Math.sin(angle) * helixRadius,
      color: colors[i % 4],
    };
  }), []);

  return (
    <group>
      {bases.map(({ y, x, z, color }, i) => (
        <group key={i}>
          <Sphere position={[x, y, z]} radius={sphereR} color={color} />
          {i > 0 && (
            <Stick
              from={new THREE.Vector3(bases[i - 1].x, bases[i - 1].y, bases[i - 1].z)}
              to={new THREE.Vector3(x, y, z)}
              radius={backboneR}
              color={0x52525b}
            />
          )}
        </group>
      ))}
    </group>
  );
}

function ProteinRepresentation() {
  const n = 30;
  const sphereR = 0.12;
  const bondR = 0.03;

  const positions = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const angle = t * 6 * Math.PI;
      const radius = 0.6 + Math.sin(t * 8) * 0.3;
      pts.push([Math.cos(angle) * radius, t * 2 - 1, Math.sin(angle) * radius * 0.6]);
    }
    return pts;
  }, []);

  const colors = useMemo(() => {
    const pal = [0x22c55e, 0x3b82f6, 0xf59e0b, 0xef4444, 0xa855f7, 0xec4899];
    return positions.map((_, i) => pal[i % pal.length]);
  }, [positions]);

  return (
    <group>
      {positions.map((pos, i) => (
        <group key={i}>
          <Sphere position={pos} radius={sphereR} color={colors[i]} emissive />
          {i > 0 && (
            <Stick
              from={new THREE.Vector3(...positions[i - 1])}
              to={new THREE.Vector3(...pos)}
              radius={bondR}
              color={0x71717a}
            />
          )}
        </group>
      ))}
    </group>
  );
}

function ATPRepresentation() {
  return (
    <group>
      <Sphere position={[0, 0.8, 0]} radius={0.25} color={0x22c55e} emissive />
      <Sphere position={[0.5, 0.4, 0]} radius={0.2} color={0xf59e0b} />
      <Sphere position={[0.9, 0, 0]} radius={0.18} color={0xef4444} emissive />
      <Sphere position={[1.3, -0.4, 0]} radius={0.18} color={0xef4444} emissive />
      <Sphere position={[1.7, -0.8, 0]} radius={0.18} color={0xef4444} emissive />
      <Stick from={new THREE.Vector3(0, 0.8, 0)} to={new THREE.Vector3(0.5, 0.4, 0)} radius={0.04} color={0x71717a} />
      <Stick from={new THREE.Vector3(0.5, 0.4, 0)} to={new THREE.Vector3(0.9, 0, 0)} radius={0.04} color={0x71717a} />
      <Stick from={new THREE.Vector3(0.9, 0, 0)} to={new THREE.Vector3(1.3, -0.4, 0)} radius={0.04} color={0x71717a} />
      <Stick from={new THREE.Vector3(1.3, -0.4, 0)} to={new THREE.Vector3(1.7, -0.8, 0)} radius={0.04} color={0x71717a} />
    </group>
  );
}

function NucleotideRepresentation() {
  return (
    <group>
      <Sphere position={[0, 0.5, 0]} radius={0.2} color={0x22c55e} emissive />
      <Sphere position={[0, 0, 0]} radius={0.18} color={0xf59e0b} />
      <Sphere position={[0, -0.5, 0]} radius={0.18} color={0x3b82f6} />
      <Stick from={new THREE.Vector3(0, 0.5, 0)} to={new THREE.Vector3(0, 0, 0)} radius={0.04} color={0x71717a} />
      <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(0, -0.5, 0)} radius={0.04} color={0x71717a} />
    </group>
  );
}

function AminoAcidRepresentation() {
  return (
    <group>
      <Sphere position={[0, 0, 0]} radius={0.18} color={0x9ca3af} />
      <Sphere position={[0.5, 0.5, 0]} radius={0.15} color={0x3b82f6} />
      <Sphere position={[0.5, -0.5, 0]} radius={0.15} color={0xef4444} />
      <Sphere position={[-0.5, 0, 0]} radius={0.15} color={0x22c55e} emissive />
      <Sphere position={[-0.5, -0.3, 0.5]} radius={0.1} color={0xd1d5db} />
      <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(0.5, 0.5, 0)} radius={0.04} color={0x71717a} />
      <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(0.5, -0.5, 0)} radius={0.04} color={0x71717a} />
      <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.5, 0, 0)} radius={0.04} color={0x71717a} />
      <Stick from={new THREE.Vector3(0, 0, 0)} to={new THREE.Vector3(-0.5, -0.3, 0.5)} radius={0.03} color={0x71717a} />
    </group>
  );
}

function GlucoseRepresentation() {
  const ringR = 0.5;
  const sphereR = 0.15;
  const n = 6;

  const carbons = useMemo(() => Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [Math.cos(angle) * ringR, 0, Math.sin(angle) * ringR] as [number, number, number];
  }), []);

  return (
    <group>
      {carbons.map((pos, i) => (
        <group key={i}>
          <Sphere position={pos} radius={sphereR} color={0x3b82f6} />
          <Sphere position={[pos[0], pos[1] + 0.25, pos[2]]} radius={0.08} color={0xef4444} />
          <Stick
            from={new THREE.Vector3(...carbons[i])}
            to={new THREE.Vector3(...carbons[(i + 1) % n])}
            radius={0.04}
            color={0x71717a}
          />
        </group>
      ))}
    </group>
  );
}

function LipidRepresentation() {
  return (
    <group>
      <Sphere position={[0, 0.6, 0]} radius={0.2} color={0xf59e0b} />
      <Stick from={new THREE.Vector3(0, 0.6, 0)} to={new THREE.Vector3(-0.8, -0.8, 0.3)} radius={0.05} color={0x22c55e} />
      <Stick from={new THREE.Vector3(0, 0.6, 0)} to={new THREE.Vector3(0, -0.8, -0.4)} radius={0.05} color={0x22c55e} />
      <Stick from={new THREE.Vector3(0, 0.6, 0)} to={new THREE.Vector3(0.8, -0.8, 0.1)} radius={0.05} color={0x22c55e} />
    </group>
  );
}

function WaterRepresentation() {
  return (
    <group>
      <Sphere position={[0, 0.15, 0]} radius={0.2} color={0xef4444} />
      <Sphere position={[0.2, -0.1, 0.15]} radius={0.1} color={0xd1d5db} />
      <Sphere position={[-0.2, -0.1, 0.15]} radius={0.1} color={0xd1d5db} />
      <Stick from={new THREE.Vector3(0, 0.15, 0)} to={new THREE.Vector3(0.2, -0.1, 0.15)} radius={0.03} color={0x71717a} />
      <Stick from={new THREE.Vector3(0, 0.15, 0)} to={new THREE.Vector3(-0.2, -0.1, 0.15)} radius={0.03} color={0x71717a} />
    </group>
  );
}

function MoleculeContent({ moleculeType }: { moleculeType: string }) {
  switch (moleculeType) {
    case "dna": return <DNARepresentation />;
    case "rna": return <RNARepresentation />;
    case "protein": return <ProteinRepresentation />;
    case "atp": return <ATPRepresentation />;
    case "nucleotide": return <NucleotideRepresentation />;
    case "amino-acid": return <AminoAcidRepresentation />;
    case "glucose": return <GlucoseRepresentation />;
    case "lipid": return <LipidRepresentation />;
    case "water": return <WaterRepresentation />;
    default: return null;
  }
}

function CameraController({ resetKey }: { resetKey: number }) {
  const { camera } = useThree();
  const initialPos = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!initialPos.current) {
      initialPos.current = camera.position.clone();
    }
  }, [camera]);

  useEffect(() => {
    if (resetKey > 0 && initialPos.current) {
      camera.position.copy(initialPos.current);
    }
  }, [resetKey, camera]);

  return null;
}

export function MoleculeViewer({ moleculeType, scale = 1, showLabels = true }: MoleculeViewerProps) {
  const [resetKey, setResetKey] = useState(0);
  const labels = LABELS_MAP[moleculeType] || [];

  const handleReset = useCallback(() => {
    setResetKey((v) => v + 1);
  }, []);

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
          maxDistance={15}
          enableDamping
          dampingFactor={0.1}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 4]} intensity={1.0} />
        <pointLight position={[-3, 2, 3]} intensity={0.7} color={0x22c55e} />
        <pointLight position={[3, -2, -3]} intensity={0.4} color={0x3b82f6} />
        <group scale={scale}>
          <MoleculeContent moleculeType={moleculeType} />
        </group>
        <CameraController resetKey={resetKey} />
      </Canvas>

      <button
        onClick={handleReset}
        className="absolute top-3 left-3 z-10 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-white border border-stone-200 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm"
      >
        Reset
      </button>

      <div className="absolute bottom-3 left-3 z-10 px-2 py-1 text-[10px] text-stone-500 bg-white border border-stone-200 rounded shadow-sm">
        1 nm
      </div>

      {showLabels && labels.length > 0 && (
        <div className="absolute top-3 right-3 z-10 px-3 py-2 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg space-y-1 shadow-sm">
          {labels.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
