# Documento de Requisitos

## LBioSim: Plataforma Interactiva de BiologÃ­a Molecular

**VersiÃ³n:** 1.0  
**Proyecto:** LBioSim v2  
**Stack:** Next.js 16 Â· React Three Fiber Â· GSAP Â· Framer Motion Â· Prisma Â· PostgreSQL  
**Contexto acadÃ©mico:** InvestigaciÃ³n sobre aprendizaje de replicaciÃ³n, transcripciÃ³n y traducciÃ³n del material genÃ©tico en estudiantes universitarios.

---

## Introduction

LBioSim evoluciona de un simulador de MÃ¡quinas de Turing sobre ADN a una plataforma completa de aprendizaje de BiologÃ­a Molecular. La plataforma ofrece simulaciones 3D interactivas de los procesos centrales del dogma molecular (replicaciÃ³n, transcripciÃ³n y traducciÃ³n), herramientas de laboratorio virtual, anÃ¡lisis de mutaciones y enfermedades genÃ©ticas, un sistema de evaluaciÃ³n (quiz) y modelos 3D de las molÃ©culas y proteÃ­nas involucradas. El objetivo principal es que el estudiante universitario experimente un laboratorio molecular virtual, reduciendo la carga cognitiva y aumentando la comprensiÃ³n conceptual mediante visualizaciones inmersivas. La efectividad de la plataforma se mide con pretest/postest, escala SUS (usabilidad), TAM (aceptaciÃ³n tecnolÃ³gica) y NASA-TLX (carga cognitiva).

El proyecto reutiliza la infraestructura existente: autenticaciÃ³n NextAuth (GitHub/Google), base de datos PostgreSQL con modelos User/Simulation/Account/Session, componentes de visualizaciÃ³n 3D de doble hÃ©lice con React Three Fiber, y la interfaz oscura con Tailwind v4 (tema zinc/emerald).

---

## Glossary

- **Platform**: El sistema LBioSim completo, la aplicaciÃ³n Next.js 16 desplegada.
- **Module**: SecciÃ³n temÃ¡tica independiente de la plataforma (ej. ReplicaciÃ³n, TranscripciÃ³n).
- **Student**: Usuario autenticado o anÃ³nimo que accede a los mÃ³dulos de aprendizaje.
- **DNA_Sequence**: Cadena de caracteres compuesta exclusivamente por las bases A, T, C, G.
- **RNA_Sequence**: Cadena de caracteres compuesta por las bases A, U, C, G (T se convierte en U).
- **Nucleotide**: Unidad bÃ¡sica del ADN o ARN: adenina (A), timina (T), citosina (C), guanina (G) o uracilo (U).
- **Base_Pair**: Par de nucleÃ³tidos complementarios unidos por puentes de hidrÃ³geno (A-T, C-G en ADN; A-U, C-G en ARN).
- **Helicase**: Enzima que desenrolla y separa la doble hÃ©lice de ADN durante la replicaciÃ³n.
- **DNA_Polymerase**: Enzima que sintetiza la nueva cadena de ADN durante la replicaciÃ³n.
- **RNA_Polymerase**: Enzima que sintetiza el ARNm a partir del molde de ADN durante la transcripciÃ³n.
- **mRNA**: ARN mensajero; copia del gen que porta la informaciÃ³n al ribosoma.
- **Ribosome**: Complejo molecular que traduce el ARNm en una cadena de aminoÃ¡cidos.
- **tRNA**: ARN de transferencia; lleva aminoÃ¡cidos al ribosoma segÃºn el codÃ³n del ARNm.
- **Codon**: Tripleta de bases del ARNm que codifica un aminoÃ¡cido o seÃ±al de parada.
- **Anticodon**: Tripleta del ARNt complementaria al codÃ³n del ARNm.
- **Amino_Acid**: MonÃ³mero constituyente de las proteÃ­nas; hay 20 estÃ¡ndar.
- **Protein**: Cadena de aminoÃ¡cidos plegada en una estructura 3D funcional.
- **Mutation**: Cambio en una o mÃ¡s bases de la DNA_Sequence.
- **Mutation_Type**: ClasificaciÃ³n de la mutaciÃ³n: puntual (silenciosa, missense, nonsense), inserciÃ³n o deleciÃ³n.
- **Genetic_Disease**: Enfermedad causada por mutaciones especÃ­ficas en el ADN (ej. anemia falciforme).
- **Virtual_Lab**: MÃ³dulo de la plataforma que permite al estudiante manipular secuencias y ejecutar procesos moleculares de forma libre.
- **Comparator**: Herramienta del Virtual_Lab que alinea y resalta diferencias entre dos DNA_Sequences.
- **Quiz**: MÃ³dulo de evaluaciÃ³n con preguntas de opciÃ³n mÃºltiple y retroalimentaciÃ³n inmediata.
- **Progress**: Registro persistente del avance del Student por mÃ³dulos, puntuaciones y sesiones.
- **3D_Model**: RepresentaciÃ³n visual tridimensional de una molÃ©cula renderizada con React Three Fiber.
- **Timeline**: MÃ³dulo que presenta el flujo completo ADN â†’ ReplicaciÃ³n â†’ TranscripciÃ³n â†’ TraducciÃ³n â†’ ProteÃ­na.
- **SUS_Score**: PuntuaciÃ³n de la escala System Usability Scale (0â€“100).
- **TAM_Score**: PuntuaciÃ³n del Technology Acceptance Model.
- **NASA_TLX_Score**: PuntuaciÃ³n de carga cognitiva segÃºn la escala NASA Task Load Index.

---

## Requirements

---

### Requirement 1: Pantalla Principal (Home)

**User Story:** Como estudiante, quiero ver una pantalla de bienvenida visualmente atractiva con una hÃ©lice 3D animada, para que la primera impresiÃ³n me invite a explorar la plataforma.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL render a rotating double-helix 3D_Model on the home screen using React Three Fiber within 3 seconds of page load.
2. THE Platform SHALL display animated particle effects in the background of the home screen using GSAP or Framer Motion.
3. THE Platform SHALL apply directional lighting and ambient occlusion to the home screen 3D_Model to produce depth and visual quality.
4. THE Platform SHALL display a navigation menu listing all 15 modules, accessible from the home screen within one interaction.
5. WHEN a Student is authenticated, THE Platform SHALL display the Student's name and a progress summary on the home screen.
6. IF the home screen 3D_Model fails to load due to a WebGL error, THEN THE Platform SHALL display a static fallback image of a DNA double helix and a descriptive error message.
7. THE Platform SHALL achieve a Lighthouse performance score of 70 or above on the home screen.

---

### Requirement 2: MÃ³dulo "Â¿QuÃ© es el ADN?"

**User Story:** Como estudiante, quiero explorar la estructura del ADN de forma interactiva haciendo clic en cada nucleÃ³tido, para que comprenda sus componentes, tipos de bases y enlaces de manera visual.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL render an interactive 3D_Model of a DNA segment of at least 6 Base_Pairs in the "Â¿QuÃ© es el ADN?" module.
2. WHEN a Student clicks on a Nucleotide in the 3D_Model, THE Platform SHALL display an information panel showing the Nucleotide name, base type (purine or pyrimidine), its complementary base, and the type of hydrogen bond count (2 for A-T, 3 for C-G).
3. THE Platform SHALL highlight the selected Nucleotide and its complementary Base_Pair simultaneously when a Student clicks on one member of the pair.
4. THE Platform SHALL provide written and visual explanations of the sugar-phosphate backbone, the nitrogenous bases, and the double helix structure within the module.
5. WHEN a Student hovers over a Nucleotide, THE Platform SHALL display a tooltip with the Nucleotide's single-letter code within 200ms.
6. IF a Student's device does not support WebGL, THEN THE Platform SHALL validate WebGL support before attempting any 3D rendering and, upon confirming lack of support, render a 2D interactive diagram of the DNA structure as a fallback.

---

### Requirement 3: MÃ³dulo "Construye tu ADN"

**User Story:** Como estudiante, quiero escribir una secuencia de bases ATCG y ver cÃ³mo se construye la doble hÃ©lice en 3D con su cadena complementaria, para que entienda el principio de complementariedad y la estructura del ADN.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL provide a text input field in the "Construye tu ADN" module that accepts only the characters A, T, C, and G (case-insensitive).
2. WHEN a Student enters a valid DNA_Sequence of 4 to 60 characters, THE Platform SHALL compute and display the complementary DNA_Sequence (Aâ†”T, Câ†”G) below the input.
3. WHEN a Student enters a valid DNA_Sequence, THE Platform SHALL render or update a 3D double-helix 3D_Model displaying the entered strand and its complement, with each Base_Pair color-coded (A-T in one color, C-G in another).
4. THE Platform SHALL animate the progressive construction of the 3D_Model Base_Pair by Base_Pair as the Student types, with each new pair appearing within 100ms of the keystroke.
5. IF a Student enters a character outside the set {A, T, C, G}, THEN THE Platform SHALL display an inline validation error identifying the invalid character, mark the sequence as invalid, and prevent the invalid character from appearing in the sequence.
6. IF a Student submits a DNA_Sequence shorter than 4 characters, THEN THE Platform SHALL display a message indicating the minimum required length.
7. THE Platform SHALL allow the Student to download the constructed DNA_Sequence and its complement as a plain-text file.
8. FOR ALL valid DNA_Sequences, THE Platform SHALL guarantee that computing the complement twice returns the original sequence (round-trip property: complement(complement(seq)) == seq).

---

### Requirement 4: MÃ³dulo de ReplicaciÃ³n del ADN

**User Story:** Como estudiante, quiero ver una animaciÃ³n paso a paso de la replicaciÃ³n del ADN con Helicasa, ADN Polimerasa y la nueva cadena formÃ¡ndose, para que comprenda el mecanismo semiconservativo.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL animate the DNA replication process in the following sequential order: (1) Helicase unwinds and separates the double helix, (2) DNA_Polymerase attaches to each template strand, (3) new complementary strands are synthesized 5'â†’3', (4) two identical daughter helices are formed.
2. WHEN a Student clicks "Iniciar ReplicaciÃ³n", THE Platform SHALL begin the replication animation from a resting double-helix state.
3. THE Platform SHALL label each enzyme (Helicase, DNA_Polymerase) with its name and a brief function description during the animation.
4. THE Platform SHALL provide playback controls (play, pause, step forward, step backward, speed selector with values 0.5Ã—, 1Ã—, 2Ã—) for the replication animation.
5. WHEN a Student completes the replication animation, THE Platform SHALL display both resulting daughter DNA molecules; THE Platform SHALL also display the semiconservative summary, which may appear independently of the daughter molecule display status.
6. THE Platform SHALL highlight in the 3D_Model the replication fork and the leading/lagging strands with distinct visual indicators during the animation.
7. IF the Student pauses the animation, THEN THE Platform SHALL preserve the exact animation state and resume from that point when the Student clicks play.
8. THE Platform SHALL accept a Student-supplied DNA_Sequence of 4 to 30 bases as the template for the replication animation.

---

### Requirement 5: MÃ³dulo de TranscripciÃ³n

**User Story:** Como estudiante, quiero ver cÃ³mo el ADN se transcribe a ARNm mediante la ARN Polimerasa, incluyendo la sustituciÃ³n visual de T por U, para que comprenda la diferencia entre ADN y ARN y el proceso de transcripciÃ³n.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL animate the transcription process in the following sequential order: (1) RNA_Polymerase binds to the promoter region of the DNA_Sequence, (2) the double helix opens locally, (3) RNA_Polymerase traverses the template strand synthesizing the mRNA strand, (4) the mRNA strand separates from the DNA.
2. WHEN the transcription animation synthesizes each Nucleotide, THE Platform SHALL visually replace thymine (T) with uracil (U) in the mRNA strand with a distinct color change.
3. THE Platform SHALL display the mRNA sequence as text below the 3D animation, updating character by character as the animation progresses.
4. THE Platform SHALL accept a Student-supplied DNA_Sequence of 4 to 60 bases as the template strand for the transcription animation.
5. WHEN transcription is complete, THE Platform SHALL display the full mRNA sequence and a comparison table showing template DNA strand vs. mRNA strand base by base; the comparison table SHALL only be displayed after transcription fully completes.
6. THE Platform SHALL provide playback controls (play, pause, step forward, step backward, speed: 0.5Ã—, 1Ã—, 2Ã—) for the transcription animation.
7. IF a Student enters a DNA_Sequence that contains characters outside {A, T, C, G}, THEN THE Platform SHALL display a validation error before starting the animation.
8. FOR ALL valid DNA_Sequences of length n, THE Platform SHALL guarantee that the transcribed mRNA has exactly n bases (length-invariant property).
9. FOR ALL valid DNA_Sequences, THE Platform SHALL guarantee that transcribing then reverse-complementing the mRNA produces the original coding strand (round-trip: mRNA complement with Uâ†’T substitution equals coding strand).

---

### Requirement 6: MÃ³dulo de TraducciÃ³n

**User Story:** Como estudiante, quiero ver cÃ³mo el ARNm es leÃ­do por el Ribosoma, con los ARNt aportando aminoÃ¡cidos codÃ³n a codÃ³n, para que comprenda el cÃ³digo genÃ©tico y la sÃ­ntesis de proteÃ­nas.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL animate the translation process in the following sequential order: (1) Ribosome loads onto the mRNA at the start codon AUG, (2) tRNA with the matching Anticodon delivers an Amino_Acid, (3) the Ribosome advances one Codon, (4) the process repeats until a stop codon (UAA, UAG, UGA) is reached, (5) the completed polypeptide chain is released.
2. THE Platform SHALL display the Codon being read, the Anticodon of the arriving tRNA, and the name of the delivered Amino_Acid simultaneously during the animation.
3. WHEN each Amino_Acid is added, THE Platform SHALL append it visually to the growing polypeptide chain in the 3D scene.
4. THE Platform SHALL accept a Student-supplied RNA_Sequence of 6 to 90 bases (multiple of 3) as input, or automatically use the mRNA generated by the Transcription module.
5. IF the Student-supplied RNA_Sequence does not start with AUG, THEN THE Platform SHALL display a warning that no start codon was found and offer to scan for the first AUG downstream.
6. WHEN translation is complete, THE Platform SHALL display the full amino acid sequence using single-letter codes and the count of Amino_Acids in the chain.
7. THE Platform SHALL provide playback controls (play, pause, step forward, step backward, speed: 0.5Ã—, 1Ã—, 2Ã—) for the translation animation.
8. THE Platform SHALL display a codon lookup table accessible from within the translation module, showing all 64 codons and their corresponding Amino_Acids or stop signals.
9. FOR ALL RNA_Sequences that start with AUG and end with a stop codon, THE Platform SHALL guarantee that the number of Codons translated equals (sequence_length / 3) âˆ’ 1 (stop codon excluded from amino acid count).

---

### Requirement 7: MÃ³dulo de AminoÃ¡cidos

**User Story:** Como estudiante, quiero explorar los 20 aminoÃ¡cidos estÃ¡ndar en 3D con sus propiedades bioquÃ­micas, para que entienda la diversidad quÃ­mica que determina la estructura y funciÃ³n de las proteÃ­nas.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL display exactly the 20 standard Amino_Acids in the amino acids module, filtering out any non-standard amino acids (such as selenocysteine) that may exist in the data source.
2. WHEN a Student selects an Amino_Acid, THE Platform SHALL display at minimum its full name and single-letter code; additional properties (three-letter abbreviation, molecular formula, molecular weight, polarity, charge, structural role) may be displayed partially depending on available screen space.
3. THE Platform SHALL provide filter controls to display Amino_Acids grouped by: polarity, charge, and molecular weight range (below 120 Da, 120â€“160 Da, above 160 Da).
4. THE Platform SHALL render the 3D_Model of the selected Amino_Acid showing at minimum its R-group (side chain) structure.
5. WHEN a Student searches for an Amino_Acid by name, single-letter code, or three-letter code, THE Platform SHALL display the matching result within 200ms.
6. THE Platform SHALL highlight which Amino_Acids are essential (cannot be synthesized by the human body) with a distinct visual indicator.

---

### Requirement 8: MÃ³dulo de ProteÃ­nas

**User Story:** Como estudiante, quiero ver el proceso de plegamiento de una cadena de aminoÃ¡cidos en una proteÃ­na 3D funcional, para que comprenda los niveles de organizaciÃ³n proteica.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL animate the protein folding process through the following levels: primary (linear amino acid chain), secondary (alpha helices and beta sheets), tertiary (3D fold), and optionally quaternary (multiple subunits).
2. THE Platform SHALL render the final folded Protein as an interactive 3D_Model that the Student can rotate and zoom.
3. WHEN a Student hovers over a region of the folded Protein 3D_Model, THE Platform SHALL display a label identifying the structural element (alpha helix, beta sheet, loop) and the Amino_Acids involved.
4. THE Platform SHALL provide at least 3 example proteins (e.g., hemoglobin, insulin, collagen) with pre-computed 3D_Models and educational descriptions of their biological function.
5. WHEN the Student reaches the Proteins module from the Translation module, THE Platform SHALL use the polypeptide chain produced in that session as the input for the folding animation when the chain is between 6 and 30 Amino_Acids long; for chains under 6 Amino_Acids, THE Platform SHALL also attempt the folding animation.
6. IF the polypeptide chain from the Translation module exceeds 30 Amino_Acids, THEN THE Platform SHALL use a simplified representative example protein instead and notify the Student; a simplified example may also be used for chains within the 6–30 range when technical constraints require it.

---

### Requirement 9: MÃ³dulo de Mutaciones

**User Story:** Como estudiante, quiero cambiar una base de una secuencia de ADN y ver automÃ¡ticamente quÃ© tipo de mutaciÃ³n ocurre y cuÃ¡l es su posible consecuencia biolÃ³gica, para que comprenda la relaciÃ³n entre cambios genÃ©ticos y sus efectos.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL allow the Student to select any Nucleotide position in a displayed DNA_Sequence; THE Platform SHALL validate the current base and available replacements immediately upon position selection, before any change is applied.
2. WHEN a Student introduces a base change, THE Platform SHALL classify the Mutation_Type as: silent (synonymous), missense, or nonsense, based on the effect on the resulting Codon.
3. THE Platform SHALL also detect and immediately classify insertion and deletion mutations of 1 to 3 bases as frameshift mutations, based on the size of the indel alone.
4. WHEN a Mutation is classified, THE Platform SHALL display a description of the biological consequence (no protein change, altered amino acid, premature stop codon, or reading frame shift).
5. THE Platform SHALL display a side-by-side comparison of the original and mutated DNA_Sequence, mRNA sequence, and amino acid sequence to illustrate the cascade effect of the mutation.
6. WHEN a frameshift mutation is introduced, THE Platform SHALL visually indicate all downstream codons that are shifted by highlighting them in the sequence display.
7. THE Platform SHALL display the type and consequence of the mutation within 500ms of the Student applying the change.
8. FOR ALL single-base substitutions in the same codon, THE Platform SHALL guarantee that the classification is consistent with the standard genetic code table (model-based testing against the canonical codon table).

---

### Requirement 10: MÃ³dulo de Enfermedades GenÃ©ticas

**User Story:** Como estudiante, quiero explorar enfermedades reales causadas por mutaciones especÃ­ficas, como la anemia falciforme, para que comprenda cÃ³mo un cambio mÃ­nimo en el ADN puede tener consecuencias clÃ­nicas graves.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL include at least 5 real Genetic_Disease examples, each with its causative Mutation, affected gene, and clinical consequences.
2. WHEN a Student selects a Genetic_Disease, THE Platform SHALL display the wild-type and mutant DNA_Sequence side by side with the specific mutation highlighted.
3. THE Platform SHALL animate the molecular pathway from the Mutation to the altered Protein for each Genetic_Disease, using the modules of transcription and translation.
4. THE Platform SHALL provide a clinical description of each Genetic_Disease, including: prevalence, symptoms, and current treatment approaches, limited to factual educational content.
5. WHEN a Student selects the sickle cell anemia example, THE Platform SHALL simultaneously display: the causative single nucleotide substitution, the resulting amino acid change (Glu to Val at position 6 of hemoglobin beta chain), and a 3D comparison of normal vs. sickle-shaped red blood cells; all three elements are required and must appear together.
6. THE Platform SHALL include a note on each Genetic_Disease page clarifying that the content is for educational purposes and does not constitute medical advice.

---

### Requirement 11: MÃ³dulo Laboratorio Virtual

**User Story:** Como estudiante o investigador, quiero un espacio libre para crear, modificar, transcribir, replicar, comparar y exportar secuencias de ADN, para que pueda experimentar con conceptos moleculares sin restricciones de un flujo guiado.

#### Criterios de AceptaciÃ³n

1. THE Virtual_Lab SHALL allow the Student to input a DNA_Sequence of 4 to 200 characters composed of {A, T, C, G}.
2. THE Virtual_Lab SHALL provide a toolbar with the following operations: compute complement, transcribe to mRNA, translate to amino acid chain, replicate, and compare with a second sequence.
3. WHEN the Student executes any operation, THE Virtual_Lab SHALL display the result in a dedicated output panel within 500ms.
4. THE Virtual_Lab SHALL allow the Student to save up to 10 named DNA_Sequences in the session; when a save operation is attempted within the limit, THE Virtual_Lab SHALL guarantee the sequence is successfully stored.
5. THE Virtual_Lab SHALL allow the Student to export any result (DNA sequence, mRNA, amino acid chain) as a plain-text (.txt) file.
6. WHEN the Student is authenticated, THE Virtual_Lab SHALL persist the saved sequences to the database and restore them in subsequent sessions.
7. THE Virtual_Lab SHALL display real-time base composition statistics (count and percentage of A, T, C, G; GC content percentage) for any input DNA_Sequence.
8. IF the Student inputs a DNA_Sequence longer than 200 characters, THEN THE Virtual_Lab SHALL truncate the input to 200 characters and display a notification stating the maximum length.
9. THE Virtual_Lab SHALL allow the Student to clear all current inputs and outputs with a single "Reset" action that requires a confirmation step.

---

### Requirement 12: MÃ³dulo Comparador de Secuencias

**User Story:** Como estudiante, quiero comparar dos secuencias de ADN y ver las diferencias resaltadas, para que pueda identificar mutaciones y variaciones entre secuencias de forma visual.

#### Criterios de AceptaciÃ³n

1. THE Comparator SHALL accept two DNA_Sequences of 4 to 200 characters each as input.
2. WHEN the Student submits two DNA_Sequences, THE Comparator SHALL align them and highlight every position where the bases differ using a distinct color per mismatched pair.
3. THE Comparator SHALL display a similarity percentage calculated as (matching positions / aligned length) Ã— 100, rounded to one decimal place.
4. THE Comparator SHALL display the count of matching positions, mismatching positions, and the total aligned length.
5. IF the two DNA_Sequences have different lengths, THEN THE Comparator SHALL pad the shorter sequence with gap characters (â€“) and indicate the gap count in the summary.
6. THE Comparator SHALL allow the Student to load any previously saved sequence from the Virtual_Lab into either comparison slot.
7. THE Comparator SHALL allow the Student to export the alignment result as a plain-text (.txt) file.
8. FOR ALL pairs of identical DNA_Sequences, THE Comparator SHALL return a similarity percentage of 100.0 and a mismatch count of 0 (identity invariant).

---

### Requirement 13: MÃ³dulo Quiz Interactivo

**User Story:** Como estudiante, quiero responder preguntas sobre biologÃ­a molecular con retroalimentaciÃ³n inmediata y un sistema de puntos, para que pueda evaluar y reforzar mi comprensiÃ³n de los mÃ³dulos.

#### Criterios de AceptaciÃ³n

1. THE Quiz SHALL include at least 40 questions covering all 14 other modules, with at least 2 questions per module.
2. WHEN a Student starts a quiz session, THE Quiz SHALL select 10 questions at random from the question bank.
3. WHEN a Student selects an answer, THE Quiz SHALL display immediate feedback indicating whether the answer is correct or incorrect, and provide a brief explanation (1â€“3 sentences) of the correct answer.
4. THE Quiz SHALL award 10 points for each correct answer and 0 points for each incorrect answer.
5. WHEN a quiz session ends, THE Quiz SHALL display the total score, number of correct answers, number of incorrect answers, and the time taken.
6. WHEN an authenticated Student opens the quiz history view, THE Platform SHALL display the history of the last 10 quiz sessions; quiz history display is independent of the current session state and may show while a session is in progress.
7. THE Quiz SHALL include at least 10 questions that require the Student to identify the correct complementary base, mRNA codon, or amino acid from a given DNA or RNA sequence.
8. THE Quiz SHALL not repeat any question within the same quiz session.
9. WHEN a Student completes 5 quiz sessions, THE Platform SHALL display a progress summary comparing scores across sessions using a line chart rendered with Recharts.

---

### Requirement 14: MÃ³dulo de Modelos 3D Moleculares

**User Story:** Como estudiante, quiero explorar modelos 3D de las principales molÃ©culas y proteÃ­nas que intervienen en los procesos moleculares, para que pueda comprender su estructura y funciÃ³n de manera visual e intuitiva.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL provide interactive 3D_Models for the following 9 molecules: DNA double helix, RNA (single strand), Ribosome, RNA_Polymerase, DNA_Polymerase, Helicase, Histones, Chromosome, and Cell Nucleus.
2. WHEN a Student selects a 3D_Model, THE Platform SHALL allow orbit (rotate), zoom, and pan interactions using mouse or touch controls.
3. THE Platform SHALL display a label panel alongside each 3D_Model identifying its major structural components (e.g., major groove, minor groove, phosphate backbone for DNA).
4. WHEN a Student selects a structural component label, THE Platform SHALL highlight the corresponding region in the 3D_Model and display a description of its function.
5. THE Platform SHALL display a scale indicator showing the approximate real-world size of each molecule.
6. THE Platform SHALL provide a reset button for each 3D_Model that returns it to its default orientation and zoom level; the reset operation SHALL complete even if it takes longer than 300ms.
7. IF a 3D_Model takes more than 5 seconds to load, THEN THE Platform SHALL display a loading progress indicator.
8. THE Platform SHALL maintain a frame rate of 30 frames per second or above for each 3D_Model on devices with a dedicated GPU.

---

### Requirement 15: MÃ³dulo LÃ­nea Temporal del Dogma Molecular

**User Story:** Como estudiante, quiero ver el flujo completo del dogma molecular (ADN â†’ ReplicaciÃ³n â†’ TranscripciÃ³n â†’ TraducciÃ³n â†’ ProteÃ­na) en una lÃ­nea temporal interactiva, para que comprenda la secuencia lÃ³gica y las relaciones entre todos los procesos.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL display a horizontal or vertical interactive timeline with 5 nodes representing the stages: DNA, Replication, Transcription, Translation, and Protein.
2. WHEN a Student clicks a timeline node, THE Platform SHALL display a brief animated summary (15â€“30 seconds) of that stage using the 3D animations from the corresponding module.
3. THE Platform SHALL indicate the Student's progress through the timeline by visually marking all visited modules at all times, regardless of whether the Student is currently viewing a visited stage.
4. THE Platform SHALL display connecting animations between consecutive nodes showing the molecular output of one stage becoming the input of the next (e.g., mRNA travelling from the DNA nucleus to the ribosome).
5. THE Platform SHALL provide a "Recorrer Todo" (Walk All) mode that plays all 5 stage summaries sequentially with 2-second transitions between them.
6. WHEN a Student completes the full "Recorrer Todo" sequence, THE Platform SHALL display a congratulatory message and a summary card listing the key molecules produced at each stage.
7. THE Platform SHALL allow the Student to navigate non-linearly, clicking any node at any time regardless of prior visit order.

---

### Requirement 16: Sistema de Progreso y Persistencia

**User Story:** Como estudiante autenticado, quiero que mi progreso a travÃ©s de los mÃ³dulos se guarde automÃ¡ticamente, para que pueda retomar el aprendizaje desde donde lo dejÃ© en cualquier sesiÃ³n.

#### Criterios de AceptaciÃ³n

1. WHEN an authenticated Student completes a module (reaches the end of its primary content or animation), THE Platform SHALL record that module as visited in the database.
2. THE Platform SHALL display a progress indicator on the home screen showing the number of modules visited out of 15.
3. WHEN an authenticated Student returns to the Platform, THE Platform SHALL restore the visited-module state from the database and reflect it in the navigation menu and the Timeline module; if the database restoration fails, THE Platform SHALL deny access to the session until the state can be successfully restored.
4. THE Platform SHALL persist quiz scores, quiz session timestamps, and Virtual_Lab saved sequences for authenticated Students; upon successful authentication, THE Platform SHALL initialize empty data structures for these entities even if the Student has not yet used those features.
5. WHEN an authenticated Student opens the progress dashboard, THE Platform SHALL display: total time spent on the platform (in minutes), modules completed, quiz scores history, and GC content of last 5 analyzed sequences using a bar chart rendered with Recharts.
6. IF a Student is not authenticated, THEN THE Platform SHALL store progress in the browser's localStorage and prompt the Student to sign in to persist it permanently.

---

### Requirement 17: AutenticaciÃ³n y GestiÃ³n de Sesiones

**User Story:** Como estudiante, quiero iniciar sesiÃ³n con mi cuenta de GitHub o Google, para que mi progreso y datos queden asociados a mi identidad de forma segura.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL support authentication via GitHub OAuth and Google OAuth using NextAuth.
2. WHEN a Student successfully signs in, THE Platform SHALL redirect the Student to the home screen and display a welcome message with the Student's name within 2 seconds.
3. WHEN a Student signs out, THE Platform SHALL invalidate the session token and redirect the Student to the sign-in page within 2 seconds.
4. IF an authentication attempt fails (invalid credentials or provider error), THEN THE Platform SHALL display a descriptive error message and allow the Student to retry without losing the current page context.
5. THE Platform SHALL protect all progress-related API routes so that only authenticated requests receive data, returning HTTP 401 for all unauthenticated requests, including when the authentication service itself is unavailable.
6. WHILE a Student is authenticated, THE Platform SHALL automatically refresh the session token before it expires, without interrupting the Student's interaction.

---

### Requirement 18: Accesibilidad e InternacionalizaciÃ³n

**User Story:** Como estudiante con necesidades de accesibilidad, quiero que la plataforma sea usable con teclado y lectores de pantalla, y estÃ© disponible en espaÃ±ol, para que todos los estudiantes puedan beneficiarse del aprendizaje.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL display all textual content, labels, instructions, and error messages in Spanish (es-LA locale).
2. THE Platform SHALL provide keyboard navigation for all interactive elements (buttons, inputs, 3D model info panels, quiz answers) with visible focus indicators.
3. THE Platform SHALL include ARIA labels for all interactive 3D scenes, describing the molecule being displayed and the available interactions.
4. THE Platform SHALL maintain a color contrast ratio of 4.5:1 or above for all text elements against their backgrounds, as specified by WCAG 2.1 AA.
5. THE Platform SHALL provide text alternatives for all non-text informational content (images, 3D model descriptions) through alt attributes or ARIA descriptions.
6. WHERE a Student uses a reduced-motion preference (prefers-reduced-motion: reduce), THE Platform SHALL substitute all auto-playing 3D animations with static 3D models and step-through controls; if step-through controls fail to load for a molecule, THE Platform SHALL fall back to a static 3D model only. WHILE no motion preference is set, THE Platform SHALL play auto-animations without requiring step-through controls.

---

### Requirement 19: Rendimiento y Compatibilidad

**User Story:** Como estudiante usando un computador de laboratorio universitario, quiero que la plataforma cargue rÃ¡pido y funcione correctamente en Chrome y Firefox, para que no tenga problemas tÃ©cnicos durante mis sesiones de estudio.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL load the initial page (First Contentful Paint) in under 3 seconds on a 10 Mbps connection.
2. THE Platform SHALL function correctly on the latest two stable versions of Chrome and Firefox on desktop devices with a screen width of 1280px or above.
3. THE Platform SHALL function correctly on Chrome for Android on devices with a screen width of 375px or above, with touch-based interaction for all 3D models.
4. THE Platform SHALL render all 3D scenes using lazy loading, loading each 3D_Model only when the Student navigates to the corresponding module.
5. THE Platform SHALL display a loading skeleton or progress indicator for any module that takes more than 1 second to render after navigation.
6. IF a WebGL context is lost during a 3D session, THEN THE Platform SHALL detect the loss, display an error notification, and display a "Reintentar" button that re-initializes the WebGL context without requiring a full page reload; the "Reintentar" button may also be available in the absence of a context loss event.

---

### Requirement 20: IntegraciÃ³n de EvaluaciÃ³n AcadÃ©mica (Pretest/Postest y Escalas)

**User Story:** Como investigador acadÃ©mico, quiero que la plataforma recopile datos de pretest/postest y mÃ©tricas de usabilidad (SUS, TAM, NASA-TLX) de los estudiantes participantes, para que pueda medir el impacto de la plataforma en el aprendizaje.

#### Criterios de AceptaciÃ³n

1. THE Platform SHALL provide a pretest questionnaire of 10 multiple-choice questions on molecular biology, accessible before the Student accesses the main modules.
2. THE Platform SHALL provide a postest questionnaire identical in structure to the pretest, accessible after the Student has completed at least 5 modules.
3. WHEN a Student completes either the pretest or postest questionnaire, THE Platform SHALL store the responses, score, and timestamp in the database for that specific test only.
4. THE Platform SHALL provide a SUS questionnaire (10 items, 5-point Likert scale) accessible from the settings or end-of-session screen.
5. THE Platform SHALL provide a TAM questionnaire (perceived usefulness and perceived ease of use, at least 6 items) accessible from the settings or end-of-session screen.
6. THE Platform SHALL provide a NASA-TLX questionnaire (6 subscales: Mental Demand, Physical Demand, Temporal Demand, Performance, Effort, Frustration, each rated 0â€“100) accessible from the settings or end-of-session screen.
7. WHEN an authenticated Student completes any evaluation questionnaire, THE Platform SHALL compute and store the SUS_Score, TAM_Score, or NASA_TLX_Score in the database.
8. THE Platform SHALL provide a protected administrator route (/admin/research) that displays aggregated anonymized statistics: mean and standard deviation of pretest/postest scores, SUS_Score, TAM_Score, and NASA_TLX_Score across all participants.
9. THE Platform SHALL export all evaluation data as a CSV file from the administrator route, with one row per Student per evaluation session, containing anonymized Student ID and all scale scores.
10. IF a Student attempts to submit an incomplete evaluation questionnaire, THEN THE Platform SHALL highlight the unanswered questions and prevent submission until all items are answered.

