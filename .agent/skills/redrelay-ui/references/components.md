# Shared UI kit — `frontend/src/shared/ui`

Project-agnostic primitives. They know nothing about blood, donors, or hospitals, so the whole folder
can be copied into the next project. RedRelay-specific composites (status strip, request card, donor map)
live in `features/*/components`.

## Conventions

- One component per folder: `button/Button.tsx`, `button/button.variants.ts`, `button/index.ts`.
- Variants with `class-variance-authority`; merge consumer classes with `cn()` from `shared/lib/cn.ts`
  (`clsx` + `tailwind-merge`). The consumer may pass `className` for **layout only** (width, grid placement), never colors or radius.
- Forward refs and spread native props (`React.ComponentProps<'button'>`), so primitives work with
  react-hook-form and Radix.
- No outer margin. No fixed width unless it is the point of the component.
- Headless behavior (dialog, popover, menu, tabs, tooltip) comes from **Radix UI primitives** (free, accessible);
  we only style them.

## Catalog

| Component | Variants | Notes |
|---|---|---|
| `Button` | `variant`: primary, secondary, outline, ghost, danger · `size`: sm, md, lg · `loading` | `lg` = 44px donor CTA |
| `IconButton` | same variants · square | requires `aria-label` |
| `Input`, `Textarea` | `size`: sm, md · `invalid` | `border-border-strong`, focus outline |
| `Select` | `size`: sm, md · `multiple` · `searchable` · `clearable` · `invalid` | custom dropdown (no `<select>` tag), single & multi with chips, real-time search, keyboard navigation |
| `DatePicker` | `size`: sm, md · `clearable` · `showPresets` · `minDate` · `maxDate` | custom calendar popover, quick presets (Today, Tomorrow, +3d, +1w), month nav |
| `TimePicker` | `size`: sm, md · `format`: 12h, 24h · `minuteStep` · `clearable` · `showPresets` | custom time columns (hrs, mins, secs, AM/PM), quick presets (Now, 09:00, 12:00, 18:00) |
| `Field` | wraps label + control + hint + error | used by every form field |
| `Checkbox`, `Radio`, `Switch` | — | switch thumb is the one `rounded-full` control |
| `Badge` | `tone`: neutral, primary, secondary, success, warning, danger · `variant`: soft, solid | text always present |
| `Card` | `padding`: none, sm (`p-3`), md (`p-4`) | `bg-surface border border-border rounded-md` |
| `Panel` | header slot + body | header `px-3 py-2 border-b` |
| `Table` | `density`: compact, default | sticky `bg-surface-muted` header |
| `Dialog`, `Drawer` | `size`: sm, md, lg | bordered surface on `bg-overlay`, no shadow |
| `Popover`, `DropdownMenu`, `Tooltip` | — | bordered surface |
| `Tabs` | `variant`: line, segmented | |
| `Toast` | `tone` | top-right desktop, top on mobile |
| `Skeleton` | `shape`: line, block | `bg-surface-muted` pulse (respects reduced motion) |
| `EmptyState` | `title`, `description`, `action` | |
| `ErrorState` | `message`, `onRetry` | |
| `Spinner` | `size` | buttons and inline only, not lists |
| `Avatar` | `size` | `rounded-full` |
| `Stat` | `label`, `value`, `trend?` | `font-display tabular-nums` value |
| `PageHeader` | `title`, `actions` | one `h1` per page |
| `Stack`, `Cluster`, `Grid` | `gap` | layout helpers so pages don't repeat flex classes |

## Example: Button variants

```ts
// shared/ui/button/button.variants.ts
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ' +
    'disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
        secondary: 'bg-secondary text-secondary-fg hover:bg-secondary-hover',
        outline: 'border border-border-strong bg-surface text-fg hover:bg-surface-muted',
        ghost: 'text-fg hover:bg-surface-muted',
        danger: 'bg-danger text-danger-fg hover:opacity-90',
      },
      size: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-11 px-4 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
```

## Adding a primitive

1. Confirm it is generic (would a todo app or a shop use it?). If not, it is a feature component.
2. Create the folder with component, variants, index. Tokens only, `rounded-md`, no shadow, no margin.
3. Export from `shared/ui/index.ts`.
4. Add a row to this catalog.
