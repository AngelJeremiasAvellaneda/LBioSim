// ─── Virtual Lab — Pure Functions ──────────────────────────────────────────────
// Req: 11.4  — Save/manage sequences in the virtual lab (max 10)

export interface SavedSeq {
  id: string;       // unique identifier (crypto.randomUUID or Date.now fallback)
  name: string;
  sequence: string;
  savedAt: string;  // ISO date string
}

const MAX_SAVED_SEQUENCES = 10;

/**
 * Saves a new sequence to the existing list.
 *
 * Pure function — does not mutate `existing` and has no side effects.
 *
 * @throws {Error} if the existing list already contains 10 sequences.
 */
export function saveSequence(
  existing: SavedSeq[],
  newSeq: { name: string; sequence: string }
): SavedSeq[] {
  if (existing.length >= MAX_SAVED_SEQUENCES) {
    throw new Error(
      `No se pueden guardar más de ${MAX_SAVED_SEQUENCES} secuencias. Elimina alguna para continuar.`
    );
  }

  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Date.now().toString();

  const entry: SavedSeq = {
    id,
    name: newSeq.name,
    sequence: newSeq.sequence,
    savedAt: new Date().toISOString(),
  };

  return [...existing, entry];
}
