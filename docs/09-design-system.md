# 09 Design system

The rules agents follow live in `.claude/skills/redrelay-ui/` (skill + `references/theme.css`,
`tokens.md`, `components.md`). This page is the human summary.

## Direction

RedRelay is an operations tool used under time pressure. The look is **calm, clinical, and dense**:
cool neutral surfaces, thin borders, one strong red reserved for the action that matters and for urgency,
a venous blue for movement ("on the way") and navigation.

| | |
|---|---|
| Primary | `#A8122C` blood red (dark mode `#C93441`) |
| Secondary | `#1E5373` venous blue (dark mode `#6CA6CC`) |
| Neutrals | canvas `#F5F7F9`, surface `#FFFFFF`, ink `#16202A` |
| Fonts | Archivo (display, big numbers) · Public Sans (UI and body) |
| Radius | `rounded-md` (6px) everywhere; `rounded-full` only for avatars, dots, switch thumb |
| Shadows | none — borders and background steps instead |
| Spacing | 4px base, dense: panels `p-3`/`p-4`, gaps `gap-2`/`gap-3`, controls `h-9 px-3` |

## Signature element

The request status strip: unit segments (confirmed / en route / open), the blood group set large in
Archivo, and minutes since posting in tabular numbers. It appears on every request card and detail header.

## Changing colors or fonts later

Edit `frontend/src/shared/styles/theme.css` — the `:root` (light) and `.dark` blocks hold every hex value.
Components only use semantic utilities (`bg-primary`, `text-fg-muted`), so nothing else changes.
Swap fonts by changing the two `--font-*` lines and the `@fontsource` imports in `fonts.ts`.

## Enforcement

The theme deletes shadow utilities, every radius except `md`/`full`, and Tailwind's default palette, so
violations fail to compile. The `ui-reviewer` subagent (Antigravity: `/agent-ui-reviewer`) checks the rest.
