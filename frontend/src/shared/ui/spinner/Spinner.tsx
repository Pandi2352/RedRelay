import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib';

const spinnerVariants = cva('animate-spin rounded-full border-2 border-current border-t-transparent', {
  variants: {
    size: { sm: 'size-3.5', md: 'size-5' },
  },
  defaultVariants: { size: 'md' },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

/** Inline progress for buttons and small areas. Lists use Skeleton instead. */
export function Spinner({ size, className }: SpinnerProps) {
  return <span aria-hidden="true" className={cn(spinnerVariants({ size }), className)} />;
}
