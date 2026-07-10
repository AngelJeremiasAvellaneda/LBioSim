/**
 * lib/molecular/dna.ts
 *
 * Funciones puras para operaciones sobre secuencias de ADN.
 * Sin efectos secundarios; directamente testeables con property-based testing.
 *
 * Requisitos: 3.2, 3.8
 */

const COMPLEMENT_MAP: Record<string, string> = {
  A: 'T',
  T: 'A',
  C: 'G',
  G: 'C',
};

/**
 * Calcula el complemento directo de una secuencia de ADN (misma dirección, NO reverso-complemento).
 *
 * Reglas:
 *  - A ↔ T, C ↔ G
 *  - La entrada es case-insensitive ({a,A,t,T,c,C,g,G})
 *  - La salida siempre está en mayúsculas
 *  - Lanza un Error descriptivo si la secuencia contiene caracteres fuera de {A,T,C,G}
 *  - Función pura: no modifica ningún estado externo
 *
 * @param seq - Cadena de ADN compuesta únicamente por {A, T, C, G} (case-insensitive)
 * @returns   Cadena complementaria en mayúsculas, de la misma longitud que `seq`
 * @throws    Error si `seq` contiene caracteres fuera de {A, T, C, G}
 *
 * @example
 * computeComplement('ATCG')  // → 'TAGC'
 * computeComplement('atcg')  // → 'TAGC'
 * computeComplement('AAAA')  // → 'TTTT'
 * computeComplement('AX')    // throws Error
 */
export function computeComplement(seq: string): string {
  const upper = seq.toUpperCase();

  // Validate: only {A, T, C, G} are allowed
  const invalidChars = upper
    .split('')
    .filter((base) => !(base in COMPLEMENT_MAP));

  if (invalidChars.length > 0) {
    const uniqueInvalid = [...new Set(invalidChars)].join(', ');
    throw new Error(
      `Caracteres inválidos en la secuencia de ADN: "${uniqueInvalid}". ` +
        `Solo se permiten los caracteres A, T, C y G (mayúsculas o minúsculas).`,
    );
  }

  return upper
    .split('')
    .map((base) => COMPLEMENT_MAP[base])
    .join('');
}
