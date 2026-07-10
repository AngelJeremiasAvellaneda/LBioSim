"use client";

import { useSimulationStore } from "@/store/simulation-store";
import { ALGORITHMS } from "@/constants";
import type { AlgorithmType } from "@/types";
import { ArrowLeftRight, Repeat2, Percent, Infinity } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AlgoMeta {
  icon: LucideIcon;
  // idle state
  cardBg: string;
  cardBorder: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  descColor: string;
  // selected state
  selBg: string;
  selBorder: string;
  selIconBg: string;
  selIconColor: string;
  selTitleColor: string;
}

const ALGO_META: Record<string, AlgoMeta> = {
  complement: {
    icon: ArrowLeftRight,
    cardBg: 'bg-[#b8ddc8]', cardBorder: 'border-[#7ab898]',
    iconBg: 'bg-white/40', iconColor: 'text-[#0f3d28]',
    titleColor: 'text-[#0f3d28]', descColor: 'text-[#1e5c3a]',
    selBg: 'bg-[#7ab898]', selBorder: 'border-[#4caf82]',
    selIconBg: 'bg-white/50', selIconColor: 'text-[#0f3d28]',
    selTitleColor: 'text-[#0f3d28]',
  },
  palindrome: {
    icon: Repeat2,
    cardBg: 'bg-[#c5b0e0]', cardBorder: 'border-[#9b72d4]',
    iconBg: 'bg-white/40', iconColor: 'text-[#2a1258]',
    titleColor: 'text-[#2a1258]', descColor: 'text-[#3d2070]',
    selBg: 'bg-[#9b72d4]', selBorder: 'border-[#7a50b8]',
    selIconBg: 'bg-white/50', selIconColor: 'text-[#2a1258]',
    selTitleColor: 'text-[#1a0a40]',
  },
  gc_content: {
    icon: Percent,
    cardBg: 'bg-[#f0cc80]', cardBorder: 'border-[#c8a040]',
    iconBg: 'bg-white/40', iconColor: 'text-[#5a3800]',
    titleColor: 'text-[#5a3800]', descColor: 'text-[#7a4e10]',
    selBg: 'bg-[#c8a040]', selBorder: 'border-[#a87820]',
    selIconBg: 'bg-white/50', selIconColor: 'text-[#5a3800]',
    selTitleColor: 'text-[#3d2400]',
  },
  repeat: {
    icon: Infinity,
    cardBg: 'bg-[#aac8e8]', cardBorder: 'border-[#6898c8]',
    iconBg: 'bg-white/40', iconColor: 'text-[#1a3f6e]',
    titleColor: 'text-[#1a3f6e]', descColor: 'text-[#2a5282]',
    selBg: 'bg-[#6898c8]', selBorder: 'border-[#4878a8]',
    selIconBg: 'bg-white/50', selIconColor: 'text-[#1a3f6e]',
    selTitleColor: 'text-[#0f2a50]',
  },
};

export function AlgorithmSelector() {
  const { algorithm, status, setAlgorithm } = useSimulationStore();
  const isRunning = status === "running";
  const algorithmList = Object.entries(ALGORITHMS) as [AlgorithmType, { name: string; description: string }][];

  return (
    <div className="bg-white/80 border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 bg-white/60">
        <span className="text-stone-700 text-sm font-semibold">Algoritmo</span>
      </div>

      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {algorithmList.map(([key, { name, description }]) => {
          const isSelected = algorithm === key;
          const isDisabled = key === "repeat";
          const m = ALGO_META[key] ?? ALGO_META.complement;
          const Icon = m.icon;

          return (
            <button
              key={key}
              onClick={() => !isDisabled && !isRunning && setAlgorithm(key)}
              disabled={isDisabled || isRunning}
              aria-pressed={isSelected}
              className={`card-lift text-left p-3 rounded-xl border transition-all
                ${isDisabled
                  ? `${m.cardBg} ${m.cardBorder} opacity-40 cursor-not-allowed`
                  : isSelected
                  ? `${m.selBg} ${m.selBorder} shadow-md cursor-default`
                  : `${m.cardBg} ${m.cardBorder} hover:opacity-90 cursor-pointer`
                }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {/* Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                  ${isSelected ? m.selIconBg : m.iconBg}`}>
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? m.selIconColor : m.iconColor}`} />
                </div>

                <span className={`text-xs font-bold leading-tight flex-1
                  ${isSelected ? m.selTitleColor : m.titleColor}`}>
                  {name}
                </span>

                {isDisabled && (
                  <span className="text-[9px] text-stone-500 bg-white/50 px-1.5 py-0.5 rounded-full border border-stone-300/50">
                    pronto
                  </span>
                )}

                {isSelected && (
                  <span className="text-[9px] font-bold text-white bg-white/30 px-1.5 py-0.5 rounded-full">
                    activo
                  </span>
                )}
              </div>

              <p className={`text-[11px] leading-relaxed line-clamp-2
                ${isSelected ? m.selTitleColor + ' opacity-80' : m.descColor}`}>
                {description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
