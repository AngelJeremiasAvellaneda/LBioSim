/**
 * Tabla del Código Genético Estándar
 *
 * Contiene las 64 entradas del código genético usando codones ARN (U en lugar de T).
 * Los nombres de los aminoácidos están en español.
 *
 * Requisitos: 6.2, 6.8
 */

export interface AminoAcidInfo {
  name: string;         // Nombre completo en español (ej. 'Alanina')
  singleLetter: string; // Código de una letra (ej. 'A')
  threeLetter: string;  // Código de tres letras (ej. 'Ala')
}

/**
 * Tabla genética completa con las 64 entradas del código estándar.
 * Los codones de parada (UAA, UAG, UGA) mapean al string literal 'STOP'.
 * Los demás codones mapean a { name, singleLetter, threeLetter }.
 */
export const GENETIC_CODE: Record<string, AminoAcidInfo | 'STOP'> = {
  // ─── Fenilalanina (Phe / F) ─────────────────────────────────────────────────
  UUU: { name: 'Fenilalanina', singleLetter: 'F', threeLetter: 'Phe' },
  UUC: { name: 'Fenilalanina', singleLetter: 'F', threeLetter: 'Phe' },

  // ─── Leucina (Leu / L) ──────────────────────────────────────────────────────
  UUA: { name: 'Leucina', singleLetter: 'L', threeLetter: 'Leu' },
  UUG: { name: 'Leucina', singleLetter: 'L', threeLetter: 'Leu' },
  CUU: { name: 'Leucina', singleLetter: 'L', threeLetter: 'Leu' },
  CUC: { name: 'Leucina', singleLetter: 'L', threeLetter: 'Leu' },
  CUA: { name: 'Leucina', singleLetter: 'L', threeLetter: 'Leu' },
  CUG: { name: 'Leucina', singleLetter: 'L', threeLetter: 'Leu' },

  // ─── Isoleucina (Ile / I) ───────────────────────────────────────────────────
  AUU: { name: 'Isoleucina', singleLetter: 'I', threeLetter: 'Ile' },
  AUC: { name: 'Isoleucina', singleLetter: 'I', threeLetter: 'Ile' },
  AUA: { name: 'Isoleucina', singleLetter: 'I', threeLetter: 'Ile' },

  // ─── Metionina / Inicio (Met / M) ───────────────────────────────────────────
  AUG: { name: 'Metionina', singleLetter: 'M', threeLetter: 'Met' },

  // ─── Valina (Val / V) ───────────────────────────────────────────────────────
  GUU: { name: 'Valina', singleLetter: 'V', threeLetter: 'Val' },
  GUC: { name: 'Valina', singleLetter: 'V', threeLetter: 'Val' },
  GUA: { name: 'Valina', singleLetter: 'V', threeLetter: 'Val' },
  GUG: { name: 'Valina', singleLetter: 'V', threeLetter: 'Val' },

  // ─── Serina (Ser / S) ───────────────────────────────────────────────────────
  UCU: { name: 'Serina', singleLetter: 'S', threeLetter: 'Ser' },
  UCC: { name: 'Serina', singleLetter: 'S', threeLetter: 'Ser' },
  UCA: { name: 'Serina', singleLetter: 'S', threeLetter: 'Ser' },
  UCG: { name: 'Serina', singleLetter: 'S', threeLetter: 'Ser' },
  AGU: { name: 'Serina', singleLetter: 'S', threeLetter: 'Ser' },
  AGC: { name: 'Serina', singleLetter: 'S', threeLetter: 'Ser' },

  // ─── Prolina (Pro / P) ──────────────────────────────────────────────────────
  CCU: { name: 'Prolina', singleLetter: 'P', threeLetter: 'Pro' },
  CCC: { name: 'Prolina', singleLetter: 'P', threeLetter: 'Pro' },
  CCA: { name: 'Prolina', singleLetter: 'P', threeLetter: 'Pro' },
  CCG: { name: 'Prolina', singleLetter: 'P', threeLetter: 'Pro' },

  // ─── Treonina (Thr / T) ─────────────────────────────────────────────────────
  ACU: { name: 'Treonina', singleLetter: 'T', threeLetter: 'Thr' },
  ACC: { name: 'Treonina', singleLetter: 'T', threeLetter: 'Thr' },
  ACA: { name: 'Treonina', singleLetter: 'T', threeLetter: 'Thr' },
  ACG: { name: 'Treonina', singleLetter: 'T', threeLetter: 'Thr' },

  // ─── Alanina (Ala / A) ──────────────────────────────────────────────────────
  GCU: { name: 'Alanina', singleLetter: 'A', threeLetter: 'Ala' },
  GCC: { name: 'Alanina', singleLetter: 'A', threeLetter: 'Ala' },
  GCA: { name: 'Alanina', singleLetter: 'A', threeLetter: 'Ala' },
  GCG: { name: 'Alanina', singleLetter: 'A', threeLetter: 'Ala' },

  // ─── Tirosina (Tyr / Y) ─────────────────────────────────────────────────────
  UAU: { name: 'Tirosina', singleLetter: 'Y', threeLetter: 'Tyr' },
  UAC: { name: 'Tirosina', singleLetter: 'Y', threeLetter: 'Tyr' },

  // ─── Codones STOP ───────────────────────────────────────────────────────────
  UAA: 'STOP',
  UAG: 'STOP',
  UGA: 'STOP',

  // ─── Histidina (His / H) ────────────────────────────────────────────────────
  CAU: { name: 'Histidina', singleLetter: 'H', threeLetter: 'His' },
  CAC: { name: 'Histidina', singleLetter: 'H', threeLetter: 'His' },

  // ─── Glutamina (Gln / Q) ────────────────────────────────────────────────────
  CAA: { name: 'Glutamina', singleLetter: 'Q', threeLetter: 'Gln' },
  CAG: { name: 'Glutamina', singleLetter: 'Q', threeLetter: 'Gln' },

  // ─── Asparagina (Asn / N) ───────────────────────────────────────────────────
  AAU: { name: 'Asparagina', singleLetter: 'N', threeLetter: 'Asn' },
  AAC: { name: 'Asparagina', singleLetter: 'N', threeLetter: 'Asn' },

  // ─── Lisina (Lys / K) ───────────────────────────────────────────────────────
  AAA: { name: 'Lisina', singleLetter: 'K', threeLetter: 'Lys' },
  AAG: { name: 'Lisina', singleLetter: 'K', threeLetter: 'Lys' },

  // ─── Ácido Aspártico (Asp / D) ──────────────────────────────────────────────
  GAU: { name: 'Ácido Aspártico', singleLetter: 'D', threeLetter: 'Asp' },
  GAC: { name: 'Ácido Aspártico', singleLetter: 'D', threeLetter: 'Asp' },

  // ─── Ácido Glutámico (Glu / E) ──────────────────────────────────────────────
  GAA: { name: 'Ácido Glutámico', singleLetter: 'E', threeLetter: 'Glu' },
  GAG: { name: 'Ácido Glutámico', singleLetter: 'E', threeLetter: 'Glu' },

  // ─── Cisteína (Cys / C) ─────────────────────────────────────────────────────
  UGU: { name: 'Cisteína', singleLetter: 'C', threeLetter: 'Cys' },
  UGC: { name: 'Cisteína', singleLetter: 'C', threeLetter: 'Cys' },

  // ─── Triptófano (Trp / W) ───────────────────────────────────────────────────
  UGG: { name: 'Triptófano', singleLetter: 'W', threeLetter: 'Trp' },

  // ─── Arginina (Arg / R) ─────────────────────────────────────────────────────
  CGU: { name: 'Arginina', singleLetter: 'R', threeLetter: 'Arg' },
  CGC: { name: 'Arginina', singleLetter: 'R', threeLetter: 'Arg' },
  CGA: { name: 'Arginina', singleLetter: 'R', threeLetter: 'Arg' },
  CGG: { name: 'Arginina', singleLetter: 'R', threeLetter: 'Arg' },
  AGA: { name: 'Arginina', singleLetter: 'R', threeLetter: 'Arg' },
  AGG: { name: 'Arginina', singleLetter: 'R', threeLetter: 'Arg' },

  // ─── Glicina (Gly / G) ──────────────────────────────────────────────────────
  GGU: { name: 'Glicina', singleLetter: 'G', threeLetter: 'Gly' },
  GGC: { name: 'Glicina', singleLetter: 'G', threeLetter: 'Gly' },
  GGA: { name: 'Glicina', singleLetter: 'G', threeLetter: 'Gly' },
  GGG: { name: 'Glicina', singleLetter: 'G', threeLetter: 'Gly' },
};

/**
 * Conjunto de codones de parada (stop codons) del código genético estándar.
 * Cuando el ribosoma encuentra uno de estos codones, la traducción termina.
 */
export const STOP_CODONS: Set<string> = new Set(['UAA', 'UAG', 'UGA']);
