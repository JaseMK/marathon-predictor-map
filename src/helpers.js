/* global React, L */
// Helpers — time formatting, parsing, runner calculations

window.MM = window.MM || {};

// Parse "H:MM:SS" or "HH:MM" into total seconds. Returns null if invalid.
MM.parseTime = function(str) {
  if (!str) return null;
  const s = String(str).trim();
  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const sec = m[3] ? parseInt(m[3], 10) : 0;
  if (min > 59 || sec > 59) return null;
  return h * 3600 + min * 60 + sec;
};

// Format total seconds to "H:MM:SS"
MM.fmtDuration = function(totalSec) {
  if (totalSec == null || !isFinite(totalSec)) return '—';
  const sign = totalSec < 0 ? '-' : '';
  totalSec = Math.abs(Math.round(totalSec));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return sign + h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
};

// Format total seconds (since midnight) to "HH:MM" or "HH:MM:SS"
MM.fmtTimeOfDay = function(totalSec, withSec) {
  totalSec = Math.max(0, Math.round(totalSec));
  const h = Math.floor(totalSec / 3600) % 24;
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (withSec) return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
};

// Compute a runner's mile position at a given time-of-day.
// Constant pace model: mile = elapsed / predictedTime * 26.2
// Returns { best, middle, worst } mile values (clamped 0..26.2), or null if not started.
MM.milesAt = function(runner, timeOfDaySec) {
  const start = MM.parseTime(runner.waveStart);
  const best = MM.parseTime(runner.bestTime);   // fastest → largest mile
  const worst = MM.parseTime(runner.worstTime); // slowest → smallest mile
  if (start == null || best == null || worst == null) return null;
  const elapsed = timeOfDaySec - start;
  if (elapsed < 0) return { status: 'pre', elapsed };
  const TOTAL = 26.2;
  const miBest = Math.min(TOTAL, Math.max(0, (elapsed / best) * TOTAL));
  const miWorst = Math.min(TOTAL, Math.max(0, (elapsed / worst) * TOTAL));
  const midTime = (best + worst) / 2;
  const miMid = Math.min(TOTAL, Math.max(0, (elapsed / midTime) * TOTAL));
  const allDone = elapsed >= worst;
  const anyDone = elapsed >= best;
  return {
    status: allDone ? 'finished' : (anyDone ? 'partial' : 'running'),
    elapsed,
    best: miBest,
    middle: miMid,
    worst: miWorst
  };
};

// Time-of-day range when a runner passes a given mile (best→worst predicted windows)
MM.timeAtMile = function(runner, mile) {
  const start = MM.parseTime(runner.waveStart);
  const best = MM.parseTime(runner.bestTime);
  const worst = MM.parseTime(runner.worstTime);
  if (start == null || best == null || worst == null) return null;
  const TOTAL = 26.2;
  const tBest = start + (mile / TOTAL) * best;    // earliest arrival
  const tWorst = start + (mile / TOTAL) * worst;  // latest arrival
  return { earliest: tBest, latest: tWorst };
};

// Default runner palette — accessible, distinguishable
MM.PALETTE = [
  '#a855f7', // purple
  '#ef4444', // red
  '#10b981', // emerald
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#ec4899', // pink
  '#14b8a6', // teal
  '#eab308', // yellow
  '#8b5cf6', // violet
  '#06b6d4'  // cyan
];
MM.colorFor = function(index) {
  return MM.PALETTE[index % MM.PALETTE.length];
};
