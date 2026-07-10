'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Download, RotateCcw, Save, Copy, Dna, TestTube, Beaker, GitCompareArrows, FlaskConical } from 'lucide-react';
import SequenceInput from '@/components/ui/SequenceInput';
import { computeComplement } from '@/lib/molecular/dna';
import { transcribe } from '@/lib/molecular/transcription';
import { translate } from '@/lib/molecular/translation';
import { alignSequences } from '@/lib/molecular/alignment';
import { saveSequence, type SavedSeq } from '@/lib/lab/virtual-lab';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { usePlatformStore } from '@/store/platform-store';
import { BASE_COLORS, BASE_FULL_NAMES } from '@/constants';

type Operation = 'complement' | 'transcription' | 'translation' | 'replicate' | 'align';

interface OpResult {
  operation: Operation;
  label: string;
  output: string;
}

const OP_LABELS: Record<Operation, string> = {
  complement: 'Complemento',
  transcription: 'Transcripción',
  translation: 'Traducción',
  replicate: 'Replicar',
  align: 'Comparar',
};

interface BaseStats {
  counts: { A: number; T: number; C: number; G: number };
  total: number;
  aPct: string;
  tPct: string;
  cPct: string;
  gPct: string;
  gcPct: string;
}

function countBases(seq: string): BaseStats {
  const counts = { A: 0, T: 0, C: 0, G: 0 };
  for (const b of seq.toUpperCase()) {
    if (b in counts) counts[b as 'A' | 'T' | 'C' | 'G']++;
  }
  const total = seq.length || 1;
  return {
    counts,
    total: seq.length,
    aPct: ((counts.A / total) * 100).toFixed(1),
    tPct: ((counts.T / total) * 100).toFixed(1),
    cPct: ((counts.C / total) * 100).toFixed(1),
    gPct: ((counts.G / total) * 100).toFixed(1),
    gcPct: seq.length ? (((counts.G + counts.C) / total) * 100).toFixed(1) : '0.0',
  };
}

function downloadTxt(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function LaboratorioPage() {
  const { markModuleVisited } = useMolecularContext();
  const showToast = usePlatformStore((s) => s.showToast);

  const [dnaSeq, setDnaSeq] = useState('');
  const [truncated, setTruncated] = useState(false);
  const [results, setResults] = useState<OpResult[]>([]);
  const [savedSeqs, setSavedSeqs] = useState<SavedSeq[]>([]);
  const [saveName, setSaveName] = useState('');
  const [pendingSave, setPendingSave] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    markModuleVisited('laboratorio');
  }, [markModuleVisited]);

  const stats = useMemo(() => countBases(dnaSeq), [dnaSeq]);

  const handleDnaChange = useCallback((val: string) => {
    if (val.length > 200) {
      setTruncated(true);
      setDnaSeq(val.slice(0, 200));
      setTimeout(() => setTruncated(false), 3000);
    } else {
      setTruncated(false);
      setDnaSeq(val);
    }
  }, []);

  function handleOperation(op: Operation) {
    if (!dnaSeq || dnaSeq.length < 4) {
      showToast({ type: 'warning', message: 'La secuencia debe tener al menos 4 bases' });
      return;
    }
    try {
      let output = '';
      let label = OP_LABELS[op];
      switch (op) {
        case 'complement': {
          output = computeComplement(dnaSeq);
          break;
        }
        case 'transcription': {
          output = transcribe(dnaSeq);
          label = 'ARNm';
          break;
        }
        case 'translation': {
          const rna = transcribe(dnaSeq);
          const aas = translate(rna);
          output = aas.map((aa) => aa.singleLetter).join('');
          label = 'Aminoácidos';
          break;
        }
        case 'replicate': {
          output = computeComplement(dnaSeq);
          label = 'Complemento (Replicación)';
          break;
        }
        case 'align': {
          if (results.length === 0) {
            showToast({ type: 'warning', message: 'Primero realiza una operación para comparar' });
            return;
          }
          const lastResult = results[results.length - 1];
          const align = alignSequences(dnaSeq, lastResult.output);
          output = `Identidad: ${align.similarityPercent}%\nCoincidencias: ${align.matches}\nDiferencias: ${align.mismatches}\nHuecos: ${align.gaps}\nLongitud: ${align.alignedLength}`;
          break;
        }
      }
      setResults((prev) => [...prev, { operation: op, label, output }]);
    } catch (e) {
      showToast({
        type: 'error',
        message: e instanceof Error ? e.message : 'Error en la operación',
      });
    }
  }

  function handleSave() {
    if (!dnaSeq) {
      showToast({ type: 'warning', message: 'No hay secuencia para guardar' });
      return;
    }
    const name = saveName.trim() || `Secuencia ${savedSeqs.length + 1}`;
    try {
      const updated = saveSequence(savedSeqs, { name, sequence: dnaSeq });
      setSavedSeqs(updated);
      setSaveName('');
      setPendingSave('');
      showToast({ type: 'success', message: `"${name}" guardada` });
    } catch (e) {
      showToast({
        type: 'error',
        message: e instanceof Error ? e.message : 'Error al guardar',
      });
    }
  }

  function handleExport(result: OpResult, index: number) {
    const content = `Operación: ${result.label}\n\nEntrada:\n${dnaSeq}\n\nResultado:\n${result.output}`;
    downloadTxt(content, `lbiosim-${result.operation}-${index}.txt`);
  }

  function handleExportSaved(seq: SavedSeq) {
    downloadTxt(`>${seq.name}\n${seq.sequence}`, `lbiosim-${seq.name}.txt`);
  }

  function handleReset() {
    setDnaSeq('');
    setResults([]);
    setSaveName('');
    setPendingSave('');
    setShowResetConfirm(false);
    showToast({ type: 'info', message: 'Laboratorio reiniciado' });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-800">Laboratorio Virtual</h1>
        <p className="mt-1 text-stone-500 text-sm">
          Manipula secuencias de ADN y explora los procesos moleculares
        </p>
      </div>

      {truncated && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
          <p className="text-sm text-amber-400">La secuencia se ha truncado a 200 caracteres</p>
        </div>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white/80 p-5">
        <SequenceInput
          label="Secuencia de ADN"
          value={dnaSeq}
          onChange={handleDnaChange}
          maxLength={200}
          placeholder="Introduce ADN (4–200 bases)..."
        />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 rounded-2xl border border-stone-200 bg-white/60 p-3 sm:p-4">
        {(['A', 'T', 'C', 'G'] as const).map((base) => (
          <div key={base} className="flex flex-col items-center gap-1">
            <span
              className="text-base sm:text-lg font-bold font-mono"
              style={{ color: BASE_COLORS[base] }}
            >
              {base}
            </span>
            <span className="hidden sm:block text-xs text-stone-400">{BASE_FULL_NAMES[base]}</span>
            <span className="text-xs font-mono text-stone-500 text-center">
              {stats.counts[base]}
              <span className="text-stone-400 ml-1">({({ a: stats.aPct, t: stats.tPct, c: stats.cPct, g: stats.gPct })[base.toLowerCase()]}%)</span>
            </span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1">
          <span className="text-base sm:text-lg font-bold font-mono text-stone-600">GC</span>
          <span className="hidden sm:block text-xs text-stone-400">Contenido GC</span>
          <span className="text-xs font-mono text-emerald-300">{stats.gcPct}%</span>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['complement', 'transcription', 'translation', 'replicate', 'align'] as Operation[]).map((op) => (
          <button
            key={op}
            onClick={() => handleOperation(op)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-800 transition-colors border border-stone-300"
          >
            {op === 'complement' && <Copy size={14} />}
            {op === 'transcription' && <TestTube size={14} />}
            {op === 'translation' && <Beaker size={14} />}
            {op === 'replicate' && <Dna size={14} />}
            {op === 'align' && <GitCompareArrows size={14} />}
            {OP_LABELS[op]}
          </button>
        ))}
      </div>

      {results.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wider">Resultados</h3>
          {[...results].reverse().map((res, idx) => {
            const realIdx = results.length - 1 - idx;
            return (
              <div key={realIdx} className="rounded-2xl border border-stone-200 bg-white/80 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    {res.label}
                  </span>
                  <button
                    onClick={() => handleExport(res, realIdx)}
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <Download size={12} />
                    Exportar .txt
                  </button>
                </div>
                <p className="font-mono text-sm text-stone-700 whitespace-pre-wrap break-all">
                  {res.output}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white/80 p-5">
        <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-3">Guardar Secuencia</h3>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Nombre de la secuencia"
              className="w-full rounded-md bg-stone-100 px-3 py-2 text-emerald-100 placeholder-stone-400 outline-none ring-1 ring-stone-300 transition focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md"
          >
            <Save size={14} />
            Guardar Secuencia
          </button>
        </div>
      </div>

      {savedSeqs.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wider">
            Secuencias Guardadas ({savedSeqs.length}/10)
          </h3>
          {savedSeqs.map((seq) => (
            <div key={seq.id} className="rounded-2xl border border-stone-200 bg-white/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-stone-700">{seq.name}</span>
                  <span className="text-xs text-stone-400 ml-2">
                    {new Date(seq.savedAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <button
                  onClick={() => handleExportSaved(seq)}
                  className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <Download size={12} />
                  Exportar
                </button>
              </div>
              <p className="font-mono text-xs text-stone-500 break-all">{seq.sequence}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-2 border-t border-stone-200">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-stone-100 text-stone-500 hover:bg-red-900/40 hover:text-red-400 transition-colors border border-stone-300"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500">¿Reiniciar todo?</span>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors shadow-md"
            >
              Confirmar
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
