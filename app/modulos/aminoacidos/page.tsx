'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { STANDARD_AMINO_ACIDS, type AminoAcidData } from '@/lib/molecular/amino-acids-data';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { WebGLWrapper } from '@/components/3d/WebGLWrapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FlaskConical, Search, Star, Filter, X, Atom, Weight, Zap, Info } from 'lucide-react';

const AminoAcidScene = dynamic(
  () => import('@/components/3d/AminoAcidScene').then((m) => ({ default: m.AminoAcidScene })),
  { ssr: false },
);

type PolarityFilter = 'all' | 'polar' | 'nonpolar' | 'charged';
type ChargeFilter = 'all' | 'positive' | 'negative' | 'neutral';

const POLARITY_LABELS: Record<string, string> = { polar: 'Polar', nonpolar: 'No polar', charged: 'Cargado' };
const CHARGE_LABELS: Record<string, string> = { positive: 'Positivo', negative: 'Negativo', neutral: 'Neutral' };

const AA_CARD_COLORS: Record<string, string> = {
  A: 'border-l-green-500/60', R: 'border-l-red-500/60', N: 'border-l-blue-400/60',
  D: 'border-l-red-400/60', C: 'border-l-yellow-500/60', Q: 'border-l-teal-500/60',
  E: 'border-l-orange-500/60', G: 'border-l-purple-400/60', H: 'border-l-pink-500/60',
  I: 'border-l-indigo-500/60', L: 'border-l-cyan-500/60', K: 'border-l-blue-500/60',
  M: 'border-l-emerald-500/60', F: 'border-l-violet-500/60', P: 'border-l-amber-500/60',
  S: 'border-l-lime-500/60', T: 'border-l-rose-500/60', W: 'border-l-fuchsia-500/60',
  Y: 'border-l-sky-500/60', V: 'border-l-gray-500/60',
};

export default function AminoacidosPage() {
  const { markModuleVisited } = useMolecularContext();
  const [search, setSearch] = useState('');
  const [polarityFilter, setPolarityFilter] = useState<PolarityFilter>('all');
  const [chargeFilter, setChargeFilter] = useState<ChargeFilter>('all');
  const [selected, setSelected] = useState<AminoAcidData | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { markModuleVisited('aminoacidos'); }, []);

  const handleSearch = useCallback((value: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSearch(value), 150);
  }, []);

  const filtered = useMemo(() => {
    return STANDARD_AMINO_ACIDS.filter((aa) => {
      if (polarityFilter !== 'all' && aa.polarity !== polarityFilter) return false;
      if (chargeFilter !== 'all' && aa.charge !== chargeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !aa.name.toLowerCase().includes(q) &&
          !aa.singleLetter.toLowerCase().includes(q) &&
          !aa.threeLetter.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [polarityFilter, chargeFilter, search]);

  const polarityOptions: PolarityFilter[] = ['all', 'polar', 'nonpolar', 'charged'];
  const chargeOptions: ChargeFilter[] = ['all', 'positive', 'negative', 'neutral'];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <FlaskConical className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-stone-800">Los 20 Aminoácidos</h1>
      </div>

      <div className="rounded-2xl bg-white/80 border border-stone-200 p-4 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            ref={searchRef}
            type="text"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nombre o código..."
            className="w-full rounded-lg bg-stone-100 pl-9 pr-3 py-2 text-stone-800 placeholder-stone-400 outline-none ring-1 ring-stone-300 transition focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-stone-400 uppercase tracking-wider">Polaridad</span>
            <div className="flex gap-1.5 flex-wrap">
              {polarityOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setPolarityFilter(opt)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    polarityFilter === opt
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                  }`}
                >
                  {opt === 'all' ? 'Todos' : POLARITY_LABELS[opt]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-stone-400 uppercase tracking-wider">Carga</span>
            <div className="flex gap-1.5 flex-wrap">
              {chargeOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setChargeFilter(opt)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    chargeFilter === opt
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
                  }`}
                >
                  {opt === 'all' ? 'Todas' : CHARGE_LABELS[opt]}
                </button>
              ))}
            </div>
          </div>
          {(polarityFilter !== 'all' || chargeFilter !== 'all' || search) && (
            <button
              onClick={() => { setPolarityFilter('all'); setChargeFilter('all'); setSearch(''); if (searchRef.current) searchRef.current.value = ''; }}
              className="self-end flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700 transition-colors"
            >
              <X className="w-3 h-3" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className={`grid gap-3 ${selected ? 'lg:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'}`}>
        {filtered.map((aa) => (
          <button
            key={aa.singleLetter}
            onClick={() => setSelected(selected?.singleLetter === aa.singleLetter ? null : aa)}
            className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/80 border border-stone-200 border-l-4 transition-all hover:bg-stone-200 hover:border-stone-300 text-left ${
              AA_CARD_COLORS[aa.singleLetter] || 'border-l-zinc-600'
            } ${selected?.singleLetter === aa.singleLetter ? 'ring-2 ring-emerald-500' : ''}`}
          >
            {aa.essential && (
              <span className="absolute top-1.5 right-1.5" title="Aminoácido esencial">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </span>
            )}
            <span className="text-lg font-bold text-stone-800">{aa.singleLetter}</span>
            <span className="text-xs font-semibold text-stone-500">{aa.threeLetter}</span>
            <span className="text-xs text-stone-400 text-center leading-tight line-clamp-1">{aa.name}</span>
            <div className="flex gap-1 mt-1">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                aa.polarity === 'nonpolar' ? 'bg-stone-200 text-stone-600' :
                aa.polarity === 'polar' ? 'bg-sky-900/40 text-sky-300' :
                'bg-rose-900/40 text-rose-300'
              }`}>
                {POLARITY_LABELS[aa.polarity]}
              </span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
          <Filter className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">No se encontraron aminoácidos con esos filtros.</p>
        </div>
      )}

      {selected && (
        <div className="rounded-2xl bg-white/80 border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-bold text-stone-800 ${AA_CARD_COLORS[selected.singleLetter] || ''} border-l-4 pl-3`}>
                {selected.singleLetter}
              </span>
              <div>
                <h2 className="text-lg font-bold text-stone-800">{selected.name}</h2>
                <span className="text-sm text-stone-500">{selected.threeLetter} · {selected.singleLetter}</span>
              </div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-200/80 border border-stone-300">
              <Atom className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs text-stone-400 block">Fórmula molecular</span>
                <span className="text-sm font-mono text-stone-700">{selected.formula}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-200/80 border border-stone-300">
              <Weight className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs text-stone-400 block">Peso molecular</span>
                <span className="text-sm font-mono text-stone-700">{selected.weight} Da</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-200/80 border border-stone-300">
              <Zap className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs text-stone-400 block">Polaridad</span>
                <span className="text-sm text-stone-700">{POLARITY_LABELS[selected.polarity]}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-stone-200/80 border border-stone-300">
              <Info className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs text-stone-400 block">Carga (pH 7.4)</span>
                <span className="text-sm text-stone-700">{CHARGE_LABELS[selected.charge]}</span>
              </div>
            </div>
            {selected.essential && (
              <div className="sm:col-span-2 flex items-center gap-2 p-3 rounded-lg bg-amber-900/20 border border-amber-700/40">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm text-[#7a4e00]">Aminoácido esencial: el cuerpo humano no puede sintetizarlo, debe obtenerse de la dieta.</span>
              </div>
            )}
          </div>

          <div className="h-52 sm:h-64 md:h-80 rounded-xl overflow-hidden bg-stone-100/30 border border-stone-300">
            <ErrorBoundary>
              <WebGLWrapper
                scene3D={<AminoAcidScene aminoAcid={selected} />}
                fallback2D={
                  <div className="flex items-center justify-center h-full">
                    <p className="text-stone-400 text-sm">WebGL no disponible.</p>
                  </div>
                }
              />
            </ErrorBoundary>
          </div>
        </div>
      )}
    </div>
  );
}
