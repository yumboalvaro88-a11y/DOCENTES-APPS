import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Filter,
  Trash2,
  ChevronDown,
  Info,
} from 'lucide-react';
import { Course, Student, TaskAssignment, TaskSubmission } from '../types.ts';
import { calculateLateDaysAndPenalty } from '../utils/gradeCalculations.ts';

interface TaskTrackingProps {
  course: Course;
  students: Student[];
  tasks: TaskAssignment[];
  submissions: TaskSubmission[];
  onAddTask: (task: Omit<TaskAssignment, 'id' | 'courseId'>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateSubmission: (
    taskId: string,
    studentId: string,
    isDelivered: boolean,
    deliveryDate?: string,
    score?: number | null,
    notes?: string
  ) => void;
}

export const TaskTracking: React.FC<TaskTrackingProps> = ({
  course,
  students,
  tasks,
  submissions,
  onAddTask,
  onDeleteTask,
  onUpdateSubmission,
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OVERDUE' | 'PENDING' | 'ON_TIME'>('ALL');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // Form state for creating task
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignedDate, setNewAssignedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const activeTask = useMemo(() => {
    return tasks.find(t => t.id === selectedTaskId) || tasks[0] || null;
  }, [tasks, selectedTaskId]);

  // Map submissions for the active task
  const taskSubmissionsMap = useMemo(() => {
    const map = new Map<string, TaskSubmission>();
    if (!activeTask) return map;
    submissions
      .filter(s => s.taskId === activeTask.id)
      .forEach(s => map.set(s.studentId, s));
    return map;
  }, [submissions, activeTask]);

  // Today's date string YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute stats and rows for current task
  const computedRows = useMemo(() => {
    if (!activeTask) return [];

    return students.map(student => {
      const sub = taskSubmissionsMap.get(student.id);
      const isDelivered = sub?.isDelivered ?? false;
      const deliveryDate = sub?.deliveryDate;
      const rawScore = sub?.score ?? null;

      const lateCalc = calculateLateDaysAndPenalty(
        activeTask.dueDate,
        deliveryDate,
        isDelivered,
        rawScore,
        todayStr,
        course
      );

      return {
        student,
        submission: sub,
        isDelivered,
        deliveryDate: deliveryDate || '',
        rawScore,
        notes: sub?.notes || '',
        ...lateCalc,
      };
    });
  }, [students, activeTask, taskSubmissionsMap, todayStr, course]);

  // Filter rows
  const filteredRows = useMemo(() => {
    if (statusFilter === 'ALL') return computedRows;
    if (statusFilter === 'OVERDUE') {
      return computedRows.filter(r => r.status === 'CON_ATRASO' || r.status === 'NO_ENTREGO');
    }
    if (statusFilter === 'PENDING') {
      return computedRows.filter(r => !r.isDelivered);
    }
    if (statusFilter === 'ON_TIME') {
      return computedRows.filter(r => r.status === 'A_TIEMPO');
    }
    return computedRows;
  }, [computedRows, statusFilter]);

  // Summary counts
  const summary = useMemo(() => {
    let onTime = 0;
    let lateDelivered = 0;
    let overdueUndelivered = 0;
    let pendingOnTime = 0;

    computedRows.forEach(r => {
      if (r.status === 'A_TIEMPO') onTime++;
      else if (r.status === 'CON_ATRASO') lateDelivered++;
      else if (r.status === 'NO_ENTREGO') overdueUndelivered++;
      else pendingOnTime++;
    });

    return {
      onTime,
      lateDelivered,
      overdueUndelivered,
      pendingOnTime,
      totalLate: lateDelivered + overdueUndelivered,
    };
  }, [computedRows]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim(),
      assignedDate: newAssignedDate,
      dueDate: newDueDate,
      maxScore: course.scaleMax,
    });
    setNewTitle('');
    setNewDesc('');
    setShowNewTaskModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Task Selector & Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 sm:w-auto">
            Tarea activa:
          </label>
          <div className="relative flex-1 max-w-md">
            <select
              value={activeTask?.id || ''}
              onChange={e => setSelectedTaskId(e.target.value)}
              className="w-full appearance-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-medium rounded-lg px-3 py-2 pr-8 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {tasks.length === 0 ? (
                <option value="">No hay tareas creadas</option>
              ) : (
                tasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title} (Límite: {t.dueDate})
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTask && (
            <button
              onClick={() => {
                if (confirm(`¿Eliminar la tarea "${activeTask.title}"?`)) {
                  onDeleteTask(activeTask.id);
                }
              }}
              title="Eliminar tarea actual"
              className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-200 dark:border-rose-900"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {activeTask ? (
        <>
          {/* Active Task Details & Policy Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Task Info */}
            <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {activeTask.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {activeTask.description || 'Sin descripción adicional.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  Asignada: <strong>{activeTask.assignedDate}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Fecha límite: <strong className="text-slate-800 dark:text-slate-200">{activeTask.dueDate}</strong>
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  (Hoy: {todayStr})
                </span>
              </div>
            </div>

            {/* Late Policy Card */}
            <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Política de Atrasos del Curso</span>
              </div>
              <ul className="mt-2 text-xs text-amber-900/90 dark:text-amber-200/80 space-y-1">
                <li>• Penalización: <strong>-{course.penaltyPerDayLate} pts</strong> por cada día de atraso.</li>
                <li>• Penalización máxima: <strong>-{course.maxLatePenalty} pts</strong>.</li>
                <li>• Los atrasos sin entregar acumulan días automáticamente hasta la fecha de hoy.</li>
              </ul>
            </div>
          </div>

          {/* Quick Filter Buttons Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                statusFilter === 'ALL'
                  ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>Todos los estudiantes</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200/50 dark:bg-slate-700">
                {computedRows.length}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('OVERDUE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                statusFilter === 'OVERDUE'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Con Atraso</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 dark:bg-rose-950/80">
                {summary.totalLate}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                statusFilter === 'PENDING'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pendientes sin entregar</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950/80">
                {summary.overdueUndelivered + summary.pendingOnTime}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('ON_TIME')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                statusFilter === 'ON_TIME'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Entregadas a tiempo</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950/80">
                {summary.onTime}
              </span>
            </button>
          </div>

          {/* Submissions Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">N.º</th>
                    <th className="px-4 py-3">Estudiante</th>
                    <th className="px-4 py-3 text-center w-28">¿Entregada?</th>
                    <th className="px-4 py-3 w-40 text-center">Fecha Entrega Real</th>
                    <th className="px-4 py-3 text-center">Estado y Días de Atraso</th>
                    <th className="px-4 py-3 text-center w-28">Nota Base</th>
                    <th className="px-4 py-3 text-center w-28">Penalización</th>
                    <th className="px-4 py-3 text-center w-28">Nota Ajustada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
                  {filteredRows.map((row, idx) => {
                    const isLate = row.daysLate > 0;

                    let badgeColor = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
                    if (row.status === 'A_TIEMPO') {
                      badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
                    } else if (row.status === 'CON_ATRASO') {
                      badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800';
                    } else if (row.status === 'NO_ENTREGO') {
                      badgeColor = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
                    }

                    return (
                      <tr key={row.student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-center font-mono text-xs text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {row.student.lastName} {row.student.firstName}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {row.student.idNumber}
                          </p>
                        </td>

                        {/* Delivered Toggle */}
                        <td className="px-4 py-3 text-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={row.isDelivered}
                              onChange={e => {
                                const delivered = e.target.checked;
                                onUpdateSubmission(
                                  activeTask.id,
                                  row.student.id,
                                  delivered,
                                  delivered ? (row.deliveryDate || todayStr) : undefined,
                                  row.rawScore,
                                  row.notes
                                );
                              }}
                              className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                            />
                          </label>
                        </td>

                        {/* Delivery Date Picker */}
                        <td className="px-4 py-3 text-center">
                          <input
                            type="date"
                            disabled={!row.isDelivered}
                            value={row.deliveryDate || ''}
                            onChange={e => {
                              onUpdateSubmission(
                                activeTask.id,
                                row.student.id,
                                true,
                                e.target.value,
                                row.rawScore,
                                row.notes
                              );
                            }}
                            className="text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>

                        {/* Status & Days Late Badge */}
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}
                          >
                            {row.statusLabel}
                          </span>
                        </td>

                        {/* Raw Score Input */}
                        <td className="px-4 py-3 text-center">
                          <input
                            type="number"
                            step="0.1"
                            min={0}
                            max={activeTask.maxScore}
                            placeholder="-"
                            value={row.rawScore !== null && row.rawScore !== undefined ? row.rawScore : ''}
                            onChange={e => {
                              const val = e.target.value === '' ? null : Number(e.target.value);
                              onUpdateSubmission(
                                activeTask.id,
                                row.student.id,
                                row.isDelivered,
                                row.deliveryDate,
                                val,
                                row.notes
                              );
                            }}
                            className="w-16 px-2 py-1 text-center font-semibold text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>

                        {/* Penalty Deduction */}
                        <td className="px-4 py-3 text-center">
                          {row.penalty > 0 ? (
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                              -{row.penalty.toFixed(1)} pts
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">0.0</span>
                          )}
                        </td>

                        {/* Final Adjusted Score */}
                        <td className="px-4 py-3 text-center">
                          {row.adjustedGrade !== null ? (
                            <span
                              className={`text-xs font-bold ${
                                row.adjustedGrade >= course.passingThreshold
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : row.adjustedGrade >= course.riskThreshold
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {row.adjustedGrade.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500">
          <p className="text-sm">No hay tareas asignadas en este curso.</p>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Crear Primera Tarea
          </button>
        </div>
      )}

      {/* Modal: Create Task */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Crear Nueva Tarea o Trabajo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Define los parámetros de la tarea y la fecha límite para el control de atrasos.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título de la Tarea *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ej: Taller 3: Factorización de Polinomios"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción e Instrucciones
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Detalles sobre formato de entrega, rúbrica o ejercicios..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha de Asignación
                  </label>
                  <input
                    type="date"
                    required
                    value={newAssignedDate}
                    onChange={e => setNewAssignedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha Límite de Entrega *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
