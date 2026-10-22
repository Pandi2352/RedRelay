import { cn } from '../../lib';
import { Button } from '../button';

export interface ErrorStateProps {
  /** What failed and how to fix it, in one or two sentences. */
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
}

export function ErrorState({ message, onRetry, retrying = false, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-md border border-danger bg-danger-soft p-3 text-danger-soft-fg',
        className,
      )}
    >
      <p>{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" loading={retrying} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
