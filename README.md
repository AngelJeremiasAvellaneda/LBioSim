# LBioSim v2 — Plataforma Interactiva de Biología Molecular

> **Autor:** Ángel Addair Jeremías Avellaneda

Plataforma educativa web que permite explorar los procesos fundamentales del **Dogma Central de la Biología Molecular** a través de animaciones 3D interactivas, simulaciones paso a paso, un laboratorio virtual y un sistema de evaluación académica. Diseñada para estudiantes de biología, bioquímica y bioinformática.

---

## ¿De qué trata el proyecto?

LBioSim nació como una herramienta de apoyo para la enseñanza de biología molecular computacional. Su objetivo es hacer accesibles conceptos complejos —como la replicación del ADN, la transcripción o el plegamiento de proteínas— mediante visualizaciones tridimensionales y ejercicios interactivos que el alumno puede controlar a su propio ritmo.

La plataforma cubre el flujo completo de la información genética:

```
ADN → Replicación → Transcripción → Traducción → Proteína funcional
```

Cada etapa cuenta con su propia escena 3D animada, controles de reproducción, explicaciones científicas y actividades de autoevaluación.

---

## Módulos de aprendizaje

| Grupo | Módulo | Descripción |
|---|---|---|
| **ADN** | ¿Qué es el ADN? | Estructura de la doble hélice y pares de bases |
| | Construye tu ADN | Ingresa una secuencia y visualiza su complemento en 3D |
| | Replicación | Animación semiconservativa con Helicasa y ADN Polimerasa |
| **Dogma** | Transcripción | ARN Polimerasa sintetizando ARNm desde la cadena molde |
| | Traducción | Ribosoma leyendo codones y ensamblando aminoácidos |
| | Aminoácidos | Galería de los 20 aminoácidos estándar con modelos 3D |
| | Proteínas | Plegamiento: estructura primaria → secundaria → terciaria |
| **Patología** | Mutaciones | Clasificador de mutaciones silent/missense/nonsense/frameshift |
| | Enfermedades | Bases moleculares de Anemia Falciforme, Fibrosis Quística, Huntington y más |
| **Herramientas** | Laboratorio Virtual | Operaciones moleculares: complemento, transcripción, traducción, alineamiento |
| | Comparador | Alineamiento de secuencias con métricas de similitud |
| | Quiz | 10 preguntas de opción múltiple con banco aleatorio |
| **Avanzado** | Modelos 3D | Galería: ADN, ARN, proteína, ATP, nucleótido, glucosa, lípido, agua |
| | Dogma Temporal | Recorrido animado completo del dogma central |
| **Evaluación** | Pretest / Postest | Evaluación de conocimientos antes y después del aprendizaje |
| | Escalas | SUS (usabilidad), TAM (aceptación tecnológica), NASA-TLX (carga cognitiva) |

---

## Stack tecnológico

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js](https://nextjs.org) | 16.2.10 | Framework React con App Router, SSR/SSG |
| [React](https://react.dev) | 19.2.4 | Librería de UI |
| [TypeScript](https://typescriptlang.org) | ^5 | Tipado estático en todo el proyecto |
| [Tailwind CSS](https://tailwindcss.com) | ^4 | Estilos utilitarios responsivos |
| [Lucide React](https://lucide.dev) | ^1.23 | Sistema de iconos SVG |

### Visualización 3D
| Tecnología | Versión | Uso |
|---|---|---|
| [Three.js](https://threejs.org) | ^0.185 | Motor de renderizado WebGL |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | ^9.6 | Bindings declarativos de Three.js para React |
| [@react-three/drei](https://github.com/pmndrs/drei) | ^10.7 | Helpers para R3F: OrbitControls, Text, etc. |
| [GSAP](https://gsap.com) | ^3.15 | Animaciones de timeline para las escenas moleculares |

### Estado y formularios
| Tecnología | Versión | Uso |
|---|---|---|
| [Zustand](https://zustand-demo.pmnd.rs) | ^5.0 | Estado global (simulaciones, progreso, plataforma) |
| [React Context](https://react.dev/reference/react/createContext) | — | Contextos moleculares por módulo (Replicación, Transcripción…) |
| [React Hook Form](https://react-hook-form.com) | ^7.81 | Formularios con validación |
| [Zod](https://zod.dev) | ^4.4 | Esquemas de validación en cliente y servidor |

### Backend y base de datos
| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) | — | Endpoints REST en `/app/api/` |
| [Prisma ORM](https://www.prisma.io) | ^7.8 | Modelo de datos y migraciones |
| [PostgreSQL](https://www.postgresql.org) | — | Base de datos relacional |
| [NextAuth.js](https://next-auth.js.org) | ^4.24 | Autenticación con sesiones |
| [@auth/prisma-adapter](https://authjs.dev/reference/adapter/prisma) | ^2.11 | Adapter de sesiones para Prisma |

### Graficas y tests
| Tecnología | Versión | Uso |
|---|---|---|
| [Recharts](https://recharts.org) | ^3.9 | Gráficas de progreso y resultados de evaluación |
| [Vitest](https://vitest.dev) | ^4.1 | Tests unitarios |
| [fast-check](https://fast-check.io) | ^4.9 | Property-based testing |

---

## Estructura del proyecto

```
lbiosim-v2/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home: Hero 3D + grid de módulos
│   ├── layout.tsx                # Root layout con fuentes Geist
│   ├── globals.css               # Variables CSS y estilos base
│   ├── modulos/                  # Rutas de cada módulo de aprendizaje
│   │   ├── layout.tsx            # Layout compartido: Header + sidebar de progreso
│   │   ├── que-es-el-adn/
│   │   ├── construye-tu-adn/
│   │   ├── replicacion/
│   │   ├── transcripcion/
│   │   ├── traduccion/
│   │   ├── aminoacidos/
│   │   ├── proteinas/
│   │   ├── mutaciones/
│   │   ├── enfermedades/
│   │   ├── laboratorio/
│   │   ├── comparador/
│   │   ├── quiz/
│   │   ├── modelos-3d/
│   │   └── dogma-temporal/
│   ├── evaluacion/               # Pretest, postest y escalas SUS/TAM/NASA-TLX
│   ├── progreso/                 # Página de seguimiento del estudiante
│   ├── auth/                     # Inicio de sesión (NextAuth)
│   ├── admin/                    # Panel de investigación (datos de evaluación)
│   └── api/                      # Endpoints REST
│       ├── auth/[...nextauth]/   # Handlers de NextAuth
│       ├── evaluation/           # Pretest, postest, escalas
│       ├── progress/             # Progreso por usuario
│       ├── quiz/                 # Sesiones y historial de quiz
│       ├── simulations/          # Simulaciones de ADN
│       └── lab/sequences/        # Secuencias del laboratorio virtual
│
├── components/
│   ├── 3d/                       # Escenas Three.js/R3F por módulo
│   │   ├── WebGLWrapper.tsx      # Wrapper con fallback 2D y detección WebGL
│   │   ├── ReplicationScene.tsx
│   │   ├── TranscriptionScene.tsx
│   │   ├── TranslationScene.tsx
│   │   ├── FoldingScene.tsx
│   │   ├── AminoAcidScene.tsx
│   │   └── MoleculeViewer.tsx
│   ├── dna3d/                    # Escena ADN del hero y simulador
│   │   └── DNAScene.tsx
│   ├── animations/               # Hook de timeline GSAP reutilizable
│   ├── home/                     # HomeHero + ModuleGrid
│   ├── layout/                   # Header con navegación
│   ├── simulator/                # Simulador de Máquina de Turing sobre ADN
│   └── ui/                       # Componentes UI: Sidebar, PlaybackControls, Toast…
│
├── contexts/                     # React Contexts por módulo molecular
│   ├── MolecularContext.tsx       # Contexto global: progreso, ADN activo, WebGL
│   ├── ReplicationContext.tsx
│   └── TranscriptionContext.tsx
│
├── lib/                          # Lógica de dominio pura (sin UI)
│   ├── molecular/                # Algoritmos biológicos
│   │   ├── dna.ts                # Complemento, validación de secuencias
│   │   ├── transcription.ts      # ADN → ARNm
│   │   ├── translation.ts        # ARNm → cadena de aminoácidos
│   │   ├── mutations.ts          # Clasificador de mutaciones
│   │   ├── alignment.ts          # Alineamiento de secuencias (Needleman-Wunsch)
│   │   ├── codon-table.ts        # Código genético completo
│   │   ├── amino-acids-data.ts   # Datos de los 20 aminoácidos
│   │   └── quiz.ts / quiz-bank.ts
│   └── lab/                      # Lógica del laboratorio virtual
│
├── store/                        # Stores Zustand
│   ├── simulation-store.ts       # Estado de la Máquina de Turing / ADN
│   └── platform-store.ts         # Toasts, preferencias globales
│
├── types/                        # Tipos TypeScript compartidos
├── constants/                    # Colores de bases, complementos, etc.
├── prisma/
│   └── schema.prisma             # Modelos: User, Simulation, Progress, QuizSession…
└── tests/                        # Vitest + fast-check
```

---

## Modelo de datos

```
User ──── Progress          (1:1 — módulos visitados, tiempo total)
     ──── ModuleVisit[]     (1:N — eventos de visita por módulo)
     ──── QuizSession[]     (1:N — sesiones de quiz con respuestas)
     ──── Simulation[]      (1:N — historial de simulaciones de ADN)
     ──── VirtualLabSequence[] (1:N — secuencias guardadas en el lab)
     ──── EvalSession[]     (1:N — sesiones de pretest/postest/escalas)
```

---

## Instalación y desarrollo

### Requisitos

- Node.js ≥ 18
- PostgreSQL (local o en la nube)
- npm / yarn / pnpm

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd lbiosim-v2

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con DATABASE_URL y NEXTAUTH_SECRET

# 4. Aplicar migraciones de base de datos
npm run db:migrate

# 5. Generar el cliente Prisma
npm run db:generate

# 6. Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Lint con ESLint |
| `npm run db:migrate` | Aplica migraciones Prisma |
| `npm run db:generate` | Genera el cliente Prisma |
| `npm run db:studio` | Abre Prisma Studio (GUI de base de datos) |
| `npm run db:push` | Push directo del schema (sin migración) |

---

## Variables de entorno

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/lbiosim"

# NextAuth
NEXTAUTH_SECRET="tu_secreto_aqui"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Características técnicas destacadas

- **Animaciones 3D sin librerías de escenas preconstruidas** — cada molécula (doble hélice, ARN Polimerasa, ribosoma, helicasa) está construida desde cero con geometrías primitivas de Three.js y animada con timelines GSAP, garantizando control total del comportamiento y rendimiento.
- **WebGL con fallback graceful** — el `WebGLWrapper` detecta soporte WebGL en el navegador y renderiza una alternativa 2D si no está disponible, o si se pierde el contexto durante la sesión.
- **Algoritmos biológicos puros** — toda la lógica de transcripción, traducción, mutaciones y alineamiento vive en `lib/molecular/` sin dependencias externas, lo que permite testearla de forma aislada con Vitest y property-based testing con fast-check.
- **Simulador de Máquina de Turing** — el simulador de la página principal ejecuta algoritmos de reconocimiento sobre secuencias de ADN (complementariedad, palíndromos, contenido GC) modelados como Máquinas de Turing, con visualización paso a paso en la escena 3D.
- **Sistema de evaluación académica** — integra tres instrumentos validados: SUS (System Usability Scale), TAM (Technology Acceptance Model) y NASA-TLX (carga cognitiva), cuyos resultados se almacenan en la base de datos para análisis de investigación.
- **Responsive design** — todas las vistas son responsivas desde 375px, con alturas de escenas 3D que escalan con `clamp` y breakpoints Tailwind.

---

## Autor

**Ángel Addair Jeremías Avellaneda**

Proyecto desarrollado en el contexto de la **Biología Computacional**, aplicando conceptos de Máquinas de Turing al análisis de secuencias de ADN y construyendo una plataforma educativa interactiva para la enseñanza del Dogma Central de la Biología Molecular.

---

## Licencia

Este proyecto es de uso académico. Todos los derechos reservados © Ángel Addair Jeremías Avellaneda.
