import type { ReactNode } from 'react';
import { cn } from '../../lib';

export interface FieldProps {
  /** Label text or node displayed above the control. */
  label?: ReactNode;
  /** Matches the id of the input control for label association. */
  htmlFor?: string;
  /** Optional secondary helper text displayed below the control. */
  hint?: ReactNode;
  /** Error message displayed in danger text below the control. */
  error?: string;
  /** Shows a required indicator next to the label. */
  required?: boolean;
  /** Additional classes for the container layout. */
  className?: string;
  /** The input, select, textarea or custom control. */
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: FieldProps) {
  const hintId = htmlFor ? `${htmlFor}-hint` : undefined;
  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-xs font-medium text-fg flex items-center gap-1">
          {label}
          {required && (
            <span className="text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
