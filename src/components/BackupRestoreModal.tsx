import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  X,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';
import { DatabaseState } from '../types.ts';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: DatabaseState;
  onRestoreDatabase: (db: DatabaseState) => void;
  onResetToDefaults: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  database,
  onRestoreDatabase,
  onResetToDefaults,
}) => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJson = () => {
    try {
      const dataStr = JSON.stringify(database, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Respaldo_RegistroCalificaciones_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: 'Respaldo exportado exitosamente.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Error al exportar el respaldo.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.courses || !parsed.students || !parsed.categories || !parsed.grades) {
          throw new Error('El archivo no contiene la estructura de base de datos válida.');
        }
        onRestoreDatabase(parsed);
        setStatusMessage({ type: 'success', text: 'Base de datos restaurada correctamente.' });
        setTimeout(() => onClose(), 1500);
      } catch (err: any) {
        setStatusMessage({ type: 'error', text: err.message || 'Error al restaurar archivo JSON.' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Respaldo y Restauración
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="space-y-3">
          {/* Export Button */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Exportar Copia de Seguridad
              </p>
              <p className="text-[11px] text-slate-500">
                Descarga un archivo JSON con todos los cursos, estudiantes, tareas y notas.
              </p>
            </div>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>

          {/* Import Button */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Restaurar desde Respaldo
              </p>
              <p className="text-[11px] text-slate-500">
                Carga un archivo de respaldo previo en formato JSON.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 shadow-2xs transition-colors shrink-0"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Importar</span>
            </button>
          </div>

          {/* Reset to Default */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Restaurar Datos de Demostración
              </p>
              <p className="text-[11px] text-slate-500">
                Recarga los datos de ejemplo iniciales (3 cursos, estudiantes, tareas y calificaciones).
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('¿Restaurar la base de datos a los valores de demostración iniciales?')) {
                  onResetToDefaults();
                  setStatusMessage({ type: 'success', text: 'Datos de demostración restaurados.' });
                  setTimeout(() => onClose(), 1200);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 shadow-2xs transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar</span>
            </button>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
