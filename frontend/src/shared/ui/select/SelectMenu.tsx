import { Check, Search } from 'lucide-react';
import type { ChangeEvent, RefObject } from 'react';
import { cn } from '../../lib';
import type { SelectOption } from './select.types';

interface SelectMenuProps {
  searchable: boolean;
  searchPlaceholder: string;
  searchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  filteredOptions: SelectOption[];
  multiple?: boolean;
  selectedValues: Set<string>;
  highlightedIndex: number;
  onSelectOption: (option: SelectOption) => void;
  onSelectAll?: () => void;
  onClearAll?: () => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function SelectMenu({
  searchable,
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  filteredOptions,
  multiple,
  selectedValues,
  highlightedIndex,
  onSelectOption,
  onSelectAll,
  onClearAll,
  searchInputRef,
}: SelectMenuProps) {
  return (
    <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-surface border border-border rounded-md overflow-hidden flex flex-col max-h-72">
      {searchable && (
        <div className="p-2 border-b border-border bg-surface-muted/40">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-fg-subtle pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
              className="w-full h-8 pl-8 pr-2.5 text-xs bg-surface text-fg placeholder:text-fg-subtle rounded-md border border-border focus:border-focus focus:outline-none"
            />
          </div>
        </div>
      )}

      {multiple && filteredOptions.length > 0 && onSelectAll && onClearAll && (
        <div className="px-3 py-1.5 flex items-center justify-between border-b border-border text-[11px] text-fg-muted bg-surface-muted/20">
          <button
            type="button"
            onClick={onSelectAll}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Select all
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="hover:text-danger transition-colors cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      <ul role="listbox" tabIndex={-1} className="overflow-y-auto p-1 flex flex-col gap-0.5">
        {filteredOptions.length === 0 ? (
          <li className="px-3 py-4 text-xs text-fg-subtle text-center">No options found</li>
        ) : (
          filteredOptions.map((opt, idx) => {
            const isSelected = selectedValues.has(opt.value);
            const isHighlighted = idx === highlightedIndex;

            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                onClick={() => !opt.disabled && onSelectOption(opt)}
                className={cn(
                  'flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-xs cursor-pointer select-none transition-colors',
                  isHighlighted && 'bg-surface-muted text-fg',
                  isSelected && 'font-medium text-primary',
                  opt.disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {multiple && (
                    <div
                      className={cn(
                        'h-3.5 w-3.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors',
                        isSelected ? 'bg-primary border-primary text-primary-fg' : 'border-border-strong',
                      )}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </div>
                  )}
                  {opt.icon}
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{opt.label}</span>
                    {opt.description && (
                      <span className="text-[11px] text-fg-subtle truncate font-normal">
                        {opt.description}
                      </span>
                    )}
                  </div>
                </div>

                {!multiple && isSelected && (
                  <Check className="h-3.5 w-3.5 text-primary shrink-0 stroke-[2.5]" />
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
