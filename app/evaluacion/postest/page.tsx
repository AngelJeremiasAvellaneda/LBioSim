'use client';

import { useState, useEffect, useCallback } from 'react';
import { selectQuizQuestions } from '@/lib/molecular/quiz';
import { QUIZ_BANK } from '@/lib/molecular/quiz-bank';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { usePlatformStore } from '@/store/platform-store';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'postest_completed';
const QUESTION_COUNT = 10;
const MIN_MODULES = 5;

export default function PostestPage() {
  const { visitedModules } = useMolecularContext();
  const { showToast } = usePlatformStore();

  const [completed, setCompleted] = useState(false);
  const [questions, setQuestions] = useState<ReturnType<typeof selectQuizQuestions>>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<{ qIdx: number; correct: boolean }[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) {
      setCompleted(true);
    }
  }, []);

  useEffect(() => {
    if (!completed && questions.length === 0 && visitedModules.length >= MIN_MODULES) {
      try {
        const qs = selectQuizQuestions(QUIZ_BANK, QUESTION_COUNT, []);
        setQuestions(qs);
      } catch {
        showToast({ type: 'error', message: 'Error al cargar las preguntas del postest.' });
      }
    }
  }, [completed, questions.length, visitedModules, showToast]);

  const handleSelect = useCallback((idx: number) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: idx }));
  }, [currentIdx]);

  const handleSubmit = useCallback(async () => {
    if (Object.keys(answers).length < QUESTION_COUNT) return;

    const computedResults = questions.map((q, i) => ({
      qIdx: i,
      correct: answers[i] === q.correctIdx,
    }));
    const computedScore = computedResults.filter((r) => r.correct).length * 10;

    try {
      await fetch('/api/evaluation/postest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: questions.map((q, i) => ({
            questionId: q.id,
            selectedIdx: answers[i],
            correct: answers[i] === q.correctIdx,
          })),
          score: computedScore,
        }),
      });
    } catch {
      showToast({ type: 'error', message: 'Error al enviar el postest.' });
      return;
    }

    setResults(computedResults);
    setScore(computedScore);
    setSubmitted(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, [answers, questions, showToast]);

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-5 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#b8ddc8] flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-[#1a5c3a]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Evaluación Final (Postest)</h1>
          <p className="text-stone-500 text-sm mt-1">Ya has completado el postest.</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <a href="/" className="rounded-xl bg-stone-100 border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-200 transition">
            Volver al inicio
          </a>
          <a href="/evaluacion/escalas" className="rounded-xl bg-[#4caf82] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3d9670] transition shadow-sm">
            Ir a Escalas →
          </a>
        </div>
      </div>
    );
  }

  if (visitedModules.length < MIN_MODULES) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-5 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#f0cc80] flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-[#7a4e00]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Evaluación Final (Postest)</h1>
          <p className="text-stone-500 text-sm mt-1 max-w-sm">
            Debes visitar al menos {MIN_MODULES} módulos antes del postest.
          </p>
          <p className="text-stone-400 text-xs mt-2">
            Módulos visitados: <strong>{visitedModules.length}</strong> / {MIN_MODULES}
          </p>
        </div>
        <div className="w-48 h-2 rounded-full bg-stone-200 overflow-hidden">
          <div className="h-full bg-[#4caf82] rounded-full transition-all" style={{ width: `${(visitedModules.length / MIN_MODULES) * 100}%` }} />
        </div>
        <a href="/" className="rounded-xl bg-stone-100 border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-200 transition">
          Explorar módulos
        </a>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="space-y-6 py-6 max-w-2xl mx-auto">
        {/* Score card */}
        <div className="rounded-2xl border border-[#4caf82]/30 bg-[#b8ddc8]/30 p-8 text-center">
          <p className="text-xs text-stone-500 uppercase tracking-wider mb-2">Puntuación Final</p>
          <p className="text-6xl font-bold text-[#1a5c3a]">{score}</p>
          <p className="text-sm text-stone-500 mt-1">de 100 puntos</p>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-[#1a5c3a]">
              <CheckCircle2 className="w-4 h-4" />
              {results.filter(r => r.correct).length} correctas
            </span>
            <span className="flex items-center gap-1.5 text-[#b84040]">
              <XCircle className="w-4 h-4" />
              {results.filter(r => !r.correct).length} incorrectas
            </span>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-stone-700">Detalle por pregunta</h2>
        <div className="space-y-2">
          {results.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                r.correct
                  ? 'border-[#4caf82]/30 bg-[#b8ddc8]/30'
                  : 'border-[#e07070]/30 bg-[#f0a8a8]/30'
              }`}
            >
              {r.correct
                ? <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1a5c3a]" />
                : <XCircle className="h-4 w-4 shrink-0 text-[#b84040]" />
              }
              <span className="text-stone-600">Pregunta {i + 1}</span>
              <span className={`ml-auto font-medium ${r.correct ? 'text-[#1a5c3a]' : 'text-[#b84040]'}`}>
                {r.correct ? '+10 pts' : '0 pts'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a href="/" className="rounded-xl bg-stone-100 border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-200 transition">
            Volver al inicio
          </a>
          <a href="/evaluacion/escalas" className="rounded-xl bg-[#4caf82] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3d9670] transition shadow-sm">
            Continuar a Escalas →
          </a>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-stone-400">Cargando preguntas...</p>
      </div>
    );
  }

  const q = questions[currentIdx];
  const unansweredCount = QUESTION_COUNT - Object.keys(answers).length;
  const allAnswered = unansweredCount === 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-800">Evaluación Final (Postest)</h1>

      <div className="flex items-center justify-between text-sm">
        <span className="text-stone-400">Pregunta {currentIdx + 1} de {QUESTION_COUNT}</span>
        <span className="text-stone-400">
          Sin responder: <span className="text-amber-400 font-medium">{unansweredCount}</span>
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${(Object.keys(answers).length / QUESTION_COUNT) * 100}%` }}
        />
      </div>

      <div className="rounded-lg border border-stone-200 bg-white/70 p-6">
        <p className="text-base text-stone-700 mb-6">{q.text}</p>
        <div className="space-y-2">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${
                answers[currentIdx] === idx
                  ? 'border-[#4caf82] bg-[#b8ddc8]/50 text-[#0f3d28] font-medium'
                  : 'border-stone-300 bg-white text-stone-600 hover:border-stone-400 hover:bg-stone-50'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  answers[currentIdx] === idx
                    ? 'border-emerald-400'
                    : 'border-stone-400'
                }`}
              >
                {answers[currentIdx] === idx && (
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                )}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
          disabled={currentIdx === 0}
          className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-600 transition hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Anterior
        </button>

        {currentIdx < QUESTION_COUNT - 1 ? (
          <button
            onClick={() => setCurrentIdx((p) => Math.min(QUESTION_COUNT - 1, p + 1))}
            disabled={answers[currentIdx] === undefined}
            className="rounded-md bg-stone-200 px-4 py-2 text-sm text-stone-700 transition hover:bg-stone-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        )}
      </div>
    </div>
  );
}
