import { Header } from "@/components/layout";
import { SimulatorView } from "@/components/simulator/SimulatorView";
import { HomeHero } from "@/components/home/HomeHero";
import { ModuleGrid } from "@/components/home/ModuleGrid";

export default function Home() {
  return (
    <>
      <Header />

      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #c8e6d4 0%, transparent 65%)", opacity: 0.7 }}
        />
        <div
          className="absolute top-1/2 -right-40 w-[450px] h-[450px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #dce8f5 0%, transparent 65%)", opacity: 0.6 }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #f0ddf0 0%, transparent 65%)", opacity: 0.5 }}
        />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pb-12">
        <HomeHero />
        <ModuleGrid />
        <div className="mt-16 pt-8 border-t border-stone-200">
          <SimulatorView />
        </div>
      </main>
    </>
  );
}
