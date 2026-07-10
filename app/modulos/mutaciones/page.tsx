'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import SequenceInput from '@/components/ui/SequenceInput';
import { classifyMutation } from '@/lib/molecular/mutations';
import { transcribe } from '@/lib/molecular/transcription';
import { translate } from '@/lib/molecular/translation';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { usePlatformStore } from '@/store/platform-store';
import type { MutationResult } from '@/lib/molecular/mutations';
import { AlertTriangle, CheckCircle2, ChevronRight, Dna, Info, Zap } from 'lucide-react';

// ─── Types & Constants ─────────────────────────────────────────────────────────

const MUTATION_META = {
  silent: {
    label: 'Silenciosa (Sinónima)',
    color: 'text-[#2a5282]',
    bg: 'bg-[#aac8e8]/30',
    border: 'border-[#6b9bd2]/40',
    dot: 'bg-blue-400',
    icon: CheckCircle2,
    educacion: 'El cambio en el nucleótido no altera el aminoácido producido. Esto ocurre porque el código genético es degenerado: varios codones diferentes pueden codificar el mismo aminoácido.',
  },
  missense: {
    label: 'Missense (No sinónima)',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    icon: AlertTriangle,
    educacion: 'El cambio en el nucleótido resulta en un aminoácido diferente. Dependiendo de la posición y la función del aminoácido, esto puede alterar o destruir la función de la proteína.',
  },
  nonsense: {
    label: 'Sin sentido (Nonsense)',
    color: 'text-red-400',
    bg: 'bg-[#f0a8a8]/30',
    border: 'border-[#e07070]/40',
    dot: 'bg-red-400',
    icon: AlertTriangle,
    educacion: 'El cambio introduce un codón de parada prematuro (UAA, UAG o UGA). La proteína resultante queda truncada y generalmente es no funcional o degradada.',
  },
  frameshift: {
    label: 'Desplazamiento de Marco (Frameshift)',
    color: 'text-[#6b44a8]',
    bg: 'bg-[#c5b0e0]/30',
    border: 'border-[#9b72d4]/40',
    dot: 'bg-purple-400',
    icon: AlertTriangle,
    educacion: 'La inserción o deleción de bases (que no sea múltiplo de 3) desplaza el marco de lectura. Todos los codones aguas abajo quedan alterados, produciendo una proteína completamente diferente.',
  },
} as const;

const BASE_COLORS: Record<string, string> = {
  A: 'text-[#1a5c3a] bg-green-500/10 border-green-500/30',
  T: 'text-red-400 bg-[#f0a8a8]/30 border-[#e07070]/40',
  C: 'text-[#2a5282] bg-[#aac8e8]/30 border-[#6b9bd2]/40',
  G: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  U: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
};

const EJEMPLOS = [
  { label: 'Silent (CCC→CCG)', orig: 'ATGCCCGTATAA', mut: 'ATGCCGGTATAA', pos: 3 },
  { label: 'Missense (Val→Glu)', orig: 'ATGGTGCAA', mut: 'ATGGAGCAA', pos: 3 },
  { label: 'Nonsense (Gln→STOP)', orig: 'ATGCAGTTA', mut: 'ATGTAGTTA', pos: 3 },
  { label: 'Frameshift (+1 base)', orig: 'ATGCCCGTA', mut: 'ATGCACCCGTA', pos: 3 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BaseToken({ base, highlight, dim }: { base: string; highlight: boolean; dim: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded border text-[11px] font-mono font-bold transition-all duration-200 ${
        highlight
          ? (BASE_COLORS[base] ?? 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40') + ' ring-1 ring-current ring-offset-1 ring-offset-zinc-950 scale-110'
          : dim
          ? 'text-stone-400 bg-white/60 border-stone-200'
          : (BASE_COLORS[base] ?? 'text-stone-600 bg-stone-200 border-stone-300')
      }`}
    >
      {base}
    </span>
  );
}

function CodonGroup({ codons, highlight }: { codons: string[]; highlight: boolean }) {
  return (
    <span className={`inline-flex gap-0.5 p-0.5 rounded-md transition-all ${highlight ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30' : ''}`}>
      {codons.map((b, i) => (
        <BaseToken key={i} base={b} highlight={false} dim={false} />
      ))}
    </span>
  );
}

function SequenceRow({
  label,
  seq,
  highlightPositions,
  highlightCodonIdx,
  isFrameshift,
}: {
  label: string;
  seq: string;
  highlightPositions: number[];
  highlightCodonIdx: number;
  isFrameshift: boolean;
}) {
  const bases = seq.split('');
  return (
    <div className="flex items-start gap-3">
      <span className="text-[10px] text-stone-400 font-mono w-8 pt-1.5 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-0.5 items-center">
        {bases.map((base, i) => {
          const codonIdx = Math.floor(i / 3);
          const isHighlighted = highlightPositions.includes(i) || (isFrameshift && i >= highlightPositions[0]);
          const isDimmed = !isHighlighted && !isFrameshift;
          // Add codon separator every 3 bases
          return (
            <span key={i} className="inline-flex items-center">
              {i > 0 && i % 3 === 0 && (
                <span className="w-px h-5 bg-stone-200 mx-0.5 inline-block" />
              )}
              <BaseToken
                base={base}
                highlight={isHighlighted}
                dim={isDimmed && highlightPositions.length > 0}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MutacionesPage() {
  const { markModuleVisited } = useMolecularContext();
  const showToast = usePlatformStore((s) => s.showToast);

  const [originalDNA, setOriginalDNA] = useState('');
  const [mutatedDNA, setMutatedDNA] = useState('');
  const [position, setPosition] = useState(0);
  const [result, setResult] = useState<MutationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Mark as visited after 2 successful analyses
  useEffect(() => {
    if (analysisCount >= 2 && !completed) {
      setCompleted(true);
      markModuleVisited('mutaciones');
      showToast({ type: 'success', message: '¡Módulo de Mutaciones completado! 🧬' });
    }
  }, [analysisCount, completed, markModuleVisited, showToast]);

  const maxPos = Math.max(0, Math.min(originalDNA.length, mutatedDNA.length) - 1);

  const loadExample = useCallback((ex: typeof EJEMPLOS[0]) => {
    setOriginalDNA(ex.orig);
    setMutatedDNA(ex.mut);
    setPosition(ex.pos);
    setResult(null);
    setError(null);
  }, []);

  function handleClassify() {
    setError(null);
    setResult(null);
    if (!originalDNA || !mutatedDNA) {
      setError('Introduce ambas secuencias de ADN');
      return;
    }
    if (originalDNA.length < 3 || mutatedDNA.length < 3) {
      setError('Las secuencias deben tener al menos 3 bases');
      return;
    }
    const maxLen = Math.max(originalDNA.length, mutatedDNA.length);
    if (position < 0 || position >= maxLen) {
      setError(`La posición debe estar entre 0 y ${maxLen - 1}`);
      return;
    }
    try {
      const res = classifyMutation(originalDNA, mutatedDNA, position);
      setResult(res);
      setAnalysisCount((n) => n + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al clasificar la mutación');
    }
  }

  const comparisonData = useMemo(() => {
    if (!originalDNA || !mutatedDNA || !result) return null;
    try {
      const origRNA = transcribe(originalDNA);
      const mutRNA = transcribe(mutatedDNA);
      const origAA = translate(origRNA).map((a) => a.singleLetter).join('') || '—';
      const mutAA = translate(mutRNA).map((a) => a.singleLetter).join('') || '—';
      const isFrameshift = result.type === 'frameshift';

      let highlightDNA: number[] = [];
      let highlightRNA: number[] = [];

      if (!isFrameshift) {
        const codonIdx = Math.floor(result.position / 3);
        const start = codonIdx * 3;
        highlightDNA = [start, start + 1, start + 2];
        highlightRNA = [start, start + 1, start + 2];
      } else {
        for (let i = result.position; i < Math.max(originalDNA.length, mutatedDNA.length); i++) {
          highlightDNA.push(i);
          highlightRNA.push(i);
        }
      }
      return { origRNA, mutRNA, origAA, mutAA, highlightDNA, highlightRNA, isFrameshift };
    } catch {
      return null;
    }
  }, [originalDNA, mutatedDNA, result]);

  const meta = result ? MUTATION_META[result.type] : null;
  const MetaIcon = meta?.icon;

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Dna className="w-5 h-5 text-red-400" />
            <h1 className="text-2xl font-bold text-stone-800">Clasificador de Mutaciones</h1>
            {completed && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                <CheckCircle2 className="w-3 h-3" /> Completado
              </span>
            )}
          </div>
          <p className="text-stone-400 text-sm">
            Compara dos secuencias de ADN y descubre qué tipo de mutación se produjo y cuál es su efecto biológico.
          </p>
        </div>
        {!completed && (
          <div className="shrink-0 text-right">
            <p className="text-[11px] text-stone-400">Progreso</p>
            <p className="text-xs font-mono text-stone-500">{Math.min(analysisCount, 2)}/2 análisis</p>
          </div>
        )}
      </div>

      {/* Completion banner */}
      {!completed && analysisCount > 0 && (
        <div className="rounded-xl border border-stone-300 bg-white/60 p-3 flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  analysisCount > i ? 'bg-emerald-500' : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-stone-400">
            {analysisCount >= 2 ? '¡Completo!' : `Realiza ${2 - analysisCount} análisis más para completar el módulo`}
          </p>
        </div>
      )}

      {/* Example presets */}
      <div>
        <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">Ejemplos rápidos</p>
        <div className="flex flex-wrap gap-2">
          {EJEMPLOS.map((ex) => (
            <button
              key={ex.label}
              onClick={() => loadExample(ex)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-200 text-stone-500 hover:bg-stone-200 hover:text-stone-700 border border-stone-300 transition-all"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input section */}
      <div className="rounded-2xl border border-stone-200 bg-white/80 p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SequenceInput
            label="ADN Original"
            value={originalDNA}
            onChange={(v) => { setOriginalDNA(v); setResult(null); setError(null); }}
            placeholder="Ej: ATGCCCGTA"
            maxLength={60}
          />
          <SequenceInput
            label="ADN Mutado"
            value={mutatedDNA}
            onChange={(v) => { setMutatedDNA(v); setResult(null); setError(null); }}
            placeholder="Ej: ATGCCGGTA"
            maxLength={60}
          />
        </div>

        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-stone-500 text-xs font-medium">
              Posición de la mutación{' '}
              <span className="text-stone-400">(0-indexed, max {Math.max(maxPos, 0)})</span>
            </label>
            <input
              type="number"
              min={0}
              max={Math.max(maxPos, 0)}
              value={position}
              onChange={(e) => setPosition(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-24 rounded-lg bg-stone-100 px-3 py-2 text-stone-800 text-sm outline-none ring-1 ring-stone-300 focus:ring-2 focus:ring-[#4caf82]/40 transition"
            />
          </div>
          <button
            onClick={handleClassify}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md hover:shadow-emerald-500/20 active:scale-95"
          >
            <Zap className="w-4 h-4" />
            Clasificar Mutación
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-[#e07070]/40 bg-[#f0a8a8]/30 px-4 py-2.5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && meta && MetaIcon && (
        <div className="space-y-4">
          {/* Mutation type card */}
          <div className={`rounded-2xl border p-5 ${meta.bg} ${meta.border}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
              <MetaIcon className={`w-5 h-5 ${meta.color}`} />
              <span className={`text-base font-bold ${meta.color}`}>{meta.label}</span>
            </div>

            {/* Codon details (not for frameshift) */}
            {result.type !== 'frameshift' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Codón Original', value: result.originalCodon || '—' },
                  { label: 'Codón Mutado', value: result.mutatedCodon || '—' },
                  { label: 'AA Original', value: result.originalAA || '—' },
                  { label: 'AA Mutado', value: result.mutatedAA || '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-[#f5f0eb]/40 p-2.5">
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">{label}</p>
                    <p className="font-mono font-bold text-stone-700 text-sm mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-stone-600">{result.description}</p>

            {/* Educational note */}
            <div className="mt-4 rounded-lg bg-[#f5f0eb]/40 border border-stone-200 p-3 flex gap-2">
              <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <p className="text-xs text-stone-400 leading-relaxed">{meta.educacion}</p>
            </div>
          </div>

          {/* Visual comparison */}
          {comparisonData && (
            <div className="rounded-2xl border border-stone-200 bg-white/80 p-5 space-y-5">
              <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
                Comparación Visual
              </h3>

              {/* DNA comparison */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-3 bg-zinc-600 rounded-full" />
                  <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">ADN (5′→3′)</span>
                </div>
                <SequenceRow
                  label="Orig"
                  seq={originalDNA}
                  highlightPositions={comparisonData.highlightDNA}
                  highlightCodonIdx={Math.floor(position / 3)}
                  isFrameshift={comparisonData.isFrameshift}
                />
                <div className="flex items-center gap-3 pl-11">
                  <ChevronRight className="w-3 h-3 text-stone-500" />
                  <span className="text-[10px] text-stone-400">mutación en posición {position}</span>
                </div>
                <SequenceRow
                  label="Mut"
                  seq={mutatedDNA}
                  highlightPositions={comparisonData.highlightDNA}
                  highlightCodonIdx={Math.floor(position / 3)}
                  isFrameshift={comparisonData.isFrameshift}
                />
              </div>

              {/* RNA comparison */}
              <div className="pt-3 border-t border-stone-200 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1 h-3 bg-zinc-600 rounded-full" />
                  <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">ARNm</span>
                </div>
                <SequenceRow
                  label="Orig"
                  seq={comparisonData.origRNA}
                  highlightPositions={comparisonData.highlightRNA}
                  highlightCodonIdx={Math.floor(position / 3)}
                  isFrameshift={comparisonData.isFrameshift}
                />
                <SequenceRow
                  label="Mut"
                  seq={comparisonData.mutRNA}
                  highlightPositions={comparisonData.highlightRNA}
                  highlightCodonIdx={Math.floor(position / 3)}
                  isFrameshift={comparisonData.isFrameshift}
                />
              </div>

              {/* Amino acids */}
              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1 h-3 bg-zinc-600 rounded-full" />
                  <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Cadena de aminoácidos</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Original', value: comparisonData.origAA },
                    { label: 'Mutada', value: comparisonData.mutAA },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-[#f5f0eb]/40 border border-stone-200 p-3">
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">{label}</p>
                      <p className="font-mono text-sm text-stone-700 break-all leading-relaxed">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mutation type legend */}
      <div className="rounded-2xl border border-stone-200 bg-white/60 p-4">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Tipos de Mutación</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(Object.entries(MUTATION_META) as [string, typeof MUTATION_META.silent][]).map(([type, meta]) => (
            <div
              key={type}
              className={`flex items-start gap-2.5 rounded-lg p-2.5 border transition-all ${
                result?.type === type ? `${meta.bg} ${meta.border}` : 'border-transparent'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${meta.dot}`} />
              <div>
                <p className={`text-xs font-semibold ${result?.type === type ? meta.color : 'text-stone-500'}`}>
                  {meta.label}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">{meta.educacion.slice(0, 80)}…</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
