'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useMolecularContext } from '@/contexts/MolecularContext';
import {
  Dna, Zap, Hexagon, Shapes, Circle, Droplets, Droplet, X,
} from 'lucide-react';

function LoadingSpinner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(t);
  }, []);
  if (!show) return <div className="h-96" />;
  return (
    <div className="flex items-center justify-center h-96">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const MoleculeViewer = dynamic(
  () => import('@/components/3d/MoleculeViewer').then((m) => ({ default: m.MoleculeViewer })),
  { ssr: false, loading: LoadingSpinner }
);

const MOLECULES = [
  { id: 'dna' as const, name: 'ADN', desc: 'Ácido desoxirribonucleico — doble hélice que almacena la información genética.', icon: Dna, color: 'emerald' },
  { id: 'rna' as const, name: 'ARN', desc: 'Ácido ribonucleico — cadena simple que participa en la síntesis de proteínas.', icon: Dna, color: 'orange' },
  { id: 'protein' as const, name: 'Proteína', desc: 'Cadenas de aminoácidos plegadas en estructuras tridimensionales complejas.', icon: Shapes, color: 'purple' },
  { id: 'atp' as const, name: 'ATP', desc: 'Adenosín trifosfato — principal moneda energética de la célula.', icon: Zap, color: 'yellow' },
  { id: 'nucleotide' as const, name: 'Nucleótido', desc: 'Unidad básica de los ácidos nucleicos: base nitrogenada, azúcar y fosfato.', icon: Hexagon, color: 'blue' },
  { id: 'amino-acid' as const, name: 'Aminoácido', desc: 'Bloque de construcción de las proteínas con grupo amino y grupo carboxilo.', icon: Shapes, color: 'pink' },
  { id: 'glucose' as const, name: 'Glucosa', desc: 'Monosacárido de seis carbonos, fuente primaria de energía celular.', icon: Circle, color: 'sky' },
  { id: 'lipid' as const, name: 'Lípido', desc: 'Molécula hidrofóbica que forma membranas celulares y almacena energía.', icon: Droplets, color: 'amber' },
  { id: 'water' as const, name: 'Agua', desc: 'Molécula polar esencial para todas las reacciones bioquímicas.', icon: Droplet, color: 'cyan' },
] as const;

const CARD_STYLES: Record<string, string> = {
  emerald: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40',
  orange: 'bg-orange-500/10 border-orange-500/25 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/40',
  purple: 'bg-purple-500/10 border-purple-500/25 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/40',
  yellow: 'bg-yellow-500/10 border-yellow-500/25 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/40',
  blue: 'bg-blue-500/10 border-blue-500/25 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40',
  pink: 'bg-pink-500/10 border-pink-500/25 text-pink-400 hover:bg-pink-500/20 hover:border-pink-500/40',
  sky: 'bg-sky-500/10 border-sky-500/25 text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/40',
  amber: 'bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/40',
  cyan: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40',
};

type MoleculeId = (typeof MOLECULES)[number]['id'];

export default function Modelos3DPage() {
  const { markModuleVisited } = useMolecularContext();
  const [selected, setSelected] = useState<MoleculeId | null>(null);

  useEffect(() => { markModuleVisited('modelos-3d'); }, [markModuleVisited]);

  const selectedMolecule = MOLECULES.find((m) => m.id === selected);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Modelos Moleculares 3D</h1>
        <p className="mt-2 text-stone-500 text-sm max-w-2xl">
          Explora la estructura tridimensional de las moléculas fundamentales de la vida.
          Selecciona una molécula para visualizarla en 3D con sus componentes principales.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOLECULES.map(({ id, name, desc, icon: Icon, color }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              onClick={() => setSelected(isSelected ? null : id)}
              aria-label={`${name}: ${desc}`}
              className={`relative flex flex-col items-start gap-3 p-5 rounded-2xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-emerald-500/40 border-emerald-500/50 bg-stone-200'
                  : CARD_STYLES[color]
              }`}
            >
              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-emerald-500/20' : 'bg-white'}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm">{name}</span>
                <span className={`text-xs leading-relaxed ${isSelected ? 'text-stone-600' : 'text-stone-400'}`}>
                  {desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selected && selectedMolecule && (
        <div className="rounded-2xl overflow-hidden bg-white/70 border border-stone-200">
          <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <selectedMolecule.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-stone-700">{selectedMolecule.name}</h2>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-52 sm:h-72 md:h-125">
            <MoleculeViewer moleculeType={selected} showLabels />
          </div>
        </div>
      )}
    </div>
  );
}
