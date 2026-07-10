"use client";

import { useState } from "react";
import { useSimulationStore } from "@/store/simulation-store";

type SaveState = "idle" | "saving" | "saved" | "error";

export function useSaveSimulation() {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const { sequence, steps, status, duration, algorithm, baseCount } = useSimulationStore();

  const save = async () => {
    if (status !== "accepted" && status !== "rejected") return;
    if (saveState === "saving" || saveState === "saved") return;

    setSaveState("saving");

    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sequence,
          result: status,
          steps: steps.length,
          duration,
          algorithm,
          baseCount,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSaveState("saved");
    } catch (err) {
      console.error("Failed to save simulation:", err);
      setSaveState("error");
      // Reset after 3s so user can retry
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  return { save, saveState };
}
