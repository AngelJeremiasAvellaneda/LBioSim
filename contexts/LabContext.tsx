'use client';

/**
 * contexts/LabContext.tsx
 *
 * Contexto local para el módulo de Laboratorio Virtual.
 * Gestiona la secuencia de entrada, las secuencias guardadas,
 * los resultados de análisis y la salida de la operación actual.
 *
 * Requisitos: 11.1–11.3
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { SavedSeq } from '@/lib/lab/virtual-lab';

interface LabState {
  /** Secuencia ADN/ARN introducida por el usuario */
  inputSequence: string;
  /** Secuencias guardadas en el laboratorio */
  savedSequences: SavedSeq[];
  /** Resultados generales de análisis (puede ser cualquier dato serializable) */
  results: unknown;
  /** Salida de la última operación ejecutada */
  operationOutput: string;
}

interface LabActions {
  setInputSequence: (seq: string) => void;
  setSavedSequences: (seqs: SavedSeq[]) => void;
  setResults: (results: unknown) => void;
  setOperationOutput: (output: string) => void;
}

const LabContext = createContext<(LabState & LabActions) | null>(null);

export function LabProvider({ children }: { children: ReactNode }) {
  const [inputSequence, setInputSequence] = useState('');
  const [savedSequences, setSavedSequences] = useState<SavedSeq[]>([]);
  const [results, setResults] = useState<unknown>(null);
  const [operationOutput, setOperationOutput] = useState('');

  const value: LabState & LabActions = {
    inputSequence,
    savedSequences,
    results,
    operationOutput,
    setInputSequence: useCallback((s: string) => setInputSequence(s), []),
    setSavedSequences: useCallback((s: SavedSeq[]) => setSavedSequences(s), []),
    setResults: useCallback((r: unknown) => setResults(r), []),
    setOperationOutput: useCallback((o: string) => setOperationOutput(o), []),
  };

  return (
    <LabContext.Provider value={value}>
      {children}
    </LabContext.Provider>
  );
}

export function useLabContext(): LabState & LabActions {
  const ctx = useContext(LabContext);
  if (!ctx) {
    throw new Error(
      'useLabContext debe usarse dentro de un <LabProvider>',
    );
  }
  return ctx;
}
