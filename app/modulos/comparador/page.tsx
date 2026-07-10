'use client';

import { useState, useEffect, useCallback } from 'react';
import SequenceInput from '@/components/ui/SequenceInput';
import { alignSequences } from '@/lib/molecular/alignment';
import { useMolecularContext } from '@/contexts/MolecularContext';
import { usePlatformStore } from '@/store/platform-store';
import type { AlignmentResult } from '@/types';
import { ArrowRight, Download, Trash2, Save } from 'lucide-react';

const STORAGE_KEY = 'lbiosim-saved-sequences';

interface SavedEntry {
  id: string;
  name: string;
  seq: string;
}

function loadSaved(): SavedEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToLocal(entries: SavedEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch { /* quota */ }
}

function colorClass(c1: string, c2: string, i: number): string {
  if (c1 === '-' || c2 === '-') return 'text-stone-400';
  if (c1 === c2) return 'text-emerald-400';
  return 'text-red-400';
}

export default function ComparadorPage() {
  const { markModuleVisited } = useMolecularContext();
  const { showToast } = usePlatformStore();

  const [seq1, setSeq1] = useState('');
  const [seq2, setSeq2] = useState('');
  const [result, setResult] = useState<AlignmentResult | null>(null);
  const [saved, setSaved] = useState<SavedEntry[]>([]);
  const [saveName, setSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  useEffect(() => {
    setSaved(loadSaved());
    markModuleVisited('comparador');
  }, [markModuleVisited]);

  const handleAlign = useCallback(() => {
    const s1 = seq1.toUpperCase().trim();
    const s2 = seq2.toUpperCase().trim();
    if (s1.length < 4 || s2.length < 4) {
      showToast({ type: 'error', message: 'Ambas secuencias deben tener al menos 4 bases' });
      return;
    }
    if (s1.length > 200 || s2.length > 200) {
      showToast({ type: 'error', message: 'Las secuencias no pueden exceder 200 bases' });
      return;
    }
    const res = alignSequences(s1, s2);
    setResult(res);
  }, [seq1, seq2, showToast]);

  const handleExport = useCallback(() => {
    if (!result) return;
    const lines = [
      '=== Comparador de Secuencias ===',
      '',
      `Longitud alineada: ${result.alignedLength}`,
      `Similitud: ${result.similarityPercent}%`,
      `Coincidencias: ${result.matches}`,
      `Discrepancias: ${result.mismatches}`,
      `Huecos: ${result.gaps}`,
      '',
      `Secuencia 1: ${result.seq1Aligned}`,
      `Secuencia 2: ${result.seq2Aligned}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alineamiento.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const handleSaveCurrent = useCallback(() => {
    if (!saveName.trim() || (!seq1 && !seq2)) return;
    const newEntries: SavedEntry[] = [];
    if (seq1) newEntries.push({ id: crypto.randomUUID(), name: `${saveName} — seq1`, seq: seq1 });
    if (seq2) newEntries.push({ id: crypto.randomUUID(), name: `${saveName} — seq2`, seq: seq2 });
    const updated = [...newEntries, ...saved].slice(0, 20);
    setSaved(updated);
    saveToLocal(updated);
    setShowSaveDialog(false);
    setSaveName('');
    showToast({ type: 'success', message: 'Secuencias guardadas' });
  }, [saveName, seq1, seq2, saved, showToast]);

  const handleLoadSaved = useCallback((entry: SavedEntry) => {
    if (!seq1) setSeq1(entry.seq);
    else if (!seq2) setSeq2(entry.seq);
    else setSeq2(entry.seq);
  }, [seq1, seq2]);

  const handleDeleteSaved = useCallback((id: string) => {
    const updated = saved.filter((e) => e.id !== id);
    setSaved(updated);
    saveToLocal(updated);
  }, [saved]);

  const handleClear = useCallback(() => {
    setSeq1('');
    setSeq2('');
    setResult(null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Comparador de Secuencias</h1>
          <p className="text-sm text-stone-400 mt-1">Alinea dos secuencias de ADN y analiza su similitud</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {result && (
            <button onClick={handleExport} className="flex items-center gap-1.5 rounded-md bg-stone-100 px-3 py-1.5 text-sm text-stone-600 transition hover:bg-stone-200">
              <Download className="h-4 w-4" />
              Exportar
            </button>
          )}
          <button onClick={handleClear} className="flex items-center gap-1.5 rounded-md bg-stone-100 px-3 py-1.5 text-sm text-stone-600 transition hover:bg-stone-200">
            <Trash2 className="h-4 w-4" />
            Limpiar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SequenceInput value={seq1} onChange={setSeq1} label="Secuencia 1" maxLength={200} placeholder="Ej: ATCGGCTA..." />
        <SequenceInput value={seq2} onChange={setSeq2} label="Secuencia 2" maxLength={200} placeholder="Ej: ATCGGCTA..." />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={handleAlign} className="flex items-center gap-2 rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500">
          <ArrowRight className="h-4 w-4" />
          Alinear
        </button>
        <button onClick={() => setShowSaveDialog(true)} className="flex items-center gap-1.5 rounded-md bg-stone-100 px-3 py-2 text-sm text-stone-600 transition hover:bg-stone-200">
          <Save className="h-4 w-4" />
          Guardar secuencias
        </button>
      </div>

      {showSaveDialog && (
        <div className="rounded-lg border border-stone-300 bg-white p-4">
          <p className="text-sm text-stone-500 mb-2">Nombre para las secuencias actuales:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Ej: Mi experimento"
              className="flex-1 rounded-md bg-stone-100 px-3 py-2 text-sm text-stone-800 outline-none ring-1 ring-stone-300 focus:ring-2 focus:ring-[#4caf82]/40"
            />
            <button onClick={handleSaveCurrent} className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500">Guardar</button>
            <button onClick={() => setShowSaveDialog(false)} className="rounded-md bg-stone-100 px-4 py-2 text-sm text-stone-600 hover:bg-stone-200">Cancelar</button>
          </div>
        </div>
      )}

      {saved.length > 0 && (
        <div>
          <p className="text-sm font-medium text-stone-500 mb-2">Secuencias guardadas ({saved.length})</p>
          <div className="flex flex-wrap gap-2">
            {saved.map((entry) => (
              <div key={entry.id} className="flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs">
                <span className="text-stone-600">{entry.name}</span>
                <code className="text-emerald-400 max-w-[120px] truncate">{entry.seq}</code>
                <button onClick={() => handleLoadSaved(entry)} className="text-stone-400 hover:text-emerald-400 transition-colors" title="Cargar">→</button>
                <button onClick={() => handleDeleteSaved(entry.id)} className="text-stone-400 hover:text-red-400 transition-colors" title="Eliminar">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="rounded-lg border border-stone-200 bg-white/70 p-4">
            <h2 className="text-sm font-medium text-stone-500 mb-3">Alineamiento</h2>
            <div className="font-mono text-sm leading-relaxed tracking-wider overflow-x-auto">
              <div className="flex text-stone-400 text-xs mb-1">
                <span className="w-12 shrink-0">Seq 1</span>
                <span className="w-12 shrink-0">Seq 2</span>
              </div>
              {result.seq1Aligned.split('').map((c, i) => (
                <span key={i} className={colorClass(c, result.seq2Aligned[i], i)}>
                  {c}
                </span>
              ))}
              <div className="mt-1">
                {result.seq2Aligned.split('').map((c, i) => (
                  <span key={i} className={colorClass(result.seq1Aligned[i], c, i)}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-lg border border-stone-200 bg-white/70 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{result.similarityPercent}%</p>
              <p className="text-xs text-stone-400">Similitud</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white/70 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{result.matches}</p>
              <p className="text-xs text-stone-400">Coincidencias</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white/70 p-3 text-center">
              <p className="text-2xl font-bold text-red-400">{result.mismatches}</p>
              <p className="text-xs text-stone-400">Discrepancias</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white/70 p-3 text-center">
              <p className="text-2xl font-bold text-stone-600">{result.alignedLength}</p>
              <p className="text-xs text-stone-400">Longitud alineada</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white/70 p-3 text-center">
              <p className="text-2xl font-bold text-stone-400">{result.gaps}</p>
              <p className="text-xs text-stone-400">Huecos</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-stone-400">
            <span><span className="inline-block w-3 h-3 rounded bg-emerald-400/30 mr-1" /> Coincidencia</span>
            <span><span className="inline-block w-3 h-3 rounded bg-red-400/30 mr-1" /> Discrepancia</span>
            <span><span className="inline-block w-3 h-3 rounded bg-zinc-500/30 mr-1" /> Hueco</span>
          </div>
        </div>
      )}
    </div>
  );
}
