import { cn } from '../../lib';

export interface SkeletonProps {
  /** Size and shape via layout classes, e.g. "h-4 w-32". */
  className?: string;
}

/** Placeholder block shaped like the content that is loading. */
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-surface-muted', className)} />;
}
