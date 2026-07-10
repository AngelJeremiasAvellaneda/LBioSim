/**
 * tests/molecular/dna.property.test.ts
 *
 * Pruebas de propiedad para `computeComplement`.
 *
 * **Valida: Requisito 3.8**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { computeComplement } from '../../lib/molecular/dna';

// ─── Generadores ──────────────────────────────────────────────────────────────

/** Genera cadenas no vacías compuestas únicamente por {A, T, C, G} en mayúsculas. */
const validDNAArb = fc
  .array(fc.constantFrom('A', 'T', 'C', 'G'), { minLength: 1, maxLength: 200 })
  .map((bases) => bases.join(''));

/**
 * Genera un único carácter que NO es una base DNA válida (ni mayúsculas ni minúsculas).
 * Abarca el espacio imprimible ASCII excluyendo A/T/C/G/a/t/c/g.
 */
const invalidCharArb = fc
  .integer({ min: 32, max: 126 })
  .map((n) => String.fromCharCode(n))
  .filter((c) => !/^[ATCGatcg]$/.test(c));

/** Genera cadenas no vacías con al menos un carácter inválido mezclado. */
const invalidDNAArb = fc
  .tuple(
    fc.array(fc.constantFrom('A', 'T', 'C', 'G'), { minLength: 0, maxLength: 10 }),
    invalidCharArb,
    fc.array(fc.constantFrom('A', 'T', 'C', 'G'), { minLength: 0, maxLength: 10 }),
  )
  .map(([pre, invalidChar, post]) => [...pre, invalidChar, ...post].join(''));

// ─── Propiedad P1: complement(complement(seq)) === seq ────────────────────────

describe('computeComplement – propiedades', () => {
  /**
   * Property 1: La doble complementación es la identidad.
   * Para cualquier secuencia de ADN válida `seq`:
   *   computeComplement(computeComplement(seq)) === seq
   *
   * **Valida: Requisito 3.8**
   */
  it('P1: complement(complement(seq)) === seq para cualquier secuencia válida', () => {
    fc.assert(
      fc.property(validDNAArb, (seq) => {
        expect(computeComplement(computeComplement(seq))).toBe(seq);
      }),
      { numRuns: 1000 },
    );
  });

  // ─── Insensibilidad a mayúsculas / minúsculas ────────────────────────────

  it('es insensible a mayúsculas: entrada en minúsculas produce salida en mayúsculas', () => {
    // Ejemplos concretos
    const cases: [string, string][] = [
      ['atcg', 'TAGC'],
      ['aaaa', 'TTTT'],
      ['tttt', 'AAAA'],
      ['cccc', 'GGGG'],
      ['gggg', 'CCCC'],
      ['atcgatcg', 'TAGCTAGC'],
    ];
    for (const [input, expected] of cases) {
      expect(computeComplement(input)).toBe(expected);
    }
  });

  it('es insensible a mayúsculas: propiedad – salida siempre en mayúsculas', () => {
    fc.assert(
      fc.property(validDNAArb, (seq) => {
        const lower = seq.toLowerCase();
        const result = computeComplement(lower);
        // La salida debe ser idéntica a la del input en mayúsculas
        expect(result).toBe(computeComplement(seq));
        // Y debe estar completamente en mayúsculas
        expect(result).toBe(result.toUpperCase());
      }),
      { numRuns: 500 },
    );
  });

  // ─── Caracteres inválidos ────────────────────────────────────────────────

  it('lanza Error para caracteres no DNA en ejemplos concretos', () => {
    const invalidInputs = ['AX', 'U', 'ATCGN', '123', ' ', 'ATCG!', 'ATcGx'];
    for (const input of invalidInputs) {
      expect(() => computeComplement(input)).toThrow(Error);
    }
  });

  it('lanza Error para cualquier cadena con al menos un carácter inválido', () => {
    fc.assert(
      fc.property(invalidDNAArb, (seq) => {
        expect(() => computeComplement(seq)).toThrow(Error);
      }),
      { numRuns: 500 },
    );
  });
});
