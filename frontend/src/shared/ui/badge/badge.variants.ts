import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium tracking-wide whitespace-nowrap select-none',
  {
    variants: {
      tone: {
        neutral: '',
        primary: '',
        secondary: '',
        success: '',
        warning: '',
        danger: '',
      },
      variant: {
        soft: '',
        solid: '',
      },
    },
    compoundVariants: [
      // Soft variants
      {
        tone: 'neutral',
        variant: 'soft',
        className: 'bg-surface-muted text-fg-muted border border-border',
      },
      {
        tone: 'primary',
        variant: 'soft',
        className: 'bg-primary-soft text-primary-soft-fg border border-primary/20',
      },
      {
        tone: 'secondary',
        variant: 'soft',
        className: 'bg-secondary-soft text-secondary-soft-fg border border-secondary/20',
      },
      {
        tone: 'success',
        variant: 'soft',
        className: 'bg-success-soft text-success-soft-fg border border-success/20',
      },
      {
        tone: 'warning',
        variant: 'soft',
        className: 'bg-warning-soft text-warning-soft-fg border border-warning/20',
      },
      {
        tone: 'danger',
        variant: 'soft',
        className: 'bg-danger-soft text-danger-soft-fg border border-danger/20',
      },

      // Solid variants
      {
        tone: 'neutral',
        variant: 'solid',
        className: 'bg-fg text-canvas',
      },
      {
        tone: 'primary',
        variant: 'solid',
        className: 'bg-primary text-primary-fg',
      },
      {
        tone: 'secondary',
        variant: 'solid',
        className: 'bg-secondary text-secondary-fg',
      },
      {
        tone: 'success',
        variant: 'solid',
        className: 'bg-success text-success-fg',
      },
      {
        tone: 'warning',
        variant: 'solid',
        className: 'bg-warning text-warning-fg',
      },
      {
        tone: 'danger',
        variant: 'solid',
        className: 'bg-danger text-danger-fg',
      },
    ],
    defaultVariants: {
      tone: 'neutral',
      variant: 'soft',
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
