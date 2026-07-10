"use client";

import { useSimulationStore } from "@/store/simulation-store";
import { BASE_COLORS } from "@/constants";
import { useSaveSimulation } from "@/hooks/useSaveSimulation";
import { Save, Check, Loader2, AlertCircle } from "lucide-react";
import type { DNABase } from "@/types";

const STATUS_LABEL: Record<string, { label: string; dot: string }> = {
  idle:     { label: "En espera",   dot: "bg-zinc-600" },
  paused:   { label: "Pausado",     dot: "bg-amber-500" },
  running:  { label: "Ejecutando",  dot: "bg-emerald-400 animate-pulse" },
  accepted: { label: "Aceptada",    dot: "bg-emerald-500" },
  rejected: { label: "Rechazada",   dot: "bg-red-500" },
};

export function StateDisplay() {
  const { currentState, status, steps, currentStep, baseCount } = useSimulationStore();
  const { save, saveState } = useSaveSimulation();

  const stepData = currentStep >= 0 ? steps[currentStep] : null;
  const isDone   = status === "accepted" || status === "rejected";
  const st       = STATUS_LABEL[status] ?? STATUS_LABEL.idle;

  const SaveIcon = saveState === "saving" ? Loader2 : saveState === "saved" ? Check : saveState === "error" ? AlertCircle : Save;

  return (
    <div className="bg-white/80 border border-stone-200 rounded-2xl overflow-hidden">
      {/* Header: status + state */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-200 bg-white/60">
        <div className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
        <span className="text-stone-500 text-xs">{st.label}</span>
        <div className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
          currentState === "q_accept" ? "bg-[#b8ddc8] border-[#4caf82]/40 text-[#1a5c3a]" :
          currentState === "q_reject" ? "bg-[#f0a8a8] border-[#e07070]/40 text-[#7a1a1a]" :
          "bg-stone-100 border-stone-300 text-stone-600"
        }`}>
          {currentState}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Save button */}
        {isDone && (
          <button
            onClick={save}
            disabled={saveState === "saving" || saveState === "saved"}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm
              font-semibold transition-all border ${
              saveState === "saved"  ? "bg-[#b8ddc8] border-[#4caf82]/40 text-[#1a5c3a] cursor-default" :
              saveState === "error"  ? "bg-[#f0a8a8] border-[#e07070]/40 text-[#7a1a1a]" :
              "bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-600"
            }`}
          >
            <SaveIcon size={14} className={saveState === "saving" ? "animate-spin" : ""} />
            {saveState === "saved" ? "Guardado" : saveState === "error" ? "Error al guardar" : "Guardar simulación"}
          </button>
        )}

        {/* Transition detail */}
        {stepData && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Leyó",     value: stepData.symbolRead,    colored: true  },
              { label: "Escribió", value: stepData.symbolWritten, colored: false },
              { label: "Movió",    value: stepData.direction === "R" ? "▶" : stepData.direction === "L" ? "◀" : "●", colored: false },
            ].map(({ label, value, colored }) => (
              <div key={label} className="bg-stone-100 rounded-xl p-2.5 text-center border border-stone-300">
                <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">{label}</div>
                <div
                  className="font-mono font-bold text-lg leading-none"
                  style={colored ? { color: BASE_COLORS[value as DNABase] ?? "#a1a1aa" } : { color: "#d4d4d8" }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Educational note */}
        {stepData?.educationalNote && (
          <div className="bg-stone-100/60 border border-stone-300 rounded-xl p-3">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider mb-1.5">Nota educativa</div>
            <p className="text-xs text-stone-500 leading-relaxed">{stepData.educationalNote}</p>
          </div>
        )}

        {/* Base count */}
        {(baseCount.A + baseCount.T + baseCount.C + baseCount.G) > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider">Composición</div>
            <div className="grid grid-cols-4 gap-1.5">
              {(["A","T","C","G"] as DNABase[]).map((base) => (
                <div key={base} className="bg-stone-100 border border-stone-300 rounded-xl p-2 text-center">
                  <div className="font-mono font-bold text-sm" style={{ color: BASE_COLORS[base] }}>{base}</div>
                  <div className="text-stone-600 text-sm font-mono tabular-nums">{baseCount[base]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
