/**
 * tests/lab/virtual-lab.property.test.ts
 *
 * Pruebas de propiedad para `saveSequence`.
 *
 * **Valida: Requisito 11.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { saveSequence } from '../../lib/lab/virtual-lab';

const dnaSeq = fc
  .array(fc.constantFrom('A', 'T', 'C', 'G'), { minLength: 4, maxLength: 200 })
  .map((bases) => bases.join(''));

const seqName = fc.string({ minLength: 1, maxLength: 80 });

/** Arbitrary para generar un SavedSeq válido sin depender de fc.date() */
const savedSeqArb = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name: seqName,
  sequence: dnaSeq,
  savedAt: fc.constant('2024-01-01T00:00:00.000Z'),
});

describe('saveSequence – propiedades', () => {
  /**
   * Property 9: Guardar dentro del límite (menos de 10 secuencias) siempre incrementa
   * el conteo en 1 y la secuencia aparece en la lista.
   *
   * **Valida: Requisito 11.4**
   */
  it('P9 – guardar secuencia dentro del límite siempre tiene éxito e incrementa el total por 1', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 9 }),
        dnaSeq,
        seqName,
        (existingCount, newSeq, name) => {
          const existing = Array.from({ length: existingCount }, (_, i) => ({
            id: `seq-${i}`,
            name: `Seq ${i}`,
            sequence: 'ATCG',
            savedAt: '2024-01-01T00:00:00.000Z',
          }));
          const result = saveSequence(existing, { name, sequence: newSeq });
          expect(result.length).toBe(existingCount + 1);
          expect(result.some((s) => s.sequence === newSeq)).toBe(true);
        },
      ),
      { numRuns: 500 },
    );
  });

  it('P9 – la secuencia guardada aparece en la lista (match por nombre y secuencia)', () => {
    fc.assert(
      fc.property(
        fc.array(savedSeqArb, { maxLength: 9 }),
        dnaSeq,
        seqName,
        (existing, newSeq, name) => {
          const result = saveSequence(existing, { name, sequence: newSeq });
          expect(result.some((s) => s.name === name && s.sequence === newSeq)).toBe(true);
        },
      ),
      { numRuns: 200 },
    );
  });

  it('P9 – no muta el array original (inmutabilidad)', () => {
    fc.assert(
      fc.property(
        fc.array(savedSeqArb, { maxLength: 9 }),
        dnaSeq,
        seqName,
        (existing, newSeq, name) => {
          const originalLength = existing.length;
          saveSequence(existing, { name, sequence: newSeq });
          expect(existing.length).toBe(originalLength);
        },
      ),
      { numRuns: 200 },
    );
  });

  it('P9 – lanza un Error cuando el array existente ya tiene 10 o más secuencias', () => {
    fc.assert(
      fc.property(
        fc.array(savedSeqArb, { minLength: 10, maxLength: 10 }),
        dnaSeq,
        seqName,
        (existing, newSeq, name) => {
          expect(() => saveSequence(existing, { name, sequence: newSeq })).toThrow(Error);
        },
      ),
      { numRuns: 100 },
    );
  });
});
