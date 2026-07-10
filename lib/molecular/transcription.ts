/**
 * lib/molecular/transcription.ts
 *
 * Funciones puras para la transcripción de ADN a ARNm.
 * Sin efectos secundarios; directamente testeables con property-based testing.
 *
 * Regla de transcripción (cadena codificante → ARNm):
 *   A → U, T → A, C → G, G → C
 *
 * Nota biológica: la entrada es la hebra codificante (sentido, 5'→3').
 * La ARN Polimerasa lee la hebra molde (antisentido) y sintetiza el ARNm
 * complementario, lo que equivale a sustituir T→U en la hebra codificante.
 *
 * Requisitos: 5.1–5.3, 5.8, 5.9
 */

const DNA_TO_RNA: Record<string, string> = {
  A: 'U',
  T: 'A',
  C: 'G',
  G: 'C',
};

/**
 * Transcribe una secuencia de ADN (hebra codificante) a ARNm.
 *
 * Reglas:
 *  - A → U, T → A, C → G, G → C
 *  - La entrada es case-insensitive ({a,A,t,T,c,C,g,G})
 *  - La salida siempre está en mayúsculas ({A,U,C,G})
 *  - La longitud del ARNm resultante es idéntica a la longitud de la entrada
 *  - Lanza un Error descriptivo si la secuencia contiene caracteres fuera de {A,T,C,G}
 *  - Función pura: no modifica ningún estado externo
 *
 * @param dna - DNA_Sequence válida compuesta por {A, T, C, G} (case-insensitive)
 * @returns   RNA_Sequence en mayúsculas con la misma longitud que `dna`
 * @throws    Error si `dna` contiene caracteres fuera de {A, T, C, G}
 *
 * @example
 * transcribe('ATCG')  // → 'UAGC'
 * transcribe('atcg')  // → 'UAGC'
 * transcribe('AAAA')  // → 'UUUU'
 * transcribe('TTTT')  // → 'AAAA'
 * transcribe('AX')    // throws Error
 */
export function transcribe(dna: string): string {
  const upper = dna.toUpperCase();

  // Validate: only {A, T, C, G} are allowed
  const invalidChars = upper
    .split('')
    .filter((base) => !(base in DNA_TO_RNA));

  if (invalidChars.length > 0) {
    const uniqueInvalid = [...new Set(invalidChars)].join(', ');
    throw new Error(
      `Secuencia de ADN inválida: caracteres no permitidos "${uniqueInvalid}". ` +
        `Solo se permiten los caracteres A, T, C y G (mayúsculas o minúsculas).`,
    );
  }

  // Map each DNA base to its corresponding mRNA base
  // Postcondición: resultado.length === dna.length (Req 5.8)
  return upper
    .split('')
    .map((base) => DNA_TO_RNA[base])
    .join('');
}
