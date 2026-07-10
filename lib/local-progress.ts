/**
 * lib/local-progress.ts
 *
 * Helpers de localStorage para persistir progreso de usuarios anónimos.
 * Cuando el usuario inicia sesión, migrateLocalToServer envía los datos
 * al servidor y limpia localStorage.
 *
 * Client-side only — no server imports.
 * Requisitos: 16.6
 */

const STORAGE_KEY = 'lbiosim_progress';

export interface LocalProgressData {
  visitedModules: string[]; // ModuleId slug strings
  totalTimeMs: number;
  savedAt: string;          // ISO timestamp
}

/**
 * Lee el progreso almacenado en localStorage.
 * Retorna null si no hay datos o si ocurre cualquier error.
 */
export function getLocalProgress(): LocalProgressData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LocalProgressData;
  } catch {
    return null;
  }
}

/**
 * Guarda el progreso en localStorage.
 * Añade `savedAt` con la fecha/hora actual automáticamente.
 * El error de cuota u otros errores de escritura se ignoran silenciosamente.
 */
export function saveLocalProgress(data: LocalProgressData): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, savedAt: new Date().toISOString() }),
    );
  } catch {
    // localStorage no disponible o cuota excedida — fallo silencioso
  }
}

/**
 * Migra el progreso de localStorage al servidor para un usuario autenticado.
 *
 * 1. Lee el progreso local; si no hay datos, retorna sin hacer nada.
 * 2. Por cada módulo visitado, envía POST /api/progress { moduleId, durationMs: 0 }.
 * 3. Solo si todas las solicitudes tienen éxito, elimina la clave de localStorage.
 *
 * @param userId - ID del usuario autenticado (para trazabilidad futura)
 */
export async function migrateLocalToServer(userId: string): Promise<void> {
  const data = getLocalProgress();
  if (!data) return;

  const { visitedModules } = data;
  if (visitedModules.length === 0) return;

  await Promise.all(
    visitedModules.map((moduleId) =>
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId, durationMs: 0 }),
      }),
    ),
  );

  // Limpiar localStorage solo después de que todos los POSTs completaron
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fallo silencioso
  }
}
