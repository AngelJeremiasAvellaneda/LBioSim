'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMolecularContext } from '@/contexts/MolecularContext';
import type { ModuleId } from '@/types';
import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2, Lock,
  Dna, Wrench, RotateCw, FileText, ArrowRightLeft,
  FlaskConical, Microscope, AlertTriangle, HeartPulse,
  TestTube2, BarChart2, Target, Globe, Timer, ClipboardList,
} from 'lucide-react';

interface ModuleEntry {
  id: ModuleId;
  label: string;
  href: string;
  icon: LucideIcon;
  group: string;
}

const MODULES: ModuleEntry[] = [
  { id: 'que-es-el-adn',    label: '¿Qué es el ADN?',   href: '/modulos/que-es-el-adn',    icon: Dna,           group: 'ADN' },
  { id: 'construye-tu-adn', label: 'Construye tu ADN',  href: '/modulos/construye-tu-adn', icon: Wrench,        group: 'ADN' },
  { id: 'replicacion',      label: 'Replicación',       href: '/modulos/replicacion',       icon: RotateCw,      group: 'ADN' },
  { id: 'transcripcion',    label: 'Transcripción',     href: '/modulos/transcripcion',     icon: FileText,      group: 'Dogma' },
  { id: 'traduccion',       label: 'Traducción',        href: '/modulos/traduccion',        icon: ArrowRightLeft,group: 'Dogma' },
  { id: 'aminoacidos',      label: 'Aminoácidos',       href: '/modulos/aminoacidos',       icon: FlaskConical,  group: 'Dogma' },
  { id: 'proteinas',        label: 'Proteínas',         href: '/modulos/proteinas',         icon: Microscope,    group: 'Dogma' },
  { id: 'mutaciones',       label: 'Mutaciones',        href: '/modulos/mutaciones',        icon: AlertTriangle, group: 'Patología' },
  { id: 'enfermedades',     label: 'Enfermedades',      href: '/modulos/enfermedades',      icon: HeartPulse,    group: 'Patología' },
  { id: 'laboratorio',      label: 'Laboratorio',       href: '/modulos/laboratorio',       icon: TestTube2,     group: 'Herramientas' },
  { id: 'comparador',       label: 'Comparador',        href: '/modulos/comparador',        icon: BarChart2,     group: 'Herramientas' },
  { id: 'quiz',             label: 'Quiz',              href: '/modulos/quiz',              icon: Target,        group: 'Herramientas' },
  { id: 'modelos-3d',       label: 'Modelos 3D',        href: '/modulos/modelos-3d',        icon: Globe,         group: 'Avanzado' },
  { id: 'dogma-temporal',   label: 'Dogma Temporal',    href: '/modulos/dogma-temporal',    icon: Timer,         group: 'Avanzado' },
];

const GROUPS = ['ADN', 'Dogma', 'Patología', 'Herramientas', 'Avanzado'];

const GROUP_STYLE: Record<string, { color: string; dot: string }> = {
  ADN:          { color: 'text-[#2d7a58]', dot: 'bg-[#4caf82]' },
  Dogma:        { color: 'text-[#a87a20]', dot: 'bg-[#d4a843]' },
  Patología:    { color: 'text-[#b84040]', dot: 'bg-[#e07070]' },
  Herramientas: { color: 'text-[#2a8868]', dot: 'bg-[#4cb898]' },
  Avanzado:     { color: 'text-[#8828a8]', dot: 'bg-[#b858d8]' },
};

const ACTIVE_ICON: Record<string, string> = {
  ADN:          'text-[#4caf82]',
  Dogma:        'text-[#d4a843]',
  Patología:    'text-[#e07070]',
  Herramientas: 'text-[#4cb898]',
  Avanzado:     'text-[#b858d8]',
};

export default function ModuleProgressSidebar() {
  const { visitedModules } = useMolecularContext();
  const pathname = usePathname();
  const completed = visitedModules.length;
  const total = MODULES.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <nav className="flex flex-col gap-4 h-full overflow-y-auto" aria-label="Progreso de módulos">

      {/* Progress */}
      <div className="px-2 pb-2 border-b border-stone-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Progreso</span>
          <span className="text-xs font-bold text-[#2d7a58]">{pct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-stone-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#4caf82] transition-all duration-700"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={total}
          />
        </div>
        <p className="text-[11px] text-stone-400 mt-1">{completed} de {total} completados</p>
      </div>

      {/* Groups */}
      {GROUPS.map((group) => {
        const gs = GROUP_STYLE[group];
        const groupModules = MODULES.filter((m) => m.group === group);
        return (
          <div key={group}>
            <div className="flex items-center gap-1.5 px-2 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${gs.dot}`} />
              <p className={`text-[10px] font-bold uppercase tracking-widest ${gs.color}`}>
                {group}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              {groupModules.map((mod) => {
                const isCompleted = visitedModules.includes(mod.id);
                const isActive = pathname === mod.href;
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.id}
                    href={mod.href}
                    className={`group flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs transition-all ${
                      isActive
                        ? 'bg-white shadow-sm border border-stone-200 text-stone-700'
                        : 'text-stone-500 hover:text-stone-700 hover:bg-white/60'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      isActive
                        ? ACTIVE_ICON[group]
                        : isCompleted
                        ? 'text-stone-400'
                        : 'text-stone-300 group-hover:text-stone-400'
                    }`} />
                    <span className="flex-1 truncate font-medium">{mod.label}</span>
                    {isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4caf82] shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Evaluación */}
      <div className="mt-auto pt-2 border-t border-stone-200">
        <Link
          href="/evaluacion/pretest"
          className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs transition-all ${
            completed >= 5
              ? 'text-stone-500 hover:text-stone-700 hover:bg-white/60'
              : 'text-stone-300 cursor-not-allowed pointer-events-none'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5 shrink-0 text-[#e08840]" />
          <span className="flex-1 font-medium">Evaluación</span>
          {completed >= 5
            ? <CheckCircle2 className="w-3.5 h-3.5 text-stone-300 shrink-0" />
            : <Lock className="w-3 h-3 text-stone-300 shrink-0" />
          }
        </Link>
      </div>
    </nav>
  );
}
