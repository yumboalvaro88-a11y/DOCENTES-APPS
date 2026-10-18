import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWeightedAverage,
  getGradeStatus,
  calculateLateDaysAndPenalty,
  DEFAULT_SCALE_CONFIG,
  type CategoryWeight,
} from './gradeCalculations.ts';

test('calculateWeightedAverage calculates 100% weighted average correctly', () => {
  const categories: CategoryWeight[] = [
    { id: 'c1', name: 'Tareas', weightPercentage: 20 },
    { id: 'c2', name: 'Lecciones', weightPercentage: 20 },
    { id: 'c3', name: 'Aportes', weightPercentage: 20 },
    { id: 'c4', name: 'Proyecto', weightPercentage: 20 },
    { id: 'c5', name: 'Examen', weightPercentage: 20 },
  ];

  const grades = {
    c1: 10,
    c2: 8,
    c3: 9,
    c4: 7,
    c5: 10,
  };

  // 10*0.2 + 8*0.2 + 9*0.2 + 7*0.2 + 10*0.2 = 2.0 + 1.6 + 1.8 + 1.4 + 2.0 = 8.8
  const avg = calculateWeightedAverage(grades, categories);
  assert.equal(avg, 8.8);
});

test('calculateWeightedAverage handles partial grades proportionally', () => {
  const categories: CategoryWeight[] = [
    { id: 'c1', name: 'Tareas', weightPercentage: 50 },
    { id: 'c2', name: 'Examen', weightPercentage: 50 },
  ];

  // Only c1 graded with 8.0
  const grades = {
    c1: 8.0,
    c2: null,
  };

  const avg = calculateWeightedAverage(grades, categories);
  assert.equal(avg, 8.0);
});

test('getGradeStatus classifies according to thresholds', () => {
  assert.equal(getGradeStatus(9.5, DEFAULT_SCALE_CONFIG), 'APROBADO');
  assert.equal(getGradeStatus(7.0, DEFAULT_SCALE_CONFIG), 'APROBADO');
  assert.equal(getGradeStatus(6.5, DEFAULT_SCALE_CONFIG), 'EN_RIESGO');
  assert.equal(getGradeStatus(5.0, DEFAULT_SCALE_CONFIG), 'EN_RIESGO');
  assert.equal(getGradeStatus(4.9, DEFAULT_SCALE_CONFIG), 'REPROBADO');
  assert.equal(getGradeStatus(0, DEFAULT_SCALE_CONFIG), 'REPROBADO');
  assert.equal(getGradeStatus(null, DEFAULT_SCALE_CONFIG), null);
});

test('calculateLateDaysAndPenalty computes on-time delivery', () => {
  const result = calculateLateDaysAndPenalty(
    '2026-10-15',
    '2026-10-14',
    true,
    10.0,
    '2026-10-18'
  );
  assert.equal(result.daysLate, 0);
  assert.equal(result.status, 'A_TIEMPO');
  assert.equal(result.penalty, 0);
  assert.equal(result.adjustedGrade, 10.0);
});

test('calculateLateDaysAndPenalty computes 3 late days with penalty', () => {
  const result = calculateLateDaysAndPenalty(
    '2026-10-10',
    '2026-10-13',
    true,
    9.0,
    '2026-10-18',
    { ...DEFAULT_SCALE_CONFIG, penaltyPerDayLate: 0.5, maxLatePenalty: 3.0 }
  );
  // 3 days late * 0.5 = 1.5 penalty
  assert.equal(result.daysLate, 3);
  assert.equal(result.status, 'CON_ATRASO');
  assert.equal(result.penalty, 1.5);
  assert.equal(result.adjustedGrade, 7.5);
});

test('calculateLateDaysAndPenalty caps penalty at maxLatePenalty', () => {
  const result = calculateLateDaysAndPenalty(
    '2026-10-01',
    '2026-10-15',
    true,
    10.0,
    '2026-10-18',
    { ...DEFAULT_SCALE_CONFIG, penaltyPerDayLate: 1.0, maxLatePenalty: 3.0 }
  );
  // 14 days late * 1.0 = 14.0, but capped at 3.0
  assert.equal(result.daysLate, 14);
  assert.equal(result.penalty, 3.0);
  assert.equal(result.adjustedGrade, 7.0);
});

test('calculateLateDaysAndPenalty marks undelivered overdue as NO_ENTREGO with accumulated late days', () => {
  const result = calculateLateDaysAndPenalty(
    '2026-10-10',
    null,
    false,
    undefined,
    '2026-10-14'
  );
  assert.equal(result.daysLate, 4);
  assert.equal(result.status, 'NO_ENTREGO');
  assert.equal(result.penalty, 2.0); // 4 * 0.5 = 2.0
});
