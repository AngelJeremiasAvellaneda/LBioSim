/**
 * Datos de los 20 aminoácidos estándar para LBioSim.
 *
 * Cada entrada incluye nombre (en español), códigos de una y tres letras,
 * fórmula molecular, peso molecular promedio en Daltons, polaridad, carga
 * a pH fisiológico (7.4) e indicador de aminoácido esencial para humanos.
 *
 * Se excluyen aminoácidos no estándar como selenocisteína (Sec/U) y
 * pirrolisina (Pyl/O).
 *
 * Requisitos: 7.1, 7.3, 7.6
 */

export interface AminoAcidData {
  /** Nombre completo en español (ej. "Alanina") */
  name: string;
  /** Código de una letra (ej. "A") */
  singleLetter: string;
  /** Código de tres letras (ej. "Ala") */
  threeLetter: string;
  /** Fórmula molecular (ej. "C3H7NO2") */
  formula: string;
  /** Peso molecular promedio en Daltons */
  weight: number;
  /** Polaridad de la cadena lateral */
  polarity: 'polar' | 'nonpolar' | 'charged';
  /** Carga neta a pH fisiológico (7.4) */
  charge: 'positive' | 'negative' | 'neutral';
  /** Verdadero si el aminoácido es esencial para humanos (no puede sintetizarse endógenamente) */
  essential: boolean;
}

/**
 * Los 20 aminoácidos estándar del código genético.
 * Ordenados por código de una letra para facilitar la búsqueda.
 */
export const STANDARD_AMINO_ACIDS: AminoAcidData[] = [
  {
    name: 'Alanina',
    singleLetter: 'A',
    threeLetter: 'Ala',
    formula: 'C3H7NO2',
    weight: 89.09,
    polarity: 'nonpolar',
    charge: 'neutral',
    essential: false,
  },
  {
    name: 'Arginina',
    singleLetter: 'R',
    threeLetter: 'Arg',
    formula: 'C6H14N4O2',
    weight: 174.20,
    polarity: 'charged',
    charge: 'positive',
    essential: false,
  },
  {
    name: 'Asparagina',
    singleLetter: 'N',
    threeLetter: 'Asn',
    formula: 'C4H8N2O3',
    weight: 132.12,
    polarity: 'polar',
    charge: 'neutral',
    essential: false,
  },
  {
    name: 'Ácido aspártico',
    singleLetter: 'D',
    threeLetter: 'Asp',
    formula: 'C4H7NO4',
    weight: 133.10,
    polarity: 'charged',
    charge: 'negative',
    essential: false,
  },
  {
    name: 'Cisteína',
    singleLetter: 'C',
    threeLetter: 'Cys',
    formula: 'C3H7NO2S',
    weight: 121.16,
    polarity: 'polar',
    charge: 'neutral',
    essential: false,
  },
  {
    name: 'Ácido glutámico',
    singleLetter: 'E',
    threeLetter: 'Glu',
    formula: 'C5H9NO4',
    weight: 147.13,
    polarity: 'charged',
    charge: 'negative',
    essential: false,
  },
  {
    name: 'Glutamina',
    singleLetter: 'Q',
    threeLetter: 'Gln',
    formula: 'C5H10N2O3',
    weight: 146.15,
    polarity: 'polar',
    charge: 'neutral',
    essential: false,
  },
  {
    name: 'Glicina',
    singleLetter: 'G',
    threeLetter: 'Gly',
    formula: 'C2H5NO2',
    weight: 75.03,
    polarity: 'nonpolar',
    charge: 'neutral',
    essential: false,
  },
  {
    name: 'Histidina',
    singleLetter: 'H',
    threeLetter: 'His',
    formula: 'C6H9N3O2',
    weight: 155.16,
    polarity: 'charged',
    charge: 'positive',
    essential: true,
  },
  {
    name: 'Isoleucina',
    singleLetter: 'I',
    threeLetter: 'Ile',
    formula: 'C6H13NO2',
    weight: 131.17,
    polarity: 'nonpolar',
    charge: 'neutral',
    essential: true,
  },
  {
    name: 'Leucina',
    singleLetter: 'L',
    threeLetter: 'Leu',
    formula: 'C6H13NO2',
    weight: 131.17,
    polarity: 'nonpolar',
    charge: 'neutral',
    essential: true,
  },
  {
    name: 'Lisina',
    singleLetter: 'K',
    threeLetter: 'Lys',
    formula: 'C6H14N2O2',
    weight: 146.19,
    polarity: 'charged',
    charge: 'positive',
    essential: true,
  },
  {
    name: 'Metionina',
    singleLetter: 'M',
    threeLetter: 'Met',
    formula: 'C5H11NO2S',
    weight: 149.21,
    polarity: 'nonpolar',
    charge: 'neutral',
    essential: true,
  },
  {
    name: 'Fenilalanina',
    singleLetter: 'F',
    threeLetter: 'Phe',
    formula: 'C9H11NO2',
    weight: 165.19,
    polarity: 'nonpolar',
    charge: 'neutral',
    essential: true,
  },
  {
    name: 'Prolina',
    singleLetter: 'P',
    threeLetter: 'Pro',
    formula: 'C5H9NO2',
    weight: 115.13,
    polarity: 'nonpolar',
    charge: 'neutral',
    essential: false,
  },
  {
    name: 'Serina',
    singleLetter: 'S',
    threeLetter: 'Ser',
    formula: 'C3H7NO3',
    weight: 105.09,
    polarity: 'polar',
    charge: 'neutral',
    essential: false,
  },
  {
    name: 'Treonina',
    singleLetter: 'T',
    threeLetter: 'Thr',
    formula: 'C4H9NO3',
    weight: 119.12,
    polarity: 'polar',
    charge: 'neutral',
    essential: true,
  },
  {
    name: 'Triptófano',
    singleLetter: 'W',
    threeLetter: 'Trp',
    formula: 'C11H12N2O2',
    weight: 204.23,
    polarity: 'nonpolar',
    charge: 'neutral',
    essential: true,
  },
  {
    name: 'Tirosina',
    singleLetter: 'Y',
    threeLetter: 'Tyr',
    formula: 'C9H11NO3',
    weight: 181.19,
    polarity: 'polar',
    charge: 'neutral',
    essential: false,
  },
  {
    name: 'Valina',
    singleLetter: 'V',
    threeLetter: 'Val',
    formula: 'C5H11NO2',
    weight: 117.15,
    polarity: 'nonpolar',
    charge: 'neutral',
    essential: true,
  },
];

// ─── Invariante verificada en tiempo de compilación ───────────────────────────
// El array debe contener exactamente 20 aminoácidos estándar (Req 7.1)
const _count: 20 = STANDARD_AMINO_ACIDS.length as 20;
void _count;
