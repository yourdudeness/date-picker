/**
 * Date utility functions for the calendar component
 */

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Get the first day of the month
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get the last day of the month
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Get all days in a month
 */
export function getDaysInMonth(date: Date): Date[] {
  const firstDay = getFirstDayOfMonth(date);
  const lastDay = getLastDayOfMonth(date);
  const days: Date[] = [];

  for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), day));
  }

  return days;
}

/**
 * Get the starting day of week for the month (0 = Sunday)
 */
export function getMonthStartDay(date: Date): number {
  return getFirstDayOfMonth(date).getDay();
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return formatDate(date1) === formatDate(date2);
}

/**
 * Check if a date is between two dates (inclusive)
 */
export function isBetween(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  const startTime = start.getTime();
  const endTime = end.getTime();
  return time >= Math.min(startTime, endTime) && time <= Math.max(startTime, endTime);
}

/**
 * Get an array of months relative to the current month
 */
export function getMonthsArray(baseDate: Date, count: number): Date[] {
  const months: Date[] = [];
  const startOffset = -Math.floor(count / 2);

  for (let i = 0; i < count; i++) {
    const month = new Date(baseDate.getFullYear(), baseDate.getMonth() + startOffset + i, 1);
    months.push(month);
  }

  return months;
}

/**
 * Format month and year for display
 */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
}

/**
 * Get day name abbreviation
 */
export const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}
