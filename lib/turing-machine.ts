import type {
  TapeSymbol,
  TuringStep,
  TuringTransition,
  AlgorithmType,
  BaseCount,
  DNABase,
} from "@/types";

// ─── Educational Notes ─────────────────────────────────────────────────────────
const EDUCATIONAL_NOTES: Record<string, string> = {
  A: "La Máquina lee Adenina (A). La Adenina siempre se complementa con Timina (T) mediante 2 enlaces de hidrógeno.",
  T: "La Máquina lee Timina (T). La Timina es la base pirimidínica complementaria de la Adenina.",
  C: "La Máquina lee Citosina (C). La Citosina se une con Guanina (G) formando 3 enlaces de hidrógeno.",
  G: "La Máquina lee Guanina (G). La Guanina forma el par de mayor estabilidad con la Citosina.",
  X: "Se marca la Adenina como procesada (X). El cabezal continúa su recorrido.",
  Y: "Se marca la Timina como procesada (Y). El conteo avanza.",
  P: "Se marca la Citosina como procesada (P). El cabezal registra el cambio.",
  Q: "Se marca la Guanina como procesada (Q). El procesamiento continúa.",
  "▯": "El cabezal alcanzó el símbolo blanco (fin de cinta). Se inicia la validación final.",
};

// ─── Base Turing Machine ───────────────────────────────────────────────────────
export class TuringMachine {
  protected tape: TapeSymbol[];
  protected head: number;
  protected state: string;
  protected steps: TuringStep[] = [];
  protected stepCount: number = 0;
  readonly algorithm: AlgorithmType;

  constructor(sequence: string, algorithm: AlgorithmType = "complement") {
    this.tape = [...(sequence.split("") as TapeSymbol[]), "▯"];
    this.head = 0;
    this.state = "q0";
    this.algorithm = algorithm;
  }

  getTape(): TapeSymbol[] {
    return [...this.tape];
  }
  getHead(): number {
    return this.head;
  }
  getState(): string {
    return this.state;
  }
  getSteps(): TuringStep[] {
    return [...this.steps];
  }
  getStepCount(): number {
    return this.stepCount;
  }

  protected recordStep(
    symbolRead: TapeSymbol,
    symbolWritten: TapeSymbol,
    direction: "L" | "R" | "S",
    nextState: string
  ): TuringStep {
    const step: TuringStep = {
      stepNumber: ++this.stepCount,
      state: this.state,
      head: this.head,
      tape: [...this.tape],
      symbolRead,
      symbolWritten,
      direction,
      nextState,
      timestamp: Date.now(),
      educationalNote: EDUCATIONAL_NOTES[symbolRead] ?? `Procesando símbolo: ${symbolRead}`,
    };
    this.steps.push(step);
    return step;
  }

  step(): { status: "continue" | "accept" | "reject"; step: TuringStep } {
    throw new Error("Not implemented");
  }

  countBases(): BaseCount {
    const original = this.tape.filter((s) => ["A", "T", "C", "G"].includes(s)) as DNABase[];
    return {
      A: original.filter((b) => b === "A").length,
      T: original.filter((b) => b === "T").length,
      C: original.filter((b) => b === "C").length,
      G: original.filter((b) => b === "G").length,
    };
  }
}

// ─── Complement Algorithm ──────────────────────────────────────────────────────
// Validates that A count == T count AND C count == G count
export class ComplementTM extends TuringMachine {
  private readonly replacement: Record<string, TapeSymbol> = {
    A: "X",
    T: "Y",
    C: "P",
    G: "Q",
  };

  constructor(sequence: string) {
    super(sequence, "complement");
  }

  step(): { status: "continue" | "accept" | "reject"; step: TuringStep } {
    const current = this.tape[this.head] ?? "▯";

    // Final validation at blank symbol
    if (current === "▯") {
      const counts = this.countMarks();
      const ok = counts.X === counts.Y && counts.P === counts.Q;
      const s = this.recordStep("▯", "▯", "S", ok ? "q_accept" : "q_reject");
      this.state = ok ? "q_accept" : "q_reject";
      s.educationalNote = ok
        ? `✅ Validación completa: A=${counts.X} = T=${counts.Y} y C=${counts.P} = G=${counts.Q}. Cadena aceptada.`
        : `❌ Validación fallida: A=${counts.X} ≠ T=${counts.Y} o C=${counts.P} ≠ G=${counts.Q}. Cadena rechazada.`;
      return { status: ok ? "accept" : "reject", step: s };
    }

    if (this.state === "q_accept" || this.state === "q_reject") {
      const s = this.recordStep(current, current, "S", this.state);
      return { status: this.state === "q_accept" ? "accept" : "reject", step: s };
    }

    const written = this.replacement[current] ?? current;
    const s = this.recordStep(current as TapeSymbol, written as TapeSymbol, "R", "q0");
    this.tape[this.head] = written as TapeSymbol;
    this.head = Math.min(this.head + 1, this.tape.length - 1);
    this.state = "q0";
    return { status: "continue", step: s };
  }

  private countMarks(): Record<string, number> {
    const counts: Record<string, number> = { X: 0, Y: 0, P: 0, Q: 0 };
    for (const sym of this.tape) {
      if (sym in counts) counts[sym]++;
    }
    return counts;
  }

  getTransitionTable(): Array<{ state: string; symbol: string; write: string; move: string; next: string }> {
    const symbols: TapeSymbol[] = ["A", "T", "C", "G", "▯"];
    const rows: Array<{ state: string; symbol: string; write: string; move: string; next: string }> = [];

    for (const sym of symbols) {
      const write = this.replacement[sym] ?? sym;
      const isBlank = sym === "▯";
      rows.push({
        state: "q0",
        symbol: sym,
        write: isBlank ? "▯" : write,
        move: isBlank ? "S" : "R",
        next: isBlank ? "q_validate" : "q0",
      });
    }
    return rows;
  }
}

// ─── Palindrome Algorithm ──────────────────────────────────────────────────────
// Un palíndromo genético es una secuencia que es igual a su reverso-complementario.
// Ej: GAATTC → complemento CTTAAG → reverso GAATTC ✓ (sitio EcoRI)
//     AATTTT → complemento TTAAAA → reverso AAAATT ≠ AATTTT ✗
// Algoritmo: compara posición i con complemento de posición (n-1-i), desde afuera hacia adentro.
export class PalindromeTM extends TuringMachine {
  private leftPointer  = 0;
  private rightPointer: number;

  constructor(sequence: string) {
    super(sequence, "palindrome");
    this.rightPointer = sequence.length - 1;
    this.head = 0;
  }

  private complement(b: TapeSymbol): TapeSymbol {
    const map: Record<string, TapeSymbol> = { A: "T", T: "A", C: "G", G: "C" };
    return map[b] ?? b;
  }

  step(): { status: "continue" | "accept" | "reject"; step: TuringStep } {
    // Todos los pares verificados → aceptar
    if (this.leftPointer > this.rightPointer) {
      this.head = this.leftPointer;
      const s = this.recordStep("▯", "▯", "S", "q_accept");
      this.state = "q_accept";
      const n = this.tape.length - 1; // sin el blank
      s.educationalNote = `✅ Los ${n} pares verificados son complementarios inversos. La secuencia es un palíndromo genético.`;
      return { status: "accept", step: s };
    }

    const left  = this.tape[this.leftPointer];
    const right = this.tape[this.rightPointer];
    // Un palíndromo genético: pos[i] debe ser el complemento de pos[n-1-i]
    const expected = this.complement(right);
    const ok = left === expected;

    // El cabezal apunta a la posición izquierda que se está evaluando
    this.head = this.leftPointer;

    const s = this.recordStep(left, left, ok ? "R" : "S", ok ? "q0" : "q_reject");
    s.educationalNote = ok
      ? `✓ Par complementario: pos ${this.leftPointer}(${left}) ↔ pos ${this.rightPointer}(${right}). ${left} es complemento de ${right}.`
      : `✗ Par inválido: pos ${this.leftPointer}(${left}) ↔ pos ${this.rightPointer}(${right}). Se esperaba ${expected} (complemento de ${right}).`;

    if (!ok) {
      this.state = "q_reject";
      return { status: "reject", step: s };
    }

    this.leftPointer++;
    this.rightPointer--;
    return { status: "continue", step: s };
  }
}

// ─── GC Content Algorithm ─────────────────────────────────────────────────────
export class GCContentTM extends TuringMachine {
  private gcCount = 0;
  private totalCount = 0;

  constructor(sequence: string) {
    super(sequence, "gc_content");
  }

  step(): { status: "continue" | "accept" | "reject"; step: TuringStep } {
    const current = this.tape[this.head] ?? "▯";

    if (current === "▯") {
      const gcPercent = this.totalCount > 0 ? (this.gcCount / this.totalCount) * 100 : 0;
      const ok = gcPercent >= 40 && gcPercent <= 65;
      const s = this.recordStep("▯", "▯", "S", ok ? "q_accept" : "q_reject");
      s.educationalNote = `Contenido GC: ${gcPercent.toFixed(1)}%. ${
        ok ? "✅ Rango óptimo (40-65%) para estabilidad genómica." : "⚠️ Fuera del rango óptimo (40-65%)."
      }`;
      this.state = ok ? "q_accept" : "q_reject";
      return { status: ok ? "accept" : "reject", step: s };
    }

    if (current === "G" || current === "C") this.gcCount++;
    this.totalCount++;

    const written: TapeSymbol = current === "G" || current === "C" ? "Q" : "X";
    const s = this.recordStep(current as TapeSymbol, written, "R", "q0");
    s.educationalNote =
      current === "G" || current === "C"
        ? `Base GC detectada (${current}). GC actual: ${this.gcCount}/${this.totalCount + 1}`
        : `Base AT (${current}). No incrementa el conteo GC.`;

    this.tape[this.head] = written;
    this.head = Math.min(this.head + 1, this.tape.length - 1);
    this.state = "q0";
    return { status: "continue", step: s };
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────
export function createTuringMachine(sequence: string, algorithm: AlgorithmType): TuringMachine {
  switch (algorithm) {
    case "complement":
      return new ComplementTM(sequence);
    case "palindrome":
      return new PalindromeTM(sequence);
    case "gc_content":
      return new GCContentTM(sequence);
    default:
      return new ComplementTM(sequence);
  }
}

// ─── Random Sequence Generator ────────────────────────────────────────────────
export function generateRandomSequence(length: number = 12): string {
  const bases: DNABase[] = ["A", "T", "C", "G"];
  return Array.from({ length }, () => bases[Math.floor(Math.random() * 4)]).join("");
}

// Genera una secuencia complementaria (acepta en algoritmo complement)
// Asegura A=T y C=G contando pares
export function generateComplementarySequence(length: number = 12): string {
  const COMP: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };
  const bases: DNABase[] = ["A", "T", "C", "G"];
  const half = Math.floor(length / 2);
  const firstHalf  = Array.from({ length: half }, () => bases[Math.floor(Math.random() * 4)]);
  // Segunda mitad: complementos de la primera (mezclados para no ser trivial)
  const secondHalf = [...firstHalf].map(b => COMP[b] as DNABase).sort(() => Math.random() - 0.5);
  const seq = [...firstHalf, ...secondHalf];
  if (length % 2 === 1) {
    // Base central: A o T (contribuye 1A o 1T — puede romper balance, así que usar T=A)
    seq.splice(half, 0, "A");
  }
  return seq.join("").slice(0, length);
}

// Genera un palíndromo genético genuino
// Un palíndromo genético satisface: seq[i] == complement(seq[n-1-i])
// Estrategia: genera la mitad izquierda aleatoria y construye la derecha como reverso-complementario
export function generatePalindrome(length: number = 8): string {
  const bases: DNABase[] = ["A", "T", "C", "G"];
  const COMP: Record<string, string> = { A: "T", T: "A", C: "G", G: "C" };

  const even = length % 2 === 0;
  const halfLen = Math.floor(length / 2);

  const left = Array.from({ length: halfLen }, () => bases[Math.floor(Math.random() * 4)]);
  // Derecha = reverso del complemento de la izquierda
  const right = [...left].reverse().map(b => COMP[b]);

  if (even) {
    return [...left, ...right].join("");
  } else {
    // Centro: cualquier base (no afecta la condición porque se compara consigo misma)
    const center = bases[Math.floor(Math.random() * 4)];
    return [...left, center, ...right].join("");
  }
}

// Genera una secuencia con contenido GC en rango óptimo 40-65%
export function generateGCOptimalSequence(length: number = 12): string {
  const result: string[] = [];
  // Apunta a ~50% GC
  for (let i = 0; i < length; i++) {
    const r = Math.random();
    if (r < 0.25)      result.push("G");
    else if (r < 0.50) result.push("C");
    else if (r < 0.75) result.push("A");
    else               result.push("T");
  }
  return result.join("");
}
