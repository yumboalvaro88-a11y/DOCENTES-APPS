import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Trophy,
  FileSpreadsheet,
  FileText,
  Share2,
  Mail,
  MessageCircle,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  User,
} from 'lucide-react';
import { Course, Student, Category, Grade, TaskAssignment, TaskSubmission } from '../types.ts';
import {
  calculateWeightedAverage,
  getGradeStatus,
  getGradeStatusColor,
  calculateLateDaysAndPenalty,
} from '../utils/gradeCalculations.ts';
import {
  exportCourseToExcel,
  exportCourseToPdf,
  exportStudentReportToPdf,
} from '../utils/exportReports.ts';

interface ReportsViewProps {
  course: Course;
  students: Student[];
  categories: Category[];
  grades: Grade[];
  tasks: TaskAssignment[];
  submissions: TaskSubmission[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  course,
  students,
  categories,
  grades,
  tasks,
  submissions,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');

  // Grade map
  const gradeMap = useMemo(() => {
    const map = new Map<string, number | null>();
    grades.forEach(g => map.set(`${g.studentId}_${g.categoryId}`, g.score));
    return map;
  }, [grades]);

  // Ranking & Course Statistics
  const rankingList = useMemo(() => {
    return students
      .map(student => {
        const studentGrades: Record<string, number | null> = {};
        categories.forEach(c => {
          studentGrades[c.id] = gradeMap.get(`${student.id}_${c.id}`) ?? null;
        });

        const avg = calculateWeightedAverage(studentGrades, categories);
        const status = getGradeStatus(avg, course);

        // Student's tasks stats
        const studentSubs = submissions.filter(s => s.studentId === student.id);
        let deliveredCount = 0;
        let lateCount = 0;
        tasks.forEach(t => {
          const sub = studentSubs.find(s => s.taskId === t.id);
          const calc = calculateLateDaysAndPenalty(
            t.dueDate,
            sub?.deliveryDate,
            sub?.isDelivered ?? false,
            sub?.score,
            new Date().toISOString().split('T')[0],
            course
          );
          if (sub?.isDelivered) deliveredCount++;
          if (calc.daysLate > 0) lateCount++;
        });

        return {
          student,
          studentGrades,
          avg,
          status,
          deliveredCount,
          lateCount,
        };
      })
      .sort((a, b) => (b.avg ?? -1) - (a.avg ?? -1));
  }, [students, categories, gradeMap, submissions, tasks, course]);

  // Selected Student Details
  const selectedStudentData = useMemo(() => {
    return rankingList.find(r => r.student.id === selectedStudentId) || rankingList[0] || null;
  }, [rankingList, selectedStudentId]);

  // Course overview metrics
  const courseMetrics = useMemo(() => {
    let totalAprobados = 0;
    let totalEnRiesgo = 0;
    let totalReprobados = 0;
    let sumPromedios = 0;
    let totalConPromedio = 0;

    rankingList.forEach(r => {
      if (r.status === 'APROBADO') totalAprobados++;
      else if (r.status === 'EN_RIESGO') totalEnRiesgo++;
      else if (r.status === 'REPROBADO') totalReprobados++;

      if (r.avg !== null) {
        sumPromedios += r.avg;
        totalConPromedio++;
      }
    });

    const average = totalConPromedio > 0 ? sumPromedios / totalConPromedio : 0;
    const approvalRate = students.length > 0 ? (totalAprobados / students.length) * 100 : 0;

    return {
      average: Number(average.toFixed(2)),
      approvalRate: Number(approvalRate.toFixed(1)),
      totalAprobados,
      totalEnRiesgo,
      totalReprobados,
    };
  }, [rankingList, students.length]);

  // Share via WhatsApp or Email
  const handleShareReport = (channel: 'whatsapp' | 'email') => {
    if (!selectedStudentData) return;
    const s = selectedStudentData.student;
    const avg = selectedStudentData.avg !== null ? selectedStudentData.avg.toFixed(2) : 'Sin calificar';
    const status = selectedStudentData.status || 'En proceso';

    const text = `*Reporte de Calificaciones - ${course.name}*\n` +
      `Estudiante: ${s.lastName} ${s.firstName}\n` +
      `Materia: ${course.subject}\n` +
      `Periodo: ${course.period}\n` +
      `Promedio Final: ${avg} / ${course.scaleMax} (${status})\n` +
      `Tareas entregadas: ${selectedStudentData.deliveredCount} de ${tasks.length} (Atrasos: ${selectedStudentData.lateCount})\n` +
      `Emitido por el docente a través de Registro de Calificaciones.`;

    if (channel === 'whatsapp') {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    } else {
      const subject = encodeURIComponent(`Boletín de Calificaciones - ${s.lastName} ${s.firstName} - ${course.name}`);
      const body = encodeURIComponent(text);
      window.location.href = `mailto:${s.email || ''}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Export Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white mb-2">
            Centro de Reportes Académicos
          </span>
          <h2 className="text-xl font-bold">
            Reportes y Estadísticas de {course.name}
          </h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Genera actas consolidadas en Excel (.xlsx) y PDF oficial, analiza el cuadro de honor y emite boletines individuales.
          </p>
        </div>

        {/* Global Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportCourseToExcel(course, students, categories, grades)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => exportCourseToPdf(course, students, categories, grades)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-rose-800 hover:bg-rose-50 transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>Exportar Acta PDF</span>
          </button>
        </div>
      </div>

      {/* Course High-level Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Promedio del Curso</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {courseMetrics.average.toFixed(2)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Escala 0 a {course.scaleMax}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-emerald-600 font-medium">Tasa de Aprobación</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {courseMetrics.approvalRate}%
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{courseMetrics.totalAprobados} de {students.length} estudiantes</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-amber-600 font-medium">Estudiantes en Riesgo</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {courseMetrics.totalEnRiesgo}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Nota entre {course.riskThreshold} y {course.passingThreshold}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <p className="text-xs text-rose-600 font-medium">Reprobados</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {courseMetrics.totalReprobados}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Nota menor a {course.riskThreshold}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Cuadro de Honor & Ranking del Curso */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ranking y Cuadro de Honor
                </h3>
              </div>
              <span className="text-xs text-slate-500">Ordenado por promedio ponderado</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {rankingList.map((item, index) => {
                const statusStyle = getGradeStatusColor(item.avg, course);
                const isSelected = item.student.id === selectedStudentId;

                return (
                  <div
                    key={item.student.id}
                    onClick={() => setSelectedStudentId(item.student.id)}
                    className={`py-3 px-3 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Trophy or Rank index */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">
                        {index === 0 ? (
                          <span className="text-base">🥇</span>
                        ) : index === 1 ? (
                          <span className="text-base">🥈</span>
                        ) : index === 2 ? (
                          <span className="text-base">🥉</span>
                        ) : (
                          <span className="text-slate-400 font-mono">#{index + 1}</span>
                        )}
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                          {item.student.lastName} {item.student.firstName}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          ID: {item.student.idNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className={`text-sm font-bold ${statusStyle.textColor}`}>
                          {item.avg !== null ? item.avg.toFixed(2) : '-'}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {item.deliveredCount}/{tasks.length} tareas
                        </p>
                      </div>

                      <span
                        className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.badgeBg} ${statusStyle.badgeText}`}
                      >
                        {statusStyle.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Individual Student Report Card */}
        <div className="lg:col-span-5 space-y-4">
          {selectedStudentData ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs sticky top-20">
              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-base">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedStudentData.student.lastName}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {selectedStudentData.student.firstName}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Cédula: {selectedStudentData.student.idNumber}
                    </p>
                  </div>
                </div>

                {/* Big Score Box */}
                <div className="text-right bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Promedio</p>
                  <p
                    className={`text-xl font-bold ${
                      getGradeStatusColor(selectedStudentData.avg, course).textColor
                    }`}
                  >
                    {selectedStudentData.avg !== null ? selectedStudentData.avg.toFixed(2) : '-'}
                  </p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="py-4 space-y-2.5 border-b border-slate-200 dark:border-slate-800">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Desglose por Categoría
                </h5>
                <div className="space-y-1.5">
                  {categories.map(c => {
                    const score = selectedStudentData.studentGrades[c.id];
                    const percent = score !== null && score !== undefined ? (score / course.scaleMax) * 100 : 0;
                    return (
                      <div key={c.id} className="text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-600 dark:text-slate-400">
                            {c.name} ({c.weightPercentage}%)
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {score !== null && score !== undefined ? score.toFixed(1) : '-'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              score !== null && score !== undefined && score >= course.passingThreshold
                                ? 'bg-emerald-500'
                                : score !== null && score !== undefined && score >= course.riskThreshold
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tasks & Late Days Stats */}
              <div className="py-4 border-b border-slate-200 dark:border-slate-800 text-xs">
                <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Control de Tareas y Cumplimiento
                </h5>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 text-[10px]">Tareas Entregadas</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {selectedStudentData.deliveredCount} / {tasks.length}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 text-[10px]">Atrasos Registrados</p>
                    <p className={`text-sm font-bold mt-0.5 ${selectedStudentData.lateCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {selectedStudentData.lateCount}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions: Download PDF & Share */}
              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    exportStudentReportToPdf(
                      course,
                      selectedStudentData.student,
                      categories,
                      grades,
                      tasks,
                      submissions
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Boletín Individual (PDF)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleShareReport('whatsapp')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareReport('email')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Correo</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Selecciona un estudiante para ver su boletín.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
