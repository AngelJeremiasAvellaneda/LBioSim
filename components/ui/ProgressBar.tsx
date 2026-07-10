'use client';

import { useMolecularContext } from '@/contexts/MolecularContext';

const TOTAL = 15;

export default function ProgressBar() {
  const { visitedModules } = useMolecularContext();
  const count = visitedModules.length;
  const pct = Math.round((count / TOTAL) * 100);

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`text-sm ${
          count === 0 ? 'text-stone-400' : 'text-stone-600'
        }`}
      >
        {count} de {TOTAL} módulos completados
      </span>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
        <div
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={TOTAL}
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
