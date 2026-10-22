export interface DatePreset {
  label: string;
  daysOffset: number;
}

export type DatePickerSize = 'sm' | 'md';

export interface DatePickerProps {
  /** Selected date value in ISO format (YYYY-MM-DD) or Date object. */
  value?: string | Date;
  /** Callback fired when a date is selected or cleared. Returns ISO string (YYYY-MM-DD) or empty string. */
  onChange?: (date: string) => void;
  placeholder?: string;
  minDate?: string | Date;
  maxDate?: string | Date;
  disabled?: boolean;
  invalid?: boolean;
  clearable?: boolean;
  size?: DatePickerSize;
  className?: string;
  id?: string;
  name?: string;
  'aria-label'?: string;
  /** Show quick preset buttons (Today, Tomorrow, +3 Days, +1 Week). Defaults to true. */
  showPresets?: boolean;
}
