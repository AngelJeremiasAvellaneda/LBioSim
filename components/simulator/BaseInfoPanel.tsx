"use client";

import { BASE_COLORS, BASE_FULL_NAMES, BASE_DESCRIPTIONS, BASE_COMPLEMENT } from "@/constants";
import type { DNABase } from "@/types";

const BASES: DNABase[] = ["A", "T", "C", "G"];

const BOND_COUNT: Record<DNABase, number> = { A: 2, T: 2, C: 3, G: 3 };

export function BaseInfoPanel() {
  return (
    <div className="bg-white/80 border border-stone-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 bg-white/60">
        <span className="text-stone-600 text-sm font-semibold">Bases nitrogenadas</span>
      </div>

      <div className="p-3 space-y-2">
        {BASES.map((base) => {
          const comp = BASE_COMPLEMENT[base];
          return (
            <div
              key={base}
              className="flex items-start gap-3 p-3 bg-stone-100/50 hover:bg-stone-100/80
                border border-stone-200 rounded-xl transition-colors"
            >
              {/* Base badge with glow */}
              <div
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl
                  font-mono font-bold text-zinc-950 text-base shadow-lg"
                style={{
                  backgroundColor: BASE_COLORS[base],
                  boxShadow: `0 0 12px ${BASE_COLORS[base]}55`,
                }}
              >
                {base}
              </div>

              <div className="flex-1 min-w-0">
                {/* Name + complement + bonds */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-stone-700 text-xs font-semibold">{BASE_FULL_NAMES[base]}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-stone-400 text-xs">↔</span>
                    <span
                      className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md"
                      style={{
                        color: BASE_COLORS[comp],
                        backgroundColor: `${BASE_COLORS[comp]}18`,
                      }}
                    >
                      {comp}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 ml-auto">
                    {BOND_COUNT[base]}H
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed line-clamp-2">
                  {BASE_DESCRIPTIONS[base]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
