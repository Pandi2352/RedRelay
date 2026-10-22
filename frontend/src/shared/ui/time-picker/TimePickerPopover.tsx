import { useMemo } from 'react';
import { cn } from '../../lib';
import {
  isTimeDisabled,
  padZero,
  to12Hour,
  to24Hour,
} from './time-picker.helpers';
import type { TimeFormat, TimeValue } from './time-picker.types';

interface TimePickerPopoverProps {
  currentTime: TimeValue;
  format: TimeFormat;
  minuteStep: number;
  showSeconds: boolean;
  minTime?: string;
  maxTime?: string;
  showPresets: boolean;
  onTimeChange: (newTime: TimeValue) => void;
  onPresetSelect: (presetTime: TimeValue) => void;
  onConfirm: () => void;
}

export function TimePickerPopover({
  currentTime,
  format,
  minuteStep,
  showSeconds,
  minTime,
  maxTime,
  showPresets,
  onTimeChange,
  onPresetSelect,
  onConfirm,
}: TimePickerPopoverProps) {
  const { hour12, period } = useMemo(() => to12Hour(currentTime.hours), [currentTime.hours]);

  const hoursList = useMemo(() => {
    if (format === '24h') {
      return Array.from({ length: 24 }, (_, i) => i);
    }
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, [format]);

  const minutesList = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 60; i += minuteStep) {
      list.push(i);
    }
    return list;
  }, [minuteStep]);

  const secondsList = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 60; i += 5) {
      list.push(i);
    }
    return list;
  }, []);

  const handleHourSelect = (h: number) => {
    let newHours = h;
    if (format === '12h') {
      newHours = to24Hour(h, period);
    }
    onTimeChange({ ...currentTime, hours: newHours });
  };

  const handleMinuteSelect = (m: number) => {
    onTimeChange({ ...currentTime, minutes: m });
  };

  const handleSecondSelect = (s: number) => {
    onTimeChange({ ...currentTime, seconds: s });
  };

  const handlePeriodToggle = (newPeriod: 'AM' | 'PM') => {
    if (newPeriod === period) return;
    const newHours = to24Hour(hour12, newPeriod);
    onTimeChange({ ...currentTime, hours: newHours });
  };

  return (
    <div className="absolute top-full left-0 mt-1 z-50 bg-surface border border-border rounded-md p-3 select-none flex flex-col gap-2.5 min-w-[260px]">
      {showPresets && (
        <div className="flex items-center gap-1 pb-2 border-b border-border overflow-x-auto text-[11px]">
          <button
            type="button"
            onClick={() => onPresetSelect({ hours: new Date().getHours(), minutes: new Date().getMinutes() })}
            className="px-2 py-0.5 rounded-md bg-surface-muted text-fg hover:bg-primary-soft hover:text-primary transition-colors cursor-pointer"
          >
            Now
          </button>
          <button
            type="button"
            onClick={() => onPresetSelect({ hours: 9, minutes: 0 })}
            className="px-2 py-0.5 rounded-md bg-surface-muted text-fg hover:bg-primary-soft hover:text-primary transition-colors cursor-pointer"
          >
            09:00
          </button>
          <button
            type="button"
            onClick={() => onPresetSelect({ hours: 12, minutes: 0 })}
            className="px-2 py-0.5 rounded-md bg-surface-muted text-fg hover:bg-primary-soft hover:text-primary transition-colors cursor-pointer"
          >
            12:00
          </button>
          <button
            type="button"
            onClick={() => onPresetSelect({ hours: 18, minutes: 0 })}
            className="px-2 py-0.5 rounded-md bg-surface-muted text-fg hover:bg-primary-soft hover:text-primary transition-colors cursor-pointer"
          >
            18:00
          </button>
        </div>
      )}

      <div className="flex items-stretch justify-center gap-2 h-44">
        {/* Hours Column */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-[10px] uppercase font-semibold text-fg-subtle mb-1">Hrs</span>
          <div className="overflow-y-auto w-full flex flex-col gap-0.5 pr-0.5">
            {hoursList.map((h) => {
              const actualH = format === '12h' ? to24Hour(h, period) : h;
              const disabled = isTimeDisabled({ ...currentTime, hours: actualH }, minTime, maxTime);
              const selected = format === '12h' ? hour12 === h : currentTime.hours === h;

              return (
                <button
                  key={h}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleHourSelect(h)}
                  className={cn(
                    'h-7 w-full flex items-center justify-center rounded-md text-xs tabular-nums transition-colors cursor-pointer',
                    selected ? 'bg-primary text-primary-fg font-medium' : 'text-fg hover:bg-surface-muted',
                    disabled && 'opacity-25 pointer-events-none',
                  )}
                >
                  {padZero(h)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minutes Column */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-[10px] uppercase font-semibold text-fg-subtle mb-1">Min</span>
          <div className="overflow-y-auto w-full flex flex-col gap-0.5 pr-0.5">
            {minutesList.map((m) => {
              const disabled = isTimeDisabled({ ...currentTime, minutes: m }, minTime, maxTime);
              const selected = currentTime.minutes === m;

              return (
                <button
                  key={m}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleMinuteSelect(m)}
                  className={cn(
                    'h-7 w-full flex items-center justify-center rounded-md text-xs tabular-nums transition-colors cursor-pointer',
                    selected ? 'bg-primary text-primary-fg font-medium' : 'text-fg hover:bg-surface-muted',
                    disabled && 'opacity-25 pointer-events-none',
                  )}
                >
                  {padZero(m)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seconds Column (optional) */}
        {showSeconds && (
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] uppercase font-semibold text-fg-subtle mb-1">Sec</span>
            <div className="overflow-y-auto w-full flex flex-col gap-0.5 pr-0.5">
              {secondsList.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSecondSelect(s)}
                  className={cn(
                    'h-7 w-full flex items-center justify-center rounded-md text-xs tabular-nums transition-colors cursor-pointer',
                    currentTime.seconds === s ? 'bg-primary text-primary-fg font-medium' : 'text-fg hover:bg-surface-muted',
                  )}
                >
                  {padZero(s)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AM / PM Toggle (for 12h format) */}
        {format === '12h' && (
          <div className="flex flex-col justify-center gap-1.5 pl-1 border-l border-border">
            <button
              type="button"
              onClick={() => handlePeriodToggle('AM')}
              className={cn(
                'px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
                period === 'AM' ? 'bg-primary text-primary-fg' : 'bg-surface-muted text-fg hover:bg-border',
              )}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => handlePeriodToggle('PM')}
              className={cn(
                'px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer',
                period === 'PM' ? 'bg-primary text-primary-fg' : 'bg-surface-muted text-fg hover:bg-border',
              )}
            >
              PM
            </button>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-border flex justify-end">
        <button
          type="button"
          onClick={onConfirm}
          className="px-3 py-1 text-xs rounded-md bg-primary text-primary-fg hover:bg-primary-hover font-medium cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
