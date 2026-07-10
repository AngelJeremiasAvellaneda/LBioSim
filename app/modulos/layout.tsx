'use client';

import { MolecularProvider } from '@/contexts/MolecularContext';
import { Header } from '@/components/layout';
import ModuleProgressSidebar from '@/components/ui/ModuleProgressSidebar';
import ToastNotification from '@/components/ui/ToastNotification';

export default function ModulosLayout({ children }: { children: React.ReactNode }) {
  return (
    <MolecularProvider>
      <div className="min-h-screen bg-[#f5f0eb] text-[#2d2b35] flex flex-col">
        <Header />
        <div className="flex flex-1">
          {/* Sidebar */}
          <aside
            role="navigation"
            aria-label="Progreso de módulos"
            className="hidden lg:flex w-58 flex-col shrink-0 p-3 border-r border-stone-200 bg-[#f0ebe4] sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto"
          >
            <ModuleProgressSidebar />
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 pb-12">
            <div className="max-w-3xl mx-auto lg:mx-0">
              {children}
            </div>
          </main>
        </div>
      </div>
      <ToastNotification />
    </MolecularProvider>
  );
}
