/**
 * tests/molecular/alignment.property.test.ts
 *
 * Pruebas de propiedad para `alignSequences`.
 *
 * **Valida: Requisitos 12.8, 12.3 (del tasks.md)**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { alignSequences } from '../../lib/molecular/alignment';

const dnaSeq = fc.array(fc.constantFrom('A', 'T', 'C', 'G'), { minLength: 4, maxLength: 200 }).map((bases) => bases.join(''));
const dnaPair = fc.tuple(dnaSeq, dnaSeq);

describe('alignSequences – propiedades', () => {
  /**
   * Property 6: Alinear una secuencia consigo misma resulta en 100% de similitud.
   *
   * **Valida: Requisito 12.8**
   */
  it('P6 – alignSequences(seq, seq).similarityPercent === 100.0', () => {
    fc.assert(
      fc.property(dnaSeq, (seq) => {
        const r = alignSequences(seq, seq);
        expect(r.similarityPercent).toBe(100.0);
        expect(r.mismatches).toBe(0);
        expect(r.gaps).toBe(0);
        expect(r.matches).toBe(seq.length);
      }),
      { numRuns: 1000 },
    );
  });

  /**
   * Property 7: El porcentaje de similitud calculado coincide exactamente con la fórmula matemática especificada:
   * round((matches / alignedLength) * 100, 1).
   *
   * **Valida: Requisito 12.3**
   */
  it('P7 – similarityPercent === round((matches/alignedLength)*100, 1)', () => {
    fc.assert(
      fc.property(dnaPair, ([s1, s2]) => {
        const r = alignSequences(s1, s2);
        const expected = Math.round((r.matches / r.alignedLength) * 1000) / 10;
        expect(r.similarityPercent).toBe(expected);
      }),
      { numRuns: 1000 },
    );
  });
});
