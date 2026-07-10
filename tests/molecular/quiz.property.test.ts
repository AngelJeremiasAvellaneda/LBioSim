/**
 * tests/molecular/quiz.property.test.ts
 *
 * Pruebas de propiedad para `selectQuizQuestions`.
 *
 * **Valida: Requisitos 13.2, 13.8**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { selectQuizQuestions } from '../../lib/molecular/quiz';
import { QUIZ_BANK } from '../../lib/molecular/quiz-bank';

describe('selectQuizQuestions – propiedades', () => {
  /**
   * Property 8: Selecciona exactamente `count` preguntas de forma aleatoria,
   * sin duplicados, y sin incluir ninguna de las especificadas en la lista de exclusión.
   *
   * **Valida: Requisitos 13.2, 13.8**
   */
  it('P8 – selectQuizQuestions: resultado exacto de count, sin duplicados, sin preguntas excluidas', () => {
    // Generar un conjunto de IDs de exclusión válido tal que queden al menos 10 preguntas disponibles.
    const excludeArb = fc
      .uniqueArray(
        fc.nat({ max: QUIZ_BANK.length - 1 }).map((i) => QUIZ_BANK[i].id),
        { maxLength: 30 },
      )
      .filter((exc) => QUIZ_BANK.length - exc.length >= 10);

    fc.assert(
      fc.property(excludeArb, (exclude) => {
        const count = 10;
        const result = selectQuizQuestions(QUIZ_BANK, count, exclude);
        const ids = result.map((q) => q.id);
        const excludeSet = new Set(exclude);

        expect(result.length).toBe(count);
        expect(new Set(ids).size).toBe(count); // sin duplicados
        expect(ids.every((id) => !excludeSet.has(id))).toBe(true); // no excluidas
      }),
      { numRuns: 500 },
    );
  });

  it('lanza un error si el número de preguntas disponibles después de filtrar es menor que count', () => {
    const count = QUIZ_BANK.length + 1;
    expect(() => selectQuizQuestions(QUIZ_BANK, count, [])).toThrow(Error);
  });
});
