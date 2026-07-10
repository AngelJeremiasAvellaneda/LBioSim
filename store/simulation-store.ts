"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  SimulationState,
  SimulationStatus,
  SimulationSpeed,
  AlgorithmType,
  TuringStep,
  TapeSymbol,
} from "@/types";
import { createTuringMachine } from "@/lib/turing-machine";
import { SPEED_MS } from "@/constants";

interface SimulationStore extends SimulationState {
  // Machine instance (not serializable, kept outside state)
  _intervalId: ReturnType<typeof setInterval> | null;

  // Actions
  initialize: (sequence: string) => void;
  step: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  goToStep: (index: number) => void;
  setSpeed: (speed: SimulationSpeed) => void;
  setAlgorithm: (algorithm: AlgorithmType) => void;
  setSequence: (seq: string) => void;
}

const DEFAULT_STATE: SimulationState = {
  tape: [],
  head: 0,
  currentState: "—",
  status: "idle",
  steps: [],
  currentStep: -1,
  speed: 1,
  algorithm: "complement",
  sequence: "AATTCCGG",
  startTime: null,
  duration: 0,
  baseCount: { A: 0, T: 0, C: 0, G: 0 },
};

// Global TM instance (mutable, outside Zustand state)
let _tm: ReturnType<typeof createTuringMachine> | null = null;
let _intervalId: ReturnType<typeof setInterval> | null = null;

export const useSimulationStore = create<SimulationStore>()(
  subscribeWithSelector((set, get) => ({
    ...DEFAULT_STATE,
    _intervalId: null,

    initialize(sequence: string) {
      if (_intervalId) clearInterval(_intervalId);
      _tm = createTuringMachine(sequence, get().algorithm);
      const baseCount = _tm.countBases();
      set({
        tape: _tm.getTape(),
        head: _tm.getHead(),
        currentState: _tm.getState(),
        status: "paused",   // start paused — user controls playback
        steps: [],
        currentStep: -1,
        sequence,
        startTime: null,
        duration: 0,
        baseCount,
      });
    },

    step() {
      const state = get();
      if (!_tm || state.status === "accepted" || state.status === "rejected") return;

      // Set startTime on first manual step
      if (!state.startTime) {
        set({ startTime: Date.now() });
      }

      const { status, step } = _tm.step();
      const steps = [...get().steps, step];

      const newStatus: SimulationStatus =
        status === "accept" ? "accepted" : status === "reject" ? "rejected" : "running";

      const duration = state.startTime ? Date.now() - state.startTime : 0;

      set({
        tape: _tm.getTape(),
        head: _tm.getHead(),
        currentState: _tm.getState(),
        steps,
        currentStep: steps.length - 1,
        status: newStatus,
        duration,
      });

      if (newStatus !== "running" && _intervalId) {
        clearInterval(_intervalId);
        _intervalId = null;
        set({ status: newStatus });
      }
    },

    play() {
      const state = get();
      if (state.status === "accepted" || state.status === "rejected") return;
      if (!_tm) {
        get().initialize(state.sequence);
        // initialize sets status to paused, then we continue to start playing
      }

      const startTime = get().startTime ?? Date.now();
      set({ status: "running", startTime });
      const ms = SPEED_MS[String(state.speed)] ?? 1000;

      _intervalId = setInterval(() => {
        const s = get();
        if (s.status === "accepted" || s.status === "rejected" || s.status === "paused") {
          clearInterval(_intervalId!);
          _intervalId = null;
          return;
        }
        get().step();
      }, ms);
    },

    pause() {
      if (_intervalId) {
        clearInterval(_intervalId);
        _intervalId = null;
      }
      set({ status: "paused" });
    },

    reset() {
      if (_intervalId) {
        clearInterval(_intervalId);
        _intervalId = null;
      }
      _tm = null;
      set({ ...DEFAULT_STATE });
    },

    goToStep(index: number) {
      const { steps } = get();
      if (index < 0 || index >= steps.length) return;
      const step = steps[index];
      set({
        tape: step.tape,
        head: step.head,
        currentState: step.state,
        currentStep: index,
      });
    },

    setSpeed(speed: SimulationSpeed) {
      set({ speed });
      const state = get();
      if (state.status === "running" && _intervalId) {
        clearInterval(_intervalId);
        _intervalId = null;
        get().play();
      }
    },

    setAlgorithm(algorithm: AlgorithmType) {
      set({ algorithm });
    },

    setSequence(seq: string) {
      set({ sequence: seq });
    },
  }))
);
