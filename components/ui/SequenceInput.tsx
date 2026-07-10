'use client';

import { type ChangeEvent } from 'react';

interface SequenceInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  label?: string;
  error?: string | null;
}

const FILTER_RE = /[^ATCG]/gi;

export default function SequenceInput({
  value,
  onChange,
  maxLength = 200,
  placeholder = 'Introduce secuencia de ADN...',
  label,
  error,
}: SequenceInputProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.toUpperCase();
    const filtered = raw.replace(FILTER_RE, '');
    onChange(filtered);
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-stone-700 text-sm font-semibold">{label}</label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-label="Entrada de secuencia de ADN"
          role="textbox"
          aria-describedby={error ? 'seq-error' : undefined}
          aria-invalid={error ? true : undefined}
          className="w-full rounded-xl bg-white border border-stone-300 px-3 py-2.5 text-stone-800 placeholder-stone-400 outline-none ring-0 transition focus:ring-2 focus:ring-[#4caf82]/40 focus:border-[#4caf82] font-mono shadow-sm"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">
          {value.length}/{maxLength}
        </span>
      </div>
      {error && <p id="seq-error" role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
