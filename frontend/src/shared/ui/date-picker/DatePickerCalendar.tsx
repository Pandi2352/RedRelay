import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { cn } from '../../lib';
import {
  getCalendarDays,
  isDateDisabled,
  isSameDay,
  type CalendarDay,
} from './date-picker.helpers';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

interface DatePickerCalendarProps {
  viewYear: number;
  viewMonth: number;
  selectedDate: Date | null;
  minDate: Date | null;
  maxDate: Date | null;
  showPresets: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (day: CalendarDay) => void;
  onPresetSelect: (offsetDays: number) => void;
}

export function DatePickerCalendar({
  viewYear,
  viewMonth,
  selectedDate,
  minDate,
  maxDate,
  showPresets,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onPresetSelect,
}: DatePickerCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(
      new Date(viewYear, viewMonth, 1),
    );
  }, [viewYear, viewMonth]);

  return (
    <div className="absolute top-full left-0 mt-1 z-50 w-72 bg-surface border border-border rounded-md p-3 select-none">
      {showPresets && (
        <div className="flex items-center gap-1 pb-2.5 mb-2.5 border-b border-border overflow-x-auto text-[11px]">
          <button
            type="button"
            onClick={() => onPresetSelect(0)}
            className="px-2 py-0.5 rounded-md bg-surface-muted text-fg hover:bg-primary-soft hover:text-primary transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onPresetSelect(1)}
            className="px-2 py-0.5 rounded-md bg-surface-muted text-fg hover:bg-primary-soft hover:text-primary transition-colors cursor-pointer"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => onPresetSelect(3)}
            className="px-2 py-0.5 rounded-md bg-surface-muted text-fg hover:bg-primary-soft hover:text-primary transition-colors cursor-pointer"
          >
            +3 Days
          </button>
          <button
            type="button"
            onClick={() => onPresetSelect(7)}
            className="px-2 py-0.5 rounded-md bg-surface-muted text-fg hover:bg-primary-soft hover:text-primary transition-colors cursor-pointer"
          >
            +1 Week
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-fg">{monthLabel}</span>
        <div className="flex items-center gap-1 text-fg-muted">
          <button
            type="button"
            aria-label="Previous month"
            onClick={onPrevMonth}
            className="p-1 rounded-md hover:bg-surface-muted hover:text-fg transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={onNextMonth}
            className="p-1 rounded-md hover:bg-surface-muted hover:text-fg transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-fg-subtle mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="h-6 flex items-center justify-center">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day) => {
          const isSelected = isSameDay(day.date, selectedDate);
          const isCurrentDay = isSameDay(day.date, today);
          const isDisabled = isDateDisabled(day.date, minDate, maxDate);

          return (
            <button
              key={day.iso}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(day)}
              className={cn(
                'h-7 w-full flex items-center justify-center rounded-md font-normal transition-colors cursor-pointer',
                !day.isCurrentMonth && 'text-fg-subtle/40',
                day.isCurrentMonth && !isSelected && 'text-fg hover:bg-surface-muted',
                isCurrentDay && !isSelected && 'border border-primary text-primary font-medium',
                isSelected && 'bg-primary text-primary-fg font-medium',
                isDisabled && 'opacity-25 cursor-not-allowed pointer-events-none',
              )}
            >
              {day.dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}
