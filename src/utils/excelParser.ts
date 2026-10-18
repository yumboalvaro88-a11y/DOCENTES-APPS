import * as XLSX from 'xlsx';

export interface ParsedStudentRow {
  rowNumber: number;
  idNumber: string;
  lastName: string;
  firstName: string;
  email?: string;
  isValid: boolean;
  errors: string[];
}

export interface ExcelImportResult {
  fileName: string;
  totalRows: number;
  validStudents: ParsedStudentRow[];
  invalidRows: ParsedStudentRow[];
  hasErrors: boolean;
  summary: {
    totalParsed: number;
    validCount: number;
    errorCount: number;
    duplicatesInFile: number;
  };
}

/**
 * Normalizes string keys to lowercase without accents or spaces
 */
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Parses raw Excel file buffer or array buffer and extracts student records with validation
 */
export function parseStudentsExcel(
  fileData: ArrayBuffer | Uint8Array,
  fileName: string,
  existingIdNumbers: string[] = []
): ExcelImportResult {
  const workbook = XLSX.read(fileData, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    throw new Error('El archivo Excel no contiene hojas de cálculo válidas.');
  }

  const worksheet = workbook.Sheets[firstSheetName];
  // Parse rows as raw array of arrays
  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
    blankrows: false,
  });

  if (rawRows.length === 0) {
    throw new Error('El archivo está completamente vacío.');
  }

  // Find header row (usually row 0 or 1)
  let headerRowIndex = -1;
  let colIndexId = -1;
  let colIndexLastName = -1;
  let colIndexFirstName = -1;
  let colIndexEmail = -1;

  for (let r = 0; r < Math.min(5, rawRows.length); r++) {
    const row = rawRows[r];
    for (let c = 0; c < row.length; c++) {
      const cellVal = normalizeHeader(String(row[c] || ''));
      if (
        cellVal.includes('cedula') ||
        cellVal.includes('identificacion') ||
        cellVal.includes('dni') ||
        cellVal === 'id' ||
        cellVal.includes('documento')
      ) {
        colIndexId = c;
      } else if (cellVal.includes('apellido') || cellVal.includes('apellidos')) {
        colIndexLastName = c;
      } else if (cellVal.includes('nombre') || cellVal.includes('nombres')) {
        colIndexFirstName = c;
      } else if (cellVal.includes('correo') || cellVal.includes('email')) {
        colIndexEmail = c;
      }
    }

    if (colIndexId !== -1 && (colIndexLastName !== -1 || colIndexFirstName !== -1)) {
      headerRowIndex = r;
      break;
    }
  }

  // Fallback defaults if headers weren't named exactly: assume columns 1=ID, 2=Apellidos, 3=Nombres
  if (headerRowIndex === -1) {
    headerRowIndex = 0;
    colIndexId = 1;
    colIndexLastName = 2;
    colIndexFirstName = 3;
    colIndexEmail = 4;
  }

  const seenIdsInFile = new Set<string>();
  const duplicateIdsInFile = new Set<string>();
  const existingIdSet = new Set(existingIdNumbers.map(id => id.trim().toLowerCase()));

  const parsedRows: ParsedStudentRow[] = [];

  for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!row || row.length === 0) continue;

    // Check if entire row is empty
    const isRowEmpty = row.every(cell => String(cell || '').trim() === '');
    if (isRowEmpty) continue;

    const rowNum = r + 1; // 1-based index in Excel
    const rawId = String(row[colIndexId] || '').trim();
    const rawLastName = String(row[colIndexLastName] || '').trim();
    const rawFirstName = String(row[colIndexFirstName] || '').trim();
    const rawEmail = colIndexEmail !== -1 ? String(row[colIndexEmail] || '').trim() : '';

    const errors: string[] = [];

    if (!rawId) {
      errors.push('Cédula / ID requerida.');
    } else {
      const normalizedId = rawId.toLowerCase();
      if (seenIdsInFile.has(normalizedId)) {
        errors.push(`Cédula duplicada en el mismo archivo: "${rawId}".`);
        duplicateIdsInFile.add(normalizedId);
      } else {
        seenIdsInFile.add(normalizedId);
      }

      if (existingIdSet.has(normalizedId)) {
        errors.push(`Esta cédula ya está registrada en el curso: "${rawId}".`);
      }
    }

    if (!rawLastName) {
      errors.push('Falta el Apellido del estudiante.');
    }

    if (!rawFirstName) {
      errors.push('Falta el Nombre del estudiante.');
    }

    if (rawEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      errors.push(`Formato de correo electrónico inválido: "${rawEmail}".`);
    }

    parsedRows.push({
      rowNumber: rowNum,
      idNumber: rawId,
      lastName: rawLastName,
      firstName: rawFirstName,
      email: rawEmail || undefined,
      isValid: errors.length === 0,
      errors,
    });
  }

  const validStudents = parsedRows.filter(p => p.isValid);
  const invalidRows = parsedRows.filter(p => !p.isValid);

  return {
    fileName,
    totalRows: parsedRows.length,
    validStudents,
    invalidRows,
    hasErrors: invalidRows.length > 0,
    summary: {
      totalParsed: parsedRows.length,
      validCount: validStudents.length,
      errorCount: invalidRows.length,
      duplicatesInFile: duplicateIdsInFile.size,
    },
  };
}

/**
 * Creates and downloads a sample Excel (.xlsx) template for student rosters
 */
export function generateStudentTemplateWorkbook(): Uint8Array {
  const sampleData = [
    ['N.º', 'Cédula / ID', 'Apellidos', 'Nombres', 'Correo Electrónico (Opcional)'],
    [1, '1712345678', 'Andrade Morales', 'Carlos David', 'carlos.andrade@colegio.edu'],
    [2, '1723456789', 'Benítez Castro', 'Sofía Valentina', 'sofia.benitez@colegio.edu'],
    [3, '1734567890', 'Cárdenas López', 'Mateo Sebastián', 'mateo.cardenas@colegio.edu'],
    [4, '1745678901', 'Delgado Paredes', 'Camila Nicole', 'camila.delgado@colegio.edu'],
    [5, '1756789012', 'Espinoza Gómez', 'Lucas Gabriel', 'lucas.espinoza@colegio.edu'],
    [6, '1767890123', 'Flores Mendoza', 'Paula Alejandra', 'paula.flores@colegio.edu'],
    [7, '1778901234', 'García Viteri', 'Martín Alejandro', 'martin.garcia@colegio.edu'],
    [8, '1789012345', 'Hidalgo Silva', 'Valeria Estefanía', 'valeria.hidalgo@colegio.edu'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);

  // Set column widths
  ws['!cols'] = [
    { wch: 6 },
    { wch: 18 },
    { wch: 25 },
    { wch: 25 },
    { wch: 35 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Nómina Estudiantes');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(excelBuffer);
}

/**
 * Triggers a browser download of the template
 */
export function downloadStudentTemplate() {
  const buffer = generateStudentTemplateWorkbook();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Plantilla_Nomina_Estudiantes.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
