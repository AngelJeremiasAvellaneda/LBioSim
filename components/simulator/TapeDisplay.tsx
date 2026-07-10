"use client";

import { useSimulationStore } from "@/store/simulation-store";
import { BASE_COLORS } from "@/constants";
import type { DNABase, TapeSymbol } from "@/types";

// Colores para símbolos procesados — más vivos que antes
const PROCESSED_COLORS: Record<string, { bg: string; text: string }> = {
  X: { bg: "#14532d", text: "#86efac" }, // verde oscuro / texto verde claro
  Y: { bg: "#7f1d1d", text: "#fca5a5" }, // rojo oscuro / texto rojo claro
  P: { bg: "#1e3a8a", text: "#93c5fd" }, // azul oscuro / texto azul claro
  Q: { bg: "#713f12", text: "#fde68a" }, // amarillo oscuro / texto amarillo claro
};

const isOriginal = (s: TapeSymbol) => ["A","T","C","G"].includes(s);

export function TapeDisplay() {
  const { tape, head, status, currentStep } = useSimulationStore();

  if (tape.length === 0) {
    return (
      <div className="bg-white/80 border border-stone-200 rounded-2xl px-5 py-8 flex items-center justify-center">
        <p className="text-stone-400 text-sm">La cinta aparecerá al iniciar la simulación</p>
      </div>
    );
  }

  const isDone = status === "accepted" || status === "rejected";

  return (
    <div className="bg-white/80 border border-stone-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-white/60">
        <span className="text-stone-600 text-sm font-semibold">Cinta de Turing</span>
        <div className="flex items-center gap-3">
          {isDone && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              status === "accepted"
                ? "bg-[#b8ddc8] border-[#4caf82]/40 text-[#1a5c3a]"
                : "bg-[#f0a8a8] border-[#e07070]/40 text-[#7a1a1a]"
            }`}>
              {status === "accepted" ? "✓ Aceptada" : "✗ Rechazada"}
            </span>
          )}
          {currentStep >= 0 && (
            <span className="text-xs text-stone-400 font-mono tabular-nums">paso {currentStep + 1}</span>
          )}
        </div>
      </div>

      {/* Tape */}
      <div className="px-4 pt-3 pb-4 overflow-x-auto">
        <div className="flex items-end gap-2 min-w-max">
          {tape.map((sym, i) => {
            const active  = i === head;
            const blank   = sym === "▯";
            const orig    = isOriginal(sym);
            const proc    = PROCESSED_COLORS[sym as string];

            // Colores según tipo de símbolo
            let bgColor = "#f0ece6";   // blank default
            let textColor = "#a8a29e"; // blank text
            let glowColor = "transparent";

            if (orig) {
              bgColor   = BASE_COLORS[sym as DNABase];
              textColor = "#09090b";
              glowColor = BASE_COLORS[sym as DNABase];
            } else if (proc) {
              bgColor   = proc.bg;
              textColor = proc.text;
              glowColor = proc.text;
            }

            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                {/* Cabezal indicator — solo muestra en posición activa */}
                <div
                  style={{ opacity: active ? 1 : 0 }}
                  className="transition-opacity duration-150 text-amber-400 text-xs leading-none select-none"
                >
                  ▼
                </div>

                {/* Cell */}
                <div
                  className="relative flex items-center justify-center rounded-xl font-mono font-bold
                    text-sm select-none transition-all duration-200"
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: bgColor,
                    color: textColor,
                    border: active
                      ? `2px solid ${blank ? "#fbbf24" : glowColor}`
                      : "2px solid transparent",
                    boxShadow: active
                      ? `0 0 18px ${blank ? "#fbbf2450" : glowColor + "55"}, inset 0 0 8px ${blank ? "#fbbf2420" : glowColor + "22"}`
                      : "none",
                    transform: active ? "scale(1.12)" : "scale(1)",
                    zIndex: active ? 10 : 1,
                  }}
                  title={blank ? "Símbolo blanco (fin de cinta)" : `pos ${i}: ${sym}`}
                >
                  {blank ? (
                    <span className="text-stone-500 text-lg">□</span>
                  ) : (
                    sym
                  )}

                  {/* Tick para procesados */}
                  {proc && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full
                        flex items-center justify-center text-[9px] font-bold border"
                      style={{
                        backgroundColor: proc.bg,
                        borderColor: proc.text + "60",
                        color: proc.text,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </div>

                {/* Index */}
                <span className="text-[9px] text-stone-500 font-mono tabular-nums">{i}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
