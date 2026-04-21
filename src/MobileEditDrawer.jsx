/* global React */
const { useState, useEffect } = React;

function MobileEditDrawer({ runner, onSave, onDelete, onClose }) {
  const [draft, setDraft] = useState(runner);
  useEffect(() => { setDraft(runner); }, [runner]);
  const upd = patch => setDraft(d => ({ ...d, ...patch }));
  const isExisting = !!runner._exists;

  return React.createElement('div', { className: 'mobile-drawer-wrap' },
    React.createElement('div', { className: 'mobile-drawer-backdrop', onClick: onClose }),
    React.createElement('div', { className: 'mobile-drawer-panel' },
      React.createElement('div', { className: 'mobile-drawer-grip' }),
      React.createElement('div', { className: 'mobile-drawer-header' },
        React.createElement('button', { className: 'mobile-drawer-cancel', onClick: onClose }, 'Cancel'),
        React.createElement('div', { className: 'mobile-drawer-title' }, isExisting ? 'Edit Runner' : 'Add Runner'),
        React.createElement('button', { className: 'mobile-drawer-done', onClick: () => onSave(draft) }, 'Done')
      ),
      React.createElement('div', { className: 'mobile-drawer-body' },
        // Name row
        React.createElement('div', { className: 'mobile-field-group' },
          React.createElement('div', { className: 'mobile-field-row' },
            React.createElement('div', { className: 'runner-swatch', style: { color: draft.color, background: draft.color } }),
            React.createElement('input', {
              className: 'runner-name',
              value: draft.name,
              placeholder: 'Runner name',
              onChange: e => upd({ name: e.target.value })
            })
          )
        ),
        // Time fields
        React.createElement('div', { className: 'mobile-field-group' },
          React.createElement('div', { className: 'field' },
            React.createElement('label', null, 'Wave start'),
            React.createElement('input', { type: 'text', value: draft.waveStart, placeholder: '10:00', onChange: e => upd({ waveStart: e.target.value }) })
          ),
          React.createElement('div', { className: 'field' },
            React.createElement('label', null, 'Best time'),
            React.createElement('input', { type: 'text', value: draft.bestTime, placeholder: '3:45:00', onChange: e => upd({ bestTime: e.target.value }) })
          ),
          React.createElement('div', { className: 'field' },
            React.createElement('label', null, 'Worst time'),
            React.createElement('input', { type: 'text', value: draft.worstTime, placeholder: '4:30:00', onChange: e => upd({ worstTime: e.target.value }) })
          )
        ),
        // Colour
        React.createElement('div', { className: 'mobile-field-group' },
          React.createElement('span', { className: 'mobile-field-label' }, 'Colour'),
          React.createElement('div', { className: 'colour-picker' },
            MM.PALETTE.map(c =>
              React.createElement('button', {
                key: c,
                onClick: () => upd({ color: c }),
                style: {
                  width: 28, height: 28, borderRadius: '50%',
                  background: c,
                  border: draft.color === c ? '3px solid var(--ink)' : '2px solid var(--line-2)',
                  cursor: 'pointer', padding: 0, flexShrink: 0
                },
                'aria-label': 'Colour ' + c
              })
            )
          )
        ),
        // Delete (existing runners only)
        isExisting && React.createElement('button', {
          className: 'mobile-drawer-delete',
          onClick: () => onDelete(runner.id)
        }, 'Remove runner')
      )
    )
  );
}

window.MobileEditDrawer = MobileEditDrawer;
