'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WebGLWrapper } from '@/components/3d/WebGLWrapper';
import {
  Play, ChevronRight, Dna, Copy, FileText, Languages, Shapes, CheckCircle2,
} from 'lucide-react';

const MoleculeViewer = dynamic(
  () => import('@/components/3d/MoleculeViewer').then((m) => ({ default: m.MoleculeViewer })),
  { ssr: false, loading: () => sceneSkeleton }
);

const ReplicationScene = dynamic(
  () => import('@/components/3d/ReplicationScene').then((m) => ({ default: m.ReplicationScene })),
  { ssr: false, loading: () => sceneSkeleton }
);

const TranscriptionScene = dynamic(
  () => import('@/components/3d/TranscriptionScene').then((m) => ({ default: m.TranscriptionScene })),
  { ssr: false, loading: () => sceneSkeleton }
);

const TranslationScene = dynamic(
  () => import('@/components/3d/TranslationScene').then((m) => ({ default: m.TranslationScene })),
  { ssr: false, loading: () => sceneSkeleton }
);

const FoldingScene = dynamic(
  () => import('@/components/3d/FoldingScene').then((m) => ({ default: m.FoldingScene })),
  { ssr: false, loading: () => sceneSkeleton }
);

const STAGES = [
  { id: 'adn', label: 'ADN', desc: 'Molécula que almacena la información genética en su secuencia de nucleótidos.', icon: Dna, input: 'Nucleótidos libres', output: 'Doble hélice de ADN' },
  { id: 'replicacion', label: 'Replicación', desc: 'El ADN se duplica para transmitir la información genética a las células hijas.', icon: Copy, input: 'ADN original', output: 'Dos copias idénticas de ADN' },
  { id: 'transcripcion', label: 'Transcripción', desc: 'La secuencia de ADN se copia a ARN mensajero para salir del núcleo.', icon: FileText, input: 'ADN molde', output: 'ARN mensajero (ARNm)' },
  { id: 'traduccion', label: 'Traducción', desc: 'El ARNm se traduce a una cadena de aminoácidos en el ribosoma.', icon: Languages, input: 'ARN mensajero', output: 'Cadena polipeptídica' },
  { id: 'proteina', label: 'Proteína', desc: 'La cadena polipeptídica se pliega en una estructura tridimensional funcional.', icon: Shapes, input: 'Péptido lineal', output: 'Proteína funcional' },
] as const;

const TRANSITION_INFO = [
  { from: 'ADN molde', to: 'Replicación' },
  { from: 'ADN original', to: 'Transcripción' },
  { from: 'ARN mensajero', to: 'Traducción' },
  { from: 'Cadena polipeptídica', to: 'Plegamiento' },
];

const STAGE_DURATION = 20000;
const TRANSITION_DURATION = 2500;

function Fallback2D({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-64 rounded-2xl bg-white/70 border border-stone-200">
      <div className="text-center">
        <p className="text-stone-500 text-sm font-medium">WebGL no disponible</p>
        <p className="text-stone-400 text-xs mt-1">{label} requiere aceleración gráfica</p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const sceneSkeleton = (
  <div className="w-full h-full rounded-xl bg-white border border-stone-200 animate-pulse flex items-center justify-center">
    <span className="text-stone-400 text-sm">Cargando escena 3D…</span>
  </div>
);

function SceneContainer({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <div style={{ width: '100%', height: '100%' }}>
        <WebGLWrapper
          scene3D={<>{children}</>}
          fallback2D={<Fallback2D label="Esta escena" />}
          loadingFallback={<LoadingFallback />}
        />
      </div>
    </ErrorBoundary>
  );
}

export default function DogmaTemporalPage() {
  const { markModuleVisited, visitedModules } = useMolecularContext();
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [transition, setTransition] = useState<string | null>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { markModuleVisited('dogma-temporal'); }, [markModuleVisited]);

  const advanceStage = useCallback(() => {
    if (currentStage < STAGES.length - 1) {
      const nextIdx = currentStage + 1;
      setTransition(`${STAGES[currentStage].output} → ${STAGES[nextIdx].label}`);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = setTimeout(() => {
        setTransition(null);
        setCurrentStage(nextIdx);
      }, TRANSITION_DURATION);
    } else {
      setIsPlaying(false);
      setIsComplete(true);
    }
  }, [currentStage]);

  useEffect(() => {
    if (!isPlaying || isComplete) return;
    if (transition) return;
    stageTimerRef.current = setTimeout(advanceStage, STAGE_DURATION);
    return () => { if (stageTimerRef.current) clearTimeout(stageTimerRef.current); };
  }, [isPlaying, currentStage, isComplete, transition, advanceStage]);

  useEffect(() => {
    return () => {
      if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const handleNodeClick = useCallback((idx: number) => {
    if (isPlaying) return;
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (stageTimerRef.current) clearTimeout(stageTimerRef.current);
    setTransition(null);
    setCurrentStage(idx);
    setIsComplete(false);
  }, [isPlaying]);

  const handleRecorrerTodo = useCallback(() => {
    setCurrentStage(0);
    setIsPlaying(true);
    setIsComplete(false);
    setTransition(null);
  }, []);

  function renderScene() {
    switch (currentStage) {
      case 0: return <MoleculeViewer moleculeType="dna" showLabels />;
      case 1: return <ReplicationScene />;
      case 2: return <TranscriptionScene />;
      case 3: return <TranslationScene />;
      case 4: return <FoldingScene />;
      default: return null;
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Dogma Central de la Biología Molecular</h1>
        <p className="mt-2 text-stone-500 text-sm max-w-2xl">
          El flujo de la información genética desde el ADN hasta la proteína funcional.
          Haz clic en cada etapa para explorarla o presiona &quot;Recorrer Todo&quot; para ver el proceso completo.
        </p>
      </div>

      {/* Timeline — horizontal scroll en móvil, centrado en desktop */}
      <div className="relative py-4 overflow-x-auto">
        <div className="flex items-center min-w-[520px] sm:min-w-0 sm:justify-center px-2">
          {STAGES.map((stage, idx) => {
            const isActive = currentStage === idx;
            const isVisited = visitedModules.includes('dogma-temporal') || isActive || currentStage > idx || isPlaying;
            const isPast = currentStage > idx || isComplete;
            return (
              <div key={stage.id} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => handleNodeClick(idx)}
                  disabled={isPlaying}
                  className={`flex flex-col items-center gap-2 group transition-all duration-300 ${
                    isPlaying ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-110'
                        : isPast
                          ? 'bg-emerald-500/10 border-emerald-500/40'
                          : 'bg-white/80 border-stone-300 group-hover:border-stone-400'
                    }`}
                  >
                    <stage.icon
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isActive
                          ? 'text-emerald-400'
                          : isPast
                            ? 'text-emerald-400/70'
                            : 'text-stone-400'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                      isActive ? 'text-emerald-400' : isPast ? 'text-stone-500' : 'text-stone-400'
                    }`}
                  >
                    {stage.label}
                  </span>
                </button>
                {idx < STAGES.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-colors duration-300 rounded-full ${
                    currentStage > idx || isComplete ? 'bg-emerald-500/40' : 'bg-stone-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden bg-white/70 border border-stone-200 min-h-[240px] relative">
        {transition ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#f5f0eb]/90 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="text-center px-6">
              <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">Flujo molecular</p>
              <div className="flex items-center gap-3 text-lg font-medium">
                <span className="text-emerald-400">{STAGES[currentStage].output}</span>
                <ChevronRight className="w-5 h-5 text-stone-400" />
                <span className="text-stone-700">{STAGES[currentStage + 1]?.label}</span>
              </div>
            </div>
          </div>
        ) : null}

        {isComplete ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center px-6 py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-emerald-400 mb-2">¡Recorrido completado!</h3>
              <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
                Has explorado todo el Dogma Central de la Biología Molecular, desde el ADN hasta la proteína funcional.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-lg mx-auto">
                {STAGES.map((stage, idx) => (
                  <button
                    key={stage.id}
                    onClick={() => { setIsComplete(false); setCurrentStage(idx); }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/80 border border-stone-200 hover:border-emerald-500/40 transition-colors cursor-pointer"
                  >
                    <stage.icon className="w-5 h-5 text-emerald-400" />
                    <span className="text-[11px] font-medium text-stone-600">{stage.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-56 sm:h-72 md:h-96">
            <SceneContainer>{renderScene()}</SceneContainer>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {!isPlaying ? (
          <button
            onClick={handleRecorrerTodo}
            disabled={isComplete}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-100 disabled:text-stone-400 text-white transition-colors shadow-md"
          >
            <Play className="w-4 h-4" />
            Recorrer Todo
          </button>
        ) : (
          <button
            onClick={() => setIsPlaying(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            Detener
          </button>
        )}

        <div className="text-xs text-stone-400">
          Etapa {currentStage + 1} de {STAGES.length}: <span className="text-stone-600 font-medium">{STAGES[currentStage].label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/60 border border-stone-200 p-4">
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Entrada</p>
          <p className="text-sm text-stone-700 font-medium">{STAGES[currentStage].input}</p>
        </div>
        <div className="rounded-xl bg-white/60 border border-stone-200 p-4">
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Salida</p>
          <p className="text-sm text-emerald-400 font-medium">{STAGES[currentStage].output}</p>
        </div>
      </div>
    </div>
  );
}
