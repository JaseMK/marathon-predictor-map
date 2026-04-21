# App Review — v0.3.0

A pass through every source file looking for bugs, sharp edges, and opportunities. Grouped by severity so you can cherry-pick what to tackle next.

---

## 🐞 Real bugs

### 1. `'partial'` runner status is mishandled in two places
`MM.milesAt` returns four statuses: `pre`, `running`, `partial` (best-case has finished, worst-case hasn't), `finished`.

- **`MobileSheet` (App.jsx:30–36)** — only branches on `finished`/`running`/`pre`. A `partial` runner falls through to the default `'Not started'` — wrong.
- **`RunnerDetail` (RunnerDetail.jsx:15–20)** — branches on `finished`/`running`, else treats it as `pre`, so a `partial` runner shows `"Starts in -Xs"` (negative duration).

`RunnerCard` handles it correctly (anything non-`pre`/non-`finished` shows mile text). Same pattern should be used in the two mobile components.

### 2. Play button drifts past the slider maximum
`App.jsx:105–111` stops the auto-play at `18*3600`, but `SLIDER_MAX = 17*3600` (App.jsx:161). Once past 17:00 the slider thumb clamps visually but `timeOfDay` keeps ticking. Should stop at `SLIDER_MAX`.

### 3. XSS in map tooltips
Runner tooltips are built by string interpolation into `innerHTML`:
- `MarathonMap.jsx:81` — `<span class="mtt-name">${r.name || 'Runner'}</span>`
- `MarathonMap.jsx:194` — name tag in the divIcon HTML
- `MarathonMap.jsx:204` — `<div class="rtt-name">${runner.name}</div>`

A runner named `<img src=x onerror=alert(1)>` would execute. Low real-world risk today (runner names come only from local state), but this becomes exploitable the moment you add share-via-URL (see §6.2). Fix by either:
- HTML-escaping the name before interpolation, or
- Using `L.tooltip({...}).setContent(domNode)` with a text node.

### 4. Default runner times inconsistent
- `SAMPLE_RUNNER` (App.jsx:6–13): `4:00:00` – `4:15:00`
- `addRunner` desktop (App.jsx:115–124): `4:00:00` – `4:45:00`
- `handleAddMobile` (App.jsx:128–137): `4:00:00` – `4:45:00`

Pick one. The 15-minute window on the sample is tight for a single-runner demo; 45 minutes is probably the right default everywhere.

### 5. Stale palette colours linger in localStorage
The palette shrank from 10 to 5 colours, but existing saved runners may still carry one of the old 5 hex codes. When the user opens the colour picker, none of the swatches match and they can't "return" to the current colour without being told. Two fixes:
- On load, normalise any runner whose `color` isn't in `MM.PALETTE` to the closest palette entry, **or**
- Show the runner's current colour as an extra swatch with a subtle "current" ring.

### 6. `mobile-drawer-panel` ignores iOS home-indicator inset
`.mobile-sheet` has `padding-bottom: env(safe-area-inset-bottom)` (styles.css:601) but the add/edit/detail drawers don't. On iPhones with a home bar, the Remove-runner button can sit under it. Add the same inset to `.mobile-drawer-panel`, `.runner-detail-panel`, `.mobile-overlay-panel`.

---

## 📱 Mobile / UX polish

### 1. Map tooltips don't play well with touch
`bindTooltip` is hover-oriented. On iOS it opens on first tap and dismisses on outside tap — fine for one runner, crowded for three. Consider:
- A bottom-sheet "tap to inspect" interaction for mile markers on mobile
- Hit-area inflation on the 8×8 mile dots (currently near-impossible to tap on the first try)

### 2. Tube station marker tap targets are 14×14
Below Apple's 44×44 recommendation. Wrap the roundel in a larger transparent hit area.

### 3. Hidden zoom controls leave no "recentre" option
You removed `.leaflet-control-zoom` on mobile (good call — it clashed with +Add). But now there's no way to fit-bounds back to the route after a user pinches-and-pans away. A single floating FAB ("recenter on route") would solve it without reintroducing the zoom stack.

### 4. No geolocation
This is arguably the killer feature for a *spectator* map: "show me the runners near me." Add a "locate me" button that drops a dot and pans. Leaflet's `map.locate({ setView: true })` is one call; the UX is the hard bit (permission prompts, stale-fix handling).

### 5. Mobile bottom-sheet height is fixed at 52%
Works, but feels stiff. A drag-to-resize grip would give the map more room when the user isn't interacting with the runner list. Medium effort — not urgent.

### 6. No "seek to now" button
If a spectator opens the app mid-race, they have to scrub manually. A "Now" button (only active between 09:00–17:00 UK time on race day) would land them at the current time of day.

### 7. Time scrub controls are cramped on mobile
`.btn-step` is 28×28 and `.time-bar` is crammed at the top. Works, but the ±5min buttons are small — bump them to 36×36 on mobile.

### 8. Mile tooltip empty-state is silent
If a mile has no runners with valid times (e.g., all runners have unparseable inputs), the tooltip renders just the header. Add "No runner data" in the empty case.

---

## ♿️ Accessibility

- **Buttons with unicode glyphs** (`‹`, `›`, `▶`, `❚❚`, `✕`, `🗑`) have no accessible name. Add `aria-label`.
- **Slider** has no `aria-valuetext` for time-of-day context.
- **Colour-only status indication**: "Next" cell in the mile table relies only on orange text. Add a bold weight or icon marker.
- **Contrast**: `--ink-3: #8a9098` on `--bg: #f7f6f2` is ~3.7:1 — below WCAG AA for small text. Used for labels and stats; tighten to something closer to `#6a7179`.

---

## 🧹 Code quality

### 1. Unused React hook imports
- `App.jsx:2` — `useRef`, `useCallback`, `useMemo` imported but never used.
- `RunnerCard.jsx:2` — `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback` all imported, none used.

Harmless, just noise.

### 2. Massive inline styles in `MarathonMap.jsx`
The runner divIcons (lines 193–200) and mile-marker labels (lines 61–64) build HTML via template strings with ~15 CSS props inline. Every tick recreates these strings for every runner. Move to a stylesheet with a few classes (`.mm-dot`, `.mm-dot-middle`, `.mm-name-tag`, `.mm-mile-num`) and pass dynamic colour via `style="--c:#xxx"` + `background: var(--c)`. Cleaner and measurably cheaper.

### 3. `.mm-label` class is load-bearing but undocumented
It exists only for the Start/Finish flag markers (MarathonMap.jsx:109, 114) and sets `position: relative !important` — the exact thing that broke mile markers earlier. A one-line comment in styles.css:404 explaining "do not use for new markers — use `.mile-marker-icon` instead" would prevent the same bug recurring.

### 4. No error boundary
A crash in `MarathonMap` (e.g., malformed GPX edit) takes down the whole app. Wrap the map in a `componentDidCatch`-style boundary that shows a fallback and a "reload" button.

### 5. Runner-marker re-render churn
Every `timeOfDay` tick does `runnerLayer.current.clearLayers()` then re-adds 3 markers × N runners × possibly a band polyline. Fine at 1 tick/sec + ≤5 runners, but if play speeds up or you expand to larger groups, consider updating marker positions in place instead of rebuilding.

### 6. CSS drawer duplication
`.mobile-drawer-panel`, `.runner-detail-panel`, `.mobile-overlay-panel` share ~80% of their rules. Extract a `.sheet-panel` base class.

### 7. No tests
`MM.parseTime`, `MM.milesAt`, `MM.timeAtMile` are pure functions begging for a tiny test file. Even just an inline `<script>` block in a `tests.html` with a handful of assertions would catch the `partial`-status regression and bound-parsing edge cases.

---

## ✨ Feature ideas (for future phases)

### 1. Geolocation ("runners near you")
Already mentioned above — this is the single biggest UX lift for a spectator map. Add a "find me" pin and a computed "closest runner is X min away" readout.

### 2. Shareable runner config via URL
Encode the runners array into a URL hash (`#r=...`). A spectator group could share one link. Needs the XSS fix in §1.3 first.

### 3. Wave-aware presets
London Marathon has a handful of named waves (Elite Women, Championship, Good For Age, Ballot, Mass waves W1–W9) with known start times. A dropdown of "Pick your wave" would beat typing `10:00`.

### 4. Pace model beyond constant-pace
Real marathoners slow down. A two-segment or piecewise model (e.g., negative split / positive split / "hit the wall at mile 20") would improve predictions late in the race. Needs research on whether the extra complexity is worth it vs. just asking for a wider best/worst window.

### 5. Live sync with Strava/official tracker
The TCS official tracker exposes live runner positions by bib number during the race. Fetching that and overlaying real positions alongside predicted ones would be a dramatic upgrade — but it's a heavier lift (CORS, auth, rate limits).

### 6. Nearby amenities overlay
Pubs / cafés / toilets near mile X is the real spectator question. Overpass API (already in use for tube stations) covers it.

### 7. Weather-aware pace adjustment
Hot/windy conditions shift the best/worst window. Could pull a Met Office forecast on race day and nudge the predictions.

### 8. Race day "autoplay to now" mode
Detects if it's race day + within race window, and auto-scrubs the slider in real time.

---

## 🧼 Housekeeping

- **Unused files in repo root**: `ios-frame.jsx`, `Marathon Spectator Map.html`, `Marathon Spectator Map - Mobile.html`, the GPX file, and `MOBILE_PLAN.md` are all design/plan artifacts. Either delete or move to an `archive/` folder so the root reflects only live code.
- **Hardcoded race date** (`'Sun 26 Apr 2026'` in App.jsx:186) needs manual update each year — consider driving it from a constant at the top of App.jsx.
- **Route coordinate precision** — the GPX-sampled points have 15+ decimal places; 6 is more than enough for sub-metre accuracy and shrinks `routeData.js` noticeably.
- **Weak runner IDs** — `Math.random().toString(36).slice(2, 8)` is fine locally; if you add share links, switch to something collision-safer.

---

## 🎯 Suggested next-phase priorities

If I were picking what to tackle first, in order:

1. **Fix the four real bugs** (§1.1–§1.4) — small, high-ROI.
2. **iOS home-indicator inset** on drawers (§1.6) — one-line CSS fix.
3. **XSS hardening** (§1.3) — unblocks share links.
4. **Geolocation "find me"** (§6.1) — the single most spectator-valuable feature.
5. **Shareable URL config** (§6.2) — makes the app useful for groups, not just the individual.
6. **Accessibility sweep** (§3) — cheap, and demonstrates care.
7. Everything else.
