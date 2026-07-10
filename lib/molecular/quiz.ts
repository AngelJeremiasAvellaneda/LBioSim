import type { Question } from './quiz-bank';

/**
 * Selects `count` random questions from `bank`, excluding any question
 * whose `id` is in the `exclude` array.
 *
 * Uses a Fisher-Yates shuffle on a filtered copy of the bank so the
 * original array is never mutated.
 *
 * @throws {Error} if the number of available questions after filtering
 *   is less than `count`.
 */
export function selectQuizQuestions(
  bank: Question[],
  count: number,
  exclude: string[],
): Question[] {
  const excludeSet = new Set(exclude);
  const filtered = bank.filter((q) => !excludeSet.has(q.id));

  if (filtered.length < count) {
    throw new Error(
      `Not enough questions: requested ${count} but only ${filtered.length} available after excluding ${exclude.length} question(s).`,
    );
  }

  // Fisher-Yates shuffle (in-place on a shallow copy)
  const pool = [...filtered];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // swap
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }

  return pool.slice(0, count);
}
