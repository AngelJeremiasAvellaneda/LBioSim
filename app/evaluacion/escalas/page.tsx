'use client';

import { useState, useCallback } from 'react';
import { usePlatformStore } from '@/store/platform-store';
import { CheckCircle2 } from 'lucide-react';

type ScaleType = 'SUS' | 'TAM' | 'NASA-TLX';

interface ScaleItem {
  id: string;
  text: string;
}

const SUS_ITEMS: ScaleItem[] = [
  { id: 'sus-1', text: 'Creo que me gustaría usar este sistema con frecuencia.' },
  { id: 'sus-2', text: 'Encontré el sistema innecesariamente complejo.' },
  { id: 'sus-3', text: 'Pensé que el sistema era fácil de usar.' },
  { id: 'sus-4', text: 'Creo que necesitaría apoyo técnico para usar este sistema.' },
  { id: 'sus-5', text: 'Encontré que las funciones del sistema estaban bien integradas.' },
  { id: 'sus-6', text: 'Pensé que había demasiada inconsistencia en el sistema.' },
  { id: 'sus-7', text: 'Imagino que la mayoría de las personas aprenderían a usar este sistema rápidamente.' },
  { id: 'sus-8', text: 'Encontré el sistema muy engorroso de usar.' },
  { id: 'sus-9', text: 'Me sentí muy seguro al usar el sistema.' },
  { id: 'sus-10', text: 'Necesité aprender muchas cosas antes de poder usar el sistema.' },
];

const TAM_ITEMS: ScaleItem[] = [
  { id: 'tam-1', text: 'Usar este sistema mejora mi rendimiento en el aprendizaje.' },
  { id: 'tam-2', text: 'Usar este sistema aumenta mi productividad académica.' },
  { id: 'tam-3', text: 'Encontré el sistema útil para mi aprendizaje.' },
  { id: 'tam-4', text: 'Aprender a usar el sistema fue fácil para mí.' },
  { id: 'tam-5', text: 'Es fácil hacer que el sistema haga lo que quiero.' },
  { id: 'tam-6', text: 'Mi interacción con el sistema fue clara y comprensible.' },
];

const NASA_TLX_ITEMS: ScaleItem[] = [
  { id: 'nasa-1', text: 'Demanda Mental: ¿Cuánta actividad mental y perceptual se requirió?' },
  { id: 'nasa-2', text: 'Demanda Física: ¿Cuánta actividad física se requirió?' },
  { id: 'nasa-3', text: 'Demanda Temporal: ¿Qué presión de tiempo sentiste?' },
  { id: 'nasa-4', text: 'Esfuerzo: ¿Qué tan duro tuviste que trabajar?' },
  { id: 'nasa-5', text: 'Rendimiento: ¿Qué tan exitoso crees que fué tu desempeño?' },
  { id: 'nasa-6', text: 'Frustración: ¿Qué tan inseguro, desanimado o estresado te sentiste?' },
];

const STORAGE_PREFIX = 'scale_completed_';

function calcSUS(responses: Record<string, number>): number {
  let sum = 0;
  for (let i = 0; i < SUS_ITEMS.length; i++) {
    const val = responses[SUS_ITEMS[i].id] ?? 0;
    if (i % 2 === 0) {
      sum += val - 1;
    } else {
      sum += 5 - val;
    }
  }
  return sum * 2.5;
}

function calcTAM(responses: Record<string, number>): number {
  const vals = Object.values(responses);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function calcNASATLX(responses: Record<string, number>): number {
  const vals = Object.values(responses);
  if (vals.length === 0) return 0;
  const raw = vals.reduce((a, b) => a + b, 0) / vals.length;
  return raw;
}

export default function EscalasPage() {
  const { showToast } = usePlatformStore();

  const [activeScale, setActiveScale] = useState<ScaleType>('SUS');

  const [susResponses, setSusResponses] = useState<Record<string, number>>({});
  const [tamResponses, setTamResponses] = useState<Record<string, number>>({});
  const [nasaResponses, setNasaResponses] = useState<Record<string, number>>({});

  const [submittedScales, setSubmittedScales] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    const stored: string[] = [];
    for (const scale of ['SUS', 'TAM', 'NASA-TLX']) {
      if (localStorage.getItem(STORAGE_PREFIX + scale)) stored.push(scale);
    }
    return new Set(stored);
  });

  const [lastResult, setLastResult] = useState<{ scale: ScaleType; score: number } | null>(null);

  const currentItems = activeScale === 'SUS' ? SUS_ITEMS : activeScale === 'TAM' ? TAM_ITEMS : NASA_TLX_ITEMS;
  const currentResponses = activeScale === 'SUS' ? susResponses : activeScale === 'TAM' ? tamResponses : nasaResponses;
  const setCurrentResponses = useCallback(
    (fn: (prev: Record<string, number>) => Record<string, number>) => {
      if (activeScale === 'SUS') setSusResponses(fn);
      else if (activeScale === 'TAM') setTamResponses(fn);
      else setNasaResponses(fn);
    },
    [activeScale],
  );
  const isSubmitted = submittedScales.has(activeScale);
  const isLikert = activeScale !== 'NASA-TLX';
  const maxVal = activeScale === 'SUS' ? 5 : activeScale === 'TAM' ? 7 : 100;

  const handleSelect = useCallback(
    (itemId: string, value: number) => {
      if (isSubmitted) return;
      setCurrentResponses((prev) => ({ ...prev, [itemId]: value }));
    },
    [isSubmitted, setCurrentResponses],
  );

  const handleSubmit = useCallback(async () => {
    const allAnswered = currentItems.every((item) => currentResponses[item.id] !== undefined);
    if (!allAnswered) return;

    let score = 0;
    if (activeScale === 'SUS') score = calcSUS(currentResponses);
    else if (activeScale === 'TAM') score = calcTAM(currentResponses);
    else score = calcNASATLX(currentResponses);

    try {
      await fetch('/api/evaluation/scales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evalType: activeScale,
          responses: currentItems.map((item) => ({
            itemId: item.id,
            value: currentResponses[item.id],
          })),
          score: Math.round(score * 100) / 100,
        }),
      });
    } catch {
      showToast({ type: 'error', message: 'Error al enviar la escala.' });
      return;
    }

    setLastResult({ scale: activeScale, score: Math.round(score * 100) / 100 });
    localStorage.setItem(STORAGE_PREFIX + activeScale, 'true');
    setSubmittedScales((prev) => new Set(prev).add(activeScale));
  }, [activeScale, currentItems, currentResponses, showToast]);

  const tabs: ScaleType[] = ['SUS', 'TAM', 'NASA-TLX'];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-800">Escalas de Evaluación</h1>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveScale(tab); setLastResult(null); }}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              activeScale === tab
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            } ${submittedScales.has(tab) ? 'ring-1 ring-emerald-500' : ''}`}
          >
            {tab}
            {submittedScales.has(tab) && <CheckCircle2 className="inline-block ml-1.5 h-3.5 w-3.5 text-emerald-400" />}
          </button>
        ))}
      </div>

      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-400" />
          <p className="text-stone-600 text-lg font-medium">Escala {activeScale} completada</p>
          {lastResult && (
            <p className="text-stone-400 text-sm">
              Puntuación: <span className="text-emerald-400 font-bold">{lastResult.score}</span>
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-stone-200 bg-white/70 p-6 space-y-6">
            {currentItems.map((item) => (
              <div key={item.id}>
                <p className="text-sm text-stone-700 mb-3">{item.text}</p>
                {isLikert ? (
                  <div className="flex gap-1 sm:gap-2">
                    {Array.from({ length: maxVal }, (_, i) => i + 1).map((val) => (
                      <button
                        key={val}
                        onClick={() => handleSelect(item.id, val)}
                        className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md text-xs font-medium transition ${
                          currentResponses[item.id] === val
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                    <span className="ml-2 text-xs text-stone-400 self-center">
                      {currentResponses[item.id] ? `(${currentResponses[item.id]})` : ''}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-400 w-6 text-right">0</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={currentResponses[item.id] ?? 50}
                      onChange={(e) => handleSelect(item.id, Number(e.target.value))}
                      className="flex-1 accent-emerald-500"
                    />
                    <span className="text-xs text-stone-400 w-6">{currentResponses[item.id] ?? 50}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {lastResult && (
            <div className="rounded-lg border border-[#4caf82]/30 bg-[#b8ddc8]/40 p-4 text-center">
              <p className="text-sm text-stone-500">Puntuación de {lastResult.scale}</p>
              <p className="text-3xl font-bold text-emerald-400">{lastResult.score}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!currentItems.every((item) => currentResponses[item.id] !== undefined)}
            className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </>
      )}
    </div>
  );
}
