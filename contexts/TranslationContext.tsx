'use client';

/**
 * contexts/TranslationContext.tsx
 *
 * Contexto local para el módulo de Traducción.
 * Gestiona la secuencia de ARNm, el codón actual, el polipéptido construido
 * y el estado de reproducción.
 *
 * Requisitos: 6.1–6.3
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { PlaybackState } from '@/types';

interface TranslationState {
  /** Secuencia de ARNm que se traduce */
  rnaSequence: string;
  /** Índice del codón que se está procesando (0-indexed) */
  currentCodonIdx: number;
  /** Cadena de polipéptido construida (aminoácidos en código de una letra) */
  polypeptide: string;
  /** Estado de reproducción de la animación */
  playbackState: PlaybackState;
}

interface TranslationActions {
  setRnaSequence: (seq: string) => void;
  setCurrentCodonIdx: (idx: number) => void;
  setPolypeptide: (peptide: string) => void;
  setPlaybackState: (state: PlaybackState) => void;
}

const defaultPlayback: PlaybackState = {
  status: 'idle',
  speed: 1,
  progress: 0,
};

const TranslationContext = createContext<
  (TranslationState & TranslationActions) | null
>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [rnaSequence, setRnaSequence] = useState('');
  const [currentCodonIdx, setCurrentCodonIdx] = useState(0);
  const [polypeptide, setPolypeptide] = useState('');
  const [playbackState, setPlaybackState] =
    useState<PlaybackState>(defaultPlayback);

  const value: TranslationState & TranslationActions = {
    rnaSequence,
    currentCodonIdx,
    polypeptide,
    playbackState,
    setRnaSequence: useCallback((s: string) => setRnaSequence(s), []),
    setCurrentCodonIdx: useCallback((i: number) => setCurrentCodonIdx(i), []),
    setPolypeptide: useCallback((p: string) => setPolypeptide(p), []),
    setPlaybackState: useCallback((s: PlaybackState) => setPlaybackState(s), []),
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext(): (TranslationState & TranslationActions) | null {
  const ctx = useContext(TranslationContext);
  return ctx;
}
