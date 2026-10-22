export type TimeFormat = '12h' | '24h';
export type TimePickerSize = 'sm' | 'md';

export interface TimeValue {
  hours: number; // 0-23
  minutes: number; // 0-59
  seconds?: number; // 0-59
}

export interface TimePickerProps {
  /** Time value string (e.g. "14:30" or "02:30 PM") or TimeValue object. */
  value?: string | TimeValue;
  /** Callback returning formatted time string according to format. */
  onChange?: (time: string) => void;
  format?: TimeFormat;
  placeholder?: string;
  minuteStep?: number; // default 5 (e.g. 0, 5, 10...)
  showSeconds?: boolean;
  minTime?: string;
  maxTime?: string;
  disabled?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  size?: TimePickerSize;
  className?: string;
  id?: string;
  name?: string;
  'aria-label'?: string;
  showPresets?: boolean;
}
