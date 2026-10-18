export interface Course {
  id: string;
  name: string; // e.g. "8vo EGB - Paralelo A"
  subject: string; // e.g. "Matemáticas"
  academicYear: string; // e.g. "2025-2026"
  period: string; // e.g. "Primer Quimestre" / "1er Trimestre"
  scaleMin: number; // default 0
  scaleMax: number; // default 10
  passingThreshold: number; // default 7.0
  riskThreshold: number; // default 5.0
  penaltyPerDayLate: number; // default 0.5
  maxLatePenalty: number; // default 3.0
  createdAt: number;
}

export interface Student {
  id: string;
  courseId: string;
  idNumber: string; // Cédula or ID
  lastName: string;
  firstName: string;
  email?: string;
  orderIndex: number;
}

export interface Category {
  id: string;
  courseId: string;
  name: string; // "Tareas", "Lecciones", "Aportes", "Proyecto", "Examen"
  weightPercentage: number; // e.g. 20
  orderIndex: number;
}

export interface Grade {
  studentId: string;
  categoryId: string;
  score: number | null;
  updatedAt: number;
}

export interface TaskAssignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  assignedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  maxScore: number;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  studentId: string;
  isDelivered: boolean;
  deliveryDate?: string; // YYYY-MM-DD
  score?: number | null;
  notes?: string;
}

export interface DatabaseState {
  courses: Course[];
  students: Student[];
  categories: Category[];
  grades: Grade[];
  tasks: TaskAssignment[];
  submissions: TaskSubmission[];
  activeCourseId: string | null;
}
