import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateStudentTemplateWorkbook,
  parseStudentsExcel,
} from './excelParser.ts';

test('generateStudentTemplateWorkbook produces valid xlsx bytes and can be parsed', () => {
  const bytes = generateStudentTemplateWorkbook();
  assert.ok(bytes.length > 0);

  const result = parseStudentsExcel(bytes, 'Plantilla_Test.xlsx');
  assert.equal(result.hasErrors, false);
  assert.equal(result.validStudents.length, 8);
  assert.equal(result.validStudents[0].lastName, 'Andrade Morales');
  assert.equal(result.validStudents[0].firstName, 'Carlos David');
  assert.equal(result.validStudents[0].idNumber, '1712345678');
});

test('parseStudentsExcel detects duplicate IDs in file', () => {
  // Let's test with duplicate existing IDs check
  const bytes = generateStudentTemplateWorkbook();
  const result = parseStudentsExcel(bytes, 'Plantilla_Test.xlsx', ['1712345678']);
  // First student has id 1712345678, so it should be flagged as already existing
  assert.equal(result.hasErrors, true);
  assert.equal(result.invalidRows.length, 1);
  assert.match(result.invalidRows[0].errors[0], /ya está registrada en el curso/);
});
