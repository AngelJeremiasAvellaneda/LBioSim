/**
 * tests/molecular/mutations.property.test.ts
 *
 * Pruebas de propiedad para `classifyMutation`.
 *
 * **Valida: Requisito 9.8**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { classifyMutation } from '../../lib/molecular/mutations';
import { GENETIC_CODE } from '../../lib/molecular/codon-table';

const dnaBase = fc.constantFrom('A', 'T', 'C', 'G');
const dnaCodon = fc.array(dnaBase, { minLength: 3, maxLength: 3 }).map((bases) => bases.join(''));
const position = fc.integer({ min: 0, max: 2 });

describe('classifyMutation – propiedades', () => {
  /**
   * Property 5: Para toda sustitución de una sola base en cualquier posición de un codón válido,
   * `classifyMutation` debe producir la misma clasificación que la derivada directamente de consultar
   * la tabla canónica del código genético (GENETIC_CODE) con el codón original y el codón mutado.
   *
   * **Valida: Requisito 9.8**
   */
  it('P5 – classifyMutation coincide con la tabla canónica del código genético', () => {
    fc.assert(
      fc.property(dnaCodon, position, dnaBase, (codon, pos, newBase) => {
        const mutated = codon
          .split('')
          .map((b, i) => (i === pos ? newBase : b))
          .join('');
        if (mutated === codon) return; // sin cambio: skip

        const result = classifyMutation(codon, mutated, pos);
        const origRNA = codon.replace(/T/g, 'U');
        const mutRNA = mutated.replace(/T/g, 'U');
        const origEntry = GENETIC_CODE[origRNA];
        const mutEntry = GENETIC_CODE[mutRNA];

        if (mutEntry === 'STOP') {
          expect(result.type).toBe('nonsense');
        } else if (origEntry !== undefined && mutEntry !== undefined) {
          const oa = origEntry as unknown as { singleLetter: string };
          const ma = mutEntry as unknown as { singleLetter: string };
          if (oa.singleLetter === ma.singleLetter) {
            expect(result.type).toBe('silent');
          } else {
            expect(result.type).toBe('missense');
          }
        }
      }),
      { numRuns: 1000 },
    );
  });

  it('identifica frameshift para inserciones o deleciones', () => {
    fc.assert(
      fc.property(
        fc.array(dnaBase, { minLength: 3, maxLength: 30 }).map((bases) => bases.join('')),
        fc.array(dnaBase, { minLength: 3, maxLength: 30 }).map((bases) => bases.join('')),
        fc.nat(10),
        (original, mutated, pos) => {
          if (original.length === mutated.length) return;
          const result = classifyMutation(original, mutated, pos);
          expect(result.type).toBe('frameshift');
          expect(result.originalCodon).toBe('');
          expect(result.mutatedCodon).toBe('');
          expect(result.originalAA).toBe('');
          expect(result.mutatedAA).toBe('');
          expect(result.description).toContain('Desplazamiento');
        },
      ),
      { numRuns: 500 },
    );
  });
});
