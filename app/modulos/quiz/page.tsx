'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { selectQuizQuestions } from '@/lib/molecular/quiz';
import { QUIZ_BANK } from '@/lib/molecular/quiz-bank';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { usePlatformStore } from '@/store/platform-store';
import type { QuizQuestion } from '@/types';
import { Play, CheckCircle2, XCircle, Clock, Award } from 'lucide-react';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function QuizPage() {
  const { markModuleVisited } = useMolecularContext();
  const { showToast } = usePlatformStore();

  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [results, setResults] = useState<{ qIdx: number; correct: boolean }[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    markModuleVisited('quiz');
  }, [markModuleVisited]);

  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleStart = useCallback(() => {
    try {
      const qs = selectQuizQuestions(QUIZ_BANK, 10, []);
      setQuestions(qs);
      setCurrentIdx(0);
      setSelectedIdx(null);
      setAnswered(false);
      setScore(0);
      setCorrectCount(0);
      setIncorrectCount(0);
      setElapsed(0);
      setResults([]);
      setPhase('playing');
    } catch {
      showToast({ type: 'error', message: 'Error al generar el quiz. Intenta de nuevo.' });
    }
  }, [showToast]);

  const handleSelect = useCallback((idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
  }, [answered]);

  const handleNext = useCallback(() => {
    if (selectedIdx === null) return;

    const q = questions[currentIdx];
    const isCorrect = selectedIdx === q.correctIdx;
    const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
    const newIncorrectCount = incorrectCount + (isCorrect ? 0 : 1);
    const newScore = score + (isCorrect ? 10 : 0);

    setResults((prev) => [...prev, { qIdx: currentIdx, correct: isCorrect }]);
    setCorrectCount(newCorrectCount);
    setIncorrectCount(newIncorrectCount);
    setScore(newScore);
    setAnswered(true);

    setTimeout(() => {
      if (currentIdx + 1 >= questions.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('done');
      } else {
        setCurrentIdx((prev) => prev + 1);
        setSelectedIdx(null);
        setAnswered(false);
      }
    }, 1500);
  }, [selectedIdx, questions, currentIdx, correctCount, incorrectCount, score]);

  const isCorrectAnswer = answered && selectedIdx !== null
    ? selectedIdx === questions[currentIdx]?.correctIdx
    : null;

  if (phase === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-20 space-y-6 text-center px-4">
        <h1 className="text-2xl font-bold text-stone-800">Quiz de Biología Molecular</h1>
        <p className="text-stone-400 text-sm max-w-md">
          Pon a prueba tus conocimientos con 10 preguntas de opción múltiple sobre biología molecular.
          Cada respuesta correcta vale 10 puntos.
        </p>
        <button
          onClick={handleStart}
          aria-label="Iniciar quiz"
          className="flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          <Play className="h-5 w-5" />
          Iniciar Quiz
        </button>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="space-y-5 py-6">
        <div className="flex items-center gap-3">
          <Award className="h-7 w-7 text-emerald-400" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-800">Quiz Completado</h1>
            <p className="text-sm text-stone-400">Has finalizado el quiz de biología molecular</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-stone-200 bg-white/70 p-3 sm:p-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{score}</p>
            <p className="text-xs text-stone-400 mt-1">Puntuación</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white/70 p-3 sm:p-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{correctCount}</p>
            <p className="text-xs text-stone-400 mt-1">Correctas</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white/70 p-3 sm:p-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-red-400">{incorrectCount}</p>
            <p className="text-xs text-stone-400 mt-1">Incorrectas</p>
          </div>
          <div className="rounded-lg border border-stone-200 bg-white/70 p-3 sm:p-4 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-stone-600">{formatTime(elapsed)}</p>
            <p className="text-xs text-stone-400 mt-1">Tiempo</p>
          </div>
        </div>

        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={i} className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${r.correct ? 'border-[#4caf82]/30 bg-[#b8ddc8]/40' : 'border-[#e07070]/40 bg-[#f0a8a8]/40'}`}>
              {r.correct ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-red-400" />
              )}
              <span className="text-stone-500">Pregunta {i + 1}</span>
              <span className={r.correct ? 'text-emerald-400' : 'text-red-400'}>
                {r.correct ? 'Correcta (+10)' : 'Incorrecta'}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          aria-label="Intentar el quiz de nuevo"
          className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-800">Quiz de Biología Molecular</h1>
          <p className="text-sm text-stone-400 mt-1">Pregunta {currentIdx + 1} de {questions.length}</p>
        </div>
        <div className="flex items-center gap-4 text-sm shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Award className="h-4 w-4" />
            {score} pts
          </span>
          <span className="flex items-center gap-1.5 text-stone-500">
            <Clock className="h-4 w-4" />
            {formatTime(elapsed)}
          </span>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="rounded-lg border border-stone-200 bg-white/70 p-6">
        <p className="text-base text-stone-700 mb-6">{q.text}</p>

        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            let borderClass = 'border-stone-300 hover:border-stone-400';
            let bgClass = 'bg-white';
            let textClass = 'text-stone-600';
            let radioClass = 'border-stone-400';

            if (answered) {
              if (idx === q.correctIdx) {
                borderClass = 'border-emerald-500';
                bgClass = 'bg-[#b8ddc8]/40';
                textClass = 'text-emerald-300';
                radioClass = 'border-emerald-400 bg-emerald-400';
              } else if (idx === selectedIdx && idx !== q.correctIdx) {
                borderClass = 'border-red-500';
                bgClass = 'bg-[#f0a8a8]/40';
                textClass = 'text-red-300';
                radioClass = 'border-red-400 bg-red-400';
              } else {
                borderClass = 'border-stone-300';
                radioClass = 'border-stone-400';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                role="radio"
                aria-checked={selectedIdx === idx}
                aria-label={`Opción ${idx + 1}: ${opt}`}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${borderClass} ${bgClass} ${textClass} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${radioClass} ${selectedIdx === idx && !answered ? 'border-emerald-400' : ''}`}>
                  {selectedIdx === idx && !answered && <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />}
                  {answered && idx === q.correctIdx && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  {answered && idx === selectedIdx && idx !== q.correctIdx && <XCircle className="h-4 w-4 text-red-400" />}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {answered && (
        <div className={`rounded-lg border p-4 ${isCorrectAnswer ? 'border-[#4caf82]/30 bg-[#b8ddc8]/40' : 'border-[#e07070]/40 bg-[#f0a8a8]/40'}`}>
          <p className={`text-sm font-medium mb-1 ${isCorrectAnswer ? 'text-emerald-400' : 'text-red-400'}`}>
            {isCorrectAnswer ? '✓ Correcto' : '✗ Incorrecto'}
          </p>
          <p className="text-sm text-stone-500">{q.explanation}</p>
        </div>
      )}

      {!answered && selectedIdx !== null && (
        <button
          onClick={handleNext}
          aria-label="Siguiente pregunta"
          className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          Siguiente
        </button>
      )}
    </div>
  );
}
