'use client';

import { MolecularProvider } from '@/contexts/MolecularContext';
import { Header } from '@/components/layout';
import ToastNotification from '@/components/ui/ToastNotification';

export default function EvaluacionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MolecularProvider>
      <div className="flex flex-col min-h-screen bg-[#f5f0eb] text-[#2d2b35]">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 pb-12">
          {children}
        </main>
      </div>
      <ToastNotification />
    </MolecularProvider>
  );
}
