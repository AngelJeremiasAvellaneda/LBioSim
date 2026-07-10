'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import SequenceInput from '@/components/ui/SequenceInput';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { computeComplement } from '@/lib/molecular/dna';
import { BASE_COLORS } from '@/constants';
import { Download } from 'lucide-react';

const DNASceneDynamic = dynamic(
  () => import('@/components/dna3d/DNAScene').then((m) => ({ default: m.DNAScene })),
  { ssr: false }
);

export default function ConstruyeTuAdnPage() {
  const { setActiveDNA, markModuleVisited } = useMolecularContext();
  const [seq, setSeq] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { markModuleVisited('construye-tu-adn'); }, [markModuleVisited]);

  const complement = useMemo(() => {
    if (seq.length < 2) return '';
    try {
      const comp = computeComplement(seq);
      setError(null);
      return comp;
    } catch (e) {
      setError((e as Error).message);
      return '';
    }
  }, [seq]);

  useEffect(() => {
    if (seq.length >= 2) setActiveDNA(seq);
  }, [seq, setActiveDNA]);

  function handleDownload() {
    const content = `Secuencia original (5' → 3'): ${seq}\nComplemento (3' → 5'): ${complement}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'secuencia-adn.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  const bases = seq.split('');

  return (
    <div className="space-y-8">
      <div className="relative h-36 sm:h-48 rounded-2xl overflow-hidden bg-white/70 border border-stone-200">
        <div className="absolute inset-0 opacity-40" style={{ height: '100%' }}>
          <DNASceneDynamic />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f5f0eb]/60 px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Construye tu ADN</h1>
          <p className="mt-1 text-stone-500 text-xs sm:text-sm max-w-lg">
            Ingresa una secuencia de ADN para visualizar su complemento y estructura en 3D.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/60 border border-stone-200 p-6">
        <SequenceInput
          value={seq}
          onChange={(v) => setSeq(v)}
          maxLength={60}
          label="Secuencia de ADN (4–60 bases)"
          placeholder="Ej: ATGCGATC"
          error={error}
        />
        <p className="text-xs text-stone-400 mt-2">
          Ingresa entre 4 y 60 bases. Solo se permiten A, T, C, G.
        </p>
      </div>

      {seq.length >= 2 && complement && (
        <>
          <div className="rounded-2xl bg-white/60 border border-stone-200 p-6">
            <h2 className="text-lg font-semibold text-stone-700 mb-4">Alineamiento de cadenas</h2>
            <div className="overflow-x-auto">
              <div className="inline-flex flex-col gap-2 min-w-fit">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-400 w-8 shrink-0">5&apos;</span>
                  {bases.map((base, i) => (
                    <div
                      key={`top-${i}`}
                      className="w-9 h-9 rounded-md font-mono font-bold text-white text-sm flex items-center justify-center"
                      style={{ backgroundColor: BASE_COLORS[base as keyof typeof BASE_COLORS] }}
                    >
                      {base}
                    </div>
                  ))}
                  <span className="text-[10px] text-stone-400 w-8 shrink-0">3&apos;</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-stone-400 w-8 shrink-0">3&apos;</span>
                  {complement.split('').map((base, i) => (
                    <div
                      key={`bot-${i}`}
                      className="w-9 h-9 rounded-md font-mono font-bold text-white text-sm flex items-center justify-center opacity-80"
                      style={{ backgroundColor: BASE_COLORS[base as keyof typeof BASE_COLORS] }}
                    >
                      {base}
                    </div>
                  ))}
                  <span className="text-[10px] text-stone-400 w-8 shrink-0">5&apos;</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md"
          >
            <Download size={16} />
            Descargar secuencia (.txt)
          </button>
        </>
      )}
    </div>
  );
}
