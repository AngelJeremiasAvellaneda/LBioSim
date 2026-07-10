"use client";

import dynamic from "next/dynamic";
import { useSimulationStore } from "@/store/simulation-store";

const DNAScene = dynamic(
  () => import("./DNAScene").then((m) => ({ default: m.DNAScene })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="text-zinc-600 text-xs font-mono">Cargando escena 3D…</span>
        </div>
      </div>
    ),
  }
);

export function DNAViewer() {
  const { tape, status } = useSimulationStore();
  const isDone = status === "accepted" || status === "rejected";

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-stone-300 shadow-md"
      style={{
        height: 420,
        background: "radial-gradient(ellipse at 50% 30%, #1a2e20 0%, #0f1a14 60%)",
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(#4caf82 1px, transparent 1px), linear-gradient(90deg, #4caf82 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3
        bg-linear-to-b from-black/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4caf82] animate-pulse" />
          <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">
            Doble Hélice · B-DNA
          </span>
        </div>
        {tape.length > 0 && (
          <span className="text-[10px] text-white/30 font-mono">
            {tape.length - 1} pares de bases
          </span>
        )}
      </div>

      {/* Hint */}
      <div className="absolute bottom-3 right-3 z-10 pointer-events-none text-[10px] text-white/25 font-mono flex items-center gap-1.5">
        <span>Arrastra</span><span>·</span><span>Zoom</span>
      </div>

      {/* Result overlay */}
      {isDone && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm border ${
            status === "accepted"
              ? "bg-[#b8ddc8]/20 border-[#4caf82]/40 text-[#4caf82]"
              : "bg-[#f0a8a8]/20 border-[#e07070]/40 text-[#e07070]"
          }`}>
            {status === "accepted" ? "✓ Cadena Aceptada" : "✗ Cadena Rechazada"}
          </div>
        </div>
      )}

      {/* Empty state */}
      {tape.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-5">
          <div className="text-center space-y-1">
            <p className="text-white/30 text-sm">Ingresa una secuencia</p>
            <p className="text-white/20 text-xs">y presiona Iniciar para ver la hélice</p>
          </div>
        </div>
      )}

      <DNAScene />
    </div>
  );
}
