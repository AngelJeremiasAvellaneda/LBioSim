/**
 * Módulo de Clasificación de Mutaciones
 *
 * Contiene la lógica pura para clasificar mutaciones en secuencias de ADN:
 * sustituciones (silenciosa, missense, nonsense) e indels (frameshift).
 *
 * Requisitos: 9.1–9.7
 */

import { GENETIC_CODE, type AminoAcidInfo } from './codon-table';

// ─── Tipos exportados ─────────────────────────────────────────────────────────

/**
 * Clasificación de una mutación según su efecto en la proteína resultante.
 *
 * - `silent`     → Cambio sinónimo: el codón cambia pero el aminoácido es el mismo
 * - `missense`   → El codón cambia a uno que codifica un aminoácido diferente
 * - `nonsense`   → El codón cambia a un codón de parada (Stop prematuro)
 * - `frameshift` → Inserción o deleción que desplaza el marco de lectura
 */
export type MutationType = 'silent' | 'missense' | 'nonsense' | 'frameshift';

/**
 * Resultado completo de la clasificación de una mutación.
 */
export interface MutationResult {
  /** Tipo de mutación clasificado */
  type: MutationType;
  /** Posición 0-indexada del cambio en la secuencia */
  position: number;
  /** Codón ADN original (3 bases). Cadena vacía para frameshift */
  originalCodon: string;
  /** Codón ADN mutado (3 bases). Cadena vacía para frameshift */
  mutatedCodon: string;
  /** Aminoácido original en código de una letra. Cadena vacía para frameshift, '*' si STOP */
  originalAA: string;
  /** Aminoácido mutado en código de una letra. Cadena vacía para frameshift, '*' para nonsense */
  mutatedAA: string;
  /** Descripción humano-legible en español de la consecuencia biológica */
  description: string;
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

/**
 * Transcribe un codón de ADN a ARN (reemplaza T→U) para consultar GENETIC_CODE.
 * Asume que el codón está en mayúsculas.
 */
function dnaCodonToRNA(codon: string): string {
  return codon.replace(/T/g, 'U');
}

/**
 * Extrae el aminoácido en código de una letra a partir de una entrada de GENETIC_CODE.
 * Retorna '*' si es un codón de parada, o el singleLetter del aminoácido.
 */
function getAminoAcidLetter(entry: AminoAcidInfo | 'STOP'): string {
  if (entry === 'STOP') return '*';
  return entry.singleLetter;
}

// ─── Función principal ────────────────────────────────────────────────────────

/**
 * Clasifica una mutación en una secuencia de ADN.
 *
 * Para **indels** (longitudes diferentes): clasifica directamente como `frameshift`.
 *
 * Para **sustituciones** (misma longitud):
 * 1. Identifica el índice del codón afectado: `Math.floor(position / 3)`
 * 2. Extrae los codones original y mutado
 * 3. Convierte los codones ADN → ARN (T→U) para consultar GENETIC_CODE
 * 4. Clasifica según el efecto en el aminoácido:
 *    - Codón mutado → 'STOP': **nonsense**
 *    - Mismo aminoácido: **silent**
 *    - Aminoácido diferente: **missense**
 *
 * @param original - Secuencia de ADN original, compuesta por {A,T,C,G} en mayúsculas
 * @param mutated  - Secuencia de ADN mutada, compuesta por {A,T,C,G} en mayúsculas
 * @param position - Posición 0-indexada de la base mutada dentro de la secuencia
 * @returns MutationResult con la clasificación y descripción biológica
 */
export function classifyMutation(
  original: string,
  mutated: string,
  position: number,
): MutationResult {
  // ── Caso 1: Indel (frameshift) ─────────────────────────────────────────────
  if (original.length !== mutated.length) {
    const lenDiff = mutated.length - original.length;
    const sign = lenDiff > 0 ? '+' : '';
    return {
      type: 'frameshift',
      position,
      originalCodon: '',
      mutatedCodon: '',
      originalAA: '',
      mutatedAA: '',
      description: `Desplazamiento del marco de lectura (${sign}${lenDiff} base${Math.abs(lenDiff) !== 1 ? 's' : ''}); todos los codones aguas abajo quedan alterados`,
    };
  }

  // ── Caso 2: Sustitución puntual ────────────────────────────────────────────
  const codonIndex = Math.floor(position / 3);
  const codonStart = codonIndex * 3;

  const originalCodon = original.slice(codonStart, codonStart + 3).toUpperCase();
  const mutatedCodon  = mutated.slice(codonStart, codonStart + 3).toUpperCase();

  // Convertir codones ADN → ARN para buscar en GENETIC_CODE
  const origRNA = dnaCodonToRNA(originalCodon);
  const mutRNA  = dnaCodonToRNA(mutatedCodon);

  const origEntry = GENETIC_CODE[origRNA];
  const mutEntry  = GENETIC_CODE[mutRNA];

  const originalAA = origEntry !== undefined ? getAminoAcidLetter(origEntry) : '';
  const mutatedAA  = mutEntry  !== undefined ? getAminoAcidLetter(mutEntry)  : '';

  // ── Nonsense: el codón mutado es un codón STOP ─────────────────────────────
  if (mutEntry === 'STOP') {
    return {
      type: 'nonsense',
      position,
      originalCodon,
      mutatedCodon,
      originalAA,
      mutatedAA: '*',
      description: `Codón de parada prematuro en posición ${codonIndex + 1}; la proteína queda truncada`,
    };
  }

  // ── Silent: mismo aminoácido (sustitución sinónima) ────────────────────────
  if (
    origEntry !== undefined &&
    origEntry !== 'STOP' &&
    (origEntry as AminoAcidInfo).singleLetter === (mutEntry as AminoAcidInfo).singleLetter
  ) {
    return {
      type: 'silent',
      position,
      originalCodon,
      mutatedCodon,
      originalAA,
      mutatedAA,
      description: `Mutación sinónima en codón ${codonIndex + 1}; el aminoácido ${(origEntry as AminoAcidInfo).name} no cambia`,
    };
  }

  // ── Missense: aminoácido diferente ─────────────────────────────────────────
  const origName =
    origEntry && origEntry !== 'STOP' ? (origEntry as AminoAcidInfo).name : originalAA;
  const mutName = (mutEntry as AminoAcidInfo | undefined)?.name ?? mutatedAA;

  return {
    type: 'missense',
    position,
    originalCodon,
    mutatedCodon,
    originalAA,
    mutatedAA,
    description: `Cambio de aminoácido en codón ${codonIndex + 1}: ${origName} (${originalAA}) → ${mutName} (${mutatedAA})`,
  };
}
