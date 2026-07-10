"use client";

import { create } from "zustand";
import type { ToastMessage } from "@/types";

interface PlatformStore {
  theme: "dark" | "light";
  toast: ToastMessage | null;
  showToast: (msg: Omit<ToastMessage, "id">) => void;
  clearToast: () => void;
}

export const usePlatformStore = create<PlatformStore>((set) => ({
  theme: "dark",
  toast: null,

  showToast(msg) {
    const id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString();

    set({ toast: { id, ...msg } });

    setTimeout(() => {
      set({ toast: null });
    }, 3000);
  },

  clearToast() {
    set({ toast: null });
  },
}));
