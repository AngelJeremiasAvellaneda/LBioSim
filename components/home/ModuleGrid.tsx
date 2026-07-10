'use client';

import Link from 'next/link';
import {
  CheckCircle2, Lock,
  Dna, Wrench, RotateCw, FileText, ArrowRightLeft, FlaskConical,
  Microscope, AlertTriangle, HeartPulse, TestTube2, BarChart2,
  Target, Globe, Timer, ClipboardList,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { MolecularProvider, useMolecularContext } from '@/contexts/MolecularContext';
import type { ModuleId } from '@/types';

interface Mod {
  id: ModuleId;
  title: string;
  description: string;
  icon: LucideIcon;
  group: string;
  cardBg: string;    // card background — medium-saturated pastel
  iconBg: string;    // icon container
  iconColor: string; // icon
  titleColor: string;// title text — dark enough to read
  descColor: string; // description text
}

// Colors: medium pastel bg + very dark text for contrast
const MODULES: Mod[] = [
  {
    id: 'que-es-el-adn', title: '¿Qué es el ADN?',
    description: 'Estructura y función de la doble hélice',
    icon: Dna, group: 'ADN',
    cardBg: 'bg-[#b8ddc8]', iconBg: 'bg-white/40', iconColor: 'text-[#1a5c3a]',
    titleColor: 'text-[#0f3d28]', descColor: 'text-[#1e5c3a]',
  },
  {
    id: 'construye-tu-adn', title: 'Construye tu ADN',
    description: 'Crea secuencias y visualiza complementos',
    icon: Wrench, group: 'ADN',
    cardBg: 'bg-[#aac8e8]', iconBg: 'bg-white/40', iconColor: 'text-[#1a3f6e]',
    titleColor: 'text-[#0f2a50]', descColor: 'text-[#1a3f6e]',
  },
  {
    id: 'replicacion', title: 'Replicación',
    description: 'Proceso semiconservativo de copia del ADN',
    icon: RotateCw, group: 'ADN',
    cardBg: 'bg-[#c5b0e0]', iconBg: 'bg-white/40', iconColor: 'text-[#3d1e78]',
    titleColor: 'text-[#2a1258]', descColor: 'text-[#3d2070]',
  },
  {
    id: 'transcripcion', title: 'Transcripción',
    description: 'Del ADN al ARNm con ARN Polimerasa',
    icon: FileText, group: 'Dogma',
    cardBg: 'bg-[#f0cc80]', iconBg: 'bg-white/40', iconColor: 'text-[#7a4e00]',
    titleColor: 'text-[#5a3800]', descColor: 'text-[#7a4e10]',
  },
  {
    id: 'traduccion', title: 'Traducción',
    description: 'El ribosoma transforma ARNm en proteína',
    icon: ArrowRightLeft, group: 'Dogma',
    cardBg: 'bg-[#f0a8a8]', iconBg: 'bg-white/40', iconColor: 'text-[#7a1a1a]',
    titleColor: 'text-[#5a0f0f]', descColor: 'text-[#7a2020]',
  },
  {
    id: 'aminoacidos', title: 'Aminoácidos',
    description: 'Los 20 bloques fundamentales de las proteínas',
    icon: FlaskConical, group: 'Dogma',
    cardBg: 'bg-[#90d0dc]', iconBg: 'bg-white/40', iconColor: 'text-[#1a5f6a]',
    titleColor: 'text-[#0f4050]', descColor: 'text-[#1a5060]',
  },
  {
    id: 'proteinas', title: 'Proteínas',
    description: 'Plegamiento y niveles estructurales proteicos',
    icon: Microscope, group: 'Dogma',
    cardBg: 'bg-[#a8d888]', iconBg: 'bg-white/40', iconColor: 'text-[#1f5a10]',
    titleColor: 'text-[#143d08]', descColor: 'text-[#1f5a18]',
  },
  {
    id: 'mutaciones', title: 'Mutaciones',
    description: 'Clasifica silent, missense, nonsense y frameshift',
    icon: AlertTriangle, group: 'Patología',
    cardBg: 'bg-[#f0b880]', iconBg: 'bg-white/40', iconColor: 'text-[#7a3a00]',
    titleColor: 'text-[#582800]', descColor: 'text-[#7a3a10]',
  },
  {
    id: 'enfermedades', title: 'Enfermedades',
    description: 'Bases moleculares de enfermedades genéticas',
    icon: HeartPulse, group: 'Patología',
    cardBg: 'bg-[#e8a0c0]', iconBg: 'bg-white/40', iconColor: 'text-[#6a1040]',
    titleColor: 'text-[#500830]', descColor: 'text-[#6a1040]',
  },
  {
    id: 'laboratorio', title: 'Laboratorio',
    description: 'Herramientas moleculares interactivas',
    icon: TestTube2, group: 'Herramientas',
    cardBg: 'bg-[#88ccc0]', iconBg: 'bg-white/40', iconColor: 'text-[#1a5a50]',
    titleColor: 'text-[#0f3c35]', descColor: 'text-[#1a5050]',
  },
  {
    id: 'comparador', title: 'Comparador',
    description: 'Alineamiento y similitud de secuencias',
    icon: BarChart2, group: 'Herramientas',
    cardBg: 'bg-[#b0a8e0]', iconBg: 'bg-white/40', iconColor: 'text-[#2a207a]',
    titleColor: 'text-[#1a1258]', descColor: 'text-[#2a2070]',
  },
  {
    id: 'quiz', title: 'Quiz',
    description: 'Pon a prueba tus conocimientos',
    icon: Target, group: 'Herramientas',
    cardBg: 'bg-[#f0d878]', iconBg: 'bg-white/40', iconColor: 'text-[#7a5a00]',
    titleColor: 'text-[#5a4000]', descColor: 'text-[#7a5a10]',
  },
  {
    id: 'modelos-3d', title: 'Modelos 3D',
    description: 'Galería de moléculas biológicas en 3D',
    icon: Globe, group: 'Avanzado',
    cardBg: 'bg-[#98b8e8]', iconBg: 'bg-white/40', iconColor: 'text-[#1a2e6a]',
    titleColor: 'text-[#0f1e50]', descColor: 'text-[#1a2e6a]',
  },
  {
    id: 'dogma-temporal', title: 'Dogma Temporal',
    description: 'Recorre el dogma central completo animado',
    icon: Timer, group: 'Avanzado',
    cardBg: 'bg-[#d898e8]', iconBg: 'bg-white/40', iconColor: 'text-[#5a0878]',
    titleColor: 'text-[#400558]', descColor: 'text-[#5a1070]',
  },
];

const GROUPS = ['ADN', 'Dogma', 'Patología', 'Herramientas', 'Avanzado'] as const;

const GROUP_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  ADN:          { color: 'text-[#0f3d28]', bg: 'bg-[#b8ddc8]', border: 'border-[#7ab898]' },
  Dogma:        { color: 'text-[#5a3800]', bg: 'bg-[#f0cc80]', border: 'border-[#c8a040]' },
  Patología:    { color: 'text-[#5a0f0f]', bg: 'bg-[#f0a8a8]', border: 'border-[#c87070]' },
  Herramientas: { color: 'text-[#0f3c35]', bg: 'bg-[#88ccc0]', border: 'border-[#50a898]' },
  Avanzado:     { color: 'text-[#400558]', bg: 'bg-[#d898e8]', border: 'border-[#a860c0]' },
};

function ModuleGridInner() {
  const { visitedModules } = useMolecularContext();
  const completed = visitedModules.length;
  const total = MODULES.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <section className="space-y-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Módulos de Aprendizaje</h2>
          <p className="text-sm text-stone-500 mt-0.5">Explora el dogma central paso a paso</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs text-stone-500">{completed}/{total} completados</span>
            <span className="text-sm font-bold text-[#1a5c3a]">{pct}%</span>
          </div>
          <div className="w-24 h-2.5 rounded-full bg-stone-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#4caf82] transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map((group) => {
        const g = GROUP_STYLE[group];
        const groupModules = MODULES.filter((m) => m.group === group);
        const groupCompleted = groupModules.filter((m) => visitedModules.includes(m.id)).length;

        return (
          <div key={group}>
            {/* Group pill */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${g.bg} ${g.color} ${g.border}`}>
                {group}
              </span>
              <span className="text-xs text-stone-400 font-medium">{groupCompleted}/{groupModules.length}</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {groupModules.map((mod) => {
                const isCompleted = visitedModules.includes(mod.id);
                const Icon = mod.icon;

                return (
                  <Link
                    key={mod.id}
                    href={`/modulos/${mod.id}`}
                    aria-label={mod.title}
                    className={`card-lift group relative flex flex-col rounded-2xl p-4 overflow-hidden
                      border border-white/70 shadow-sm hover:shadow-md
                      ${isCompleted
                        ? `${mod.cardBg} opacity-75 hover:opacity-100`
                        : mod.cardBg
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                        transition-transform duration-200 group-hover:scale-110
                        ${mod.iconBg}`}>
                        <Icon className={`w-4 h-4 ${mod.iconColor}`} />
                      </div>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-[#2d7a58] shrink-0 mt-0.5" />
                      )}
                    </div>

                    <h3 className={`text-sm font-bold leading-tight mb-1 ${mod.titleColor}`}>
                      {mod.title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-2 ${mod.descColor}`}>
                      {mod.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Evaluación */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border bg-[#f0b880] text-[#5a2800] border-[#c87830]">
            Evaluación
          </span>
          <div className="flex-1 h-px bg-stone-200" />
        </div>

        <Link
          href={completed >= 5 ? '/evaluacion/pretest' : '#'}
          onClick={completed < 5 ? (e) => e.preventDefault() : undefined}
          aria-disabled={completed < 5}
          className={`card-lift group flex items-center gap-4 rounded-2xl border p-5 shadow-sm hover:shadow-md
            ${completed >= 5
              ? 'bg-[#f5d8a8] border-[#d4a040]/50 hover:border-[#c07820]'
              : 'bg-stone-100 border-stone-200 opacity-50 cursor-not-allowed'
            }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
            transition-transform duration-200 group-hover:scale-110
            ${completed >= 5 ? 'bg-white/50' : 'bg-stone-200'}`}>
            <ClipboardList className={`w-6 h-6 ${completed >= 5 ? 'text-[#7a4a00]' : 'text-stone-400'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold ${completed >= 5 ? 'text-[#5a3400]' : 'text-stone-400'}`}>
              Evaluación Académica
            </p>
            <p className={`text-xs mt-0.5 ${completed >= 5 ? 'text-[#7a5010]' : 'text-stone-400'}`}>
              {completed >= 5
                ? 'Pretest · Postest · Escalas SUS / TAM / NASA-TLX'
                : `Completa ${5 - completed} módulo${5 - completed !== 1 ? 's' : ''} más para desbloquear`}
            </p>
          </div>
          {completed < 5
            ? <Lock className="w-5 h-5 text-stone-300 shrink-0" />
            : <CheckCircle2 className="w-5 h-5 text-[#2d7a58] shrink-0" />
          }
        </Link>
      </div>

    </section>
  );
}

export function ModuleGrid() {
  return (
    <MolecularProvider>
      <ModuleGridInner />
    </MolecularProvider>
  );
}
