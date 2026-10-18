export interface CategoryWeight {
  id: string;
  name: string;
  weightPercentage: number; // e.g. 20 for 20%
}

export interface StudentGradeRecord {
  studentId: string;
  grades: Record<string, number | null>; // categoryId -> grade
}

export interface CourseScaleConfig {
  minGrade: number; // default 0
  maxGrade: number; // default 10
  passingThreshold: number; // default 7.0
  riskThreshold: number; // default 5.0 (between 5.0 and 6.99 is risk, below 5 is fail)
  penaltyPerDayLate: number; // default 0.5
  maxLatePenalty: number; // default 3.0
}

export const DEFAULT_SCALE_CONFIG: CourseScaleConfig = {
  minGrade: 0,
  maxGrade: 10,
  passingThreshold: 7.0,
  riskThreshold: 5.0,
  penaltyPerDayLate: 0.5,
  maxLatePenalty: 3.0,
};

export type GradeStatus = 'APROBADO' | 'EN_RIESGO' | 'REPROBADO';

/**
 * Calculates weighted average based on categories and their percentage weights.
 * Normalizes weights if total sum != 100 or handles unassigned grades.
 */
export function calculateWeightedAverage(
  grades: Record<string, number | null | undefined>,
  categories: CategoryWeight[]
): number | null {
  if (categories.length === 0) return null;

  let totalWeightEvaluated = 0;
  let weightedSum = 0;
  let hasAtLeastOneGrade = false;

  for (const cat of categories) {
    const grade = grades[cat.id];
    if (grade !== null && grade !== undefined && !isNaN(grade)) {
      weightedSum += grade * (cat.weightPercentage / 100);
      totalWeightEvaluated += cat.weightPercentage;
      hasAtLeastOneGrade = true;
    }
  }

  if (!hasAtLeastOneGrade) return null;

  // If some categories are not yet graded, scale proportionally to evaluated categories
  if (totalWeightEvaluated > 0 && totalWeightEvaluated !== 100) {
    return Number(((weightedSum / totalWeightEvaluated) * 100).toFixed(2));
  }

  return Number(weightedSum.toFixed(2));
}

/**
 * Determines grade status based on thresholds
 */
export function getGradeStatus(
  grade: number | null,
  config: CourseScaleConfig | { passingThreshold?: number; riskThreshold?: number } = DEFAULT_SCALE_CONFIG
): GradeStatus | null {
  if (grade === null || isNaN(grade)) return null;
  const passing = config.passingThreshold ?? 7.0;
  const risk = config.riskThreshold ?? 5.0;
  if (grade >= passing) return 'APROBADO';
  if (grade >= risk) return 'EN_RIESGO';
  return 'REPROBADO';
}

/**
 * Returns color classes / hex for grade status
 */
export function getGradeStatusColor(
  grade: number | null,
  config: CourseScaleConfig = DEFAULT_SCALE_CONFIG
): {
  status: GradeStatus | null;
  label: string;
  badgeBg: string;
  badgeText: string;
  cellBg: string;
  textColor: string;
} {
  const status = getGradeStatus(grade, config);
  if (status === 'APROBADO') {
    return {
      status,
      label: 'Aprobado',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/50',
      badgeText: 'text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
      cellBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      textColor: 'text-emerald-700 dark:text-emerald-400 font-semibold',
    };
  }
  if (status === 'EN_RIESGO') {
    return {
      status,
      label: 'En Riesgo',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/50',
      badgeText: 'text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800',
      cellBg: 'bg-amber-50/50 dark:bg-amber-950/20',
      textColor: 'text-amber-700 dark:text-amber-400 font-semibold',
    };
  }
  if (status === 'REPROBADO') {
    return {
      status,
      label: 'Reprobado',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/50',
      badgeText: 'text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800',
      cellBg: 'bg-rose-50/50 dark:bg-rose-950/20',
      textColor: 'text-rose-700 dark:text-rose-400 font-semibold',
    };
  }
  return {
    status: null,
    label: 'Sin calificar',
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700',
    cellBg: 'bg-transparent',
    textColor: 'text-slate-500 dark:text-slate-400',
  };
}

export type TaskDeliveryStatus =
  | 'A_TIEMPO'
  | 'CON_ATRASO'
  | 'PENDIENTE'
  | 'NO_ENTREGO';

export interface LateCalculationResult {
  daysLate: number;
  status: TaskDeliveryStatus;
  statusLabel: string;
  penalty: number;
  adjustedGrade: number | null;
}

/**
 * Calculates late days, status, and grade penalty for an assignment.
 * Dates are expected in ISO format (YYYY-MM-DD) or timestamps.
 */
export function calculateLateDaysAndPenalty(
  dueDateStr: string,
  deliveredDateStr: string | null | undefined,
  isDelivered: boolean,
  originalGrade: number | null | undefined,
  currentDateStr: string = new Date().toISOString().split('T')[0],
  config: CourseScaleConfig = DEFAULT_SCALE_CONFIG
): LateCalculationResult {
  const dueTime = new Date(`${dueDateStr}T23:59:59`).getTime();
  const currentTime = new Date(`${currentDateStr}T23:59:59`).getTime();

  let daysLate = 0;
  let status: TaskDeliveryStatus = 'PENDIENTE';
  let statusLabel = 'Pendiente';

  if (isDelivered && deliveredDateStr) {
    const deliveryTime = new Date(`${deliveredDateStr}T00:00:00`).getTime();
    const diffMs = deliveryTime - dueTime;
    if (diffMs > 0) {
      daysLate = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      status = 'CON_ATRASO';
      statusLabel = `Entregada con atraso (${daysLate} ${daysLate === 1 ? 'día' : 'días'})`;
    } else {
      daysLate = 0;
      status = 'A_TIEMPO';
      statusLabel = 'Entregada a tiempo';
    }
  } else if (isDelivered && !deliveredDateStr) {
    // Delivered without specific date, assume on time
    daysLate = 0;
    status = 'A_TIEMPO';
    statusLabel = 'Entregada a tiempo';
  } else {
    // Not delivered
    const diffMs = currentTime - dueTime;
    if (diffMs > 0) {
      daysLate = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      status = 'NO_ENTREGO';
      statusLabel = `Atrasada sin entregar (${daysLate} ${daysLate === 1 ? 'día' : 'días'})`;
    } else {
      daysLate = 0;
      status = 'PENDIENTE';
      statusLabel = 'Pendiente (a tiempo)';
    }
  }

  // Penalty calculation
  const rawPenalty = daysLate * config.penaltyPerDayLate;
  const penalty = Number(Math.min(config.maxLatePenalty, Math.max(0, rawPenalty)).toFixed(2));

  const minGrade = (config as any).minGrade ?? (config as any).scaleMin ?? 0;
  let adjustedGrade: number | null = null;
  if (originalGrade !== null && originalGrade !== undefined && !isNaN(Number(originalGrade))) {
    adjustedGrade = Number(Math.max(minGrade, Number(originalGrade) - penalty).toFixed(2));
  }

  return {
    daysLate,
    status,
    statusLabel,
    penalty,
    adjustedGrade,
  };
}
