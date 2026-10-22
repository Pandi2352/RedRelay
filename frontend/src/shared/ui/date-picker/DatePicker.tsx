import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useCallback, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useClickOutside } from '../../hooks';
import { cn } from '../../lib';
import { DatePickerCalendar } from './DatePickerCalendar';
import {
  formatDisplayDate,
  parseDateInput,
  toIsoDateString,
  type CalendarDay,
} from './date-picker.helpers';
import type { DatePickerProps } from './date-picker.types';
import { datePickerTriggerVariants } from './date-picker.variants';

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date...',
  minDate,
  maxDate,
  disabled = false,
  invalid = false,
  clearable = true,
  size = 'md',
  className,
  id,
  'aria-label': ariaLabel,
  showPresets = true,
}: DatePickerProps) {
  const selectedDate = useMemo(() => parseDateInput(value), [value]);
  const parsedMin = useMemo(() => parseDateInput(minDate), [minDate]);
  const parsedMax = useMemo(() => parseDateInput(maxDate), [maxDate]);

  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date());

  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setViewDate(selectedDate ?? new Date());
      }
      return next;
    });
  }, [disabled, selectedDate]);

  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleSelectDay = useCallback(
    (day: CalendarDay) => {
      onChange?.(day.iso);
      setIsOpen(false);
    },
    [onChange],
  );

  const handlePresetSelect = useCallback(
    (offsetDays: number) => {
      const target = new Date();
      target.setDate(target.getDate() + offsetDays);
      onChange?.(toIsoDateString(target));
      setIsOpen(false);
    },
    [onChange],
  );

  const handleClear = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onChange?.('');
    },
    [onChange],
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={toggleOpen}
        className={cn(datePickerTriggerVariants({ size, invalid, open: isOpen }), className)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <CalendarIcon className="h-4 w-4 text-fg-subtle shrink-0" />
          {selectedDate ? (
            <span className="truncate text-fg font-medium">
              {formatDisplayDate(selectedDate)}
            </span>
          ) : (
            <span className="truncate text-fg-subtle">{placeholder}</span>
          )}
        </div>

        {clearable && selectedDate && !disabled && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Clear date"
            onClick={handleClear}
            className="hover:text-fg text-fg-muted p-0.5 rounded cursor-pointer shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {isOpen && (
        <DatePickerCalendar
          viewYear={viewDate.getFullYear()}
          viewMonth={viewDate.getMonth()}
          selectedDate={selectedDate}
          minDate={parsedMin}
          maxDate={parsedMax}
          showPresets={showPresets}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onSelectDate={handleSelectDay}
          onPresetSelect={handlePresetSelect}
        />
      )}
    </div>
  );
}
