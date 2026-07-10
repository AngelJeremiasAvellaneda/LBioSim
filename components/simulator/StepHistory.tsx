"use client";

import { useRef, useEffect } from "react";
import { useSimulationStore } from "@/store/simulation-store";
import { BASE_COLORS } from "@/constants";
import type { DNABase } from "@/types";

export function StepHistory() {
  const { steps, currentStep, goToStep, status } = useSimulationStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const isRunning = status === "running";

  // Scroll DENTRO del contenedor — sin tocar la página
  useEffect(() => {
    const container = containerRef.current;
    if (!container || currentStep < 0) return;

    const item = container.querySelector<HTMLElement>(`[data-step="${currentStep}"]`);
    if (!item) return;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;
    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;

    if (itemBottom > containerBottom) {
      container.scrollTop = itemBottom - container.clientHeight + 8;
    } else if (itemTop < containerTop) {
      container.scrollTop = itemTop - 8;
    }
    // Si ya es visible, no hace nada
  }, [currentStep]);

  if (steps.length === 0) {
    return (
      <div className="bg-white/80 border border-stone-200 rounded-2xl p-5 flex items-center justify-center min-h-20">
        <p className="text-stone-400 text-sm">El historial aparecerá aquí</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 border border-stone-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <span className="text-stone-600 text-sm font-semibold">Historial de transiciones</span>
          <span className="bg-stone-100 text-stone-400 text-xs font-mono px-2 py-0.5 rounded-full">
            {steps.length}
          </span>
        </div>
        <span className="text-xs text-stone-400 font-mono tabular-nums">
          paso {Math.max(0, currentStep + 1)} / {steps.length}
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[2rem_5rem_2rem_1rem_2rem_1rem_1.5rem_1fr] gap-x-2
        px-4 py-1.5 border-b border-stone-200 text-[10px] text-stone-400 uppercase tracking-wider font-mono">
        <span className="text-right">#</span>
        <span>Estado</span>
        <span className="text-center">Leyó</span>
        <span className="text-center text-stone-500">/</span>
        <span className="text-center">Escr.</span>
        <span className="text-center text-stone-500">/</span>
        <span className="text-center">Dir</span>
        <span />
      </div>

      {/* Rows */}
      <div
        ref={containerRef}
        className="overflow-y-auto"
        style={{ maxHeight: "14rem" }}
        role="list"
        aria-label="Historial de pasos"
      >
        {steps.map((s, i) => {
          const isActive = i === currentStep;
          const isFinal = i === steps.length - 1 && (status === "accepted" || status === "rejected");
          const readColor = BASE_COLORS[s.symbolRead as DNABase] ?? "#71717a";

          return (
            <button
              key={i}
              data-step={i}
              onClick={() => !isRunning && goToStep(i)}
              disabled={isRunning}
              role="listitem"
              aria-current={isActive ? "true" : undefined}
              className={`w-full text-left transition-colors duration-100 ${
                isActive
                  ? "bg-stone-200 border-l-2 border-emerald-500"
                  : "border-l-2 border-transparent hover:bg-stone-100"
              } ${isRunning ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="grid grid-cols-[2rem_5rem_2rem_1rem_2rem_1rem_1.5rem_1fr] gap-x-2
                items-center px-4 py-1.5 text-xs font-mono">

                {/* Step # */}
                <span className={`text-right tabular-nums ${isActive ? "text-stone-600" : "text-stone-400"}`}>
                  {s.stepNumber}
                </span>

                {/* State */}
                <span className={`truncate ${
                  s.nextState === "q_accept" ? "text-emerald-400" :
                  s.nextState === "q_reject" ? "text-red-400" :
                  isActive ? "text-stone-700" : "text-stone-400"
                }`}>
                  {s.state}
                </span>

                {/* Read */}
                <span className="font-bold text-center" style={{ color: readColor }}>
                  {s.symbolRead}
                </span>

                <span className="text-stone-500 text-center">/</span>

                {/* Write */}
                <span className={`text-center ${isActive ? "text-stone-700" : "text-stone-400"}`}>
                  {s.symbolWritten}
                </span>

                <span className="text-stone-500 text-center">/</span>

                {/* Direction */}
                <span className={`text-center ${isActive ? "text-stone-600" : "text-stone-400"}`}>
                  {s.direction === "R" ? "▶" : s.direction === "L" ? "◀" : "●"}
                </span>

                {/* Final badge */}
                <span className="text-right">
                  {isFinal && (
                    <span className={`text-xs font-bold ${
                      status === "accepted" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {status === "accepted" ? "✓" : "✗"}
                    </span>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
