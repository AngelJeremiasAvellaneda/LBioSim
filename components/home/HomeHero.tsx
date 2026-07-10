'use client';

import dynamic from 'next/dynamic';
import { Dna, Sparkles } from 'lucide-react';

const DNAScene = dynamic(
  () => import('@/components/dna3d/DNAScene').then((m) => ({ default: m.DNAScene })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border-2 border-[#4caf82]/30 rounded-full" />
          <div className="absolute inset-0 border-2 border-[#4caf82] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    ),
  }
);

export function HomeHero() {
  return (
    <div
      role="banner"
      className="relative rounded-3xl overflow-hidden mb-10"
      style={{
        height: 'clamp(260px, 38vw, 380px)',
        background: 'linear-gradient(135deg, #c8e6d4 0%, #dce8f5 40%, #f0ddf0 70%, #fde8d8 100%)',
      }}
    >
      {/* Soft blobs */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-40"
        style={{ background: 'radial-gradient(circle, #a8d5be 0%, transparent 70%)' }} />
      <div className="pointer-events-none absolute -bottom-16 -right-10 w-56 h-56 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #d4b8e8 0%, transparent 70%)' }} />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-40 h-40 rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #f5c8a8 0%, transparent 70%)' }} />

      {/* Floating dots decoration */}
      {[
        { top: '15%', left: '8%',  size: 8,  color: '#a8d5be', opacity: 0.7 },
        { top: '70%', left: '5%',  size: 5,  color: '#d4b8e8', opacity: 0.6 },
        { top: '20%', right: '6%', size: 10, color: '#f5c8a8', opacity: 0.6 },
        { top: '75%', right: '8%', size: 6,  color: '#a8d5be', opacity: 0.5 },
        { top: '45%', left: '3%',  size: 4,  color: '#f5c8a8', opacity: 0.5 },
      ].map((dot, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: dot.size, height: dot.size,
            top: dot.top, left: (dot as any).left, right: (dot as any).right,
            background: dot.color, opacity: dot.opacity,
          }}
        />
      ))}

      {/* 3D scene — background */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ height: '100%' }}>
        <DNAScene />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        {/* Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-white/80 shadow-sm mb-4 backdrop-blur-sm">
          <Sparkles className="w-3 h-3 text-[#4caf82]" />
          <span className="text-[10px] font-semibold text-stone-600 tracking-wider uppercase">
            Plataforma Educativa Interactiva
          </span>
        </div>

        {/* Logo + title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center border border-white/90">
            <Dna className="w-6 h-6 text-[#4caf82]" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight leading-none">
              LBioSim
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">Biología Molecular · Dogma Central</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-600/90 max-w-sm sm:max-w-md leading-relaxed">
          Visualiza y aprende los procesos moleculares fundamentales a través de
          animaciones 3D interactivas y evaluaciones académicas.
        </p>

        {/* Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {['ADN', 'Replicación', 'Transcripción', 'Traducción', 'Proteínas'].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-white/70 border border-white/80 text-xs font-medium text-stone-600 backdrop-blur-sm shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute bottom-3 right-4 z-10 text-[10px] text-stone-400 font-mono hidden sm:block">
        Arrastra · Zoom
      </div>
    </div>
  );
}
