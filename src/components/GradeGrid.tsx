import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Check,
  AlertTriangle,
  Info,
  Sliders,
} from 'lucide-react';
import { Course, Student, Category, Grade } from '../types.ts';
import {
  calculateWeightedAverage,
  getGradeStatus,
  getGradeStatusColor,
} from '../utils/gradeCalculations.ts';

interface GradeGridProps {
  course: Course;
  students: Student[];
  categories: Category[];
  grades: Grade[];
  onUpdateGrade: (studentId: string, categoryId: string, score: number | null) => void;
  onAddCategory: (name: string, weightPercentage: number) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const GradeGrid: React.FC<GradeGridProps> = ({
  course,
  students,
  categories,
  grades,
  onUpdateGrade,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatWeight, setNewCatWeight] = useState(20);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Fast grade lookup map: `${studentId}_${categoryId}` -> score
  const gradeMap = useMemo(() => {
    const map = new Map<string, number | null>();
    grades.forEach(g => {
      map.set(`${g.studentId}_${g.categoryId}`, g.score);
    });
    return map;
  }, [grades]);

  // Filter students by name or ID
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase().trim();
    return students.filter(
      s =>
        s.lastName.toLowerCase().includes(q) ||
        s.firstName.toLowerCase().includes(q) ||
        s.idNumber.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  // Total weight percentage of all categories
  const totalWeight = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.weightPercentage, 0);
  }, [categories]);

  // Summary statistics for the course
  const summaryStats = useMemo(() => {
    let totalAprobados = 0;
    let totalEnRiesgo = 0;
    let totalReprobados = 0;
    let sumAverages = 0;
    let countedAverages = 0;

    const studentCalculations = students.map(s => {
      const studentGrades: Record<string, number | null> = {};
      categories.forEach(c => {
        studentGrades[c.id] = gradeMap.get(`${s.id}_${c.id}`) ?? null;
      });
      const avg = calculateWeightedAverage(studentGrades, categories);
      const status = getGradeStatus(avg, course);

      if (status === 'APROBADO') totalAprobados++;
      else if (status === 'EN_RIESGO') totalEnRiesgo++;
      else if (status === 'REPROBADO') totalReprobados++;

      if (avg !== null) {
        sumAverages += avg;
        countedAverages++;
      }

      return { student: s, avg, status };
    });

    const generalAverage = countedAverages > 0 ? Number((sumAverages / countedAverages).toFixed(2)) : 0;

    return {
      totalAprobados,
      totalEnRiesgo,
      totalReprobados,
      generalAverage,
      studentCalculations,
    };
  }, [students, categories, gradeMap, course]);

  // Handle cell change
  const handleCellChange = (studentId: string, categoryId: string, rawValue: string) => {
    if (rawValue.trim() === '') {
      onUpdateGrade(studentId, categoryId, null);
      return;
    }

    const parsed = parseFloat(rawValue);
    if (!isNaN(parsed)) {
      // Clamp between course scaleMin and scaleMax
      const clamped = Math.max(course.scaleMin, Math.min(course.scaleMax, parsed));
      onUpdateGrade(studentId, categoryId, Number(clamped.toFixed(2)));
    }
  };

  const handleCreateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim(), Number(newCatWeight));
    setNewCatName('');
    setNewCatWeight(20);
    setShowAddCatModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Course Summary Stat Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Promedio General</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {summaryStats.generalAverage.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">/ {course.scaleMax}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Aprobados (&gt;= {course.passingThreshold})</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {summaryStats.totalAprobados}
            </span>
            <span className="text-xs text-slate-400">
              {students.length > 0 ? `(${((summaryStats.totalAprobados / students.length) * 100).toFixed(0)}%)` : ''}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">En Riesgo ({course.riskThreshold} - {(course.passingThreshold - 0.01).toFixed(2)})</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
              {summaryStats.totalEnRiesgo}
            </span>
            <span className="text-xs text-slate-400">
              {students.length > 0 ? `(${((summaryStats.totalEnRiesgo / students.length) * 100).toFixed(0)}%)` : ''}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Reprobados (&lt; {course.riskThreshold})</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400">
              {summaryStats.totalReprobados}
            </span>
            <span className="text-xs text-slate-400">
              {students.length > 0 ? `(${((summaryStats.totalReprobados / students.length) * 100).toFixed(0)}%)` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Weight Warning if total != 100 */}
      {totalWeight !== 100 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            La suma de las ponderaciones de las categorías es <strong>{totalWeight}%</strong> (lo recomendado es 100%). Las notas se calcularán proporcionalmente.
          </span>
        </div>
      )}

      {/* Controls Bar: Search & Add Category */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por apellido, nombre o cédula..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCatModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Categoría</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Grid Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto max-h-[680px] overflow-y-auto relative">
          <table className="w-full text-left border-collapse min-w-[750px]">
            {/* Table Header */}
            <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-20 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <tr>
                {/* Sticky Left Column: Student Names */}
                <th className="sticky left-0 z-30 bg-slate-100 dark:bg-slate-800 px-3 py-3 w-64 border-b border-r border-slate-200 dark:border-slate-700 shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <span>Estudiante ({filteredStudents.length})</span>
                    <span className="text-[10px] text-slate-500 font-normal">Cédula / ID</span>
                  </div>
                </th>

                {/* Categories Columns */}
                {categories.map(cat => (
                  <th
                    key={cat.id}
                    className="px-3 py-3 w-28 min-w-[110px] text-center border-b border-r border-slate-200 dark:border-slate-700 group relative"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold truncate max-w-[90px]" title={cat.name}>
                          {cat.name}
                        </span>
                        <button
                          onClick={() => setEditingCategory(cat)}
                          title="Editar categoría o peso"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-blue-500"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-full mt-0.5">
                        {cat.weightPercentage}%
                      </span>
                    </div>
                  </th>
                ))}

                {/* Promedio Ponderado Column */}
                <th className="px-3 py-3 w-24 text-center border-b border-r border-slate-200 dark:border-slate-700 bg-slate-200/60 dark:bg-slate-800/80 font-bold text-slate-800 dark:text-slate-100">
                  <span>Promedio</span>
                </th>

                {/* Performance Status Column */}
                <th className="px-3 py-3 w-28 text-center border-b border-slate-200 dark:border-slate-700 bg-slate-200/60 dark:bg-slate-800/80 font-bold text-slate-800 dark:text-slate-100">
                  <span>Estado</span>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={categories.length + 3} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron estudiantes. Agrega alumnos o importa la nómina desde Excel.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const studentGrades: Record<string, number | null> = {};
                  categories.forEach(c => {
                    studentGrades[c.id] = gradeMap.get(`${student.id}_${c.id}`) ?? null;
                  });

                  const avg = calculateWeightedAverage(studentGrades, categories);
                  const statusStyle = getGradeStatusColor(avg, course);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* Sticky Left: Student Name and ID */}
                      <td className="sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50/80 dark:group-hover:bg-slate-800/50 px-3 py-2 border-r border-slate-200 dark:border-slate-700 shadow-[2px_0_4px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-[11px] font-mono text-slate-400 text-right">
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {student.lastName}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="truncate">{student.firstName}</span>
                              <span className="font-mono text-[10px] text-slate-400">({student.idNumber})</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Grade Cells for each Category */}
                      {categories.map(cat => {
                        const score = studentGrades[cat.id];
                        const cellColor = getGradeStatusColor(score, course);

                        return (
                          <td
                            key={cat.id}
                            className={`p-1 text-center border-r border-slate-200 dark:border-slate-700 ${
                              score !== null && score !== undefined ? cellColor.cellBg : ''
                            }`}
                          >
                            <input
                              type="number"
                              step="0.1"
                              min={course.scaleMin}
                              max={course.scaleMax}
                              value={score !== null && score !== undefined ? score : ''}
                              onChange={e => handleCellChange(student.id, cat.id, e.target.value)}
                              placeholder="-"
                              className={`w-full py-1.5 px-2 text-center text-xs font-semibold rounded-md border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none transition-colors ${
                                score !== null && score !== undefined ? cellColor.textColor : 'text-slate-400'
                              }`}
                            />
                          </td>
                        );
                      })}

                      {/* Promedio Final Calculated Cell */}
                      <td className="px-3 py-2 text-center border-r border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40">
                        <span className={`font-bold text-sm ${statusStyle.textColor}`}>
                          {avg !== null ? avg.toFixed(2) : '-'}
                        </span>
                      </td>

                      {/* Estado Badge Cell */}
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.badgeBg} ${statusStyle.badgeText}`}
                        >
                          {statusStyle.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Category */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Agregar Nueva Categoría / Casillero
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Crea un nuevo casillero de evaluación para este curso (ej.: Talleres, Participación, Examen Quimestral).
            </p>

            <form onSubmit={handleCreateCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="Ej: Talleres Grupales"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ponderación / Peso Porcentual (%)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={100}
                  value={newCatWeight}
                  onChange={e => setNewCatWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Peso actual sumado: {totalWeight}%. Con esta categoría sumará: {totalWeight + Number(newCatWeight)}%.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Guardar Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit / Delete Category */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Editar Categoría
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Modifica el nombre o la ponderación asignada a esta columna.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Peso Porcentual (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={editingCategory.weightPercentage}
                  onChange={e =>
                    setEditingCategory({
                      ...editingCategory,
                      weightPercentage: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Eliminar la categoría "${editingCategory.name}" y sus calificaciones asociadas?`)) {
                      onDeleteCategory(editingCategory.id);
                      setEditingCategory(null);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateCategory(editingCategory);
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
