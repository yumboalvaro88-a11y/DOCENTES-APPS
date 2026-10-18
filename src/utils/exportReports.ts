import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Course, Student, Category, Grade, TaskAssignment, TaskSubmission } from '../types.ts';
import { calculateWeightedAverage, getGradeStatus, calculateLateDaysAndPenalty } from './gradeCalculations.ts';

/**
 * Exports complete course gradebook to Excel (.xlsx)
 */
export function exportCourseToExcel(
  course: Course,
  students: Student[],
  categories: Category[],
  grades: Grade[]
) {
  const gradesMap = new Map<string, number | null>();
  grades.forEach(g => gradesMap.set(`${g.studentId}_${g.categoryId}`, g.score));

  const headers = ['N.º', 'Cédula / ID', 'Apellidos y Nombres'];
  categories.forEach(c => headers.push(`${c.name} (${c.weightPercentage}%)`));
  headers.push('Promedio Final', 'Estado Académico');

  const rows: any[][] = [];
  rows.push([`REPORTE DE CALIFICACIONES - ${course.name.toUpperCase()}`]);
  rows.push([`Materia: ${course.subject} | Periodo: ${course.period} | Año Lectivo: ${course.academicYear}`]);
  rows.push([`Fecha de Generación: ${new Date().toLocaleDateString('es-ES')}`]);
  rows.push([]); // blank separator
  rows.push(headers);

  let totalAprobados = 0;
  let totalEnRiesgo = 0;
  let totalReprobados = 0;
  let sumaPromedios = 0;
  let totalConPromedio = 0;

  students.forEach((student, index) => {
    const studentGrades: Record<string, number | null> = {};
    categories.forEach(c => {
      studentGrades[c.id] = gradesMap.get(`${student.id}_${c.id}`) ?? null;
    });

    const avg = calculateWeightedAverage(studentGrades, categories);
    const status = getGradeStatus(avg, course);

    let statusLabel = 'Sin calificar';
    if (status === 'APROBADO') {
      statusLabel = 'APROBADO';
      totalAprobados++;
    } else if (status === 'EN_RIESGO') {
      statusLabel = 'EN RIESGO';
      totalEnRiesgo++;
    } else if (status === 'REPROBADO') {
      statusLabel = 'REPROBADO';
      totalReprobados++;
    }

    if (avg !== null) {
      sumaPromedios += avg;
      totalConPromedio++;
    }

    const rowData: any[] = [
      index + 1,
      student.idNumber,
      `${student.lastName} ${student.firstName}`,
    ];

    categories.forEach(c => {
      const score = studentGrades[c.id];
      rowData.push(score !== null && score !== undefined ? score : '-');
    });

    rowData.push(avg !== null ? avg : '-');
    rowData.push(statusLabel);

    rows.push(rowData);
  });

  // Summary statistics footer
  rows.push([]);
  rows.push(['RESUMEN DEL CURSO']);
  rows.push(['Total Estudiantes:', students.length]);
  rows.push(['Promedio General del Curso:', totalConPromedio > 0 ? (sumaPromedios / totalConPromedio).toFixed(2) : '-']);
  rows.push(['Estudiantes Aprobados:', totalAprobados]);
  rows.push(['Estudiantes En Riesgo:', totalEnRiesgo]);
  rows.push(['Estudiantes Reprobados:', totalReprobados]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Styling column widths
  ws['!cols'] = [
    { wch: 6 },
    { wch: 16 },
    { wch: 32 },
    ...categories.map(() => ({ wch: 14 })),
    { wch: 16 },
    { wch: 20 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Planilla Calificaciones');

  const sanitizedCourseName = course.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  XLSX.writeFile(wb, `Planilla_${sanitizedCourseName}_${course.period.replace(/[^a-zA-Z0-9_-]/g, '_')}.xlsx`);
}

/**
 * Exports Course Grade Sheet to PDF
 */
export function exportCourseToPdf(
  course: Course,
  students: Student[],
  categories: Category[],
  grades: Grade[]
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const gradesMap = new Map<string, number | null>();
  grades.forEach(g => gradesMap.set(`${g.studentId}_${g.categoryId}`, g.score));

  // Header Title
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text(`REGISTRO DE CALIFICACIONES - ${course.name}`, 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Materia: ${course.subject}  |  Año Lectivo: ${course.academicYear}  |  Periodo: ${course.period}  |  Fecha: ${new Date().toLocaleDateString('es-ES')}`,
    14,
    22
  );

  const tableHead = [
    ['N.º', 'Cédula / ID', 'Apellidos y Nombres', ...categories.map(c => `${c.name}\n(${c.weightPercentage}%)`), 'Promedio', 'Estado']
  ];

  let totalAprobados = 0;
  let totalEnRiesgo = 0;
  let totalReprobados = 0;
  let sumaPromedios = 0;
  let totalConPromedio = 0;

  const tableBody = students.map((student, idx) => {
    const studentGrades: Record<string, number | null> = {};
    categories.forEach(c => {
      studentGrades[c.id] = gradesMap.get(`${student.id}_${c.id}`) ?? null;
    });

    const avg = calculateWeightedAverage(studentGrades, categories);
    const status = getGradeStatus(avg, course);

    let statusLabel = 'Sin calificar';
    if (status === 'APROBADO') {
      statusLabel = 'Aprobado';
      totalAprobados++;
    } else if (status === 'EN_RIESGO') {
      statusLabel = 'En Riesgo';
      totalEnRiesgo++;
    } else if (status === 'REPROBADO') {
      statusLabel = 'Reprobado';
      totalReprobados++;
    }

    if (avg !== null) {
      sumaPromedios += avg;
      totalConPromedio++;
    }

    const row: any[] = [
      idx + 1,
      student.idNumber,
      `${student.lastName} ${student.firstName}`,
    ];

    categories.forEach(c => {
      const score = studentGrades[c.id];
      row.push(score !== null && score !== undefined ? score.toFixed(1) : '-');
    });

    row.push(avg !== null ? avg.toFixed(2) : '-');
    row.push(statusLabel);

    return row;
  });

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 28,
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
      halign: 'center',
    },
    headStyles: {
      fillColor: [30, 58, 138], // Indigo 900
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 28, halign: 'center' },
      2: { cellWidth: 55, halign: 'left' },
      // Categories will auto balance
    },
    didParseCell: (data) => {
      // Color status column
      if (data.section === 'body' && data.column.index === tableHead[0].length - 1) {
        const val = data.cell.raw;
        if (val === 'Aprobado') {
          data.cell.styles.textColor = [22, 101, 52]; // green-800
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'En Riesgo') {
          data.cell.styles.textColor = [180, 83, 9]; // amber-700
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Reprobado') {
          data.cell.styles.textColor = [185, 28, 28]; // red-700
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 160;

  // Add stats summary box
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Total Estudiantes: ${students.length}   |   Promedio General: ${
      totalConPromedio > 0 ? (sumaPromedios / totalConPromedio).toFixed(2) : '-'
    }   |   Aprobados: ${totalAprobados}   |   En Riesgo: ${totalEnRiesgo}   |   Reprobados: ${totalReprobados}`,
    14,
    finalY + 8
  );

  // Signatures
  doc.setDrawColor(148, 163, 184);
  doc.line(40, finalY + 30, 100, finalY + 30);
  doc.text('Docente Responsable', 52, finalY + 35);

  doc.line(180, finalY + 30, 240, finalY + 30);
  doc.text('Dirección / Secretaría', 195, finalY + 35);

  const sanitizedCourseName = course.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Reporte_${sanitizedCourseName}.pdf`);
}

/**
 * Exports individual Student Report Card to PDF
 */
export function exportStudentReportToPdf(
  course: Course,
  student: Student,
  categories: Category[],
  grades: Grade[],
  tasks: TaskAssignment[],
  submissions: TaskSubmission[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const studentGrades: Record<string, number | null> = {};
  grades.filter(g => g.studentId === student.id).forEach(g => {
    studentGrades[g.categoryId] = g.score;
  });

  const avg = calculateWeightedAverage(studentGrades, categories);
  const status = getGradeStatus(avg, course);

  // Header Title
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('BOLETÍN DE CALIFICACIONES INDIVIDUAL', 14, 14);

  doc.setFontSize(10);
  doc.setTextColor(226, 232, 240);
  doc.text(`${course.name} • ${course.subject} • ${course.period}`, 14, 21);

  // Student Details
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Estudiante: ${student.lastName} ${student.firstName}`, 14, 38);
  doc.text(`Cédula / ID: ${student.idNumber}`, 14, 44);
  if (student.email) {
    doc.text(`Correo: ${student.email}`, 14, 50);
  }

  // Summary Card in PDF
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(130, 32, 66, 24, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('PROMEDIO FINAL', 145, 39);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  if (status === 'APROBADO') doc.setTextColor(22, 101, 52);
  else if (status === 'EN_RIESGO') doc.setTextColor(180, 83, 9);
  else doc.setTextColor(185, 28, 28);

  doc.text(avg !== null ? `${avg.toFixed(2)}` : 'S/N', 145, 48);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Estado: ${status || 'Pendiente'}`, 145, 53);

  // Grades Table
  const tableHead = [['Categoría de Evaluación', 'Ponderación (%)', 'Nota Obtenida', 'Aporte al Promedio']];
  const tableBody = categories.map(c => {
    const score = studentGrades[c.id];
    const aporte = score !== null && score !== undefined ? (score * (c.weightPercentage / 100)).toFixed(2) : '-';
    return [
      c.name,
      `${c.weightPercentage}%`,
      score !== null && score !== undefined ? score.toFixed(1) : 'Sin calificar',
      aporte,
    ];
  });

  autoTable(doc, {
    head: tableHead,
    body: tableBody,
    startY: 60,
    headStyles: { fillColor: [51, 65, 85] },
    styles: { halign: 'center' },
    columnStyles: { 0: { halign: 'left' } },
  });

  let taskStartY = (doc as any).lastAutoTable?.finalY + 10;

  // Task deliveries table
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Historial de Tareas y Control de Atrasos', 14, taskStartY);

  const studentSubmissions = submissions.filter(s => s.studentId === student.id);
  const taskRows = tasks.map(t => {
    const sub = studentSubmissions.find(s => s.taskId === t.id);
    const lateCalc = calculateLateDaysAndPenalty(
      t.dueDate,
      sub?.deliveryDate,
      sub?.isDelivered ?? false,
      sub?.score,
      new Date().toISOString().split('T')[0],
      course
    );

    return [
      t.title,
      t.dueDate,
      sub?.isDelivered ? (sub.deliveryDate || 'Sí') : 'No entregada',
      lateCalc.statusLabel,
      lateCalc.penalty > 0 ? `-${lateCalc.penalty} pts` : 'Sin penalización',
    ];
  });

  autoTable(doc, {
    head: [['Tarea', 'Fecha Límite', 'Fecha Entrega', 'Estado de Entrega', 'Penalización']],
    body: taskRows,
    startY: taskStartY + 4,
    headStyles: { fillColor: [71, 85, 105] },
    styles: { fontSize: 8, halign: 'center' },
    columnStyles: { 0: { halign: 'left' } },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 220;
  doc.setDrawColor(148, 163, 184);
  doc.line(65, finalY + 25, 145, finalY + 25);
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Firma del Docente / Tutor', 85, finalY + 30);

  const cleanName = `${student.lastName}_${student.firstName}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Boletin_${cleanName}.pdf`);
}
