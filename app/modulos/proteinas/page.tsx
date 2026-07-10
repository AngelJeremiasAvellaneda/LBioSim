'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { WebGLWrapper } from '@/components/3d/WebGLWrapper';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const sceneSkeleton = (
  <div className="w-full h-full rounded-xl bg-white border border-stone-200 animate-pulse flex items-center justify-center">
    <span className="text-stone-400 text-sm">Cargando escena 3D…</span>
  </div>
);

const FoldingScene = dynamic(
  () => import('@/components/3d/FoldingScene').then((m) => m.FoldingScene),
  { ssr: false, loading: () => sceneSkeleton },
);

const DEFAULT_CHAIN = 'ACDEFGHIKLMNPQRSTVWY';

interface LevelInfo {
  key: string;
  title: string;
  description: string;
}

const LEVELS: LevelInfo[] = [
  {
    key: 'primaria',
    title: 'Estructura Primaria',
    description: 'Secuencia lineal de aminoácidos unidos por enlaces peptídicos. La estructura primaria determina la identidad y función de la proteína, y condiciona todos los niveles superiores de plegamiento.',
  },
  {
    key: 'secundaria',
    title: 'Estructura Secundaria',
    description: 'Plegamientos locales regulares como hélices alfa y láminas beta, estabilizados por puentes de hidrógeno entre el esqueleto peptídico. Estos motivos son los bloques fundamentales del plegamiento proteico.',
  },
  {
    key: 'terciaria',
    title: 'Estructura Terciaria',
    description: 'Conformación tridimensional completa de una cadena polipeptídica, estabilizada por interacciones entre cadenas laterales: puentes disulfuro, interacciones hidrofóbicas, puentes de hidrógeno y enlaces iónicos.',
  },
];

const LEVEL_DESCRIPTIONS: Record<string, { text: string; detail: string }> = {
  primaria: {
    text: 'Secuencia lineal de aminoácidos.',
    detail: 'Cada aminoácido está unido al siguiente mediante un enlace peptídico covalente. Esta secuencia está codificada directamente por el gen correspondiente.',
  },
  secundaria: {
    text: 'Plegamientos locales regulares.',
    detail: 'Las hélices alfa y láminas beta se forman por puentes de hidrógeno entre el oxígeno del grupo carbonilo y el hidrógeno del grupo amino del esqueleto peptídico.',
  },
  terciaria: {
    text: 'Conformación tridimensional completa.',
    detail: 'El plegamiento terciario está estabilizado por interacciones entre cadenas laterales, incluyendo puentes disulfuro, fuerzas hidrofóbicas y enlaces electrostáticos.',
  },
};

export default function ProteinasPage() {
  const { activeAminoAcids, markModuleVisited } = useMolecularContext();
  const [activeLevel, setActiveLevel] = useState('primaria');

  useEffect(() => {
    markModuleVisited('proteinas');
  }, [markModuleVisited]);

  const chain = useMemo(() => {
    if (activeAminoAcids.length >= 6 && activeAminoAcids.length <= 30) {
      return activeAminoAcids.map((aa) => aa.singleLetter).join('');
    }
    return DEFAULT_CHAIN;
  }, [activeAminoAcids]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800">Plegamiento de Proteínas</h1>
        <p className="mt-1 text-stone-500 text-sm">
          Visualiza los tres niveles de organización estructural de las proteínas
        </p>
      </div>

      <div className="h-56 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden border border-stone-200 bg-white/60">
        <ErrorBoundary>
          <WebGLWrapper
            scene3D={<FoldingScene aminoAcids={chain} />}
            fallback2D={
              <div className="flex items-center justify-center h-full text-stone-400 text-sm">
                WebGL no está disponible en tu navegador
              </div>
            }
            loadingFallback={
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          />
        </ErrorBoundary>
      </div>

      <div className="flex gap-2 flex-wrap">
        {LEVELS.map((lvl) => (
          <button
            key={lvl.key}
            onClick={() => setActiveLevel(lvl.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeLevel === lvl.key
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
            }`}
          >
            {lvl.title}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white/80 p-5">
        <h2 className="text-lg font-semibold text-emerald-300">
          {LEVELS.find((l) => l.key === activeLevel)?.title}
        </h2>
        <p className="mt-2 text-stone-600 text-sm leading-relaxed">
          {LEVEL_DESCRIPTIONS[activeLevel]?.text}
        </p>
        <p className="mt-2 text-stone-400 text-xs leading-relaxed">
          {LEVEL_DESCRIPTIONS[activeLevel]?.detail}
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white/60 p-5">
        <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-3">
          Secuencia de Aminoácidos
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {chain.split('').map((aa, i) => (
            <span
              key={i}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-stone-100 text-xs font-mono font-bold text-emerald-200 border border-stone-300"
            >
              {aa}
            </span>
          ))}
        </div>
        <p className="mt-3 text-stone-400 text-xs">
          {chain.length} aminoácidos
        </p>
      </div>
    </div>
  );
}
