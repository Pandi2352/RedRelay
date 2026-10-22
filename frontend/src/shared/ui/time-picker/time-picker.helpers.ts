import type { TimeFormat, TimeValue } from './time-picker.types';

export function padZero(num: number): string {
  return String(num).padStart(2, '0');
}

export function to12Hour(hour24: number): { hour12: number; period: 'AM' | 'PM' } {
  const period: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  return { hour12, period };
}

export function to24Hour(hour12: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
}

export function parseTimeString(value: string | TimeValue | undefined): TimeValue | null {
  if (!value) return null;
  if (typeof value === 'object') {
    return {
      hours: Math.max(0, Math.min(23, value.hours)),
      minutes: Math.max(0, Math.min(59, value.minutes)),
      seconds: value.seconds !== undefined ? Math.max(0, Math.min(59, value.seconds)) : undefined,
    };
  }

  const str = value.trim();
  const match12 = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (!match12) return null;

  const rawHours = parseInt(match12[1] ?? '0', 10);
  const minutes = parseInt(match12[2] ?? '0', 10);
  const seconds = match12[3] ? parseInt(match12[3], 10) : undefined;
  const period = match12[4]?.toUpperCase() as 'AM' | 'PM' | undefined;

  let hours = rawHours;
  if (period) {
    hours = to24Hour(rawHours, period);
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes, seconds };
}

export function formatTimeString(
  time: TimeValue,
  format: TimeFormat,
  showSeconds = false,
): string {
  const { hours, minutes, seconds } = time;
  const secPart = showSeconds && seconds !== undefined ? `:${padZero(seconds)}` : '';

  if (format === '24h') {
    return `${padZero(hours)}:${padZero(minutes)}${secPart}`;
  }

  const { hour12, period } = to12Hour(hours);
  return `${padZero(hour12)}:${padZero(minutes)}${secPart} ${period}`;
}

export function getCurrentTime(step = 1): TimeValue {
  const now = new Date();
  const currentMinutes = now.getMinutes();
  const roundedMinutes = step > 1 ? Math.round(currentMinutes / step) * step : currentMinutes;
  const finalMinutes = roundedMinutes >= 60 ? 55 : roundedMinutes;
  return {
    hours: now.getHours(),
    minutes: finalMinutes,
    seconds: 0,
  };
}

export function addMinutes(time: TimeValue, mins: number): TimeValue {
  const total = time.hours * 60 + time.minutes + mins;
  const normalized = (total % 1440 + 1440) % 1440;
  return {
    hours: Math.floor(normalized / 60),
    minutes: normalized % 60,
    seconds: 0,
  };
}

export function isTimeDisabled(
  time: TimeValue,
  minTime?: string,
  maxTime?: string,
): boolean {
  const curMinutes = time.hours * 60 + time.minutes;

  if (minTime) {
    const minParsed = parseTimeString(minTime);
    if (minParsed && curMinutes < minParsed.hours * 60 + minParsed.minutes) {
      return true;
    }
  }

  if (maxTime) {
    const maxParsed = parseTimeString(maxTime);
    if (maxParsed && curMinutes > maxParsed.hours * 60 + maxParsed.minutes) {
      return true;
    }
  }

  return false;
}
