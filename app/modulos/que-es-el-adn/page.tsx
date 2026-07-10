'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useMolecularContext } from '@/contexts/MolecularContext';
import {
  BASE_COLORS,
  BASE_FULL_NAMES,
  BASE_DESCRIPTIONS,
} from '@/constants';
import type { DNABase } from '@/types';

const DNASceneDynamic = dynamic(
  () => import('@/components/dna3d/DNAScene').then((m) => ({ default: m.DNAScene })),
  { ssr: false }
);

const EXAMPLE_PAIRS: [DNABase, DNABase][] = [
  ['A', 'T'],
  ['T', 'A'],
  ['G', 'C'],
  ['C', 'G'],
  ['G', 'C'],
  ['A', 'T'],
  ['T', 'A'],
  ['C', 'G'],
];

const BASE_TYPE: Record<DNABase, string> = {
  A: 'Púrica',
  T: 'Pirimidínica',
  C: 'Pirimidínica',
  G: 'Púrica',
};

const H_BONDS: Record<string, number> = {
  A: 2,
  T: 2,
  C: 3,
  G: 3,
};

export default function QueEsElAdnPage() {
  const { markModuleVisited } = useMolecularContext();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [hoveredBase, setHoveredBase] = useState<{ base: DNABase; x: number; y: number } | null>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { markModuleVisited('que-es-el-adn'); }, [markModuleVisited]);

  function handleClick(idx: number, side: 'left' | 'right') {
    setSelectedIdx(idx);
    setSelectedSide(side);
  }

  function handleMouseEnter(base: DNABase, e: React.MouseEvent) {
    posRef.current = { x: e.clientX, y: e.clientY };
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setHoveredBase({ base, x: posRef.current.x, y: posRef.current.y });
    }, 100);
  }

  function handleMouseLeave() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredBase(null);
  }

  const selectedBase = selectedIdx !== null && selectedSide !== null
    ? EXAMPLE_PAIRS[selectedIdx][selectedSide === 'left' ? 0 : 1]
    : null;

  const complementBase = selectedIdx !== null && selectedSide !== null
    ? EXAMPLE_PAIRS[selectedIdx][selectedSide === 'left' ? 1 : 0]
    : null;

  return (
    <div className="space-y-8">
      <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden bg-white/70 border border-stone-200">
        <div className="absolute inset-0" style={{ height: '100%' }}>
          <DNASceneDynamic />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5f0eb]/60 px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">¿Qué es el ADN?</h1>
          <p className="mt-2 text-stone-500 text-xs sm:text-sm max-w-xl">
            El ácido desoxirribonucleico (ADN) es la molécula que almacena la información genética
            en todos los organismos vivos. Está formado por dos cadenas de nucleótidos
            que se enrollan formando una doble hélice.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/60 border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-700 mb-2">Explorador de pares de bases</h2>
        <p className="text-stone-500 text-sm mb-6">
          Haz clic en cualquier base para ver información detallada.
        </p>
        <div className="flex flex-col items-center gap-3">
          {EXAMPLE_PAIRS.map(([left, right], idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${
                  isSelected ? 'bg-stone-200 ring-2 ring-emerald-500/40' : ''
                }`}
              >
                <button
                  className="relative w-12 h-12 rounded-xl font-mono font-bold text-white text-base flex items-center justify-center transition-all duration-150 hover:scale-110 hover:shadow-lg"
                  style={{ backgroundColor: BASE_COLORS[left] }}
                  onClick={() => handleClick(idx, 'left')}
                  onMouseEnter={(e) => handleMouseEnter(left, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {left}
                </button>
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-16 border-t border-dashed border-stone-400" />
                  <span className="text-[10px] text-stone-400 font-mono">{H_BONDS[left]}H</span>
                </div>
                <button
                  className="relative w-12 h-12 rounded-xl font-mono font-bold text-white text-base flex items-center justify-center transition-all duration-150 hover:scale-110 hover:shadow-lg"
                  style={{ backgroundColor: BASE_COLORS[right] }}
                  onClick={() => handleClick(idx, 'right')}
                  onMouseEnter={(e) => handleMouseEnter(right, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {right}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedBase && (
        <div className="rounded-2xl bg-white/80 border border-[#4caf82]/40 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-5 h-5 rounded"
              style={{ backgroundColor: BASE_COLORS[selectedBase] }}
            />
            <h3 className="text-emerald-400 font-semibold">{BASE_FULL_NAMES[selectedBase]}</h3>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div>
              <span className="text-stone-400">Símbolo: </span>
              <span className="text-stone-700 font-mono">{selectedBase}</span>
            </div>
            <div>
              <span className="text-stone-400">Tipo: </span>
              <span className="text-stone-700">{BASE_TYPE[selectedBase]}</span>
            </div>
            <div>
              <span className="text-stone-400">Complemento: </span>
              <span className="text-stone-700 font-mono">{complementBase}</span>
              <span className="text-stone-500 ml-1">({BASE_FULL_NAMES[complementBase!]})</span>
            </div>
            <div>
              <span className="text-stone-400">Enlaces de H: </span>
              <span className="text-stone-700">{H_BONDS[selectedBase]}</span>
            </div>
            <div className="col-span-2 mt-2 text-stone-500 text-xs leading-relaxed border-t border-stone-200 pt-3">
              {BASE_DESCRIPTIONS[selectedBase]}
            </div>
          </div>
        </div>
      )}

      {hoveredBase && (
        <div
          className="fixed z-50 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-300 text-xs text-stone-800 font-medium pointer-events-none shadow-xl"
          style={{ left: hoveredBase.x + 14, top: hoveredBase.y - 12 }}
        >
          {BASE_FULL_NAMES[hoveredBase.base]}
        </div>
      )}
    </div>
  );
}
