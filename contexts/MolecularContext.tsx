'use client';

/**
 * contexts/MolecularContext.tsx
 *
 * Contexto global que persiste datos entre módulos moleculares.
 * La secuencia del módulo de Transcripción fluye hacia Traducción y luego hacia Proteínas.
 *
 * Se coloca en `app/modulos/layout.tsx` para envolver todos los módulos.
 *
 * Requisitos: 16.2, 18.6
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { ModuleId } from '@/types';
import type { AminoAcid } from '@/lib/molecular/translation';
import { checkWebGLSupport } from '@/lib/webgl-support';
import { saveLocalProgress, getLocalProgress } from '@/lib/local-progress';

// ─── State ──────────────────────────────────────────────────────────────────────

interface MolecularState {
  /** Secuencia de ADN activa en el pipeline */
  activeDNA: string;
  /** Secuencia de ARNm activa */
  activeRNA: string;
  /** Aminoácidos resultantes de la traducción activa */
  activeAminoAcids: AminoAcid[];
  /** Módulos visitados por el estudiante */
  visitedModules: ModuleId[];
  /** Tiempo total acumulado en milisegundos */
  totalTimeMs: number;
  /** Si el usuario prefiere movimiento reducido */
  reducedMotion: boolean;
  /** Si el navegador soporta WebGL */
  webGLSupported: boolean;
}

// ─── Actions ────────────────────────────────────────────────────────────────────

interface MolecularActions {
  setActiveDNA: (seq: string) => void;
  setActiveRNA: (seq: string) => void;
  setAminoAcids: (aas: AminoAcid[]) => void;
  markModuleVisited: (id: ModuleId) => void;
  setWebGLSupported: (v: boolean) => void;
}

// ─── Reducer ────────────────────────────────────────────────────────────────────

type MolecularAction =
  | { type: 'SET_DNA'; payload: string }
  | { type: 'SET_RNA'; payload: string }
  | { type: 'SET_AMINO_ACIDS'; payload: AminoAcid[] }
  | { type: 'MARK_MODULE_VISITED'; payload: ModuleId }
  | { type: 'SET_WEBGL'; payload: boolean }
  | { type: 'SET_REDUCED_MOTION'; payload: boolean }
  | { type: 'HYDRATE'; payload: Partial<MolecularState> };

const initialState: MolecularState = {
  activeDNA: '',
  activeRNA: '',
  activeAminoAcids: [],
  visitedModules: [],
  totalTimeMs: 0,
  reducedMotion: false,
  webGLSupported: true,
};

function molecularReducer(
  state: MolecularState,
  action: MolecularAction,
): MolecularState {
  switch (action.type) {
    case 'SET_DNA':
      return { ...state, activeDNA: action.payload };
    case 'SET_RNA':
      return { ...state, activeRNA: action.payload };
    case 'SET_AMINO_ACIDS':
      return { ...state, activeAminoAcids: action.payload };
    case 'MARK_MODULE_VISITED': {
      if (state.visitedModules.includes(action.payload)) return state;
      const visitedModules = [...state.visitedModules, action.payload];
      return { ...state, visitedModules };
    }
    case 'SET_WEBGL':
      return { ...state, webGLSupported: action.payload };
    case 'SET_REDUCED_MOTION':
      return { ...state, reducedMotion: action.payload };
    case 'HYDRATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────────

const MolecularContext = createContext<
  (MolecularState & MolecularActions) | null
>(null);

// ─── Provider ───────────────────────────────────────────────────────────────────

interface MolecularProviderProps {
  children: ReactNode;
}

export function MolecularProvider({ children }: MolecularProviderProps) {
  const [state, dispatch] = useReducer(molecularReducer, initialState);

  // Detectar WebGL support al montar
  useEffect(() => {
    const supported = checkWebGLSupport();
    dispatch({ type: 'SET_WEBGL', payload: supported });
  }, []);

  // Detectar prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    dispatch({ type: 'SET_REDUCED_MOTION', payload: mq.matches });

    const handler = (e: MediaQueryListEvent) => {
      dispatch({ type: 'SET_REDUCED_MOTION', payload: e.matches });
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Hidratar desde localStorage (usuarios anónimos)
  useEffect(() => {
    const local = getLocalProgress();
    if (local && local.visitedModules && local.visitedModules.length > 0) {
      dispatch({
        type: 'HYDRATE',
        payload: {
          visitedModules: local.visitedModules as ModuleId[],
          totalTimeMs: local.totalTimeMs ?? 0,
        },
      });
    }
  }, []);

  // Persistir visitedModules a localStorage cuando cambian
  useEffect(() => {
    if (state.visitedModules.length > 0) {
      saveLocalProgress({
        visitedModules: state.visitedModules,
        totalTimeMs: state.totalTimeMs,
        savedAt: new Date().toISOString(),
      });
    }
  }, [state.visitedModules, state.totalTimeMs]);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const setActiveDNA = useCallback((seq: string) => {
    dispatch({ type: 'SET_DNA', payload: seq });
  }, []);

  const setActiveRNA = useCallback((seq: string) => {
    dispatch({ type: 'SET_RNA', payload: seq });
  }, []);

  const setAminoAcids = useCallback((aas: AminoAcid[]) => {
    dispatch({ type: 'SET_AMINO_ACIDS', payload: aas });
  }, []);

  const markModuleVisited = useCallback((id: ModuleId) => {
    dispatch({ type: 'MARK_MODULE_VISITED', payload: id });
  }, []);

  const setWebGLSupported = useCallback((v: boolean) => {
    dispatch({ type: 'SET_WEBGL', payload: v });
  }, []);

  const value: MolecularState & MolecularActions = {
    ...state,
    setActiveDNA,
    setActiveRNA,
    setAminoAcids,
    markModuleVisited,
    setWebGLSupported,
  };

  return (
    <MolecularContext.Provider value={value}>
      {children}
    </MolecularContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

/**
 * Hook para acceder al contexto molecular compartido.
 * Debe usarse dentro de un `<MolecularProvider>`.
 */
export function useMolecularContext(): MolecularState & MolecularActions {
  const ctx = useContext(MolecularContext);
  if (!ctx) {
    throw new Error(
      'useMolecularContext debe usarse dentro de un <MolecularProvider>',
    );
  }
  return ctx;
}
