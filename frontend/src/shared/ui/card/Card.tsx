import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib';

const cardVariants = cva('rounded-md border border-border bg-surface', {
  variants: {
    padding: { none: '', sm: 'p-3', md: 'p-4' },
  },
  defaultVariants: { padding: 'md' },
});

export interface CardProps extends ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

/** Bordered surface. No shadow, no margin — the parent places it with gap. */
export function Card({ padding, className, ...props }: CardProps) {
  return <div className={cn(cardVariants({ padding }), className)} {...props} />;
}
