import type { ReactNode } from 'react';
import { cn } from '../../lib';

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** The action that makes content appear, usually a Button. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-start gap-2 py-6', className)}>
      <h2 className="text-lg font-medium">{title}</h2>
      {description && <p className="max-w-prose text-fg-muted">{description}</p>}
      {action}
    </div>
  );
}
