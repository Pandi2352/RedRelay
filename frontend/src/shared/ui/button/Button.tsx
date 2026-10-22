import type { ComponentProps } from 'react';
import { cn } from '../../lib';
import { Spinner } from '../spinner';
import { buttonVariants, type ButtonVariantProps } from './button.variants';

export interface ButtonProps extends ComponentProps<'button'>, ButtonVariantProps {
  /** Shows a spinner and disables the button while an action runs. */
  loading?: boolean;
}

export function Button({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
