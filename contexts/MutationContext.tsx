'use client';

/**
 * contexts/MutationContext.tsx
 *
 * Contexto local para el módulo de Mutaciones.
 * Gestiona la secuencia original, la secuencia mutada, la posición del cambio,
 * el tipo de mutación y el resultado de la comparación.
 *
 * Requisitos: 9.1–9.4
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { MutationType, MutationResult } from '@/types';

interface MutationState {
  /** Secuencia ADN original */
  originalSeq: string;
  /** Secuencia ADN tras la mutación */
  mutatedSeq: string;
  /** Posición 0-indexed de la mutación */
  position: number;
  /** Tipo de mutación clasificado (null si aún no se ha clasificado) */
  mutationType: MutationType | null;
  /** Resultado detallado de la comparación (null si no hay análisis) */
  comparison: MutationResult | null;
}

interface MutationActions {
  setOriginalSeq: (seq: string) => void;
  setMutatedSeq: (seq: string) => void;
  setPosition: (pos: number) => void;
  setMutationType: (type: MutationType | null) => void;
  setComparison: (result: MutationResult | null) => void;
}

const MutationContext = createContext<(MutationState & MutationActions) | null>(null);

export function MutationProvider({ children }: { children: ReactNode }) {
  const [originalSeq, setOriginalSeq] = useState('');
  const [mutatedSeq, setMutatedSeq] = useState('');
  const [position, setPosition] = useState(0);
  const [mutationType, setMutationType] = useState<MutationType | null>(null);
  const [comparison, setComparison] = useState<MutationResult | null>(null);

  const value: MutationState & MutationActions = {
    originalSeq,
    mutatedSeq,
    position,
    mutationType,
    comparison,
    setOriginalSeq: useCallback((s: string) => setOriginalSeq(s), []),
    setMutatedSeq: useCallback((s: string) => setMutatedSeq(s), []),
    setPosition: useCallback((p: number) => setPosition(p), []),
    setMutationType: useCallback((t: MutationType | null) => setMutationType(t), []),
    setComparison: useCallback((r: MutationResult | null) => setComparison(r), []),
  };

  return (
    <MutationContext.Provider value={value}>
      {children}
    </MutationContext.Provider>
  );
}

export function useMutationContext(): MutationState & MutationActions {
  const ctx = useContext(MutationContext);
  if (!ctx) {
    throw new Error(
      'useMutationContext debe usarse dentro de un <MutationProvider>',
    );
  }
  return ctx;
}
