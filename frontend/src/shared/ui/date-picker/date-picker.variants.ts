import { cva, type VariantProps } from 'class-variance-authority';

export const datePickerTriggerVariants = cva(
  'w-full flex items-center justify-between gap-2 rounded-md border border-border-strong bg-surface text-fg ' +
    'transition-colors text-left select-none cursor-pointer ' +
    'disabled:cursor-not-allowed disabled:opacity-50 ' +
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
      open: {
        true: 'border-focus',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
      open: false,
    },
  },
);

export type DatePickerTriggerVariantProps = VariantProps<typeof datePickerTriggerVariants>;
