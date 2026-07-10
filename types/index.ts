// ─── DNA Base Types ────────────────────────────────────────────────────────────
export type DNABase = "A" | "T" | "C" | "G";
export type TapeSymbol = DNABase | "X" | "Y" | "P" | "Q" | "▯";
export type TuringDirection = "L" | "R" | "S";
export type SimulationStatus = "idle" | "running" | "paused" | "accepted" | "rejected";
export type SimulationSpeed = 0.5 | 1 | 2 | 4;
export type AlgorithmType = "complement" | "palindrome" | "gc_content" | "repeat";

// ─── Turing Machine Types ───────────────────────────────────────────────────────
export interface TuringTransition {
  read: TapeSymbol;
  write: TapeSymbol;
  move: TuringDirection;
  nextState: string;
}

export interface TuringState {
  name: string;
  isAccept?: boolean;
  isReject?: boolean;
}

export interface TuringStep {
  stepNumber: number;
  state: string;
  head: number;
  tape: TapeSymbol[];
  symbolRead: TapeSymbol;
  symbolWritten: TapeSymbol;
  direction: TuringDirection;
  nextState: string;
  timestamp: number;
  educationalNote?: string;
}

export interface TuringMachineConfig {
  states: string[];
  alphabet: TapeSymbol[];
  transitions: Record<string, Record<string, TuringTransition>>;
  initialState: string;
  acceptStates: string[];
  rejectStates: string[];
}

// ─── Simulation Types ──────────────────────────────────────────────────────────
export interface SimulationState {
  tape: TapeSymbol[];
  head: number;
  currentState: string;
  status: SimulationStatus;
  steps: TuringStep[];
  currentStep: number;
  speed: SimulationSpeed;
  algorithm: AlgorithmType;
  sequence: string;
  startTime: number | null;
  duration: number;
  baseCount: BaseCount;
}

export interface BaseCount {
  A: number;
  T: number;
  C: number;
  G: number;
}

// ─── Statistics Types ─────────────────────────────────────────────────────────
export interface SimulationStats {
  totalSimulations: number;
  acceptedCount: number;
  rejectedCount: number;
  averageSteps: number;
  averageDuration: number;
  baseMostUsed: DNABase;
  recentActivity: ActivityEntry[];
}

export interface ActivityEntry {
  date: string;
  simulations: number;
}

// ─── Saved Simulation ────────────────────────────────────────────────────────
export interface SavedSimulation {
  id: string;
  sequence: string;
  result: "accepted" | "rejected";
  steps: number;
  duration: number;
  algorithm: string;
  baseCount: BaseCount;
  isFavorite: boolean;
  createdAt: string;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────
export interface ThemeMode {
  isDark: boolean;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

// ─── Session extension ────────────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// ─── Molecular Platform Types ─────────────────────────────────────────────────

export type ModuleId =
  | 'que-es-el-adn'
  | 'construye-tu-adn'
  | 'replicacion'
  | 'transcripcion'
  | 'traduccion'
  | 'aminoacidos'
  | 'proteinas'
  | 'mutaciones'
  | 'enfermedades'
  | 'laboratorio'
  | 'comparador'
  | 'quiz'
  | 'modelos-3d'
  | 'dogma-temporal'
  | 'evaluacion';

// Re-exported from lib/molecular/mutations.ts — single source of truth
export type { MutationType, MutationResult } from '../lib/molecular/mutations';

export interface AlignmentResult {
  seq1Aligned: string;
  seq2Aligned: string;
  matches: number;
  mismatches: number;
  gaps: number;
  alignedLength: number;
  similarityPercent: number;
}

export interface QuizQuestion {
  id: string;
  moduleId: ModuleId;
  text: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export interface QuizSessionState {
  sessionId: string;
  questions: QuizQuestion[];
  currentIdx: number;
  answers: (number | null)[];
  score: number;
  startedAt: number;
  completedAt?: number;
  timerSeconds: number;
}

export interface MolecularContextState {
  activeDNA: string;
  activeRNA: string;
  activeAminoAcids: string[];
  visitedModules: ModuleId[];
  totalTimeMs: number;
  reducedMotion: boolean;
  webGLSupported: boolean;
}

export type EvalType = 'pretest' | 'postest' | 'SUS' | 'TAM' | 'NASA_TLX';

export interface EvalSession {
  id: string;
  userId: string;
  evalType: EvalType;
  score: number;
  answers: Record<string, number | string>;
  completedAt: string;
  createdAt: string;
}

export interface PlaybackState {
  status: 'idle' | 'playing' | 'paused' | 'completed';
  speed: 0.5 | 1 | 2;
  progress: number;
}

export interface AnimationControls {
  play: () => void;
  pause: () => void;
  stepFwd: () => void;
  stepBwd: () => void;
  setSpeed: (s: 0.5 | 1 | 2) => void;
  progress: number;
  isPlaying: boolean;
}
