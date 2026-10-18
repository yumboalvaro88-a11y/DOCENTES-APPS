import React from 'react';
import {
  GraduationCap,
  Moon,
  Sun,
  FileSpreadsheet,
  Download,
  Upload,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { Course } from '../types.ts';
import { downloadStudentTemplate } from '../utils/excelParser.ts';

interface HeaderProps {
  courses: Course[];
  activeCourse: Course | null;
  onSelectCourse: (courseId: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenBackup: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  courses,
  activeCourse,
  onSelectCourse,
  isDarkMode,
  onToggleDarkMode,
  onOpenBackup,
  onResetData,
}) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Registro de Calificaciones
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Docentes
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Planilla, control de tareas, importación Excel y Room Database
            </p>
          </div>
        </div>

        {/* Course Selector & Global Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Course Selector */}
          <div className="relative">
            <select
              value={activeCourse?.id || ''}
              onChange={e => onSelectCourse(e.target.value)}
              className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium rounded-lg px-3 py-2 pr-8 border border-slate-300 dark:border-slate-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.subject} ({course.period})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Download Excel Template Button */}
          <button
            onClick={downloadStudentTemplate}
            title="Descargar plantilla de nómina en Excel (.xlsx)"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Plantilla Excel</span>
          </button>

          {/* Backup / Restore */}
          <button
            onClick={onOpenBackup}
            title="Respaldo y Restauración de Base de Datos"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
