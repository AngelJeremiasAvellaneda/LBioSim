'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { transcribe } from '@/lib/molecular/transcription';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { TranscriptionProvider, useTranscriptionContext } from '@/contexts/TranscriptionContext';
import SequenceInput from '@/components/ui/SequenceInput';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { WebGLWrapper } from '@/components/3d/WebGLWrapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAnimationTimeline } from '@/components/animations/useAnimationTimeline';
import { Dna, Zap } from 'lucide-react';

const sceneSkeleton = (
  <div className="w-full h-full rounded-xl bg-white border border-stone-200 animate-pulse flex items-center justify-center">
    <span className="text-stone-400 text-sm">Cargando escena 3D…</span>
  </div>
);

const TranscriptionScene = dynamic(
  () => import('@/components/3d/TranscriptionScene').then((m) => ({ default: m.TranscriptionScene })),
  { ssr: false, loading: () => sceneSkeleton },
);

const BASE_COLOR_MAP: Record<string, string> = {
  A: 'text-green-400',
  U: 'text-orange-400',
  T: 'text-red-400',
  C: 'text-blue-400',
  G: 'text-yellow-400',
};

export default function TranscripcionPage() {
  return (
    <TranscriptionProvider>
      <TranscripcionContent />
    </TranscriptionProvider>
  );
}

function TranscripcionContent() {
  const { activeDNA, setActiveDNA, setActiveRNA, markModuleVisited } = useMolecularContext();
  const transcriptionCtx = useTranscriptionContext();
  const [input, setInput] = useState(activeDNA);
  const [mRNA, setMRNA] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => { markModuleVisited('transcripcion'); }, []);

  const handleTranscribe = useCallback(() => {
    setError(null);
    setMRNA('');
    setRevealed(0);
    setAnimating(false);
    if (!input.trim()) { setError('Introduce una secuencia de ADN.'); return; }
    if (input.length < 4) { setError('La secuencia debe tener al menos 4 bases.'); return; }
    try {
      const result = transcribe(input);
      setMRNA(result);
      setActiveDNA(input);
      setActiveRNA(result);
      // Sync the context so TranscriptionScene can use it
      transcriptionCtx?.setTemplateSequence(input);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
  }, [input, setActiveDNA, setActiveRNA, transcriptionCtx]);

  const buildTimeline = useCallback((tl: gsap.core.Timeline) => {
    if (!mRNA) return;
    const chars = mRNA.split('');
    chars.forEach((_, i) => {
      tl.call(
        () => setRevealed(i + 1),
        undefined,
        i * 0.3,
      );
    });
  }, [mRNA]);

  const controls = useAnimationTimeline(buildTimeline, [mRNA]);

  const handleAnimate = () => {
    setAnimating(true);
    setRevealed(0);
    controls.play();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Dna className="w-6 h-6 text-emerald-400" />
        <h1 className="text-2xl font-bold text-stone-800">Transcripción: del ADN al ARN</h1>
      </div>

      <div className="rounded-2xl bg-white/80 border border-stone-200 p-5">
        <SequenceInput
          value={input}
          onChange={(v) => { setInput(v); setError(null); }}
          maxLength={60}
          label="Secuencia de ADN (codificante, 5'→3')"
          placeholder="Ej: ATGGCCCTGA"
          error={error}
        />
        <button
          onClick={handleTranscribe}
          className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md"
        >
          <Zap className="w-4 h-4" />
          Transcribir
        </button>
      </div>

      {mRNA && (
        <>
          <div className="rounded-2xl bg-white/80 border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider">ARN mensajero resultante</h2>
              <span className="text-xs text-stone-400">{mRNA.length} bases</span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-mono text-lg">
              {mRNA.split('').map((base, i) => (
                <span
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center rounded-md bg-stone-200 border border-stone-300 transition-all duration-200 text-sm font-bold ${BASE_COLOR_MAP[base] || 'text-stone-500'} ${animating && i >= revealed ? 'opacity-20 scale-75' : 'opacity-100 scale-100'}`}
                >
                  {base}
                </span>
              ))}
            </div>
            {!animating && (
              <button
                onClick={handleAnimate}
                className="mt-3 flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
              Animar revelado
              </button>
            )}
            {animating && (
              <div className="mt-3">
                <PlaybackControls controls={controls} />
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white/80 border border-stone-200 p-5">
            <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-3">Comparación ADN molde vs ARNm</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="text-stone-400 text-xs uppercase">
                    <th className="text-left pr-4 py-1">Posición</th>
                    {input.split('').map((_, i) => (
                      <th key={i} className="w-8 text-center py-1">{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-stone-400 text-xs pr-4 py-1">ADN</td>
                    {input.split('').map((base, i) => (
                      <td key={i} className={`text-center py-1 text-sm font-bold ${BASE_COLOR_MAP[base] || 'text-stone-500'}`}>{base}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-stone-400 text-xs pr-4 py-1">ARNm</td>
                    {mRNA.split('').map((base, i) => (
                      <td key={i} className={`text-center py-1 text-sm font-bold ${BASE_COLOR_MAP[base] || 'text-stone-500'}`}>{base}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 border border-stone-200 p-5">
            <h2 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-3">Visualización 3D</h2>
            <div className="h-56 sm:h-72 md:h-96 rounded-xl overflow-hidden">
              <ErrorBoundary>
                <WebGLWrapper
                  scene3D={<TranscriptionScene />}
                  fallback2D={
                    <div className="flex items-center justify-center h-full bg-stone-200/60 rounded-xl">
                      <p className="text-stone-400 text-sm">WebGL no disponible. Usa un navegador moderno para ver la escena 3D.</p>
                    </div>
                  }
                />
              </ErrorBoundary>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
