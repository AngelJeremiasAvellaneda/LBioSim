'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dna, LayoutGrid, FlaskConical, Trophy, ChevronLeft } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const isInModule = pathname?.startsWith('/modulos/');
  const isHome = pathname === '/';

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#f5f0eb]/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo + back */}
        <div className="flex items-center gap-3 shrink-0">
          {isInModule && (
            <Link
              href="/"
              className="flex items-center justify-center w-7 h-7 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-all -ml-1"
              aria-label="Volver al inicio"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#4caf82] flex items-center justify-center shadow-md shadow-[#4caf82]/30 transition-transform group-hover:scale-105">
              <Dna size={16} className="text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-[#2d2b35] tracking-tight text-sm">LBioSim</span>
              <span className="text-[9px] text-[#4caf82] font-mono bg-[#4caf82]/10 border border-[#4caf82]/30 px-1.5 py-0.5 rounded-full">
                v2
              </span>
            </div>
          </Link>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {[
            { href: '/',                      label: 'Inicio',      icon: LayoutGrid,  match: isHome },
            { href: '/modulos/que-es-el-adn', label: 'Módulos',    icon: Dna,         match: isInModule },
            { href: '/progreso',              label: 'Progreso',   icon: Trophy,      match: pathname === '/progreso' },
            { href: '/modulos/laboratorio',   label: 'Lab',        icon: FlaskConical, match: pathname === '/modulos/laboratorio' },
          ].map(({ href, label, icon: Icon, match }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                match
                  ? 'bg-[#4caf82]/15 text-[#2d7a58] border border-[#4caf82]/25'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf82] animate-pulse" />
            <span>Interactivo</span>
          </div>
          <Link
            href="/"
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-all"
            aria-label="Inicio"
          >
            <LayoutGrid className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
