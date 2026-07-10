import type { DNABase, AlgorithmType } from "@/types";

// ─── DNA Base Colors ──────────────────────────────────────────────────────────
export const BASE_COLORS: Record<DNABase, string> = {
  A: "#22c55e", // green-500
  T: "#ef4444", // red-500
  C: "#3b82f6", // blue-500
  G: "#eab308", // yellow-500
};

export const BASE_GLOW_COLORS: Record<DNABase, string> = {
  A: "rgba(34,197,94,0.6)",
  T: "rgba(239,68,68,0.6)",
  C: "rgba(59,130,246,0.6)",
  G: "rgba(234,179,8,0.6)",
};

export const BASE_HEX_COLORS: Record<DNABase, number> = {
  A: 0x22c55e,
  T: 0xef4444,
  C: 0x3b82f6,
  G: 0xeab308,
};

export const BASE_COMPLEMENT: Record<DNABase, DNABase> = {
  A: "T",
  T: "A",
  C: "G",
  G: "C",
};

export const BASE_FULL_NAMES: Record<DNABase, string> = {
  A: "Adenina",
  T: "Timina",
  C: "Citosina",
  G: "Guanina",
};

export const BASE_DESCRIPTIONS: Record<DNABase, string> = {
  A: "Base púrica que siempre se une con Timina mediante 2 enlaces de hidrógeno. Fundamental en la síntesis de ATP.",
  T: "Base pirimidínica complementaria de la Adenina. Se une mediante 2 enlaces de hidrógeno. Solo en ADN.",
  C: "Base pirimidínica que se une con Guanina mediante 3 enlaces de hidrógeno. Más estable térmicamente.",
  G: "Base púrica complementaria de la Citosina. Forma 3 enlaces de hidrógeno. Alta estabilidad estructural.",
};

// ─── Algorithm Definitions ────────────────────────────────────────────────────
export const ALGORITHMS: Record<AlgorithmType, { name: string; description: string }> = {
  complement: {
    name: "Complementariedad A-T / C-G",
    description: "Verifica que cada base tenga su complemento correspondiente en la cadena.",
  },
  palindrome: {
    name: "Palíndromo Genético",
    description: "Verifica si seq[i] == complemento(seq[n-1-i]). Ej: GAATTC → revComp GAATTC ✓",
  },
  gc_content: {
    name: "Contenido GC",
    description: "Analiza el porcentaje de bases G y C en la secuencia.",
  },
  repeat: {
    name: "Detección de Repeticiones",
    description: "Identifica secuencias repetidas o motivos en el ADN.",
  },
};

// ─── Animation Constants ──────────────────────────────────────────────────────
export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  verySlow: 1.5,
};

export const EASING = {
  smooth: [0.4, 0, 0.2, 1] as const,
  spring: { type: "spring", stiffness: 300, damping: 30 },
  elastic: { type: "spring", stiffness: 500, damping: 25 },
};

// ─── Speed Map (ms per step) ──────────────────────────────────────────────────
export const SPEED_MS: Record<string, number> = {
  "0.5": 2000,
  "1": 1000,
  "2": 500,
  "4": 250,
};
