'use client';

/**
 * contexts/TranscriptionContext.tsx
 *
 * Contexto local para el módulo de Transcripción.
 * Gestiona la secuencia molde, el ARNm construido, el índice de nucleótido
 * actual y el estado de reproducción.
 *
 * Requisitos: 5.2–5.3
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { PlaybackState } from '@/types';

interface TranscriptionState {
  /** Secuencia ADN molde (5'→3') */
  templateSequence: string;
  /** ARNm construido hasta el momento */
  mRNABuilt: string;
  /** Índice del nucleótido que se está incorporando (0-indexed) */
  currentNtIndex: number;
  /** Estado de reproducción de la animación */
  playbackState: PlaybackState;
}

interface TranscriptionActions {
  setTemplateSequence: (seq: string) => void;
  setMRNABuilt: (mrna: string) => void;
  setCurrentNtIndex: (idx: number) => void;
  setPlaybackState: (state: PlaybackState) => void;
}

const defaultPlayback: PlaybackState = {
  status: 'idle',
  speed: 1,
  progress: 0,
};

const TranscriptionContext = createContext<
  (TranscriptionState & TranscriptionActions) | null
>(null);

export function TranscriptionProvider({ children }: { children: ReactNode }) {
  const [templateSequence, setTemplateSequence] = useState('');
  const [mRNABuilt, setMRNABuilt] = useState('');
  const [currentNtIndex, setCurrentNtIndex] = useState(0);
  const [playbackState, setPlaybackState] =
    useState<PlaybackState>(defaultPlayback);

  const value: TranscriptionState & TranscriptionActions = {
    templateSequence,
    mRNABuilt,
    currentNtIndex,
    playbackState,
    setTemplateSequence: useCallback((s: string) => setTemplateSequence(s), []),
    setMRNABuilt: useCallback((s: string) => setMRNABuilt(s), []),
    setCurrentNtIndex: useCallback((i: number) => setCurrentNtIndex(i), []),
    setPlaybackState: useCallback((s: PlaybackState) => setPlaybackState(s), []),
  };

  return (
    <TranscriptionContext.Provider value={value}>
      {children}
    </TranscriptionContext.Provider>
  );
}

export function useTranscriptionContext(): (TranscriptionState & TranscriptionActions) | null {
  const ctx = useContext(TranscriptionContext);
  return ctx;
}
