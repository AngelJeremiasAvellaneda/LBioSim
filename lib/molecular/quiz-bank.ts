import type { ModuleId } from '../../types';

// ─── Question Interface ────────────────────────────────────────────────────────

export interface Question {
  id: string;
  moduleId: ModuleId;
  text: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

// ─── Quiz Bank ─────────────────────────────────────────────────────────────────
// 45 preguntas distribuidas: mínimo 2 por módulo (15 módulos),
// con al menos 10 preguntas de identificación de bases, codones o aminoácidos.

export const QUIZ_BANK: Question[] = [

  // ── que-es-el-adn (3 preguntas) ────────────────────────────────────────────
  {
    id: 'q-adn-01',
    moduleId: 'que-es-el-adn',
    text: '¿Cuál es la forma tridimensional del ADN descrita por Watson y Crick en 1953?',
    options: [
      'Hélice simple',
      'Doble hélice antiparalela',
      'Triple hélice',
      'Cadena lineal',
    ],
    correctIdx: 1,
    explanation:
      'Watson y Crick describieron el ADN como una doble hélice antiparalela, donde las dos cadenas corren en direcciones 5′→3′ opuestas estabilizadas por puentes de hidrógeno entre bases complementarias.',
  },
  {
    id: 'q-adn-02',
    moduleId: 'que-es-el-adn',
    text: '¿Cuántos puentes de hidrógeno forman el par de bases citosina–guanina (C–G)?',
    options: ['1', '2', '3', '4'],
    correctIdx: 2,
    explanation:
      'El par C–G forma tres puentes de hidrógeno, lo que lo hace más estable que el par A–T, el cual solo forma dos.',
  },
  {
    id: 'q-adn-03',
    moduleId: 'que-es-el-adn',
    text: '¿Qué azúcar forma parte del nucleótido del ADN?',
    options: ['Ribosa', 'Fructosa', '2-desoxirribosa', 'Glucosa'],
    correctIdx: 2,
    explanation:
      'Los nucleótidos del ADN contienen 2-desoxirribosa (pentosa sin oxhidrilo en C2′), a diferencia del ARN que contiene ribosa.',
  },

  // ── construye-tu-adn (3 preguntas) ────────────────────────────────────────
  {
    id: 'q-cadn-01',
    moduleId: 'construye-tu-adn',
    // Identificación de base complementaria — cuenta para el grupo de 10
    text: 'Si una cadena de ADN tiene la secuencia 5′-ATCG-3′, ¿cuál es su cadena complementaria en orientación antiparalela?',
    options: [
      '5′-TAGC-3′',
      '5′-CGAT-3′',
      '5′-ATCG-3′',
      '5′-GCTA-3′',
    ],
    correctIdx: 1,
    explanation:
      'La cadena complementaria sigue A↔T y C↔G. La cadena molde 5′-ATCG-3′ tiene como complemento 3′-TAGC-5′, que leído en dirección 5′→3′ es 5′-CGAT-3′.',
  },
  {
    id: 'q-cadn-02',
    moduleId: 'construye-tu-adn',
    // Identificación de base complementaria — cuenta para el grupo de 10
    text: '¿Cuál es la base complementaria de la Adenina en el ADN?',
    options: ['Uracilo', 'Citosina', 'Timina', 'Guanina'],
    correctIdx: 2,
    explanation:
      'En el ADN, la Adenina (A) se empareja con la Timina (T) mediante dos puentes de hidrógeno siguiendo la regla de complementariedad de Chargaff.',
  },
  {
    id: 'q-cadn-03',
    moduleId: 'construye-tu-adn',
    text: '¿Qué porcentaje de GC indica una mayor estabilidad térmica en una molécula de ADN?',
    options: ['20 %', '40 %', '60 %', 'El porcentaje de GC no afecta la estabilidad'],
    correctIdx: 2,
    explanation:
      'Un mayor contenido de GC eleva la temperatura de fusión (Tm) del ADN porque los pares C–G forman tres puentes de hidrógeno frente a los dos del par A–T.',
  },

  // ── replicacion (3 preguntas) ──────────────────────────────────────────────
  {
    id: 'q-rep-01',
    moduleId: 'replicacion',
    text: '¿Qué enzima sintetiza los nuevos fragmentos de Okazaki durante la replicación del ADN?',
    options: ['Helicasa', 'ADN ligasa', 'ADN polimerasa III', 'Topoisomerasa'],
    correctIdx: 2,
    explanation:
      'La ADN polimerasa III sintetiza los fragmentos de Okazaki en la cadena rezagada. La ADN ligasa los une posteriormente.',
  },
  {
    id: 'q-rep-02',
    moduleId: 'replicacion',
    text: '¿Cómo se denomina el mecanismo de replicación del ADN en el que cada molécula hija conserva una cadena parental?',
    options: ['Conservadora', 'Dispersiva', 'Semiconservadora', 'Bidireccional'],
    correctIdx: 2,
    explanation:
      'La replicación semiconservadora fue confirmada por el experimento de Meselson y Stahl (1958): cada molécula hija retiene una cadena molde y sintetiza una cadena nueva.',
  },
  {
    id: 'q-rep-03',
    moduleId: 'replicacion',
    text: '¿Cuál es la función de la helicasa durante la replicación?',
    options: [
      'Sintetizar el ARN cebador',
      'Separar las dos cadenas del ADN',
      'Unir los fragmentos de Okazaki',
      'Corregir errores de replicación',
    ],
    correctIdx: 1,
    explanation:
      'La helicasa rompe los puentes de hidrógeno entre las bases y separa las dos cadenas del ADN, abriendo la horquilla de replicación.',
  },

  // ── transcripcion (3 preguntas) ────────────────────────────────────────────
  {
    id: 'q-tra-01',
    moduleId: 'transcripcion',
    // Identificación de base en ARN — cuenta para el grupo de 10
    text: 'Durante la transcripción, ¿qué base del ARNm reemplaza a la Timina del ADN?',
    options: ['Adenina', 'Citosina', 'Guanina', 'Uracilo'],
    correctIdx: 3,
    explanation:
      'El ARN no contiene Timina. En su lugar usa Uracilo (U), que se empareja con la Adenina de la cadena molde de ADN durante la transcripción.',
  },
  {
    id: 'q-tra-02',
    moduleId: 'transcripcion',
    text: '¿Qué molécula cataliza la síntesis del ARN mensajero a partir de la cadena molde de ADN?',
    options: [
      'ADN polimerasa',
      'ARN polimerasa',
      'Ribosoma',
      'ARNt',
    ],
    correctIdx: 1,
    explanation:
      'La ARN polimerasa lee la cadena molde de ADN en dirección 3′→5′ y sintetiza el ARNm en dirección 5′→3′.',
  },
  {
    id: 'q-tra-03',
    moduleId: 'transcripcion',
    text: '¿Cuál de las siguientes secuencias de ADN codificante produce el ARNm 5′-AUGCGU-3′?',
    options: [
      '5′-ATGCGT-3′',
      '5′-TACGCA-3′',
      '5′-AUGCGU-3′',
      '5′-UACGCA-3′',
    ],
    correctIdx: 0,
    explanation:
      'El ARNm 5′-AUGCGU-3′ tiene la misma secuencia que la cadena codificante (no molde) del ADN, con T en lugar de U: 5′-ATGCGT-3′.',
  },

  // ── traduccion (3 preguntas) ───────────────────────────────────────────────
  {
    id: 'q-trad-01',
    moduleId: 'traduccion',
    // Identificación de codón de inicio — cuenta para el grupo de 10
    text: '¿Cuál es el codón de inicio de la traducción en eucariotas?',
    options: ['UAA', 'AUG', 'UGA', 'GUG'],
    correctIdx: 1,
    explanation:
      'AUG es el codón de inicio universal que codifica la Metionina. El ribosoma escanea el ARNm desde el extremo 5′ hasta encontrar el primer AUG.',
  },
  {
    id: 'q-trad-02',
    moduleId: 'traduccion',
    // Identificación de codones de parada — cuenta para el grupo de 10
    text: '¿Cuáles son los tres codones de parada (stop) del código genético?',
    options: [
      'UAA, UAG, UGA',
      'AUG, GUG, UUG',
      'UAA, AUA, UGG',
      'UAG, UGA, AGG',
    ],
    correctIdx: 0,
    explanation:
      'Los codones de parada son UAA (ocre), UAG (ámbar) y UGA (ópalo). No codifican ningún aminoácido; liberan el polipéptido del ribosoma.',
  },
  {
    id: 'q-trad-03',
    moduleId: 'traduccion',
    text: '¿Qué subunidad del ribosoma contiene el sitio peptidiltransferasa que forma los enlaces peptídicos?',
    options: [
      'Subunidad pequeña (40S / 30S)',
      'Subunidad grande (60S / 50S)',
      'Ambas subunidades por igual',
      'El ARNt transportador',
    ],
    correctIdx: 1,
    explanation:
      'La actividad peptidiltransferasa reside en el ARN ribosomal (ARNr 23S/28S) de la subunidad grande, que cataliza la formación del enlace peptídico entre aminoácidos consecutivos.',
  },

  // ── aminoacidos (3 preguntas) ──────────────────────────────────────────────
  {
    id: 'q-aa-01',
    moduleId: 'aminoacidos',
    // Identificación de aminoácido — cuenta para el grupo de 10
    text: '¿Qué aminoácido está codificado por el codón AUG y sirve como inicio de la traducción?',
    options: ['Leucina', 'Valina', 'Metionina', 'Alanina'],
    correctIdx: 2,
    explanation:
      'La Metionina (Met, M) es codificada por AUG y marca el inicio de la síntesis proteica. En procariotas se usa N-formilmetionina (fMet).',
  },
  {
    id: 'q-aa-02',
    moduleId: 'aminoacidos',
    // Identificación de aminoácido por código de una letra — cuenta para el grupo de 10
    text: '¿Cuál es el código de una letra del aminoácido Triptófano?',
    options: ['T', 'W', 'Y', 'R'],
    correctIdx: 1,
    explanation:
      'El Triptófano (Trp) tiene el código de una letra W. Es el único aminoácido codificado por un único codón (UGG).',
  },
  {
    id: 'q-aa-03',
    moduleId: 'aminoacidos',
    text: '¿Cuál de los siguientes aminoácidos se clasifica como no polar y alifático?',
    options: ['Serina', 'Lisina', 'Glicina', 'Ácido aspártico'],
    correctIdx: 2,
    explanation:
      'La Glicina (Gly, G) es el aminoácido más pequeño y se clasifica como no polar. Su cadena lateral es solo un átomo de hidrógeno, lo que le otorga gran flexibilidad conformacional.',
  },

  // ── proteinas (3 preguntas) ────────────────────────────────────────────────
  {
    id: 'q-pro-01',
    moduleId: 'proteinas',
    text: '¿Qué nivel de estructura proteica describe la secuencia lineal de aminoácidos unidos por enlaces peptídicos?',
    options: ['Estructura secundaria', 'Estructura terciaria', 'Estructura primaria', 'Estructura cuaternaria'],
    correctIdx: 2,
    explanation:
      'La estructura primaria es la secuencia de aminoácidos determinada por el gen. Es la base sobre la que se construyen los niveles superiores de organización.',
  },
  {
    id: 'q-pro-02',
    moduleId: 'proteinas',
    text: '¿Qué tipo de enlace covalente contribuye principalmente a estabilizar la estructura terciaria de las proteínas?',
    options: [
      'Enlace peptídico',
      'Puente disulfuro (–S–S–)',
      'Enlace fosfodiéster',
      'Enlace glucosídico',
    ],
    correctIdx: 1,
    explanation:
      'Los puentes disulfuro entre residuos de Cisteína son enlaces covalentes que estabilizan la conformación terciaria, además de interacciones no covalentes como puentes de H, fuerzas iónicas e interacciones hidrofóbicas.',
  },
  {
    id: 'q-pro-03',
    moduleId: 'proteinas',
    text: '¿Qué nombre recibe la estructura secundaria en forma de espiral estabilizada por puentes de hidrógeno intracatenarios?',
    options: ['Lámina beta', 'Hélice alfa', 'Asa aleatoria', 'Giro beta'],
    correctIdx: 1,
    explanation:
      'La hélice alfa es una estructura secundaria en espiral donde cada aminoácido forma un puente de hidrógeno con el residuo que está cuatro posiciones adelante en la cadena.',
  },

  // ── mutaciones (3 preguntas) ───────────────────────────────────────────────
  {
    id: 'q-mut-01',
    moduleId: 'mutaciones',
    // Identificación de tipo de mutación por codón — cuenta para el grupo de 10
    text: 'El codón GAG (Glutamato) muta a GTG (Valina) en la beta-globina. ¿Cómo se clasifica esta mutación?',
    options: ['Mutación silenciosa', 'Mutación missense', 'Mutación nonsense', 'Mutación frameshift'],
    correctIdx: 1,
    explanation:
      'Es una mutación missense: la sustitución de un nucleótido cambia el aminoácido codificado (Glu→Val), alterando la función de la proteína. Esta es la causa molecular de la anemia falciforme.',
  },
  {
    id: 'q-mut-02',
    moduleId: 'mutaciones',
    text: '¿Qué tipo de mutación ocurre cuando la inserción de un solo nucleótido altera el marco de lectura de todo el ARNm aguas abajo?',
    options: ['Mutación silenciosa', 'Mutación missense', 'Mutación nonsense', 'Mutación frameshift'],
    correctIdx: 3,
    explanation:
      'La mutación frameshift (corrimiento del marco) ocurre por inserciones o deleciones de nucleótidos en número no múltiplo de 3, desplazando el marco de lectura y generando una proteína completamente distinta aguas abajo.',
  },
  {
    id: 'q-mut-03',
    moduleId: 'mutaciones',
    text: '¿Qué ocurre con el aminoácido codificado cuando una mutación cambia GAA por GAG?',
    options: [
      'Se produce un aminoácido diferente',
      'Se produce un codón de parada',
      'El aminoácido no cambia (mutación silenciosa)',
      'Se produce un frameshift',
    ],
    correctIdx: 2,
    explanation:
      'GAA y GAG ambos codifican Glutamato (Glu). El cambio en el tercer nucleótido (posición degenerada) no altera el aminoácido; esto se denomina mutación sinónima o silenciosa.',
  },

  // ── enfermedades (3 preguntas) ─────────────────────────────────────────────
  {
    id: 'q-enf-01',
    moduleId: 'enfermedades',
    text: '¿Cuál es la mutación puntual que causa la anemia falciforme en la cadena beta de la hemoglobina?',
    options: [
      'Lys→Glu en posición 7',
      'Glu→Val en posición 6',
      'Val→Gly en posición 6',
      'Glu→Lys en posición 26',
    ],
    correctIdx: 1,
    explanation:
      'La sustitución del Glutamato (Glu) por Valina (Val) en la posición 6 de la beta-globina (mutación GAG→GTG) provoca la polimerización de la hemoglobina S bajo baja tensión de oxígeno.',
  },
  {
    id: 'q-enf-02',
    moduleId: 'enfermedades',
    text: '¿Qué tipo de herencia sigue la fibrosis quística?',
    options: [
      'Autosómica dominante',
      'Ligada al cromosoma X',
      'Autosómica recesiva',
      'Mitocondrial',
    ],
    correctIdx: 2,
    explanation:
      'La fibrosis quística es causada por mutaciones en el gen CFTR y sigue un patrón de herencia autosómica recesiva: ambas copias del gen deben estar mutadas para que se manifieste la enfermedad.',
  },
  {
    id: 'q-enf-03',
    moduleId: 'enfermedades',
    text: '¿Qué enfermedad está causada por una expansión de repeticiones del triplete CAG en el gen HTT?',
    options: [
      'Distrofia muscular de Duchenne',
      'Enfermedad de Huntington',
      'Síndrome de Marfan',
      'Fenilcetonuria',
    ],
    correctIdx: 1,
    explanation:
      'La enfermedad de Huntington se produce por la expansión de repeticiones del triplete CAG (que codifica Glutamina) en el gen HTT. Más de 36 repeticiones son patológicas y producen una proteína huntingtina tóxica.',
  },

  // ── laboratorio (3 preguntas) ──────────────────────────────────────────────
  {
    id: 'q-lab-01',
    moduleId: 'laboratorio',
    text: '¿Qué técnica de laboratorio permite amplificar millones de copias de un fragmento de ADN específico?',
    options: [
      'Electroforesis en gel de agarosa',
      'Reacción en cadena de la polimerasa (PCR)',
      'Secuenciación de Sanger',
      'Hibridación Southern',
    ],
    correctIdx: 1,
    explanation:
      'La PCR (Reacción en Cadena de la Polimerasa) usa ciclos de desnaturalización, hibridación de cebadores y extensión para amplificar exponencialmente un fragmento de ADN de interés.',
  },
  {
    id: 'q-lab-02',
    moduleId: 'laboratorio',
    text: '¿Cuál es el contenido máximo de GC que se considera "rico en GC" en términos de estabilidad del ADN?',
    options: ['Más del 30 %', 'Más del 50 %', 'Exactamente el 50 %', 'El GC no determina la estabilidad'],
    correctIdx: 1,
    explanation:
      'Un contenido de GC superior al 50 % suele denominarse "rico en GC". Cada par C–G contribuye con tres puentes de hidrógeno, elevando la temperatura de fusión (Tm) del ADN.',
  },
  {
    id: 'q-lab-03',
    moduleId: 'laboratorio',
    text: '¿Qué función tiene la enzima restrictasa (enzima de restricción) en biología molecular?',
    options: [
      'Sintetizar ADN a partir de ARN',
      'Cortar el ADN en secuencias específicas',
      'Reparar roturas de doble cadena',
      'Metilizar el ADN para protegerlo',
    ],
    correctIdx: 1,
    explanation:
      'Las endonucleasas de restricción reconocen y cortan secuencias palindrómicas específicas del ADN (generalmente 4-8 pb), generando fragmentos usados en clonación y análisis genético.',
  },

  // ── comparador (3 preguntas) ───────────────────────────────────────────────
  {
    id: 'q-comp-01',
    moduleId: 'comparador',
    text: '¿Qué algoritmo clásico se utiliza para el alineamiento global óptimo entre dos secuencias biológicas?',
    options: [
      'Algoritmo de Smith-Waterman',
      'Algoritmo de Needleman-Wunsch',
      'Algoritmo de BLAST',
      'Algoritmo de Viterbi',
    ],
    correctIdx: 1,
    explanation:
      'El algoritmo de Needleman-Wunsch (1970) usa programación dinámica para obtener el alineamiento global óptimo entre dos secuencias, maximizando la puntuación total incluyendo gaps.',
  },
  {
    id: 'q-comp-02',
    moduleId: 'comparador',
    text: 'Si dos secuencias de 10 bases tienen 8 coincidencias y 2 discrepancias, ¿cuál es su porcentaje de similitud?',
    options: ['20 %', '80 %', '60 %', '100 %'],
    correctIdx: 1,
    explanation:
      'Similitud = (coincidencias / longitud alineada) × 100 = (8 / 10) × 100 = 80 %. Las dos discrepancias representan el 20 % restante.',
  },
  {
    id: 'q-comp-03',
    moduleId: 'comparador',
    text: '¿Qué símbolo se usa convencionalmente para representar un gap (hueco) en un alineamiento de secuencias?',
    options: ['*', '#', '-', '~'],
    correctIdx: 2,
    explanation:
      'El guion (–) es el símbolo estándar para representar un gap o inserción/deleción en alineamientos de secuencias de nucleótidos y aminoácidos.',
  },

  // ── quiz (3 preguntas) ─────────────────────────────────────────────────────
  {
    id: 'q-quiz-01',
    moduleId: 'quiz',
    // Identificación de codón — cuenta para el grupo de 10
    text: '¿Qué aminoácido codifica el codón UUU en el ARNm?',
    options: ['Leucina', 'Fenilalanina', 'Isoleucina', 'Valina'],
    correctIdx: 1,
    explanation:
      'UUU y UUC codifican Fenilalanina (Phe, F). UUU fue el primer codón descifrado por Nirenberg y Matthaei en 1961.',
  },
  {
    id: 'q-quiz-02',
    moduleId: 'quiz',
    text: '¿Cuántos codones distintos forman el código genético estándar?',
    options: ['20', '32', '61', '64'],
    correctIdx: 3,
    explanation:
      'Con cuatro bases y tripletes, existen 4³ = 64 codones posibles. 61 codifican aminoácidos y 3 son codones de parada (UAA, UAG, UGA).',
  },
  {
    id: 'q-quiz-03',
    moduleId: 'quiz',
    text: '¿Cuántos aminoácidos distintos codifica el código genético estándar?',
    options: ['18', '20', '22', '64'],
    correctIdx: 1,
    explanation:
      'El código genético estándar codifica 20 aminoácidos canónicos. La degeneración del código (múltiples codones para un mismo AA) explica por qué 61 codones cubren solo 20 aminoácidos.',
  },

  // ── modelos-3d (3 preguntas) ───────────────────────────────────────────────
  {
    id: 'q-m3d-01',
    moduleId: 'modelos-3d',
    text: '¿Qué software de código abierto se usa ampliamente para visualizar estructuras proteicas en 3D en investigación?',
    options: ['Blender', 'PyMOL', 'AutoCAD', 'GIMP'],
    correctIdx: 1,
    explanation:
      'PyMOL es uno de los visualizadores moleculares más usados en bioinformática y bioquímica estructural. Permite representar proteínas, ácidos nucleicos y ligandos en formatos como PDB.',
  },
  {
    id: 'q-m3d-02',
    moduleId: 'modelos-3d',
    text: '¿Qué base de datos almacena las coordenadas atómicas de proteínas y ácidos nucleicos determinadas experimentalmente?',
    options: [
      'GenBank',
      'UniProt',
      'Protein Data Bank (PDB)',
      'KEGG',
    ],
    correctIdx: 2,
    explanation:
      'El Protein Data Bank (PDB) es el repositorio mundial de estructuras tridimensionales de macromoléculas biológicas determinadas por cristalografía de rayos X, crioelectromicroscopía y RMN.',
  },
  {
    id: 'q-m3d-03',
    moduleId: 'modelos-3d',
    text: '¿Cuál de las siguientes representaciones 3D muestra solo el esqueleto carbonado de la proteína (átomos Cα)?',
    options: [
      'Superficie de Van der Waals',
      'Modelo de espacio relleno (CPK)',
      'Representación de cintas (ribbon)',
      'Modelo de malla de alambre (wireframe)',
    ],
    correctIdx: 2,
    explanation:
      'La representación de cintas (ribbon/cartoon) traza únicamente el esqueleto peptídico, destacando las estructuras secundarias (hélices alfa, láminas beta) de manera esquemática.',
  },

  // ── dogma-temporal (3 preguntas) ───────────────────────────────────────────
  {
    id: 'q-dog-01',
    moduleId: 'dogma-temporal',
    text: '¿Cuál es el flujo de información del dogma central de la biología molecular propuesto por Crick?',
    options: [
      'Proteína → ARN → ADN',
      'ARN → ADN → Proteína',
      'ADN → ARN → Proteína',
      'Proteína → ADN → ARN',
    ],
    correctIdx: 2,
    explanation:
      'El dogma central establece que la información genética fluye de ADN → ARN (transcripción) → Proteína (traducción). La transcriptasa inversa demostró que también puede fluir ARN → ADN (retrotranscripción).',
  },
  {
    id: 'q-dog-02',
    moduleId: 'dogma-temporal',
    text: '¿En qué compartimento celular ocurre la transcripción en células eucariotas?',
    options: ['Citoplasma', 'Mitocondria', 'Retículo endoplasmático', 'Núcleo'],
    correctIdx: 3,
    explanation:
      'En eucariotas la transcripción ocurre en el núcleo. El ARNm producido es procesado (capping 5′, cola poli-A, splicing) antes de exportarse al citoplasma para la traducción.',
  },
  {
    id: 'q-dog-03',
    moduleId: 'dogma-temporal',
    text: '¿Qué enzima permite a los retrovirus sintetizar ADN a partir de su genoma de ARN?',
    options: [
      'ARN polimerasa dependiente de ADN',
      'Transcriptasa inversa (retrotranscriptasa)',
      'Ribonucleasa H',
      'Integrasa',
    ],
    correctIdx: 1,
    explanation:
      'La transcriptasa inversa (reverse transcriptase) es una ADN polimerasa ARN-dependiente presente en retrovirus como el VIH. Sintetiza ADNc a partir del ARN viral, permitiendo la integración en el genoma huésped.',
  },

  // ── evaluacion (3 preguntas) ───────────────────────────────────────────────
  {
    id: 'q-eval-01',
    moduleId: 'evaluacion',
    // Identificación de codón/aminoácido — cuenta para el grupo de 10
    text: '¿Qué aminoácido está codificado exclusivamente por el codón UGG?',
    options: ['Tirosina', 'Histidina', 'Triptófano', 'Cisteína'],
    correctIdx: 2,
    explanation:
      'El Triptófano (Trp, W) es el único aminoácido codificado por un solo codón: UGG. Por eso es el más raro en proteínas y tiene el mayor peso molecular de los 20 aminoácidos estándar.',
  },
  {
    id: 'q-eval-02',
    moduleId: 'evaluacion',
    text: '¿Cuál de las siguientes afirmaciones sobre el código genético es correcta?',
    options: [
      'Es ambiguo: un codón puede codificar varios aminoácidos',
      'Es degenerado: varios codones pueden codificar el mismo aminoácido',
      'Es universal solo en organismos eucariotas',
      'Cada aminoácido tiene exactamente tres codones',
    ],
    correctIdx: 1,
    explanation:
      'El código genético es degenerado (redundante): múltiples codones codifican el mismo aminoácido. Por ejemplo, la Leucina tiene 6 codones. El código también es casi universal (con pocas excepciones en mitocondrias).',
  },
  {
    id: 'q-eval-03',
    moduleId: 'evaluacion',
    text: '¿Qué estructura del ARN de transferencia (ARNt) reconoce el codón del ARNm?',
    options: [
      'Brazo aceptor de aminoácidos',
      'Bucle TΨC',
      'Bucle anticodón',
      'Brazo D',
    ],
    correctIdx: 2,
    explanation:
      'El bucle anticodón del ARNt contiene tres nucleótidos complementarios al codón del ARNm. La interacción codón–anticodón garantiza la incorporación del aminoácido correcto en la cadena polipeptídica.',
  },

]; // fin QUIZ_BANK
