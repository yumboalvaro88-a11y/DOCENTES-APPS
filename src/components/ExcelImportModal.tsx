import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle,
  X,
  AlertCircle,
  Users,
} from 'lucide-react';
import { Course, Student } from '../types.ts';
import {
  parseStudentsExcel,
  downloadStudentTemplate,
  ExcelImportResult,
} from '../utils/excelParser.ts';

interface ExcelImportModalProps {
  course: Course;
  existingStudents: Student[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (newStudents: Omit<Student, 'id' | 'courseId' | 'orderIndex'>[]) => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  course,
  existingStudents,
  isOpen,
  onClose,
  onConfirmImport,
}) => {
  const [importResult, setImportResult] = useState<ExcelImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const buffer = await file.arrayBuffer();
      const existingIds = existingStudents.map(s => s.idNumber);
      const result = parseStudentsExcel(buffer, file.name, existingIds);
      setImportResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el archivo Excel.');
      setImportResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = () => {
    if (!importResult || importResult.validStudents.length === 0) return;

    const payload = importResult.validStudents.map(s => ({
      idNumber: s.idNumber,
      lastName: s.lastName,
      firstName: s.firstName,
      email: s.email,
    }));

    onConfirmImport(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Importar Nómina de Estudiantes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Curso: <strong>{course.name}</strong> • Archivos compatibles: .xlsx y .xls
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Step 1: Upload or Download Template */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download Template Card */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Plantilla Oficial de Excel</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Descarga el formato de hoja de cálculo con las columnas exactas (N.º, Cédula/ID, Apellidos, Nombres, Correo).
                </p>
              </div>
              <button
                type="button"
                onClick={downloadStudentTemplate}
                className="mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:border-emerald-500 shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Descargar Plantilla (.xlsx)</span>
              </button>
            </div>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-300 dark:border-blue-900/60 hover:border-blue-500 rounded-xl p-4 bg-blue-50/30 dark:bg-blue-950/20 cursor-pointer flex flex-col items-center justify-center text-center transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-1" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Haz clic para seleccionar tu archivo Excel
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Archivos .xlsx y .xls hasta 10MB
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-semibold">Error al leer el archivo</p>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="py-12 text-center text-slate-500 text-xs">
              Procesando y validando filas del archivo Excel...
            </div>
          )}

          {/* Step 2: Validation Preview */}
          {importResult && (
            <div className="space-y-4">
              {/* Summary Stats Badges */}
              <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Archivo: <strong>{importResult.fileName}</strong>
                </span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {importResult.summary.validCount} listas para importar
                </span>
                {importResult.summary.errorCount > 0 && (
                  <span className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {importResult.summary.errorCount} con errores o duplicados
                  </span>
                )}
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 w-12 text-center">Fila</th>
                      <th className="px-3 py-2">Cédula / ID</th>
                      <th className="px-3 py-2">Apellidos</th>
                      <th className="px-3 py-2">Nombres</th>
                      <th className="px-3 py-2">Correo</th>
                      <th className="px-3 py-2 text-center">Estado Validación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {/* Valid rows */}
                    {importResult.validStudents.map(student => (
                      <tr key={`v-${student.rowNumber}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-3 py-2 text-center text-slate-400 font-mono">
                          {student.rowNumber}
                        </td>
                        <td className="px-3 py-2 font-mono font-medium">{student.idNumber}</td>
                        <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">
                          {student.lastName}
                        </td>
                        <td className="px-3 py-2">{student.firstName}</td>
                        <td className="px-3 py-2 text-slate-500">{student.email || '-'}</td>
                        <td className="px-3 py-2 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle className="w-3 h-3" /> Válido
                          </span>
                        </td>
                      </tr>
                    ))}

                    {/* Invalid rows */}
                    {importResult.invalidRows.map(row => (
                      <tr key={`err-${row.rowNumber}`} className="bg-rose-50/50 dark:bg-rose-950/20">
                        <td className="px-3 py-2 text-center text-rose-500 font-mono">
                          {row.rowNumber}
                        </td>
                        <td className="px-3 py-2 font-mono text-rose-600">{row.idNumber || '(Vacía)'}</td>
                        <td className="px-3 py-2 text-rose-900 dark:text-rose-200">{row.lastName || '(Falta apellido)'}</td>
                        <td className="px-3 py-2 text-rose-900 dark:text-rose-200">{row.firstName || '(Falta nombre)'}</td>
                        <td className="px-3 py-2 text-slate-500">{row.email || '-'}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col gap-0.5">
                            {row.errors.map((err, i) => (
                              <span key={i} className="text-[10px] font-medium text-rose-700 dark:text-rose-300">
                                • {err}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!importResult || importResult.summary.validCount === 0}
            onClick={handleConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-xs transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>
              Confirmar e Importar {importResult ? importResult.summary.validCount : 0} Estudiantes
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
