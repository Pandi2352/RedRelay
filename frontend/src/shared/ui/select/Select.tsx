import { forwardRef, type ComponentProps } from 'react';
import { cn } from '../../lib';
import { selectVariants, type SelectVariantProps } from './select.variants';

export interface SelectProps extends Omit<ComponentProps<'select'>, 'size'>, SelectVariantProps {
  /** Marks the select as invalid for screen readers and styling. */
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, size, invalid, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid ? true : undefined}
      className={cn(selectVariants({ size, invalid: Boolean(invalid) }), className)}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
