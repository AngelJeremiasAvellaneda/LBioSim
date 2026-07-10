import { Dna } from "lucide-react";
import { SignInButtons } from "@/components/auth/SignInButtons";

export default function SignInPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Dna size={24} className="text-zinc-900" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-stone-800">LBioSim</h1>
          <p className="text-stone-400 text-sm">
            Inicia sesión para guardar tus simulaciones
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <SignInButtons />
          <p className="text-center text-xs text-stone-400">
            También puedes usar el simulador sin cuenta.
          </p>
        </div>
      </div>
    </div>
  );
}
