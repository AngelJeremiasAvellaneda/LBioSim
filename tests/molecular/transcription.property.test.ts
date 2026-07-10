/**
 * tests/molecular/transcription.property.test.ts
 *
 * Pruebas de propiedad para `transcribe`.
 *
 * **Valida: Requisitos 5.8, 5.9**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { transcribe } from '../../lib/molecular/transcription';
import { computeComplement } from '../../lib/molecular/dna';

// ─── Generadores ──────────────────────────────────────────────────────────────

/** Genera cadenas no vacías compuestas únicamente por {A, T, C, G} en mayúsculas. */
const validDNAArb = fc
  .array(fc.constantFrom('A', 'T', 'C', 'G'), { minLength: 1, maxLength: 200 })
  .map((bases) => bases.join(''));

// ─── Propiedad P2: transcribe(seq).length === seq.length ─────────────────────

describe('transcribe – propiedades', () => {
  /**
   * Property 2: La transcripción preserva la longitud de la secuencia.
   * Para cualquier secuencia de ADN válida `seq`:
   *   transcribe(seq).length === seq.length
   *
   * **Valida: Requisitos 5.8**
   */
  it('P2: transcribe(seq).length === seq.length para cualquier secuencia válida', () => {
    fc.assert(
      fc.property(validDNAArb, (seq) => {
        expect(transcribe(seq).length).toBe(seq.length);
      }),
      { numRuns: 1000 },
    );
  });

  // ─── Propiedad P3: backTranscribe(transcribe(seq)) === seq ───────────────────

  /**
   * Property 3: La transcripción es invertible.
   * Para cualquier secuencia de ADN válida `seq`:
   *   backTranscribe(transcribe(seq)) === seq
   * donde backTranscribe(rna) = computeComplement(rna.replace(/U/g, 'T'))
   *
   * Esto verifica que el proceso de transcripción (ADN → ARNm) puede revertirse
   * convirtiendo U→T para recuperar el ADN original.
   *
   * **Valida: Requisitos 5.9**
   */
  it('P3: backTranscribe(transcribe(seq)) === seq para cualquier secuencia válida', () => {
    fc.assert(
      fc.property(validDNAArb, (seq) => {
        const rna = transcribe(seq);
        // backTranscribe: U→T en el ARN, luego complemento de ADN
        const backTranscribed = computeComplement(rna.replace(/U/g, 'T'));
        expect(backTranscribed).toBe(seq);
      }),
      { numRuns: 1000 },
    );
  });
});
