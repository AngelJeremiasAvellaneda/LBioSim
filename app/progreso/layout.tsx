'use client';

import { MolecularProvider } from '@/contexts/MolecularContext';
import { Header } from '@/components/layout';

export default function ProgresoLayout({ children }: { children: React.ReactNode }) {
  return (
    <MolecularProvider>
      <div className="min-h-screen bg-[#f5f0eb] text-[#2d2b35] flex flex-col">
        <Header />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 pb-12">
          {children}
        </main>
      </div>
    </MolecularProvider>
  );
}
