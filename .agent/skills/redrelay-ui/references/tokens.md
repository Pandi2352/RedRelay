# Token reference

Source of truth: `frontend/src/shared/styles/theme.css` (template in [theme.css](theme.css)).

## Color — light / dark

| Token | Utility | Light | Dark | Use |
|---|---|---|---|---|
| canvas | `bg-canvas` | `#F5F7F9` | `#0F151B` | Page background |
| surface | `bg-surface` | `#FFFFFF` | `#161E26` | Panels, cards, modals, inputs |
| surface-muted | `bg-surface-muted` | `#EEF1F4` | `#1D2731` | Table header, skeleton, inset areas, hover rows |
| overlay | `bg-overlay` | 50% ink | 65% ink | Modal / drawer backdrop |
| fg | `text-fg` | `#16202A` | `#E7ECF1` | Body text, headings |
| fg-muted | `text-fg-muted` | `#4E5B69` | `#A3AFBC` | Secondary text, labels |
| fg-subtle | `text-fg-subtle` | `#6B7785` | `#7F8C9A` | Timestamps, placeholders (not body copy) |
| border | `border-border` | `#D9DEE4` | `#2A3541` | Dividers, card outlines |
| border-strong | `border-border-strong` | `#8A96A3` | `#6E7B89` | Input outlines, selected edges |
| primary | `bg-primary` / `text-primary-fg` | `#A8122C` | `#C93441` | The main action, urgency, confirmed units |
| secondary | `bg-secondary` / `text-secondary-fg` | `#1E5373` | `#6CA6CC` | Secondary actions, nav active, "on the way" |
| success | `bg-success-soft text-success-soft-fg` | `#1C7547` | `#4CB782` | Fulfilled, donation done |
| warning | `bg-warning-soft text-warning-soft-fg` | `#9A5B00` | `#E0A040` | Expiring soon, reconnecting |
| danger | `bg-danger text-danger-fg` | `#B42318` | `#F0675C` | Destructive actions, errors |
| info | = secondary | | | Neutral notices |

Every color has `-hover` (primary, secondary), `-fg` (text on solid), `-soft` (tinted background) and
`-soft-fg` (text on the tint). Pick the pair, never mix one token's background with another's text.

Primary and danger are both red by nature. Keep them apart by role: **primary** = the action we want
(post, accept); **danger** = the action that destroys (cancel request, remove staff), always behind a confirm.

## Changing the brand later

1. Edit hex values in `:root` and `.dark` only.
2. Re-check contrast for each `X` / `X-fg` and `X-soft` / `X-soft-fg` pair (≥ 4.5:1).
3. Nothing else changes. To start a new project from this system, copy `shared/styles` and `shared/ui`, then do step 1.

## Typography

| Utility | Size / line | Font | Use |
|---|---|---|---|
| `text-2xl font-display font-semibold` | 31 / 36 | Archivo | Page title (one per page) |
| `text-xl font-display font-semibold` | 25 / 32 | Archivo | Big numbers: units, blood group |
| `text-lg font-display font-medium` | 20 / 28 | Archivo | Section and card titles |
| `text-base` | 16 / 24 | Public Sans | Donor mobile body, long-form |
| `text-sm` | 14 / 20 | Public Sans | Default UI text, tables, inputs |
| `text-xs` | 12 / 16 | Public Sans | Meta, timestamps, helper text |

Weights: 400 body, 500 labels and buttons, 600 headings. Live numbers: `tabular-nums`.
Install: `npm i @fontsource-variable/public-sans @fontsource-variable/archivo`.

## Spacing

| Purpose | Value |
|---|---|
| Inside controls | `px-3` (12px), height `h-9` (36px) |
| Panel body | `p-3` dense / `p-4` forms |
| Between siblings | `gap-2` (8px) / `gap-3` (12px) |
| Between sections | `gap-4` (16px), up to `gap-6` on ≥ `lg` |
| Page gutter | `px-4 md:px-6` |

## Radius and elevation

- `rounded-md` (6px): every box.
- `rounded-full`: avatars, status dots, switch thumb.
- No shadows. Hierarchy = `canvas` → `surface` (+ `border`) → `surface-muted` for insets.
  Overlays add `bg-overlay` behind a bordered `surface`.
