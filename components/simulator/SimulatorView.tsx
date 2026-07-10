"use client";

import {
  SequenceInput,
  AlgorithmSelector,
  TapeDisplay,
  SimulationControls,
  StateDisplay,
  StepHistory,
  BaseInfoPanel,
} from "@/components/simulator";
import { DNAViewer } from "@/components/dna3d";

export function SimulatorView() {
  return (
    <div className="space-y-6">

      {/* Hero heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-800 tracking-tight">
          Simulador de Máquina de Turing
        </h1>
        <p className="text-sm text-stone-400">
          Analiza secuencias de ADN paso a paso. Visualiza cada transición en la cinta y en la hélice 3D.
        </p>
      </div>

      {/* Main grid: sidebar | stage */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">

        {/* ── Sidebar ──────────────────────────────────── */}
        <aside className="space-y-3">
          <SequenceInput />
          <AlgorithmSelector />
          <BaseInfoPanel />
        </aside>

        {/* ── Stage ────────────────────────────────────── */}
        <div className="space-y-3">

          {/* 3D viewer */}
          <DNAViewer />

          {/* Tape */}
          <TapeDisplay />

          {/* Controls + State row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SimulationControls />
            <StateDisplay />
          </div>

          {/* Step history */}
          <StepHistory />
        </div>
      </div>
    </div>
  );
}
