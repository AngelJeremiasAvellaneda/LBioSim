'use client';

/**
 * contexts/ReplicationContext.tsx
 *
 * Contexto local para el módulo de Replicación del ADN.
 * Gestiona la secuencia molde, el estado de reproducción y el paso actual.
 *
 * Requisitos: 4.2–4.4
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { PlaybackState } from '@/types';

interface ReplicationState {
  /** Secuencia ADN molde */
  templateSequence: string;
  /** Estado de reproducción de la animación */
  playbackState: PlaybackState;
  /** Paso actual de la animación (0-indexed) */
  currentStep: number;
  /** Velocidad de reproducción */
  speed: 0.5 | 1 | 2;
}

interface ReplicationActions {
  setTemplateSequence: (seq: string) => void;
  setPlaybackState: (state: PlaybackState) => void;
  setCurrentStep: (step: number) => void;
  setSpeed: (speed: 0.5 | 1 | 2) => void;
}

const defaultPlayback: PlaybackState = {
  status: 'idle',
  speed: 1,
  progress: 0,
};

const ReplicationContext = createContext<
  (ReplicationState & ReplicationActions) | null
>(null);

export function ReplicationProvider({ children }: { children: ReactNode }) {
  const [templateSequence, setTemplateSequence] = useState('');
  const [playbackState, setPlaybackState] =
    useState<PlaybackState>(defaultPlayback);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);

  const value: ReplicationState & ReplicationActions = {
    templateSequence,
    playbackState,
    currentStep,
    speed,
    setTemplateSequence: useCallback((s: string) => setTemplateSequence(s), []),
    setPlaybackState: useCallback((s: PlaybackState) => setPlaybackState(s), []),
    setCurrentStep: useCallback((s: number) => setCurrentStep(s), []),
    setSpeed: useCallback((s: 0.5 | 1 | 2) => setSpeed(s), []),
  };

  return (
    <ReplicationContext.Provider value={value}>
      {children}
    </ReplicationContext.Provider>
  );
}

export function useReplicationContext(): (ReplicationState & ReplicationActions) | null {
  const ctx = useContext(ReplicationContext);
  return ctx;
}
