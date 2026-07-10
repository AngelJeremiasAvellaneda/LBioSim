"use client";

import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import { useSimulationStore } from "@/store/simulation-store";
import type { SimulationSpeed } from "@/types";

const SPEEDS: SimulationSpeed[] = [0.5, 1, 2, 4];

export function SimulationControls() {
  const { status, speed, steps, currentStep, play, pause, step, reset, setSpeed, goToStep, sequence } =
    useSimulationStore();

  const isIdle    = status === "idle";
  const isRunning = status === "running";
  const isDone    = status === "accepted" || status === "rejected";
  const canStep   = !isIdle && !isRunning && !isDone;

  const handlePlay = () => isRunning ? pause() : play();

  return (
    <div className="bg-white/80 border border-stone-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 bg-white/60">
        <span className="text-stone-600 text-sm font-semibold">Controles</span>
        {steps.length > 0 && (
          <div className="ml-auto flex items-center gap-3 text-xs text-stone-400 font-mono">
            <span>{steps.length} pasos</span>
            <span>·</span>
            <span>{sequence.length} bases</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Main buttons */}
        <div className="flex items-center gap-2">
          {/* Play / Pause */}
          <button
            onClick={handlePlay}
            disabled={isIdle || isDone}
            aria-label={isRunning ? "Pausar" : "Reproducir"}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              transition-all shadow-md flex-1 justify-center
              disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none
              ${isRunning
                ? "bg-linear-to-r from-amber-600 to-amber-500 text-white shadow-amber-500/20 hover:from-amber-500 hover:to-amber-400"
                : "bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-emerald-500/20 hover:from-emerald-500 hover:to-emerald-400"
              }`}
          >
            {isRunning ? <Pause size={15} /> : <Play size={15} />}
            {isRunning ? "Pausar" : "Reproducir"}
          </button>

          {/* Step */}
          <button
            onClick={step}
            disabled={!canStep}
            aria-label="Paso siguiente"
            title="Un paso"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm
              bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-600
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward size={15} />
            <span className="hidden sm:inline">Paso</span>
          </button>

          {/* Reset */}
          <button
            onClick={reset}
            disabled={isIdle}
            aria-label="Reiniciar"
            title="Reiniciar"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm
              bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-500
              disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <div className="text-[11px] text-stone-400 uppercase tracking-wider">Velocidad</div>
          <div className="grid grid-cols-4 gap-1.5">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                aria-pressed={speed === s}
                className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  speed === s
                    ? "bg-zinc-600 text-stone-800 shadow-sm"
                    : "bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-600 border border-stone-200"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* Scrubber */}
        {steps.length > 1 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="uppercase tracking-wider">Navegar pasos</span>
              <span className="font-mono tabular-nums">{currentStep + 1} / {steps.length}</span>
            </div>
            <input
              type="range"
              min={0}
              max={steps.length - 1}
              value={currentStep >= 0 ? currentStep : 0}
              onChange={(e) => goToStep(Number(e.target.value))}
              disabled={isRunning}
              className="w-full h-1.5 appearance-none bg-stone-100 rounded-full
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5
                [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-[#4caf82] [&::-webkit-slider-thumb]:cursor-pointer
                disabled:opacity-30 cursor-pointer accent-emerald-500"
              aria-label="Navegar pasos"
            />
          </div>
        )}
      </div>
    </div>
  );
}
