'use client';

import { useState, useEffect } from 'react';
import { useMolecularContext } from '@/contexts/MolecularContext';

interface Disease {
  id: string;
  name: string;
  gene: string;
  chromosome: string;
  mutationType: string;
  mutationDetail: string;
  consequences: string[];
  wildTypeSeq: string;
  mutantSeq: string;
  inheritance: string;
  prevalence: string;
}

const DISEASES: Disease[] = [
  {
    id: 'anemia-falciforme',
    name: 'Anemia Falciforme',
    gene: 'HBB (beta-globina)',
    chromosome: '11p15.5',
    mutationType: 'Mutación puntual missense',
    mutationDetail: 'Sustitución GAG → GTG en el codón 6 del gen HBB, cambiando el aminoácido Glutamato (Glu) por Valina (Val) en la posición 6 de la cadena beta de la hemoglobina.',
    consequences: [
      'La hemoglobina S (HbS) polimeriza bajo condiciones de baja oxigenación',
      'Los glóbulos rojos adoptan forma de hoz (drepanoctios)',
      'Crisis vaso-oclusivas que causan dolor intenso',
      'Anemia hemolítica crónica',
      'Mayor susceptibilidad a infecciones por asplenia funcional',
    ],
    wildTypeSeq: 'ATG GTG CAC CTG ACT CCT GAG GAG AAG TCT',
    mutantSeq: 'ATG GTG CAC CTG ACT CCT GTG GAG AAG TCT',
    inheritance: 'Autosómica recesiva',
    prevalence: '1/500 afroamericanos; portador 1/12 en África subsahariana',
  },
  {
    id: 'fibrosis-quistica',
    name: 'Fibrosis Quística',
    gene: 'CFTR (Cystic Fibrosis Transmembrane Conductance Regulator)',
    chromosome: '7q31.2',
    mutationType: 'Deleción (pérdida de 3 pb)',
    mutationDetail: 'Deleción del codón TTT en la posición 508 (F508del) que elimina un residuo de Fenilalanina en la proteína CFTR, impidiendo su correcto plegamiento y tráfico a la membrana celular.',
    consequences: [
      'Defecto en el canal de cloro CFTR en células epiteliales',
      'Secreciones pulmonares espesas que obstruyen las vías respiratorias',
      'Infecciones pulmonares recurrentes (Pseudomonas aeruginosa)',
      'Insuficiencia pancreática exocrina con mala absorción de nutrientes',
      'Infertilidad en varones por ausencia congénita de conductos deferentes',
    ],
    wildTypeSeq: 'ATG CAG AGG CGT CCT CAA CAT CGT GGA AAG',
    mutantSeq: 'ATG CAG AGG CGT CCT CAA--- CGT GGA AAG',
    inheritance: 'Autosómica recesiva',
    prevalence: '1/3500 caucásicos; portador 1/25 en Europa',
  },
  {
    id: 'huntington',
    name: 'Corea de Huntington',
    gene: 'HTT (huntingtina)',
    chromosome: '4p16.3',
    mutationType: 'Expansión de repeticiones de trinucleótidos',
    mutationDetail: 'Expansión anormal del triplete CAG (codifica Glutamina) en el exón 1 del gen HTT. Alelos con 36-39 repeticiones tienen penetrancia reducida; ≥40 repeticiones causan enfermedad con penetrancia completa.',
    consequences: [
      'La proteína huntingtina mutante contiene una larga cadena de poliglutaminas tóxicas',
      'Agregación de la proteína mutante en neuronas estriatales',
      'Movimientos coreiformes involuntarios (baile de San Vito)',
      'Deterioro cognitivo progresivo y demencia',
      'Trastornos psiquiátricos (depresión, irritabilidad, apatía)',
      'Inicio típico entre 30-50 años; forma juvenil con >60 repeticiones',
    ],
    wildTypeSeq: 'ATG GCG ACC CTG GAA AAG CTG ATG AAG GCC TTC (10 CAG)',
    mutantSeq: 'ATG GCG ACC CTG GAA AAG CTG ATG AAG GCC TTC (42 CAG)',
    inheritance: 'Autosómica dominante (anticipación genética)',
    prevalence: '1/10000 en poblaciones de origen europeo',
  },
  {
    id: 'hemofilia-a',
    name: 'Hemofilia A',
    gene: 'F8 (factor VIII de coagulación)',
    chromosome: 'Xq28',
    mutationType: 'Múltiples tipos (inversiones, deleciones, missense, nonsense)',
    mutationDetail: 'La inversión del intrón 22 del gen F8 representa ~45% de los casos severos. Diversas mutaciones puntuales también pueden afectar la función del factor VIII de la coagulación.',
    consequences: [
      'Deficiencia del factor VIII de la coagulación sanguínea',
      'Hemorragias prolongadas incluso tras traumatismos leves',
      'Hemartrosis (sangrado en articulaciones) que causa artropatía crónica',
      'Hematomas profundos y riesgo de hemorragia intracraneal',
      'Los varones son casi exclusivamente afectados (herencia ligada al X)',
    ],
    wildTypeSeq: 'GCC TCT GAG TCC ATT GGG AAC TTC AAG ATC',
    mutantSeq: 'GCC TCT GAG TCC ATT GGG TAA TTC AAG ATC',
    inheritance: 'Ligada al cromosoma X recesiva',
    prevalence: '1/5000 varones nacidos vivos',
  },
  {
    id: 'down',
    name: 'Síndrome de Down (Trisomía 21)',
    gene: 'Cromosoma 21 completo (~225 genes)',
    chromosome: '21',
    mutationType: 'Aneuploidía cromosómica',
    mutationDetail: 'Presencia de tres copias del cromosoma 21 (trisomía 21 libre) en el 95% de los casos. El 5% restante corresponde a translocaciones robertsonianas o mosaicismo.',
    consequences: [
      'Discapacidad intelectual de grado variable (CI 25-70)',
      'Hipotonía muscular y rasgos faciales característicos (epicanto, puente nasal aplanado)',
      'Cardiopatías congénitas (~50%, especialmente defecto septal AV)',
      'Mayor riesgo de leucemia infantil y enfermedad de Alzheimer precoz',
      'Esperanza de vida ~60 años con atención médica adecuada',
      'Riesgo correlacionado con edad materna avanzada',
    ],
    wildTypeSeq: '2 copias del cromosoma 21 (46 cromosomas totales)',
    mutantSeq: '3 copias del cromosoma 21 (47 cromosomas totales)',
    inheritance: 'Esporádica (mayoría); translocación heredable en ~5%',
    prevalence: '1/700-1000 nacidos vivos; 1/35 gestaciones >45 años maternos',
  },
];

export default function EnfermedadesPage() {
  const { markModuleVisited } = useMolecularContext();
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

  useEffect(() => {
    markModuleVisited('enfermedades');
  }, [markModuleVisited]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Enfermedades Genéticas</h1>
        <p className="text-sm text-stone-400 mt-1">
          Bases moleculares de enfermedades hereditarias. Selecciona una enfermedad para ver su detalle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DISEASES.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDisease(d)}
            className={`rounded-lg border p-4 text-left transition-all ${
              selectedDisease?.id === d.id
                ? 'border-emerald-500 bg-[#b8ddc8]/40'
                : 'border-stone-200 bg-white/70 hover:border-stone-400'
            }`}
          >
            <h3 className="text-sm font-semibold text-stone-700">{d.name}</h3>
            <p className="text-xs text-stone-400 mt-1">{d.gene}</p>
            <p className="text-xs text-stone-400 mt-1 line-clamp-2">{d.mutationType}</p>
          </button>
        ))}
      </div>

      {selectedDisease && (
        <div className="space-y-4">
          <div className="rounded-lg border border-stone-200 bg-white/70 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-800">{selectedDisease.name}</h2>
                <p className="text-sm text-stone-400">Gen afectado: {selectedDisease.gene}</p>
                <p className="text-sm text-stone-400">Cromosoma: {selectedDisease.chromosome}</p>
              </div>
              <div className="text-xs text-stone-400 sm:text-right shrink-0">
                <p>Herencia: <span className="text-stone-500">{selectedDisease.inheritance}</span></p>
                <p className="mt-0.5 max-w-[200px] sm:max-w-xs">Prevalencia: <span className="text-stone-500">{selectedDisease.prevalence}</span></p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-stone-500 mb-1">Tipo de mutación</h3>
                <p className="text-sm text-stone-600">{selectedDisease.mutationType}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-stone-500 mb-1">Detalle molecular</h3>
                <p className="text-sm text-stone-600">{selectedDisease.mutationDetail}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-stone-500 mb-2">Consecuencias clínicas</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedDisease.consequences.map((c, i) => (
                    <li key={i} className="text-sm text-stone-600">{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-stone-500 mb-2">Secuencia comparativa</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-md border border-[#4caf82]/30 bg-[#b8ddc8]/40 p-3">
                    <p className="text-xs text-emerald-400 font-medium mb-1">Wild-type (normal)</p>
                    <code className="text-xs text-emerald-300 break-all font-mono">{selectedDisease.wildTypeSeq}</code>
                  </div>
                  <div className="rounded-md border border-[#e07070]/40 bg-[#f0a8a8]/40 p-3">
                    <p className="text-xs text-red-400 font-medium mb-1">Mutante</p>
                    <code className="text-xs text-red-300 break-all font-mono">{selectedDisease.mutantSeq}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-amber-800/30 bg-amber-900/10 px-4 py-3">
            <p className="text-xs text-[#a87a20]">
              ⚠ Este contenido es educativo y no constituye consejo médico. Si tienes dudas sobre
              alguna condición genética, consulta con un profesional de la salud especializado.
            </p>
          </div>
        </div>
      )}

      {!selectedDisease && (
        <div className="flex items-center justify-center py-12 text-stone-400 text-sm">
          Selecciona una enfermedad de la lista para ver su descripción detallada
        </div>
      )}
    </div>
  );
}
