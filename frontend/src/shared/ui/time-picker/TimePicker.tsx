import { Clock, X } from 'lucide-react';
import { useCallback, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useClickOutside } from '../../hooks';
import { cn } from '../../lib';
import { TimePickerPopover } from './TimePickerPopover';
import {
  formatTimeString,
  getCurrentTime,
  parseTimeString,
} from './time-picker.helpers';
import type { TimePickerProps, TimeValue } from './time-picker.types';
import { timePickerTriggerVariants } from './time-picker.variants';

export function TimePicker({
  value,
  onChange,
  format = '12h',
  placeholder = 'Select time...',
  minuteStep = 5,
  showSeconds = false,
  minTime,
  maxTime,
  disabled = false,
  invalid = false,
  clearable = true,
  size = 'md',
  className,
  id,
  'aria-label': ariaLabel,
  showPresets = true,
}: TimePickerProps) {
  const parsedTime = useMemo(() => parseTimeString(value), [value]);

  const [isOpen, setIsOpen] = useState(false);
  const [internalTime, setInternalTime] = useState<TimeValue>(
    () => parsedTime ?? getCurrentTime(minuteStep),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setIsOpen(false), isOpen);

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setInternalTime(parsedTime ?? getCurrentTime(minuteStep));
      }
      return next;
    });
  }, [disabled, parsedTime, minuteStep]);

  const handleTimeChange = useCallback((newTime: TimeValue) => {
    setInternalTime(newTime);
  }, []);

  const handlePresetSelect = useCallback(
    (presetTime: TimeValue) => {
      setInternalTime(presetTime);
      onChange?.(formatTimeString(presetTime, format, showSeconds));
      setIsOpen(false);
    },
    [onChange, format, showSeconds],
  );

  const handleConfirm = useCallback(() => {
    onChange?.(formatTimeString(internalTime, format, showSeconds));
    setIsOpen(false);
  }, [internalTime, format, showSeconds, onChange]);

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
        className={cn(timePickerTriggerVariants({ size, invalid, open: isOpen }), className)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Clock className="h-4 w-4 text-fg-subtle shrink-0" />
          {parsedTime ? (
            <span className="truncate text-fg font-medium tabular-nums">
              {formatTimeString(parsedTime, format, showSeconds)}
            </span>
          ) : (
            <span className="truncate text-fg-subtle">{placeholder}</span>
          )}
        </div>

        {clearable && parsedTime && !disabled && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Clear time"
            onClick={handleClear}
            className="hover:text-fg text-fg-muted p-0.5 rounded cursor-pointer shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {isOpen && (
        <TimePickerPopover
          currentTime={internalTime}
          format={format}
          minuteStep={minuteStep}
          showSeconds={showSeconds}
          minTime={minTime}
          maxTime={maxTime}
          showPresets={showPresets}
          onTimeChange={handleTimeChange}
          onPresetSelect={handlePresetSelect}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
