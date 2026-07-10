'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export interface AnimationControls {
  play: () => void;
  pause: () => void;
  stepFwd: () => void;
  stepBwd: () => void;
  setSpeed: (s: 0.5 | 1 | 2) => void;
  progress: number;
  isPlaying: boolean;
}

export function useAnimationTimeline(
  buildTimeline: (tl: gsap.core.Timeline) => void,
  deps: React.DependencyList,
): AnimationControls {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => setProgress(tl.progress()),
      onComplete: () => setIsPlaying(false),
    });
    buildTimeline(tl);
    tlRef.current = tl;
    return () => { tl.kill(); };
  }, deps);

  return {
    play: () => { tlRef.current?.play(); setIsPlaying(true); },
    pause: () => { tlRef.current?.pause(); setIsPlaying(false); },
    stepFwd: () => tlRef.current?.tweenTo(
      Math.min(tlRef.current.totalDuration(), tlRef.current.time() + 0.5)
    ),
    stepBwd: () => tlRef.current?.tweenTo(
      Math.max(0, tlRef.current.time() - 0.5)
    ),
    setSpeed: (s) => { if (tlRef.current) tlRef.current.timeScale(s); },
    progress,
    isPlaying,
  };
}
