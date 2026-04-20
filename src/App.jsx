/* global React, ReactDOM, L */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

function newRunnerId() { return 'r_' + Math.random().toString(36).slice(2, 8); }

const SAMPLE_RUNNER = {
  id: 'r_sample',
  name: 'Sam',
  waveStart: '10:00',
  bestTime: '3:45:00',
  worstTime: '4:30:00',
  color: MM.PALETTE[0]
};

function App() {
  const [runners, setRunners] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_runners');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [SAMPLE_RUNNER];
  });
  const [timeOfDay, setTimeOfDay] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_time');
      if (saved) return parseInt(saved, 10);
    } catch(e) {}
    return 10 * 3600 + 45 * 60;
  });
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('mm_runners', JSON.stringify(runners)); } catch(e) {}
  }, [runners]);
  useEffect(() => {
    try { localStorage.setItem('mm_time', String(timeOfDay)); } catch(e) {}
  }, [timeOfDay]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setTimeOfDay(t => {
        const next = t + 60;
        if (next > 18 * 3600) { setPlaying(false); return 18*3600; }
        return next;
      });
    }, 80);
    return () => clearInterval(id);
  }, [playing]);

  const addRunner = () => {
    setRunners(rs => [...rs, {
      id: newRunnerId(),
      name: 'Runner ' + (rs.length + 1),
      waveStart: '10:00',
      bestTime: '4:00:00',
      worstTime: '4:45:00',
      color: MM.colorFor(rs.length)
    }]);
  };
  const updateRunner = r => setRunners(rs => rs.map(x => x.id === r.id ? r : x));
  const removeRunner = id => setRunners(rs => rs.filter(x => x.id !== id));

  const SLIDER_MIN = 8 * 3600;
  const SLIDER_MAX = 17 * 3600;

  return React.createElement('div', { className: 'app' },
    // Header
    React.createElement('div', { className: 'header' },
      React.createElement('div', { className: 'brand' },
        React.createElement('div', { className: 'brand-mark' }, 'M'),
        React.createElement('div', null,
          'Prediction Map',
          React.createElement('span', { className: 'brand-sub' }, ' · London Marathon')
        )
      ),
      React.createElement('div', { className: 'race-date' },
        React.createElement('span', { className: 'dot' }),
        'Sun 26 Apr 2026'
      )
    ),
    // Sidebar
    React.createElement('div', { className: 'sidebar' },
      React.createElement('div', { className: 'sidebar-header' },
        React.createElement('div', { className: 'sidebar-title' }, 'Runners · ' + runners.length),
        React.createElement('button', { className: 'btn-add', onClick: addRunner }, '+ Add runner')
      ),
      React.createElement('div', { className: 'runners' },
        runners.length === 0
          ? React.createElement('div', { className: 'empty-state' },
              'No runners yet.', React.createElement('br'),
              'Add one to start tracking.')
          : runners.map((r, i) => React.createElement(RunnerCard, {
              key: r.id, runner: r, index: i, timeOfDay,
              onUpdate: updateRunner, onRemove: removeRunner
            }))
      )
    ),
    // Main map + time bar
    React.createElement('div', { className: 'main' },
      React.createElement('div', { className: 'map-wrap' },
        React.createElement(MarathonMap, { runners, timeOfDay })
      ),
      React.createElement('div', { className: 'time-bar' },
        React.createElement('div', { className: 'time-display' },
          React.createElement('div', { className: 'time-label' }, 'Time of day'),
          React.createElement('div', { className: 'time-value' }, MM.fmtTimeOfDay(timeOfDay))
        ),
        React.createElement('div', { className: 'time-slider-wrap' },
          React.createElement('div', { className: 'time-ticks' },
            [8,9,10,11,12,13,14,15,16,17].map(h => {
              const pct = ((h*3600 - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
              return React.createElement('div', {
                key: h, className: 'time-tick', style: { left: pct + '%' }
              }, String(h).padStart(2,'0') + ':00');
            })
          ),
          React.createElement('input', {
            type: 'range',
            className: 'time-slider',
            min: SLIDER_MIN, max: SLIDER_MAX, step: 60,
            value: timeOfDay,
            onChange: e => setTimeOfDay(parseInt(e.target.value, 10))
          })
        ),
        React.createElement('div', { className: 'time-controls' },
          React.createElement('button', {
            className: 'btn-step',
            title: 'Back 5 min',
            onClick: () => setTimeOfDay(t => Math.max(SLIDER_MIN, t - 300))
          }, '‹'),
          React.createElement('button', {
            className: 'btn-step play',
            onClick: () => setPlaying(p => !p)
          }, playing ? '❚❚' : '▶'),
          React.createElement('button', {
            className: 'btn-step',
            title: 'Forward 5 min',
            onClick: () => setTimeOfDay(t => Math.min(SLIDER_MAX, t + 300))
          }, '›')
        )
      )
    ),
    // Mile table
    React.createElement(MileTable, { runners, timeOfDay })
  );
}

window.App = App;
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
