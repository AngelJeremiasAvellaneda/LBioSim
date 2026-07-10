'use client';

import { useState, useEffect } from 'react';
import { FlaskConical, Download, Loader2, AlertTriangle } from 'lucide-react';

interface EvalStat {
  evalType: string;
  count: number;
  mean: number;
  stdDev: number;
}

const EVAL_LABELS: Record<string, string> = {
  pretest: 'Pretest',
  postest: 'Postest',
  SUS: 'SUS',
  TAM: 'TAM',
  NASA_TLX: 'NASA-TLX',
};

export default function AdminResearchPage() {
  const [stats, setStats] = useState<EvalStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/research');
        if (res.status === 403) {
          if (!cancelled) setError('denied');
          return;
        }
        if (!res.ok) {
          if (!cancelled) setError('error');
          return;
        }
        const data = await res.json();
        if (!cancelled) setStats(data.stats ?? []);
      } catch {
        if (!cancelled) setError('error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  async function handleExportCsv() {
    try {
      const res = await fetch('/api/admin/research?format=csv');
      if (res.status === 403) {
        setError('denied');
        return;
      }
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'research-data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError('error');
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-stone-500 text-sm">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error === 'denied') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertTriangle className="w-10 h-10 text-red-400" />
        <h2 className="text-lg font-semibold text-stone-800">Acceso denegado. Solo administradores.</h2>
      </div>
    );
  }

  if (error === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertTriangle className="w-10 h-10 text-red-400" />
        <p className="text-stone-500 text-sm">Error al cargar las estadísticas. Intenta de nuevo.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold text-stone-800">Investigación — Estadísticas</h1>
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {stats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-stone-400 rounded-2xl bg-white/80 border border-stone-200">
          <FlaskConical className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-base font-medium">No hay datos disponibles</p>
          <p className="text-sm mt-1 text-stone-400">Aún no se han registrado sesiones de evaluación.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.evalType}
              className="rounded-2xl bg-white/80 border border-stone-200 p-5 flex flex-col gap-3"
            >
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">
                {EVAL_LABELS[stat.evalType] ?? stat.evalType}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-stone-800">{stat.mean}</span>
                <span className="text-sm text-stone-400">± {stat.stdDev}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Desviación estándar: {stat.stdDev}
              </div>
              <div className="pt-2 border-t border-stone-200 text-xs text-stone-400">
                <span className="font-medium text-stone-500">{stat.count}</span> sesiones registradas
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
