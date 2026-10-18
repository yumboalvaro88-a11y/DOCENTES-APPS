import { DatabaseState } from '../types.ts';

export const INITIAL_DATABASE: DatabaseState = {
  activeCourseId: 'curso-1',
  courses: [
    {
      id: 'curso-1',
      name: '8vo EGB - Paralelo A',
      subject: 'Matemáticas',
      academicYear: '2025-2026',
      period: 'Primer Quimestre',
      scaleMin: 0,
      scaleMax: 10,
      passingThreshold: 7.0,
      riskThreshold: 5.0,
      penaltyPerDayLate: 0.5,
      maxLatePenalty: 3.0,
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'curso-2',
      name: '9no EGB - Paralelo B',
      subject: 'Física y Química',
      academicYear: '2025-2026',
      period: '1er Trimestre',
      scaleMin: 0,
      scaleMax: 10,
      passingThreshold: 7.0,
      riskThreshold: 5.0,
      penaltyPerDayLate: 0.5,
      maxLatePenalty: 3.0,
      createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    },
    {
      id: 'curso-3',
      name: '10mo EGB - Paralelo A',
      subject: 'Geometría y Trigonometría',
      academicYear: '2025-2026',
      period: 'Primer Quimestre',
      scaleMin: 0,
      scaleMax: 10,
      passingThreshold: 7.0,
      riskThreshold: 5.0,
      penaltyPerDayLate: 0.5,
      maxLatePenalty: 3.0,
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    },
  ],
  categories: [
    { id: 'cat-1', courseId: 'curso-1', name: 'Tareas', weightPercentage: 20, orderIndex: 1 },
    { id: 'cat-2', courseId: 'curso-1', name: 'Lecciones', weightPercentage: 20, orderIndex: 2 },
    { id: 'cat-3', courseId: 'curso-1', name: 'Aportes', weightPercentage: 20, orderIndex: 3 },
    { id: 'cat-4', courseId: 'curso-1', name: 'Proyecto', weightPercentage: 20, orderIndex: 4 },
    { id: 'cat-5', courseId: 'curso-1', name: 'Examen', weightPercentage: 20, orderIndex: 5 },

    { id: 'cat-6', courseId: 'curso-2', name: 'Tareas', weightPercentage: 25, orderIndex: 1 },
    { id: 'cat-7', courseId: 'curso-2', name: 'Laboratorio', weightPercentage: 25, orderIndex: 2 },
    { id: 'cat-8', courseId: 'curso-2', name: 'Talleres', weightPercentage: 25, orderIndex: 3 },
    { id: 'cat-9', courseId: 'curso-2', name: 'Examen Quimestral', weightPercentage: 25, orderIndex: 4 },
  ],
  students: [
    {
      id: 'est-1',
      courseId: 'curso-1',
      idNumber: '1718293041',
      lastName: 'Andrade Morales',
      firstName: 'Carlos David',
      email: 'carlos.andrade@educacion.gob.ec',
      orderIndex: 1,
    },
    {
      id: 'est-2',
      courseId: 'curso-1',
      idNumber: '1729384756',
      lastName: 'Benítez Castro',
      firstName: 'Sofía Valentina',
      email: 'sofia.benitez@educacion.gob.ec',
      orderIndex: 2,
    },
    {
      id: 'est-3',
      courseId: 'curso-1',
      idNumber: '1738495062',
      lastName: 'Cárdenas López',
      firstName: 'Mateo Sebastián',
      email: 'mateo.cardenas@educacion.gob.ec',
      orderIndex: 3,
    },
    {
      id: 'est-4',
      courseId: 'curso-1',
      idNumber: '1749586173',
      lastName: 'Delgado Paredes',
      firstName: 'Camila Nicole',
      email: 'camila.delgado@educacion.gob.ec',
      orderIndex: 4,
    },
    {
      id: 'est-5',
      courseId: 'curso-1',
      idNumber: '1750697284',
      lastName: 'Espinoza Gómez',
      firstName: 'Lucas Gabriel',
      email: 'lucas.espinoza@educacion.gob.ec',
      orderIndex: 5,
    },
    {
      id: 'est-6',
      courseId: 'curso-1',
      idNumber: '1761708395',
      lastName: 'Flores Mendoza',
      firstName: 'Paula Alejandra',
      email: 'paula.flores@educacion.gob.ec',
      orderIndex: 6,
    },
    {
      id: 'est-7',
      courseId: 'curso-1',
      idNumber: '1772819406',
      lastName: 'García Viteri',
      firstName: 'Martín Alejandro',
      email: 'martin.garcia@educacion.gob.ec',
      orderIndex: 7,
    },
    {
      id: 'est-8',
      courseId: 'curso-1',
      idNumber: '1783920517',
      lastName: 'Hidalgo Silva',
      firstName: 'Valeria Estefanía',
      email: 'valeria.hidalgo@educacion.gob.ec',
      orderIndex: 8,
    },
    {
      id: 'est-9',
      courseId: 'curso-1',
      idNumber: '1794031628',
      lastName: 'Jaramillo Ortiz',
      firstName: 'Diego Fernando',
      email: 'diego.jaramillo@educacion.gob.ec',
      orderIndex: 9,
    },
    {
      id: 'est-10',
      courseId: 'curso-1',
      idNumber: '1705142739',
      lastName: 'Lara Quintanilla',
      firstName: 'Doménica Isabel',
      email: 'domenica.lara@educacion.gob.ec',
      orderIndex: 10,
    },
  ],
  grades: [
    // Andrade Carlos (Excelente)
    { studentId: 'est-1', categoryId: 'cat-1', score: 9.5, updatedAt: Date.now() },
    { studentId: 'est-1', categoryId: 'cat-2', score: 9.0, updatedAt: Date.now() },
    { studentId: 'est-1', categoryId: 'cat-3', score: 10.0, updatedAt: Date.now() },
    { studentId: 'est-1', categoryId: 'cat-4', score: 9.5, updatedAt: Date.now() },
    { studentId: 'est-1', categoryId: 'cat-5', score: 9.0, updatedAt: Date.now() },

    // Benítez Sofía (Excelente)
    { studentId: 'est-2', categoryId: 'cat-1', score: 10.0, updatedAt: Date.now() },
    { studentId: 'est-2', categoryId: 'cat-2', score: 9.5, updatedAt: Date.now() },
    { studentId: 'est-2', categoryId: 'cat-3', score: 9.8, updatedAt: Date.now() },
    { studentId: 'est-2', categoryId: 'cat-4', score: 10.0, updatedAt: Date.now() },
    { studentId: 'est-2', categoryId: 'cat-5', score: 9.7, updatedAt: Date.now() },

    // Cárdenas Mateo (Aprobado promedio)
    { studentId: 'est-3', categoryId: 'cat-1', score: 7.5, updatedAt: Date.now() },
    { studentId: 'est-3', categoryId: 'cat-2', score: 7.0, updatedAt: Date.now() },
    { studentId: 'est-3', categoryId: 'cat-3', score: 8.0, updatedAt: Date.now() },
    { studentId: 'est-3', categoryId: 'cat-4', score: 7.5, updatedAt: Date.now() },
    { studentId: 'est-3', categoryId: 'cat-5', score: 7.0, updatedAt: Date.now() },

    // Delgado Camila (En riesgo)
    { studentId: 'est-4', categoryId: 'cat-1', score: 6.0, updatedAt: Date.now() },
    { studentId: 'est-4', categoryId: 'cat-2', score: 5.5, updatedAt: Date.now() },
    { studentId: 'est-4', categoryId: 'cat-3', score: 6.5, updatedAt: Date.now() },
    { studentId: 'est-4', categoryId: 'cat-4', score: 6.0, updatedAt: Date.now() },
    { studentId: 'est-4', categoryId: 'cat-5', score: 5.0, updatedAt: Date.now() },

    // Espinoza Lucas (Reprobado)
    { studentId: 'est-5', categoryId: 'cat-1', score: 4.5, updatedAt: Date.now() },
    { studentId: 'est-5', categoryId: 'cat-2', score: 4.0, updatedAt: Date.now() },
    { studentId: 'est-5', categoryId: 'cat-3', score: 5.0, updatedAt: Date.now() },
    { studentId: 'est-5', categoryId: 'cat-4', score: 4.0, updatedAt: Date.now() },
    { studentId: 'est-5', categoryId: 'cat-5', score: 4.5, updatedAt: Date.now() },

    // Flores Paula (Aprobado)
    { studentId: 'est-6', categoryId: 'cat-1', score: 8.5, updatedAt: Date.now() },
    { studentId: 'est-6', categoryId: 'cat-2', score: 8.0, updatedAt: Date.now() },
    { studentId: 'est-6', categoryId: 'cat-3', score: 9.0, updatedAt: Date.now() },
    { studentId: 'est-6', categoryId: 'cat-4', score: 8.5, updatedAt: Date.now() },
    { studentId: 'est-6', categoryId: 'cat-5', score: 8.0, updatedAt: Date.now() },

    // García Martín (Aprobado)
    { studentId: 'est-7', categoryId: 'cat-1', score: 7.8, updatedAt: Date.now() },
    { studentId: 'est-7', categoryId: 'cat-2', score: 7.5, updatedAt: Date.now() },
    { studentId: 'est-7', categoryId: 'cat-3', score: 8.0, updatedAt: Date.now() },
    { studentId: 'est-7', categoryId: 'cat-4', score: 7.0, updatedAt: Date.now() },
    { studentId: 'est-7', categoryId: 'cat-5', score: 7.5, updatedAt: Date.now() },

    // Hidalgo Valeria (Aprobado muy bueno)
    { studentId: 'est-8', categoryId: 'cat-1', score: 9.0, updatedAt: Date.now() },
    { studentId: 'est-8', categoryId: 'cat-2', score: 8.8, updatedAt: Date.now() },
    { studentId: 'est-8', categoryId: 'cat-3', score: 9.2, updatedAt: Date.now() },
    { studentId: 'est-8', categoryId: 'cat-4', score: 9.0, updatedAt: Date.now() },
    { studentId: 'est-8', categoryId: 'cat-5', score: 8.5, updatedAt: Date.now() },

    // Jaramillo Diego (En riesgo)
    { studentId: 'est-9', categoryId: 'cat-1', score: 5.5, updatedAt: Date.now() },
    { studentId: 'est-9', categoryId: 'cat-2', score: 6.0, updatedAt: Date.now() },
    { studentId: 'est-9', categoryId: 'cat-3', score: 6.2, updatedAt: Date.now() },
    { studentId: 'est-9', categoryId: 'cat-4', score: 5.8, updatedAt: Date.now() },
    { studentId: 'est-9', categoryId: 'cat-5', score: 5.5, updatedAt: Date.now() },

    // Lara Doménica (Excelente)
    { studentId: 'est-10', categoryId: 'cat-1', score: 9.8, updatedAt: Date.now() },
    { studentId: 'est-10', categoryId: 'cat-2', score: 9.5, updatedAt: Date.now() },
    { studentId: 'est-10', categoryId: 'cat-3', score: 10.0, updatedAt: Date.now() },
    { studentId: 'est-10', categoryId: 'cat-4', score: 9.7, updatedAt: Date.now() },
    { studentId: 'est-10', categoryId: 'cat-5', score: 9.8, updatedAt: Date.now() },
  ],
  tasks: [
    {
      id: 'task-1',
      courseId: 'curso-1',
      title: 'Taller 1: Ecuaciones de Primer Grado',
      description: 'Resolución de 10 ejercicios del libro texto, páginas 45-48.',
      assignedDate: '2026-10-01',
      dueDate: '2026-10-08',
      maxScore: 10,
    },
    {
      id: 'task-2',
      courseId: 'curso-1',
      title: 'Investigación: Teorema de Pitágoras en la Arquitectura',
      description: 'Ensayo ilustrado de 2 páginas con aplicaciones en la vida cotidiana.',
      assignedDate: '2026-10-09',
      dueDate: '2026-10-15',
      maxScore: 10,
    },
    {
      id: 'task-3',
      courseId: 'curso-1',
      title: 'Guía Práctica: Factorización por Factor Común',
      description: 'Hoja de trabajo individual entregable en clase.',
      assignedDate: '2026-10-16',
      dueDate: '2026-10-22',
      maxScore: 10,
    },
  ],
  submissions: [
    // Tarea 1 submissions (Due 2026-10-08)
    { id: 'sub-1', taskId: 'task-1', studentId: 'est-1', isDelivered: true, deliveryDate: '2026-10-07', score: 10.0 },
    { id: 'sub-2', taskId: 'task-1', studentId: 'est-2', isDelivered: true, deliveryDate: '2026-10-08', score: 10.0 },
    { id: 'sub-3', taskId: 'task-1', studentId: 'est-3', isDelivered: true, deliveryDate: '2026-10-11', score: 9.0, notes: 'Entregó 3 días después' }, // 3 days late (-1.5)
    { id: 'sub-4', taskId: 'task-1', studentId: 'est-4', isDelivered: true, deliveryDate: '2026-10-14', score: 8.0, notes: 'Entregó 6 días tarde' }, // 6 days late (capped at -3.0)
    { id: 'sub-5', taskId: 'task-1', studentId: 'est-5', isDelivered: false }, // Not delivered, overdue!
    { id: 'sub-6', taskId: 'task-1', studentId: 'est-6', isDelivered: true, deliveryDate: '2026-10-08', score: 9.0 },
    { id: 'sub-7', taskId: 'task-1', studentId: 'est-7', isDelivered: true, deliveryDate: '2026-10-07', score: 8.5 },
    { id: 'sub-8', taskId: 'task-1', studentId: 'est-8', isDelivered: true, deliveryDate: '2026-10-08', score: 9.5 },
    { id: 'sub-9', taskId: 'task-1', studentId: 'est-9', isDelivered: false }, // Overdue
    { id: 'sub-10', taskId: 'task-1', studentId: 'est-10', isDelivered: true, deliveryDate: '2026-10-06', score: 10.0 },

    // Tarea 2 submissions (Due 2026-10-15)
    { id: 'sub-11', taskId: 'task-2', studentId: 'est-1', isDelivered: true, deliveryDate: '2026-10-15', score: 9.5 },
    { id: 'sub-12', taskId: 'task-2', studentId: 'est-2', isDelivered: true, deliveryDate: '2026-10-14', score: 10.0 },
    { id: 'sub-13', taskId: 'task-2', studentId: 'est-3', isDelivered: true, deliveryDate: '2026-10-17', score: 8.0 }, // 2 days late
    { id: 'sub-14', taskId: 'task-2', studentId: 'est-4', isDelivered: false }, // Overdue
    { id: 'sub-15', taskId: 'task-2', studentId: 'est-5', isDelivered: false }, // Overdue
    { id: 'sub-16', taskId: 'task-2', studentId: 'est-6', isDelivered: true, deliveryDate: '2026-10-15', score: 8.5 },
    { id: 'sub-17', taskId: 'task-2', studentId: 'est-7', isDelivered: true, deliveryDate: '2026-10-15', score: 8.0 },
    { id: 'sub-18', taskId: 'task-2', studentId: 'est-8', isDelivered: true, deliveryDate: '2026-10-15', score: 9.0 },
    { id: 'sub-19', taskId: 'task-2', studentId: 'est-9', isDelivered: true, deliveryDate: '2026-10-18', score: 7.5 }, // 3 days late
    { id: 'sub-20', taskId: 'task-2', studentId: 'est-10', isDelivered: true, deliveryDate: '2026-10-13', score: 10.0 },
  ],
};
