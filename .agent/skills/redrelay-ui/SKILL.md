---
name: redrelay-ui
description: Visual design and UI rules for RedRelay (and future projects that reuse its design system). Use whenever building or changing a screen, component, layout, color, font, spacing, or copy in the frontend. Enforces rounded-md corners, no shadows, dense spacing, and token-only colors and fonts.
---

# RedRelay UI

You are the design lead for RedRelay, an emergency blood donor network. Two audiences shape every screen:

- **Hospital staff** on desktops, watching a live board of requests during a shift. They need density,
  scannability, and calm — nothing decorative competes with a request that needs 2 units of O− now.
- **Donors** on phones, often woken by an alert. They need one clear decision (accept / decline),
  the distance, and directions. Large tap targets, few words.

The primary job of the UI: **get the right donor moving fast, and show staff exactly where each request stands.**

## Hard rules (the brief wins over any general design taste)

| Rule | Do | Don't |
|---|---|---|
| Radius | `rounded-md` on every box: buttons, inputs, cards, menus, modals, badges, images | `rounded-lg/xl/2xl/3xl`, `rounded-none` on boxes, mixed radii |
| Radius exception | `rounded-full` only for avatars, status dots, switch thumb | pill-shaped buttons |
| Shadows | Separate surfaces with `border border-border` or a background step (`bg-surface` on `bg-canvas`) | any `shadow-*`, `drop-shadow-*`, glow, blur halos |
| Padding | Outer layout owns the gutter; components ship with **no outer margin** and minimal padding | padding on a wrapper *and* its child for the same edge; `p-8`+ inside panels |
| Color | Semantic tokens only: `bg-primary`, `text-fg-muted`, `border-border`, `bg-danger-soft` | hex values, `bg-red-600`, inline `style={{color}}` |
| Font | `font-sans` (body) and `font-display` (headings, big numbers) | importing a font in a component, ad-hoc `font-[...]` |
| Elevation for overlays | Modal/popover = `bg-surface border border-border` + dim backdrop (`bg-overlay`) | shadow under the popover |

The theme in [references/theme.css](references/theme.css) **removes** the shadow utilities, every radius
except `md` and `full`, and the default Tailwind palette. Breaking these rules fails the build, which is intended.

> The general "AI design tells" list warns against one radius on everything. Here a single radius is a
> deliberate brand decision from the client — follow it, and create hierarchy through type, color, and
> spacing instead.

## Tokens (change the brand in one place)

All colors and fonts are CSS variables in `frontend/src/shared/styles/theme.css`. To rebrand RedRelay
or reuse the system in another project, edit only the `:root` and `.dark` blocks. Components never change.

Full token tables (light + dark), type scale, and spacing scale: [references/tokens.md](references/tokens.md).

Core roles:

- `primary` — blood red. The single most important action on a screen (Post request, Accept) and urgency.
- `secondary` — venous blue. Navigation, secondary actions, "donor on the way" state.
- `canvas` / `surface` / `surface-muted` — page background, panels, inset areas.
- `fg` / `fg-muted` / `fg-subtle` — text hierarchy.
- `border` / `border-strong` — dividers and control outlines.
- `success`, `warning`, `danger`, `info` — status, each with a `-soft` background and `-fg` text pair.

Each color token has a matching `-fg` (text on top of it) so contrast is solved once, in the theme.

## Typography

- **Public Sans** (`font-sans`) — body, labels, tables, forms. Civic, highly legible at small sizes, free.
- **Archivo** (`font-display`) — page titles, card titles, and big operational numbers (units needed,
  minutes elapsed). Use its semi-condensed width for numbers so they stay large without wrapping.
- Numbers that update live use `tabular-nums` so they do not jitter.
- Scale (1.25 ratio): `text-xs 12` · `text-sm 14` (default UI) · `text-base 16` · `text-lg 20` · `text-xl 25` · `text-2xl 31`.
- Sentence case everywhere. No all-caps labels, no eyebrow text above headings, no single highlighted word in a heading.
- Line length under 75 characters for any paragraph.

Fonts are self-hosted via `@fontsource-variable/*` (free, no Google request at runtime), imported once in
`frontend/src/shared/styles/fonts.ts`.

## Spacing (dense by default)

4px base. Pick from this short list; anything else needs a reason.

| Use | Class |
|---|---|
| Page gutter (layout only) | `px-4 md:px-6`, `py-4` |
| Panel / card body | `p-3` (dense lists) or `p-4` (forms, detail) |
| Gap between items in a panel | `gap-2` or `gap-3` |
| Gap between panels / sections | `gap-4` (max `gap-6` on wide desktop) |
| Control (button, input) | `h-9 px-3` (default), `h-8 px-2.5` (sm), `h-11 px-4` (donor mobile CTA) |
| Table cell | `px-3 py-2` |

Rules: a component never sets its own outer margin (`m-*`); the parent places it with `gap`.
A card inside a padded panel has no extra padding wrapper. Prefer `gap` over `space-y-*`.

## Components come from the shared kit

Use and extend `frontend/src/shared/ui/*` (catalog and variant API in
[references/components.md](references/components.md)). Never restyle a primitive at the call site with a
pile of classes — add a variant to the primitive. Variants are defined with `cva`, merged with the `cn()` helper.

## Signature element — spend boldness here only

The **request status strip**: every request card and the request detail header shows units as a row of
segments (confirmed = filled `primary`, en route = `secondary`, open = outlined), with the blood group in
large `font-display` beside it and minutes since posted in `tabular-nums`. That is the one memorable
thing. Everything around it stays quiet: borders, neutral surfaces, no decoration.

Motion: only when a donor's state changes (segment fills, a new row slides in on the live board).
150–200ms, `ease-out`, and disabled under `prefers-reduced-motion`.

## States are part of the design

Every data view ships with: loading (skeleton matching the final layout, `bg-surface-muted`, no spinner
for lists), empty (one sentence on what will appear + the action to make it appear), error (what failed +
retry button), and offline/reconnecting (thin `warning` bar at top for socket loss).

## Writing in the interface

- Name things as users do: "Blood request", "Donors on the way", "Notification settings" — not "Dispatch wave job".
- Buttons say what happens: "Post request", "Accept and get directions", "Mark donation complete".
  The same verb carries into the toast: "Request posted".
- Errors explain and direct, without apology: "Location is off. Turn it on to see requests near you."
- Empty states invite action: "No open requests. New requests from your hospital will appear here."
- Sentence case, plain verbs, no filler, no exclamation marks in alerts.

## Accessibility floor (never announced, always met)

- Contrast ≥ 4.5:1 for text, 3:1 for UI borders that carry meaning. Tokens are pre-checked; do not
  put `fg-subtle` on `surface-muted` for body text.
- Visible focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`
  (built into primitives).
- Tap targets ≥ 44px on donor mobile screens.
- Color is never the only signal — status badges carry text, segments carry an aria-label.
- Responsive from 360px wide; the hospital board collapses to a single column under `md`.

## Process for any new screen

1. State the screen's audience and its one primary action.
2. Sketch the layout as a short ASCII wireframe; mark where the primary action and the status strip sit.
3. List which shared primitives it uses; if one is missing, add it to `shared/ui` first (see `reusable-code` skill).
4. Build with tokens only. Check the hard-rules table.
5. Review: light + dark, 360px + 1280px, keyboard-only pass, all four states. Remove one decoration before calling it done.
