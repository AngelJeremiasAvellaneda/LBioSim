/**
 * Módulo de Traducción del ARNm
 *
 * Contiene la lógica pura para traducir una secuencia de ARN mensajero
 * a una cadena de aminoácidos, así como el cálculo del anticodón del ARNt.
 *
 * Requisitos: 6.1–6.8
 */

import { GENETIC_CODE } from './codon-table';

/**
 * Representa un aminoácido producido durante la traducción,
 * junto con el codón del ARNm y el anticodón del ARNt correspondiente.
 */
export interface AminoAcid {
  /** Codón ARNm de 3 bases que codifica este aminoácido (ej. 'AUG') */
  codon: string;
  /** Anticodón del ARNt: complemento inverso del codón en ARN (ej. 'CAU' para AUG) */
  anticodon: string;
  /** Nombre completo del aminoácido en español (ej. 'Metionina') */
  name: string;
  /** Código de una letra (ej. 'M') */
  singleLetter: string;
  /** Código de tres letras (ej. 'Met') */
  threeLetter: string;
}

/** Mapa de complementos en ARN: A↔U, C↔G */
const RNA_COMPLEMENT: Record<string, string> = {
  A: 'U', U: 'A', C: 'G', G: 'C',
};

/**
 * Calcula el anticodón de un codón de ARNm.
 *
 * El anticodón es el complemento inverso del codón en ARN:
 *   1. Se calcula el complemento ARN de cada base (A↔U, C↔G)
 *   2. Se invierte la secuencia resultante
 *
 * Ejemplo: AUG → complemento = UAC → inverso = CAU
 *
 * @param codon - Codón ARN de 3 bases, compuesto de {A,U,C,G} en mayúsculas
 * @returns Anticodón del ARNt (3 bases, mayúsculas)
 */
export function computeAnticodon(codon: string): string {
  return codon
    .split('')
    .map(base => RNA_COMPLEMENT[base])
    .reverse()
    .join('');
}

/**
 * Traduce una secuencia de ARNm a una cadena de aminoácidos.
 *
 * Proceso:
 * - Lee la secuencia en grupos de 3 bases (codones)
 * - Consulta cada codón en la tabla genética (GENETIC_CODE)
 * - Se detiene al encontrar un codón STOP (no lo incluye en el resultado)
 * - Devuelve todos los aminoácidos traducidos hasta ese punto
 *
 * @param rna - Secuencia de ARN en mayúsculas compuesta solo por {A,U,C,G}
 * @returns Array de AminoAcid desde el primer codón hasta antes del STOP (exclusive)
 * @throws Error si rna está vacía
 * @throws Error si un codón contiene una base inválida (fuera de {A,U,C,G})
 */
export function translate(rna: string): AminoAcid[] {
  if (rna.length === 0) {
    throw new Error('La secuencia de ARN no puede estar vacía');
  }

  const upper = rna.toUpperCase();

  // Validar que todas las bases sean ARN válidas {A,U,C,G}
  if (!/^[AUCG]+$/.test(upper)) {
    const invalid = upper.split('').find(b => !/^[AUCG]$/.test(b));
    throw new Error(`Base inválida en secuencia de ARN: '${invalid}'. Solo se permiten {A, U, C, G}`);
  }

  const result: AminoAcid[] = [];

  for (let i = 0; i + 2 < upper.length; i += 3) {
    const codon = upper.slice(i, i + 3);

    // Si el codón tiene menos de 3 bases (final de secuencia no múltiplo de 3), detener
    if (codon.length < 3) break;

    const entry = GENETIC_CODE[codon];

    // Codón STOP: terminar traducción sin añadir al resultado
    if (entry === 'STOP') break;

    // Codón no encontrado en la tabla (no debería ocurrir con bases válidas,
    // pero se maneja por robustez)
    if (entry === undefined) {
      throw new Error(`Codón desconocido en la tabla genética: '${codon}'`);
    }

    result.push({
      codon,
      anticodon: computeAnticodon(codon),
      name: entry.name,
      singleLetter: entry.singleLetter,
      threeLetter: entry.threeLetter,
    });
  }

  return result;
}
