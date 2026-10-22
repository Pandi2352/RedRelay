import { forwardRef, type ComponentProps } from 'react';
import { cn } from '../../lib';
import { inputVariants, type InputVariantProps } from './input.variants';

export interface InputProps extends Omit<ComponentProps<'input'>, 'size'>, InputVariantProps {
  /** Marks the input as invalid for screen readers and styling. */
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, invalid, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid ? true : undefined}
      className={cn(inputVariants({ size, invalid: Boolean(invalid) }), className)}
      {...props}
    />
  );
});

Input.displayName = 'Input';
