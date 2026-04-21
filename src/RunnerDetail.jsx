/* global React */
const { useMemo } = React;

function RunnerDetail({ runner, timeOfDay, onEdit, onClose }) {
  const info = MM.milesAt(runner, timeOfDay);
  const finish = MM.timeAtMile(runner, 26.2);

  const rows = useMemo(() => {
    const r = [];
    for (let m = 1; m <= 26; m++) r.push(m);
    r.push(26.2);
    return r;
  }, []);

  let currentStatus = 'Not started';
  if (info) {
    if (info.status === 'finished') currentStatus = 'Finished';
    else if (info.status === 'running') currentStatus = `Mile ${info.middle.toFixed(1)} · ±${((info.best - info.worst) / 2).toFixed(1)} mi`;
    else currentStatus = `Starts in ${MM.fmtDuration(-info.elapsed)}`;
  }

  return React.createElement('div', { className: 'mobile-drawer-wrap' },
    React.createElement('div', { className: 'mobile-drawer-backdrop', onClick: onClose }),
    React.createElement('div', { className: 'runner-detail-panel' },
      // Header
      React.createElement('div', { className: 'runner-detail-header' },
        React.createElement('button', { className: 'runner-detail-back', onClick: onClose }, '‹ Back'),
        React.createElement('button', { className: 'runner-detail-edit', onClick: onEdit }, 'Edit')
      ),
      // Hero
      React.createElement('div', { className: 'runner-detail-hero' },
        React.createElement('div', { className: 'runner-detail-hero-left' },
          React.createElement('div', {
            className: 'runner-detail-swatch',
            style: { background: runner.color, boxShadow: `0 0 0 3px white, 0 0 0 4px ${runner.color}` }
          }),
          React.createElement('div', null,
            React.createElement('div', { className: 'runner-detail-name' }, runner.name || 'Runner'),
            React.createElement('div', { className: 'runner-detail-sub' }, `Wave ${runner.waveStart} · ${runner.bestTime}–${runner.worstTime}`)
          )
        ),
        // Now card
        info && info.status !== 'pre' && React.createElement('div', { className: 'runner-detail-now' },
          React.createElement('div', { className: 'runner-detail-now-block' },
            React.createElement('div', { className: 'runner-detail-now-label' }, 'Currently'),
            React.createElement('div', { className: 'runner-detail-now-val', style: { color: runner.color } },
              info.status === 'finished' ? 'Finished' : `Mile ${info.middle.toFixed(1)}`
            ),
            info.status === 'running' && React.createElement('div', { className: 'runner-detail-now-sub' },
              `±${((info.best - info.worst) / 2).toFixed(1)} mi uncertainty`
            )
          ),
          React.createElement('div', { className: 'runner-detail-now-divider' }),
          finish && React.createElement('div', { className: 'runner-detail-now-block' },
            React.createElement('div', { className: 'runner-detail-now-label' },
              info.status === 'finished' ? 'Finished' : 'Finish ETA'
            ),
            React.createElement('div', { className: 'runner-detail-now-val' },
              `${MM.fmtTimeOfDay(finish.earliest)}–${MM.fmtTimeOfDay(finish.latest)}`
            ),
            React.createElement('div', { className: 'runner-detail-now-sub' }, 'The Mall')
          )
        )
      ),
      // Mile list
      React.createElement('div', { className: 'runner-detail-section' }, 'Mile by mile'),
      React.createElement('div', { className: 'runner-detail-miles' },
        rows.map(m => {
          const t = MM.timeAtMile(runner, m);
          if (!t) return null;
          const current = timeOfDay >= t.earliest && timeOfDay <= t.latest;
          const landmark = LONDON_MARATHON_LANDMARKS[m] || LONDON_MARATHON_LANDMARKS[Math.round(m)] || '';
          return React.createElement('div', {
            key: m,
            className: 'runner-detail-mile' + (current ? ' current' : '')
          },
            React.createElement('div', {
              className: 'runner-detail-mile-num',
              style: { color: landmark ? 'var(--accent)' : undefined }
            }, m === 26.2 ? '26.2' : m),
            React.createElement('div', { className: 'runner-detail-mile-body' },
              landmark && React.createElement('div', { className: 'runner-detail-mile-landmark' }, landmark)
            ),
            React.createElement('div', {
              className: 'runner-detail-mile-range' + (current ? ' current' : ''),
              style: { color: current ? runner.color : undefined }
            }, `${MM.fmtTimeOfDay(t.earliest)}–${MM.fmtTimeOfDay(t.latest)}`)
          );
        })
      )
    )
  );
}

window.RunnerDetail = RunnerDetail;
