/* global React */
const { useMemo } = React;

function MileTable({ runners, timeOfDay }) {
  const rows = useMemo(() => {
    const out = [];
    for (let m = 1; m <= 26; m++) out.push(m);
    out.push(26.2);
    return out;
  }, []);

  return React.createElement('div', { className: 'table-wrap' },
    React.createElement('div', { className: 'table-head' },
      React.createElement('div', { className: 'table-title' }, 'Mile-by-mile predictions'),
      React.createElement('div', { className: 'table-legend' }, 'Shows earliest → latest time-of-day a runner is predicted to pass each mile')
    ),
    React.createElement('table', { className: 'mile-table' },
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', { className: 'mile-col' }, 'Mi'),
          React.createElement('th', { className: 'landmark-col' }, 'Landmark'),
          ...runners.map((r, i) => React.createElement('th', { key: r.id, className: 'runner-col' },
            React.createElement('span', {
              style: {
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: r.color || MM.colorFor(i), marginRight: 6, verticalAlign: 'middle'
              }
            }),
            r.name || `Runner ${i+1}`
          ))
        )
      ),
      React.createElement('tbody', null,
        rows.map((mile) => {
          const landmark = LONDON_MARATHON_LANDMARKS[mile] || LONDON_MARATHON_LANDMARKS[Math.round(mile)] || '';
          const isLandmark = !!LONDON_MARATHON_LANDMARKS[mile];
          return React.createElement('tr', {
            key: mile,
            className: isLandmark ? 'landmark' : ''
          },
            React.createElement('td', { className: 'mile-col' }, mile === 26.2 ? '26.2' : mile),
            React.createElement('td', { className: 'landmark-col' }, isLandmark ? landmark : ''),
            ...runners.map((r, i) => {
              const t = MM.timeAtMile(r, mile);
              if (!t) return React.createElement('td', { key: r.id, className: 'runner-col' }, '—');
              const passed = timeOfDay > t.latest;
              const next = timeOfDay >= t.earliest && timeOfDay <= t.latest;
              let cls = 'time-cell';
              if (passed) cls += ' passed';
              else if (next) cls += ' next';
              return React.createElement('td', { key: r.id, className: 'runner-col' },
                React.createElement('div', { className: cls },
                  React.createElement('span', { className: 'time-range' },
                    MM.fmtTimeOfDay(t.earliest) + '–' + MM.fmtTimeOfDay(t.latest)
                  )
                )
              );
            })
          );
        })
      )
    )
  );
}

window.MileTable = MileTable;
