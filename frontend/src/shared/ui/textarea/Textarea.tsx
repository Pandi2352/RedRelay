import { forwardRef, type ComponentProps } from 'react';
import { cn } from '../../lib';
import { textareaVariants, type TextareaVariantProps } from './textarea.variants';

export interface TextareaProps
  extends Omit<ComponentProps<'textarea'>, 'size'>,
    TextareaVariantProps {
  /** Marks the textarea as invalid for screen readers and styling. */
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, size, invalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid ? true : undefined}
      className={cn(textareaVariants({ size, invalid: Boolean(invalid) }), className)}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
