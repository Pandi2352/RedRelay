import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { useClickOutside } from '../../hooks';
import { SelectMenu } from './SelectMenu';
import { SelectTrigger } from './SelectTrigger';
import type { SelectOption, SelectProps } from './select.types';

export function Select(props: SelectProps) {
  const {
    options,
    placeholder,
    searchable = true,
    searchPlaceholder = 'Search...',
    clearable = false,
    disabled = false,
    invalid = false,
    size = 'md',
    className,
    id,
    'aria-label': ariaLabel,
    multiple,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setSearchQuery('');
  }, isOpen);

  const selectedValues = useMemo<Set<string>>(() => {
    if (props.multiple) {
      return new Set(props.value ?? []);
    }
    return props.value ? new Set([props.value]) : new Set();
  }, [props.multiple, props.value]);

  const selectedOptions = useMemo<SelectOption[]>(() => {
    return options.filter((opt) => selectedValues.has(opt.value));
  }, [options, selectedValues]);

  const filteredOptions = useMemo<SelectOption[]>(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.description && opt.description.toLowerCase().includes(query)),
    );
  }, [options, searchQuery]);

  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setSearchQuery('');
        setHighlightedIndex(0);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      return next;
    });
  }, [disabled]);

  const handleSelectOption = useCallback(
    (option: SelectOption) => {
      if (props.multiple) {
        const current = props.value ?? [];
        const next = current.includes(option.value)
          ? current.filter((v) => v !== option.value)
          : [...current, option.value];
        props.onChange?.(next);
      } else {
        props.onChange?.(option.value);
        setIsOpen(false);
        setSearchQuery('');
      }
    },
    [props],
  );

  const handleClear = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (props.multiple) {
        props.onChange?.([]);
      } else {
        props.onChange?.('');
      }
    },
    [props],
  );

  const handleRemoveItem = useCallback(
    (val: string, e: MouseEvent) => {
      e.stopPropagation();
      if (props.multiple) {
        props.onChange?.((props.value ?? []).filter((v) => v !== val));
      }
    },
    [props],
  );

  const handleSelectAll = useCallback(() => {
    if (props.multiple) {
      const allValues = filteredOptions.filter((o) => !o.disabled).map((o) => o.value);
      props.onChange?.(allValues);
    }
  }, [props, filteredOptions]);

  const handleClearAll = useCallback(() => {
    if (props.multiple) {
      props.onChange?.([]);
    }
  }, [props]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        toggleDropdown();
      } else if (filteredOptions[highlightedIndex]) {
        handleSelectOption(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <SelectTrigger
        id={id}
        isOpen={isOpen}
        disabled={disabled}
        invalid={invalid}
        size={size}
        className={className}
        placeholder={placeholder}
        multiple={multiple}
        selectedOptions={selectedOptions}
        clearable={clearable}
        onToggle={toggleDropdown}
        onClear={handleClear}
        onRemoveItem={handleRemoveItem}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
      />

      {isOpen && (
        <SelectMenu
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          searchQuery={searchQuery}
          onSearchChange={(e) => {
            setSearchQuery(e.target.value);
            setHighlightedIndex(0);
          }}
          filteredOptions={filteredOptions}
          multiple={multiple}
          selectedValues={selectedValues}
          highlightedIndex={highlightedIndex}
          onSelectOption={handleSelectOption}
          onSelectAll={multiple ? handleSelectAll : undefined}
          onClearAll={multiple ? handleClearAll : undefined}
          searchInputRef={searchInputRef}
        />
      )}
    </div>
  );
}
