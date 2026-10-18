import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Sliders,
  CheckCircle,
  Calendar,
  Layers,
} from 'lucide-react';
import { Course } from '../types.ts';

interface CoursesManagerProps {
  courses: Course[];
  activeCourseId: string | null;
  onSelectCourse: (id: string) => void;
  onCreateCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const CoursesManager: React.FC<CoursesManagerProps> = ({
  courses,
  activeCourseId,
  onSelectCourse,
  onCreateCourse,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [period, setPeriod] = useState('Primer Quimestre');
  const [scaleMin, setScaleMin] = useState(0);
  const [scaleMax, setScaleMax] = useState(10);
  const [passingThreshold, setPassingThreshold] = useState(7.0);
  const [riskThreshold, setRiskThreshold] = useState(5.0);
  const [penaltyPerDayLate, setPenaltyPerDayLate] = useState(0.5);
  const [maxLatePenalty, setMaxLatePenalty] = useState(3.0);

  const resetForm = () => {
    setName('');
    setSubject('');
    setAcademicYear('2025-2026');
    setPeriod('Primer Quimestre');
    setScaleMin(0);
    setScaleMax(10);
    setPassingThreshold(7.0);
    setRiskThreshold(5.0);
    setPenaltyPerDayLate(0.5);
    setMaxLatePenalty(3.0);
    setEditingCourse(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setName(course.name);
    setSubject(course.subject);
    setAcademicYear(course.academicYear);
    setPeriod(course.period);
    setScaleMin(course.scaleMin);
    setScaleMax(course.scaleMax);
    setPassingThreshold(course.passingThreshold);
    setRiskThreshold(course.riskThreshold);
    setPenaltyPerDayLate(course.penaltyPerDayLate);
    setMaxLatePenalty(course.maxLatePenalty);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) return;

    if (editingCourse) {
      onUpdateCourse({
        ...editingCourse,
        name: name.trim(),
        subject: subject.trim(),
        academicYear: academicYear.trim(),
        period: period.trim(),
        scaleMin: Number(scaleMin),
        scaleMax: Number(scaleMax),
        passingThreshold: Number(passingThreshold),
        riskThreshold: Number(riskThreshold),
        penaltyPerDayLate: Number(penaltyPerDayLate),
        maxLatePenalty: Number(maxLatePenalty),
      });
    } else {
      onCreateCourse({
        name: name.trim(),
        subject: subject.trim(),
        academicYear: academicYear.trim(),
        period: period.trim(),
        scaleMin: Number(scaleMin),
        scaleMax: Number(scaleMax),
        passingThreshold: Number(passingThreshold),
        riskThreshold: Number(riskThreshold),
        penaltyPerDayLate: Number(penaltyPerDayLate),
        maxLatePenalty: Number(maxLatePenalty),
      });
    }

    setShowModal(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Gestión de Cursos y Paralelos
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Administra tus paralelos, asignaturas, escalas de evaluación y políticas de atrasos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Curso</span>
        </button>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => {
          const isActive = course.id === activeCourseId;

          return (
            <div
              key={course.id}
              className={`rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-700 shadow-md ring-1 ring-blue-400/40'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {course.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{course.subject}</p>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white">
                      <CheckCircle className="w-3 h-3" /> Activo
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectCourse(course.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-0.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    >
                      Seleccionar
                    </button>
                  )}
                </div>

                {/* Details badge list */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Año Lectivo:
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200">{course.academicYear}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      Periodo:
                    </span>
                    <strong className="text-slate-800 dark:text-slate-200">{course.period}</strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Escala y Aprobación:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {course.scaleMin} a {course.scaleMax} (Aprobado &gt;= {course.passingThreshold})
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Penalización por atraso:</span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold">
                      -{course.penaltyPerDayLate} pts/día (máx -{course.maxLatePenalty})
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(course)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Configurar</span>
                </button>

                {courses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar el curso "${course.name}" y todos sus alumnos y notas?`)) {
                        onDeleteCourse(course.id);
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create / Edit Course */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {editingCourse ? 'Editar Configuración del Curso' : 'Crear Nuevo Curso o Paralelo'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Ingresa los datos generales del curso, la escala de calificación y los parámetros de penalización.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre del Curso / Paralelo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej: 8vo EGB - Paralelo A"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Asignatura / Materia *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Ej: Matemáticas"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Año Lectivo
                  </label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    placeholder="Ej: 2025-2026"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Periodo (Quimestre/Trimestre/Parcial)
                  </label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    placeholder="Ej: Primer Quimestre"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Scale Configuration */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>Configuración de Escala y Umbrales</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                      Nota Máxima
                    </label>
                    <input
                      type="number"
                      step="1"
                      min={1}
                      max={100}
                      value={scaleMax}
                      onChange={e => setScaleMax(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-emerald-600 font-medium mb-1">
                      Umbral de Aprobado (&gt;=)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={passingThreshold}
                      onChange={e => setPassingThreshold(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-emerald-700 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-amber-600 font-medium mb-1">
                      Umbral de Riesgo (&gt;=)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={riskThreshold}
                      onChange={e => setRiskThreshold(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-amber-700 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-rose-600 font-medium mb-1">
                      Penalización por Día Atraso
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={penaltyPerDayLate}
                      onChange={e => setPenaltyPerDayLate(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-rose-700 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {editingCourse ? 'Actualizar Curso' : 'Crear Curso'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
