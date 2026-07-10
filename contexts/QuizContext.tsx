'use client';

/**
 * contexts/QuizContext.tsx
 *
 * Contexto local para el módulo de Quiz.
 * Gestiona la sesión activa: preguntas, índice actual, respuestas,
 * puntuación y temporizador.
 *
 * Requisitos: 13.2
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { QuizQuestion } from '@/types';

interface QuizState {
  /** Identificador único de la sesión en curso */
  sessionId: string;
  /** Lista de preguntas del quiz */
  questions: QuizQuestion[];
  /** Índice de la pregunta activa (0-indexed) */
  currentIdx: number;
  /** Respuestas elegidas por el usuario (null = sin responder) */
  answers: (number | null)[];
  /** Puntuación acumulada */
  score: number;
  /** Segundos transcurridos en la sesión */
  timer: number;
}

interface QuizActions {
  setSessionId: (id: string) => void;
  setQuestions: (q: QuizQuestion[]) => void;
  setCurrentIdx: (idx: number) => void;
  setAnswers: (answers: (number | null)[]) => void;
  setScore: (score: number) => void;
  setTimer: (seconds: number) => void;
}

const QuizContext = createContext<(QuizState & QuizActions) | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);

  const value: QuizState & QuizActions = {
    sessionId,
    questions,
    currentIdx,
    answers,
    score,
    timer,
    setSessionId: useCallback((id: string) => setSessionId(id), []),
    setQuestions: useCallback((q: QuizQuestion[]) => setQuestions(q), []),
    setCurrentIdx: useCallback((i: number) => setCurrentIdx(i), []),
    setAnswers: useCallback((a: (number | null)[]) => setAnswers(a), []),
    setScore: useCallback((s: number) => setScore(s), []),
    setTimer: useCallback((t: number) => setTimer(t), []),
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizContext(): QuizState & QuizActions {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error(
      'useQuizContext debe usarse dentro de un <QuizProvider>',
    );
  }
  return ctx;
}
