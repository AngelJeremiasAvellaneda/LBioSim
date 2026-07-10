/**
 * lib/webgl-support.ts
 *
 * Detección de soporte WebGL del navegador.
 * Se ejecuta en MolecularContext durante el montaje inicial.
 *
 * Requisitos: 2.6, 19.6
 */

/**
 * Comprueba si el navegador soporta WebGL (v2 o v1).
 *
 * Crea un elemento canvas temporal y solicita un contexto WebGL2 o WebGL1.
 * Retorna `true` si se obtiene un contexto válido, `false` en caso contrario.
 *
 * Incluye un guard de SSR: retorna `false` si `window` no está definido.
 */
export function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false; // SSR guard
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
