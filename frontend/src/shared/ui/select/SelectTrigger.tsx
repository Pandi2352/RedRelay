import { ChevronDown, X } from 'lucide-react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { cn } from '../../lib';
import { Badge } from '../badge';
import type { SelectOption, SelectSize } from './select.types';
import { selectTriggerVariants } from './select.variants';

interface SelectTriggerProps {
  id?: string;
  isOpen: boolean;
  disabled?: boolean;
  invalid?: boolean;
  size?: SelectSize;
  className?: string;
  placeholder?: string;
  multiple?: boolean;
  selectedOptions: SelectOption[];
  clearable?: boolean;
  onToggle: () => void;
  onClear: (e: MouseEvent) => void;
  onRemoveItem: (value: string, e: MouseEvent) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
}

export function SelectTrigger({
  id,
  isOpen,
  disabled,
  invalid,
  size = 'md',
  className,
  placeholder = 'Select an option...',
  multiple,
  selectedOptions,
  clearable,
  onToggle,
  onClear,
  onRemoveItem,
  onKeyDown,
  'aria-label': ariaLabel,
}: SelectTriggerProps) {
  const hasValue = selectedOptions.length > 0;

  return (
    <button
      id={id}
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onToggle}
      onKeyDown={onKeyDown}
      className={cn(selectTriggerVariants({ size, invalid, open: isOpen }), className)}
    >
      <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
        {!hasValue ? (
          <span className="text-fg-subtle truncate">{placeholder}</span>
        ) : multiple ? (
          selectedOptions.map((opt) => (
            <Badge key={opt.value} tone="neutral" variant="soft" className="gap-1 py-0">
              <span className="truncate max-w-[120px]">{opt.label}</span>
              {!disabled && (
                <span
                  role="button"
                  tabIndex={-1}
                  aria-label={`Remove ${opt.label}`}
                  onClick={(e) => onRemoveItem(opt.value, e)}
                  className="hover:text-danger rounded-sm p-0.5 cursor-pointer"
                >
                  <X className="h-2.5 w-2.5" />
                </span>
              )}
            </Badge>
          ))
        ) : (
          <span className="truncate text-fg flex items-center gap-1.5">
            {selectedOptions[0]?.icon}
            {selectedOptions[0]?.label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0 text-fg-muted">
        {clearable && hasValue && !disabled && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Clear selection"
            onClick={onClear}
            className="hover:text-fg p-0.5 rounded cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </span>
        )}
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-150', isOpen && 'rotate-180')}
        />
      </div>
    </button>
  );
}
