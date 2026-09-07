import { VaccinationStatus } from '../types';

// Reusable age-calculation and age-based milestone/vaccination detection utility

export interface BabyAgeResult {
  days: number;
  weeks: number;
  remainingDaysInWeek: number;
  months: number;
  remainingDaysInMonth: number;
  totalMonths: number;
  totalMonthsDecimal: number;
  years: number;
  remainingMonthsInYear: number;
  formatted: string;
  formattedAge: string;
  shortFormatted: string;
  ageBand: string;
  currentMilestoneStage: string;
}

/**
 * Calculates the exact age of a baby from birth date to a reference date (defaults to today).
 * Avoids simplistic (currentYear - birthYear) and accounts for actual day of month and leap years.
 */
export function calculateBabyAge(
  birthDateInput: string | Date | undefined,
  referenceDateInput?: string | Date
): BabyAgeResult {
  const fallbackResult: BabyAgeResult = {
    days: 0,
    weeks: 0,
    remainingDaysInWeek: 0,
    months: 0,
    remainingDaysInMonth: 0,
    totalMonths: 0,
    totalMonthsDecimal: 0,
    years: 0,
    remainingMonthsInYear: 0,
    formatted: 'Newborn',
    formattedAge: 'Newborn',
    shortFormatted: '0d',
    ageBand: '0–2 Months',
    currentMilestoneStage: '0–2 Months',
  };

  if (!birthDateInput) return fallbackResult;

  const birthDate = typeof birthDateInput === 'string' ? new Date(birthDateInput) : birthDateInput;
  if (isNaN(birthDate.getTime())) return fallbackResult;

  const refDate = referenceDateInput
    ? typeof referenceDateInput === 'string'
      ? new Date(referenceDateInput)
      : referenceDateInput
    : new Date();

  // Total difference in milliseconds
  const diffMs = refDate.getTime() - birthDate.getTime();
  if (diffMs < 0) {
    return {
      ...fallbackResult,
      formatted: 'Expected soon (Due date in future)',
      formattedAge: 'Expected soon',
      shortFormatted: 'Due',
      ageBand: '0–2 Months',
      currentMilestoneStage: '0–2 Months',
    };
  }

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysInWeek = totalDays % 7;

  // Exact calendar months and years calculation
  let years = refDate.getFullYear() - birthDate.getFullYear();
  let months = refDate.getMonth() - birthDate.getMonth();
  let days = refDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month of refDate
    const prevMonthLastDay = new Date(refDate.getFullYear(), refDate.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalCalendarMonths = years * 12 + months;
  const totalMonthsDecimal = Number((totalCalendarMonths + days / 30.44).toFixed(2));

  // Determine stage range for milestones
  let currentMilestoneStage = '0–2 Months';
  if (totalMonthsDecimal < 2.5) {
    currentMilestoneStage = '0–2 Months';
  } else if (totalMonthsDecimal < 4.5) {
    currentMilestoneStage = '3–4 Months';
  } else if (totalMonthsDecimal < 6.5) {
    currentMilestoneStage = '5–6 Months';
  } else if (totalMonthsDecimal < 9.5) {
    currentMilestoneStage = '7–9 Months';
  } else if (totalMonthsDecimal < 12.5) {
    currentMilestoneStage = '10–12 Months';
  } else if (totalMonthsDecimal < 18.5) {
    currentMilestoneStage = '13–18 Months';
  } else if (totalMonthsDecimal < 24.5) {
    currentMilestoneStage = '19–24 Months';
  } else {
    currentMilestoneStage = '2+ Years';
  }

  // Friendly human readable age formatted string
  let formatted = '';
  let shortFormatted = '';

  if (totalDays < 7) {
    formatted = `${totalDays} ${totalDays === 1 ? 'day' : 'days'} old`;
    shortFormatted = `${totalDays}d`;
  } else if (totalDays < 30) {
    formatted = `${totalWeeks} ${totalWeeks === 1 ? 'week' : 'weeks'}${
      remainingDaysInWeek > 0 ? `, ${remainingDaysInWeek}d` : ''
    } old (${totalDays} days)`;
    shortFormatted = `${totalWeeks}w`;
  } else if (totalCalendarMonths < 12) {
    const weeksFraction = Math.floor(days / 7);
    if (weeksFraction > 0) {
      formatted = `${totalCalendarMonths} ${totalCalendarMonths === 1 ? 'Month' : 'Months'}, ${weeksFraction} ${
        weeksFraction === 1 ? 'Week' : 'Weeks'
      } old (${totalWeeks} weeks)`;
    } else {
      formatted = `${totalCalendarMonths} ${totalCalendarMonths === 1 ? 'Month' : 'Months'} old (${totalWeeks} weeks)`;
    }
    shortFormatted = `${totalCalendarMonths}m ${weeksFraction}w`;
  } else {
    const remMonths = totalCalendarMonths % 12;
    if (remMonths > 0) {
      formatted = `${years} ${years === 1 ? 'Year' : 'Years'}, ${remMonths} ${
        remMonths === 1 ? 'Month' : 'Months'
      } old (${totalCalendarMonths}m)`;
      shortFormatted = `${years}y ${remMonths}m`;
    } else {
      formatted = `${years} ${years === 1 ? 'Year' : 'Years'} old`;
      shortFormatted = `${years}y`;
    }
  }

  return {
    days: totalDays,
    weeks: totalWeeks,
    remainingDaysInWeek,
    months: totalCalendarMonths,
    remainingDaysInMonth: days,
    totalMonths: totalMonthsDecimal,
    totalMonthsDecimal,
    years,
    remainingMonthsInYear: months,
    formatted,
    formattedAge: formatted,
    shortFormatted,
    ageBand: currentMilestoneStage,
    currentMilestoneStage,
  };
}

/**
 * Parses age range text (e.g. "0–2 Months", "3-4 Months", "5-6m", "1 Year") into min & max months
 */
export function parseAgeRangeToMonths(rangeStr: string): { minMonths: number; maxMonths: number } {
  const normalized = (rangeStr || '').toLowerCase().replace(/–/g, '-').trim();

  if (normalized.includes('birth') || normalized.includes('newborn')) {
    return { minMonths: 0, maxMonths: 1 };
  }

  // Check for "X-Y months" or "X–Y Months"
  const rangeMatch = normalized.match(/(\d+)\s*-\s*(\d+)\s*(month|m|yr|year)?/i);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1], 10);
    const max = parseInt(rangeMatch[2], 10);
    if (normalized.includes('year') || normalized.includes('yr')) {
      return { minMonths: min * 12, maxMonths: max * 12 };
    }
    return { minMonths: min, maxMonths: max };
  }

  // Check for single "X months" or "Xm"
  const singleMonthMatch = normalized.match(/(\d+)\s*(month|m)/i);
  if (singleMonthMatch) {
    const m = parseInt(singleMonthMatch[1], 10);
    return { minMonths: Math.max(0, m - 1), maxMonths: m + 1 };
  }

  // Check for "X year" or "X yr"
  const singleYearMatch = normalized.match(/(\d+)\s*(year|yr)/i);
  if (singleYearMatch) {
    const y = parseInt(singleYearMatch[1], 10);
    return { minMonths: (y - 0.5) * 12, maxMonths: (y + 0.5) * 12 };
  }

  // Default fallback
  return { minMonths: 0, maxMonths: 6 };
}

/**
 * Evaluates the milestone status relative to the baby's actual age in months.
 * Returns: 'completed' | 'due' (Action Required / Due Now) | 'upcoming' | 'overdue'
 */
export function detectMilestoneStatus(
  milestone: {
    completed: boolean;
    status?: 'due' | 'upcoming' | 'completed' | 'overdue';
    ageRange: string;
    minAgeMonths?: number;
    maxAgeMonths?: number;
  },
  babyAgeMonths: number
): 'due' | 'upcoming' | 'completed' | 'overdue' {
  if (milestone.completed) return 'completed';

  const { minMonths, maxMonths } =
    milestone.minAgeMonths !== undefined && milestone.maxAgeMonths !== undefined
      ? { minMonths: milestone.minAgeMonths, maxMonths: milestone.maxAgeMonths }
      : parseAgeRangeToMonths(milestone.ageRange);

  // If baby is significantly past the recommended window and it's incomplete -> Overdue
  if (babyAgeMonths > maxMonths + 0.5) {
    return 'overdue';
  }

  // If baby is currently in the active recommended stage -> Due Now / Action Required
  if (babyAgeMonths >= minMonths - 0.5 && babyAgeMonths <= maxMonths + 0.5) {
    return 'due';
  }

  // If the milestone is for older babies -> Upcoming
  return 'upcoming';
}

/**
 * Parses vaccination recommended age into expected months
 */
export function parseVaccinationAgeToMonths(ageStr: string): number {
  const norm = (ageStr || '').toLowerCase().trim();
  if (norm.includes('birth') || norm === '0') return 0;
  if (norm.includes('1 month')) return 1;
  if (norm.includes('2 month')) return 2;
  if (norm.includes('4 month')) return 4;
  if (norm.includes('6 month')) return 6;
  if (norm.includes('9 month')) return 9;
  if (norm.includes('12 month') || norm.includes('1 year')) return 12;
  if (norm.includes('15 month')) return 15;
  if (norm.includes('18 month')) return 18;
  if (norm.includes('2 year') || norm.includes('24 month')) return 24;
  if (norm.includes('4 year') || norm.includes('4-6 year')) return 48;

  const numMatch = norm.match(/(\d+)/);
  if (numMatch) {
    const val = parseInt(numMatch[1], 10);
    if (norm.includes('year') || norm.includes('yr')) return val * 12;
    return val;
  }
  return 0;
}

/**
 * Evaluates vaccination status based on completion, scheduled date, and baby's age in months.
 */
export function detectVaccinationStatus(
  vaccination: {
    status: VaccinationStatus;
    administeredDate?: string;
    scheduledDate?: string;
    recommendedAge: string;
    recommendedAgeMonths?: number;
  },
  babyAgeMonths: number
): VaccinationStatus {
  if (vaccination.status === 'completed' || !!vaccination.administeredDate) {
    return 'completed';
  }

  if (vaccination.status === 'missed') {
    return 'missed';
  }

  const recMonths =
    vaccination.recommendedAgeMonths !== undefined
      ? vaccination.recommendedAgeMonths
      : parseVaccinationAgeToMonths(vaccination.recommendedAge);

  // Check if past due
  if (babyAgeMonths > recMonths + 1.2) {
    return 'overdue';
  }

  // Check if currently due
  if (babyAgeMonths >= recMonths - 0.5 && babyAgeMonths <= recMonths + 1.2) {
    return 'due';
  }

  if (vaccination.scheduledDate) {
    const sched = new Date(vaccination.scheduledDate);
    const now = new Date();
    if (sched < now) {
      return 'overdue';
    }
    return 'scheduled';
  }

  return 'upcoming';
}
