'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import SequenceInput from '@/components/ui/SequenceInput';
import { PlaybackControls } from '@/components/ui/PlaybackControls';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WebGLWrapper } from '@/components/3d/WebGLWrapper';
import { ReplicationProvider, useReplicationContext } from '@/contexts/ReplicationContext';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { computeComplement } from '@/lib/molecular/dna';
import type { AnimationControls } from '@/components/animations/useAnimationTimeline';

const sceneSkeleton = (
  <div className="w-full h-full rounded-xl bg-white border border-stone-200 animate-pulse flex items-center justify-center">
    <span className="text-stone-400 text-sm">Cargando escena 3D…</span>
  </div>
);

const ReplicationSceneDynamic = dynamic(
  () => import('@/components/3d/ReplicationScene').then((m) => ({ default: m.ReplicationScene })),
  { ssr: false, loading: () => sceneSkeleton }
);

const STEPS = [
  { title: 'Inicio', desc: 'La doble hélice de ADN está intacta y lista para replicarse.' },
  { title: 'Desenrollamiento', desc: 'La helicasa rompe los puentes de hidrógeno entre las bases y separa las dos cadenas.' },
  { title: 'Elongación', desc: 'La ADN polimerasa agrega nucleótidos complementarios a cada cadena molde en dirección 5\' → 3\'.' },
  { title: 'Formación', desc: 'Se forman dos moléculas hijas, cada una compuesta por una cadena original y una cadena nueva.' },
  { title: 'Completado', desc: 'La replicación ha finalizado. Ambas moléculas hijas son idénticas a la molécula original.' },
];

function ReplicationContent() {
  const { setTemplateSequence, templateSequence } = useReplicationContext()!;
  const { setActiveDNA, markModuleVisited } = useMolecularContext();
  const [seq, setSeq] = useState('');
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => { markModuleVisited('replicacion'); }, [markModuleVisited]);

  const complement = useMemo(() => {
    if (templateSequence.length < 2) return '';
    try { return computeComplement(templateSequence); }
    catch { return ''; }
  }, [templateSequence]);

  const totalSteps = STEPS.length;

  useEffect(() => {
    const idx = Math.min(totalSteps - 1, Math.floor(progress * (totalSteps - 1)));
    setStepIndex(idx);
  }, [progress, totalSteps]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) { setIsPlaying(false); return 1; }
        return p + 0.004;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const controls: AnimationControls = {
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    stepFwd: () => setProgress((p) => Math.min(1, p + 0.05)),
    stepBwd: () => setProgress((p) => Math.max(0, p - 0.05)),
    setSpeed: () => {},
    progress,
    isPlaying,
  };

  function handleStart() {
    if (seq.length < 2) return;
    setTemplateSequence(seq);
    setActiveDNA(seq);
    setStarted(true);
    setProgress(0);
    setIsPlaying(false);
  }

  function handleReset() {
    setStarted(false);
    setProgress(0);
    setIsPlaying(false);
    setStepIndex(0);
    setTemplateSequence('');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Replicación del ADN</h1>
          <p className="mt-1 text-stone-500 text-sm">
            Visualiza el proceso de replicación semiconservativa del ADN.
          </p>
        </div>
      </div>

      {!started ? (
        <div className="rounded-2xl bg-white/60 border border-stone-200 p-6 space-y-4">
          <SequenceInput
            value={seq}
            onChange={(v) => setSeq(v)}
            maxLength={30}
            label="Secuencia molde (4–30 bases)"
            placeholder="Ej: ATCG"
          />
          <button
            onClick={handleStart}
            disabled={seq.length < 4}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-200 disabled:text-stone-400 text-white transition-colors shadow-md"
          >
            Iniciar Replicación
          </button>
        </div>
      ) : (
        <>
          <div className="h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-white/70 border border-stone-200">
            <ErrorBoundary>
              <WebGLWrapper
                scene3D={<ReplicationSceneDynamic />}
                fallback2D={
                  <div className="flex items-center justify-center h-full text-stone-400 text-sm">
                    WebGL no está disponible en tu navegador.
                  </div>
                }
              />
            </ErrorBoundary>
          </div>

          <PlaybackControls controls={controls} />

          <div className="rounded-2xl bg-white/60 border border-stone-200 p-5">
            <h3 className="text-emerald-400 font-semibold mb-1">{STEPS[stepIndex].title}</h3>
            <p className="text-stone-600 text-sm">{STEPS[stepIndex].desc}</p>
            <div className="mt-3 flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i <= stepIndex ? 'bg-emerald-500' : 'bg-stone-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {progress >= 1 && (
            <div className="rounded-2xl bg-white/80 border border-[#4caf82]/40 p-5 space-y-3">
              <h3 className="text-emerald-400 font-semibold">Moléculas hijas</h3>
              <p className="text-stone-500 text-sm mb-3">
                La replicación semiconservativa produce dos moléculas de ADN, cada una con una cadena original y una nueva.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-stone-200/80 border border-stone-300 p-4">
                  <p className="text-xs text-stone-400 mb-2 font-mono">Hija 1</p>
                  <p className="text-stone-700 text-sm font-mono break-all">
                    <span className="text-emerald-400">{templateSequence}</span>
                    <span className="text-stone-400"> / </span>
                    <span className="text-blue-400">{complement}</span>
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    <span className="text-emerald-400">●</span> Original{' '}
                    <span className="text-blue-400 ml-2">●</span> Nueva
                  </p>
                </div>
                <div className="rounded-xl bg-stone-200/80 border border-stone-300 p-4">
                  <p className="text-xs text-stone-400 mb-2 font-mono">Hija 2</p>
                  <p className="text-stone-700 text-sm font-mono break-all">
                    <span className="text-emerald-400">{complement}</span>
                    <span className="text-stone-400"> / </span>
                    <span className="text-blue-400">{templateSequence}</span>
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    <span className="text-emerald-400">●</span> Original{' '}
                    <span className="text-blue-400 ml-2">●</span> Nueva
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-200">
                <p className="text-xs text-stone-500 leading-relaxed">
                  <strong className="text-emerald-400">Replicación semiconservativa:</strong> Cada molécula hija conserva
                  una cadena de la molécula parental (verde) y sintetiza una cadena complementaria nueva (azul).
                  Este mecanismo garantiza la fidelidad de la transmisión de la información genética.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            Nueva secuencia
          </button>
        </>
      )}
    </div>
  );
}

export default function ReplicacionPage() {
  return (
    <ReplicationProvider>
      <ReplicationContent />
    </ReplicationProvider>
  );
}
