"use client";

import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export function SignInButtons() {
  return (
    <div className="space-y-3">
      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5
          bg-stone-100 hover:bg-stone-200 border border-stone-300 hover:border-stone-400
          text-stone-800 text-sm font-medium rounded-lg transition-colors"
      >
        <FaGithub size={18} />
        Continuar con GitHub
      </button>

      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5
          bg-stone-100 hover:bg-stone-200 border border-stone-300 hover:border-stone-400
          text-stone-800 text-sm font-medium rounded-lg transition-colors"
      >
        <FcGoogle size={18} />
        Continuar con Google
      </button>
    </div>
  );
}
