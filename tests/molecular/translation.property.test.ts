/**
 * tests/molecular/translation.property.test.ts
 *
 * Pruebas de propiedad para `translate`.
 *
 * **Valida: Requisito 6.9**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { translate } from '../../lib/molecular/translation';
import { GENETIC_CODE } from '../../lib/molecular/codon-table';

// ─── Generadores ──────────────────────────────────────────────────────────────

/** Codones que NO son STOP (todos los codones del código genético cuyo valor !== 'STOP'). */
const nonStopCodons = Object.keys(GENETIC_CODE).filter(
  (codon) => GENETIC_CODE[codon] !== 'STOP',
);

/** Los tres codones STOP del código genético estándar. */
const stopCodons = ['UAA', 'UAG', 'UGA'] as const;

/**
 * Genera una secuencia de ARN válida de la forma:
 *   AUG + N codones no-STOP (N >= 0) + un codón STOP
 *
 * Longitud total = (N + 2) * 3
 * Resultado esperado de translate() = N + 1 aminoácidos (AUG + los N codones, sin contar el STOP)
 */
const validTranslatableRNAArb = fc
  .tuple(
    fc.array(fc.constantFrom(...nonStopCodons), { minLength: 0, maxLength: 30 }),
    fc.constantFrom(...stopCodons),
  )
  .map(([middleCodons, stopCodon]) => {
    const rna = 'AUG' + middleCodons.join('') + stopCodon;
    return { rna, n: middleCodons.length };
  });

// ─── Propiedad P4: translate(rna).length === rna.length/3 − 1 ────────────────

describe('translate – propiedades', () => {
  /**
   * Property 4: La longitud del resultado es exactamente (rna.length / 3) - 1
   * para cualquier secuencia de la forma AUG + N codones no-STOP + STOP.
   *
   * Razonamiento:
   *   - Total de codones en rna = rna.length / 3 = N + 2  (AUG + N codones + STOP)
   *   - translate() incluye AUG y los N codones intermedios, pero excluye el STOP
   *   - Por tanto resultado.length = N + 1 = (N + 2) - 1 = rna.length/3 - 1
   *
   * **Valida: Requisito 6.9**
   */
  it('P4: translate(rna).length === rna.length/3 − 1 para secuencias AUG…STOP', () => {
    fc.assert(
      fc.property(validTranslatableRNAArb, ({ rna, n }) => {
        const result = translate(rna);
        const expectedLength = rna.length / 3 - 1; // equivalente a N + 1
        expect(result.length).toBe(expectedLength);
        // Verificación adicional de consistencia con n
        expect(result.length).toBe(n + 1);
      }),
      { numRuns: 1000 },
    );
  });
});
