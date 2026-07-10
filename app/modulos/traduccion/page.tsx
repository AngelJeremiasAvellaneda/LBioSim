'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { translate, type AminoAcid } from '@/lib/molecular/translation';
import { GENETIC_CODE } from '@/lib/molecular/codon-table';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { WebGLWrapper } from '@/components/3d/WebGLWrapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ArrowRight, AlertTriangle, Table2, ChevronDown, ChevronUp } from 'lucide-react';

const sceneSkeleton = (
  <div className="w-full h-full rounded-xl bg-white border border-stone-200 animate-pulse flex items-center justify-center">
    <span className="text-stone-400 text-sm">Cargando escena 3D…</span>
  </div>
);

const TranslationScene = dynamic(
  () => import('@/components/3d/TranslationScene').then((m) => ({ default: m.TranslationScene })),
  { ssr: false, loading: () => sceneSkeleton },
);

const AA_COLORS: Record<string, string> = {
  A: 'bg-green-500/20 text-green-300 border-green-600/40',
  R: 'bg-red-500/20 text-red-300 border-red-600/40',
  N: 'bg-blue-400/20 text-blue-300 border-blue-500/40',
  D: 'bg-red-400/20 text-red-300 border-red-500/40',
  C: 'bg-yellow-500/20 text-yellow-300 border-yellow-600/40',
  Q: 'bg-teal-500/20 text-teal-300 border-teal-600/40',
  E: 'bg-orange-500/20 text-orange-300 border-orange-600/40',
  G: 'bg-purple-400/20 text-purple-300 border-purple-500/40',
  H: 'bg-pink-500/20 text-pink-300 border-pink-600/40',
  I: 'bg-indigo-500/20 text-indigo-300 border-indigo-600/40',
  L: 'bg-cyan-500/20 text-cyan-300 border-cyan-600/40',
  K: 'bg-blue-500/20 text-blue-300 border-blue-600/40',
  M: 'bg-emerald-500/20 text-emerald-300 border-emerald-600/40',
  F: 'bg-violet-500/20 text-violet-300 border-violet-600/40',
  P: 'bg-amber-500/20 text-[#a87a20] border-amber-600/40',
  S: 'bg-lime-500/20 text-lime-300 border-lime-600/40',
  T: 'bg-rose-500/20 text-rose-300 border-rose-600/40',
  W: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-600/40',
  Y: 'bg-sky-500/20 text-sky-300 border-sky-600/40',
  V: 'bg-gray-500/20 text-gray-300 border-gray-600/40',
};

export default function TraduccionPage() {
  const { activeRNA, activeAminoAcids, setAminoAcids, markModuleVisited } = useMolecularContext();
  const [input, setInput] = useState(activeRNA);
  const [result, setResult] = useState<AminoAcid[]>(activeAminoAcids);
  const [error, setError] = useState<string | null>(null);
  const [showCodonTable, setShowCodonTable] = useState(false);
  const [noStartWarning, setNoStartWarning] = useState(false);

  useEffect(() => { markModuleVisited('traduccion'); }, []);

  useEffect(() => {
    if (activeRNA && !input) {
      setInput(activeRNA);
    }
  }, [activeRNA]);

  const handleTranslate = useCallback(() => {
    setError(null);
    setResult([]);
    setNoStartWarning(false);
    const seq = input.trim().toUpperCase();
    if (!seq) { setError('Introduce una secuencia de ARN.'); return; }
    if (seq.length < 6) { setError('La secuencia debe tener al menos 6 bases (2 codones).'); return; }
    if (seq.length > 90) { setError('La secuencia no puede exceder 90 bases.'); return; }
    if (seq.length % 3 !== 0) { setError('La secuencia debe tener una longitud múltiplo de 3.'); return; }
    if (!/^[AUCG]+$/.test(seq)) { setError('Solo se permiten bases de ARN: A, U, C, G.'); return; }
    try {
      const aas = translate(seq);
      if (aas.length === 0) { setError('La traducción no produjo aminoácidos (posible codón STOP inmediato).'); return; }
      setResult(aas);
      setAminoAcids(aas);
      if (aas[0].codon !== 'AUG') {
        setNoStartWarning(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
  }, [input, setAminoAcids]);

  const scanForStart = () => {
    const seq = input.trim().toUpperCase();
    const idx = seq.indexOf('AUG');
    if (idx === -1) { setError('No se encontró el codón de inicio AUG en la secuencia.'); return; }
    const trimmed = seq.slice(idx);
    setInput(trimmed);
  };

  const codonEntries = Object.entries(GENETIC_CODE);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <ArrowRight className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-stone-800">Traducción: del ARN a la Proteína</h1>
      </div>

      <div className="rounded-2xl bg-white/80 border border-stone-200 p-5">
        <label className="text-stone-600 text-sm font-medium block mb-1">
          Secuencia de ARNm (múltiplo de 3, 6–90 bases)
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(null); }}
          maxLength={90}
          placeholder="Ej: AUGGCCUGA"
          className="w-full rounded-md bg-stone-100 px-3 py-2 text-emerald-100 placeholder-stone-400 outline-none ring-1 ring-stone-300 transition focus:ring-2 focus:ring-emerald-500 font-mono"
        />
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleTranslate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
          >
            <ArrowRight className="w-4 h-4" />
            Traducir
          </button>
          {activeRNA && input !== activeRNA && (
            <button
              onClick={() => setInput(activeRNA)}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
            >
              Cargar ARN activo
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {result.length > 0 && (
        <>
          {noStartWarning && (
            <div className="rounded-2xl bg-[#f0cc80]/40 border border-[#d4a843]/40 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-sm text-[#7a4e00] font-medium">No se encontró el codón de inicio AUG al principio</p>
                <p className="text-xs text-[#a87a20]">La traducción canónica comienza con el codón AUG (Metionina).</p>
                <button
                  onClick={scanForStart}
                  className="text-xs font-semibold text-[#a87a20] hover:text-[#7a4e00] underline underline-offset-2 mt-1 self-start"
                >
                  Escanear primer AUG
                </button>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white/80 border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider">Secuencia de aminoácidos</h2>
              <span className="text-xs text-stone-400">{result.length} aa</span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono mb-4">
              {result.map((aa, i) => (
                <span
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm font-bold ${AA_COLORS[aa.singleLetter] || 'bg-stone-100 text-stone-600 border-stone-300'}`}
                  title={`${aa.name} (${aa.threeLetter})`}
                >
                  {aa.singleLetter}
                </span>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {result.map((aa, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-stone-200/80 border border-stone-300">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-md border text-xs font-bold shrink-0 ${AA_COLORS[aa.singleLetter] || 'bg-stone-100 text-stone-600 border-stone-300'}`}>
                    {aa.singleLetter}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm text-stone-700 font-medium truncate">{aa.name}</span>
                    <span className="text-xs text-stone-400">{aa.threeLetter} · Codón: {aa.codon} · Anticodón: {aa.anticodon}</span>
                  </div>
                  <span className="text-xs text-stone-400 ml-auto">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 border border-stone-200 p-5">
            <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-3">Visualización 3D</h2>
            <div className="h-56 sm:h-72 md:h-96 rounded-xl overflow-hidden">
              <ErrorBoundary>
                <WebGLWrapper
                  scene3D={<TranslationScene />}
                  fallback2D={
                    <div className="flex items-center justify-center h-full bg-stone-200/60 rounded-xl">
                      <p className="text-stone-400 text-sm">WebGL no disponible.</p>
                    </div>
                  }
                />
              </ErrorBoundary>
            </div>
          </div>
        </>
      )}

      <div className="rounded-2xl bg-white/80 border border-stone-200 p-5">
        <button
          onClick={() => setShowCodonTable(!showCodonTable)}
          className="flex items-center gap-2 text-sm font-semibold text-stone-600 uppercase tracking-wider w-full"
        >
          <Table2 className="w-4 h-4" />
          Tabla de codones
          {showCodonTable ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
        </button>
        {showCodonTable && (
          <div className="mt-3 overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-stone-400 uppercase sticky top-0 bg-white">
                  <th className="text-left px-2 py-1">Codón</th>
                  <th className="text-left px-2 py-1">AA</th>
                  <th className="text-left px-2 py-1">Nombre</th>
                </tr>
              </thead>
              <tbody>
                {codonEntries.map(([codon, info]) => (
                  <tr key={codon} className="border-t border-stone-200">
                    <td className={`px-2 py-1 font-bold ${info === 'STOP' ? 'text-red-400' : 'text-emerald-300'}`}>{codon}</td>
                    <td className="px-2 py-1">{info === 'STOP' ? '—' : info.singleLetter}</td>
                    <td className="px-2 py-1 text-stone-500">{info === 'STOP' ? 'STOP' : info.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
