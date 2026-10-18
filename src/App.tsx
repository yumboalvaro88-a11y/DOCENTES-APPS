import React, { useState, useEffect, useMemo } from 'react';
import { DatabaseState, Course, Student, Category, Grade, TaskAssignment, TaskSubmission } from './types.ts';
import { INITIAL_DATABASE } from './data/initialData.ts';
import { Header } from './components/Header.tsx';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs.tsx';
import { GradeGrid } from './components/GradeGrid.tsx';
import { TaskTracking } from './components/TaskTracking.tsx';
import { StudentsManager } from './components/StudentsManager.tsx';
import { ReportsView } from './components/ReportsView.tsx';
import { CoursesManager } from './components/CoursesManager.tsx';
import { AndroidCodeExplorer } from './components/AndroidCodeExplorer.tsx';
import { BackupRestoreModal } from './components/BackupRestoreModal.tsx';

const DB_STORAGE_KEY = 'registro_calificaciones_db_v1';
const THEME_STORAGE_KEY = 'registro_calificaciones_theme';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved ? saved === 'dark' : false;
  });

  // Database state
  const [db, setDb] = useState<DatabaseState>(() => {
    try {
      const saved = localStorage.getItem(DB_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading database from localStorage', e);
    }
    return INITIAL_DATABASE;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('planilla');

  // Backup modal state
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Sync theme with document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDarkMode]);

  // Persist db to localStorage on every change (auto-save)
  useEffect(() => {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Error saving database to localStorage', e);
    }
  }, [db]);

  // Active course
  const activeCourse = useMemo(() => {
    return db.courses.find(c => c.id === db.activeCourseId) || db.courses[0] || null;
  }, [db.courses, db.activeCourseId]);

  // Filtered entities for active course
  const courseStudents = useMemo(() => {
    if (!activeCourse) return [];
    return db.students
      .filter(s => s.courseId === activeCourse.id)
      .sort((a, b) => a.orderIndex - b.orderIndex || a.lastName.localeCompare(b.lastName));
  }, [db.students, activeCourse]);

  const courseCategories = useMemo(() => {
    if (!activeCourse) return [];
    return db.categories
      .filter(c => c.courseId === activeCourse.id)
      .sort((a, b) => a.orderIndex - b.orderIndex || a.name.localeCompare(b.name));
  }, [db.categories, activeCourse]);

  const courseGrades = useMemo(() => {
    if (!activeCourse) return [];
    const studentIds = new Set(courseStudents.map(s => s.id));
    return db.grades.filter(g => studentIds.has(g.studentId));
  }, [db.grades, courseStudents, activeCourse]);

  const courseTasks = useMemo(() => {
    if (!activeCourse) return [];
    return db.tasks
      .filter(t => t.courseId === activeCourse.id)
      .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  }, [db.tasks, activeCourse]);

  const courseSubmissions = useMemo(() => {
    const taskIds = new Set(courseTasks.map(t => t.id));
    return db.submissions.filter(s => taskIds.has(s.taskId));
  }, [db.submissions, courseTasks]);

  // Handlers for Courses
  const handleSelectCourse = (courseId: string) => {
    setDb(prev => ({ ...prev, activeCourseId: courseId }));
  };

  const handleCreateCourse = (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourseId = `curso-${Date.now()}`;
    const newCourse: Course = {
      ...courseData,
      id: newCourseId,
      createdAt: Date.now(),
    };

    // Default categories for new course
    const defaultCategories: Category[] = [
      { id: `cat-${Date.now()}-1`, courseId: newCourseId, name: 'Tareas', weightPercentage: 20, orderIndex: 1 },
      { id: `cat-${Date.now()}-2`, courseId: newCourseId, name: 'Lecciones', weightPercentage: 20, orderIndex: 2 },
      { id: `cat-${Date.now()}-3`, courseId: newCourseId, name: 'Aportes', weightPercentage: 20, orderIndex: 3 },
      { id: `cat-${Date.now()}-4`, courseId: newCourseId, name: 'Proyecto', weightPercentage: 20, orderIndex: 4 },
      { id: `cat-${Date.now()}-5`, courseId: newCourseId, name: 'Examen', weightPercentage: 20, orderIndex: 5 },
    ];

    setDb(prev => ({
      ...prev,
      courses: [...prev.courses, newCourse],
      categories: [...prev.categories, ...defaultCategories],
      activeCourseId: newCourseId,
    }));
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setDb(prev => ({
      ...prev,
      courses: prev.courses.map(c => (c.id === updatedCourse.id ? updatedCourse : c)),
    }));
  };

  const handleDeleteCourse = (courseId: string) => {
    setDb(prev => {
      const remaining = prev.courses.filter(c => c.id !== courseId);
      const nextActiveId = remaining[0]?.id || null;
      return {
        ...prev,
        courses: remaining,
        activeCourseId: prev.activeCourseId === courseId ? nextActiveId : prev.activeCourseId,
        students: prev.students.filter(s => s.courseId !== courseId),
        categories: prev.categories.filter(c => c.courseId !== courseId),
        tasks: prev.tasks.filter(t => t.courseId !== courseId),
      };
    });
  };

  // Handlers for Grades
  const handleUpdateGrade = (studentId: string, categoryId: string, score: number | null) => {
    setDb(prev => {
      const existingIdx = prev.grades.findIndex(
        g => g.studentId === studentId && g.categoryId === categoryId
      );

      let newGrades = [...prev.grades];
      if (existingIdx >= 0) {
        newGrades[existingIdx] = {
          ...newGrades[existingIdx],
          score,
          updatedAt: Date.now(),
        };
      } else {
        newGrades.push({
          studentId,
          categoryId,
          score,
          updatedAt: Date.now(),
        });
      }

      return { ...prev, grades: newGrades };
    });
  };

  // Handlers for Categories
  const handleAddCategory = (name: string, weightPercentage: number) => {
    if (!activeCourse) return;
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      courseId: activeCourse.id,
      name,
      weightPercentage,
      orderIndex: courseCategories.length + 1,
    };
    setDb(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const handleUpdateCategory = (updatedCat: Category) => {
    setDb(prev => ({
      ...prev,
      categories: prev.categories.map(c => (c.id === updatedCat.id ? updatedCat : c)),
    }));
  };

  const handleDeleteCategory = (categoryId: string) => {
    setDb(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== categoryId),
      grades: prev.grades.filter(g => g.categoryId !== categoryId),
    }));
  };

  // Handlers for Students
  const handleAddStudent = (studentData: Omit<Student, 'id' | 'courseId' | 'orderIndex'>) => {
    if (!activeCourse) return;
    const newStudent: Student = {
      ...studentData,
      id: `est-${Date.now()}`,
      courseId: activeCourse.id,
      orderIndex: courseStudents.length + 1,
    };
    setDb(prev => ({
      ...prev,
      students: [...prev.students, newStudent],
    }));
  };

  const handleImportBatchStudents = (newStudents: Omit<Student, 'id' | 'courseId' | 'orderIndex'>[]) => {
    if (!activeCourse || newStudents.length === 0) return;
    const startIdx = courseStudents.length;
    const formatted: Student[] = newStudents.map((s, idx) => ({
      ...s,
      id: `est-${Date.now()}-${idx}`,
      courseId: activeCourse.id,
      orderIndex: startIdx + idx + 1,
    }));

    setDb(prev => ({
      ...prev,
      students: [...prev.students, ...formatted],
    }));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setDb(prev => ({
      ...prev,
      students: prev.students.map(s => (s.id === updatedStudent.id ? updatedStudent : s)),
    }));
  };

  const handleDeleteStudent = (studentId: string) => {
    setDb(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== studentId),
      grades: prev.grades.filter(g => g.studentId !== studentId),
      submissions: prev.submissions.filter(s => s.studentId !== studentId),
    }));
  };

  // Handlers for Tasks & Submissions
  const handleAddTask = (taskData: Omit<TaskAssignment, 'id' | 'courseId'>) => {
    if (!activeCourse) return;
    const newTaskId = `task-${Date.now()}`;
    const newTask: TaskAssignment = {
      ...taskData,
      id: newTaskId,
      courseId: activeCourse.id,
    };

    // Auto-create initial submission records for all students
    const initialSubmissions: TaskSubmission[] = courseStudents.map(student => ({
      id: `sub-${Date.now()}-${student.id}`,
      taskId: newTaskId,
      studentId: student.id,
      isDelivered: false,
    }));

    setDb(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      submissions: [...prev.submissions, ...initialSubmissions],
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setDb(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId),
      submissions: prev.submissions.filter(s => s.taskId !== taskId),
    }));
  };

  const handleUpdateSubmission = (
    taskId: string,
    studentId: string,
    isDelivered: boolean,
    deliveryDate?: string,
    score?: number | null,
    notes?: string
  ) => {
    setDb(prev => {
      const existingIdx = prev.submissions.findIndex(
        s => s.taskId === taskId && s.studentId === studentId
      );

      let newSubs = [...prev.submissions];
      if (existingIdx >= 0) {
        newSubs[existingIdx] = {
          ...newSubs[existingIdx],
          isDelivered,
          deliveryDate,
          score,
          notes,
        };
      } else {
        newSubs.push({
          id: `sub-${Date.now()}-${studentId}`,
          taskId,
          studentId,
          isDelivered,
          deliveryDate,
          score,
          notes,
        });
      }
      return { ...prev, submissions: newSubs };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <Header
        courses={db.courses}
        activeCourse={activeCourse}
        onSelectCourse={handleSelectCourse}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onOpenBackup={() => setShowBackupModal(true)}
        onResetData={() => setDb(INITIAL_DATABASE)}
      />

      {/* Main Tab Navigation */}
      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        studentCount={courseStudents.length}
        taskCount={courseTasks.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeCourse ? (
          <>
            {activeTab === 'planilla' && (
              <GradeGrid
                course={activeCourse}
                students={courseStudents}
                categories={courseCategories}
                grades={courseGrades}
                onUpdateGrade={handleUpdateGrade}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            )}

            {activeTab === 'tareas' && (
              <TaskTracking
                course={activeCourse}
                students={courseStudents}
                tasks={courseTasks}
                submissions={courseSubmissions}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
                onUpdateSubmission={handleUpdateSubmission}
              />
            )}

            {activeTab === 'estudiantes' && (
              <StudentsManager
                course={activeCourse}
                students={courseStudents}
                onAddStudent={handleAddStudent}
                onImportBatchStudents={handleImportBatchStudents}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            )}

            {activeTab === 'reportes' && (
              <ReportsView
                course={activeCourse}
                students={courseStudents}
                categories={courseCategories}
                grades={courseGrades}
                tasks={courseTasks}
                submissions={courseSubmissions}
              />
            )}

            {activeTab === 'cursos' && (
              <CoursesManager
                courses={db.courses}
                activeCourseId={db.activeCourseId}
                onSelectCourse={handleSelectCourse}
                onCreateCourse={handleCreateCourse}
                onUpdateCourse={handleUpdateCourse}
                onDeleteCourse={handleDeleteCourse}
              />
            )}

            {activeTab === 'android' && <AndroidCodeExplorer />}
          </>
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-500 mb-4">No hay cursos creados.</p>
            <button
              onClick={() => setActiveTab('cursos')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold"
            >
              Crear tu primer curso
            </button>
          </div>
        )}
      </main>

      {/* Backup & Restore Modal */}
      <BackupRestoreModal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        database={db}
        onRestoreDatabase={newDb => setDb(newDb)}
        onResetToDefaults={() => setDb(INITIAL_DATABASE)}
      />
    </div>
  );
}
