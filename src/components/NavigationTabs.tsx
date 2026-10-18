import React from 'react';
import {
  Table,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  Smartphone,
} from 'lucide-react';

export type ActiveTab = 'planilla' | 'tareas' | 'estudiantes' | 'reportes' | 'cursos' | 'android';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  studentCount: number;
  taskCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
  studentCount,
  taskCount,
}) => {
  const tabs = [
    {
      id: 'planilla' as ActiveTab,
      label: 'Planilla de Calificaciones',
      shortLabel: 'Planilla',
      icon: Table,
      badge: null,
    },
    {
      id: 'tareas' as ActiveTab,
      label: 'Control de Tareas y Atrasos',
      shortLabel: 'Tareas',
      icon: CheckSquare,
      badge: taskCount > 0 ? taskCount : null,
    },
    {
      id: 'estudiantes' as ActiveTab,
      label: 'Nómina e Importación Excel',
      shortLabel: 'Estudiantes',
      icon: Users,
      badge: studentCount,
    },
    {
      id: 'reportes' as ActiveTab,
      label: 'Reportes y Exportación',
      shortLabel: 'Reportes',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'cursos' as ActiveTab,
      label: 'Cursos y Escalas',
      shortLabel: 'Cursos',
      icon: Settings,
      badge: null,
    },
    {
      id: 'android' as ActiveTab,
      label: 'Código Android Studio (Room/Compose)',
      shortLabel: 'Código Android',
      icon: Smartphone,
      isSpecial: true,
      badge: 'Completo',
    },
  ];

  return (
    <nav className="bg-slate-100/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? tab.isSpecial
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                  : tab.isSpecial
                  ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.shortLabel}</span>
              {tab.badge !== null && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.isSpecial
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
