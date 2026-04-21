/* global React, ReactDOM, L */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ============ Runner card ============
function RunnerCard({ runner, index, timeOfDay, onUpdate, onRemove }) {
  const color = runner.color || MM.colorFor(index);
  const info = MM.milesAt(runner, timeOfDay);

  let nowText = '—', nowClass = '';
  if (!info) {
    nowText = 'Enter times below';
    nowClass = 'not-started';
  } else if (info.status === 'pre') {
    nowText = 'Starts in ' + MM.fmtDuration(-info.elapsed);
    nowClass = 'not-started';
  } else if (info.status === 'finished') {
    nowText = 'Finished';
    nowClass = 'finished';
  } else {
    nowText = 'Mile ' + info.middle.toFixed(1) + ' · ±' + ((info.best - info.worst)/2).toFixed(1);
  }

  return React.createElement('div', { className: 'runner-card' },
    React.createElement('div', { className: 'runner-head' },
      React.createElement('div', {
        className: 'runner-swatch',
        style: { color: color, background: color }
      }),
      React.createElement('input', {
        className: 'runner-name',
        value: runner.name,
        placeholder: 'Runner name',
        onChange: (e) => onUpdate({ ...runner, name: e.target.value })
      })
    ),
    React.createElement('div', { className: 'runner-fields' },
      React.createElement('div', { className: 'field' },
        React.createElement('label', null, 'Wave start'),
        React.createElement('input', {
          type: 'text',
          value: runner.waveStart,
          placeholder: '10:00',
          onChange: (e) => onUpdate({ ...runner, waveStart: e.target.value })
        })
      ),
      React.createElement('div', { className: 'field' },
        React.createElement('label', null, 'Best time'),
        React.createElement('input', {
          type: 'text',
          value: runner.bestTime,
          placeholder: '3:45:00',
          onChange: (e) => onUpdate({ ...runner, bestTime: e.target.value })
        })
      ),
      React.createElement('div', { className: 'field' },
        React.createElement('label', null, 'Worst time'),
        React.createElement('input', {
          type: 'text',
          value: runner.worstTime,
          placeholder: '4:30:00',
          onChange: (e) => onUpdate({ ...runner, worstTime: e.target.value })
        })
      ),
      React.createElement('div', { className: 'field full' },
        React.createElement('label', null, 'Colour'),
        React.createElement('div', { className: 'colour-picker' },
          MM.PALETTE.map((c) =>
            React.createElement('button', {
              key: c,
              onClick: () => onUpdate({ ...runner, color: c }),
              style: {
                width: 18, height: 18, borderRadius: '50%',
                background: c,
                border: runner.color === c ? '2px solid var(--ink)' : '1px solid var(--line-2)',
                cursor: 'pointer', padding: 0, flexShrink: 0
              },
              'aria-label': 'Colour ' + c
            })
          )
        )
      )
    ),
    React.createElement('div', { className: 'runner-now ' + nowClass }, nowText,
      React.createElement('button', {
        className: 'btn-link danger',
        onClick: () => onRemove(runner.id),
        title: 'Remove runner'
      }, '🗑 Remove')
    )
  );
}

window.RunnerCard = RunnerCard;
