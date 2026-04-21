# Mobile Responsive Plan

## Goal

Make the existing single-page app work well on phones and tablets without a separate URL or codebase. One `index.html`, one CSS file, one set of components — layout adapts via a CSS breakpoint.

---

## Current desktop layout (reference)

```
┌──────────────────────────────────────────┐
│  Header (full width, 56px)               │
├──────────────┬───────────────────────────┤
│  Sidebar     │  Map                      │
│  340px       │                           │
│  Runner      │                           │
│  cards with  │                           │
│  edit fields │                           │
├──────────────┴───────────────────────────┤
│  Mile table (collapsible, ~260px max)    │
└──────────────────────────────────────────┘
```

The desktop layout is kept exactly as-is. No regressions.

---

## Mobile target layout (≤ 768px)

```
┌──────────────────────┐
│  Header (slim, ~50px)│
│  title + date only   │
├──────────────────────┤
│                      │
│  Map (fills all      │  ← time-bar overlay floats top
│  remaining space)    │
│                      │
│  ┌────────────────┐  │  ← bottom sheet (runners)
│  │ grip           │  │
│  │ Runners · N    │  │
│  │ ─────────────  │  │
│  │ 🔵 Sam  Mi 8.2 │  │
│  │ 🔴 Priya Mi 12 │  │
│  └────────────────┘  │
└──────────────────────┘
```

The mile table is hidden on mobile. Runner editing moves into a slide-up edit drawer.

---

## Breakpoint

```css
@media (max-width: 768px) { ... }
```

Used throughout `styles.css`. No JS feature-detection needed.

---

## Step-by-step implementation plan

### Step 1 — Viewport meta tag
Add `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` to `index.html`. Currently missing — without this the browser renders at desktop width on mobile.

### Step 2 — CSS layout collapse
At ≤768px:
- Switch `.app` from a 2-column grid to a single-column flex column
- Hide `.sidebar` (runner editing moves elsewhere)
- Hide `.table-wrap` (mile table)
- Remove the fixed 340px sidebar column

### Step 3 — Slim mobile header
At ≤768px, simplify `.header`:
- Remove extra padding; reduce to ~50px
- Keep brand title and race date
- Add an "+ Add / Edit runners" icon button (rightmost) that opens the edit drawer (Step 6)

### Step 4 — Floating time bar
On mobile the time bar moves from below the map to an overlay at the top of the map area:
- `position: absolute; top: 12px; left: 12px; right: 12px`
- White card, `backdrop-filter: blur(12px)`, `border-radius: 12px`
- Same slider + play/step controls, slightly more compact
- Sits at `z-index: 400` (above tiles, below sheet)
- Map container becomes `position: relative`

### Step 5 — Runner bottom sheet
A persistent panel anchored to the bottom of the map area:
- `position: absolute; bottom: 0; left: 0; right: 0`
- Rounded top corners (20px), white background, subtle shadow
- Drag-grip visual at top (cosmetic only for v1 — no drag-to-expand logic yet)
- Fixed visible height showing the runner list: compact rows (colour swatch · name · current status)
- Status line = "Mile 8.2" / "Not started" / "Finished" (using existing `MM.milesAt`)
- Tap a runner row → opens runner detail drawer (Step 7)
- "+" button in sheet header → opens edit drawer for a new runner (Step 6)
- Sheet sits at `z-index: 500`

### Step 6 — Mobile edit drawer
When adding or editing a runner on mobile:
- Full-height slide-up panel (CSS `transform: translateY`, transition)
- Contains the same fields as the desktop RunnerCard (name, wave start, best/worst time, colour)
- "Done" and "Delete" actions at bottom
- This replaces the sidebar's always-visible runner cards on mobile
- Implemented as a new `MobileEditDrawer` component rendered conditionally inside `App`

### Step 7 — Runner detail drawer
Tapping a runner row in the bottom sheet opens a slide-up detail view:
- Hero card: runner name, colour, current position, finish ETA range (mirrors the Claude Design mobile detail screen)
- Scrollable mile-by-mile list below (same data as desktop table, single-runner view)
- "Edit" button top-right links to the edit drawer for that runner
- Back/close gesture or button dismisses it

### Step 8 — Touch map UX
Small adjustments for touch:
- Ensure `zoomControl` remains visible (already on) — reposition to bottom-right on mobile so it's not behind the floating time bar
- Increase marker hit area: middle dot `interactive: true` already set; best/worst dots can stay non-interactive on mobile to reduce accidental taps
- Leaflet tooltips on mobile: standard tap-to-open behaviour works out of the box

### Step 9 — Misc polish
- Hide Leaflet attribution control on mobile (clutters small screen) — keep for desktop
- Ensure `map.invalidateSize()` is called when the bottom sheet opens/closes (sheet height change affects map viewport)
- Test on 375px (iPhone SE), 390px (iPhone 16), 430px (iPhone 16 Plus), 768px (iPad mini)

---

## New files / changes summary

| File | Change |
|---|---|
| `index.html` | Add viewport meta tag |
| `src/styles.css` | Add `@media (max-width: 768px)` rules for all layout changes (Steps 2–5, 8–9) |
| `src/App.jsx` | Add mobile state (`editDrawerOpen`, `detailRunner`), render `MobileEditDrawer` and `RunnerDetail` conditionally, pass sheet-open state to map for `invalidateSize` |
| `src/MarathonMap.jsx` | Accept `mobileSheetOpen` prop, call `map.invalidateSize()` when it changes; reposition zoom control on mobile |
| `src/MobileEditDrawer.jsx` | **New** — slide-up drawer for add/edit on mobile |
| `src/RunnerDetail.jsx` | **New** — slide-up detail view for a single runner |

Desktop components (`RunnerCard.jsx`, `MileTable.jsx`) are unchanged.

---

## What is NOT in scope for this phase

- Drag-to-resize the bottom sheet (swipe up to expand, swipe down to collapse) — complex gesture handling, low priority
- Push notifications / background tracking
- The tab bar shown in the Claude Design mockup — the header + bottom sheet covers the same navigation needs more simply
- Any change to the desktop layout

---

## Open questions for review

1. **Bottom sheet height** — The design shows it at ~52% of the screen. A fixed compact height (~180px, showing 2–3 runners + header) with internal scroll feels more map-friendly. Preference? - yes fixed and internal scroll is better
2. **Edit drawer entry point** — Tapping a runner opens detail first, then edit from there. Or: long-press / swipe-left on a runner row goes straight to edit. Which feels right? - the first, open detail first then edit from there
3. **Mile table on mobile** — Fully hidden, or accessible via a tab in the bottom sheet? The Claude Design mockup doesn't include it but it's useful data. - hidden by default but accessible via the bottom sheet

