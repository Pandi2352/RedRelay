import type { ComponentProps } from 'react';
import { cn } from '../../lib';
import { Spinner } from '../spinner';
import { iconButtonVariants, type IconButtonVariantProps } from './icon-button.variants';

export interface IconButtonProps extends ComponentProps<'button'>, IconButtonVariantProps {
  /** Screen reader label — mandatory since there is no visible text. */
  'aria-label': string;
  /** Shows a spinner and disables the button while an action runs. */
  loading?: boolean;
}

export function IconButton({
  variant,
  size,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
}
