import type { ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export type SelectSize = 'sm' | 'md';

export interface CommonSelectProps {
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  size?: SelectSize;
  className?: string;
  id?: string;
  name?: string;
  'aria-label'?: string;
}

export interface SingleSelectProps extends CommonSelectProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
}

export interface MultiSelectProps extends CommonSelectProps {
  multiple: true;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export type SelectProps = SingleSelectProps | MultiSelectProps;
