import type { ComponentProps } from 'react';
import { cn } from '../../lib';
import { badgeVariants, type BadgeVariantProps } from './badge.variants';

export interface BadgeProps extends ComponentProps<'span'>, BadgeVariantProps {}

export function Badge({ tone, variant, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, variant }), className)} {...props}>
      {children}
    </span>
  );
}
