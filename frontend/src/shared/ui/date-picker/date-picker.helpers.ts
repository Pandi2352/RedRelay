export interface CalendarDay {
  date: Date;
  iso: string;
  dayNumber: number;
  isCurrentMonth: boolean;
}

/** Formats a Date object to YYYY-MM-DD. */
export function toIsoDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parses string or Date to a normalized Date instance (at midnight local time). */
export function parseDateInput(value: string | Date | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const [yearStr, monthStr, dayStr] = value.split('-');
  if (yearStr && monthStr && dayStr) {
    const y = parseInt(yearStr, 10);
    const m = parseInt(monthStr, 10) - 1;
    const d = parseInt(dayStr, 10);
    const date = new Date(y, m, d);
    return isNaN(date.getTime()) ? null : date;
  }
  const fallback = new Date(value);
  return isNaN(fallback.getTime()) ? null : new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate());
}

/** Formats date into readable human string, e.g. "24 Oct 2026". */
export function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isDateDisabled(date: Date, minDate?: Date | null, maxDate?: Date | null): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  return false;
}

/** Returns 42 calendar grid days (6 weeks) for a given year & month. */
export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  // Convert Sunday (0) to 7 for Monday-first week
  const startDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

  const startDate = new Date(year, month, 1 - startDay);

  for (let i = 0; i < 42; i++) {
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    days.push({
      date: current,
      iso: toIsoDateString(current),
      dayNumber: current.getDate(),
      isCurrentMonth: current.getMonth() === month,
    });
  }

  return days;
}
