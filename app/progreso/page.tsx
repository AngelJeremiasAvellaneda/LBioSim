'use client';

import Link from 'next/link';
import { useMolecularContext } from '@/contexts/MolecularContext';
import {
  CheckCircle2, Clock, BookOpen, BarChart3, Trophy,
  Dna, Wrench, RotateCw, FileText, ArrowRightLeft,
  FlaskConical, Microscope, AlertTriangle, HeartPulse,
  TestTube2, BarChart2, Target, Globe, Timer, ClipboardList,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ModuleEntry {
  id: string;
  title: string;
  icon: LucideIcon;
  href: string;
}

const MODULES: ModuleEntry[] = [
  { id: 'que-es-el-adn',    title: '¿Qué es el ADN?',    icon: Dna,           href: '/modulos/que-es-el-adn' },
  { id: 'construye-tu-adn', title: 'Construye tu ADN',    icon: Wrench,         href: '/modulos/construye-tu-adn' },
  { id: 'replicacion',      title: 'Replicación',         icon: RotateCw,       href: '/modulos/replicacion' },
  { id: 'transcripcion',    title: 'Transcripción',       icon: FileText,       href: '/modulos/transcripcion' },
  { id: 'traduccion',       title: 'Traducción',          icon: ArrowRightLeft, href: '/modulos/traduccion' },
  { id: 'aminoacidos',      title: 'Aminoácidos',         icon: FlaskConical,   href: '/modulos/aminoacidos' },
  { id: 'proteinas',        title: 'Proteínas',           icon: Microscope,     href: '/modulos/proteinas' },
  { id: 'mutaciones',       title: 'Mutaciones',          icon: AlertTriangle,  href: '/modulos/mutaciones' },
  { id: 'enfermedades',     title: 'Enfermedades',        icon: HeartPulse,     href: '/modulos/enfermedades' },
  { id: 'laboratorio',      title: 'Laboratorio Virtual', icon: TestTube2,      href: '/modulos/laboratorio' },
  { id: 'comparador',       title: 'Comparador',          icon: BarChart2,      href: '/modulos/comparador' },
  { id: 'quiz',             title: 'Quiz',                icon: Target,         href: '/modulos/quiz' },
  { id: 'modelos-3d',       title: 'Modelos 3D',          icon: Globe,          href: '/modulos/modelos-3d' },
  { id: 'dogma-temporal',   title: 'Dogma Temporal',      icon: Timer,          href: '/modulos/dogma-temporal' },
  { id: 'evaluacion',       title: 'Evaluación',          icon: ClipboardList,  href: '/evaluacion/pretest' },
];

const TOTAL_MODULES = MODULES.length;

export default function ProgresoPage() {
  const { visitedModules, totalTimeMs } = useMolecularContext();

  const totalMinutes = Math.floor(totalTimeMs / 60000);
  const completedCount = visitedModules.length;
  const completionPercent = Math.round((completedCount / TOTAL_MODULES) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-emerald-400" />
        <h1 className="text-2xl font-bold text-stone-800">Mi Progreso</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/80 border border-stone-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-stone-400 uppercase tracking-wider">Módulos completados</p>
            <p className="text-xl font-bold text-stone-800">
              {completedCount} <span className="text-sm font-normal text-stone-500">de {TOTAL_MODULES}</span>
            </p>
            <div className="w-full bg-stone-100 rounded-full h-1 mt-1.5">
              <div className="bg-emerald-500 h-1 rounded-full transition-all" style={{ width: `${completionPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 border border-stone-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900/30 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wider">Tiempo total</p>
            <p className="text-xl font-bold text-stone-800">
              {totalMinutes} <span className="text-sm font-normal text-stone-500">min</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 border border-stone-200 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#f0cc80]/40 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wider">Progreso total</p>
            <p className="text-xl font-bold text-stone-800">
              {completionPercent}<span className="text-sm font-normal text-stone-500">%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Module list */}
      {completedCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-stone-400 rounded-2xl bg-white/80 border border-stone-200 gap-2">
          <BarChart3 className="w-10 h-10 opacity-40" />
          <p className="text-sm font-medium">Aún no has visitado ningún módulo</p>
          <p className="text-xs text-stone-400">Explora los módulos de aprendizaje para ver tu progreso aquí.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/80 border border-stone-200 p-4 sm:p-5">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">Módulos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {MODULES.map((mod) => {
              const visited = visitedModules.includes(mod.id as never);
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.id}
                  href={mod.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
                    visited
                      ? 'bg-[#b8ddc8]/40 border border-emerald-800/30 hover:bg-emerald-900/30'
                      : 'bg-stone-200/60 border border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    visited ? 'bg-emerald-500/10' : 'bg-white/80'
                  }`}>
                    <Icon className={`w-3.5 h-3.5 ${visited ? 'text-emerald-400' : 'text-stone-400 group-hover:text-stone-500'}`} />
                  </div>
                  <span className={`text-sm font-medium flex-1 truncate transition-colors ${
                    visited ? 'text-stone-700' : 'text-stone-400 group-hover:text-stone-600'
                  }`}>
                    {mod.title}
                  </span>
                  {visited ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-stone-300 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
