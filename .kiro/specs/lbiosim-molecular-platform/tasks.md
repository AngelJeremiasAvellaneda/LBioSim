# Implementation Plan: LBioSim — Plataforma Interactiva de Biología Molecular

## Overview

Implementar LBioSim v2 sobre la infraestructura existente (NextAuth, Prisma/PostgreSQL, DNAScene, Zustand, Tailwind v4). El orden de las tareas sigue el grafo de dependencias: primero los algoritmos puros y modelos de datos, luego las rutas API, después los contextos y componentes compartidos, y finalmente los 15 módulos de aprendizaje, el sistema de evaluación y las pruebas.

---

## Tasks

- [x] 1. Algoritmos moleculares puros (`lib/molecular/`)
  - [x] 1.1 Crear `lib/molecular/codon-table.ts` con la tabla genética completa
    - Exportar `GENETIC_CODE: Record<string, { name, singleLetter, threeLetter } | 'STOP'>` con las 64 entradas del código genético estándar
    - Exportar `STOP_CODONS: Set<string>` = `{ 'UAA', 'UAG', 'UGA' }`
    - _Requisitos: 6.2, 6.8_

  - [x] 1.2 Crear `lib/molecular/dna.ts` con `computeComplement`
    - Implementar `computeComplement(seq: string): string` que mapea A↔T, C↔G (case-insensitive, retorna mayúsculas)
    - Lanzar `Error` descriptivo para caracteres fuera de `{A,T,C,G}`
    - _Requisitos: 3.2, 3.8_

  - [x]* 1.3 Escribir prueba de propiedad P1 para `computeComplement`
    - **Property 1: complement(complement(seq)) === seq**
    - **Valida: Requisito 3.8**
    - Archivo: `tests/molecular/dna.property.test.ts`

  - [x] 1.4 Crear `lib/molecular/transcription.ts` con `transcribe`
    - Implementar `transcribe(dna: string): string` que aplica A→U, T→A, C→G, G→C
    - Validar entrada `{A,T,C,G}` y lanzar error en caso contrario
    - _Requisitos: 5.1–5.3, 5.8, 5.9_

  - [x]* 1.5 Escribir pruebas de propiedades P2 y P3 para `transcribe`
    - **Property 2: transcribe(seq).length === seq.length**
    - **Property 3: reverseComplement(transcribe(seq), U→T) === seq**
    - **Valida: Requisitos 5.8, 5.9**
    - Archivo: `tests/molecular/transcription.property.test.ts`

  - [x] 1.6 Crear `lib/molecular/translation.ts` con `translate` y `AminoAcid`
    - Implementar `translate(rna: string): AminoAcid[]` que itera codones, busca en `GENETIC_CODE`, para en `STOP`
    - Exportar interfaz `AminoAcid { codon, anticodon, name, singleLetter, threeLetter }`
    - Implementar `computeAnticodon(codon: string): string` (complemento inverso del codón ARN)
    - _Requisitos: 6.1–6.8_

  - [x]* 1.7 Escribir prueba de propiedad P4 para `translate`
    - **Property 4: translate(rna).length === rna.length/3 − 1 para secuencias AUG…STOP**
    - **Valida: Requisito 6.9**
    - Archivo: `tests/molecular/translation.property.test.ts`

  - [x] 1.8 Crear `lib/molecular/mutations.ts` con `classifyMutation`
    - Implementar `classifyMutation(original, mutated, position): MutationResult`
    - Manejar indels (frameshift) y sustituciones (silent / missense / nonsense)
    - Exportar tipo `MutationType` y interfaz `MutationResult`
    - _Requisitos: 9.1–9.7_

  - [x]* 1.9 Escribir prueba de propiedad P5 para `classifyMutation`
    - **Property 5: clasificación coherente con tabla canónica del código genético**
    - **Valida: Requisito 9.8**
    - Archivo: `tests/molecular/mutations.property.test.ts`

  - [x] 1.10 Crear `lib/molecular/alignment.ts` con `alignSequences`
    - Implementar `alignSequences(seq1, seq2): AlignmentResult` con padding con `'-'`
    - Calcular `matches`, `mismatches`, `gaps`, `similarityPercent` según fórmula del diseño
    - _Requisitos: 12.2–12.5_

  - [x]* 1.11 Escribir pruebas de propiedades P6 y P7 para `alignSequences`
    - **Property 6: alignSequences(seq, seq).similarityPercent === 100.0**
    - **Property 7: similarityPercent === round((matches/alignedLength)*100, 1)**
    - **Valida: Requisitos 12.8, 12.3**
    - Archivo: `tests/molecular/alignment.property.test.ts`

  - [x] 1.12 Crear `lib/molecular/quiz-bank.ts` con banco de preguntas
    - Definir al menos 40 preguntas tipo `Question { id, moduleId, text, options, correctIdx, explanation }`
    - Distribuir mínimo 2 preguntas por módulo (15 módulos × 2 = 30 mínimo) y al menos 10 preguntas de identificación de bases/codones/aminoácidos
    - _Requisitos: 13.1, 13.7_

  - [x] 1.13 Crear `lib/molecular/quiz.ts` con `selectQuizQuestions`
    - Implementar `selectQuizQuestions(bank, count, exclude): Question[]` con Fisher-Yates shuffle
    - Lanzar `Error` si `(bank.length − exclude.length) < count`
    - _Requisitos: 13.2, 13.8_

  - [x]* 1.14 Escribir prueba de propiedad P8 para `selectQuizQuestions`
    - **Property 8: resultado exacto de count, sin duplicados, sin preguntas excluidas**
    - **Valida: Requisitos 13.2, 13.8**
    - Archivo: `tests/molecular/quiz.property.test.ts`

  - [x] 1.15 Crear `lib/molecular/amino-acids-data.ts` con los 20 aminoácidos estándar
    - Definir array `STANDARD_AMINO_ACIDS` con `{ name, singleLetter, threeLetter, formula, weight, polarity, charge, essential }`
    - Excluir aminoácidos no estándar (selenocisteína, etc.)
    - _Requisitos: 7.1, 7.3, 7.6_

  - [x] 1.16 Crear `lib/lab/virtual-lab.ts` con `saveSequence` (lógica pura)
    - Implementar `saveSequence(existing: SavedSeq[], newSeq: { name, sequence }): SavedSeq[]`
    - Rechazar si `existing.length >= 10`; retornar nueva lista con el ítem añadido
    - _Requisitos: 11.4_

  - [x]* 1.17 Escribir prueba de propiedad P9 para `saveSequence`
    - **Property 9: guardar dentro del límite siempre incrementa el conteo en 1 y la secuencia aparece en la lista**
    - **Valida: Requisito 11.4**
    - Archivo: `tests/lab/virtual-lab.property.test.ts`

- [x] 2. Checkpoint — algoritmos puros
  - Ejecutar `vitest --run` y confirmar que todas las pruebas de propiedades P1–P9 pasan; resolver cualquier error antes de continuar.

- [x] 3. Modelos de datos Prisma y migración
  - [x] 3.1 Extender `prisma/schema.prisma` con los nuevos modelos
    - Añadir enum `ModuleId` (15 valores)
    - Añadir modelos `Progress`, `ModuleVisit`, `QuizSession`, `QuizAnswer`, `VirtualLabSequence`
    - Añadir enum `EvalType` y modelo `EvalSession`
    - Añadir relaciones al modelo `User` existente (`progress`, `quizSessions`, `virtualLabSequences`, `evalSessions`)
    - _Requisitos: 16.1, 13.4, 11.6, 20.3_

  - [x] 3.2 Generar y aplicar migración Prisma
    - Ejecutar `prisma migrate dev --name add_molecular_platform_models`
    - Ejecutar `prisma generate` para regenerar el cliente tipado
    - Verificar que los modelos existentes (User, Account, Session, Simulation, VerificationToken) no se alteran
    - _Requisitos: 16.1, 4.1_

- [x] 4. Tipos TypeScript de la plataforma molecular
  - [x] 4.1 Extender `types/index.ts` con tipos moleculares
    - Añadir `ModuleId`, `MutationType`, `MutationResult`, `AlignmentResult`, `QuizQuestion`, `QuizSessionState`, `MolecularContextState`, `EvalType`, `EvalSession`
    - Añadir `PlaybackState { status: 'idle'|'playing'|'paused'|'completed', speed: 0.5|1|2, progress: number }`
    - _Requisitos: 4.4, 5.6, 6.7_

- [ ] 5. Contextos React y estado compartido
  - [x] 5.1 Crear `contexts/MolecularContext.tsx`
    - Implementar `MolecularContext` con `activeDNA`, `activeRNA`, `activeAminoAcids`, `visitedModules`, `totalTimeMs`, `reducedMotion`, `webGLSupported`
    - Implementar acciones `setActiveDNA`, `setActiveRNA`, `setAminoAcids`, `markModuleVisited`, `setWebGLSupported`
    - Detectar `prefers-reduced-motion` en `useEffect` con `window.matchMedia`
    - _Requisitos: 16.2, 18.6_

  - [x] 5.2 Crear `lib/webgl-support.ts` con `checkWebGLSupport`
    - Implementar `checkWebGLSupport(): boolean` usando `canvas.getContext('webgl2') ?? canvas.getContext('webgl')`
    - Llamar en el `MolecularContext` provider al montar
    - _Requisitos: 2.6, 19.6_

  - [x] 5.3 Crear `lib/local-progress.ts` con helpers de localStorage
    - Implementar `getLocalProgress()`, `saveLocalProgress(data)`, `migrateLocalToServer(userId)`
    - `migrateLocalToServer` llama `POST /api/progress` por cada módulo visitado y limpia localStorage
    - _Requisitos: 16.6_

  - [x] 5.4 Crear `store/platform-store.ts` (Zustand)
    - Definir `PlatformStore { theme, toast, showToast, clearToast }`
    - _Requisitos: 11.3, 19.5_

  - [x] 5.5 Crear contextos locales de animación
    - `contexts/ReplicationContext.tsx`: `templateSequence`, `playbackState`, `currentStep`, `speed`
    - `contexts/TranscriptionContext.tsx`: `templateSequence`, `mRNABuilt`, `currentNtIndex`, `playbackState`
    - `contexts/TranslationContext.tsx`: `rnaSequence`, `currentCodonIdx`, `polypeptide`, `playbackState`
    - `contexts/QuizContext.tsx`: `sessionId`, `questions`, `currentIdx`, `answers`, `score`, `timer`
    - `contexts/LabContext.tsx`: `inputSequence`, `savedSequences`, `results`, `operationOutput`
    - `contexts/MutationContext.tsx`: `originalSeq`, `mutatedSeq`, `position`, `mutationType`, `comparison`
    - _Requisitos: 4.2–4.4, 5.2–5.3, 6.1–6.3, 13.2, 11.1–11.3, 9.1–9.4_

- [x] 6. Hook de animación reutilizable
  - [x] 6.1 Crear `components/animations/useAnimationTimeline.ts`
    - Implementar hook con `buildTimeline`, deps y retornar `AnimationControls { play, pause, stepFwd, stepBwd, setSpeed, progress, isPlaying }`
    - Crear/destruir la instancia GSAP en `useEffect` con cleanup `tl.kill()`
    - _Requisitos: 4.4, 5.6, 6.7_

- [x] 7. Componentes compartidos de UI
  - [x] 7.1 Crear `components/3d/WebGLWrapper.tsx`
    - Recibir `scene3D`, `fallback2D`, `loadingFallback` como props
    - Renderizar `fallback2D` si `!webGLSupported`; mostrar `WebGLRecoveryOverlay` en pérdida de contexto; envolver en `Suspense`
    - _Requisitos: 2.6, 19.6_

  - [x] 7.2 Crear `components/ErrorBoundary.tsx`
    - Class component con `componentDidCatch`, mensaje en español y botón "Reintentar"
    - _Requisitos: 11.4 (diseño)_

  - [x] 7.3 Crear `components/ui/PlaybackControls.tsx`
    - Botones Play/Pause, Step Forward, Step Backward, selector de velocidad (0.5×, 1×, 2×)
    - Recibir `AnimationControls` como prop; añadir ARIA labels en español
    - _Requisitos: 4.4, 5.6, 6.7_

  - [x] 7.4 Crear `components/ui/SequenceInput.tsx` (molecular)
    - Input que acepta solo `{A,T,C,G}` (case-insensitive), filtra en `onChange` y muestra error inline
    - _Requisitos: 3.1, 3.5, 3.6, 5.4, 5.7_

  - [x] 7.5 Crear `components/ui/ProgressBar.tsx` para sidebar de módulos
    - Mostrar X de 15 módulos visitados; leer `visitedModules` del `MolecularContext`
    - _Requisitos: 16.2_

  - [x] 7.6 Crear `components/ui/ToastNotification.tsx`
    - Leer `toast` del `platform-store`; mostrar/ocultar con Framer Motion
    - _Requisitos: 11.8 (diseño), 19.5_

- [x] 8. Rutas API — Progreso
  - [x] 8.1 Crear `app/api/progress/route.ts` (GET/POST)
    - `GET`: autenticación requerida; retorna `{ visitedModules, totalTimeMs, moduleVisits }`; crea `Progress` vacío si no existe
    - `POST`: body `{ moduleId, durationMs }`; upsert `Progress.visitedModules`; crea `ModuleVisit`
    - _Requisitos: 16.1, 16.2_

  - [x] 8.2 Crear `app/api/progress/[moduleId]/route.ts` (PATCH)
    - Marcar módulo como visitado de forma idempotente
    - _Requisitos: 16.1_

- [x] 9. Rutas API — Quiz
  - [x] 9.1 Crear `app/api/quiz/sessions/route.ts` (POST)
    - Crear `QuizSession` con los `questionIds` enviados por el cliente
    - _Requisitos: 13.2, 13.6_

  - [x] 9.2 Crear `app/api/quiz/sessions/[id]/route.ts` (GET/PATCH)
    - `GET`: retornar sesión con answers (solo el dueño)
    - `PATCH`: guardar answers, calcular `score/correct/incorrect`, fijar `completedAt`
    - _Requisitos: 13.4, 13.5_

  - [x] 9.3 Crear `app/api/quiz/history/route.ts` (GET)
    - Retornar últimas 10 `QuizSession` ordenadas por `createdAt desc`
    - _Requisitos: 13.6_

- [x] 10. Rutas API — Laboratorio Virtual
  - [x] 10.1 Crear `app/api/lab/sequences/route.ts` (GET/POST)
    - `GET`: lista de `VirtualLabSequence` del usuario (máx 10)
    - `POST`: validar `sequence {A,T,C,G} 4-200 chars`; rechazar 400 si ya tiene 10 secuencias
    - _Requisitos: 11.4, 11.6_

  - [x] 10.2 Crear `app/api/lab/sequences/[id]/route.ts` (DELETE)
    - Verificar propiedad de la secuencia; eliminar y retornar 204
    - _Requisitos: 11.9_

- [x] 11. Rutas API — Evaluación Académica
  - [x] 11.1 Crear `app/api/evaluation/pretest/route.ts` y `app/api/evaluation/postest/route.ts`
    - Calcular score; crear `EvalSession`; pretest: solo uno por usuario; postest: requiere ≥5 módulos visitados
    - _Requisitos: 20.1–20.3_

  - [x] 11.2 Crear `app/api/evaluation/scales/route.ts`
    - Aceptar `evalType: 'SUS'|'TAM'|'NASA_TLX'`; calcular score con fórmulas estándar; crear `EvalSession`
    - _Requisitos: 20.4–20.7_

  - [x] 11.3 Crear `app/api/admin/research/route.ts`
    - `GET`: verificar `ADMIN_IDS`; retornar estadísticas agregadas anonimizadas (media, desviación estándar)
    - `GET?format=csv`: generar CSV con `anonymizedId, evalType, score, completedAt`; `Content-Type: text/csv`
    - _Requisitos: 20.8, 20.9_

- [x] 12. Checkpoint — API e infraestructura
  - Ejecutar `vitest --run` para pruebas de integración básicas de las rutas API; verificar que Prisma genera sin errores; resolver problemas antes de continuar.

- [x] 13. Escenas 3D de animación (React Three Fiber)
  - [x] 13.1 Crear `components/3d/ReplicationScene.tsx`
    - Extender `DNAScene` existente con `HelicaseModel`, `ForkVisualization`, `NewStrand1`, `NewStrand2`
    - Timeline GSAP en 4 fases: apertura hélice → unión polimerasas → síntesis nucleótido a nucleótido → formación hijas
    - Etiquetar Helicasa y ADN Polimerasa con nombre y función durante la animación
    - _Requisitos: 4.1–4.3, 4.6_

  - [x] 13.2 Crear `components/3d/TranscriptionScene.tsx`
    - Canvas R3F con `DNADoubleHelix`, `RNAPolymeraseModel`, `OpenBubble`, `mRNAStrand`
    - Sincronizar índice de nucleótido actual con estado React vía `onUpdate` del timeline GSAP
    - Visualizar sustitución T→U con cambio de color en el ARNm
    - _Requisitos: 5.1–5.3, 5.6_

  - [x] 13.3 Crear `components/3d/TranslationScene.tsx`
    - Canvas R3F con `mRNAStrand`, `RibosomeModel`, `tRNAModel`, `PolypeptideChain`
    - Avance del ribosoma codón a codón; animación de entrada/salida del ARNt; cadena polipeptídica creciente
    - _Requisitos: 6.1–6.3, 6.7_

  - [x] 13.4 Crear `components/3d/FoldingScene.tsx`
    - Animar niveles primario → secundario (hélices alfa y láminas beta) → terciario
    - Al menos 3 proteínas de ejemplo precargadas (hemoglobina, insulina, colágeno)
    - _Requisitos: 8.1–8.4_

  - [x] 13.5 Crear `components/3d/MoleculeViewer.tsx`
    - Viewer genérico con orbit/zoom/pan (OrbitControls R3F); botón de reset de orientación
    - Soporte para las 9 moléculas requeridas; indicador de escala; panel de etiquetas de componentes
    - _Requisitos: 14.1–14.6, 14.8_

  - [x] 13.6 Crear `components/3d/AminoAcidScene.tsx`
    - Renderizar el R-group (cadena lateral) del aminoácido seleccionado en 3D
    - _Requisitos: 7.4_

- [x] 14. Layout de módulos y página principal
  - [x] 14.1 Actualizar `app/modulos/layout.tsx`
    - Envolver con `MolecularContext` provider; añadir `ProgressBar` lateral; incluir `ToastNotification`
    - _Requisitos: 16.2, 16.3_

  - [x] 14.2 Actualizar `app/page.tsx` (Home)
    - Integrar `DNAScene` existente en hero section con lazy loading
    - Mostrar menú de los 15 módulos con un solo clic de acceso
    - Mostrar nombre del estudiante y resumen de progreso si está autenticado
    - Implementar fallback SVG estático si WebGL falla
    - _Requisitos: 1.1–1.7_

- [x] 15. Módulos de aprendizaje — Grupo 1 (ADN)
  - [x] 15.1 Crear `app/modulos/que-es-el-adn/page.tsx` con `InteractiveDNAExplorer`
    - Segmento de ADN interactivo con al menos 6 pares de bases; click en nucleótido → panel informativo
    - Panel muestra: nombre, tipo (purina/pirimidina), base complementaria, puentes de hidrógeno (A-T: 2, C-G: 3)
    - Resaltar el par complementario al hacer click; tooltip en hover (< 200 ms)
    - Fallback 2D interactivo si no hay WebGL
    - _Requisitos: 2.1–2.6_

  - [x] 15.2 Crear `app/modulos/construye-tu-adn/page.tsx` con `SequenceBuilder3D`
    - Input `SequenceInput` (4-60 chars); calcular y mostrar cadena complementaria con `computeComplement`
    - Actualizar `DNAScene` par a par mientras el estudiante escribe (< 100 ms por base)
    - Botón de descarga de secuencia + complemento como `.txt`
    - _Requisitos: 3.1–3.8_

  - [x] 15.3 Crear `app/modulos/replicacion/page.tsx` con `ReplicationScene`
    - Input de secuencia molde (4-30 bases); botón "Iniciar Replicación"; `PlaybackControls`
    - Mostrar moléculas hijas + resumen semiconservativo al completar la animación
    - _Requisitos: 4.1–4.8_

  - [x] 15.4 Crear `app/modulos/transcripcion/page.tsx` con `TranscriptionScene`
    - Input de secuencia ADN (4-60 bases); `PlaybackControls`; secuencia ARNm actualizada carácter a carácter
    - Tabla comparativa ADN molde vs ARNm al completar la transcripción
    - _Requisitos: 5.1–5.9_

  - [x] 15.5 Crear `app/modulos/traduccion/page.tsx` con `TranslationScene`
    - Input ARN (6-90 bases, múltiplo de 3) o carga automática del ARNm del módulo de transcripción
    - Advertencia si no hay codón AUG; oferta de escanear primer AUG
    - Mostrar secuencia de aminoácidos en código de una letra y contador al finalizar
    - Tabla de codones accesible desde el módulo
    - _Requisitos: 6.1–6.9_

- [x] 16. Módulos de aprendizaje — Grupo 2 (Proteínas y Mutaciones)
  - [x] 16.1 Crear `app/modulos/aminoacidos/page.tsx` con `AminoAcidExplorer`
    - Grid de los 20 aminoácidos estándar; filtros por polaridad, carga y peso molecular
    - Al seleccionar: panel con nombre, código 1 letra, fórmula, peso, polaridad, carga, rol estructural
    - `AminoAcidScene` con R-group 3D; búsqueda por nombre/código con resultado < 200 ms
    - Indicador visual de aminoácidos esenciales
    - _Requisitos: 7.1–7.6_

  - [x] 16.2 Crear `app/modulos/proteinas/page.tsx` con `FoldingScene`
    - Animación de plegamiento: primario → secundario → terciario
    - Hover sobre región → etiqueta con elemento estructural y aminoácidos
    - Si la cadena del módulo de Traducción tiene 6-30 AA, usarla como input; si supera 30, usar ejemplo simplificado con notificación
    - _Requisitos: 8.1–8.6_

  - [x] 16.3 Crear `app/modulos/mutaciones/page.tsx` con `MutationClassifier`
    - Selector de posición en la secuencia; validación inmediata de base actual y reemplazos
    - Mostrar tipo y consecuencia de la mutación < 500 ms usando `classifyMutation`
    - Comparativa lado a lado: ADN original vs mutado, ARNm, secuencia de aminoácidos
    - Resaltar codones desplazados aguas abajo en mutaciones frameshift
    - _Requisitos: 9.1–9.8_

  - [x] 16.4 Crear `app/modulos/enfermedades/page.tsx` con `DiseaseCard`
    - Al menos 5 enfermedades genéticas reales con mutación causal, gen afectado y consecuencias clínicas
    - Al seleccionar: secuencias wild-type vs mutante lado a lado con mutación resaltada
    - Para anemia falciforme: mostrar simultáneamente sustitución SNP, cambio de AA (Glu→Val posición 6) y comparación 3D de glóbulos rojo normales vs falciformes
    - Nota educativa en cada enfermedad: "contenido educativo, no constituye consejo médico"
    - _Requisitos: 10.1–10.6_

- [x] 17. Módulos de aprendizaje — Grupo 3 (Laboratorio, Comparador, Quiz)
  - [x] 17.1 Crear `app/modulos/laboratorio/page.tsx` con `VirtualLabToolbar`
    - Input DNA 4-200 chars; truncar en 200 con notificación
    - Barra de herramientas: complemento, transcripción, traducción, replicación, comparar
    - Resultados en panel de salida (< 500 ms); estadísticas en tiempo real (A/T/C/G count%, GC%)
    - Guardar hasta 10 secuencias con nombre; si usuario autenticado, persistir en BD vía API
    - Exportar cualquier resultado como `.txt`; botón "Reset" con confirmación
    - _Requisitos: 11.1–11.9_

  - [x] 17.2 Crear `app/modulos/comparador/page.tsx` con `SequenceAligner`
    - Dos inputs DNA 4-200 chars; cargar secuencias guardadas del laboratorio
    - Alinear con `alignSequences` y resaltar posiciones distintas por color
    - Mostrar: similitud %, matches, mismatches, longitud alineada, gaps si hay longitudes distintas
    - Exportar resultado como `.txt`
    - _Requisitos: 12.1–12.7_

  - [x] 17.3 Crear `app/modulos/quiz/page.tsx` con `QuizSession`
    - Seleccionar 10 preguntas con `selectQuizQuestions`; retroalimentación inmediata con explicación
    - 10 puntos por respuesta correcta; mostrar score/correctas/incorrectas/tiempo al finalizar
    - Historial de las últimas 10 sesiones si está autenticado
    - Gráfico de líneas Recharts comparando scores tras 5+ sesiones completadas
    - _Requisitos: 13.1–13.9_

- [x] 18. Módulos de aprendizaje — Grupo 4 (Modelos 3D y Línea Temporal)
  - [x] 18.1 Crear `app/modulos/modelos-3d/page.tsx` con `MoleculeGallery`
    - Galería de las 9 moléculas requeridas; lazy loading individual con spinner si > 1 s
    - Al seleccionar: `MoleculeViewer` con orbit/zoom/pan; panel de etiquetas; indicador de escala real
    - Click en etiqueta → resaltar región + descripción funcional; botón de reset de orientación
    - _Requisitos: 14.1–14.8_

  - [x] 18.2 Crear `app/modulos/dogma-temporal/page.tsx` con `MolecularTimeline`
    - Línea temporal con 5 nodos (ADN, Replicación, Transcripción, Traducción, Proteína)
    - Click en nodo → resumen animado de 15-30 s reutilizando escenas 3D del módulo correspondiente
    - Marcar nodos visitados visualmente en todo momento
    - Animaciones de transición entre nodos mostrando el output molecular de una etapa como input de la siguiente
    - Modo "Recorrer Todo": reproducción secuencial con 2 s de transición entre etapas
    - Al completar "Recorrer Todo": mensaje de felicitación + tarjeta resumen de moléculas clave
    - _Requisitos: 15.1–15.7_

- [x] 19. Dashboard de progreso y evaluación académica
  - [x] 19.1 Crear `app/progreso/page.tsx`
    - Mostrar tiempo total (minutos), módulos completados, historial de scores de quiz
    - Gráfico de barras Recharts con GC content de las últimas 5 secuencias analizadas
    - _Requisitos: 16.5_

  - [x] 19.2 Crear `app/evaluacion/pretest/page.tsx` y `app/evaluacion/postest/page.tsx`
    - 10 preguntas de opción múltiple de biología molecular; resaltar preguntas sin responder y bloquear envío incompleto
    - Postest requiere ≥5 módulos visitados
    - _Requisitos: 20.1–20.3, 20.10_

  - [x] 19.3 Crear `app/evaluacion/escalas/page.tsx`
    - Formularios SUS (10 ítems Likert 5), TAM (≥6 ítems), NASA-TLX (6 subescalas 0-100)
    - Calcular y mostrar score al enviar; bloquear envío incompleto
    - _Requisitos: 20.4–20.7, 20.10_

  - [x] 19.4 Crear `app/admin/research/page.tsx`
    - Acceso solo si `userId ∈ ADMIN_IDS`; mostrar estadísticas agregadas anonimizadas
    - Botón de exportar CSV
    - _Requisitos: 20.8, 20.9_

- [x] 20. Accesibilidad, rendimiento y compatibilidad
  - [x] 20.1 Añadir ARIA labels y navegación por teclado a los módulos interactivos
    - Todos los botones, inputs y paneles de información 3D con `aria-label` en español
    - Focus visible en todos los elementos interactivos; navegación por teclado en quiz, laboratorio y comparador
    - `alt` en imágenes y `aria-description` en escenas 3D
    - _Requisitos: 18.2–18.5_

  - [x] 20.2 Implementar modo de movimiento reducido en todas las escenas 3D
    - Si `prefers-reduced-motion: reduce`, no iniciar auto-play; mostrar modelo estático con controles de paso a paso
    - Leer `reducedMotion` de `MolecularContext`
    - _Requisitos: 18.6_

  - [x] 20.3 Añadir lazy loading y skeletons de carga a todos los módulos 3D
    - `dynamic(() => import(...), { ssr: false })` para todos los Canvas R3F
    - Skeleton o spinner visible si el módulo tarda > 1 s; indicador de progreso si > 5 s (Modelos 3D)
    - _Requisitos: 19.4, 19.5, 14.7_

- [x] 21. Pruebas de integración API
  - [x] 21.1 Escribir pruebas de integración para rutas de progreso y quiz
    - `GET /api/progress` con sesión válida: retorna estructura correcta
    - `POST /api/quiz/sessions` + `PATCH .../[id]`: flujo completo persiste score en BD
    - `POST /api/lab/sequences` en límite 10: retorna 400
    - `GET /api/admin/research?format=csv`: retorna `Content-Type: text/csv`
    - _Requisitos: 16.1, 13.4, 11.4, 20.9_

- [x] 22. Checkpoint final — integración completa
  - Ejecutar `vitest --run` para todas las pruebas (propiedades P1-P9 + integración); construir con `next build` y verificar que no hay errores de compilación; resolver cualquier problema antes de entregar.

---

## Notes

- Las sub-tareas marcadas con `*` son opcionales y pueden omitirse para una entrega MVP más rápida.
- Cada tarea referencia los requisitos específicos para trazabilidad completa.
- Los algoritmos de `lib/molecular/` y `lib/lab/` deben ser funciones puras sin efectos secundarios para garantizar la testeabilidad con fast-check.
- Los componentes 3D existentes (`DNAScene`, `DNAViewer`) se reutilizan sin modificar; solo se extienden.
- La infraestructura NextAuth, Prisma singleton (`lib/prisma.ts`) y el Zustand store existente (`simulation-store.ts`) no se tocan.
- Las escenas 3D usan `dynamic()` con `ssr: false` para evitar errores de SSR con Three.js/R3F.
- El `MolecularContext` debe colocarse en `app/modulos/layout.tsx`, no en el root layout, para aislar el estado molecular de las páginas de auth y admin.

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "1.12", "1.15", "4.1"]
    },
    {
      "id": 1,
      "tasks": ["1.2", "1.4", "1.6", "1.8", "1.10", "1.13", "1.16", "3.1"]
    },
    {
      "id": 2,
      "tasks": ["1.3", "1.5", "1.7", "1.9", "1.11", "1.14", "1.17", "3.2"]
    },
    {
      "id": 3,
      "tasks": ["5.1", "5.2", "5.3", "5.4", "5.5", "6.1"]
    },
    {
      "id": 4,
      "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5", "7.6", "8.1", "8.2", "9.1", "9.2", "9.3", "10.1", "10.2", "11.1", "11.2", "11.3"]
    },
    {
      "id": 5,
      "tasks": ["13.1", "13.2", "13.3", "13.4", "13.5", "13.6", "14.1", "14.2"]
    },
    {
      "id": 6,
      "tasks": ["15.1", "15.2", "15.3", "15.4", "15.5", "16.1", "16.2", "16.3", "16.4", "17.1", "17.2", "17.3"]
    },
    {
      "id": 7,
      "tasks": ["18.1", "18.2", "19.1", "19.2", "19.3", "19.4"]
    },
    {
      "id": 8,
      "tasks": ["20.1", "20.2", "20.3", "21.1"]
    }
  ]
}
```
