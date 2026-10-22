import { cva, type VariantProps } from 'class-variance-authority';

export const textareaVariants = cva(
  'w-full rounded-md border border-border-strong bg-surface text-fg placeholder:text-fg-subtle ' +
    'transition-colors disabled:cursor-not-allowed disabled:opacity-50 resize-y ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  {
    variants: {
      size: {
        sm: 'min-h-[72px] px-2.5 py-1.5 text-xs',
        md: 'min-h-[96px] px-3 py-2 text-sm',
      },
      invalid: {
        true: 'border-danger focus-visible:outline-danger',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
    },
  },
);

export type TextareaVariantProps = VariantProps<typeof textareaVariants>;
