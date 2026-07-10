'use client';

import { useState } from 'react';
import type { AnimationControls } from '@/components/animations/useAnimationTimeline';

interface PlaybackControlsProps {
  controls: AnimationControls;
}

const SPEEDS = [0.5, 1, 2] as const;

export function PlaybackControls({ controls }: PlaybackControlsProps) {
  const { play, pause, stepFwd, stepBwd, setSpeed, progress, isPlaying } = controls;
  const [speed, setLocalSpeed] = useState<0.5 | 1 | 2>(1);

  const handleSpeed = (s: 0.5 | 1 | 2) => {
    setSpeed(s);
    setLocalSpeed(s);
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/80 border border-stone-200 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={stepBwd}
          aria-label="Paso atrás"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-all text-sm"
        >
          ⏮
        </button>

        <button
          onClick={() => (isPlaying ? pause() : play())}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#4caf82] hover:bg-[#3d9670] text-white transition-all shadow-md shadow-[#4caf82]/30 text-sm"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          onClick={stepFwd}
          aria-label="Paso adelante"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-all text-sm"
        >
          ⏭
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => handleSpeed(s)}
            aria-label={`Velocidad ${s}x`}
            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
              speed === s
                ? 'bg-[#4caf82] text-white shadow-sm'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
            }`}
          >
            {s}×
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-full bg-[#4caf82] rounded-full transition-all duration-200"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <span className="text-xs text-stone-400 font-mono tabular-nums w-10 text-right">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
}
