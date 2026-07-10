"use client";

import { useState, useCallback } from "react";
import { Dna, Shuffle, Play, RotateCcw, Zap } from "lucide-react";
import { useSimulationStore } from "@/store/simulation-store";
import {
  generateRandomSequence,
  generateComplementarySequence,
  generatePalindrome,
  generateGCOptimalSequence,
} from "@/lib/turing-machine";
import { BASE_COLORS } from "@/constants";
import type { DNABase } from "@/types";

const MAX_LENGTH = 24;
const MIN_LENGTH = 2;
const VALID_BASES = new Set(["A", "T", "C", "G"]);

const VALID_HINT: Record<string, string> = {
  complement: "Genera secuencia con A=T y C=G garantizado",
  palindrome: "Genera palíndromo genético genuino",
  gc_content: "Genera secuencia con 40-65% GC",
  repeat:     "No disponible aún",
};

export function SequenceInput() {
  const { sequence, algorithm, status, setSequence, initialize, reset } = useSimulationStore();
  const [inputValue, setInputValue] = useState(sequence);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((value: string) => {
    if (value.length < MIN_LENGTH) return `Mínimo ${MIN_LENGTH} bases.`;
    if (value.length > MAX_LENGTH) return `Máximo ${MAX_LENGTH} bases.`;
    for (const ch of value) {
      if (!VALID_BASES.has(ch)) return `"${ch}" no es válido. Solo A, T, C, G.`;
    }
    return null;
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase().replace(/[^ATCG]/gi, "");
    setInputValue(raw);
    setError(raw ? validate(raw) : null);
    setSequence(raw);
  };

  const handleStart = () => {
    const err = validate(inputValue);
    if (err) { setError(err); return; }
    initialize(inputValue);
  };

  const setSeq = (seq: string) => { setInputValue(seq); setError(null); setSequence(seq); };

  const handleRandom = () => setSeq(generateRandomSequence(12));

  const handleValid = () => {
    switch (algorithm) {
      case "complement": return setSeq(generateComplementarySequence(12));
      case "palindrome":  return setSeq(generatePalindrome(8));
      case "gc_content":  return setSeq(generateGCOptimalSequence(12));
      default:            return setSeq(generateRandomSequence(12));
    }
  };

  const handleReset = () => {
    const current = inputValue;
    reset();
    setInputValue(current);
    setError(null);
  };

  const isRunning = status === "running";
  const isActive  = status !== "idle";
  const canStart  = !error && inputValue.length >= MIN_LENGTH && !isRunning;

  return (
    <div className="bg-white/80 border border-stone-200 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 bg-white/60">
        <Dna size={14} className="text-emerald-500" />
        <span className="text-stone-600 text-sm font-semibold">Secuencia de ADN</span>
        <span className="ml-auto text-xs text-stone-400 font-mono">{inputValue.length}/{MAX_LENGTH}</span>
      </div>

      <div className="p-4 space-y-3">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          disabled={isRunning}
          placeholder="AATTCCGG"
          maxLength={MAX_LENGTH}
          className={`w-full bg-stone-100 border rounded-xl px-4 py-3
            font-mono text-xl text-stone-800 placeholder:text-stone-500
            focus:outline-none transition-all tracking-[0.2em] uppercase
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-400" : "border-stone-300/80 focus:border-stone-400"}`}
        />

        {inputValue.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {inputValue.split("").map((base, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg
                  text-xs font-mono font-bold text-zinc-950"
                style={{
                  backgroundColor: BASE_COLORS[base as DNABase] ?? "#71717a",
                  boxShadow: `0 0 8px ${BASE_COLORS[base as DNABase] ?? "#71717a"}55`,
                }}
              >
                {base}
              </span>
            ))}
          </div>
        )}

        {error && <p className="text-red-600 text-xs">⚠ {error}</p>}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
              transition-all bg-linear-to-r from-emerald-600 to-emerald-500
              hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20
              disabled:from-stone-200 disabled:to-stone-200 disabled:text-stone-400
              disabled:shadow-none disabled:cursor-not-allowed"
          >
            <Play size={13} />
            Iniciar
          </button>

          {isActive && (
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm
                bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-600 transition-colors">
              <RotateCcw size={13} />
              Reiniciar
            </button>
          )}

          <button onClick={handleRandom} disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm
              bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-500
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Shuffle size={13} />
            Aleatoria
          </button>

          <button
            onClick={handleValid}
            disabled={isRunning || algorithm === "repeat"}
            title={VALID_HINT[algorithm] ?? "Genera secuencia válida"}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm
              bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-500
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Zap size={13} />
            Válida
          </button>
        </div>
      </div>
    </div>
  );
}
