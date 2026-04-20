# London Marathon Prediction Map

A browser-based interactive map for tracking predicted runner positions during the London Marathon.

## What it does

Add runners with their wave start time and best/worst predicted finish times. Drag the time slider (or hit play) to scrub through race day and see where each runner is likely to be on the course, with an uncertainty band showing the range between best and worst pace scenarios.

- **Runner markers** — three dots per runner (best, expected, worst case), with hover tooltips showing elapsed time and time of day
- **Mile markers** — hover any mile dot to see predicted arrival windows for all runners
- **Mile-by-mile table** — full breakdown of predicted passing times, with the current window highlighted
- **Play mode** — animates through the race at 1 min/tick

## Running locally

Requires a local web server (Babel fetches JSX files via XHR).

```bash
python3 -m http.server 8765
```

Then open `http://localhost:8765` in your browser.

## Stack

- React 18 (UMD + Babel standalone — no build step)
- Leaflet 1.9.4
- CartoDB light tiles
- Route data from the official 2026 TCS London Marathon GPX
