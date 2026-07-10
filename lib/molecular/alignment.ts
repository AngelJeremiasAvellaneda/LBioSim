import type { AlignmentResult } from '../../types';

/**
 * Aligns two sequences using simple end-padding with '-' gaps.
 *
 * Both sequences are uppercased and padded to the length of the longer one.
 * Statistics are computed position-by-position over the aligned sequences.
 *
 * Requirements: 12.2–12.5
 */
export function alignSequences(seq1: string, seq2: string): AlignmentResult {
  const alignedLength = Math.max(seq1.length, seq2.length);

  const seq1Aligned = seq1.toUpperCase().padEnd(alignedLength, '-');
  const seq2Aligned = seq2.toUpperCase().padEnd(alignedLength, '-');

  let matches = 0;
  let mismatches = 0;
  let gaps = 0;

  for (let i = 0; i < alignedLength; i++) {
    const c1 = seq1Aligned[i];
    const c2 = seq2Aligned[i];

    if (c1 === '-' || c2 === '-') {
      gaps++;
    } else if (c1 === c2) {
      matches++;
    } else {
      mismatches++;
    }
  }

  const similarityPercent =
    alignedLength === 0
      ? 0
      : Math.round((matches / alignedLength) * 1000) / 10;

  return {
    seq1Aligned,
    seq2Aligned,
    matches,
    mismatches,
    gaps,
    alignedLength,
    similarityPercent,
  };
}
