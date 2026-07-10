'use client';

import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { useMolecularContext } from '@/contexts/MolecularContext';

interface WebGLWrapperProps {
  scene3D: ReactNode;
  fallback2D: ReactNode;
  loadingFallback?: ReactNode;
}

export function WebGLWrapper({ scene3D, fallback2D, loadingFallback }: WebGLWrapperProps) {
  const { webGLSupported } = useMolecularContext();
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    window.addEventListener('webglcontextlost', handler);
    return () => window.removeEventListener('webglcontextlost', handler);
  }, []);

  const handleRetry = () => {
    location.reload();
  };

  if (!webGLSupported) {
    return <>{fallback2D}</>;
  }

  if (contextLost) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white/80 border border-stone-200 text-center min-h-[300px]">
        <span className="text-4xl">⚠</span>
        <p className="text-stone-600 text-sm font-medium">Se perdió el contexto WebGL</p>
        <p className="text-stone-400 text-xs max-w-md">
          Es posible que el navegador haya reiniciado el motor gráfico. Presiona Reintentar para recargar la página.
        </p>
        <button
          onClick={handleRetry}
          className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md"
          aria-label="Reintentar"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const fallback = loadingFallback ?? (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div role="application" aria-description="Escena 3D de biología molecular" style={{ width: '100%', height: '100%' }}>
      <Suspense fallback={fallback}>{scene3D}</Suspense>
    </div>
  );
}
