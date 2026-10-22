import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva(
  'w-full rounded-md border border-border-strong bg-surface text-fg placeholder:text-fg-subtle ' +
    'transition-colors disabled:cursor-not-allowed disabled:opacity-50 ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-9 px-3 text-sm',
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

export type InputVariantProps = VariantProps<typeof inputVariants>;
